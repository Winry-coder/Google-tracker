import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { runDriveSync } from '@/lib/sync/reconcile';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes

/**
 * GET /api/cron/sync
 * Secure endpoint for scheduled sync
 * Requires CRON_SECRET header
 * Syncs all active campaigns
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Security Check: Only allow requests with the correct secret
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all active campaigns
    const campaigns = await prisma.campaign.findMany({
      where: { isActive: true },
    });

    if (campaigns.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active campaigns to sync',
        results: [],
      });
    }

    // Sync each campaign
    const results = [];
    for (const campaign of campaigns) {
      try {
        const result = await runDriveSync(
          campaign.folderId,
          campaign.id,
          campaign.ownerId || undefined
        );

        // Update campaign stats
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: {
            totalLeads: {
              increment: result.created.length,
            },
          },
        });

        results.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          ...result,
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error(`Failed to sync campaign ${campaign.name}:`, error);
        }
        results.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      campaignsSynced: campaigns.length,
      results,
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Cron job failed:', error);
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
