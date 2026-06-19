import { decrypt } from "../utils/encryption";
import {
  getRawTokenByPlatform,
  refreshAccessToken,
  SocialPlatform,
} from "../models/socialTokenModel";

// ─── Meta Graph API Configuration ───────────────────────────────────────
const GRAPH_API_VERSION = "v19.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

// ─── Interfaces ─────────────────────────────────────────────────────────

export interface MetaTokenExchangeResult {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export interface MetaPageInfo {
  id: string;
  name: string;
  access_token: string;
  category: string;
}

export interface MetaUserProfile {
  id: string;
  name: string;
  email?: string;
  picture?: { data: { url: string } };
}

export interface MetaPublishResult {
  id: string;
  post_id?: string;
}

// ─── Helper: Make Graph API requests ────────────────────────────────────

async function graphApiRequest<T>(
  endpoint: string,
  accessToken: string,
  method: "GET" | "POST" | "DELETE" = "GET",
  body?: Record<string, any>,
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${GRAPH_API_BASE}${endpoint}`;

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  if (body && (method === "POST" || method === "DELETE")) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data?.error?.message || `Graph API error: ${response.status}`;
    const errorType = data?.error?.type || "UnknownError";
    const errorCode = data?.error?.code || response.status;
    throw new Error(
      `Meta Graph API Error [${errorType}] (${errorCode}): ${errorMessage}`,
    );
  }

  return data as T;
}

// ─── Token Exchange: Short-lived → Long-lived ───────────────────────────

export async function exchangeForLongLivedToken(
  shortLivedToken: string,
  appId: string,
  appSecret: string,
): Promise<MetaTokenExchangeResult> {
  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: shortLivedToken,
  });

  const response = await fetch(
    `${GRAPH_API_BASE}/oauth/access_token?${params.toString()}`,
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Token exchange failed: ${data?.error?.message || response.statusText}`,
    );
  }

  return data;
}

// ─── Token Refresh Logic ────────────────────────────────────────────────
// For Meta/Facebook: long-lived tokens can be refreshed by exchanging them
// again before they expire (~60 days). This function handles looking up the
// stored token, calling Meta's API, and persisting the new token.

export async function refreshMetaToken(
  userId: number,
  platform: SocialPlatform,
): Promise<{ accessToken: string; expiresAt: Date | null }> {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error(
      "META_APP_ID and META_APP_SECRET must be set in environment variables",
    );
  }

  // Get the current stored token (encrypted)
  const storedToken = await getRawTokenByPlatform(userId, platform);
  if (!storedToken) {
    throw new Error(`No ${platform} token found for user ${userId}`);
  }

  if (!storedToken.is_active) {
    throw new Error(`${platform} connection is deactivated for user ${userId}`);
  }

  // Decrypt the current access token
  const currentAccessToken = decrypt(storedToken.access_token);

  // Exchange for a new long-lived token
  const result = await exchangeForLongLivedToken(
    currentAccessToken,
    appId,
    appSecret,
  );

  // Calculate new expiry
  const expiresAt = result.expires_in
    ? new Date(Date.now() + result.expires_in * 1000)
    : null;

  // Persist the refreshed token (encrypted by refreshAccessToken)
  await refreshAccessToken(userId, platform, result.access_token, expiresAt);

  return {
    accessToken: result.access_token,
    expiresAt,
  };
}

// ─── Check if a token needs refreshing ──────────────────────────────────
// Tokens should be refreshed when they're within 7 days of expiry.

export function isTokenExpiringSoon(expiresAt: string | null): boolean {
  if (!expiresAt) return false; // No expiry = permanent token
  const expiryDate = new Date(expiresAt);
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return expiryDate <= sevenDaysFromNow;
}

// ─── Auto-refresh token if needed ───────────────────────────────────────
// Returns a valid access token, refreshing if close to expiry.

export async function getValidAccessToken(
  userId: number,
  platform: SocialPlatform,
): Promise<string> {
  const storedToken = await getRawTokenByPlatform(userId, platform);
  if (!storedToken) {
    throw new Error(`No ${platform} token found for user ${userId}`);
  }

  // If token is expiring soon, try to refresh it
  if (
    isTokenExpiringSoon(storedToken.token_expires_at) &&
    (platform === "facebook" || platform === "instagram")
  ) {
    try {
      const refreshed = await refreshMetaToken(userId, platform);
      return refreshed.accessToken;
    } catch (error) {
      console.warn(
        `Failed to refresh ${platform} token for user ${userId}, using existing token:`,
        error,
      );
      // Fall back to existing token
    }
  }

  return decrypt(storedToken.access_token);
}

// ─── Get User Profile ───────────────────────────────────────────────────

export async function getMetaUserProfile(
  accessToken: string,
): Promise<MetaUserProfile> {
  return graphApiRequest<MetaUserProfile>(
    "/me?fields=id,name,email,picture",
    accessToken,
  );
}

// ─── Get User Pages ─────────────────────────────────────────────────────

export async function getMetaUserPages(
  accessToken: string,
): Promise<MetaPageInfo[]> {
  const result = await graphApiRequest<{
    data: MetaPageInfo[];
  }>("/me/accounts?fields=id,name,access_token,category", accessToken);
  return result.data;
}

// ─── Publish to Facebook Page ───────────────────────────────────────────

export async function publishToFacebookPage(
  pageId: string,
  pageAccessToken: string,
  message: string,
  mediaUrl?: string,
): Promise<MetaPublishResult> {
  if (mediaUrl) {
    // Photo post
    return graphApiRequest<MetaPublishResult>(
      `/${pageId}/photos`,
      pageAccessToken,
      "POST",
      { message, url: mediaUrl },
    );
  }

  // Text-only post
  return graphApiRequest<MetaPublishResult>(
    `/${pageId}/feed`,
    pageAccessToken,
    "POST",
    { message },
  );
}

// ─── Publish Video to Facebook Page ─────────────────────────────────────

export async function publishVideoToFacebookPage(
  pageId: string,
  pageAccessToken: string,
  videoUrl: string,
  description: string,
  title?: string,
): Promise<MetaPublishResult> {
  return graphApiRequest<MetaPublishResult>(
    `/${pageId}/videos`,
    pageAccessToken,
    "POST",
    {
      file_url: videoUrl,
      description,
      title: title || "",
    },
  );
}

// ─── Create Instagram Container (Step 1 of IG publishing) ───────────────

export async function createInstagramMediaContainer(
  igUserId: string,
  accessToken: string,
  options: {
    caption: string;
    imageUrl?: string;
    videoUrl?: string;
  },
): Promise<string> {
  const body: Record<string, any> = { caption: options.caption };

  if (options.videoUrl) {
    body.media_type = "VIDEO";
    body.video_url = options.videoUrl;
  } else if (options.imageUrl) {
    body.image_url = options.imageUrl;
  }

  const result = await graphApiRequest<{ id: string }>(
    `/${igUserId}/media`,
    accessToken,
    "POST",
    body,
  );

  return result.id;
}

// ─── Publish Instagram Container (Step 2 of IG publishing) ──────────────

export async function publishInstagramMedia(
  igUserId: string,
  accessToken: string,
  containerId: string,
): Promise<MetaPublishResult> {
  return graphApiRequest<MetaPublishResult>(
    `/${igUserId}/media_publish`,
    accessToken,
    "POST",
    { creation_id: containerId },
  );
}

// ─── Schedule a Facebook Page Post ──────────────────────────────────────
// Accepts a scheduled_publish_time as a Unix timestamp (must be 10 min - 6 months in future)

export async function schedulePostToFacebookPage(
  pageId: string,
  pageAccessToken: string,
  message: string,
  scheduledPublishTime: number,
  mediaUrl?: string,
): Promise<MetaPublishResult> {
  if (mediaUrl) {
    return graphApiRequest<MetaPublishResult>(
      `/${pageId}/photos`,
      pageAccessToken,
      "POST",
      {
        message,
        url: mediaUrl,
        published: false,
        scheduled_publish_time: scheduledPublishTime,
      },
    );
  }

  return graphApiRequest<MetaPublishResult>(
    `/${pageId}/feed`,
    pageAccessToken,
    "POST",
    {
      message,
      published: false,
      scheduled_publish_time: scheduledPublishTime,
    },
  );
}
