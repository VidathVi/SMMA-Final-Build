import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/api-error';

export interface CreatePostInput {
    content: string;
    campaignId: string;
    assignedToId?: string;
    dueDate?: string;
}

export class PostService {
    /**
     * Create a new post. Defaults to "Pending" status.
     */
    async create(data: CreatePostInput) {
        const campaign = await prisma.campaign.findUnique({ where: { id: data.campaignId } });
        if (!campaign) throw ApiError.notFound(`Campaign "${data.campaignId}" not found`);

        const pendingStatus = await prisma.postStatus.findUnique({ where: { name: 'Pending' } });
        if (!pendingStatus) throw ApiError.internal('Default post status "Pending" not found. Run seed.');

        if (data.assignedToId) {
            const user = await prisma.user.findUnique({ where: { id: data.assignedToId } });
            if (!user) throw ApiError.notFound(`User "${data.assignedToId}" not found`);
        }

        return prisma.post.create({
            data: {
                content: data.content,
                campaignId: data.campaignId,
                statusId: pendingStatus.id,
                assignedToId: data.assignedToId,
                dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            },
            include: {
                status: true,
                campaign: { select: { id: true, title: true } },
                assignedTo: { select: { id: true, name: true, email: true } },
            },
        });
    }

    /**
     * Assign a post to a user.
     */
    async assignToUser(postId: string, userId: string) {
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) throw ApiError.notFound(`Post "${postId}" not found`);

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw ApiError.notFound(`User "${userId}" not found`);

        return prisma.post.update({
            where: { id: postId },
            data: { assignedToId: userId },
            include: {
                status: true,
                campaign: { select: { id: true, title: true } },
                assignedTo: { select: { id: true, name: true, email: true } },
            },
        });
    }

    /**
     * Update the status of a post.
     */
    async updateStatus(postId: string, statusId: string) {
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) throw ApiError.notFound(`Post "${postId}" not found`);

        const status = await prisma.postStatus.findUnique({ where: { id: statusId } });
        if (!status) throw ApiError.notFound(`Post status "${statusId}" not found`);

        return prisma.post.update({
            where: { id: postId },
            data: { statusId },
            include: {
                status: true,
                campaign: { select: { id: true, title: true } },
                assignedTo: { select: { id: true, name: true, email: true } },
            },
        });
    }

    /**
     * Add or update the due date on a post.
     */
    async updateDueDate(postId: string, dueDate: string) {
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) throw ApiError.notFound(`Post "${postId}" not found`);

        return prisma.post.update({
            where: { id: postId },
            data: { dueDate: new Date(dueDate) },
            include: {
                status: true,
                campaign: { select: { id: true, title: true } },
                assignedTo: { select: { id: true, name: true, email: true } },
            },
        });
    }

    /**
     * Get all posts for a campaign.
     */
    async getByCampaign(campaignId: string) {
        const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
        if (!campaign) throw ApiError.notFound(`Campaign "${campaignId}" not found`);

        return prisma.post.findMany({
            where: { campaignId },
            include: {
                status: true,
                assignedTo: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}

export const postService = new PostService();
