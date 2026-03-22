import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  upsertSocialToken,
  getTokensByUserId,
  getTokenByPlatform,
  deactivateToken,
  deleteToken,
  refreshAccessToken,
  SocialPlatform,
} from "../models/socialTokenModel";

const VALID_PLATFORMS: SocialPlatform[] = [
  "facebook",
  "instagram",
  "twitter",
  "youtube",
  "tiktok",
  "linkedin",
];

// ─── Connect / update a social platform ─────────────────────────────────
export const connectPlatform = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { platform, accessToken, refreshToken, tokenExpiresAt, platformUserId, platformUsername, scopes } = req.body;

    if (!platform || !accessToken) {
      return res.status(400).json({
        message: "platform and accessToken are required",
      });
    }

    if (!VALID_PLATFORMS.includes(platform)) {
      return res.status(400).json({
        message: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(", ")}`,
      });
    }

    const token = await upsertSocialToken(
      userId,
      platform,
      accessToken,
      refreshToken || null,
      tokenExpiresAt ? new Date(tokenExpiresAt) : null,
      platformUserId || null,
      platformUsername || null,
      scopes || null
    );

    res.status(200).json({
      message: `Successfully connected to ${platform}`,
      connection: {
        id: token.id,
        platform: token.platform,
        platformUserId: token.platform_user_id,
        platformUsername: token.platform_username,
        isActive: token.is_active,
        connectedAt: token.updated_at,
      },
    });
  } catch (error: any) {
    console.error("Connect Platform Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── List all connected platforms for current user ──────────────────────
export const getConnections = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tokens = await getTokensByUserId(userId);

    res.json({
      connections: tokens.map((t) => ({
        id: t.id,
        platform: t.platform,
        platformUserId: t.platform_user_id,
        platformUsername: t.platform_username,
        isActive: t.is_active,
        tokenExpiresAt: t.token_expires_at,
        connectedAt: t.created_at,
        updatedAt: t.updated_at,
      })),
    });
  } catch (error: any) {
    console.error("Get Connections Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Get connection status for a specific platform ──────────────────────
export const getConnectionStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { platform } = req.params;

    if (!VALID_PLATFORMS.includes(platform as SocialPlatform)) {
      return res.status(400).json({
        message: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(", ")}`,
      });
    }

    const token = await getTokenByPlatform(userId, platform as SocialPlatform);

    if (!token) {
      return res.json({ connected: false, platform });
    }

    res.json({
      connected: true,
      platform: token.platform,
      platformUsername: token.platform_username,
      isActive: token.is_active,
      tokenExpiresAt: token.token_expires_at,
    });
  } catch (error: any) {
    console.error("Get Connection Status Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Disconnect a platform ──────────────────────────────────────────────
export const disconnectPlatform = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { platform } = req.params;

    if (!VALID_PLATFORMS.includes(platform as SocialPlatform)) {
      return res.status(400).json({
        message: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(", ")}`,
      });
    }

    const deleted = await deleteToken(userId, platform as SocialPlatform);

    if (!deleted) {
      return res.status(404).json({
        message: `No connection found for ${platform}`,
      });
    }

    res.json({ message: `Disconnected from ${platform}` });
  } catch (error: any) {
    console.error("Disconnect Platform Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Deactivate a platform (soft-disconnect) ────────────────────────────
export const deactivatePlatform = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { platform } = req.params;

    if (!VALID_PLATFORMS.includes(platform as SocialPlatform)) {
      return res.status(400).json({
        message: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(", ")}`,
      });
    }

    const token = await deactivateToken(userId, platform as SocialPlatform);

    if (!token) {
      return res.status(404).json({
        message: `No connection found for ${platform}`,
      });
    }

    res.json({ message: `${platform} connection deactivated` });
  } catch (error: any) {
    console.error("Deactivate Platform Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Refresh a platform token ───────────────────────────────────────────
export const refreshToken = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { platform } = req.params;
    const { accessToken, tokenExpiresAt } = req.body;

    if (!VALID_PLATFORMS.includes(platform as SocialPlatform)) {
      return res.status(400).json({
        message: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(", ")}`,
      });
    }

    // If no accessToken provided and it's a Meta platform, use Graph API refresh
    if (!accessToken && (platform === "facebook" || platform === "instagram")) {
      try {
        const { refreshMetaToken } = await import("../services/metaGraph.service");
        const refreshed = await refreshMetaToken(userId, platform as SocialPlatform);

        return res.json({
          message: `${platform} token refreshed via Meta Graph API`,
          tokenExpiresAt: refreshed.expiresAt?.toISOString() || null,
        });
      } catch (metaError: any) {
        return res.status(500).json({
          message: metaError.message || `Failed to refresh ${platform} token`,
        });
      }
    }

    if (!accessToken) {
      return res.status(400).json({ message: "accessToken is required" });
    }

    const token = await refreshAccessToken(
      userId,
      platform as SocialPlatform,
      accessToken,
      tokenExpiresAt ? new Date(tokenExpiresAt) : null
    );

    if (!token) {
      return res.status(404).json({
        message: `No connection found for ${platform}`,
      });
    }

    res.json({
      message: `${platform} token refreshed`,
      tokenExpiresAt: token.token_expires_at,
    });
  } catch (error: any) {
    console.error("Refresh Token Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

