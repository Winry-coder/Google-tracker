import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma/client';
import { grantPermissionForUser } from '@/lib/google/drive';
import { normalizeEmail } from '@/lib/utils/format';
import { processLeadAutomation } from '@/lib/automation/process-lead';
import { rateLimit } from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';

const grantAccessSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional(),
  campaignSlug: z.string().min(1, 'Campaign slug is required'),
  variantId: z.string().optional(),
});

/**
 * POST /api/access/grant
 * Real version - grants access via Google Drive API
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, campaignSlug, variantId } =
      grantAccessSchema.parse(body);
    const normalizedEmail = normalizeEmail(email);

    // 1. Find Campaign
    const campaign = await prisma.campaign.findFirst({
      where: { slug: campaignSlug, deletedAt: null },
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // 0. Rate Limiting (Phase 4 Security Refinement)
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const limit = await rateLimit(ip, campaign.id);

    if (limit.isLimited) {
      return NextResponse.json(
        {
          success: false,
          error: limit.reason === 'campaign_limit' 
            ? 'This campaign is receiving too much traffic. Please try again later.'
            : 'Too many requests. Please try again in a minute.',
        },
        { status: 429 }
      );
    }

    if (!campaign.isActive) {
      return NextResponse.json(
        { success: false, error: 'This campaign is currently inactive.' },
        { status: 400 }
      );
    }

    // 2. Check if user already has access to THIS campaign
    const existingUser = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        campaignId: campaign.id,
        status: 'active',
        hasAccess: true,
      },
    });

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: `Success! You already have access to "${campaign.name}".`,
        data: {
          email: existingUser.email,
          campaign: campaign.name,
        },
      });
    }

    // 3. Update Database First (Fast Lead Capture)
    const user = await prisma.user.upsert({
      where: { email: normalizedEmail },
      create: {
        email: normalizedEmail,
        name: name || null,
        hasAccess: false, // Will be set to true after permission granted
        role: 'viewer',
        source: 'access_request',
        status: 'active',
        googleEmail: email,
        campaignId: campaign.id,
        variantId: variantId || null,
        lastSyncedAt: new Date(),
      },
      update: {
        status: 'active',
        campaignId: campaign.id,
        variantId: variantId || undefined,
        lastSyncedAt: new Date(),
      },
    });

    // 4. Update campaign stats
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { totalLeads: { increment: 1 } },
    });

    // 4.1 Update variant stats for A/B testing
    if (variantId) {
      await prisma.variant.update({
        where: { id: variantId },
        data: { leadCount: { increment: 1 } },
      });
    }

    // 5. Trigger Background Permission Granting and Automation
    (async () => {
      try {
        // Use the campaign owner's identity to grant permission (multi-tenant/SaaS ready)
        if (!campaign.ownerId) {
          throw new Error('Campaign has no owner assigned. Cannot grant access.');
        }

        const result = await grantPermissionForUser(campaign.ownerId, campaign.folderId, email);
        const drivePermissionId = result.id;

        // Update user with permission ID and set hasAccess to true
        await prisma.user.update({
          where: { id: user.id },
          data: {
            hasAccess: true,
            googleId: drivePermissionId,
            drivePermissionId: drivePermissionId,
            status: 'active',
          },
        });

        // Update campaign health if it was previously in error
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: { status: 'healthy', lastError: null }
        });

        // Create audit log
        await prisma.auditLog.create({
          data: {
            eventType: 'access.granted',
            eventSource: 'access_request',
            newValue: JSON.stringify({ email, campaign: campaign.name }),
            performedBy: 'system',
            userId: user.id,
          },
        });

        // Trigger Automation (Enrichment, Email, Webhooks, Notifications)
        await processLeadAutomation(user, campaign.id);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Background access grant failed:', err);
        }

        const error = err as { code?: number; message?: string };
        
        // Monitoring: Catch AuthError and mark campaign as needs_reauth
        if (error.code === 401 || error.message?.includes('invalid_grant')) {
          await prisma.campaign.update({
            where: { id: campaign.id },
            data: { status: 'needs_reauth', lastError: error.message }
          });
        }

        // GRACEFUL DEGRADATION: If it's a "Queue Mode" error or API failure, mark as queued
        const isQueueMode = error.message?.includes('Queue Mode');
        const isApiFailure = error.code === 500 || error.code === 429 || error.message?.includes('Fetch failed');

        if (isQueueMode || isApiFailure) {
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              status: 'active',
              hasAccess: false,
              // We'll use a special flag or just keep hasAccess false for retry worker
            }
          });

          await prisma.auditLog.create({
            data: {
              eventType: 'access.queued',
              eventSource: 'access_request',
              newValue: JSON.stringify({ email, campaign: campaign.name, reason: error.message }),
              performedBy: 'system',
              userId: user.id,
            },
          });
        } else {
          // Log failure in audit log
          await prisma.auditLog.create({
            data: {
              eventType: 'access.grant_failed',
              eventSource: 'access_request',
              newValue: JSON.stringify({ email, campaign: campaign.name, error: err instanceof Error ? err.message : 'Unknown error' }),
              performedBy: 'system',
              userId: user.id,
            },
          });
        }
      }
    })();

    const queueMessage = "Success! We're processing your access, you'll receive an email shortly.";
    const instantMessage = `Success! We're granting you access to "${campaign.name}". Check your inbox in a moment.`;

    const isQueued = user.status === 'active' && !user.hasAccess;

    return NextResponse.json({
      success: true,
      message: isQueued ? queueMessage : instantMessage,
      data: {
        email: user.email,
        campaign: campaign.name,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Access grant failed:', error);
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.errors[0].message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to grant access. Please try again.',
      },
      { status: 500 }
    );
  }
}
