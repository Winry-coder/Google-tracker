import { prisma } from '@/lib/prisma/client';
import { subDays, startOfDay, endOfDay } from 'date-fns';

export interface OverviewStats {
  totalLeads: number;
  newLeads7d: number;
  newLeads30d: number;
  growthRate: number;
  sources: {
    source: string;
    count: number;
  }[];
  topCampaigns: {
    name: string;
    count: number;
  }[];
}

/**
 * Fetches overview statistics for the analytics dashboard
 */
export async function getOverviewStats(): Promise<OverviewStats> {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);
  const sixtyDaysAgo = subDays(now, 60);

  // 1. Total Leads
  const totalLeads = await prisma.user.count();

  // 2. New Leads (Last 30 Days)
  const newLeads30d = await prisma.user.count({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  // 3. New Leads (Last 7 Days)
  const newLeads7d = await prisma.user.count({
    where: {
      createdAt: {
        gte: subDays(now, 7),
      },
    },
  });

  // 4. Calculate Growth Rate (Current 30d vs Previous 30d)
  const prevLeads30d = await prisma.user.count({
    where: {
      createdAt: {
        gte: sixtyDaysAgo,
        lt: thirtyDaysAgo,
      },
    },
  });

  let growthRate = 0;
  if (prevLeads30d > 0) {
    growthRate = ((newLeads30d - prevLeads30d) / prevLeads30d) * 100;
  } else if (newLeads30d > 0) {
    growthRate = 100; // 100% growth if there were 0 leads before
  }

  // 5. Source Breakdown
  const sourcesGrouped = await prisma.user.groupBy({
    by: ['source'],
    _count: {
      source: true,
    },
  });

  const sources = sourcesGrouped.map((s: { source: string; _count: { source: number } }) => ({
    source: s.source || 'unknown',
    count: s._count.source,
  }));

  // 6. Top Campaigns
  const campaignsGrouped = await prisma.campaign.findMany({
    where: { deletedAt: null },
    select: {
      name: true,
      _count: {
        select: { users: true },
      },
    },
    orderBy: {
      users: {
        _count: 'desc',
      },
    },
    take: 3,
  });

  const topCampaigns = campaignsGrouped.map((c: { name: string; _count: { users: number } }) => ({
    name: c.name,
    count: c._count.users,
  }));

  return {
    totalLeads,
    newLeads7d,
    newLeads30d,
    growthRate,
    sources,
    topCampaigns,
  };
}

/**
 * Fetches time-series data for lead growth
 */
export async function getTimelineData(days: number = 7) {
  const result = [];

  for (let i = days - 1; i >= 0; i--) {
    const targetDate = subDays(new Date(), i);
    const start = startOfDay(targetDate);
    const end = endOfDay(targetDate);

    const count = await prisma.user.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    result.push({
      date: start.toISOString().split('T')[0],
      count,
    });
  }

  return result;
}

/**
 * Fetches detailed analytics for all campaigns
 */
export async function getCampaignsAnalytics() {
  const thirtyDaysAgo = subDays(new Date(), 30);

  const campaigns = await prisma.campaign.findMany({
    where: { deletedAt: null },
    include: {
      _count: {
        select: { users: true },
      },
      variants: {
        select: {
          id: true,
          name: true,
          viewCount: true,
          _count: {
            select: { users: true },
          },
        },
      },
      users: {
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return campaigns.map((campaign: any) => {
    const totalLeads = campaign._count.users;
    const newLeads30d = campaign.users.length;

    // Simple growth calculation for the campaign
    const growth = totalLeads > 0 ? (newLeads30d / totalLeads) * 100 : 0;

    // Calculate variant metrics
    const variants = (campaign.variants || []).map((v: any) => {
      const conversionCount = v._count.users;
      const conversionRate = v.viewCount > 0 ? (conversionCount / v.viewCount) * 100 : 0;
      
      return {
        id: v.id,
        name: v.name,
        viewCount: v.viewCount,
        conversionCount,
        conversionRate: Math.round(conversionRate * 10) / 10,
      };
    });

    return {
      id: campaign.id,
      name: campaign.name,
      slug: campaign.slug,
      isActive: campaign.isActive,
      totalLeads,
      newLeads30d,
      growth: Math.round(growth * 10) / 10,
      lastUpdated: campaign.updatedAt,
      variants,
    };
  });
}
