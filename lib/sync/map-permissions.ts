import { normalizeEmail } from '@/lib/utils/format';
import type { User } from '@/types/user';
import type { MappedUser } from '@/types/sync';

/**
 * Creates maps for efficient lookup during reconciliation
 */
export function createEmailMap(users: User[]): Map<string, User> {
  return new Map(users.map((u: User) => [normalizeEmail(u.email), u]));
}

/**
 * Creates set of normalized emails for quick lookups
 */
export function createEmailSet(users: MappedUser[]): Set<string> {
  return new Set(users.map((u: MappedUser) => normalizeEmail(u.email)));
}
