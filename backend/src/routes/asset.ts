import express from "express";
import { testAsset, uploadAsset } from "../controllers/asset";
import upload from "../middlewares/upload";

const router = express.Router();

router.get("/", testAsset);
router.post("/upload", upload.single("file"), uploadAsset);

export default router;