export type PostPlatform =
  | "facebook"
  | "twitter"
  | "instagram"
  | "linkedin"
  | "youtube";
export type PostStatus = "draft" | "scheduled" | "published" | "failed";

export interface ScheduledPost {
  id: string;
  title: string;
  date: string; // ISO string '2026-03-21T10:00:00Z'
  platform: PostPlatform;
  status: PostStatus;
  author: string;
}
