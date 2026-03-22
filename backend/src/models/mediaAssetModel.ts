import pool from "../db/db";

// ─── Media Type ─────────────────────────────────────────────────────────
export type MediaType = "image" | "video" | "gif" | "document";

// ─── Media Asset Interface ──────────────────────────────────────────────
export interface MediaAsset {
  id: number;
  user_id: number;
  file_name: string;
  original_name: string;
  mime_type: string;
  media_type: MediaType;
  file_size: number;
  file_url: string;
  thumbnail_url: string | null;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  alt_text: string | null;
  tags: string | null;
  campaign_id: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Create a new media asset record ────────────────────────────────────
export const createMediaAsset = async (
  userId: number,
  fileName: string,
  originalName: string,
  mimeType: string,
  mediaType: MediaType,
  fileSize: number,
  fileUrl: string,
  thumbnailUrl: string | null = null,
  width: number | null = null,
  height: number | null = null,
  durationSeconds: number | null = null,
  altText: string | null = null,
  tags: string | null = null,
  campaignId: string | null = null
): Promise<MediaAsset> => {
  const result = await pool.query(
    `INSERT INTO media_assets
       (user_id, file_name, original_name, mime_type, media_type, file_size,
        file_url, thumbnail_url, width, height, duration_seconds,
        alt_text, tags, campaign_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     RETURNING *`,
    [
      userId, fileName, originalName, mimeType, mediaType, fileSize,
      fileUrl, thumbnailUrl, width, height, durationSeconds,
      altText, tags, campaignId,
    ]
  );

  return result.rows[0];
};

// ─── Get all media assets for a user ────────────────────────────────────
export const getMediaAssetsByUserId = async (
  userId: number,
  mediaType?: MediaType
): Promise<MediaAsset[]> => {
  let query = `SELECT * FROM media_assets WHERE user_id = $1`;
  const params: any[] = [userId];

  if (mediaType) {
    query += ` AND media_type = $2`;
    params.push(mediaType);
  }

  query += ` ORDER BY created_at DESC`;

  const result = await pool.query(query, params);
  return result.rows;
};

// ─── Get a single media asset by ID ─────────────────────────────────────
export const getMediaAssetById = async (
  id: number
): Promise<MediaAsset | undefined> => {
  const result = await pool.query(
    `SELECT * FROM media_assets WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

// ─── Get media assets by campaign ID ────────────────────────────────────
export const getMediaAssetsByCampaignId = async (
  campaignId: string
): Promise<MediaAsset[]> => {
  const result = await pool.query(
    `SELECT * FROM media_assets WHERE campaign_id = $1 ORDER BY created_at DESC`,
    [campaignId]
  );

  return result.rows;
};

// ─── Update media asset metadata ────────────────────────────────────────
export const updateMediaAsset = async (
  id: number,
  altText: string | null,
  tags: string | null,
  campaignId: string | null
): Promise<MediaAsset | undefined> => {
  const result = await pool.query(
    `UPDATE media_assets
     SET alt_text = COALESCE($1, alt_text),
         tags = COALESCE($2, tags),
         campaign_id = COALESCE($3, campaign_id),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING *`,
    [altText, tags, campaignId, id]
  );

  return result.rows[0];
};

// ─── Delete a media asset ───────────────────────────────────────────────
export const deleteMediaAsset = async (id: number): Promise<boolean> => {
  const result = await pool.query(
    `DELETE FROM media_assets WHERE id = $1`,
    [id]
  );

  return (result.rowCount ?? 0) > 0;
};

// ─── Delete all media assets for a user ─────────────────────────────────
export const deleteMediaAssetsByUserId = async (
  userId: number
): Promise<number> => {
  const result = await pool.query(
    `DELETE FROM media_assets WHERE user_id = $1`,
    [userId]
  );

  return result.rowCount ?? 0;
};
