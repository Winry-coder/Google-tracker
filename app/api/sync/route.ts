import { NextResponse } from 'next/server';
import { runDriveSync } from '@/lib/sync/reconcile';
import { triggerSyncSchema } from '@/lib/validations/sync.schema';
import { logger } from '@/lib/telemetry/logger';
import type { APIResponse } from '@/types/api';
import type { SyncResult } from '@/types/sync';

/**
 * POST /api/sync
 * Triggers a manual Drive sync operation
 */
export async function POST(request: Request): Promise<NextResponse<APIResponse<SyncResult>>> {
  try {
    const body = await request.json();
    const { folderId } = triggerSyncSchema.parse(body);

    const folderIdToUse = folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;

    /* TODO: Junior Developer — Set GOOGLE_DRIVE_FOLDER_ID in .env
     * Get the folder ID from the Drive folder URL
     */
    if (!folderIdToUse) {
      return NextResponse.json(
        {
          success: false,
          error: 'No folder ID provided and GOOGLE_DRIVE_FOLDER_ID not set',
        },
        { status: 400 }
      );
    }

    logger.info('Starting manual sync', { folderId: folderIdToUse });

    const result = await runDriveSync(folderIdToUse);

    logger.info('Sync completed successfully', {
      created: result.created.length,
      updated: result.updated.length,
      revoked: result.revoked.length,
      duration: result.duration,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Sync completed successfully',
    });
  } catch (error) {
    logger.error('Sync failed', error as Error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      },
      { status: 500 }
    );
  }
}
