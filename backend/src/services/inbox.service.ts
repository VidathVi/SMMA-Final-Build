import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/api-error";

export class InboxService {
  /**
   * Get all inbox messages with optional filtering.
   */
  async getMessages(filter?: {
    type?: string;
    platform?: string;
    isRead?: boolean;
    search?: string;
  }) {
    const where: any = {};

    if (filter?.type && filter.type !== "all") {
      where.messageType = filter.type;
    }

    if (filter?.platform) {
      where.platform = filter.platform;
    }

    if (filter?.isRead !== undefined) {
      where.isRead = filter.isRead;
    }

    if (filter?.search) {
      where.OR = [
        { senderName: { contains: filter.search, mode: "insensitive" } },
        { content: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    return prisma.inboxMessage.findMany({
      where,
      include: {
        replies: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Send a reply to a message.
   */
  async sendReply(messageId: string, content: string) {
    const message = await prisma.inboxMessage.findUnique({
      where: { id: messageId },
    });
    if (!message)
      throw ApiError.notFound(`Message "${messageId}" not found`);

    // Create the reply in the database
    const reply = await prisma.inboxReply.create({
      data: {
        messageId,
        content,
        direction: "outbound",
      },
    });

    // TODO: Dispatch reply to the actual social platform API
    // This would call the appropriate social media API based on message.platform

    return reply;
  }

  /**
   * Mark a message as read.
   */
  async markAsRead(messageId: string) {
    const message = await prisma.inboxMessage.findUnique({
      where: { id: messageId },
    });
    if (!message)
      throw ApiError.notFound(`Message "${messageId}" not found`);

    return prisma.inboxMessage.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }

  /**
   * Mark multiple messages as read.
   */
  async markAllAsRead() {
    return prisma.inboxMessage.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
  }

  /**
   * Get unread message count.
   */
  async getUnreadCount() {
    return prisma.inboxMessage.count({
      where: { isRead: false },
    });
  }
}

export const inboxService = new InboxService();
