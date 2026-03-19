import express from "express";
import { testAsset, uploadAsset, getAssets, addComment } from "../controllers/asset";
import upload from "../middlewares/upload";
import { testAsset, uploadAsset, getAssets } from "../controllers/asset";
import upload from "../middleware/upload";

const router = express.Router();

router.get("/", testAsset);
router.post("/upload", upload.single("file"), uploadAsset);
router.get("/list", getAssets);
router.post("/:id/comments", addComment);

export default router;