import { Router } from "express";
import { z } from "zod";
import { campaignController } from "../controllers/campaign.controller";
import { validate } from "../middleware/validate";

const router = Router();

// ─── Validation Schemas ─────────────────────────────────────────────────

const createCampaignSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    createdById: z.string().uuid("Invalid user ID"),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

const updateCampaignSchema = z.object({
  params: z.object({ id: z.string().uuid("Invalid campaign ID") }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

const changeStatusSchema = z.object({
  params: z.object({ id: z.string().uuid("Invalid campaign ID") }),
  body: z.object({ statusId: z.string().uuid("Invalid status ID") }),
});

const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid("Invalid campaign ID") }),
});

// ─── Routes ─────────────────────────────────────────────────────────────

router.post("/", validate(createCampaignSchema), campaignController.create);
router.get("/", campaignController.getAll);
router.get("/:id", validate(idParamSchema), campaignController.getById);
router.put("/:id", validate(updateCampaignSchema), campaignController.update);
router.delete("/:id", validate(idParamSchema), campaignController.delete);
router.patch(
  "/:id/status",
  validate(changeStatusSchema),
  campaignController.changeStatus,
);

export default router;
