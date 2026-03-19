import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "orean360_super_secret_key";

// REGISTER
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // check existing
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user via model
    const newUser = await createUser(
      name,
      email,
      hashedPassword,
      role || "user"
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error("Register Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// LOGIN
export const loginUser = async (req: Request, res: Response) => {
  console.log("LOGIN HIT");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    console.log("BEFORE QUERY");
    const user = await findUserByEmail(email);
    console.log("AFTER QUERY");
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};