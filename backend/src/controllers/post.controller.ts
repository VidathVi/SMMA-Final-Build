import { Request, Response, NextFunction } from "express";
import { postService } from "../services/post.service";

export class PostController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await postService.create(req.body);
      res.status(201).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }

  async assignToUser(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await postService.assignToUser(
        req.params.id as string,
        req.body.userId,
      );
      res.json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await postService.updateStatus(
        req.params.id as string,
        req.body.statusId,
      );
      res.json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }

  async updateDueDate(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await postService.updateDueDate(
        req.params.id as string,
        req.body.dueDate,
      );
      res.json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }

  async getByCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await postService.getByCampaign(
        req.params.campaignId as string,
      );
      res.json({ success: true, data: posts });
    } catch (error) {
      next(error);
    }
  }
}

export const postController = new PostController();
