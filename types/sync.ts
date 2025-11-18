import { User } from './user';

export type SyncType = 'manual' | 'scheduled' | 'webhook';

export type SyncStatus = 'success' | 'partial' | 'failed';

export interface SyncResult {
  success: boolean;
  created: User[];
  updated: User[];
  revoked: User[];
  duration: number;
  timestamp: string;
  errors?: SyncError[];
}

export interface SyncError {
  message: string;
  userId?: string;
  email?: string;
  code?: string;
}

export interface SyncLogData {
  syncType: SyncType;
  status: SyncStatus;
  usersCreated: number;
  usersUpdated: number;
  usersRevoked: number;
  errorsCount: number;
  driveUserCount?: number;
  appUserCount?: number;
  duration?: number;
  errorMessage?: string;
  errorStack?: string;
}

export interface MappedUser {
  email: string;
  name?: string;
  googleId: string;
  googleEmail: string;
  drivePermissionId: string;
  role: string;
}
