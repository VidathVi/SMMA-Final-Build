import { Router } from "express";
import { authMiddleware } from "../controllers/auth";
import {
  getMetaAuthUrl,
  metaCallback,
  getMetaPages,
  getMetaPagePosts,
  getInstagramAccount,
  getInstagramMedia,
  getMetaInsights,
  disconnectMeta,
} from "../controllers/meta";

const router = Router();

// OAuth flow
router.get("/auth", authMiddleware as any, getMetaAuthUrl as any);
router.get("/callback", metaCallback as any);

// Facebook Pages
router.get("/pages", authMiddleware as any, getMetaPages as any);
router.get(
  "/pages/:pageId/posts",
  authMiddleware as any,
  getMetaPagePosts as any,
);

// Instagram
router.get(
  "/instagram/account",
  authMiddleware as any,
  getInstagramAccount as any,
);
router.get("/instagram/media", authMiddleware as any, getInstagramMedia as any);

// Insights
router.get("/insights/:pageId", authMiddleware as any, getMetaInsights as any);

// Disconnect
router.delete("/disconnect", authMiddleware as any, disconnectMeta as any);

export default router;
