import { getDriveForUser } from './client';
import { prisma } from '@/lib/prisma/client';
import { logger } from '@/lib/telemetry/logger';

/**
 * Registers a Google Drive watch channel for a campaign's folder
 */
export async function registerFolderWatch(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { owner: true },
  });

  if (!campaign || !campaign.ownerId || !campaign.folderId) {
    throw new Error('Campaign not found or missing required fields for watch registration');
  }

  const drive = await getDriveForUser(campaign.ownerId);

  const webhookUrl = `${process.env.NEXTAUTH_URL}/api/webhooks/google-drive`;
  
  // Create a unique ID for this channel
  const channelId = `watch-${campaign.id}-${Date.now()}`;

  try {
    const response = await drive.files.watch({
      fileId: campaign.folderId,
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address: webhookUrl,
        // Optional: token for verification
        token: `campaignId=${campaign.id}`,
        // Expiration: maximum allowed by Google is usually 24 hours for files, 
        // but folders might be different. Let's set it to 1 day.
        expiration: (Date.now() + 86400000).toString(), 
      },
    });

    if (response.data.id && response.data.resourceId) {
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: {
          watchChannelId: response.data.id,
          watchResourceId: response.data.resourceId,
          watchExpiration: response.data.expiration 
            ? new Date(parseInt(response.data.expiration)) 
            : new Date(Date.now() + 86400000),
        },
      });

      logger.info('Google Drive watch registered successfully', {
        campaignId,
        channelId: response.data.id,
        resourceId: response.data.resourceId,
      });

      return response.data;
    }
    return null;
  } catch (error) {
    logger.error('Failed to register Google Drive watch', error as Error, { campaignId });
    throw error;
  }
}

/**
 * Stops a Google Drive watch channel
 */
export async function stopFolderWatch(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign || !campaign.watchChannelId || !campaign.watchResourceId || !campaign.ownerId) {
    return;
  }

  const drive = await getDriveForUser(campaign.ownerId);

  try {
    await drive.channels.stop({
      requestBody: {
        id: campaign.watchChannelId,
        resourceId: campaign.watchResourceId,
      },
    });

    await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        watchChannelId: null,
        watchResourceId: null,
        watchExpiration: null,
      },
    });

    logger.info('Google Drive watch stopped successfully', {
      campaignId,
      channelId: campaign.watchChannelId,
      resourceId: campaign.watchResourceId,
    });
  } catch (error) {
    logger.error('Failed to stop Google Drive watch', error as Error, { campaignId });
  }
}
