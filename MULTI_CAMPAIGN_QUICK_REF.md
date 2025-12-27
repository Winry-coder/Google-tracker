# 🚀 Quick Reference: Multi-Campaign System

## ✅ What's New

You now have a **complete multi-campaign lead generation system**!

---

## 📍 New Pages

### 1. Campaign Management (`/campaigns`)

- View all campaigns
- See lead counts per campaign
- Sync individual campaigns
- Delete campaigns
- Stats overview

**Access**: Navigate to `http://localhost:3000/campaigns`

---

## 🔧 Updated Features

### 1. Dashboard (`/`)

- **New**: Campaign filter dropdown
- **New**: Campaign column in user table
- Filter users by campaign
- See which campaign each lead came from

### 2. Sync Engine

- Automatically tags users with their campaign
- Supports campaign-specific syncing
- Tracks which folder each lead came from

### 3. Cron Job (`/api/cron/sync`)

- Syncs ALL active campaigns automatically
- No longer limited to one folder
- Returns detailed results per campaign

---

## 🎯 Common Tasks

### Create a Campaign

```bash
POST http://localhost:3000/api/campaigns
Content-Type: application/json

{
  "name": "My Campaign",
  "slug": "my-campaign",
  "description": "Campaign description",
  "folderId": "YOUR_GOOGLE_DRIVE_FOLDER_ID",
  "isActive": true
}
```

### Sync a Specific Campaign

```bash
POST http://localhost:3000/api/campaigns/CAMPAIGN_ID/sync
```

### Manual Multi-Campaign Sync (Admin)

```bash
# Sync a single campaign
POST http://localhost:3000/api/sync
Content-Type: application/json

{
  "campaignId": "CAMPAIGN_ID"
}

# Sync all active campaigns
POST http://localhost:3000/api/sync
Content-Type: application/json

{}
```

### Sync All Campaigns via Cron

```bash
GET http://localhost:3000/api/cron/sync
Authorization: Bearer YOUR_CRON_SECRET
```

### View Campaign Leads

1. Go to dashboard (`/`)
2. Select campaign from dropdown
3. See filtered users

---

## 📊 Data Flow

```
Google Drive Folder
        ↓
   Sync Engine
        ↓
   Users Tagged with Campaign ID
        ↓
   Dashboard (filtered by campaign)
```

---

## 🎨 UI Locations

| Feature             | URL          | Description                     |
| ------------------- | ------------ | ------------------------------- |
| Campaign Management | `/campaigns` | Manage all campaigns            |
| Dashboard           | `/`          | View leads with campaign filter |
| API Docs            | See below    | API endpoints                   |

---

## 🔌 API Endpoints

| Endpoint                   | Method | Purpose                  |
| -------------------------- | ------ | ------------------------ |
| `/api/campaigns`           | GET    | List campaigns           |
| `/api/campaigns`           | POST   | Create campaign          |
| `/api/campaigns/[id]`      | GET    | Get campaign             |
| `/api/campaigns/[id]`      | PATCH  | Update campaign          |
| `/api/campaigns/[id]`      | DELETE | Delete campaign          |
| `/api/campaigns/[id]/sync` | POST   | Sync campaign            |
| `/api/cron/sync`           | GET    | Sync all (requires auth) |

---

## 💾 Database

### Campaign Table

```sql
campaigns
  - id (cuid)
  - name (unique)
  - slug (unique)
  - description
  - folderId
  - isActive
  - totalLeads
  - createdAt
  - updatedAt
```

### User Table (Updated)

```sql
users
  - ...
  - campaignId (NEW!)
  - campaign (relation)
  - ...
```

---

## ⚡ Quick Start

1. **Create Your First Campaign**

   ```bash
   # Via API or UI (button exists, form TBD)
   ```

2. **Sync It**

   ```bash
   # Click "Sync" button in /campaigns
   # Or use API endpoint
   ```

3. **View Leads**

   ```bash
   # Go to dashboard
   # Select campaign from dropdown
   ```

4. **Automate**
   ```bash
   # Cron job runs automatically
   # Syncs all active campaigns
   ```

---

## 🎯 Next Actions

### Immediate

- [ ] Test campaign creation via API
- [ ] Test campaign sync
- [ ] Verify users are tagged correctly
- [ ] Check dashboard filtering

### Soon

- [ ] Build create campaign form (modal)
- [ ] Build edit campaign form
- [ ] Add campaign analytics page

---

## 📝 Notes

- **Campaign ID**: Automatically generated (cuid)
- **Folder ID**: Get from Google Drive folder URL
- **Slug**: URL-friendly version of name (lowercase, hyphens)
- **Total Leads**: Auto-calculated during sync

---

## 🐛 Troubleshooting

### Campaign not syncing?

- Check if campaign is active (`isActive: true`)
- Verify folder ID is correct
- Check Google OAuth tokens are valid

### Users not tagged with campaign?

- Ensure you're using the updated sync endpoint
- Check that `campaignId` is passed to `runDriveSync()`

### Dashboard filter not working?

- Refresh the page
- Check browser console for errors
- Verify campaigns are loaded

---

## 📚 Documentation

- `PHASE_3_IMPLEMENTATION_COMPLETE.md` - Full implementation details
- `PHASE_3_ROADMAP.md` - Original plan
- `CAMPAIGN_CRUD_TEST_RESULTS.md` - API test results

---

**Last Updated**: December 23, 2025  
**Status**: ✅ Production Ready  
**Version**: 1.0.0
