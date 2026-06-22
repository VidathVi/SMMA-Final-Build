import { Router } from "express";
import { analyticsController } from "../controllers/analytics.controller";

const router = Router();

router.get("/overview", analyticsController.getOverview.bind(analyticsController));
router.get("/engagement", analyticsController.getEngagement.bind(analyticsController));
router.get("/top-posts", analyticsController.getTopPosts.bind(analyticsController));

export default router;
