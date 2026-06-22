import { Request, Response, NextFunction } from "express";
import { analyticsService } from "../services/analytics.service";

export class AnalyticsController {
  async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const overview = await analyticsService.getOverview();
      res.json({ success: true, data: overview });
    } catch (error) {
      next(error);
    }
  }

  async getEngagement(req: Request, res: Response, next: NextFunction) {
    try {
      const { days, platform } = req.query;
      const data = await analyticsService.getEngagementTimeSeries(
        days ? parseInt(days as string) : 30,
        platform as string | undefined
      );
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getTopPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit } = req.query;
      const posts = await analyticsService.getTopPosts(
        limit ? parseInt(limit as string) : 10
      );
      res.json({ success: true, data: posts });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
