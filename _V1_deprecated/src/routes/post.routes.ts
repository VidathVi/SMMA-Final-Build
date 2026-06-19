import { Router } from "express";
import { z } from "zod";
import { postController } from "../controllers/post.controller";
import { validate } from "../middleware/validate";

const router = Router();

// ─── Validation Schemas ─────────────────────────────────────────────────

const createPostSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Content is required"),
    campaignId: z.string().uuid("Invalid campaign ID"),
    assignedToId: z.string().uuid("Invalid user ID").optional(),
    dueDate: z.string().datetime().optional(),
  }),
});

const assignPostSchema = z.object({
  params: z.object({ id: z.string().uuid("Invalid post ID") }),
  body: z.object({ userId: z.string().uuid("Invalid user ID") }),
});

const updateStatusSchema = z.object({
  params: z.object({ id: z.string().uuid("Invalid post ID") }),
  body: z.object({ statusId: z.string().uuid("Invalid status ID") }),
});

const updateDueDateSchema = z.object({
  params: z.object({ id: z.string().uuid("Invalid post ID") }),
  body: z.object({ dueDate: z.string().datetime("Invalid date format") }),
});

const campaignIdParamSchema = z.object({
  params: z.object({ campaignId: z.string().uuid("Invalid campaign ID") }),
});

// ─── Routes ─────────────────────────────────────────────────────────────

router.post("/", validate(createPostSchema), postController.create);
router.patch(
  "/:id/assign",
  validate(assignPostSchema),
  postController.assignToUser,
);
router.patch(
  "/:id/status",
  validate(updateStatusSchema),
  postController.updateStatus,
);
router.patch(
  "/:id/due-date",
  validate(updateDueDateSchema),
  postController.updateDueDate,
);

export default router;
