import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma/client';
import { revokePermissionForUser } from '@/lib/google/drive';

/**
 * POST /api/users/gdpr-wipe
 * Hard-deletes users and revokes their Drive access
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { userIds } = await request.json();

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No user IDs provided' },
        { status: 400 }
      );
    }

    // 1. Fetch users with campaign info
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      include: {
        campaign: {
          select: {
            folderId: true,
            ownerId: true,
          },
        },
      },
    });

    // 2. Revoke Drive Access for everyone being wiped
    await Promise.allSettled(
      users.map(async (user) => {
        if (user.drivePermissionId && user.campaign?.folderId && user.campaign?.ownerId) {
          try {
            await revokePermissionForUser(
              user.campaign.ownerId,
              user.campaign.folderId,
              user.drivePermissionId
            );
          } catch (err) {
            console.error(`GDPR Wipe: Failed to revoke Drive access for ${user.email}:`, err);
          }
        }
      })
    );

    // 3. Hard delete from database
    await prisma.user.deleteMany({
      where: { id: { in: userIds } },
    });

    // 4. Log the action
    await prisma.auditLog.create({
      data: {
        eventType: 'user.gdpr_wipe',
        eventSource: 'admin',
        newValue: JSON.stringify({ count: userIds.length, userIds }),
        performedBy: session.user.email || 'admin',
      },
    });

    return NextResponse.json({
      success: true,
      message: `GDPR Wipe successful for ${userIds.length} users. All data and permissions removed.`,
    });
  } catch (error) {
    console.error('GDPR Wipe failed:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
