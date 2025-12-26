import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { runDriveSync } from '@/lib/sync/reconcile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes
// POST /api/campaigns/[id]/sync
export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Check ownership
    // Allow admins or the campaign owner
    const isOwner = campaign.ownerId === session.user.id;
    const isAdmin = session.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!campaign.isActive) {
      return NextResponse.json(
        { error: 'Campaign is not active' },
        { status: 400 }
      );
    }

    // Run sync for this campaign's folder with campaign ID and owner ID
    // This ensures we use the owner's Google tokens instead of the service account
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
