import type { DrivePermission } from '@/types/google';
import type { MappedUser } from '@/types/sync';
import { normalizeEmail } from '@/lib/utils/format';

/**
 * Determines if a permission should be processed
 * Filters out domain-wide and group permissions
 */
export function shouldProcessPermission(permission: DrivePermission): boolean {
  if (permission.type === 'domain') return false;
  if (permission.type === 'group') return false;
  if (permission.type === 'anyone') return false;
  return permission.type === 'user' && !!permission.emailAddress;
}

/**
 * Gets numeric role level for comparison
 */
function getRoleLevel(role: string): number {
  const levels: Record<string, number> = {
    reader: 1,
    commenter: 2,
    writer: 3,
    fileOrganizer: 4,
    organizer: 5,
    owner: 6,
  };
  return levels[role] || 0;
}

/**
 * Deduplicates permissions by Google ID
 * Prefers highest permission level
 */
export function deduplicatePermissions(
  permissions: DrivePermission[]
): DrivePermission[] {
  const byGoogleId = new Map<string, DrivePermission>();

  for (const perm of permissions) {
    const existing = byGoogleId.get(perm.id);
    if (!existing || getRoleLevel(perm.role) > getRoleLevel(existing.role)) {
      byGoogleId.set(perm.id, perm);
    }
  }

  return Array.from(byGoogleId.values());
}

/**
 * Maps Google Drive permission to internal user format
 */
export function mapDrivePermissionToUser(
  permission: DrivePermission
): MappedUser | null {
  if (!permission.emailAddress) return null;

  const defaultRole = process.env.DEFAULT_USER_ROLE || 'viewer';

  return {
    email: normalizeEmail(permission.emailAddress),
    name: permission.displayName || undefined,
    googleId: permission.id,
    googleEmail: permission.emailAddress,
    drivePermissionId: permission.id,
    role: defaultRole,
    image: permission.photoLink || undefined,
  };
}

/**
 * Handles suspended Google accounts
 * Returns update object for marking as suspended
 */
export function handleSuspendedAccount(
  permission: DrivePermission
): { status: string; hasAccess: boolean; revokedAt: Date } | null {
  if (permission.deleted) {
    return {
      status: 'suspended',
      hasAccess: false,
      revokedAt: new Date(),
    };
  }
  return null;
}
