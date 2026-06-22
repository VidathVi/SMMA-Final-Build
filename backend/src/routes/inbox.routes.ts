import { Router } from "express";
import { inboxController } from "../controllers/inbox.controller";

const router = Router();

router.get("/", inboxController.getMessages.bind(inboxController));
router.get("/unread-count", inboxController.getUnreadCount.bind(inboxController));
router.post("/mark-all-read", inboxController.markAllAsRead.bind(inboxController));
router.post("/:messageId/reply", inboxController.sendReply.bind(inboxController));
router.patch("/:messageId/read", inboxController.markAsRead.bind(inboxController));

export default router;
