import { describe, it, expect } from 'vitest';
import {
  shouldProcessPermission,
  deduplicatePermissions,
  mapDrivePermissionToUser,
} from '@/lib/google/permissions';
import { mockDrivePermissions } from '@/tests/fixtures/mock-google-responses';

describe('Google Permissions', () => {
  describe('shouldProcessPermission', () => {
    it('should accept user permissions', () => {
      const permission = mockDrivePermissions.standard[0];
      expect(shouldProcessPermission(permission)).toBe(true);
    });

    it('should reject domain-wide permissions', () => {
      const permission = mockDrivePermissions.withDomainWide[0];
      expect(shouldProcessPermission(permission)).toBe(false);
    });

    it('should reject group permissions', () => {
      const permission = mockDrivePermissions.withGroup[0];
      expect(shouldProcessPermission(permission)).toBe(false);
    });

    it('should reject user permissions without email', () => {
      const permission = {
        id: 'test',
        type: 'user' as const,
        role: 'reader' as const,
      };
      expect(shouldProcessPermission(permission)).toBe(false);
    });
  });

  describe('deduplicatePermissions', () => {
    it('should remove duplicate permissions', () => {
      const permissions = [
        {
          id: 'perm-1',
          emailAddress: 'user@example.com',
          role: 'reader',
          type: 'user',
        },
        {
          id: 'perm-1', // Same ID
          emailAddress: 'user@example.com',
          role: 'writer', // Higher role
          type: 'user',
        },
      ] as const;

      const result = deduplicatePermissions(permissions as any);

      expect(result).toHaveLength(1);
      expect(result[0].role).toBe('writer'); // Should keep higher role
    });

    it('should keep all unique permissions', () => {
      const permissions = mockDrivePermissions.standard;

      const result = deduplicatePermissions(permissions);

      expect(result).toHaveLength(2);
    });
  });

  describe('mapDrivePermissionToUser', () => {
    it('should map permission to user format', () => {
      const permission = mockDrivePermissions.standard[0];

      const result = mapDrivePermissionToUser(permission);

      expect(result).toEqual({
        email: 'alice@example.com',
        name: 'Alice Johnson',
        googleId: 'perm-1',
        googleEmail: 'alice@example.com',
        drivePermissionId: 'perm-1',
        role: 'viewer', // Default role
      });
    });

    it('should normalize email addresses', () => {
      const permission = {
        id: 'perm-test',
        emailAddress: 'USER@EXAMPLE.COM', // Uppercase
        displayName: 'Test User',
        role: 'reader',
        type: 'user',
      } as const;

      const result = mapDrivePermissionToUser(permission as any);

      expect(result?.email).toBe('user@example.com'); // Normalized
    });

    it('should return null for permissions without email', () => {
      const permission = {
        id: 'perm-test',
        role: 'reader',
        type: 'user',
      } as any;

      const result = mapDrivePermissionToUser(permission);

      expect(result).toBeNull();
    });
  });
});
