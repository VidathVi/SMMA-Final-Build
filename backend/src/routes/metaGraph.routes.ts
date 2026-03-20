import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  metaOAuthCallback,
  refreshMetaPlatformToken,
  getFacebookPages,
  publishToFacebook,
  scheduleToFacebook,
  publishToInstagram,
} from "../controllers/metaGraphController";

const router = express.Router();

// All Meta Graph API routes require authentication
router.use(authMiddleware);

// ─── OAuth ──────────────────────────────────────────────────────────────
// POST /api/meta/oauth/callback — Exchange short-lived token for long-lived
router.post("/oauth/callback", metaOAuthCallback);

// ─── Token Management ───────────────────────────────────────────────────
// POST /api/meta/:platform/refresh — Refresh an expiring Meta token
router.post("/:platform/refresh", refreshMetaPlatformToken);

// ─── Facebook ───────────────────────────────────────────────────────────
// GET  /api/meta/facebook/pages      — List user's Facebook pages
router.get("/facebook/pages", getFacebookPages);

// POST /api/meta/facebook/publish    — Publish to a Facebook page
router.post("/facebook/publish", publishToFacebook);

// POST /api/meta/facebook/schedule   — Schedule a post to a Facebook page
router.post("/facebook/schedule", scheduleToFacebook);

// ─── Instagram ──────────────────────────────────────────────────────────
// POST /api/meta/instagram/publish   — Publish to Instagram
router.post("/instagram/publish", publishToInstagram);

export default router;
