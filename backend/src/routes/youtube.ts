import { Router } from "express";
import { authMiddleware } from "../controllers/auth";
import {
  getYouTubeAuthUrl,
  youtubeCallback,
  getYouTubeChannels,
  getYouTubeVideos,
  getYouTubeAnalytics,
  disconnectYouTube,
} from "../controllers/youtube";

const router = Router();

// OAuth flow
router.get("/auth", authMiddleware as any, getYouTubeAuthUrl as any);
router.get("/callback", youtubeCallback as any);

// Protected API endpoints
router.get("/channels", authMiddleware as any, getYouTubeChannels as any);
router.get("/videos", authMiddleware as any, getYouTubeVideos as any);
router.get("/analytics", authMiddleware as any, getYouTubeAnalytics as any);

// Disconnect
router.delete("/disconnect", authMiddleware as any, disconnectYouTube as any);

export default router;
