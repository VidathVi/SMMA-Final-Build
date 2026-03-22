import { Request, Response } from "express";
import axios from "axios";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const TIKTOK_REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI || "http://localhost:8080/api/tiktok/callback";

const TIKTOK_SCOPES = "user.info.basic,video.list";

// Generate TikTok OAuth URL (Login Kit)
export const getTikTokAuthUrl = (req: any, res: Response) => {
  try {
    const state = JSON.stringify({ userId: req.user.id });
    const csrfState = Buffer.from(state).toString("base64");

    const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${TIKTOK_CLIENT_KEY}&scope=${encodeURIComponent(TIKTOK_SCOPES)}&response_type=code&redirect_uri=${encodeURIComponent(TIKTOK_REDIRECT_URI)}&state=${encodeURIComponent(csrfState)}`;

    res.json({ authUrl });
  } catch (error: any) {
    console.error("TikTok Auth URL Error:", error);
    res.status(500).json({ message: "Failed to generate TikTok auth URL" });
  }
};

// Handle TikTok OAuth callback
export const tiktokCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ message: "Missing code or state parameter" });
  }

  try {
    const decodedState = Buffer.from(state as string, "base64").toString("utf-8");
    const { userId } = JSON.parse(decodedState);

    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://open.tiktokapis.com/v2/oauth/token/",
      new URLSearchParams({
        client_key: TIKTOK_CLIENT_KEY || "",
        client_secret: TIKTOK_CLIENT_SECRET || "",
        code: code as string,
        grant_type: "authorization_code",
        redirect_uri: TIKTOK_REDIRECT_URI,
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const {
      access_token,
      refresh_token,
      expires_in,
      open_id,
      token_type,
    } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get(
      "https://open.tiktokapis.com/v2/user/info/",
      {
        params: {
          fields: "open_id,union_id,avatar_url,display_name,username,follower_count,following_count,likes_count,video_count",
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userInfo = userResponse.data.data?.user || {};
    const displayName = userInfo.display_name || userInfo.username || "Unknown";
    const username = userInfo.username || open_id;

    // Store tokens in database
    const client = await pool.connect();
    try {
      const tokenExpiry = new Date(Date.now() + (expires_in || 86400) * 1000);

      await client.query(
        `INSERT INTO social_tokens (user_id, platform, access_token, refresh_token, token_expiry, platform_user_id, platform_username, scopes)
         VALUES ($1, 'tiktok', $2, $3, $4, $5, $6, $7)
         ON CONFLICT (user_id, platform)
         DO UPDATE SET access_token = $2, refresh_token = $3, token_expiry = $4, platform_user_id = $5, platform_username = $6, scopes = $7, updated_at = CURRENT_TIMESTAMP`,
        [userId, access_token, refresh_token || null, tokenExpiry, open_id, displayName, TIKTOK_SCOPES]
      );

      // Update social_connections
      await client.query(
        `INSERT INTO social_connections (user_id, platform, platform_username, profile_url)
         VALUES ($1, 'tiktok', $2, $3)
         ON CONFLICT (user_id, platform)
         DO UPDATE SET platform_username = $2, profile_url = $3, connected_at = CURRENT_TIMESTAMP`,
        [userId, displayName, username ? `https://tiktok.com/@${username}` : ""]
      );
    } finally {
      client.release();
    }

    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard/settings?connected=tiktok`);
  } catch (error: any) {
    console.error("TikTok Callback Error:", error.response?.data || error);
    res.status(500).json({ message: "Failed to complete TikTok authentication" });
  }
};

// Helper to get TikTok access token and refresh if needed
async function getTikTokToken(userId: number): Promise<string> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT access_token, refresh_token, token_expiry FROM social_tokens WHERE user_id = $1 AND platform = 'tiktok'",
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error("TikTok not connected");
    }

    const { access_token, refresh_token, token_expiry } = result.rows[0];

    // Check if token is expired
    if (token_expiry && new Date(token_expiry) < new Date() && refresh_token) {
      // Refresh token
      const refreshResponse = await axios.post(
        "https://open.tiktokapis.com/v2/oauth/token/",
        new URLSearchParams({
          client_key: TIKTOK_CLIENT_KEY || "",
          client_secret: TIKTOK_CLIENT_SECRET || "",
          grant_type: "refresh_token",
          refresh_token,
        }).toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const newToken = refreshResponse.data;
      const newExpiry = new Date(Date.now() + (newToken.expires_in || 86400) * 1000);

      await client.query(
        `UPDATE social_tokens SET access_token = $1, refresh_token = $2, token_expiry = $3, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $4 AND platform = 'tiktok'`,
        [newToken.access_token, newToken.refresh_token || refresh_token, newExpiry, userId]
      );

      return newToken.access_token;
    }

    return access_token;
  } finally {
    client.release();
  }
}

// Get TikTok user info
export const getTikTokUserInfo = async (req: any, res: Response) => {
  try {
    const accessToken = await getTikTokToken(req.user.id);

    const response = await axios.get(
      "https://open.tiktokapis.com/v2/user/info/",
      {
        params: {
          fields: "open_id,union_id,avatar_url,display_name,username,bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json({ user: response.data.data?.user || {} });
  } catch (error: any) {
    console.error("TikTok User Info Error:", error.response?.data || error);
    if (error.message === "TikTok not connected") {
      return res.status(404).json({ message: "TikTok account not connected" });
    }
    res.status(500).json({ message: "Failed to fetch TikTok user info" });
  }
};

// Get TikTok videos
export const getTikTokVideos = async (req: any, res: Response) => {
  try {
    const accessToken = await getTikTokToken(req.user.id);
    const maxCount = parseInt(req.query.limit as string) || 10;
    const cursor = req.query.cursor;

    const requestBody: any = {
      max_count: maxCount,
    };

    if (cursor) {
      requestBody.cursor = parseInt(cursor as string);
    }

    const response = await axios.post(
      "https://open.tiktokapis.com/v2/video/list/",
      requestBody,
      {
        params: {
          fields: "id,title,video_description,duration,cover_image_url,embed_link,create_time,like_count,comment_count,share_count,view_count",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      videos: response.data.data?.videos || [],
      cursor: response.data.data?.cursor,
      hasMore: response.data.data?.has_more,
    });
  } catch (error: any) {
    console.error("TikTok Videos Error:", error.response?.data || error);
    if (error.message === "TikTok not connected") {
      return res.status(404).json({ message: "TikTok account not connected" });
    }
    res.status(500).json({ message: "Failed to fetch TikTok videos" });
  }
};

// Disconnect TikTok
export const disconnectTikTok = async (req: any, res: Response) => {
  try {
    // Revoke token
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT access_token FROM social_tokens WHERE user_id = $1 AND platform = 'tiktok'",
        [req.user.id]
      );

      if (result.rows.length > 0) {
        // Try to revoke the token
        try {
          await axios.post(
            "https://open.tiktokapis.com/v2/oauth/revoke/",
            new URLSearchParams({
              client_key: TIKTOK_CLIENT_KEY || "",
              client_secret: TIKTOK_CLIENT_SECRET || "",
              token: result.rows[0].access_token,
            }).toString(),
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
          );
        } catch (revokeError) {
          // Continue even if revocation fails
          console.warn("TikTok token revocation failed:", revokeError);
        }
      }

      await client.query(
        "DELETE FROM social_tokens WHERE user_id = $1 AND platform = 'tiktok'",
        [req.user.id]
      );
      await client.query(
        "DELETE FROM social_connections WHERE user_id = $1 AND platform = 'tiktok'",
        [req.user.id]
      );
    } finally {
      client.release();
    }

    res.json({ message: "TikTok disconnected successfully" });
  } catch (error: any) {
    console.error("TikTok Disconnect Error:", error);
    res.status(500).json({ message: "Failed to disconnect TikTok" });
  }
};
