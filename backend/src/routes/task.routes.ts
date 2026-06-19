import { Router } from "express";
import { z } from "zod";
import { taskController } from "../controllers/task.controller";
import { validate } from "../middleware/validate";

const router = Router();

const moveTaskSchema = z.object({
  params: z.object({ postId: z.string().uuid("Invalid post ID") }),
  body: z.object({ statusId: z.string().uuid("Invalid status ID") }),
});

const boardViewSchema = z.object({
  params: z.object({ campaignId: z.string().uuid("Invalid campaign ID") }),
});

router.patch(
  "/:postId/move",
  validate(moveTaskSchema),
  taskController.moveTask,
);
router.get(
  "/board/:campaignId",
  validate(boardViewSchema),
  taskController.getBoardView,
);

export default router;
