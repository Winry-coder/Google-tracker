import { google } from 'googleapis';
import { getValidOAuthClient } from './client';
import { GoogleAPIError } from '@/lib/utils/errors';
import type { DrivePermission } from '@/types/google';

/**
 * Fetches permissions with retry logic and exponential backoff
 * Handles rate limiting (429) errors automatically
 */
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const code = (error as { code?: number }).code;
      if (code === 429 && i < maxRetries - 1) {
        const delay = Math.min(1000 * 2 ** i + Math.random() * 1000, 10000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new GoogleAPIError('Max retries exceeded');
}

/**
 * Fetches all permissions for a Drive folder with pagination
 * Returns array of DrivePermission objects
 */
export async function fetchAllPermissionsPaginated(
  folderId: string
): Promise<DrivePermission[]> {
  const client = await getValidOAuthClient();
  const drive = google.drive({ version: 'v3', auth: client });

  const allPermissions: DrivePermission[] = [];
  let pageToken: string | undefined;

  do {
    try {
      const response = await fetchWithRetry(() =>
        drive.permissions.list({
          fileId: folderId,
          fields: 'nextPageToken,permissions(id,emailAddress,role,type,deleted,displayName,photoLink)',
          pageSize: 100,
          pageToken,
        })
      );

      const permissions = response.data.permissions || [];
      allPermissions.push(...(permissions as DrivePermission[]));
      pageToken = response.data.nextPageToken || undefined;
    } catch (error) {
      throw new GoogleAPIError(
        `Failed to fetch permissions for folder ${folderId}`,
        (error as { code?: number }).code,
        error as Error
      );
    }
  } while (pageToken);

  return allPermissions;
}
