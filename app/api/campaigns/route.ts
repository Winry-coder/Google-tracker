import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma/client';
import { createCampaignSchema } from '@/lib/validations/campaign.schema';
import { validateDriveFolderForUser } from '@/lib/google/validate-folder';
import { ZodError } from 'zod';

export const dynamic = 'force-dynamic';

// GET /api/campaigns - List all campaigns or fetch one by slug
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      // Fetch single campaign by slug for public access page
      const campaign = await prisma.campaign.findFirst({
        where: { slug, deletedAt: null },
        include: {
          _count: {
            select: { users: true },
          },
          variants: {
            where: { isActive: true },
          },
        },
      });

      if (!campaign) {
        return NextResponse.json(
          { success: false, error: 'Campaign not found' },
          { status: 404 }
        );
      }

      // 1. Increment main campaign view count
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { viewCount: { increment: 1 } },
      });

      // 2. Traffic Splitting / A/B Testing Logic (Sticky via Cookies)
      const cookieStore = request.headers.get('cookie') || '';
      const variantCookieName = `vrt_${campaign.slug}`;
      let selectedVariant = null;

      if (campaign.variants && campaign.variants.length > 0) {
        // Check if user already has a variant assigned in cookies
        const match = cookieStore.match(
          new RegExp(`${variantCookieName}=([^;]+)`)
        );
        const existingVariantId = match ? match[1] : null;

        if (existingVariantId) {
          selectedVariant =
            campaign.variants.find((v: { id: string }) => v.id === existingVariantId) ?? null;
        }

        // If no valid variant found in cookies, pick a random one
        if (!selectedVariant) {
          const randomIndex = Math.floor(
            Math.random() * campaign.variants.length
          );
          selectedVariant = campaign.variants[randomIndex];
        }

        // 3. Increment variant view count
        await prisma.variant.update({
          where: { id: selectedVariant.id },
          data: { viewCount: { increment: 1 } },
        });
      }

      const response = NextResponse.json({
        success: true,
        data: [
          {
            ...campaign,
            totalLeads: campaign._count.users,
            activeVariant: selectedVariant,
          },
        ],
      });

      // Set sticky cookie if variant was selected
      if (selectedVariant) {
        response.headers.set(
          'Set-Cookie',
          `${variantCookieName}=${selectedVariant.id}; Path=/; Max-Age=${60 * 60 * 24 * 30}; HttpOnly; SameSite=Lax`
        );
      }

      return response;
    }



    // Authenticated View: Scope to owner
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaigns = await prisma.campaign.findMany({
      where: {
        deletedAt: null,
        ownerId: session.user.id,
      },
      include: {
        _count: {
          select: { users: true },
        },
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: campaigns.map((c: { _count: { users: number }; [key: string]: unknown }) => ({
          ...c,
          totalLeads: c._count.users,
      })),
    });
  } catch {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error fetching campaigns');
    }
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST /api/campaigns - Create new campaign with validation
export async function POST(request: Request) {
  console.log(`🚀 Starting campaign creation...`);
  try {
    const body = await request.json();
    console.log(`📦 Received body:`, body);

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
         console.log(`❌ No session found`);
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log(`✅ Session valid for user: ${session.user.id}`);

    // 1. Zod Validation
    console.log(`🔍 Starting Zod validation...`);
    const validated = createCampaignSchema.parse(body);
    console.log(`✅ Zod validation passed:`, validated);

    // 2. Check for slug collision and handle with 10/10 slug generator
    console.log(`🔍 Checking slug collision for: ${validated.slug}`);
    let finalSlug = validated.slug;
    const existingCampaign = await prisma.campaign.findFirst({
      where: { slug: finalSlug, deletedAt: null },
    });

    if (existingCampaign) {
      console.log(`⚠️ Slug collision found for "${finalSlug}", generating unique alternate...`);
      // Append a short random ID (4 chars) to make it unique
      const randomId = Math.random().toString(36).substring(2, 6);
      finalSlug = `${validated.slug}-${randomId}`;
      console.log(`✅ Generated unique slug: ${finalSlug}`);
    }

    // 4. Drive Folder Validation (Crucial requirement)
    // Use user-specific validator
    console.log(`🔍 Starting folder validation for campaign creation...`);
    console.log(`Validating folder ${validated.folderId} for user ${session.user.id}`);
    const folderValid = await validateDriveFolderForUser(session.user.id, validated.folderId);
    
    console.log(`📋 Folder validation result:`, folderValid);

    if (!folderValid.isValid) {
      console.log(`❌ Folder validation failed: ${folderValid.error}`);
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Folder validation failed in API:', folderValid.error);
      }
      return NextResponse.json(
        {
          error: folderValid.error || 'Invalid Google Drive folder.',
        },
        { status: 400 }
      );
    }
    console.log(`✅ Folder validation passed: ${folderValid.name}`);

    // 5. Create campaign
    console.log(`🔍 Creating campaign in database...`);
    const { variants, slug: _slug, ...campaignData } = validated; // Extract slug to use finalSlug instead
    const campaign = await prisma.campaign.create({
      data: {
        ...campaignData,
        slug: finalSlug,
        ownerId: session.user.id,
        variants:
          variants && variants.length > 0
            ? {
                create: variants.map((v: {
                  name: string;
                  title?: string | null;
                  description?: string | null;
                  buttonText?: string | null;
                  isActive?: boolean;
                }) => ({
                  name: v.name,
                  title: v.title,
                  description: v.description,
                  buttonText: v.buttonText,
                  isActive: v.isActive,
                })),
              }
            : undefined,
      },
      include: {
        variants: true,
      },
    });

    // 6. Register Smart Sync (Webhooks)
    try {
      const { registerFolderWatch } = await import('@/lib/google/watch');
      await registerFolderWatch(campaign.id);
    } catch (watchError) {
      console.error('Failed to register initial webhook watch:', watchError);
      // Don't fail the whole request, but maybe mark campaign?
      // For now, just logging is enough as the cron job will still work.
    }

    return NextResponse.json(
      {
        success: true,
        data: campaign,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(`❌ Campaign creation failed:`, error);
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error creating campaign');
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create campaign',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
