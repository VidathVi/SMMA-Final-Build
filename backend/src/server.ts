import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import pool from "./db/db";


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

app.use("/api/auth", authRoutes);

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