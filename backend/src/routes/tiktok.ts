import { Router } from "express";
import { authMiddleware } from "../controllers/auth";
import {
  getTikTokAuthUrl,
  tiktokCallback,
  getTikTokUserInfo,
  getTikTokVideos,
  disconnectTikTok,
} from "../controllers/tiktok";

const router = Router();

// OAuth flow
router.get("/auth", authMiddleware as any, getTikTokAuthUrl as any);
router.get("/callback", tiktokCallback as any);

// Protected API endpoints
router.get("/user", authMiddleware as any, getTikTokUserInfo as any);
router.get("/videos", authMiddleware as any, getTikTokVideos as any);

// Disconnect
router.delete("/disconnect", authMiddleware as any, disconnectTikTok as any);

export default router;
