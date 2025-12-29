import { prisma } from '@/lib/prisma/client';
import { fetchDriveUsers } from './fetch-drive-users';
import { createEmailMap, createEmailSet } from './map-permissions';
import { createUsers } from './create-users';
import { updateUsers, determineUpdates } from './update-users';
import { revokeUsers } from './revoke-users';
import { normalizeEmail } from '@/lib/utils/format';
import { checkTokenHealth } from '@/lib/google/client';
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
 * @param userId - User ID of the campaign owner
 * @param dryRun - If true, skip persistence and return what would have happened
 */
export async function runDriveSync(
  folderId: string,
  campaignId?: string,
  userId?: string,
  dryRun: boolean = false
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
    
    // Check Campaign and Token Health
    if (campaignId) {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        select: { isKillSwitchEnabled: true, folderId: true, ownerId: true, name: true }
      });

      if (campaign?.ownerId) {
        const health = await checkTokenHealth(campaign.ownerId);
        if (!health.healthy) {
          // SELF-HEALING: Mark campaign as inactive and needs reauth
          await prisma.campaign.update({
            where: { id: campaignId },
            data: {
              isActive: false,
              status: 'needs_reauth',
              lastError: `Auth Failure: ${health.error || 'Refresh token invalid'}`
            }
          });

          // Log the failure
          await prisma.auditLog.create({
            data: {
              eventType: 'campaign.health_failure',
              eventSource: 'sync_engine',
              newValue: JSON.stringify({ campaign: campaign.name, error: health.error }),
              performedBy: 'system'
            }
          });

          throw new Error(`Campaign "${campaign.name}" disabled due to Google Auth failure. Owner must re-authenticate.`);
        }
      }

      if (campaign?.isKillSwitchEnabled) {
        // KILL SWITCH ACTIVE: Revoke everyone in this campaign
        const usersToKill = await prisma.user.findMany({
          where: { campaignId, hasAccess: true },
        });

        if (usersToKill.length > 0) {
          if (dryRun) {
            return {
              success: true,
              created: [],
              updated: [],
              revoked: usersToKill.map(u => ({ ...u, status: 'revoked' })),
              duration: Date.now() - startTime,
              timestamp: new Date().toISOString(),
              message: 'DRY RUN: Kill switch active - 0 users would be created, 0 updated, ' + usersToKill.length + ' revoked.'
            } as unknown as SyncResult;
          }

          const revoked = await revokeUsers(usersToKill);
          return {
            success: true,
            created: [],
            updated: [],
            revoked,
            duration: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            message: 'Kill switch active: All campaign access revoked.'
          } as SyncResult;
        }
      }
    }

    const mappedUsers = await fetchDriveUsers(folderId, userId);
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
      const norm = normalizeEmail(dbUser.email);
      const isRecent = dbUser.lastSyncedAt && (Date.now() - dbUser.lastSyncedAt.getTime() < 600000);

      // 1. "Zombie Permission" Detection (Manual Removals from Drive)
      // If user is supposed to have access (status: active) but isn't in Drive anymore
      if (dbUser.status === 'active' && !driveEmails.has(norm) && !isRecent) {
        toRevoke.push(dbUser);
      }

      // 2. Drive users no longer in Drive (legacy check)
      if (dbUser.source === 'drive' && !driveEmails.has(norm) && dbUser.hasAccess && !isRecent) {
        // Already handled by the more generic check above, but keeping for clarity
        if (!toRevoke.find(u => u.id === dbUser.id)) {
          toRevoke.push(dbUser);
        }
      }
    }

    // Continued in next function...
    if (dryRun) {
      return {
        success: true,
        created: toCreate.map(u => ({ ...u, status: 'active', hasAccess: true })),
        updated: toUpdate.map(u => ({ ...u.user, ...u.updates })),
        revoked: toRevoke.map(u => ({ ...u, status: 'revoked', hasAccess: false })),
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        message: `DRY RUN: ${toCreate.length} users would be created, ${toUpdate.length} updated, ${toRevoke.length} revoked.`,
      } as unknown as SyncResult;
    }

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

    // Monitoring: Catch AuthError and mark campaign as needs_reauth
    const err = error as { code?: number; message?: string };
    if (campaignId && (err.code === 401 || err.message?.includes('invalid_grant'))) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'needs_reauth', lastError: err.message }
      });
    }
    
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
