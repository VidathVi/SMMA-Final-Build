import { Router } from "express";
import { z } from "zod";
import { calendarController } from "../controllers/calendar.controller";
import { validate } from "../middleware/validate";

const router = Router();

// ─── Validation Schemas ─────────────────────────────────────────────────

const dateRangeSchema = z.object({
  query: z.object({
    startDate: z.string().datetime("Invalid start date format"),
    endDate: z.string().datetime("Invalid end date format"),
    campaignId: z.string().uuid("Invalid campaign ID").optional(),
  }),
});

const monthSchema = z.object({
  query: z.object({
    year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
    month: z.string().regex(/^(1[0-2]|[1-9])$/, "Month must be 1-12"),
    campaignId: z.string().uuid("Invalid campaign ID").optional(),
  }),
});

// ─── Routes ─────────────────────────────────────────────────────────────

// GET /api/calendar?startDate=...&endDate=...&campaignId=...
router.get("/", validate(dateRangeSchema), calendarController.getByDateRange);

// GET /api/calendar/month?year=2026&month=3&campaignId=...
router.get("/month", validate(monthSchema), calendarController.getByMonth);

export default router;
