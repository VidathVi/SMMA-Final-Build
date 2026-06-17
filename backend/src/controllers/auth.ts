import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const client = await pool.connect();
    
    // Check if user exists
    const existing = await client.query("SELECT * FROM users WHERE username = $1", [username]);
    if (existing.rows.length > 0) {
      client.release();
      return res.status(409).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await client.query(
      "INSERT INTO users (username, password_hash, auth_provider) VALUES ($1, $2, 'local') RETURNING id, username, role",
      [username, hash]
    );
    
    client.release();

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users WHERE username = $1", [username]);
    client.release();

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // If user signed up with Google, they can't use password login
    if (user.auth_provider === "google" && !user.password_hash) {
      return res.status(401).json({ 
        message: "This account uses Google sign-in. Please use 'Continue with Google' instead." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
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
      [req.user.id]
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

  const validPlatforms = ["instagram", "facebook", "twitter", "linkedin", "youtube", "tiktok"];
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
      [req.user.id, platform, platform_username, profile_url || null]
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
      [req.user.id, platform]
    );
    client.release();

    res.json({ message: `${platform} disconnected successfully` });
  } catch (error) {
    console.error("Disconnect Social Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
