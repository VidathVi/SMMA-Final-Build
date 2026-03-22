import { Request, Response } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    [key: string]: any;
  };
}
import axios from "axios";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI || "http://localhost:8080/api/linkedin/callback";

const LINKEDIN_SCOPES = ["openid", "profile", "email", "w_member_social"].join(" ");

// Generate LinkedIn OAuth2 URL
export const getLinkedInAuthUrl = (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const state = JSON.stringify({ userId });
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}&scope=${encodeURIComponent(LINKEDIN_SCOPES)}&state=${encodeURIComponent(state)}`;

    res.json({ authUrl });
  } catch (error: any) {
    console.error("LinkedIn Auth URL Error:", error);
    res.status(500).json({ message: "Failed to generate auth URL" });
  }
};

// Handle LinkedIn OAuth callback
export const linkedinCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ message: "Missing code or state parameter" });
  }

  try {
    const { userId } = JSON.parse(state as string);

    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: LINKEDIN_REDIRECT_URI,
        client_id: LINKEDIN_CLIENT_ID || "",
        client_secret: LINKEDIN_CLIENT_SECRET || "",
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token, expires_in, refresh_token, refresh_token_expires_in } = tokenResponse.data;

    // Get user profile using OpenID userinfo endpoint
    const profileResponse = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const profile = profileResponse.data;
    const displayName = profile.name || `${profile.given_name || ""} ${profile.family_name || ""}`.trim();
    const platformUserId = profile.sub;

    // Store tokens in database
    const client = await pool.connect();
    try {
      const tokenExpiry = new Date(Date.now() + (expires_in || 5184000) * 1000);

      await client.query(
        `INSERT INTO social_tokens (user_id, platform, access_token, refresh_token, token_expiry, platform_user_id, platform_username, scopes)
         VALUES ($1, 'linkedin', $2, $3, $4, $5, $6, $7)
         ON CONFLICT (user_id, platform)
         DO UPDATE SET access_token = $2, refresh_token = $3, token_expiry = $4, platform_user_id = $5, platform_username = $6, scopes = $7, updated_at = CURRENT_TIMESTAMP`,
        [userId, access_token, refresh_token || null, tokenExpiry, platformUserId, displayName, LINKEDIN_SCOPES]
      );

      // Update social_connections
      await client.query(
        `INSERT INTO social_connections (user_id, platform, platform_username, profile_url)
         VALUES ($1, 'linkedin', $2, $3)
         ON CONFLICT (user_id, platform)
         DO UPDATE SET platform_username = $2, profile_url = $3, connected_at = CURRENT_TIMESTAMP`,
        [userId, displayName, `https://linkedin.com/in/${platformUserId}`]
      );
    } finally {
      client.release();
    }

    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard/settings?connected=linkedin`);
  } catch (error: any) {
    console.error("LinkedIn Callback Error:", error.response?.data || error);
    res.status(500).json({ message: "Failed to complete LinkedIn authentication" });
  }
};

// Helper to get LinkedIn access token
async function getLinkedInToken(userId: number): Promise<{ accessToken: string; platformUserId: string }> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT access_token, platform_user_id FROM social_tokens WHERE user_id = $1 AND platform = 'linkedin'",
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error("LinkedIn not connected");
    }

    return {
      accessToken: result.rows[0].access_token,
      platformUserId: result.rows[0].platform_user_id,
    };
  } finally {
    client.release();
  }
}

// Get LinkedIn profile
export const getLinkedInProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { accessToken } = await getLinkedInToken(userId);

    const response = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    res.json({ profile: response.data });
  } catch (error: any) {
    console.error("LinkedIn Profile Error:", error.response?.data || error);
    if (error.message === "LinkedIn not connected") {
      return res.status(404).json({ message: "LinkedIn account not connected" });
    }
    res.status(500).json({ message: "Failed to fetch LinkedIn profile" });
  }
};

// Get LinkedIn posts (shares)
export const getLinkedInPosts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { accessToken, platformUserId } = await getLinkedInToken(userId);

    const response = await axios.get("https://api.linkedin.com/v2/posts", {
      params: {
        author: `urn:li:person:${platformUserId}`,
        q: "author",
        count: req.query.limit || 10,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202401",
      },
    });

    res.json({ posts: response.data.elements || [] });
  } catch (error: any) {
    console.error("LinkedIn Posts Error:", error.response?.data || error);
    if (error.message === "LinkedIn not connected") {
      return res.status(404).json({ message: "LinkedIn account not connected" });
    }
    res.status(500).json({ message: "Failed to fetch LinkedIn posts" });
  }
};

// Create LinkedIn post
export const createLinkedInPost = async (req: AuthRequest, res: Response) => {
  const { text, visibility } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Post text is required" });
  }

  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { accessToken, platformUserId } = await getLinkedInToken(userId);

    const response = await axios.post(
      "https://api.linkedin.com/v2/posts",
      {
        author: `urn:li:person:${platformUserId}`,
        commentary: text,
        visibility: visibility || "PUBLIC",
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "LinkedIn-Version": "202401",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      }
    );

    res.json({
      message: "Post created successfully",
      postId: response.headers["x-restli-id"] || response.data.id,
    });
  } catch (error: any) {
    console.error("LinkedIn Create Post Error:", error.response?.data || error);
    if (error.message === "LinkedIn not connected") {
      return res.status(404).json({ message: "LinkedIn account not connected" });
    }
    res.status(500).json({ message: "Failed to create LinkedIn post" });
  }
};

// Disconnect LinkedIn
export const disconnectLinkedIn = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const client = await pool.connect();
    try {
      await client.query(
        "DELETE FROM social_tokens WHERE user_id = $1 AND platform = 'linkedin'",
        [userId]
      );
      await client.query(
        "DELETE FROM social_connections WHERE user_id = $1 AND platform = 'linkedin'",
        [userId]
      );
    } finally {
      client.release();
    }

    res.json({ message: "LinkedIn disconnected successfully" });
  } catch (error: any) {
    console.error("LinkedIn Disconnect Error:", error);
    res.status(500).json({ message: "Failed to disconnect LinkedIn" });
  }
};
