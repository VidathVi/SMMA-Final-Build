import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prisma } from "../lib/prisma";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "orean360_super_secret_key";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Verify Google ID token by calling Google's tokeninfo endpoint
async function verifyGoogleToken(idToken: string) {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
  );

  if (!response.ok) {
    throw new Error("Invalid Google token");
  }

  const payload = await response.json();

  // Verify the token was issued for our app
  if (payload.aud !== GOOGLE_CLIENT_ID) {
    throw new Error("Token was not issued for this application");
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name || payload.email?.split("@")[0],
    picture: payload.picture,
  };
}

export const googleAuth = async (req: Request, res: Response) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: "Google credential is required" });
  }

  try {
    // Verify the Google token
    const googleUser = await verifyGoogleToken(credential);

    // Check if user already exists with this Google ID
    let user = await prisma.user.findUnique({
      where: { googleId: googleUser.googleId },
    });

    if (!user) {
      // Check if a user exists with the same email
      user = await prisma.user.findUnique({
        where: { email: googleUser.email },
      });

      if (user) {
        // Link Google account to existing user
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: googleUser.googleId,
            avatarUrl: googleUser.picture,
          },
        });
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            email: googleUser.email,
            name: googleUser.name,
            googleId: googleUser.googleId,
            avatarUrl: googleUser.picture,
            auth_provider: "google",
          },
        });
      }
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.roleId,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      message: "Google authentication successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roleId,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error: any) {
    console.error("Google Auth Error:", error);
    res.status(401).json({
      message: error.message || "Google authentication failed",
    });
  }
};
