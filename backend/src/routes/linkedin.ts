import { Router } from "express";
import { authMiddleware } from "../controllers/auth";
import {
  getLinkedInAuthUrl,
  linkedinCallback,
  getLinkedInProfile,
  getLinkedInPosts,
  createLinkedInPost,
  disconnectLinkedIn,
} from "../controllers/linkedin";

const router = Router();

// OAuth flow
router.get("/auth", authMiddleware as any, getLinkedInAuthUrl as any);
router.get("/callback", linkedinCallback as any);

// Protected API endpoints
router.get("/profile", authMiddleware as any, getLinkedInProfile as any);
router.get("/posts", authMiddleware as any, getLinkedInPosts as any);
router.post("/posts", authMiddleware as any, createLinkedInPost as any);

// Disconnect
router.delete("/disconnect", authMiddleware as any, disconnectLinkedIn as any);

export default router;
