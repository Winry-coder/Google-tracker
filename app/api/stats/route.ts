import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { subDays } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const now = new Date();
    const sevenDaysAgo = subDays(now, 7);
    const fourteenDaysAgo = subDays(now, 14);

    // Get total users now
    const totalUsers = await prisma.user.count();

    // Get users from 7 days ago
    const usersCreatedLast7Days = await prisma.user.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    });

    const usersCreatedPrevious7Days = await prisma.user.count({
      where: {
        createdAt: {
          gte: fourteenDaysAgo,
          lt: sevenDaysAgo,
        },
      },
    });

    // Calculate growth
    let userGrowth = 0;
    if (usersCreatedPrevious7Days > 0) {
      userGrowth =
        ((usersCreatedLast7Days - usersCreatedPrevious7Days) /
          usersCreatedPrevious7Days) *
        100;
    } else if (usersCreatedLast7Days > 0) {
      userGrowth = 100;
    }

    // Get active access
    const activeAccess = await prisma.user.count({
      where: { status: 'active', hasAccess: true },
    });

    // Get campaign stats (conversion rates)
    const campaigns = await prisma.campaign.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        viewCount: true,
        users: {
          where: { createdAt: { gte: sevenDaysAgo } },
        },
        _count: {
          select: { users: true },
        },
      },
    });

    const totalViews = campaigns.reduce(
      (acc: number, c) => acc + (c.viewCount || 0),
      0
    );
    const totalLeads = campaigns.reduce(
      (acc: number, c) => acc + c._count.users,
      0
    );
    const conversionRate = totalViews > 0 ? (totalLeads / totalViews) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        userGrowth,
        activeAccess,
        totalLeads,
        totalViews,
        conversionRate,
        campaignCount: campaigns.length,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
