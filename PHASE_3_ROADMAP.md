# 🚀 Phase 3 Implementation Roadmap

## 📊 Current Status (as of Dec 22, 2025)

### ✅ Phase 2 - COMPLETED

- ✅ Export to CSV - Fully working
- ✅ Profile Pictures - Fully working
- ✅ Discord Notifications - Fully working
- ✅ Cron Security - Fully working
- ✅ Public Access Page - Fully working (test mode)
- ✅ Database Schema - **Campaign model added and pushed successfully**

### 🚧 Phase 3 - READY TO START

- ✅ Database schema designed and pushed
- ⏳ Feature #1: Multi-Folder Campaign Support (IN PROGRESS)
- ⏳ Feature #2: Analytics Dashboard (NOT STARTED)

---

## 🎯 Phase 3: Feature Breakdown

### Feature #1: Multi-Folder Campaign Support

**Goal**: Allow users to manage multiple Google Drive folders (campaigns) from the UI instead of hardcoding one folder ID in `.env`.

#### **What's Already Done:**

✅ Database schema with `Campaign` model
✅ Campaign relation to `User` model
✅ Basic API structure at `/api/campaigns`

#### **What Needs to Be Built:**

##### **1.1 Backend API Routes** (Priority: HIGH)

**File: `app/api/campaigns/route.ts`**

- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create new campaign
  - Input: `{ name, slug, description, folderId }`
  - Validation: Check if folderId is valid Google Drive folder
  - Auto-generate slug from name if not provided

**File: `app/api/campaigns/[id]/route.ts`**

- `GET /api/campaigns/[id]` - Get single campaign with stats
- `PATCH /api/campaigns/[id]` - Update campaign
- `DELETE /api/campaigns/[id]` - Delete campaign (soft delete)

**File: `app/api/campaigns/[id]/sync/route.ts`**

- `POST /api/campaigns/[id]/sync` - Trigger sync for specific campaign

##### **1.2 Update Sync Engine** (Priority: HIGH)

**File: `lib/sync/reconcile.ts`**

- Modify `runDriveSync()` to accept optional `campaignId` parameter
- When syncing, tag all created/updated users with the `campaignId`
- Update audit logs to include campaign context

**File: `app/api/cron/sync/route.ts`**

- Update cron job to sync ALL active campaigns
- Loop through all campaigns where `isActive = true`
- Run sync for each campaign's `folderId`

##### **1.3 Frontend UI Components** (Priority: MEDIUM)

**File: `app/campaigns/page.tsx`** (NEW)

- Campaign management dashboard
- Table showing all campaigns with stats:
  - Campaign Name
  - Total Leads
  - Last Synced
  - Status (Active/Inactive)
  - Actions (Edit, Sync, Delete)

**File: `components/campaigns/campaign-form.tsx`** (NEW)

- Modal form to create/edit campaigns
- Fields:
  - Campaign Name (required)
  - Slug (auto-generated, editable)
  - Description (optional)
  - Google Drive Folder ID (required, with validation)
  - Active/Inactive toggle

**File: `components/campaigns/campaign-card.tsx`** (NEW)

- Card component showing campaign stats
- Quick actions: Sync Now, View Leads, Edit

##### **1.4 Update Dashboard** (Priority: MEDIUM)

**File: `app/page.tsx`**

- Add campaign filter dropdown to user table
- Show campaign badge on each user row
- Add "Campaign" column to user table

**File: `components/dashboard/stats-cards.tsx`**

- Add "Total Campaigns" stat card
- Add "Leads by Campaign" breakdown

##### **1.5 Validation & Error Handling** (Priority: HIGH)

**File: `lib/validations/campaign.schema.ts`** (NEW)

```typescript
import { z } from 'zod';

export const createCampaignSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  folderId: z.string().min(1),
  isActive: z.boolean().default(true),
});

export const updateCampaignSchema = createCampaignSchema.partial();
```

**File: `lib/google/validate-folder.ts`** (NEW)

- Function to validate Google Drive folder ID
- Check if folder exists and is accessible
- Return folder metadata (name, permissions count)

---

### Feature #2: Analytics Dashboard

**Goal**: Provide insights into lead generation performance across campaigns.

#### **What Needs to Be Built:**

##### **2.1 Backend Analytics API** (Priority: MEDIUM)

**File: `app/api/analytics/overview/route.ts`** (NEW)

- `GET /api/analytics/overview`
- Returns:
  - Total leads (all time)
  - Leads this week/month
  - Growth rate (% change)
  - Top performing campaigns
  - Lead sources breakdown (drive, access_request, manual)

**File: `app/api/analytics/campaigns/route.ts`** (NEW)

- `GET /api/analytics/campaigns`
- Returns per-campaign stats:
  - Total leads
  - New leads (last 7/30 days)
  - Conversion rate (if applicable)
  - Average time to access

**File: `app/api/analytics/timeline/route.ts`** (NEW)

- `GET /api/analytics/timeline?range=7d|30d|90d|1y`
- Returns time-series data for charts:
  - Daily/weekly new leads
  - Cumulative leads over time
  - Campaign-specific trends

##### **2.2 Frontend Analytics Dashboard** (Priority: MEDIUM)

**File: `app/analytics/page.tsx`** (NEW)

- Full analytics dashboard page
- Sections:
  1. **Overview Cards** (top row)
     - Total Leads
     - New Leads (this month)
     - Active Campaigns
     - Growth Rate
  2. **Charts** (middle section)
     - Line chart: Leads over time
     - Bar chart: Leads by campaign
     - Pie chart: Lead sources
  3. **Campaign Performance Table** (bottom)
     - Campaign name
     - Total leads
     - New leads (30d)
     - Last sync
     - Actions

**File: `components/analytics/overview-cards.tsx`** (NEW)

- Stat cards with trend indicators (↑ 12% from last month)
- Color-coded based on performance

**File: `components/analytics/leads-chart.tsx`** (NEW)

- Time-series line chart using Chart.js or Recharts
- Filterable by date range
- Exportable as image

**File: `components/analytics/campaign-breakdown.tsx`** (NEW)

- Bar chart comparing campaigns
- Sortable by different metrics

##### **2.3 Data Aggregation Functions** (Priority: HIGH)

**File: `lib/analytics/queries.ts`** (NEW)

```typescript
// Helper functions for analytics queries
export async function getLeadGrowth(days: number) {
  // Calculate growth rate
}

export async function getCampaignStats(campaignId?: string) {
  // Get campaign-specific stats
}

export async function getTimelineData(range: string) {
  // Get time-series data
}
```

---

## 📋 Implementation Checklist

### Week 1: Multi-Folder Backend (Dec 23-29)

- [ ] Create campaign API routes (`/api/campaigns`)
- [ ] Create campaign validation schemas
- [ ] Update sync engine to support multiple campaigns
- [ ] Update cron job to sync all campaigns
- [ ] Test campaign CRUD operations
- [ ] Test multi-campaign sync

### Week 2: Multi-Folder Frontend (Dec 30 - Jan 5)

- [ ] Build campaign management page (`/campaigns`)
- [ ] Create campaign form component
- [ ] Add campaign filter to dashboard
- [ ] Update user table with campaign column
- [ ] Test UI flows (create, edit, delete campaign)
- [ ] Test campaign-specific sync

### Week 3: Analytics Backend (Jan 6-12)

- [ ] Create analytics API routes
- [ ] Build data aggregation functions
- [ ] Optimize database queries for analytics
- [ ] Add caching for analytics data
- [ ] Test analytics endpoints

### Week 4: Analytics Frontend (Jan 13-19)

- [ ] Build analytics dashboard page
- [ ] Create chart components
- [ ] Add date range filters
- [ ] Add export functionality
- [ ] Test analytics UI
- [ ] Performance optimization

### Week 5: Polish & Testing (Jan 20-26)

- [ ] End-to-end testing (all features)
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Error handling improvements
- [ ] Documentation updates
- [ ] Deploy to production

---

## 🎨 UI/UX Mockup Ideas

### Campaign Management Page

```
┌─────────────────────────────────────────────────────────┐
│  Campaigns                                    [+ New]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Video Course │  │ Ebook Magnet │  │ Templates    │ │
│  │ 127 leads    │  │ 89 leads     │  │ 45 leads     │ │
│  │ Last: 2h ago │  │ Last: 5h ago │  │ Last: 1d ago │ │
│  │ [Sync] [Edit]│  │ [Sync] [Edit]│  │ [Sync] [Edit]│ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  Campaign List                                          │
│  ┌────────────────────────────────────────────────────┐│
│  │ Name          │ Leads │ Last Sync │ Status │ ...  ││
│  ├────────────────────────────────────────────────────┤│
│  │ Video Course  │  127  │ 2h ago    │ Active │ ...  ││
│  │ Ebook Magnet  │   89  │ 5h ago    │ Active │ ...  ││
│  │ Templates     │   45  │ 1d ago    │ Active │ ...  ││
│  └────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Analytics Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  Analytics                          [Last 30 Days ▼]   │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Total   │ │   New    │ │ Campaigns│ │  Growth  │  │
│  │   261    │ │    47    │ │     3    │ │  ↑ 12%   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                          │
│  Leads Over Time                                        │
│  ┌────────────────────────────────────────────────────┐│
│  │     📈 Line Chart (Daily new leads)                ││
│  │                                                     ││
│  └────────────────────────────────────────────────────┘│
│                                                          │
│  Leads by Campaign                                      │
│  ┌────────────────────────────────────────────────────┐│
│  │     📊 Bar Chart (Campaign comparison)             ││
│  │                                                     ││
│  └────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Technical Considerations

### Database Optimization

- Add indexes for analytics queries:
  ```sql
  CREATE INDEX idx_users_created_at ON users(createdAt);
  CREATE INDEX idx_users_campaign_created ON users(campaignId, createdAt);
  ```

### Caching Strategy

- Cache analytics data for 5-15 minutes
- Use React Query's `staleTime` for frontend caching
- Consider Redis for production (optional)

### Error Handling

- Graceful degradation if a campaign folder is deleted
- Handle Google API rate limits per campaign
- Show clear error messages in UI

### Security

- Validate Google Drive folder IDs before saving
- Ensure users can't access other users' campaigns (if multi-tenant)
- Rate limit campaign creation (prevent spam)

---

## 📚 Resources & References

### Libraries to Install

```bash
# For charts (choose one)
pnpm add recharts
# OR
pnpm add chart.js react-chartjs-2

# For date range picker
pnpm add react-day-picker date-fns
```

### API Documentation

- [Google Drive API - Permissions](https://developers.google.com/drive/api/v3/reference/permissions)
- [Prisma Aggregations](https://www.prisma.io/docs/concepts/components/prisma-client/aggregation-grouping-summarizing)
- [TanStack Query - Caching](https://tanstack.com/query/latest/docs/react/guides/caching)

---

## 🎯 Success Metrics

### Phase 3 Completion Criteria

- [ ] Can create/edit/delete campaigns from UI
- [ ] Cron job syncs all active campaigns automatically
- [ ] Dashboard shows campaign filter and stats
- [ ] Analytics page shows meaningful insights
- [ ] All features work on mobile
- [ ] 80%+ test coverage maintained
- [ ] No performance degradation with 10+ campaigns

---

## 🚀 Quick Start (Next Steps)

1. **Start with Backend** (Easiest wins first)

   ```bash
   # Create campaign API routes
   mkdir -p app/api/campaigns/[id]/sync
   touch app/api/campaigns/route.ts
   touch app/api/campaigns/[id]/route.ts
   touch app/api/campaigns/[id]/sync/route.ts
   ```

2. **Test with Postman/Thunder Client**
   - Create a campaign via API
   - Test sync for that campaign
   - Verify users are tagged with campaignId

3. **Build UI Incrementally**
   - Start with simple campaign list page
   - Add create form
   - Add sync button
   - Add analytics later

---

## 💡 Pro Tips

1. **Start Small**: Get one campaign working end-to-end before building the full UI
2. **Use Existing Patterns**: Copy patterns from user management for campaign management
3. **Test Early**: Test each API endpoint before moving to frontend
4. **Mobile First**: Design analytics dashboard mobile-first, then scale up
5. **Iterate**: Ship basic analytics first, add fancy charts later

---

**Last Updated**: December 22, 2025  
**Status**: ✅ Schema pushed, ready to start implementation  
**Next Action**: Create campaign API routes
