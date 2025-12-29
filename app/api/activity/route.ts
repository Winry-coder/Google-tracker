import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    const where: Record<string, unknown> = {};
    if (campaignId) {
      where.user = {
        campaignId: campaignId,
      };
    }

    const activities = await prisma.auditLog.findMany({
      where,
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            company: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: activities,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}
