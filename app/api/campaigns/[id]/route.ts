import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { updateCampaignSchema } from '@/lib/validations/campaign.schema';
import { validateDriveFolder } from '@/lib/google/validate-folder';

// Route for managing individual campaigns - v2
export const dynamic = 'force-dynamic';

// GET /api/campaigns/[id]
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: params.id,
        deletedAt: null,
      },
      include: {
        _count: {
          select: { users: true },
        },
        variants: true,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...campaign,
        totalLeads: campaign._count.users,
      },
    });
  } catch {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error fetching campaign');
    }
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}

// PATCH /api/campaigns/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateCampaignSchema.parse(body);

    // 1. Check if campaign exists
    const current = await prisma.campaign.findUnique({
      where: { id: params.id },
    });

    if (!current || current.deletedAt) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // 2. Validate folder if it changed
    if (validated.folderId && validated.folderId !== current.folderId) {
      const folderValid = await validateDriveFolder(validated.folderId);
      if (!folderValid.isValid) {
        return NextResponse.json(
          {
            error: folderValid.error || 'Invalid Google Drive folder.',
          },
          { status: 400 }
        );
      }
    }

    // 3. Process Variants if provided
    const { variants, ...campaignData } = validated;

    if (variants) {
      const incomingIds = variants
        .filter((v) => v.id)
        .map((v) => v.id as string);

      // Remove variants not in the incoming list
      await prisma.variant.deleteMany({
        where: {
          campaignId: params.id,
          id: { notIn: incomingIds },
        },
      });

      // Upsert incoming variants
      for (const v of variants) {
        if (v.id) {
          await prisma.variant.update({
            where: { id: v.id },
            data: {
              name: v.name!,
              title: v.title,
              description: v.description,
              buttonText: v.buttonText,
              isActive: v.isActive,
            },
          });
        } else {
          await prisma.variant.create({
            data: {
              campaignId: params.id,
              name: v.name!,
              title: v.title,
              description: v.description,
              buttonText: v.buttonText,
              isActive: v.isActive,
            },
          });
        }
      }
    }

    // 4. Update campaign main data
    const campaign = await prisma.campaign.update({
      where: { id: params.id },
      data: campaignData,
      include: {
        variants: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: campaign,
    });
  } catch {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error updating campaign');
    }
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

// DELETE /api/campaigns/[id] - Soft Delete
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.campaign.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
        isActive: false, // Also de-activate on delete
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully (soft delete)',
    });
  } catch {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error deleting campaign');
    }
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}
