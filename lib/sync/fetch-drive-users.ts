import { fetchAllPermissionsPaginated } from '@/lib/google/drive';
import {
  shouldProcessPermission,
  deduplicatePermissions,
  mapDrivePermissionToUser,
} from '@/lib/google/permissions';
import type { MappedUser } from '@/types/sync';

/**
 * Fetches and processes Drive permissions into MappedUser format
 * Stage 1 & 2: FETCH and MAP
 */
export async function fetchDriveUsers(folderId: string): Promise<MappedUser[]> {
  const permissions = await fetchAllPermissionsPaginated(folderId);

  const filteredPermissions = permissions.filter(shouldProcessPermission);

  const deduplicatedPermissions = deduplicatePermissions(filteredPermissions);

  const mappedUsers = deduplicatedPermissions
    .map(mapDrivePermissionToUser)
    .filter((u): u is MappedUser => u !== null);

  return mappedUsers;
}
