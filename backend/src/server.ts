import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
<<<<<<< Updated upstream
import authRoutes from "./routes/auth";
import geoRoutes from "./routes/geo.routes";
import assetRoutes from "./routes/asset";
import userRoutes from "./routes/user";
=======
import authRoutes from "./routes/auth"; 
>>>>>>> Stashed changes
import pool from "./db/db";

// V1 route imports
import campaignRoutes from "./routes/campaign.routes";
import postRoutes from "./routes/post.routes";
import statusRoutes from "./routes/status.routes";
import taskRoutes from "./routes/task.routes";
import { postController } from "./controllers/post.controller";
import { validate } from "./middleware/validate";
import { z } from "zod";
import { errorHandler } from "./middleware/error-handler";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
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

// ─── V1 Routes (Campaign/Post/Status/Task Management) ──────────────────
app.use("/api/campaigns", campaignRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/statuses", statusRoutes);
app.use("/api/tasks", taskRoutes);

// ─── Nested Route: Get posts by campaign ────────────────────────────────
const campaignPostsSchema = z.object({
  params: z.object({ campaignId: z.string().uuid("Invalid campaign ID") }),
});
app.get(
  "/api/campaigns/:campaignId/posts",
  validate(campaignPostsSchema),
  postController.getByCampaign
);

app.get("/api/health", async (req: Request, res: Response) => {
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

// ─── Error Handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

pool.connect()
  .then((client) => {
    console.log("Connected to PostgreSQL Database");
    client.release();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
