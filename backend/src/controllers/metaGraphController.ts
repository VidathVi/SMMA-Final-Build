import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  upsertSocialToken,
  getTokenByPlatform,
  SocialPlatform,
} from "../models/socialTokenModel";
import {
  exchangeForLongLivedToken,
  refreshMetaToken,
  getMetaUserProfile,
  getMetaUserPages,
  publishToFacebookPage,
  publishVideoToFacebookPage,
  createInstagramMediaContainer,
  publishInstagramMedia,
  schedulePostToFacebookPage,
  getValidAccessToken,
} from "../services/metaGraph.service";

// ─── Meta OAuth Callback ────────────────────────────────────────────────
// After the user completes Meta OAuth on the frontend, send the short-lived
// token here. We exchange it for a long-lived token and store it encrypted.

export const metaOAuthCallback = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { accessToken, platform } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: "accessToken is required" });
    }

    const targetPlatform: SocialPlatform = platform || "facebook";
    if (targetPlatform !== "facebook" && targetPlatform !== "instagram") {
      return res
        .status(400)
        .json({ message: "Platform must be 'facebook' or 'instagram'" });
    }

    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;

    if (!appId || !appSecret) {
      return res.status(500).json({
        message: "Meta app credentials are not configured on the server",
      });
    }

    // Exchange short-lived token for a long-lived one
    const longLivedResult = await exchangeForLongLivedToken(
      accessToken,
      appId,
      appSecret
    );

    // Get user profile to store platform identifiers
    const profile = await getMetaUserProfile(longLivedResult.access_token);

    // Calculate expiry
    const expiresAt = longLivedResult.expires_in
      ? new Date(Date.now() + longLivedResult.expires_in * 1000)
      : null;

    // Store encrypted token
    const tokenRecord = await upsertSocialToken(
      userId,
      targetPlatform,
      longLivedResult.access_token,
      null, // Facebook long-lived tokens don't use refresh tokens
      expiresAt,
      profile.id,
      profile.name,
      "public_profile,email,pages_manage_posts,pages_read_engagement"
    );

    res.status(200).json({
      message: `Successfully connected to ${targetPlatform}`,
      connection: {
        id: tokenRecord.id,
        platform: tokenRecord.platform,
        platformUserId: profile.id,
        platformUsername: profile.name,
        isActive: tokenRecord.is_active,
        tokenExpiresAt: expiresAt?.toISOString() || null,
      },
    });
  } catch (error: any) {
    console.error("Meta OAuth Callback Error:", error);
    res.status(500).json({
      message: error.message || "Failed to connect Meta account",
    });
  }
};

// ─── Refresh Meta Token ─────────────────────────────────────────────────

export const refreshMetaPlatformToken = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { platform } = req.params;

    if (platform !== "facebook" && platform !== "instagram") {
      return res
        .status(400)
        .json({ message: "Platform must be 'facebook' or 'instagram'" });
    }

    const refreshed = await refreshMetaToken(
      userId,
      platform as SocialPlatform
    );

    res.json({
      message: `${platform} token refreshed successfully`,
      tokenExpiresAt: refreshed.expiresAt?.toISOString() || null,
    });
  } catch (error: any) {
    console.error("Meta Token Refresh Error:", error);
    res.status(500).json({
      message: error.message || "Failed to refresh Meta token",
    });
  }
};

// ─── Get Facebook Pages ─────────────────────────────────────────────────

export const getFacebookPages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const accessToken = await getValidAccessToken(userId, "facebook");
    const pages = await getMetaUserPages(accessToken);

    res.json({
      pages: pages.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
      })),
    });
  } catch (error: any) {
    console.error("Get Facebook Pages Error:", error);
    res.status(500).json({
      message: error.message || "Failed to get Facebook pages",
    });
  }
};

// ─── Publish to Facebook ────────────────────────────────────────────────

export const publishToFacebook = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { pageId, message, mediaUrl, mediaType } = req.body;

    if (!pageId || !message) {
      return res
        .status(400)
        .json({ message: "pageId and message are required" });
    }

    // Get the user's access token, auto-refreshing if needed
    const userAccessToken = await getValidAccessToken(userId, "facebook");

    // Get page access token from user's pages
    const pages = await getMetaUserPages(userAccessToken);
    const targetPage = pages.find((p) => p.id === pageId);

    if (!targetPage) {
      return res.status(404).json({
        message: `Page ${pageId} not found. Make sure you have admin access.`,
      });
    }

    let result;
    if (mediaType === "video" && mediaUrl) {
      result = await publishVideoToFacebookPage(
        pageId,
        targetPage.access_token,
        mediaUrl,
        message
      );
    } else {
      result = await publishToFacebookPage(
        pageId,
        targetPage.access_token,
        message,
        mediaUrl
      );
    }

    res.status(201).json({
      message: "Published to Facebook successfully",
      postId: result.id || result.post_id,
    });
  } catch (error: any) {
    console.error("Facebook Publish Error:", error);
    res.status(500).json({
      message: error.message || "Failed to publish to Facebook",
    });
  }
};

// ─── Schedule a Facebook Post ───────────────────────────────────────────

export const scheduleToFacebook = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { pageId, message, scheduledTime, mediaUrl } = req.body;

    if (!pageId || !message || !scheduledTime) {
      return res.status(400).json({
        message: "pageId, message, and scheduledTime are required",
      });
    }

    // Validate scheduled time (must be 10 min to 6 months in the future)
    const scheduledDate = new Date(scheduledTime);
    const now = new Date();
    const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);
    const sixMonthsFromNow = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);

    if (scheduledDate < tenMinutesFromNow) {
      return res.status(400).json({
        message: "Scheduled time must be at least 10 minutes in the future",
      });
    }

    if (scheduledDate > sixMonthsFromNow) {
      return res.status(400).json({
        message: "Scheduled time cannot be more than 6 months in the future",
      });
    }

    // Get the user's access token
    const userAccessToken = await getValidAccessToken(userId, "facebook");

    // Get page access token
    const pages = await getMetaUserPages(userAccessToken);
    const targetPage = pages.find((p) => p.id === pageId);

    if (!targetPage) {
      return res.status(404).json({
        message: `Page ${pageId} not found. Make sure you have admin access.`,
      });
    }

    const scheduledTimestamp = Math.floor(scheduledDate.getTime() / 1000);

    const result = await schedulePostToFacebookPage(
      pageId,
      targetPage.access_token,
      message,
      scheduledTimestamp,
      mediaUrl
    );

    res.status(201).json({
      message: "Post scheduled on Facebook successfully",
      postId: result.id || result.post_id,
      scheduledTime: scheduledDate.toISOString(),
    });
  } catch (error: any) {
    console.error("Facebook Schedule Error:", error);
    res.status(500).json({
      message: error.message || "Failed to schedule Facebook post",
    });
  }
};

// ─── Publish to Instagram ───────────────────────────────────────────────

export const publishToInstagram = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { caption, imageUrl, videoUrl } = req.body;

    if (!caption || (!imageUrl && !videoUrl)) {
      return res.status(400).json({
        message: "caption and either imageUrl or videoUrl are required",
      });
    }

    // Get Instagram token
    const token = await getTokenByPlatform(userId, "instagram");
    if (!token) {
      return res.status(404).json({
        message: "Instagram account not connected",
      });
    }

    const igUserId = token.platform_user_id;
    if (!igUserId) {
      return res.status(400).json({
        message: "Instagram user ID not found. Please reconnect your account.",
      });
    }

    // Step 1: Create media container
    const containerId = await createInstagramMediaContainer(
      igUserId,
      token.access_token,
      { caption, imageUrl, videoUrl }
    );

    // For video, we need to wait for processing
    if (videoUrl) {
      // Wait a bit for video processing (in production, use webhooks)
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    // Step 2: Publish the container
    const result = await publishInstagramMedia(
      igUserId,
      token.access_token,
      containerId
    );

    res.status(201).json({
      message: "Published to Instagram successfully",
      postId: result.id,
    });
  } catch (error: any) {
    console.error("Instagram Publish Error:", error);
    res.status(500).json({
      message: error.message || "Failed to publish to Instagram",
    });
  }
};
