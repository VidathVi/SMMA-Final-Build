import { prisma } from '../lib/prisma';

export class CalendarService {
    /**
     * Get all posts whose dueDate falls within [startDate, endDate].
     * Optionally filter by campaignId.
     */
    async getPostsByDateRange(startDate: Date, endDate: Date, campaignId?: string) {
        const where: any = {
            dueDate: {
                gte: startDate,
                lte: endDate,
            },
        };

        if (campaignId) {
            where.campaignId = campaignId;
        }

        return prisma.post.findMany({
            where,
            include: {
                status: true,
                campaign: { select: { id: true, title: true } },
                assignedTo: { select: { id: true, name: true, email: true } },
            },
            orderBy: { dueDate: 'asc' },
        });
    }

    /**
     * Convenience method: get all posts for a given calendar month.
     */
    async getPostsByMonth(year: number, month: number, campaignId?: string) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        return this.getPostsByDateRange(startDate, endDate, campaignId);
    }
}

export const calendarService = new CalendarService();
