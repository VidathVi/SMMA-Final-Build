import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  createMediaAsset,
  getMediaAssetsByUserId,
  getMediaAssetById,
  getMediaAssetsByCampaignId,
  updateMediaAsset,
  deleteMediaAsset,
  MediaType,
} from "../models/mediaAssetModel";

const VALID_MEDIA_TYPES: MediaType[] = ["image", "video", "gif", "document"];

// ─── Helper: determine media type from MIME type ────────────────────────
const getMediaTypeFromMime = (mimeType: string): MediaType => {
  if (mimeType.startsWith("image/gif")) return "gif";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "document";
};

// ─── Upload a media asset ───────────────────────────────────────────────
export const uploadMedia = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const multerReq = req as Request & { file?: { originalname: string; mimetype: string; size: number; buffer: Buffer } };
    if (!multerReq.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = multerReq.file;
    const fileName = `${Date.now()}-${file.originalname}`;
    const fileUrl = `uploads/${userId}/${fileName}`;
    const mediaType = getMediaTypeFromMime(file.mimetype);

    const { altText, tags, campaignId, width, height, durationSeconds } = req.body;

    const asset = await createMediaAsset(
      userId,
      fileName,
      file.originalname,
      file.mimetype,
      mediaType,
      file.size,
      fileUrl,
      null, // thumbnailUrl — can be generated async later
      width ? parseInt(width) : null,
      height ? parseInt(height) : null,
      durationSeconds ? parseFloat(durationSeconds) : null,
      altText || null,
      tags || null,
      campaignId || null
    );

    return res.status(201).json({
      message: "Media uploaded successfully",
      asset: {
        id: asset.id,
        fileName: asset.file_name,
        originalName: asset.original_name,
        mediaType: asset.media_type,
        mimeType: asset.mime_type,
        fileSize: asset.file_size,
        fileUrl: asset.file_url,
        width: asset.width,
        height: asset.height,
        durationSeconds: asset.duration_seconds,
        createdAt: asset.created_at,
      },
    });
  } catch (error: any) {
    console.error("Upload Media Error:", error);
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// ─── Get all media for current user ─────────────────────────────────────
export const getMyMedia = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { type } = req.query;

    let mediaType: MediaType | undefined;
    if (type && VALID_MEDIA_TYPES.includes(type as MediaType)) {
      mediaType = type as MediaType;
    }

    const assets = await getMediaAssetsByUserId(userId, mediaType);

    res.json({
      count: assets.length,
      assets: assets.map((a) => ({
        id: a.id,
        fileName: a.file_name,
        originalName: a.original_name,
        mediaType: a.media_type,
        mimeType: a.mime_type,
        fileSize: a.file_size,
        fileUrl: a.file_url,
        thumbnailUrl: a.thumbnail_url,
        width: a.width,
        height: a.height,
        durationSeconds: a.duration_seconds,
        altText: a.alt_text,
        tags: a.tags,
        campaignId: a.campaign_id,
        createdAt: a.created_at,
      })),
    });
  } catch (error: any) {
    console.error("Get Media Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Get a single media asset by ID ─────────────────────────────────────
export const getMediaById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const asset = await getMediaAssetById(Number(id));

    if (!asset) {
      return res.status(404).json({ message: "Media asset not found" });
    }

    // Only the owner can view their own media
    if (asset.user_id !== req.user?.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ asset });
  } catch (error: any) {
    console.error("Get Media By ID Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Get media assets by campaign ───────────────────────────────────────
export const getMediaByCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const campaignId = req.params.campaignId as string;
    const assets = await getMediaAssetsByCampaignId(campaignId);

    res.json({
      count: assets.length,
      assets,
    });
  } catch (error: any) {
    console.error("Get Media By Campaign Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Update media asset metadata ────────────────────────────────────────
export const updateMedia = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const existing = await getMediaAssetById(Number(id));

    if (!existing) {
      return res.status(404).json({ message: "Media asset not found" });
    }

    if (existing.user_id !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { altText, tags, campaignId } = req.body;

    const updated = await updateMediaAsset(
      Number(id),
      altText ?? null,
      tags ?? null,
      campaignId ?? null
    );

    res.json({
      message: "Media asset updated",
      asset: updated,
    });
  } catch (error: any) {
    console.error("Update Media Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ─── Delete a media asset ───────────────────────────────────────────────
export const deleteMedia = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const existing = await getMediaAssetById(Number(id));

    if (!existing) {
      return res.status(404).json({ message: "Media asset not found" });
    }

    if (existing.user_id !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await deleteMediaAsset(Number(id));

    res.json({ message: "Media asset deleted" });
  } catch (error: any) {
    console.error("Delete Media Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
