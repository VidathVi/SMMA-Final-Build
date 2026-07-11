import express, { Request, Response, NextFunction } from "express";
import geoRoutes from "./routes/geo.routes";
import assetRoutes from "./routes/asset";
import userRoutes from "./routes/user";
import socialTokenRoutes from "./routes/socialToken.routes";
import mediaAssetRoutes from "./routes/mediaAsset.routes";
import metaGraphRoutes from "./routes/metaGraph.routes";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import youtubeRoutes from "./routes/youtube";
import metaRoutes from "./routes/meta";
import whatsappRoutes from "./routes/whatsapp";
import linkedinRoutes from "./routes/linkedin";
import tiktokRoutes from "./routes/tiktok";
import pool from "./db/db";

// V1 route imports
import campaignRoutes from "./routes/campaign.routes";
import postRoutes from "./routes/post.routes";
import statusRoutes from "./routes/status.routes";
import taskRoutes from "./routes/task.routes";
import calendarRoutes from "./routes/calendar.routes";
import { postController } from "./controllers/post.controller";
import { validate } from "./middleware/validate";
import { z } from "zod";
import { errorHandler } from "./middleware/error-handler";
import webhookRoutes from "./routes/webhook";
import { authMiddleware } from "./middleware/authMiddleware";

// V2 route imports (new modules)
import approvalRoutes from "./routes/approval.routes";
import analyticsRoutes from "./routes/analytics.routes";
import workflowRoutes from "./routes/workflow.routes";
import inboxRoutes from "./routes/inbox.routes";

// Queue & Worker imports
import { startPublishWorker } from "./services/queue.service";
import { startTranscodingWorker } from "./services/transcoding.service";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running!");
});

app.get("/ping", (req, res) => {
  console.log("PING HIT");
  res.send("pong");
});

// ─── Existing Routes ────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/geo", geoRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/users", userRoutes);
app.use("/api/social-tokens", socialTokenRoutes);
app.use("/api/media", mediaAssetRoutes);
app.use("/api/meta", metaGraphRoutes);

// ─── V1 Routes (Campaign/Post/Status/Task Management) ──────────────────
app.use("/api/campaigns", authMiddleware, campaignRoutes);
app.use("/api/posts", authMiddleware, postRoutes);
app.use("/api/statuses", authMiddleware, statusRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);
app.use("/api/calendar", authMiddleware, calendarRoutes);

// ─── V2 Routes (New Modules) ────────────────────────────────────────────
app.use("/api/approvals", authMiddleware, approvalRoutes);
app.use("/api/analytics", authMiddleware, analyticsRoutes);
app.use("/api/workflows", authMiddleware, workflowRoutes);
app.use("/api/inbox", authMiddleware, inboxRoutes);

// Social Media API Routes
app.use("/api/youtube", youtubeRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/linkedin", linkedinRoutes);
app.use("/api/tiktok", tiktokRoutes);
app.use("/api/webhooks", webhookRoutes);

// ─── Nested Route: Get posts by campaign ────────────────────────────────
const campaignPostsSchema = z.object({
  params: z.object({ campaignId: z.string().uuid("Invalid campaign ID") }),
});
app.get(
  "/api/campaigns/:campaignId/posts",
  authMiddleware,
  validate(campaignPostsSchema),
  postController.getByCampaign,
);

app.get(["/health", "/api/health"], async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "healthy",
      db_time: result.rows[0].now,
      message: "Backend is running and connected to PostgreSQL",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

// ─── Error Handler (must be last middleware) ─────────────────────────────
app.use(errorHandler);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res
    .status(500)
    .json({ status: "error", message: err.message || "Internal Server Error" });
});

// ─── Start Server & Workers ─────────────────────────────────────────────

pool
  .connect()
  .then((client) => {
    console.log("Connected to PostgreSQL Database");
    client.release();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Start background workers if Redis is configured
    if (process.env.REDIS_URL || process.env.ENABLE_WORKERS === "true") {
      try {
        startPublishWorker();
        startTranscodingWorker();
        console.log("Background workers initialized");
      } catch (err) {
        console.warn("Workers not started (Redis may not be available):", (err as Error).message);
      }
    }
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
