import { describe, it, expect } from 'vitest';
import { determineUpdates } from '@/lib/sync/update-users';
import { mockUsers } from '@/tests/fixtures/mock-users';
import type { MappedUser } from '@/types/sync';

describe('Update Users', () => {
  describe('determineUpdates', () => {
    it('should detect when user regains access', () => {
      const existing = mockUsers.revoked;
      const mapped: MappedUser = {
        email: 'old@example.com',
        name: 'Old User',
        googleId: 'google-old-456',
        googleEmail: 'old@example.com',
        drivePermissionId: 'perm-old-456',
        role: 'viewer',
      };

      const updates = determineUpdates(existing, mapped);

      expect(updates.hasAccess).toBe(true);
      expect(updates.status).toBe('active');
    });

    it('should detect name changes', () => {
      const existing = mockUsers.active;
      const mapped: MappedUser = {
        email: 'alice@example.com',
        name: 'Alice Smith', // Changed name
        googleId: 'google-alice-123',
        googleEmail: 'alice@example.com',
        drivePermissionId: 'perm-alice-123',
        role: 'editor',
      };

      const updates = determineUpdates(existing, mapped);

      expect(updates.name).toBe('Alice Smith');
    });

    it('should detect google ID changes', () => {
      const existing = mockUsers.active;
      const mapped: MappedUser = {
        email: 'alice@example.com',
        name: 'Alice Johnson',
        googleId: 'google-alice-NEW', // Changed ID
        googleEmail: 'alice@example.com',
        drivePermissionId: 'perm-alice-123',
        role: 'editor',
      };

      const updates = determineUpdates(existing, mapped);

      expect(updates.googleId).toBe('google-alice-NEW');
    });

    it('should return empty updates when nothing changed', () => {
      const existing = mockUsers.active;
      const mapped: MappedUser = {
        email: existing.email,
        name: existing.name || undefined,
        googleId: existing.googleId!,
        googleEmail: existing.googleEmail!,
        drivePermissionId: existing.drivePermissionId!,
        role: existing.role,
      };

      const updates = determineUpdates(existing, mapped);

      expect(Object.keys(updates)).toHaveLength(0);
    });

    it('should reactivate suspended accounts', () => {
      const existing = mockUsers.suspended;
      const mapped: MappedUser = {
        email: 'suspended@example.com',
        name: 'Suspended User',
        googleId: 'google-suspended-789',
        googleEmail: 'suspended@example.com',
        drivePermissionId: 'perm-suspended-789',
        role: 'viewer',
      };

      const updates = determineUpdates(existing, mapped);

      expect(updates.status).toBe('active');
      expect(updates.revokedAt).toBeNull();
    });
  });
});
