import { Request, Response, NextFunction } from "express";
import { approvalService } from "../services/approval.service";

export class ApprovalController {
  async getPending(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      const approvals = await approvalService.getPendingApprovals(
        status as string | undefined
      );
      res.json({ success: true, data: approvals });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { action, comment, authorId } = req.body;
      if (!["approve", "reject", "request_changes"].includes(action)) {
        return res.status(400).json({
          success: false,
          message: "Invalid action. Must be approve, reject, or request_changes",
        });
      }
      const result = await approvalService.updateApprovalStatus(
        req.params.postId as string,
        action,
        authorId,
        comment
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorId, content } = req.body;
      if (!content) {
        return res.status(400).json({
          success: false,
          message: "Comment content is required",
        });
      }
      const comment = await approvalService.addComment(
        req.params.postId as string,
        authorId,
        content
      );
      res.json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  }

  async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const comments = await approvalService.getComments(req.params.postId as string);
      res.json({ success: true, data: comments });
    } catch (error) {
      next(error);
    }
  }
}

export const approvalController = new ApprovalController();
