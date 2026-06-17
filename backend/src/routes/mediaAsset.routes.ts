import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import upload from "../middleware/upload";
import {
  uploadMedia,
  getMyMedia,
  getMediaById,
  getMediaByCampaign,
  updateMedia,
  deleteMedia,
} from "../controllers/mediaAssetController";

const router = express.Router();

// All media routes require authentication
router.use(authMiddleware);

// POST   /api/media/upload                — Upload a media file
router.post("/upload", upload.single("file"), uploadMedia);

// GET    /api/media                       — List all media for current user (optional ?type=image|video|gif|document)
router.get("/", getMyMedia);

// GET    /api/media/:id                   — Get a specific media asset
router.get("/:id", getMediaById);

// GET    /api/media/campaign/:campaignId  — Get all media for a campaign
router.get("/campaign/:campaignId", getMediaByCampaign);

// PUT    /api/media/:id                   — Update media metadata
router.put("/:id", updateMedia);

// DELETE /api/media/:id                   — Delete a media asset
router.delete("/:id", deleteMedia);

export default router;
