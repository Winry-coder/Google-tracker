import { z } from 'zod';

export const syncTypeSchema = z.enum(['manual', 'scheduled', 'webhook']);

export const syncStatusSchema = z.enum(['success', 'partial', 'failed']);

export const triggerSyncSchema = z.object({
  folderId: z.string().optional(),
  force: z.boolean().optional().default(false),
});

export type TriggerSyncInput = z.infer<typeof triggerSyncSchema>;
