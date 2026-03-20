import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/api-error';

export class TaskService {
    /**
     * Move a post (task) to a different status column.
     */
    async moveTask(postId: string, targetStatusId: string) {
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { status: true },
        });
        if (!post) throw ApiError.notFound(`Post "${postId}" not found`);

        const targetStatus = await prisma.postStatus.findUnique({ where: { id: targetStatusId } });
        if (!targetStatus) throw ApiError.notFound(`Status "${targetStatusId}" not found`);

        if (post.statusId === targetStatusId) {
            throw ApiError.badRequest(`Post is already in "${targetStatus.name}" status`);
        }

        return prisma.post.update({
            where: { id: postId },
            data: { statusId: targetStatusId },
            include: {
                status: true,
                campaign: { select: { id: true, title: true } },
                assignedTo: { select: { id: true, name: true, email: true } },
            },
        });
    }

    /**
     * Get a Kanban-style board view: posts grouped by status columns for a campaign.
     */
    async getBoardView(campaignId: string) {
        const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
        if (!campaign) throw ApiError.notFound(`Campaign "${campaignId}" not found`);

        const statuses = await prisma.postStatus.findMany({
            orderBy: { displayOrder: 'asc' },
        });

        const posts = await prisma.post.findMany({
            where: { campaignId },
            include: {
                status: true,
                assignedTo: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'asc' },
        });

        // Group posts by status
        const board = statuses.map((status) => ({
            status: {
                id: status.id,
                name: status.name,
                displayOrder: status.displayOrder,
            },
            posts: posts.filter((p) => p.statusId === status.id),
        }));

        return {
            campaignId,
            campaignTitle: campaign.title,
            columns: board,
        };
    }
}

export const taskService = new TaskService();
