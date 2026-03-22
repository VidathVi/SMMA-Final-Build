import { Request, Response } from "express";
import axios from "axios";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const META_REDIRECT_URI = process.env.META_REDIRECT_URI || "http://localhost:8080/api/meta/callback";

const META_SCOPES = [
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_posts",
  "instagram_basic",
  "instagram_manage_insights",
  "instagram_content_publish",
].join(",");

const GRAPH_API_BASE = "https://graph.facebook.com/v19.0";

// Generate Meta (Facebook) OAuth URL
export const getMetaAuthUrl = (req: any, res: Response) => {
  try {
    const state = JSON.stringify({ userId: req.user.id });
    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(META_REDIRECT_URI)}&scope=${encodeURIComponent(META_SCOPES)}&state=${encodeURIComponent(state)}&response_type=code`;

    res.json({ authUrl });
  } catch (error: any) {
    console.error("Meta Auth URL Error:", error);
    res.status(500).json({ message: "Failed to generate auth URL" });
  }
};

// Handle Meta OAuth callback
export const metaCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ message: "Missing code or state parameter" });
  }

  try {
    const { userId } = JSON.parse(state as string);

    // Exchange code for short-lived token
    const tokenResponse = await axios.get(`${GRAPH_API_BASE}/oauth/access_token`, {
      params: {
        client_id: META_APP_ID,
        client_secret: META_APP_SECRET,
        redirect_uri: META_REDIRECT_URI,
        code,
      },
    });

    const shortLivedToken = tokenResponse.data.access_token;

    // Exchange for long-lived token
    const longLivedResponse = await axios.get(`${GRAPH_API_BASE}/oauth/access_token`, {
      params: {
        grant_type: "fb_exchange_token",
        client_id: META_APP_ID,
        client_secret: META_APP_SECRET,
        fb_exchange_token: shortLivedToken,
      },
    });

    const longLivedToken = longLivedResponse.data.access_token;
    const expiresIn = longLivedResponse.data.expires_in; // ~60 days

    // Get user profile
    const profileResponse = await axios.get(`${GRAPH_API_BASE}/me`, {
      params: {
        access_token: longLivedToken,
        fields: "id,name,email",
      },
    });

    const profile = profileResponse.data;

    // Store tokens in database
    const client = await pool.connect();
    try {
      const tokenExpiry = new Date(Date.now() + (expiresIn || 5184000) * 1000);

      await client.query(
        `INSERT INTO social_tokens (user_id, platform, access_token, token_expiry, platform_user_id, platform_username, scopes)
         VALUES ($1, 'facebook', $2, $3, $4, $5, $6)
         ON CONFLICT (user_id, platform)
         DO UPDATE SET access_token = $2, token_expiry = $3, platform_user_id = $4, platform_username = $5, scopes = $6, updated_at = CURRENT_TIMESTAMP`,
        [userId, longLivedToken, tokenExpiry, profile.id, profile.name, META_SCOPES]
      );

      // Update social_connections
      await client.query(
        `INSERT INTO social_connections (user_id, platform, platform_username, profile_url)
         VALUES ($1, 'facebook', $2, $3)
         ON CONFLICT (user_id, platform)
         DO UPDATE SET platform_username = $2, profile_url = $3, connected_at = CURRENT_TIMESTAMP`,
        [userId, profile.name, `https://facebook.com/${profile.id}`]
      );
    } finally {
      client.release();
    }

    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard/settings?connected=facebook`);
  } catch (error: any) {
    console.error("Meta Callback Error:", error.response?.data || error);
    res.status(500).json({ message: "Failed to complete Meta authentication" });
  }
};

// Helper to get Meta access token for a user
async function getMetaToken(userId: number): Promise<string> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT access_token FROM social_tokens WHERE user_id = $1 AND platform = 'facebook'",
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error("Facebook not connected");
    }

    return result.rows[0].access_token;
  } finally {
    client.release();
  }
}

// Get user's Facebook pages
export const getMetaPages = async (req: any, res: Response) => {
  try {
    const accessToken = await getMetaToken(req.user.id);

    const response = await axios.get(`${GRAPH_API_BASE}/me/accounts`, {
      params: {
        access_token: accessToken,
        fields: "id,name,category,fan_count,picture,access_token",
      },
    });

    res.json({ pages: response.data.data || [] });
  } catch (error: any) {
    console.error("Meta Pages Error:", error.response?.data || error);
    if (error.message === "Facebook not connected") {
      return res.status(404).json({ message: "Facebook account not connected" });
    }
    res.status(500).json({ message: "Failed to fetch pages" });
  }
};

// Get posts from a Facebook page
export const getMetaPagePosts = async (req: any, res: Response) => {
  const { pageId } = req.params;

  try {
    const accessToken = await getMetaToken(req.user.id);

    const response = await axios.get(`${GRAPH_API_BASE}/${pageId}/posts`, {
      params: {
        access_token: accessToken,
        fields: "id,message,created_time,full_picture,permalink_url,shares,likes.summary(true),comments.summary(true)",
        limit: req.query.limit || 10,
      },
    });

    res.json({ posts: response.data.data || [] });
  } catch (error: any) {
    console.error("Meta Page Posts Error:", error.response?.data || error);
    res.status(500).json({ message: "Failed to fetch page posts" });
  }
};

// Get connected Instagram business account
export const getInstagramAccount = async (req: any, res: Response) => {
  try {
    const accessToken = await getMetaToken(req.user.id);

    // First get pages
    const pagesResponse = await axios.get(`${GRAPH_API_BASE}/me/accounts`, {
      params: {
        access_token: accessToken,
        fields: "id,name,instagram_business_account",
      },
    });

    const pages = pagesResponse.data.data || [];
    const instagramAccounts = [];

    for (const page of pages) {
      if (page.instagram_business_account) {
        const igResponse = await axios.get(
          `${GRAPH_API_BASE}/${page.instagram_business_account.id}`,
          {
            params: {
              access_token: accessToken,
              fields: "id,username,name,profile_picture_url,followers_count,follows_count,media_count,biography",
            },
          }
        );
        instagramAccounts.push({
          ...igResponse.data,
          linked_page: { id: page.id, name: page.name },
        });
      }
    }

    res.json({ instagramAccounts });
  } catch (error: any) {
    console.error("Instagram Account Error:", error.response?.data || error);
    if (error.message === "Facebook not connected") {
      return res.status(404).json({ message: "Facebook account not connected" });
    }
    res.status(500).json({ message: "Failed to fetch Instagram account" });
  }
};

// Get Instagram media
export const getInstagramMedia = async (req: any, res: Response) => {
  try {
    const accessToken = await getMetaToken(req.user.id);
    const igAccountId = req.query.accountId;

    if (!igAccountId) {
      return res.status(400).json({ message: "Instagram account ID required" });
    }

    const response = await axios.get(`${GRAPH_API_BASE}/${igAccountId}/media`, {
      params: {
        access_token: accessToken,
        fields: "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count",
        limit: req.query.limit || 12,
      },
    });

    res.json({ media: response.data.data || [] });
  } catch (error: any) {
    console.error("Instagram Media Error:", error.response?.data || error);
    res.status(500).json({ message: "Failed to fetch Instagram media" });
  }
};

// Get page insights
export const getMetaInsights = async (req: any, res: Response) => {
  const { pageId } = req.params;

  try {
    const accessToken = await getMetaToken(req.user.id);

    // Get page access token for insights
    const pagesResponse = await axios.get(`${GRAPH_API_BASE}/me/accounts`, {
      params: {
        access_token: accessToken,
        fields: "id,access_token",
      },
    });

    const page = pagesResponse.data.data?.find((p: any) => p.id === pageId);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    const response = await axios.get(`${GRAPH_API_BASE}/${pageId}/insights`, {
      params: {
        access_token: page.access_token,
        metric: "page_engaged_users,page_impressions,page_fans,page_views_total",
        period: "day",
        date_preset: "last_30d",
      },
    });

    res.json({ insights: response.data.data || [] });
  } catch (error: any) {
    console.error("Meta Insights Error:", error.response?.data || error);
    res.status(500).json({ message: "Failed to fetch insights" });
  }
};

// Disconnect Meta account
export const disconnectMeta = async (req: any, res: Response) => {
  try {
    const client = await pool.connect();
    try {
      await client.query(
        "DELETE FROM social_tokens WHERE user_id = $1 AND platform = 'facebook'",
        [req.user.id]
      );
      await client.query(
        "DELETE FROM social_connections WHERE user_id = $1 AND platform IN ('facebook', 'instagram')",
        [req.user.id]
      );
    } finally {
      client.release();
    }

    res.json({ message: "Meta account disconnected successfully" });
  } catch (error: any) {
    console.error("Meta Disconnect Error:", error);
    res.status(500).json({ message: "Failed to disconnect Meta" });
  }
};
