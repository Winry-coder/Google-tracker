import { prisma } from '@/lib/prisma/client';
import { fetchDriveUsers } from './fetch-drive-users';
import { createEmailMap, createEmailSet } from './map-permissions';
import { createUsers } from './create-users';
import { updateUsers, determineUpdates } from './update-users';
import { revokeUsers } from './revoke-users';
import { normalizeEmail } from '@/lib/utils/format';
import type { SyncResult, MappedUser } from '@/types/sync';
import type { User } from '@/types/user';

import { acquireSyncLock, releaseSyncLock } from './lock';

/**
 * 4-STAGE SYNC PIPELINE
 * Stage 1: FETCH - Get Drive permissions
 * Stage 2: MAP - Normalize to internal format
 * Stage 3: RECONCILE - Determine actions (create/update/revoke)
 * Stage 4: PERSIST - Execute database operations
 *
 * @param folderId - Google Drive folder ID to sync
 * @param campaignId - Optional campaign ID to tag users with
 */
export async function runDriveSync(
  folderId: string,
  campaignId?: string
): Promise<SyncResult> {
  const startTime = Date.now();

  // Acquire lock
  const lockAcquired = await acquireSyncLock();
  if (!lockAcquired) {
    throw new Error(
      'Another sync operation is currently in progress. Please wait.'
    );
  }

  try {
    // ============================================
    // STAGE 1 & 2: FETCH AND MAP
    // ============================================
    const mappedUsers = await fetchDriveUsers(folderId);
    const driveEmails = createEmailSet(mappedUsers);

    // ============================================
    // STAGE 3: RECONCILE WITH DATABASE
    // ============================================
    const existingUsers = await prisma.user.findMany({
      where: {
        OR: [{ email: { in: Array.from(driveEmails) } }, { source: 'drive' }],
      },
    });

    const existingByEmail = createEmailMap(existingUsers);

    const toCreate: MappedUser[] = [];
    const toUpdate: { user: User; updates: Partial<User> }[] = [];
    const toRevoke: User[] = [];

    // Check Drive users against DB
    for (const mapped of mappedUsers) {
      const existing = existingByEmail.get(normalizeEmail(mapped.email));

      if (!existing) {
        toCreate.push(mapped);
      } else {
        const updates = determineUpdates(existing, mapped);
        if (Object.keys(updates).length > 0) {
          toUpdate.push({ user: existing, updates });
        }
      }
    }

    // Check DB users no longer in Drive
    for (const dbUser of existingUsers) {
      if (dbUser.source === 'drive') {
        const norm = normalizeEmail(dbUser.email);
        if (!driveEmails.has(norm) && dbUser.hasAccess) {
          toRevoke.push(dbUser);
        }
      }
    }

    // Continued in next function...
    return await persistChanges({
      toCreate,
      toUpdate,
      toRevoke,
      mappedUsersCount: mappedUsers.length,
      existingUsersCount: existingUsers.length,
      startTime,
      campaignId, // Pass campaign ID to persist function
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    await logSyncFailure(error as Error, duration);
    throw error;
  } finally {
    await releaseSyncLock();
  }
}

// Continued implementation...
async function persistChanges(params: {
  toCreate: MappedUser[];
  toUpdate: { user: User; updates: Partial<User> }[];
  toRevoke: User[];
  mappedUsersCount: number;
  existingUsersCount: number;
  startTime: number;
  campaignId?: string;
}): Promise<SyncResult> {
  const {
    toCreate,
    toUpdate,
    toRevoke,
    mappedUsersCount,
    existingUsersCount,
    startTime,
    campaignId,
  } = params;

  // ============================================
  // STAGE 4: PERSIST CHANGES
  // ============================================
  const created = await createUsers(toCreate, campaignId);
  const updated = await updateUsers(toUpdate);
  const revoked = await revokeUsers(toRevoke);

  const duration = Date.now() - startTime;

  await prisma.syncLog.create({
    data: {
      syncType: 'manual',
      status: 'success',
      usersCreated: created.length,
      usersUpdated: updated.length,
      usersRevoked: revoked.length,
      driveUserCount: mappedUsersCount,
      appUserCount: existingUsersCount,
      duration,
      completedAt: new Date(),
    },
  });

  return {
    success: true,
    created,
    updated,
    revoked,
    duration,
    timestamp: new Date().toISOString(),
  };
}

async function logSyncFailure(error: Error, duration: number): Promise<void> {
  await prisma.syncLog.create({
    data: {
      syncType: 'manual',
      status: 'failed',
      errorsCount: 1,
      errorMessage: error.message,
      errorStack: error.stack,
      duration,
      completedAt: new Date(),
    },
  });
}
