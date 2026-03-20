import express from "express";
import { testAsset, uploadAsset, getAssets, addComment, getAssetById } from "../controllers/asset";
import upload from "../middleware/upload";


const router = express.Router();

router.get("/", testAsset);
router.post("/upload", upload.single("file"), uploadAsset);
router.get("/list", getAssets);
router.post("/:id/comments", addComment);
router.get("/:id", getAssetById);

export default router;