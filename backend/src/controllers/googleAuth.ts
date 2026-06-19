import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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

    const client = await pool.connect();

    try {
      // Check if user already exists with this Google ID
      let result = await client.query(
        "SELECT * FROM users WHERE google_id = $1",
        [googleUser.googleId],
      );

      let user;

      if (result.rows.length > 0) {
        // Existing Google user — log them in
        user = result.rows[0];
      } else {
        // Check if a user exists with the same email
        result = await client.query("SELECT * FROM users WHERE email = $1", [
          googleUser.email,
        ]);

        if (result.rows.length > 0) {
          // Link Google account to existing user
          user = result.rows[0];
          await client.query(
            "UPDATE users SET google_id = $1, avatar_url = $2 WHERE id = $3",
            [googleUser.googleId, googleUser.picture, user.id],
          );
          user.google_id = googleUser.googleId;
          user.avatar_url = googleUser.picture;
        } else {
          // Create new user
          const username = googleUser.name.replace(/\s+/g, "_").toLowerCase();

          // Ensure unique username
          let finalUsername = username;
          let counter = 1;
          while (true) {
            const existing = await client.query(
              "SELECT id FROM users WHERE username = $1",
              [finalUsername],
            );
            if (existing.rows.length === 0) break;
            finalUsername = `${username}_${counter}`;
            counter++;
          }

          const newUser = await client.query(
            `INSERT INTO users (username, email, google_id, avatar_url, auth_provider, role) 
             VALUES ($1, $2, $3, $4, 'google', 'user') 
             RETURNING id, username, email, role, avatar_url`,
            [
              finalUsername,
              googleUser.email,
              googleUser.googleId,
              googleUser.picture,
            ],
          );
          user = newUser.rows[0];
        }
      }

      // Generate JWT
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      res.json({
        message: "Google authentication successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url,
        },
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("Google Auth Error:", error);
    res.status(401).json({
      message: error.message || "Google authentication failed",
    });
  }
};
