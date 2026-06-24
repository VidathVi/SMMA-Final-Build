import { Queue, Worker, Job } from "bullmq";
import { prisma } from "../lib/prisma";

// ─── Redis Connection Config ───────────────────────────────────────────
// BullMQ uses its own bundled ioredis, so we pass connection options directly
// instead of an IORedis instance to avoid version mismatches.

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

function parseRedisUrl(url: string) {
  try {
    const parsed = new URL(url);
    const options: any = {
      host: parsed.hostname || "localhost",
      port: parseInt(parsed.port) || 6379,
      password: parsed.password || undefined,
      maxRetriesPerRequest: null as null,
    };
    
    // Enable SSL/TLS support if connecting via rediss:// protocol
    if (parsed.protocol === "rediss:") {
      options.tls = {};
    }
    
    return options;
  } catch {
    return {
      host: "localhost",
      port: 6379,
      maxRetriesPerRequest: null as null,
    };
  }
}

const redisOpts = parseRedisUrl(REDIS_URL);

// ─── Publish Queue ─────────────────────────────────────────────────────

export const publishQueue = new Queue("post-publishing", {
  connection: redisOpts,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

/**
 * Schedule a post for publishing at a specific time.
 */
export async function schedulePostForPublishing(
  postId: string,
  scheduledAt: Date,
  platforms: string[]
) {
  const delay = Math.max(0, scheduledAt.getTime() - Date.now());

  const job = await publishQueue.add(
    "publish-post",
    {
      postId,
      platforms,
      scheduledAt: scheduledAt.toISOString(),
    },
    {
      delay,
      jobId: `publish-${postId}`,
    }
  );

  console.log(
    `📅 Post ${postId} scheduled for publishing in ${Math.round(delay / 1000)}s (Job: ${job.id})`
  );

  return job;
}

/**
 * Cancel a scheduled publishing job.
 */
export async function cancelScheduledPost(postId: string) {
  const job = await publishQueue.getJob(`publish-${postId}`);
  if (job) {
    await job.remove();
    console.log(`🚫 Cancelled scheduled publish for post ${postId}`);
  }
}

// ─── Publish Worker ────────────────────────────────────────────────────

export function startPublishWorker() {
  const worker = new Worker(
    "post-publishing",
    async (job: Job) => {
      const { postId, platforms } = job.data;

      console.log(`🚀 Publishing post ${postId} to platforms: ${platforms.join(", ")}`);

      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          campaign: true,
          mediaAssets: true,
        },
      });

      if (!post) {
        throw new Error(`Post ${postId} not found`);
      }

      // Publish to each platform with rate limiting
      const results: Array<{
        platform: string;
        success: boolean;
        error?: string;
      }> = [];

      for (const platform of platforms) {
        try {
          // Rate limiting: 50ms delay between platform calls
          await new Promise((resolve) => setTimeout(resolve, 50));

          // TODO: Call the actual social media API for each platform
          // This is where you'd integrate with the Meta, TikTok, YouTube, etc. APIs
          // For now, we simulate the publishing and log the result
          const success = true; // Replace with actual API call result

          // Log the publish attempt
          await prisma.publishLog.create({
            data: {
              postId,
              platform,
              status: success ? "success" : "failed",
              responseCode: success ? 200 : 500,
              responseBody: JSON.stringify({ message: "Published successfully" }),
              attemptNumber: job.attemptsMade + 1,
            },
          });

          results.push({ platform, success });
          console.log(`  ✅ Published to ${platform}`);
        } catch (error: any) {
          // Log the failure
          await prisma.publishLog.create({
            data: {
              postId,
              platform,
              status: "failed",
              errorMessage: error.message,
              attemptNumber: job.attemptsMade + 1,
            },
          });

          results.push({
            platform,
            success: false,
            error: error.message,
          });
          console.error(`  ❌ Failed to publish to ${platform}: ${error.message}`);
        }
      }

      // Update post as published
      const allSucceeded = results.every((r) => r.success);
      if (allSucceeded) {
        await prisma.post.update({
          where: { id: postId },
          data: { publishedAt: new Date() },
        });
      }

      return { postId, results };
    },
    {
      connection: redisOpts,
      concurrency: 5,
      limiter: {
        max: 50,
        duration: 1000, // 50 jobs per second rate limit
      },
    }
  );

  worker.on("completed", (job) => {
    console.log(`✅ Publishing job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Publishing job ${job?.id} failed: ${err.message}`);
  });

  console.log("🏭 Post publishing worker started");
  return worker;
}

// ─── Transcoding Queue ─────────────────────────────────────────────────

export const transcodingQueue = new Queue("media-transcoding", {
  connection: redisOpts,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "fixed",
      delay: 10000,
    },
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 20 },
  },
});

/**
 * Add a media asset to the transcoding queue.
 */
export async function queueTranscoding(
  assetId: string,
  targetFormats: string[] = ["tiktok", "instagram_reels", "youtube_shorts"]
) {
  const job = await transcodingQueue.add("transcode-media", {
    assetId,
    targetFormats,
  });

  // Update asset status
  await prisma.mediaAsset.update({
    where: { id: assetId },
    data: { transcodingStatus: "processing" },
  });

  console.log(`🎬 Media asset ${assetId} queued for transcoding (Job: ${job.id})`);
  return job;
}
