import { google } from 'googleapis';
import { getValidOAuthClient, getDriveForUser } from './client';

export interface FolderValidationResult {
  isValid: boolean;
  name?: string;
  error?: string;
  permissionsCount?: number;
}

/**
 * Extracts folder ID from a Drive URL if provided
 */
export function extractFolderId(input: string): string {
  if (!input) return '';
  // Handle URL format: https://drive.google.com/drive/folders/ID or /u/0/folders/ID
  const match = input.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : input.trim();
}

/**
 * Validates if a Google Drive folder ID exists and is accessible
 */
export async function validateDriveFolder(
  input: string
): Promise<FolderValidationResult> {
  const folderId = extractFolderId(input);
  try {
    if (!folderId) {
      return { isValid: false, error: 'Empty folder ID provided.' };
    }

    const auth = await getValidOAuthClient();
    const drive = google.drive({ version: 'v3', auth });

    // Fetch folder metadata
    const response = await drive.files.get({
      fileId: folderId,
      fields: 'id, name, mimeType',
    });

    // Check if it's actually a folder
    if (response.data.mimeType !== 'application/vnd.google-apps.folder') {
      return {
        isValid: false,
        error: 'The provided ID is for a file, not a folder.',
      };
    }

    // Try to fetch permissions to see if we can read them
    const permissions = await drive.permissions.list({
      fileId: folderId,
      fields: 'permissions(id)',
    });

    return {
      isValid: true,
      name: response.data.name || 'Untitled Folder',
      permissionsCount: permissions.data.permissions?.length || 0,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Folder validation error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error,
      });
    }

    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message.includes('404')) {
      return {
        isValid: false,
        error: 'Folder not found. Check the ID and sharing permissions.',
      };
    }

    if (message.includes('invalid_grant')) {
      return {
        isValid: false,
        error:
          'Google Refresh Token is invalid or expired. Run pnpm run setup:google-auth again.',
      };
    }

    return {
      isValid: false,
      error: `Google API Error: ${message}`,
    };
  }
}

/**
 * Validates if a Google Drive folder ID exists and is accessible using a specific user's credentials
 */
export async function validateDriveFolderForUser(
  userId: string,
  input: string
): Promise<FolderValidationResult> {
  console.log(`🔍 STARTING validation for user ${userId} with input: ${input}`);
  const folderId = extractFolderId(input);
  console.log(`🔍 Extracted folder ID: ${folderId}`);
  
  try {
    if (!folderId) {
      console.log(`❌ Empty folder ID provided`);
      return { isValid: false, error: 'Empty folder ID provided.' };
    }

    console.log(`Validating folder for user ${userId}: ${folderId}`);

    const drive = await getDriveForUser(userId);
    console.log(`✅ Got drive client for user ${userId}`);

    // Fetch folder metadata and capabilities
    console.log(`🔍 Fetching folder metadata and capabilities for ${folderId}...`);
    const response = await drive.files.get({
      fileId: folderId,
      fields: 'id, name, mimeType, capabilities, permissions',
    });
    console.log(`✅ Folder metadata fetched: ${response.data.name} (${response.data.id})`);
    console.log(`🔍 Full response data:`, JSON.stringify(response.data, null, 2));

    // Check if it's actually a folder
    if (response.data.mimeType !== 'application/vnd.google-apps.folder') {
      return {
        isValid: false,
        error: 'The provided ID is for a file, not a folder.',
      };
    }

    // Boss Level Improvement: Folder Ownership/Permissions Verification
    const capabilities = response.data.capabilities as Record<string, boolean | undefined | null>;
    console.log(`🔍 Folder capabilities for ${response.data.name}:`, JSON.stringify(capabilities, null, 2));
    
    if (capabilities) {
      console.log(`🔍 Permission checks:`, {
        canAddChildren: capabilities.canAddChildren,
        canManagePermissions: capabilities.canManagePermissions,
        canShare: capabilities.canShare,
        canEdit: capabilities.canEdit,
        canDelete: capabilities.canDelete
      });
      
      // Check for required permissions with detailed error messages
      const missingPermissions = [];
      
      if (!capabilities.canAddChildren) {
        missingPermissions.push('Add files/folders to the folder');
      }
      
      // Note: Google Drive API uses canShare instead of canManagePermissions
      const canManagePermissions = capabilities.canManagePermissions || capabilities.canShare;
      if (!canManagePermissions) {
        missingPermissions.push('Manage folder permissions');
      }
      
      if (missingPermissions.length > 0) {
        console.log(`❌ Permission check failed:`, {
          canAddChildren: capabilities.canAddChildren,
          canManagePermissions: capabilities.canManagePermissions,
          canShare: capabilities.canShare,
          missingPermissions,
          error: 'Insufficient permissions for campaign management'
        });
        
        return {
          isValid: false,
          error: `Insufficient permissions for campaign management. You need:\n• ${missingPermissions.join('\n• ')}\n\nTo fix this:\n1. Go to Google Drive\n2. Right-click the folder\n3. Share → Advanced\n4. Make sure your role is "Owner" or "Editor"\n5. Try creating the campaign again`,
        };
      }
      
      console.log(`✅ All required permissions verified`);
    } else {
      console.log(`❌ No capabilities data returned from Google Drive API`);
      return {
        isValid: false,
        error: 'Unable to verify folder permissions. Please try again or contact support.',
      };
    }

    // Try to fetch permissions to see if we can read them (optional check)
    console.log(`Checking permissions for folder ${folderId}...`);
    try {
      const permissions = await drive.permissions.list({
        fileId: folderId,
        fields: 'permissions(id)',
      });
      console.log(`Permissions check complete: ${permissions.data.permissions?.length || 0} permissions found`);
    } catch (permError) {
      console.log(`Permissions check failed (non-critical):`, permError instanceof Error ? permError.message : 'Unknown error');
      // Continue anyway - permissions check is not critical for basic validation
    }

    console.log(`Folder validation complete: ${response.data.name}, basic access confirmed`);

    return {
      isValid: true,
      name: response.data.name || 'Untitled Folder',
      permissionsCount: 0, // We'll set this to 0 since permissions check is optional now
    };
  } catch (error) {
    console.error(`❌ Folder validation FAILED for user ${userId}, folder ${folderId}:`, error);

    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Folder validation error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error,
      });
    }

    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message.includes('404')) {
      return {
        isValid: false,
        error: 'Folder not found. You might not have access to this folder.',
      };
    }

    return {
      isValid: false,
      error: `Google API Error: ${message}`,
    };
  }
}
