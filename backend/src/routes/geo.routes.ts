import { Router } from "express";
import {
  generateCaption,
  optimizeContent,
  predictEngagement,
  detectLanguage,
} from "../controllers/geo.controller";

const router = Router();

// These endpoints mirror the FAST API endpoints
router.post("/generate-caption", generateCaption);
router.post("/optimize-content", optimizeContent);
router.post("/predict-engagement", predictEngagement);
router.post("/detect-language", detectLanguage);

export default router;
