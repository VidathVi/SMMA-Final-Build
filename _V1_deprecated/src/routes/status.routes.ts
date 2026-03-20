import { Router } from 'express';
import { z } from 'zod';
import { statusController } from '../controllers/status.controller';
import { validate } from '../middleware/validate';

const router = Router();

const createPostStatusSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().optional(),
        displayOrder: z.number().int().min(0).optional(),
    }),
});

const createCampaignStatusSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().optional(),
    }),
});

// Post statuses
router.get('/posts', statusController.getPostStatuses);
router.post('/posts', validate(createPostStatusSchema), statusController.createPostStatus);

// Campaign statuses
router.get('/campaigns', statusController.getCampaignStatuses);
router.post('/campaigns', validate(createCampaignStatusSchema), statusController.createCampaignStatus);

export default router;
