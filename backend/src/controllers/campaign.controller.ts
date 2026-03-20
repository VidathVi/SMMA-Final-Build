import { Request, Response, NextFunction } from 'express';
import { campaignService } from '../services/campaign.service';

export class CampaignController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const campaign = await campaignService.create(req.body);
            res.status(201).json({ success: true, data: campaign });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const campaign = await campaignService.update(req.params.id as string, req.body);
            res.json({ success: true, data: campaign });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await campaignService.delete(req.params.id as string);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, role } = req.query;
            const campaigns = await campaignService.getAll({
                userId: userId as string | undefined,
                role: role as string | undefined,
            });
            res.json({ success: true, data: campaigns });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const campaign = await campaignService.getById(req.params.id as string);
            res.json({ success: true, data: campaign });
        } catch (error) {
            next(error);
        }
    }

    async changeStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const campaign = await campaignService.changeStatus(req.params.id as string, req.body.statusId);
            res.json({ success: true, data: campaign });
        } catch (error) {
            next(error);
        }
    }
}

export const campaignController = new CampaignController();
