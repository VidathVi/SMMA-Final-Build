import { Request, Response, NextFunction } from "express";
import { taskService } from "../services/task.service";

export class TaskController {
  async moveTask(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await taskService.moveTask(
        req.params.postId as string,
        req.body.statusId,
      );
      res.json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }

  async getBoardView(req: Request, res: Response, next: NextFunction) {
    try {
      const board = await taskService.getBoardView(
        req.params.campaignId as string,
      );
      res.json({ success: true, data: board });
    } catch (error) {
      next(error);
    }
  }
}

export const taskController = new TaskController();
