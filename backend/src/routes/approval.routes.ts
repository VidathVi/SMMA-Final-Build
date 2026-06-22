import { Router } from "express";
import { approvalController } from "../controllers/approval.controller";

const router = Router();

router.get("/", approvalController.getPending.bind(approvalController));
router.patch("/:postId/status", approvalController.updateStatus.bind(approvalController));
router.post("/:postId/comments", approvalController.addComment.bind(approvalController));
router.get("/:postId/comments", approvalController.getComments.bind(approvalController));

export default router;
