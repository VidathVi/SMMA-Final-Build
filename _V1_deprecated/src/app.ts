import express from "express";
import cors from "cors";
import campaignRoutes from "./routes/campaign.routes";
import postRoutes from "./routes/post.routes";
import statusRoutes from "./routes/status.routes";
import taskRoutes from "./routes/task.routes";
import { errorHandler } from "./middleware/error-handler";

const app = express();

// ─── Global Middleware ──────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Health Check ───────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── API Routes ─────────────────────────────────────────────────────────
app.use("/api/campaigns", campaignRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/statuses", statusRoutes);
app.use("/api/tasks", taskRoutes);

// ─── Get Posts by Campaign (nested route) ───────────────────────────────
import { postController } from "./controllers/post.controller";
import { validate } from "./middleware/validate";
import { z } from "zod";

const campaignPostsSchema = z.object({
  params: z.object({ campaignId: z.string().uuid("Invalid campaign ID") }),
});
app.get(
  "/api/campaigns/:campaignId/posts",
  validate(campaignPostsSchema),
  postController.getByCampaign,
);

// ─── Error Handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

export default app;
