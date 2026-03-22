import { Request, Response } from "express";
import { google } from "googleapis";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const YOUTUBE_REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI || "http://localhost:8080/api/youtube/callback";

const oauth2Client = new google.auth.OAuth2(
  YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET,
  YOUTUBE_REDIRECT_URI
);

const YOUTUBE_SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/youtube.force-ssl",
  "https://www.googleapis.com/auth/yt-analytics.readonly",
];

// Generate YouTube OAuth2 consent URL
export const getYouTubeAuthUrl = (req: any, res: Response) => {
  try {
    const state = JSON.stringify({ userId: req.user.id });
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: YOUTUBE_SCOPES,
      state,
      prompt: "consent",
    });

    res.json({ authUrl });
  } catch (error: any) {
    console.error("YouTube Auth URL Error:", error);
    res.status(500).json({ message: "Failed to generate auth URL" });
  }
};

// Handle OAuth2 callback and exchange code for tokens
export const youtubeCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ message: "Missing code or state parameter" });
  }

  try {
    const { userId } = JSON.parse(state as string);
    const { tokens } = await oauth2Client.getToken(code as string);

    oauth2Client.setCredentials(tokens);

    // Get channel info
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const channelResponse = await youtube.channels.list({
      part: ["snippet", "statistics"],
      mine: true,
    });

    const channel = channelResponse.data.items?.[0];
    const platformUsername = channel?.snippet?.title || "Unknown";
    const platformUserId = channel?.id || "";

    // Store tokens in database
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO social_tokens (user_id, platform, access_token, refresh_token, token_expiry, platform_user_id, platform_username, scopes)
         VALUES ($1, 'youtube', $2, $3, $4, $5, $6, $7)
         ON CONFLICT (user_id, platform)
         DO UPDATE SET access_token = $2, refresh_token = $3, token_expiry = $4, platform_user_id = $5, platform_username = $6, scopes = $7, updated_at = CURRENT_TIMESTAMP`,
        [
          userId,
          tokens.access_token,
          tokens.refresh_token,
          tokens.expiry_date ? new Date(tokens.expiry_date) : null,
          platformUserId,
          platformUsername,
          YOUTUBE_SCOPES.join(","),
        ]
      );

      // Also update social_connections table
      await client.query(
        `INSERT INTO social_connections (user_id, platform, platform_username, profile_url)
         VALUES ($1, 'youtube', $2, $3)
         ON CONFLICT (user_id, platform)
         DO UPDATE SET platform_username = $2, profile_url = $3, connected_at = CURRENT_TIMESTAMP`,
        [userId, platformUsername, `https://youtube.com/channel/${platformUserId}`]
      );
    } finally {
      client.release();
    }

    // Redirect to frontend settings page
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard/settings?connected=youtube`);
  } catch (error: any) {
    console.error("YouTube Callback Error:", error);
    res.status(500).json({ message: "Failed to complete YouTube authentication" });
  }
};

// Helper to get authenticated YouTube client for a user
async function getAuthenticatedYouTube(userId: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT access_token, refresh_token, token_expiry FROM social_tokens WHERE user_id = $1 AND platform = 'youtube'",
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error("YouTube not connected");
    }

    const { access_token, refresh_token, token_expiry } = result.rows[0];

    const authClient = new google.auth.OAuth2(
      YOUTUBE_CLIENT_ID,
      YOUTUBE_CLIENT_SECRET,
      YOUTUBE_REDIRECT_URI
    );

    authClient.setCredentials({
      access_token,
      refresh_token,
      expiry_date: token_expiry ? new Date(token_expiry).getTime() : undefined,
    });

    // Handle token refresh
    authClient.on("tokens", async (tokens) => {
      const dbClient = await pool.connect();
      try {
        await dbClient.query(
          `UPDATE social_tokens SET access_token = $1, token_expiry = $2, updated_at = CURRENT_TIMESTAMP
           WHERE user_id = $3 AND platform = 'youtube'`,
          [tokens.access_token, tokens.expiry_date ? new Date(tokens.expiry_date) : null, userId]
        );
      } finally {
        dbClient.release();
      }
    });

    return google.youtube({ version: "v3", auth: authClient });
  } finally {
    client.release();
  }
}

// Get user's YouTube channels
export const getYouTubeChannels = async (req: any, res: Response) => {
  try {
    const youtube = await getAuthenticatedYouTube(req.user.id);
    const response = await youtube.channels.list({
      part: ["snippet", "statistics", "contentDetails"],
      mine: true,
    });

    res.json({ channels: response.data.items || [] });
  } catch (error: any) {
    console.error("YouTube Channels Error:", error);
    if (error.message === "YouTube not connected") {
      return res.status(404).json({ message: "YouTube account not connected" });
    }
    res.status(500).json({ message: "Failed to fetch channels" });
  }
};

// Get user's uploaded videos
export const getYouTubeVideos = async (req: any, res: Response) => {
  try {
    const youtube = await getAuthenticatedYouTube(req.user.id);
    const maxResults = parseInt(req.query.maxResults as string) || 10;

    // First get the uploads playlist ID
    const channelResponse = await youtube.channels.list({
      part: ["contentDetails"],
      mine: true,
    });

    const uploadsPlaylistId = channelResponse.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      return res.json({ videos: [] });
    }

    // Get videos from uploads playlist
    const playlistResponse = await youtube.playlistItems.list({
      part: ["snippet", "contentDetails"],
      playlistId: uploadsPlaylistId,
      maxResults,
    });

    const videoIds = playlistResponse.data.items?.map(
      (item) => item.contentDetails?.videoId
    ).filter(Boolean) as string[];

    if (!videoIds || videoIds.length === 0) {
      return res.json({ videos: [] });
    }

    // Get detailed video info with statistics
    const videosResponse = await youtube.videos.list({
      part: ["snippet", "statistics", "contentDetails"],
      id: videoIds,
    });

    res.json({
      videos: videosResponse.data.items || [],
      nextPageToken: playlistResponse.data.nextPageToken,
      totalResults: playlistResponse.data.pageInfo?.totalResults,
    });
  } catch (error: any) {
    console.error("YouTube Videos Error:", error);
    if (error.message === "YouTube not connected") {
      return res.status(404).json({ message: "YouTube account not connected" });
    }
    res.status(500).json({ message: "Failed to fetch videos" });
  }
};

// Get YouTube channel analytics
export const getYouTubeAnalytics = async (req: any, res: Response) => {
  try {
    const youtube = await getAuthenticatedYouTube(req.user.id);

    // Get channel statistics
    const channelResponse = await youtube.channels.list({
      part: ["statistics", "snippet"],
      mine: true,
    });

    const channel = channelResponse.data.items?.[0];

    if (!channel) {
      return res.status(404).json({ message: "No channel found" });
    }

    res.json({
      analytics: {
        channelTitle: channel.snippet?.title,
        subscriberCount: channel.statistics?.subscriberCount,
        viewCount: channel.statistics?.viewCount,
        videoCount: channel.statistics?.videoCount,
        hiddenSubscriberCount: channel.statistics?.hiddenSubscriberCount,
      },
    });
  } catch (error: any) {
    console.error("YouTube Analytics Error:", error);
    if (error.message === "YouTube not connected") {
      return res.status(404).json({ message: "YouTube account not connected" });
    }
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};

// Disconnect YouTube account
export const disconnectYouTube = async (req: any, res: Response) => {
  try {
    const client = await pool.connect();
    try {
      await client.query(
        "DELETE FROM social_tokens WHERE user_id = $1 AND platform = 'youtube'",
        [req.user.id]
      );
      await client.query(
        "DELETE FROM social_connections WHERE user_id = $1 AND platform = 'youtube'",
        [req.user.id]
      );
    } finally {
      client.release();
    }

    res.json({ message: "YouTube account disconnected successfully" });
  } catch (error: any) {
    console.error("YouTube Disconnect Error:", error);
    res.status(500).json({ message: "Failed to disconnect YouTube" });
  }
};
