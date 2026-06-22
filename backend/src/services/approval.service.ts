import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/api-error";

export class ApprovalService {
  /**
   * Get all posts that are in review status (pending approval).
   */
  async getPendingApprovals(statusFilter?: string) {
    const where: any = {};

    if (statusFilter) {
      where.status = { name: statusFilter };
    } else {
      where.status = { name: { in: ["In Review", "Pending", "Changes Requested"] } };
    }

    return prisma.post.findMany({
      where,
      include: {
        status: true,
        campaign: { select: { id: true, title: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        approvalComments: {
          include: {
            author: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { approvalComments: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  /**
   * Approve or reject a post.
   */
  async updateApprovalStatus(
    postId: string,
    action: "approve" | "reject" | "request_changes",
    authorId: string,
    comment?: string
  ) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw ApiError.notFound(`Post "${postId}" not found`);

    const statusMap: Record<string, string> = {
      approve: "Approved",
      reject: "Rejected",
      request_changes: "Changes Requested",
    };

    const targetStatusName = statusMap[action];
    let targetStatus = await prisma.campaignStatus.findUnique({
      where: { name: targetStatusName },
    });

    // Try PostStatus instead
    const postStatus = await prisma.postStatus.findUnique({
      where: { name: targetStatusName },
    });

    if (!postStatus) {
      // Create the status if it doesn't exist
      await prisma.postStatus.create({
        data: { name: targetStatusName, displayOrder: 99 },
      });
    }

    const finalStatus = await prisma.postStatus.findUnique({
      where: { name: targetStatusName },
    });

    if (!finalStatus) {
      throw ApiError.internal(`Could not find or create status "${targetStatusName}"`);
    }

    // Update post status and add comment
    const [updatedPost] = await prisma.$transaction([
      prisma.post.update({
        where: { id: postId },
        data: { statusId: finalStatus.id },
        include: {
          status: true,
          campaign: { select: { id: true, title: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
        },
      }),
      ...(comment
        ? [
            prisma.approvalComment.create({
              data: {
                postId,
                authorId,
                content: comment,
                action,
              },
            }),
          ]
        : []),
    ]);

    return updatedPost;
  }

  /**
   * Add a comment to a post's approval thread.
   */
  async addComment(postId: string, authorId: string, content: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw ApiError.notFound(`Post "${postId}" not found`);

    return prisma.approvalComment.create({
      data: {
        postId,
        authorId,
        content,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Get all comments for a post.
   */
  async getComments(postId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw ApiError.notFound(`Post "${postId}" not found`);

    return prisma.approvalComment.findMany({
      where: { postId },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  }
}

export const approvalService = new ApprovalService();
