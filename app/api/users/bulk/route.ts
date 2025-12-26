import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { revokePermission } from '@/lib/google/drive';

/**
 * POST /api/users/bulk
 * Performs bulk actions on selected users (status update or deletion)
 * Now also revokes Google Drive access where applicable
 */
export async function POST(request: Request) {
  try {
    const { userIds, action, status } = await request.json();

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No user IDs provided' },
        { status: 400 }
      );
    }

    // 1. Fetch users with their campaign info to get folderId and permissionId
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      include: { campaign: true },
    });

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No users found matching IDs' },
        { status: 404 }
      );
    }

    // Process Google Drive Revocations if suspending or deleting
    const needsRevocation =
      action === 'delete' ||
      (action === 'update_status' &&
        (status === 'suspended' || status === 'revoked'));

    interface BulkUser {
      email: string;
      drivePermissionId: string | null;
      campaign: { folderId: string } | null;
    }

    if (needsRevocation) {
      await Promise.allSettled(
        (users as unknown as BulkUser[]).map(async (user) => {
          if (user.drivePermissionId && user.campaign?.folderId) {
            try {
              await revokePermission(
                user.campaign.folderId,
                user.drivePermissionId
              );
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error(
                `Failed to revoke Drive access for ${user.email}:`,
                err
              );
            }
          }
        })
      );
    }

    // Process Google Drive Re-granting if activating
    const isActivating = action === 'update_status' && status === 'active';
    if (isActivating) {
      const { grantPermission } = await import('@/lib/google/drive');
      await Promise.allSettled(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        users.map(async (user: any) => {
          // If they previously had access but are now being re-activated
          if (user.campaign?.folderId && user.status !== 'active') {
            try {
              const result = await grantPermission(
                user.campaign.folderId,
                user.email
              );
              // Update permission ID in database
              await prisma.user.update({
                where: { id: user.id },
                data: { drivePermissionId: result.id },
              });
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error(
                `Failed to re-grant Drive access for ${user.email}:`,
                err
              );
            }
          }
        })
      );
    }

    if (action === 'update_status') {
      if (!status) {
        return NextResponse.json(
          { success: false, error: 'No status provided' },
          { status: 400 }
        );
      }

      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: {
          status,
          hasAccess: status === 'active',
          revokedAt:
            status === 'revoked' || status === 'suspended' ? new Date() : null,
        },
      });

      // Log the bulk action
      await prisma.auditLog.create({
        data: {
          eventType: 'user.bulk_update',
          eventSource: 'admin',
          newValue: JSON.stringify({
            count: userIds.length,
            status,
            revoked: needsRevocation,
            granted: isActivating,
          }),
          performedBy: 'admin',
        },
      });

      return NextResponse.json({
        success: true,
        message: `Successfully updated ${userIds.length} users to ${status}${needsRevocation ? ' and revoked Drive access' : isActivating ? ' and restored Drive access' : ''}`,
      });
    }

    if (action === 'delete') {
      await prisma.user.deleteMany({
        where: { id: { in: userIds } },
      });

      // Log the bulk action
      await prisma.auditLog.create({
        data: {
          eventType: 'user.bulk_delete',
          eventSource: 'admin',
          newValue: JSON.stringify({ count: userIds.length, revoked: true }),
          performedBy: 'admin',
        },
      });

      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${userIds.length} users and revoked Drive access`,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action provided' },
      { status: 400 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Bulk action failed:', error);
    }
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
