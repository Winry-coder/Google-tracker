import { prisma } from '@/lib/prisma/client';
import type { User } from '@/types/user';
import type { MappedUser } from '@/types/sync';

/**
 * Determines what fields need to be updated for a user
 */
export function determineUpdates(
  existing: User,
  mapped: MappedUser
): Partial<User> {
  const updates: Partial<User> = {};

  if (!existing.hasAccess) {
    updates.hasAccess = true;
  }

  if (existing.name !== mapped.name && mapped.name) {
    updates.name = mapped.name;
  }

  if (existing.googleId !== mapped.googleId) {
    updates.googleId = mapped.googleId;
  }

  if (existing.drivePermissionId !== mapped.drivePermissionId) {
    updates.drivePermissionId = mapped.drivePermissionId;
  }

  if (existing.status === 'revoked' || existing.status === 'suspended') {
    updates.status = 'active';
    updates.revokedAt = null;
  }

  return updates;
}

/**
 * Updates existing users based on Drive permissions
 * Returns array of updated users
 */
export async function updateUsers(
  usersToUpdate: { user: User; updates: Partial<User> }[]
): Promise<User[]> {
  if (usersToUpdate.length === 0) return [];

  const updated: User[] = [];

  for (const { user, updates } of usersToUpdate) {
    if (Object.keys(updates).length === 0) continue;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          ...updates,
          lastSyncedAt: new Date(),
        },
      });

      updated.push(updatedUser);
    } catch (error) {
      console.error(`Failed to update user ${user.email}:`, error);
    }
  }

  return updated;
}
