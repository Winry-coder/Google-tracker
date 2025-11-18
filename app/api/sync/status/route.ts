import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import type { APIResponse } from '@/types/api';

interface SyncStatus {
  lastSync: {
    id: string;
    status: string;
    timestamp: string;
    usersCreated: number;
    usersUpdated: number;
    usersRevoked: number;
    duration: number | null;
  } | null;
  recentSyncs: Array<{
    id: string;
    status: string;
    timestamp: string;
    duration: number | null;
  }>;
}

/**
 * GET /api/sync/status
 * Returns the status of recent sync operations
 */
export async function GET(): Promise<NextResponse<APIResponse<SyncStatus>>> {
  try {
    const lastSync = await prisma.syncLog.findFirst({
      orderBy: { startedAt: 'desc' },
    });

    const recentSyncs = await prisma.syncLog.findMany({
      take: 10,
      orderBy: { startedAt: 'desc' },
      select: {
        id: true,
        status: true,
        startedAt: true,
        duration: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        lastSync: lastSync
          ? {
              id: lastSync.id,
              status: lastSync.status,
              timestamp: lastSync.startedAt.toISOString(),
              usersCreated: lastSync.usersCreated,
              usersUpdated: lastSync.usersUpdated,
              usersRevoked: lastSync.usersRevoked,
              duration: lastSync.duration,
            }
          : null,
        recentSyncs: recentSyncs.map((sync) => ({
          id: sync.id,
          status: sync.status,
          timestamp: sync.startedAt.toISOString(),
          duration: sync.duration,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sync status',
      },
      { status: 500 }
    );
  }
}
