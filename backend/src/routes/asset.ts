import express from "express";
import { testAsset, uploadAsset, getAssets, addComment } from "../controllers/asset";
import upload from "../middleware/upload";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = express.Router();

// Protected test route
router.get("/", authMiddleware, testAsset);

// Restrict asset creation/upload to authorized roles
router.post(
  "/upload",
  authMiddleware,
  roleMiddleware(["admin", "manager", "designer"]),
  upload.single("file"),
  uploadAsset
);

// All authenticated users can view assets
router.get("/list", authMiddleware, getAssets);

export default router;