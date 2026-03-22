import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import youtubeRoutes from "./routes/youtube";
import metaRoutes from "./routes/meta";
import whatsappRoutes from "./routes/whatsapp";
import linkedinRoutes from "./routes/linkedin";
import tiktokRoutes from "./routes/tiktok";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// App Routes
app.use("/api/auth", authRoutes);

// Social Media API Routes
app.use("/api/youtube", youtubeRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/linkedin", linkedinRoutes);
app.use("/api/tiktok", tiktokRoutes);

app.get("/api/health", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    client.release();
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

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ status: "error", message: err.message || "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

