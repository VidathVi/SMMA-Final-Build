import express from "express";
import {
  testAsset,
  uploadAsset,
  getAssets,
  addComment,
  getAssetById,
} from "../controllers/asset";
import upload from "../middleware/upload";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = express.Router();

router.get("/", testAsset);
router.post("/upload", upload.single("file"), uploadAsset);
router.get("/list", getAssets);
router.post("/:id/comments", addComment);
router.get("/:id", getAssetById);
// Protected test route
router.get("/", authMiddleware, testAsset);

// Restrict asset creation/upload to authorized roles
router.post(
  "/upload",
  authMiddleware,
  roleMiddleware(["admin", "manager", "designer"]),
  upload.single("file"),
  uploadAsset,
);

// All authenticated users can view assets
router.get("/list", authMiddleware, getAssets);

export default router;
