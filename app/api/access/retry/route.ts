import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { grantPermissionForUser } from '@/lib/google/drive';
import { logger } from '@/lib/telemetry/logger';
import { processLeadAutomation } from '@/lib/automation/process-lead';

import { User } from '@/types/user';

export const dynamic = 'force-dynamic';

/**
 * POST /api/access/retry
 * Background worker endpoint to retry queued access grants
 */
export async function POST(request: Request) {
  try {
    // Optional: Secret key check for cron jobs
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Find users who are active but don't have access yet (queued)
    const queuedUsers = await prisma.user.findMany({
      where: {
        status: 'active',
        hasAccess: false,
        campaignId: { not: null },
        deletedAt: null,
      },
      include: {
        campaign: true,
      },
      take: 20, // Process in small batches
    });

    if (queuedUsers.length === 0) {
      return NextResponse.json({ success: true, message: 'No queued grants to process' });
    }

    const results = {
      success: 0,
      failed: 0,
    };

    for (const user of queuedUsers) {
      if (!user.campaign || !user.campaign.ownerId) continue;

      try {
        const result = await grantPermissionForUser(
          user.campaign.ownerId,
          user.campaign.folderId,
          user.email
        );

        await prisma.user.update({
          where: { id: user.id },
          data: {
            hasAccess: true,
            drivePermissionId: result.id,
            googleId: result.id,
          },
        });

        await prisma.auditLog.create({
          data: {
            eventType: 'access.granted',
            eventSource: 'retry_worker',
            newValue: JSON.stringify({ email: user.email, campaign: user.campaign.name }),
            performedBy: 'system',
            userId: user.id,
          },
        });

        // Trigger Automation
        await processLeadAutomation(user as unknown as User, user.campaignId!);
        results.success++;
      } catch (error) {
        logger.error(`Retry worker failed for user ${user.email}`, error as Error);
        results.failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${queuedUsers.length} queued grants`,
      data: results,
    });
  } catch (error) {
    logger.error('Retry worker failed', error as Error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
