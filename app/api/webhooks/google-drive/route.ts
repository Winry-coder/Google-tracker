import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma/client';
import { runDriveSync } from '@/lib/sync/reconcile';
import { logger } from '@/lib/telemetry/logger';

/**
 * POST /api/webhooks/google-drive
 * Receives push notifications from Google Drive when a folder changes
 */
export async function POST(_request: Request) {
  const headersList = headers();
  
  // Google Drive Webhook Headers
  const channelId = headersList.get('x-goog-channel-id');
  const resourceId = headersList.get('x-goog-resource-id');
  const resourceState = headersList.get('x-goog-resource-state'); // 'sync', 'add', 'remove', 'update', 'trash', etc.
  
  // If it's a sync notification, just acknowledge it
  if (resourceState === 'sync') {
    return new Response('OK', { status: 200 });
  }

  logger.info('Received Google Drive push notification', {
    channelId,
    resourceId,
    resourceState,
  });

  if (!channelId || !resourceId) {
    return new Response('Missing headers', { status: 400 });
  }

  try {
    // Find the campaign associated with this channel
    const campaign = await prisma.campaign.findFirst({
      where: {
        watchChannelId: channelId,
        watchResourceId: resourceId,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!campaign) {
      logger.warn('Received webhook for unknown or inactive campaign', { channelId, resourceId });
      // We should return 200 to Google so they don't keep retrying, 
      // but we might want to stop the watch if it's truly dead.
      return new Response('Campaign not found', { status: 200 });
    }

    if (!campaign.ownerId) {
       logger.error('Campaign has no owner, cannot sync via webhook', undefined, { campaignId: campaign.id });
       return new Response('Missing owner', { status: 200 });
    }

    // Trigger an instant sync
    logger.info('Triggering instant sync via webhook', { 
      campaignId: campaign.id, 
      campaignName: campaign.name 
    });

    // Run sync in the background
    (async () => {
      try {
        const result = await runDriveSync(
          campaign.folderId,
          campaign.id,
          campaign.ownerId || undefined
        );

        // Update campaign stats
        const actualLeadCount = await prisma.user.count({
          where: { campaignId: campaign.id, deletedAt: null },
        });

        await prisma.campaign.update({
          where: { id: campaign.id },
          data: { totalLeads: actualLeadCount },
        });

        logger.info('Webhook-triggered sync completed', {
          campaignId: campaign.id,
          created: result.created.length,
          updated: result.updated.length,
          revoked: result.revoked.length,
        });
      } catch (error) {
        logger.error('Webhook-triggered sync failed', error as Error, { campaignId: campaign.id });
      }
    })();

    return new Response('OK', { status: 200 });
  } catch (error) {
    logger.error('Error processing Google Drive webhook', error as Error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
