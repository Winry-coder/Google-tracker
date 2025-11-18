import { z } from 'zod';

export const userRoleSchema = z.enum(['viewer', 'editor', 'admin']);

export const userStatusSchema = z.enum(['active', 'suspended', 'revoked']);

export const userSourceSchema = z.enum(['drive', 'manual', 'imported']);

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  role: userRoleSchema.optional().default('viewer'),
  hasAccess: z.boolean().optional().default(false),
  source: userSourceSchema.optional().default('manual'),
  googleId: z.string().optional(),
  googleEmail: z.string().email().optional(),
  drivePermissionId: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  role: userRoleSchema.optional(),
  hasAccess: z.boolean().optional(),
  status: userStatusSchema.optional(),
});

export const userFiltersSchema = z.object({
  status: userStatusSchema.optional(),
  source: userSourceSchema.optional(),
  hasAccess: z.boolean().optional(),
  search: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserFilters = z.infer<typeof userFiltersSchema>;
