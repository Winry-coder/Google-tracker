import type { DrivePermission } from '@/types/google';

export const mockDrivePermissions = {
  standard: [
    {
      id: 'perm-1',
      emailAddress: 'alice@example.com',
      displayName: 'Alice Johnson',
      role: 'reader',
      type: 'user',
      deleted: false,
    },
    {
      id: 'perm-2',
      emailAddress: 'bob@example.com',
      displayName: 'Bob Smith',
      role: 'writer',
      type: 'user',
      deleted: false,
    },
  ] as DrivePermission[],

  withSuspended: [
    {
      id: 'perm-3',
      emailAddress: 'suspended@example.com',
      displayName: 'Suspended User',
      role: 'reader',
      type: 'user',
      deleted: true,
    },
  ] as DrivePermission[],

  withDomainWide: [
    {
      id: 'perm-4',
      type: 'domain',
      domain: 'example.com',
      role: 'reader',
    },
  ] as DrivePermission[],

  withAliases: [
    {
      id: 'perm-5',
      emailAddress: 'john@example.com',
      displayName: 'John Doe',
      role: 'reader',
      type: 'user',
      deleted: false,
    },
    {
      id: 'perm-6',
      emailAddress: 'john+work@example.com',
      displayName: 'John Doe',
      role: 'writer',
      type: 'user',
      deleted: false,
    },
  ] as DrivePermission[],

  withGroup: [
    {
      id: 'perm-7',
      emailAddress: 'team@example.com',
      type: 'group',
      role: 'reader',
      deleted: false,
    },
  ] as DrivePermission[],
};
