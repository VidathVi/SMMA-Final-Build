import { prisma } from "../lib/prisma";

export class AnalyticsService {
  /**
   * Get overview KPIs: total posts, published, engagement, followers.
   */
  async getOverview() {
    const [totalPosts, publishedPosts, totalCampaigns, activeCampaigns] =
      await Promise.all([
        prisma.post.count(),
        prisma.post.count({ where: { publishedAt: { not: null } } }),
        prisma.campaign.count(),
        prisma.campaign.count({
          where: { status: { name: { in: ["Active", "In Progress"] } } },
        }),
      ]);

    // Get latest analytics snapshots for summary
    const latestMetrics = await prisma.analyticsSnapshot.findMany({
      orderBy: { date: "desc" },
      take: 20,
    });

    const followersByPlatform: Record<string, number> = {};
    const engagementByPlatform: Record<string, number> = {};

    for (const metric of latestMetrics) {
      if (metric.metricType === "followers") {
        followersByPlatform[metric.platform] = metric.value;
      }
      if (metric.metricType === "engagement") {
        engagementByPlatform[metric.platform] = metric.value;
      }
    }

    return {
      totalPosts,
      publishedPosts,
      totalCampaigns,
      activeCampaigns,
      followersByPlatform,
      engagementByPlatform,
      totalFollowers: Object.values(followersByPlatform).reduce(
        (sum, v) => sum + v,
        0
      ),
      avgEngagement:
        Object.values(engagementByPlatform).length > 0
          ? Object.values(engagementByPlatform).reduce((sum, v) => sum + v, 0) /
            Object.values(engagementByPlatform).length
          : 0,
    };
  }

  /**
   * Get time-series engagement data for charts.
   */
  async getEngagementTimeSeries(
    days: number = 30,
    platform?: string
  ) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: any = {
      date: { gte: startDate },
      metricType: { in: ["engagement", "reach", "impressions"] },
    };

    if (platform) {
      where.platform = platform;
    }

    const snapshots = await prisma.analyticsSnapshot.findMany({
      where,
      orderBy: { date: "asc" },
    });

    // Group by date
    const grouped: Record<
      string,
      { date: string; engagement: number; reach: number; impressions: number }
    > = {};

    for (const snap of snapshots) {
      const dateKey = snap.date.toISOString().split("T")[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = { date: dateKey, engagement: 0, reach: 0, impressions: 0 };
      }
      if (snap.metricType === "engagement") grouped[dateKey].engagement += snap.value;
      if (snap.metricType === "reach") grouped[dateKey].reach += snap.value;
      if (snap.metricType === "impressions") grouped[dateKey].impressions += snap.value;
    }

    return Object.values(grouped);
  }

  /**
   * Get top performing posts.
   */
  async getTopPosts(limit: number = 10) {
    return prisma.post.findMany({
      where: { publishedAt: { not: null } },
      include: {
        campaign: { select: { id: true, title: true } },
        status: true,
        publishLogs: {
          where: { status: "success" },
          select: { platform: true, publishedAt: true },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
  }

  /**
   * Record an analytics snapshot (used by background workers).
   */
  async recordSnapshot(data: {
    platform: string;
    metricType: string;
    value: number;
    date?: Date;
    metadata?: any;
  }) {
    return prisma.analyticsSnapshot.create({
      data: {
        platform: data.platform,
        metricType: data.metricType,
        value: data.value,
        date: data.date || new Date(),
        metadata: data.metadata || undefined,
      },
    });
  }
}

export const analyticsService = new AnalyticsService();
