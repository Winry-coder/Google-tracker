import { prisma } from '@/lib/prisma/client';
import type { User } from '@/types/user';
import type { MappedUser } from '@/types/sync';

/**
 * Creates new users in the database from Drive permissions
 * Returns array of created users
 * @param usersToCreate - Array of mapped users from Drive
 * @param campaignId - Optional campaign ID to tag users with
 */
export async function createUsers(
  usersToCreate: MappedUser[],
  campaignId?: string
): Promise<User[]> {
  if (usersToCreate.length === 0) return [];

  const created: User[] = [];

  for (const mappedUser of usersToCreate) {
    try {
      const user = await prisma.user.create({
        data: {
          email: mappedUser.email,
          name: mappedUser.name,
          image: mappedUser.image,
          hasAccess: true,
          role: mappedUser.role,
          source: 'drive',
          status: 'active',
          googleId: mappedUser.googleId,
          googleEmail: mappedUser.googleEmail,
          drivePermissionId: mappedUser.drivePermissionId,
          lastSyncedAt: new Date(),
          ...(campaignId && { campaignId }), // Add campaign ID if provided
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

      // Trigger Phase 4 Automation (Fire and forget)
      import('@/lib/automation/process-lead').then(
        ({ processLeadAutomation }) => {
          processLeadAutomation(user, campaignId).catch(() => {});
        }
      );

      created.push(user);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error(`Failed to create user ${mappedUser.email}:`, error);
      }
    }
  }

  return created;
}
