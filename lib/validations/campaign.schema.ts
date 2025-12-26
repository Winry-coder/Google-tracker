import { z } from 'zod';

export const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Variant name is required'),
  title: z.string().optional(),
  description: z.string().optional(),
  buttonText: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const createCampaignSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),
  folderId: z.string().min(1, 'Folder ID is required'),
  isActive: z.boolean(),
  // Phase 4
  emailSubject: z.string().optional(),
  emailBody: z.string().optional(),
  webhookUrl: z
    .string()
    .url('Invalid webhook URL')
    .optional()
    .or(z.literal('')),
  variants: z.array(variantSchema).optional(),
});

export const updateCampaignSchema = createCampaignSchema.partial();

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type VariantInput = z.infer<typeof variantSchema>;
