import { User as PrismaUser } from '@prisma/client';

export type User = PrismaUser;

export type UserRole = 'viewer' | 'editor' | 'admin';

export type UserSource = 'drive' | 'manual' | 'imported' | 'access_request';

export type UserStatus = 'active' | 'suspended' | 'revoked';

export interface CreateUserInput {
  email: string;
  name?: string;
  role?: UserRole;
  hasAccess?: boolean;
  source?: UserSource;
  googleId?: string;
  googleEmail?: string;
  drivePermissionId?: string;
}

export interface UpdateUserInput {
  name?: string;
  role?: UserRole;
  hasAccess?: boolean;
  status?: UserStatus;
}

export interface UserFilters {
  status?: UserStatus;
  source?: UserSource;
  hasAccess?: boolean;
  search?: string;
}
