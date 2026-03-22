import { Request, Response, NextFunction } from 'express';
import { calendarService } from '../services/calendar.service';

export class CalendarController {
    async getByDateRange(req: Request, res: Response, next: NextFunction) {
        try {
            const { startDate, endDate, campaignId } = req.query;
            const posts = await calendarService.getPostsByDateRange(
                new Date(startDate as string),
                new Date(endDate as string),
                campaignId as string | undefined
            );
            res.json({ success: true, data: posts });
        } catch (error) {
            next(error);
        }
    }

    async getByMonth(req: Request, res: Response, next: NextFunction) {
        try {
            const { year, month, campaignId } = req.query;
            const posts = await calendarService.getPostsByMonth(
                Number(year),
                Number(month),
                campaignId as string | undefined
            );
            res.json({ success: true, data: posts });
        } catch (error) {
            next(error);
        }
    }
}

export const calendarController = new CalendarController();
