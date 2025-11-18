import { prisma } from '@/lib/prisma/client';
import type { User } from '@/types/user';
import type { MappedUser } from '@/types/sync';

/**
 * Creates new users in the database from Drive permissions
 * Returns array of created users
 */
export async function createUsers(
  usersToCreate: MappedUser[]
): Promise<User[]> {
  if (usersToCreate.length === 0) return [];

  const created: User[] = [];

  for (const mappedUser of usersToCreate) {
    try {
      const user = await prisma.user.create({
        data: {
          email: mappedUser.email,
          name: mappedUser.name,
          hasAccess: true,
          role: mappedUser.role,
          source: 'drive',
          status: 'active',
          googleId: mappedUser.googleId,
          googleEmail: mappedUser.googleEmail,
          drivePermissionId: mappedUser.drivePermissionId,
          lastSyncedAt: new Date(),
        },
      });

      await prisma.auditLog.create({
        data: {
          eventType: 'user.created',
          eventSource: 'drive_sync',
          newValue: JSON.stringify(user),
          performedBy: 'system',
          userId: user.id,
        },
      });

      created.push(user);
    } catch (error) {
      console.error(`Failed to create user ${mappedUser.email}:`, error);
    }
  }

  return created;
}
