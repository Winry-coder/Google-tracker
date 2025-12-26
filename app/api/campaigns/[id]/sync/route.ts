import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { runDriveSync } from '@/lib/sync/reconcile';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes

// POST /api/campaigns/[id]/sync
export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get campaign
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (!campaign.isActive) {
      return NextResponse.json(
        { error: 'Campaign is not active' },
        { status: 400 }
      );
    }

    // Run sync for this campaign's folder with campaign ID
    const result = await runDriveSync(campaign.folderId, campaign.id);

    // Update campaign stats
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        totalLeads: {
          increment: result.created.length,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error syncing campaign:', error);
    }
    return NextResponse.json(
      { error: 'Failed to sync campaign' },
      { status: 500 }
    );
  }
}
