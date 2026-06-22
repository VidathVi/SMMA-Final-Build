import { Worker, Job } from "bullmq";
import { prisma } from "../lib/prisma";
import { transcodingQueue } from "./queue.service";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

// ─── Platform-specific transcoding presets ──────────────────────────────

interface TranscodePreset {
  width: number;
  height: number;
  videoBitrate: string;
  audioBitrate: string;
  fps: number;
  codec: string;
  format: string;
}

const TRANSCODE_PRESETS: Record<string, TranscodePreset> = {
  tiktok: {
    width: 1080,
    height: 1920,
    videoBitrate: "4000k",
    audioBitrate: "128k",
    fps: 30,
    codec: "libx264",
    format: "mp4",
  },
  instagram_reels: {
    width: 1080,
    height: 1920,
    videoBitrate: "3500k",
    audioBitrate: "128k",
    fps: 30,
    codec: "libx264",
    format: "mp4",
  },
  youtube_shorts: {
    width: 1080,
    height: 1920,
    videoBitrate: "5000k",
    audioBitrate: "192k",
    fps: 30,
    codec: "libx264",
    format: "mp4",
  },
  facebook_reels: {
    width: 1080,
    height: 1920,
    videoBitrate: "4000k",
    audioBitrate: "128k",
    fps: 30,
    codec: "libx264",
    format: "mp4",
  },
  linkedin_video: {
    width: 1920,
    height: 1080,
    videoBitrate: "5000k",
    audioBitrate: "192k",
    fps: 30,
    codec: "libx264",
    format: "mp4",
  },
};

// ─── FFmpeg Transcoding Function ────────────────────────────────────────

/**
 * Transcode a video file using FFmpeg.
 * Returns the output file path.
 */
function transcodeVideo(
  inputPath: string,
  outputPath: string,
  preset: TranscodePreset
): Promise<string> {
  return new Promise((resolve, reject) => {
    const args = [
      "-i", inputPath,
      "-vf", `scale=${preset.width}:${preset.height}:force_original_aspect_ratio=decrease,pad=${preset.width}:${preset.height}:(ow-iw)/2:(oh-ih)/2`,
      "-c:v", preset.codec,
      "-b:v", preset.videoBitrate,
      "-c:a", "aac",
      "-b:a", preset.audioBitrate,
      "-r", preset.fps.toString(),
      "-movflags", "+faststart",
      "-y", // Overwrite output
      outputPath,
    ];

    console.log(`  🎬 Running FFmpeg: ffmpeg ${args.join(" ")}`);

    const ffmpeg = spawn("ffmpeg", args);

    let stderr = "";

    ffmpeg.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(new Error(`FFmpeg exited with code ${code}: ${stderr.slice(-500)}`));
      }
    });

    ffmpeg.on("error", (err) => {
      reject(new Error(`FFmpeg spawn error: ${err.message}`));
    });
  });
}

// ─── Transcoding Worker ─────────────────────────────────────────────────

export function startTranscodingWorker() {
  const outputDir = process.env.TRANSCODED_OUTPUT_DIR || "./transcoded";

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const worker = new Worker(
    "media-transcoding",
    async (job: Job) => {
      const { assetId, targetFormats } = job.data;

      console.log(`🎬 Transcoding asset ${assetId} to formats: ${targetFormats.join(", ")}`);

      const asset = await prisma.mediaAsset.findUnique({
        where: { id: assetId },
      });

      if (!asset) {
        throw new Error(`Asset ${assetId} not found`);
      }

      // Only transcode video files
      if (!asset.mimeType.startsWith("video/")) {
        console.log(`  ⏭ Skipping non-video asset ${assetId}`);
        await prisma.mediaAsset.update({
          where: { id: assetId },
          data: { transcodingStatus: "completed" },
        });
        return { assetId, skipped: true };
      }

      const transcodedUrls: Record<string, string> = {};
      const errors: string[] = [];

      for (const format of targetFormats) {
        const preset = TRANSCODE_PRESETS[format];
        if (!preset) {
          console.warn(`  ⚠️ Unknown format: ${format}, skipping`);
          continue;
        }

        try {
          const ext = preset.format;
          const outputFilename = `${assetId}_${format}.${ext}`;
          const outputPath = path.join(outputDir, outputFilename);

          // The asset.url could be a local path or a remote URL
          // For local files, use the URL directly
          // For remote files (S3/Cloudinary), you would download first
          const inputPath = asset.url;

          await transcodeVideo(inputPath, outputPath, preset);

          // In production, you would upload to cloud storage here
          // and store the cloud URL instead of the local path
          transcodedUrls[format] = outputPath;

          console.log(`  ✅ Transcoded to ${format}: ${outputPath}`);

          // Report progress
          await job.updateProgress(
            Math.round(
              ((targetFormats.indexOf(format) + 1) / targetFormats.length) * 100
            )
          );
        } catch (error: any) {
          console.error(`  ❌ Failed to transcode to ${format}: ${error.message}`);
          errors.push(`${format}: ${error.message}`);
        }
      }

      // Update asset with transcoded URLs
      const status =
        errors.length === targetFormats.length
          ? "failed"
          : errors.length > 0
            ? "completed" // partial success
            : "completed";

      await prisma.mediaAsset.update({
        where: { id: assetId },
        data: {
          transcodingStatus: status,
          transcodedUrls: Object.keys(transcodedUrls).length > 0 ? transcodedUrls : undefined,
        },
      });

      return {
        assetId,
        transcodedUrls,
        errors: errors.length > 0 ? errors : undefined,
      };
    },
    {
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: null,
      },
      concurrency: 2, // Limit concurrent transcoding jobs (CPU-intensive)
    }
  );

  worker.on("completed", (job) => {
    console.log(`✅ Transcoding job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`❌ Transcoding job ${job?.id} failed: ${err.message}`);
  });

  console.log("🏭 Media transcoding worker started");
  return worker;
}

// ─── Helper: Get transcoding status ─────────────────────────────────────

export async function getTranscodingStatus(assetId: string) {
  const asset = await prisma.mediaAsset.findUnique({
    where: { id: assetId },
    select: {
      id: true,
      transcodingStatus: true,
      transcodedUrls: true,
    },
  });

  if (!asset) {
    return null;
  }

  // Check if there's an active job
  const jobs = await transcodingQueue.getJobs(["active", "waiting", "delayed"]);
  const activeJob = jobs.find(
    (job) => job.data.assetId === assetId
  );

  return {
    ...asset,
    isProcessing: !!activeJob,
    progress: activeJob ? await activeJob.progress : undefined,
  };
}
