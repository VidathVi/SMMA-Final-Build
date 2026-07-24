import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { sendVerificationEmail } from "../utils/email";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "orean360_super_secret_key";

// JWT Auth Middleware
export const authMiddleware = (req: any, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const sendVerificationCode = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store code
    await prisma.verificationCode.deleteMany({ where: { email } });
    await prisma.verificationCode.create({
      data: { email, code, expiresAt },
    });

    // Send email
    const sent = await sendVerificationEmail(email, code);
    if (!sent) {
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    res.json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Send Code Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, code } = req.body;

  if (!email || !password || !code) {
    return res.status(400).json({ message: "Email, password, and verification code required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Verify code
    const verification = await prisma.verificationCode.findFirst({
      where: { email, code },
    });

    if (!verification) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (verification.expiresAt < new Date()) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Get a default role if exists, otherwise create or just omit (schema has roleId as optional now?)
    // Wait, the previous schema had roleId optional. Let's create user.
    const newUser = await prisma.user.create({
      data: {
        email,
        password_hash: hash,
        auth_provider: "local",
      },
    });

    // Clean up used code
    await prisma.verificationCode.deleteMany({ where: { email } });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If user signed up with Google, they can't use password login
    if (user.auth_provider === "google" && !user.password_hash) {
      return res.status(401).json({
        message:
          "This account uses Google sign-in. Please use 'Continue with Google' instead.",
      });
    }

    if (!user.password_hash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.roleId,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.roleId,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Social Connections
export const getSocialConnections = async (req: any, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT id, platform, platform_username, profile_url, connected_at FROM social_connections WHERE user_id = $1 ORDER BY platform",
      [req.user.id],
    );
    client.release();

    res.json({ connections: result.rows });
  } catch (error) {
    console.error("Get Social Connections Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const connectSocial = async (req: any, res: Response) => {
  const { platform, platform_username, profile_url } = req.body;

  const validPlatforms = [
    "instagram",
    "facebook",
    "twitter",
    "linkedin",
    "youtube",
    "tiktok",
  ];
  if (!platform || !validPlatforms.includes(platform)) {
    return res.status(400).json({ message: "Invalid platform" });
  }

  if (!platform_username) {
    return res.status(400).json({ message: "Platform username is required" });
  }

  try {
    const client = await pool.connect();

    // Upsert: insert or update if exists
    const result = await client.query(
      `INSERT INTO social_connections (user_id, platform, platform_username, profile_url) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (user_id, platform) 
       DO UPDATE SET platform_username = $3, profile_url = $4, connected_at = CURRENT_TIMESTAMP
       RETURNING id, platform, platform_username, profile_url, connected_at`,
      [req.user.id, platform, platform_username, profile_url || null],
    );

    client.release();

    res.json({
      message: `${platform} connected successfully`,
      connection: result.rows[0],
    });
  } catch (error) {
    console.error("Connect Social Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const disconnectSocial = async (req: any, res: Response) => {
  const { platform } = req.params;

  try {
    const client = await pool.connect();
    await client.query(
      "DELETE FROM social_connections WHERE user_id = $1 AND platform = $2",
      [req.user.id, platform],
    );
    client.release();

    res.json({ message: `${platform} disconnected successfully` });
  } catch (error) {
    console.error("Disconnect Social Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
