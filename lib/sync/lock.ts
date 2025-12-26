import { prisma } from '@/lib/prisma/client';

const SYNC_LOCK_KEY = 'sync_running';

/**
 * Attempts to acquire a sync lock
 * Returns true if lock was acquired, false if another sync is running
 */
export async function acquireSyncLock(): Promise<boolean> {
  try {
    // Check if lock exists and is "true"
    const lock = await prisma.syncConfig.findUnique({
      where: { key: SYNC_LOCK_KEY },
    });

    if (lock && lock.value === 'true') {
      // Check if the lock is "stale" (older than 30 minutes)
      const updatedAt = new Date(lock.updatedAt);
      const now = new Date();
      const diffMinutes = (now.getTime() - updatedAt.getTime()) / (1000 * 60);

      if (diffMinutes < 30) {
        return false; // Still locked and fresh
      }
    }

    // Acquire or upate lock
    await prisma.syncConfig.upsert({
      where: { key: SYNC_LOCK_KEY },
      update: { value: 'true', updatedAt: new Date() },
      create: {
        key: SYNC_LOCK_KEY,
        value: 'true',
        description: 'System lock to prevent concurrent sync operations',
      },
    });

    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error acquiring sync lock:', error);
    }
    return false; // Default to blocked for safety
  }
}

/**
 * Releases the sync lock
 */
export async function releaseSyncLock(): Promise<void> {
  try {
    await prisma.syncConfig.update({
      where: { key: SYNC_LOCK_KEY },
      data: { value: 'false' },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error releasing sync lock:', error);
    }
  }
}

/**
 * Checks if a sync is currently running
 */
export async function isSyncRunning(): Promise<boolean> {
  const lock = await prisma.syncConfig.findUnique({
    where: { key: SYNC_LOCK_KEY },
  });
  return lock?.value === 'true';
}
