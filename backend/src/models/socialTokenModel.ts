import pool from "../db/db";
import { encrypt, decrypt } from "../utils/encryption";

// ─── Supported Platforms ────────────────────────────────────────────────
export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "twitter"
  | "youtube"
  | "tiktok"
  | "linkedin"
  | "pinterest";

// ─── Social Token Interface ─────────────────────────────────────────────
export interface SocialToken {
  id: number;
  user_id: number;
  platform: SocialPlatform;
  access_token: string;
  refresh_token: string | null;
  token_expires_at: string | null;
  platform_user_id: string | null;
  platform_username: string | null;
  scopes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Upsert (insert or update) a token for a user + platform ────────────
// Tokens are encrypted before storage and decrypted on retrieval.
export const upsertSocialToken = async (
  userId: number,
  platform: SocialPlatform,
  accessToken: string,
  refreshToken: string | null,
  tokenExpiresAt: Date | null,
  platformUserId: string | null,
  platformUsername: string | null,
  scopes: string | null,
): Promise<SocialToken> => {
  // Encrypt tokens before storing
  const encryptedAccessToken = encrypt(accessToken);
  const encryptedRefreshToken = refreshToken ? encrypt(refreshToken) : null;

  const result = await pool.query(
    `INSERT INTO social_tokens
       (user_id, platform, access_token, refresh_token, token_expires_at,
        platform_user_id, platform_username, scopes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (user_id, platform)
     DO UPDATE SET
       access_token      = EXCLUDED.access_token,
       refresh_token     = EXCLUDED.refresh_token,
       token_expires_at  = EXCLUDED.token_expires_at,
       platform_user_id  = EXCLUDED.platform_user_id,
       platform_username = EXCLUDED.platform_username,
       scopes            = EXCLUDED.scopes,
       is_active         = true,
       updated_at        = CURRENT_TIMESTAMP
     RETURNING *`,
    [
      userId,
      platform,
      encryptedAccessToken,
      encryptedRefreshToken,
      tokenExpiresAt,
      platformUserId,
      platformUsername,
      scopes,
    ],
  );

  return result.rows[0];
};

// ─── Get all tokens for a user ──────────────────────────────────────────
// Note: Sensitive token values are NOT returned here for security.
export const getTokensByUserId = async (
  userId: number,
): Promise<SocialToken[]> => {
  const result = await pool.query(
    `SELECT id, user_id, platform, platform_user_id, platform_username,
            scopes, is_active, token_expires_at, created_at, updated_at
     FROM social_tokens
     WHERE user_id = $1
     ORDER BY platform ASC`,
    [userId],
  );

  return result.rows;
};

// ─── Get a specific token by user + platform (with decrypted tokens) ────
export const getTokenByPlatform = async (
  userId: number,
  platform: SocialPlatform,
): Promise<SocialToken | undefined> => {
  const result = await pool.query(
    `SELECT * FROM social_tokens WHERE user_id = $1 AND platform = $2`,
    [userId, platform],
  );

  if (!result.rows[0]) return undefined;

  const token = result.rows[0];
  return {
    ...token,
    access_token: decrypt(token.access_token),
    refresh_token: token.refresh_token ? decrypt(token.refresh_token) : null,
  };
};

// ─── Get the raw (encrypted) token row for internal refresh logic ───────
export const getRawTokenByPlatform = async (
  userId: number,
  platform: SocialPlatform,
): Promise<SocialToken | undefined> => {
  const result = await pool.query(
    `SELECT * FROM social_tokens WHERE user_id = $1 AND platform = $2`,
    [userId, platform],
  );
  return result.rows[0];
};

// ─── Deactivate a token (disconnect a platform) ─────────────────────────
export const deactivateToken = async (
  userId: number,
  platform: SocialPlatform,
): Promise<SocialToken | undefined> => {
  const result = await pool.query(
    `UPDATE social_tokens
     SET is_active = false, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $1 AND platform = $2
     RETURNING *`,
    [userId, platform],
  );

  return result.rows[0];
};

// ─── Delete a token (fully remove connection) ───────────────────────────
export const deleteToken = async (
  userId: number,
  platform: SocialPlatform,
): Promise<boolean> => {
  const result = await pool.query(
    `DELETE FROM social_tokens WHERE user_id = $1 AND platform = $2`,
    [userId, platform],
  );

  return (result.rowCount ?? 0) > 0;
};

// ─── Refresh: update the access token + new expiry ──────────────────────
// Encrypts the new access token before persisting.
export const refreshAccessToken = async (
  userId: number,
  platform: SocialPlatform,
  newAccessToken: string,
  newExpiresAt: Date | null,
): Promise<SocialToken | undefined> => {
  const encryptedAccessToken = encrypt(newAccessToken);

  const result = await pool.query(
    `UPDATE social_tokens
     SET access_token = $1, token_expires_at = $2, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $3 AND platform = $4
     RETURNING *`,
    [encryptedAccessToken, newExpiresAt, userId, platform],
  );

  return result.rows[0];
};
