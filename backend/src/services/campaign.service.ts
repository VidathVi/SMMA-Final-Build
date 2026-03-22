import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/api-error';

export interface CreateCampaignInput {
    title: string;
    description?: string;
    createdById: string;
    startDate?: string;
    endDate?: string;
}

export interface UpdateCampaignInput {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

export class CampaignService {
    /**
     * Create a new campaign. Defaults to "Draft" status.
     */
    async create(data: CreateCampaignInput) {
        const draftStatus = await prisma.campaignStatus.findUnique({ where: { name: 'Draft' } });
        if (!draftStatus) throw ApiError.internal('Default campaign status "Draft" not found. Run seed.');

        const user = await prisma.user.findUnique({ where: { id: data.createdById } });
        if (!user) throw ApiError.notFound(`User "${data.createdById}" not found`);

        return prisma.campaign.create({
            data: {
                title: data.title,
                description: data.description,
                statusId: draftStatus.id,
                createdById: data.createdById,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
            include: { status: true, createdBy: { select: { id: true, name: true, email: true } } },
        });
    }

    /**
     * Update campaign details (title, description, dates).
     */
    async update(id: string, data: UpdateCampaignInput) {
        const campaign = await prisma.campaign.findUnique({ where: { id } });
        if (!campaign) throw ApiError.notFound(`Campaign "${id}" not found`);

        return prisma.campaign.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
            include: { status: true, createdBy: { select: { id: true, name: true, email: true } } },
        });
    }

    /**
     * Delete a campaign by ID (cascades to posts).
     */
    async delete(id: string) {
        const campaign = await prisma.campaign.findUnique({ where: { id } });
        if (!campaign) throw ApiError.notFound(`Campaign "${id}" not found`);

        // Delete associated posts first, then the campaign
        await prisma.post.deleteMany({ where: { campaignId: id } });
        await prisma.campaign.delete({ where: { id } });

        return { message: 'Campaign deleted successfully' };
    }

    /**
     * Get campaigns with optional filtering by userId or role name.
     */
    async getAll(filters?: { userId?: string; role?: string }) {
        const where: any = {};

        if (filters?.userId) {
            where.createdById = filters.userId;
        }

        if (filters?.role) {
            where.createdBy = {
                role: { name: filters.role },
            };
        }

        return prisma.campaign.findMany({
            where,
            include: {
                status: true,
                createdBy: { select: { id: true, name: true, email: true, role: true } },
                _count: { select: { posts: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Get a single campaign by ID.
     */
    async getById(id: string) {
        const campaign = await prisma.campaign.findUnique({
            where: { id },
            include: {
                status: true,
                createdBy: { select: { id: true, name: true, email: true, role: true } },
                posts: {
                    include: {
                        status: true,
                        assignedTo: { select: { id: true, name: true, email: true } },
                    },
                },
            },
        });

        if (!campaign) throw ApiError.notFound(`Campaign "${id}" not found`);
        return campaign;
    }

    /**
     * Change the campaign's status.
     */
    async changeStatus(id: string, statusId: string) {
        const campaign = await prisma.campaign.findUnique({ where: { id } });
        if (!campaign) throw ApiError.notFound(`Campaign "${id}" not found`);

        const status = await prisma.campaignStatus.findUnique({ where: { id: statusId } });
        if (!status) throw ApiError.notFound(`Campaign status "${statusId}" not found`);

        return prisma.campaign.update({
            where: { id },
            data: { statusId },
            include: { status: true, createdBy: { select: { id: true, name: true, email: true } } },
        });
    }
}

export const campaignService = new CampaignService();
