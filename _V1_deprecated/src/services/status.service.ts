import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/api-error';

export class StatusService {
    /**
     * Get all post status columns, ordered by displayOrder.
     */
    async getPostStatuses() {
        return prisma.postStatus.findMany({
            orderBy: { displayOrder: 'asc' },
        });
    }

    /**
     * Create a new post status column.
     */
    async createPostStatus(name: string, description?: string, displayOrder?: number) {
        const existing = await prisma.postStatus.findUnique({ where: { name } });
        if (existing) throw ApiError.conflict(`Post status "${name}" already exists`);

        // Auto-assign displayOrder to end if not provided
        if (displayOrder === undefined) {
            const last = await prisma.postStatus.findFirst({ orderBy: { displayOrder: 'desc' } });
            displayOrder = (last?.displayOrder ?? -1) + 1;
        }

        return prisma.postStatus.create({
            data: { name, description, displayOrder },
        });
    }

    /**
     * Get all campaign status columns.
     */
    async getCampaignStatuses() {
        return prisma.campaignStatus.findMany({
            orderBy: { createdAt: 'asc' },
        });
    }

    /**
     * Create a new campaign status column.
     */
    async createCampaignStatus(name: string, description?: string) {
        const existing = await prisma.campaignStatus.findUnique({ where: { name } });
        if (existing) throw ApiError.conflict(`Campaign status "${name}" already exists`);

        return prisma.campaignStatus.create({
            data: { name, description },
        });
    }
}

export const statusService = new StatusService();
