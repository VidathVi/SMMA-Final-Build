import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  connectPlatform,
  getConnections,
  getConnectionStatus,
  disconnectPlatform,
  deactivatePlatform,
  refreshToken,
} from "../controllers/socialTokenController";

const router = express.Router();

// All social-token routes require authentication
router.use(authMiddleware);

// POST   /api/social-tokens/connect       — Connect / update a platform
router.post("/connect", connectPlatform);

// GET    /api/social-tokens               — List all connected platforms
router.get("/", getConnections);

// GET    /api/social-tokens/:platform      — Check a specific platform connection
router.get("/:platform", getConnectionStatus);

// DELETE /api/social-tokens/:platform      — Fully disconnect a platform
router.delete("/:platform", disconnectPlatform);

// PATCH  /api/social-tokens/:platform/deactivate — Soft-disconnect
router.patch("/:platform/deactivate", deactivatePlatform);

// POST   /api/social-tokens/:platform/refresh    — Refresh token
router.post("/:platform/refresh", refreshToken);

export default router;
