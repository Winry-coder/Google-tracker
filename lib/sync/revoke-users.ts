import { prisma } from '@/lib/prisma/client';
import type { User } from '@/types/user';

/**
 * Revokes access for users removed from Drive
 * Returns array of revoked users
 */
export async function revokeUsers(usersToRevoke: User[]): Promise<User[]> {
  if (usersToRevoke.length === 0) return [];

  const revoked: User[] = [];

  for (const user of usersToRevoke) {
    try {
      const revokedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          hasAccess: false,
          status: 'revoked',
          revokedAt: new Date(),
          lastSyncedAt: new Date(),
        },
      });

      await prisma.auditLog.create({
        data: {
          eventType: 'access.revoked',
          eventSource: 'drive_sync',
          oldValue: JSON.stringify({ hasAccess: true }),
          newValue: JSON.stringify({ hasAccess: false }),
          performedBy: 'system',
          userId: user.id,
        },
      });

      revoked.push(revokedUser);
    } catch (error) {
      console.error(`Failed to revoke user ${user.email}:`, error);
    }
  }

  return revoked;
}
