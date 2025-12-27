# 🚀 Quick Start: Phase 3 Implementation

## ✅ What Just Happened

1. **Schema Migration**: Successfully pushed Campaign model to database
2. **Database Ready**: Your `dev.db` now has the `campaigns` table
3. **Roadmap Created**: Full implementation plan in `PHASE_3_ROADMAP.md`

---

## 🎯 Your Immediate Next Steps (Today)

### Step 1: Create Campaign API Routes (30 mins)

Create these files:

```bash
# Create directory structure
mkdir -p app/api/campaigns/[id]/sync

# Create files (you'll need to add code)
# 1. app/api/campaigns/route.ts
# 2. app/api/campaigns/[id]/route.ts
# 3. app/api/campaigns/[id]/sync/route.ts
```

### Step 2: Create Campaign Validation Schema (10 mins)

**File**: `lib/validations/campaign.schema.ts`

```typescript
import { z } from 'zod';

export const createCampaignSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),
  folderId: z.string().min(1, 'Folder ID is required'),
  isActive: z.boolean().default(true),
});

export const updateCampaignSchema = createCampaignSchema.partial();

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
```

### Step 3: Test Campaign Creation (15 mins)

Use Thunder Client or Postman:

```http
POST http://localhost:3000/api/campaigns
Content-Type: application/json

{
  "name": "Video Course Magnet",
  "slug": "video-course",
  "description": "Lead magnet for video course",
  "folderId": "YOUR_GOOGLE_DRIVE_FOLDER_ID",
  "isActive": true
}
```

---

## 📝 Code Templates to Copy

### Template 1: Campaign List API

**File**: `app/api/campaigns/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { createCampaignSchema } from '@/lib/validations/campaign.schema';

export const dynamic = 'force-dynamic';

// GET /api/campaigns - List all campaigns
export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: campaigns.map((c) => ({
        ...c,
        totalLeads: c._count.users,
      })),
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST /api/campaigns - Create new campaign
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createCampaignSchema.parse(body);

    const campaign = await prisma.campaign.create({
      data: validated,
    });

    return NextResponse.json(
      {
        success: true,
        data: campaign,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
```

### Template 2: Single Campaign API

**File**: `app/api/campaigns/[id]/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { updateCampaignSchema } from '@/lib/validations/campaign.schema';

export const dynamic = 'force-dynamic';

// GET /api/campaigns/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { users: true },
        },
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
  } catch (error) {
    console.error('Error fetching campaign:', error);
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

    const campaign = await prisma.campaign.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

// DELETE /api/campaigns/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.campaign.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}
```

### Template 3: Campaign Sync API

**File**: `app/api/campaigns/[id]/sync/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { runDriveSync } from '@/lib/sync/reconcile';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes

// POST /api/campaigns/[id]/sync
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get campaign
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (!campaign.isActive) {
      return NextResponse.json(
        { error: 'Campaign is not active' },
        { status: 400 }
      );
    }

    // Run sync for this campaign's folder
    const result = await runDriveSync(campaign.folderId);

    // Update campaign stats
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        totalLeads: {
          increment: result.created.length,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error syncing campaign:', error);
    return NextResponse.json(
      { error: 'Failed to sync campaign' },
      { status: 500 }
    );
  }
}
```

---

## 🧪 Testing Your Work

### 1. Start Dev Server

```bash
pnpm dev
```

### 2. Test Campaign CRUD

**Create Campaign:**

```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Campaign",
    "slug": "test-campaign",
    "folderId": "YOUR_FOLDER_ID",
    "isActive": true
  }'
```

**List Campaigns:**

```bash
curl http://localhost:3000/api/campaigns
```

**Get Single Campaign:**

```bash
curl http://localhost:3000/api/campaigns/CAMPAIGN_ID
```

**Sync Campaign (direct):**

```bash
curl -X POST http://localhost:3000/api/campaigns/CAMPAIGN_ID/sync
```

**Sync via manual multi-campaign endpoint (admin):**

```bash
# Single campaign
curl -X POST http://localhost:3000/api/sync \
  -H "Content-Type: application/json" \
  -d '{ "campaignId": "CAMPAIGN_ID" }'

# All active campaigns
curl -X POST http://localhost:3000/api/sync \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## 📊 What You'll See

After creating a campaign and syncing it:

1. **Database**: New row in `campaigns` table
2. **Users**: Users synced from that folder will have `campaignId` set
3. **Stats**: `totalLeads` will increment automatically

---

## 🎯 Success Criteria for Today

- [ ] Campaign API routes created
- [ ] Can create a campaign via API
- [ ] Can list all campaigns
- [ ] Can sync a specific campaign
- [ ] Users are tagged with correct `campaignId`

---

## 🚨 Common Issues & Solutions

### Issue: "Campaign not found"

**Solution**: Check that you're using the correct campaign ID from the database

### Issue: "Folder ID invalid"

**Solution**: Make sure you're using a valid Google Drive folder ID (not the full URL)

### Issue: "Sync fails"

**Solution**: Check that your Google OAuth tokens are still valid in `.env`

---

## 📚 Next Steps After Today

Once the API is working:

1. **Tomorrow**: Build campaign management UI (`app/campaigns/page.tsx`)
2. **Day 3**: Add campaign filter to dashboard
3. **Day 4**: Update cron job to sync all campaigns
4. **Week 2**: Start analytics dashboard

---

## 💡 Pro Tips

1. **Test API First**: Get all endpoints working before building UI
2. **Use Existing Code**: Copy patterns from `/api/users` routes
3. **Check Database**: Use Prisma Studio to verify data: `pnpm prisma studio`
4. **Git Commits**: Commit after each working feature

---

**Ready to start?** Begin with creating the validation schema, then the API routes!

**Questions?** Check `PHASE_3_ROADMAP.md` for detailed explanations.
