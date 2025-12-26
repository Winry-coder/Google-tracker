import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma/client';
import { grantPermission } from '@/lib/google/drive';
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
    // 0. Rate Limiting (Phase 4 Security Refinement)
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const limit = await rateLimit(ip);

    if (limit.isLimited) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again in a minute.',
        },
        { status: 429 }
      );
    }

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
        hasAccess: true,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'You already have access to this resource',
        },
        { status: 400 }
      );
    }

    // 3. Grant Google Drive Permission
    let drivePermissionId: string | undefined;
    try {
      const result = await grantPermission(campaign.folderId, email);
      drivePermissionId = result.id;
    } catch (driveError) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Google Drive Grant Error:', driveError);
      }
      return NextResponse.json(
        {
          success: false,
          error:
            'Failed to grant folder access. Please ensure the folder is shared with our service account.',
        },
        { status: 500 }
      );
    }

    // 4. Create or update user in database
    const user = await prisma.user.upsert({
      where: { email: normalizedEmail },
      create: {
        email: normalizedEmail,
        name: name || null,
        hasAccess: true,
        role: 'viewer',
        source: 'access_request',
        status: 'active',
        googleEmail: email,
        googleId: drivePermissionId, // Store permission ID as google ID for now
        drivePermissionId: drivePermissionId,
        campaignId: campaign.id,
        variantId: variantId || null,
        lastSyncedAt: new Date(),
      },
      update: {
        hasAccess: true,
        status: 'active',
        campaignId: campaign.id,
        variantId: variantId || undefined,
        lastSyncedAt: new Date(),
      },
    });

    // 5. Update campaign stats
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { totalLeads: { increment: 1 } },
    });

    // 5.1 Update variant stats for A/B testing
    if (variantId) {
      await prisma.variant.update({
        where: { id: variantId },
        data: { leadCount: { increment: 1 } },
      });
    }

    // 6. Create audit log
    await prisma.auditLog.create({
      data: {
        eventType: 'access.granted',
        eventSource: 'access_request',
        newValue: JSON.stringify({ email, campaign: campaign.name }),
        performedBy: 'system',
        userId: user.id,
      },
    });

    // 7. Phase 4: Trigger Automation (Enrichment, Email, Webhooks, Notifications)
    processLeadAutomation(user, campaign.id).catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Lead automation failed:', err);
      }
    });

    return NextResponse.json({
      success: true,
      message: `Success! Access to "${campaign.name}" has been granted. Check your inbox.`,
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
