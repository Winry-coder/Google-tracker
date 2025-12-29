import { NextResponse } from 'next/server';
import { runDriveSync } from '@/lib/sync/reconcile';
import { triggerSyncSchema } from '@/lib/validations/sync.schema';
import { logger } from '@/lib/telemetry/logger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma/client';
import type { APIResponse } from '@/types/api';
import type { SyncResult } from '@/types/sync';

/**
 * POST /api/sync
 * Triggers a manual Drive sync operation.
 *
 * Behaviour:
 * - If a campaignId is provided in the body, only that campaign is synced.
 * - If no campaignId is provided, ALL active campaigns are synced.
 *
 * In all cases, syncs run in the context of each campaign's owner
 * (per-user Google OAuth), not a global folder env var.
 */
export async function POST(
  request: Request
): Promise<NextResponse<APIResponse<SyncResult>>> {
  try {
    // Allow Playwright E2E tests to bypass auth when this env flag is set.
    if (process.env.PLAYWRIGHT_BYPASS_AUTH !== '1') {
      const session = await getServerSession(authOptions);
      if (!session?.user || session.user.role !== 'admin') {
        return NextResponse.json(
          { success: false, error: 'Forbidden' },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { campaignId } = triggerSyncSchema.parse(body);

    // Helper to run sync for a single campaign and update its stats
    const syncCampaign = async (id: string) => {
      const campaign = await prisma.campaign.findUnique({
        where: { id, deletedAt: null },
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      if (!campaign.isActive) {
        throw new Error('Campaign is not active');
      }

      logger.info('Starting manual campaign sync', {
        campaignId: campaign.id,
        folderId: campaign.folderId,
      });

      const result = await runDriveSync(
        campaign.folderId,
        campaign.id,
        campaign.ownerId || undefined
      );

      await prisma.campaign.update({
        where: { id: campaign.id },
        data: {
          totalLeads: {
            increment: result.created.length,
          },
        },
      });

      return { campaign, result };
    };

    // If a specific campaignId is provided, sync just that one
    if (campaignId) {
      const { campaign, result } = await syncCampaign(campaignId);

      logger.info('Manual campaign sync completed', {
        campaignId: campaign.id,
        created: result.created.length,
        updated: result.updated.length,
        revoked: result.revoked.length,
        duration: result.duration,
      });

      return NextResponse.json({
        success: true,
        data: result,
        message: `Sync completed for campaign "${campaign.name}"`,
      });
    }

    // Otherwise, sync all active campaigns
    const campaigns = await prisma.campaign.findMany({
      where: { isActive: true, deletedAt: null },
    });

    if (campaigns.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          success: true,
          created: [],
          updated: [],
          revoked: [],
          duration: 0,
          timestamp: new Date().toISOString(),
        },
        message: 'No active campaigns to sync',
      });
    }

    const aggregated: SyncResult = {
      success: true,
      created: [],
      updated: [],
      revoked: [],
      duration: 0,
      timestamp: new Date().toISOString(),
      errors: [],
    };

    for (const campaign of campaigns) {
      try {
        const { result } = await syncCampaign(campaign.id);

        aggregated.created.push(...result.created);
        aggregated.updated.push(...result.updated);
        aggregated.revoked.push(...result.revoked);
        aggregated.duration += result.duration;
        if (result.errors && result.errors.length > 0) {
          aggregated.errors?.push(...result.errors);
        }
      } catch (error) {
        logger.error('Manual sync failed for campaign', error as Error);
        aggregated.success = false;
        aggregated.errors?.push({
          message:
            error instanceof Error ? error.message : 'Unknown campaign error',
        });
      }
    }

    logger.info('Manual multi-campaign sync completed', {
      campaignsSynced: campaigns.length,
      created: aggregated.created.length,
      updated: aggregated.updated.length,
      revoked: aggregated.revoked.length,
      duration: aggregated.duration,
      hasErrors: aggregated.errors && aggregated.errors.length > 0,
    });

    return NextResponse.json({
      success: true,
      data: aggregated,
      message: 'Sync completed for active campaigns',
    });
  } catch (error) {
    logger.error('Sync failed', error as Error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      },
      { status: 500 }
    );
  }
}
