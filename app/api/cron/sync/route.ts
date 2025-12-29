import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { runDriveSync } from '@/lib/sync/reconcile';
import { logger } from '@/lib/telemetry/logger';

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

    // Sync each campaign in parallel for 10/10 performance
    const results = await Promise.allSettled(
      campaigns.map(async (campaign) => {
        try {
          // Enforce per-owner context: campaigns without an owner are skipped
          if (!campaign.ownerId) {
            logger.warn('Skipping campaign without ownerId during cron sync', {
              campaignId: campaign.id,
              campaignName: campaign.name,
            });
            return {
              campaignId: campaign.id,
              campaignName: campaign.name,
              success: false,
              error:
                'Campaign has no owner configured; cannot sync without per-user Google tokens.',
            };
          }

          const result = await runDriveSync(
            campaign.folderId,
            campaign.id,
            campaign.ownerId
          );

          // Update campaign stats with Absolute Truth (prisma.user.count)
          const actualLeadCount = await prisma.user.count({
            where: { campaignId: campaign.id, deletedAt: null },
          });

          await prisma.campaign.update({
            where: { id: campaign.id },
            data: {
              totalLeads: actualLeadCount,
            },
          });

          return {
            campaignId: campaign.id,
            campaignName: campaign.name,
            ...result,
          };
        } catch (error) {
          logger.error(
            'Failed to sync campaign during cron job',
            error as Error,
            {
              campaignId: campaign.id,
              campaignName: campaign.name,
            }
          );
          return {
            campaignId: campaign.id,
            campaignName: campaign.name,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    // Format settled results for the response
    const formattedResults = results.map((res, index) => {
      if (res.status === 'fulfilled') {
        return res.value;
      } else {
        const campaign = campaigns[index];
        return {
          campaignId: campaign.id,
          campaignName: campaign.name,
          success: false,
          error:
            res.reason instanceof Error ? res.reason.message : 'Unknown error',
        };
      }
    });

    return NextResponse.json({
      success: true,
      campaignsSynced: campaigns.length,
      results: formattedResults,
    });
  } catch (error) {
    logger.error('Cron job failed', error as Error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
