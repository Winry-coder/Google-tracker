# 💎 Access Tracker Pulse: Professional Edition

A high-performance, multi-tenant lead synchronization and analytics platform. This system bridges the gap between Google Drive permissions and actionable marketing data.

---

## ⚡ Quick Capabilities

- **Multi-Campaign Sync**: Manage dozens of Google Drive folders simultaneously.
- **Real-Time Access Provisioning**: Grant folder access instantly via a premium public-facing portal.
- **Deep Analytics**: Visual growth timelines, lead source attribution, and campaign performance metrics.
- **Enterprise Reliability**: Concurrency locking, exponential backoff, and full audit logging.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Database**: Turso (SQLite) + Prisma ORM
- **Styling**: Tailwind CSS + Shadcn UI
- **APIs**: Google Drive v3 SDK
- **Charts**: CSS-based Dynamic Visualization
- **Notifications**: Discord Webhooks

---

## 📋 Pre-Flight Checklist

Before launching, ensure you have the following keys ready:

### 1. Google Cloud Configuration

- **OAuth2 Credentials**: Client ID and Client Secret from the [Google Cloud Console](https://console.cloud.google.com/).
- **Redirect URI**: Set to `http://localhost:3000/api/auth/google` (or your production domain).
- **Refresh Token**: A long-lived token with `https://www.googleapis.com/auth/drive` scope.

### 2. Folder Permissions (CRITICAL)

The Google account associated with your Refresh Token **MUST** have "Editor" permissions on any folder you add to the system.

- **Recommendation**: Create a dedicated Service Account and share your marketing folders with its email.

---

## 🚀 Installation & Setup

```bash
# 1. Clone and Install
npm install

# 2. Database Initialization
npx prisma generate
npx prisma db push

# 3. Environment Config
cp .env.example .env
# Fill in your GOOGLE_ keys and database URL
```

### Environment Variables reference:

| Key                      | Description                                    |
| :----------------------- | :--------------------------------------------- |
| `GOOGLE_DRIVE_FOLDER_ID` | (Deprecated) Used for legacy single-sync mode. |
| `CRON_SECRET`            | Header secret for triggering automated syncs.  |
| `DISCORD_WEBHOOK_URL`    | For real-time lead notifications.              |

---

## 📖 Feature Guide

### 1. Unified Dashboard (`/`)

Monitor your entire user base.

- **Selection**: Perform bulk actions on leads.
- **Filtering**: Segment users by campaign or source.
- **Sync Status**: Real-time indicators of the last successful system-wide sync.

### 2. Campaign Management (`/campaigns`)

The core of your lead generation.

- **Folder Validation**: The system validates folder accessibility before saving.
- **Status Toggle**: Pause syncing for specific campaigns without deleting them.
- **Slug Generation**: Human-readable URLs for your public access pages.

### 3. Public Access Portal (`/access/[slug]`)

A premium, animated landing page for your leads.

- **Dynamic Content**: Automatically pulls the campaign name and description.
- **Instant Access**: Grants Google Drive permissions and triggers lead notifications immediately.
- **Url Format**: `yourdomain.com/access/video-course-2024`

### 4. Analytics Suite (`/analytics`)

Data-driven insights for your marketing team.

- **Growth Chart**: Daily lead acquisition timeline.
- **Source Breakdown**: See which channels (Drive vs. Public Form) are performing.
- **CSV Export**: Download full performance reports for spreadsheets.

---

## 🔒 Reliability Engineering

### Reconciliation Engine

The system uses a **4-Stage Pipeline**:

1. **Fetch**: Recursive, paginated retrieval of Google Drive permissions.
2. **Map**: Normalization of email aliases and permission levels.
3. **Reconcile**: High-speed diffing between Drive state and DB state.
4. **Persist**: Atomic database updates with full Audit Logging.

### Concurrency Protection

We implemented a **Sync Lock** mechanism using the `SyncConfig` table. This prevents race conditions where an automated Cron job and a manual "Sync Now" click attempt to modify the same user record simultaneously.

---

## 🛠 Troubleshooting

| Issue                  | Resolution                                                                                                               |
| :--------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **"Folder Not Found"** | Ensure the Service Account email has **Editor** access to that specific folder.                                          |
| **"Sync Locked"**      | Wait 30 minutes for the safety lock to auto-release or manually set `sync_running` to `false` in the `SyncConfig` table. |
| **"Analytics Empty"**  | Run a manual sync on at least one active campaign to populate the timeline.                                              |

---

**Built for performance. Built for scale.**
Developed by **Antigravity** 🚀
