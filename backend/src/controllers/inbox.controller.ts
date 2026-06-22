import { Request, Response, NextFunction } from "express";
import { inboxService } from "../services/inbox.service";

export class InboxController {
  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, platform, isRead, search } = req.query;
      const messages = await inboxService.getMessages({
        type: type as string | undefined,
        platform: platform as string | undefined,
        isRead: isRead !== undefined ? isRead === "true" : undefined,
        search: search as string | undefined,
      });
      res.json({ success: true, data: messages });
    } catch (error) {
      next(error);
    }
  }

  async sendReply(req: Request, res: Response, next: NextFunction) {
    try {
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({
          success: false,
          message: "Reply content is required",
        });
      }
      const reply = await inboxService.sendReply(req.params.messageId as string, content);
      res.json({ success: true, data: reply });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await inboxService.markAsRead(req.params.messageId as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await inboxService.markAllAsRead();
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await inboxService.getUnreadCount();
      res.json({ success: true, data: { count } });
    } catch (error) {
      next(error);
    }
  }
}

export const inboxController = new InboxController();
