import { Prisma } from '@prisma/client';

export type Campaign = Prisma.CampaignGetPayload<{}>;

export type CampaignWithOwner = Prisma.CampaignGetPayload<{
  include: {
    owner: true;
  };
}>;

export type CampaignWithStats = Prisma.CampaignGetPayload<{
  include: {
    _count: {
      select: { users: true };
    };
  };
}>;

export type CreateCampaignInput = {
  name: string;
  slug: string;
  description?: string;
  folderId: string;
  isActive?: boolean;
  emailSubject?: string;
  emailBody?: string;
  webhookUrl?: string;
};

export type UpdateCampaignInput = Partial<CreateCampaignInput>;