import { google } from 'googleapis';
import { getValidOAuthClient, getDriveForUser } from './client';
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
          fields:
            'nextPageToken,permissions(id,emailAddress,role,type,deleted,displayName,photoLink)',
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

/**
 * Grants a user reader access to a specific folder
 */
export async function grantPermission(
  folderId: string,
  email: string
): Promise<{ id: string }> {
  const client = await getValidOAuthClient();
  const drive = google.drive({ version: 'v3', auth: client });

  try {
    const response = await drive.permissions.create({
      fileId: folderId,
      requestBody: {
        role: 'reader',
        type: 'user',
        emailAddress: email,
      },
      fields: 'id',
      sendNotificationEmail: true,
    });

    return { id: response.data.id || '' };
  } catch (error) {
    throw new GoogleAPIError(
      `Failed to grant permission for email ${email} on folder ${folderId}`,
      (error as { code?: number }).code,
      error as Error
    );
  }
}
/**
 * Revokes a user's permission for a specific file or folder
 */
export async function revokePermission(
  fileId: string,
  permissionId: string
): Promise<void> {
  const client = await getValidOAuthClient();
  const drive = google.drive({ version: 'v3', auth: client });

  try {
    await drive.permissions.delete({
      fileId,
      permissionId,
    });
  } catch (error) {
    throw new GoogleAPIError(
      `Failed to revoke permission ${permissionId} on file/folder ${fileId}`,
      (error as { code?: number }).code,
      error as Error
    );
  }
}

/**
 * Fetches all permissions for a specific user's Drive folder
 */
export async function fetchAllPermissionsForUser(
  userId: string,
  folderId: string
): Promise<DrivePermission[]> {
  const drive = await getDriveForUser(userId);

  const allPermissions: DrivePermission[] = [];
  let pageToken: string | undefined;

  do {
    try {
      const response = await fetchWithRetry(() =>
        drive.permissions.list({
          fileId: folderId,
          fields:
            'nextPageToken,permissions(id,emailAddress,role,type,deleted,displayName,photoLink)',
          pageSize: 100,
          pageToken,
        })
      );

      const permissions = response.data.permissions || [];
      allPermissions.push(...(permissions as DrivePermission[]));
      pageToken = response.data.nextPageToken || undefined;
    } catch (error) {
       // Check if error is 404 (File not found) -> might mean user lost access
       const code = (error as { code?: number }).code;
       if (code === 404) {
         throw new GoogleAPIError(`Folder not found or access denied for user ${userId}`, 404, error as Error);
       }
      throw new GoogleAPIError(
        `Failed to fetch permissions for folder ${folderId}`,
        code,
        error as Error
      );
    }
  } while (pageToken);

  return allPermissions;
}

/**
 * Grants permission for a specific user context
 */
export async function grantPermissionForUser(
  userId: string,
  folderId: string,
  email: string
): Promise<{ id: string }> {
  const drive = await getDriveForUser(userId);

  try {
    const response = await drive.permissions.create({
      fileId: folderId,
      requestBody: {
        role: 'reader',
        type: 'user',
        emailAddress: email,
      },
      fields: 'id',
      sendNotificationEmail: true,
    });

    return { id: response.data.id || '' };
  } catch (error) {
    throw new GoogleAPIError(
      `Failed to grant permission for email ${email} on folder ${folderId}`,
      (error as { code?: number }).code,
      error as Error
    );
  }
}

/**
 * Revokes permission for a specific user context
 */
export async function revokePermissionForUser(
  userId: string,
  fileId: string,
  permissionId: string
): Promise<void> {
  const drive = await getDriveForUser(userId);

  try {
    await drive.permissions.delete({
      fileId,
      permissionId,
    });
  } catch (error) {
    throw new GoogleAPIError(
      `Failed to revoke permission ${permissionId} on file/folder ${fileId}`,
      (error as { code?: number }).code,
      error as Error
    );
  }
}
