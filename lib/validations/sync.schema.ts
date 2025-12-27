import { z } from 'zod';

export const syncTypeSchema = z.enum(['manual', 'scheduled', 'webhook']);

export const syncStatusSchema = z.enum(['success', 'partial', 'failed']);

export const triggerSyncSchema = z.object({
  // Optional: if provided, only this campaign will be synced.
  // If omitted, all active campaigns will be synced.
  campaignId: z.string().optional(),
  force: z.boolean().optional().default(false),
});

export type TriggerSyncInput = z.infer<typeof triggerSyncSchema>;
