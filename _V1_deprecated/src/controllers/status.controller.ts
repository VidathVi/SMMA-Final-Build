import { Request, Response, NextFunction } from 'express';
import { statusService } from '../services/status.service';

export class StatusController {
    async getPostStatuses(_req: Request, res: Response, next: NextFunction) {
        try {
            const statuses = await statusService.getPostStatuses();
            res.json({ success: true, data: statuses });
        } catch (error) {
            next(error);
        }
    }

    async createPostStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, displayOrder } = req.body;
            const status = await statusService.createPostStatus(name, description, displayOrder);
            res.status(201).json({ success: true, data: status });
        } catch (error) {
            next(error);
        }
    }

    async getCampaignStatuses(_req: Request, res: Response, next: NextFunction) {
        try {
            const statuses = await statusService.getCampaignStatuses();
            res.json({ success: true, data: statuses });
        } catch (error) {
            next(error);
        }
    }

    async createCampaignStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description } = req.body;
            const status = await statusService.createCampaignStatus(name, description);
            res.status(201).json({ success: true, data: status });
        } catch (error) {
            next(error);
        }
    }
}

export const statusController = new StatusController();
