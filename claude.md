🤖 COMPLETE CLAUDE CODE PROJECT BRIEF
Google Drive Access Sync Dashboard

---

📋 PROJECT OVERVIEW
What We're Building
A production-ready Next.js application that automatically synchronizes Google Drive folder permissions with an internal user access database. When users are added/removed from a Google Drive folder, the app automatically creates/updates/revokes their access accordingly.
Core Requirements
● Auto-sync users: Drive folder → App database
● Bi-directional sync: App can also push to Drive (future)
● Real-time dashboard: View all synced users
● Manual + Scheduled sync: On-demand and cron-based
● Full error handling: Token refresh, rate limits, edge cases
● Production-ready: Tests, observability, security, docs

---

🛠 COMPLETE TECH STACK
Frontend
Framework: Next.js 14+ (App Router)
Styling: Tailwind CSS 3+
UI Library: shadcn/ui (latest)
State Management: Zustand 4+
Data Fetching: TanStack Query v5
Tables: TanStack Table v8
Validation: Zod 3+
Language: TypeScript 5+ (strict mode)
Telemetry: OpenTelemetry (browser SDK)

Backend
Runtime: Next.js API Routes (App Router)
ORM: Prisma 5+
Database: Turso (SQLite)
Google API: googleapis (latest)
Auth: OAuth 2.0 (refresh tokens)
Telemetry: OpenTelemetry SDK Node
Cron: Next.js edge functions or Vercel Cron

Testing
Unit Tests: Vitest 1+
E2E Tests: Playwright 1.40+
Browsers: Chrome, Firefox, Safari, Edge
Mobile: iPhone 13, iPad Pro viewports
Coverage: 80%+ target

Development Tools
Package Manager: pnpm 8+
Linting: ESLint 8+ (strict config)
Formatting: Prettier 3+
Git Hooks: Husky + lint-staged
Type Checking: TypeScript strict mode

---

🏗 COMPLETE ARCHITECTURE
File Structure (Mandatory)
/
├── app/ # Next.js App Router
│ ├── (auth)/
│ │ └── login/
│ │ └── page.tsx
│ ├── (dashboard)/
│ │ ├── layout.tsx
│ │ ├── page.tsx # Main dashboard
│ │ └── users/
│ │ ├── page.tsx # Users table
│ │ └── [id]/
│ │ └── page.tsx # User detail
│ ├── api/
│ │ ├── auth/
│ │ │ ├── google/
│ │ │ │ └── route.ts # OAuth callback
│ │ │ └── session/
│ │ │ └── route.ts
│ │ ├── sync/
│ │ │ ├── route.ts # POST /api/sync (manual)
│ │ │ └── status/
│ │ │ └── route.ts # GET sync status
│ │ └── users/
│ │ ├── route.ts # GET/POST users
│ │ └── [id]/
│ │ └── route.ts # GET/PATCH/DELETE user
│ ├── layout.tsx
│ └── globals.css
│
├── components/
│ ├── ui/ # shadcn/ui components
│ │ ├── button.tsx
│ │ ├── table.tsx
│ │ ├── dialog.tsx
│ │ ├── toast.tsx
│ │ ├── skeleton.tsx
│ │ └── ...
│ ├── tables/
│ │ ├── users-table.tsx
│ │ ├── columns.tsx
│ │ └── data-table.tsx
│ ├── layouts/
│ │ ├── header.tsx
│ │ ├── sidebar.tsx
│ │ └── footer.tsx
│ ├── sync/
│ │ ├── sync-button.tsx
│ │ ├── sync-status.tsx
│ │ └── sync-history.tsx
│ └── providers/
│ ├── query-provider.tsx
│ └── toast-provider.tsx
│
├── lib/
│ ├── google/
│ │ ├── client.ts # OAuth2 client factory
│ │ ├── drive.ts # Drive API methods
│ │ ├── permissions.ts # Permission helpers
│ │ └── types.ts
│ ├── prisma/
│ │ ├── client.ts # Prisma singleton
│ │ └── seed.ts
│ ├── sync/
│ │ ├── reconcile.ts # Main sync engine
│ │ ├── fetch-drive-users.ts # Fetch from Drive
│ │ ├── map-permissions.ts # Normalize data
│ │ ├── create-users.ts # User creation logic
│ │ ├── update-users.ts # User update logic
│ │ ├── revoke-users.ts # Access revocation
│ │ └── types.ts
│ ├── telemetry/
│ │ ├── tracer.ts # OpenTelemetry setup
│ │ └── logger.ts
│ ├── auth/
│ │ ├── session.ts
│ │ └── middleware.ts
│ ├── utils/
│ │ ├── cn.ts # className helper
│ │ ├── format.ts
│ │ └── errors.ts
│ └── validations/
│ ├── user.schema.ts # Zod schemas
│ ├── sync.schema.ts
│ └── api.schema.ts
│
├── store/
│ ├── user-store.ts # Zustand user state
│ ├── ui-store.ts # UI state (modals, etc)
│ └── sync-store.ts # Sync status state
│
├── hooks/
│ ├── use-users.ts # TanStack Query hooks
│ ├── use-sync.ts
│ └── use-toast.ts
│
├── types/
│ ├── user.ts
│ ├── sync.ts
│ ├── google.ts
│ └── api.ts
│
├── prisma/
│ ├── schema.prisma
│ ├── migrations/
│ └── seed.ts
│
├── tests/
│ ├── unit/
│ │ ├── lib/
│ │ │ ├── google/
│ │ │ │ ├── client.test.ts
│ │ │ │ └── permissions.test.ts
│ │ │ ├── sync/
│ │ │ │ ├── reconcile.test.ts
│ │ │ │ ├── create-users.test.ts
│ │ │ │ ├── update-users.test.ts
│ │ │ │ └── revoke-users.test.ts
│ │ │ └── validations/
│ │ │ └── schemas.test.ts
│ │ ├── components/
│ │ │ ├── sync-button.test.tsx
│ │ │ └── users-table.test.tsx
│ │ └── store/
│ │ └── user-store.test.ts
│ ├── e2e/
│ │ ├── auth.spec.ts
│ │ ├── dashboard.spec.ts
│ │ ├── users-table.spec.ts
│ │ ├── sync-flow.spec.ts
│ │ └── mobile.spec.ts
│ ├── fixtures/
│ │ ├── mock-google-responses.ts
│ │ ├── mock-users.ts
│ │ └── test-data.ts
│ └── setup/
│ ├── vitest.setup.ts
│ └── playwright.setup.ts
│
├── scripts/
│ ├── sync-cron.ts # Background sync job
│ └── setup-google-auth.ts # OAuth setup helper
│
├── public/
│ └── ...
│
├── .env.example # ALL TODO blocks here
├── .env # Gitignored
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── package.json
├── pnpm-lock.yaml
├── README.md
└── claude.md # This file

---

🔐 ENVIRONMENT VARIABLES (.env.example)

# ============================================

# GOOGLE OAUTH & DRIVE

# ============================================

# TODO: Junior Developer — Get from Google Cloud Console

# Steps: https://console.cloud.google.com/apis/credentials

GOOGLE_CLIENT_ID=/_ TODO: Junior Developer — fill in: GOOGLE_CLIENT_ID _/
GOOGLE_CLIENT_SECRET=/_ TODO: Junior Developer — fill in: GOOGLE_CLIENT_SECRET _/
GOOGLE_REDIRECT_URI=/_ TODO: Junior Developer — fill in: http://localhost:3000/api/auth/google _/

# TODO: Junior Developer — Generate after first OAuth flow

# Run: pnpm run setup:google-auth

GOOGLE_REFRESH_TOKEN=/_ TODO: Junior Developer — fill in: GOOGLE_REFRESH_TOKEN _/

# TODO: Junior Developer — Right-click Drive folder → Share → Get shareable link → Extract ID

# Format: https://drive.google.com/drive/folders/{THIS_IS_THE_ID}

GOOGLE_DRIVE_FOLDER_ID=/_ TODO: Junior Developer — fill in: GOOGLE_DRIVE_FOLDER_ID _/

# ============================================

# DATABASE (TURSO)

# ============================================

# TODO: Junior Developer — Get from https://turso.tech

# Run: turso db create <db-name>

# Run: turso db show <db-name> --url

TURSO_DATABASE_URL=/_ TODO: Junior Developer — fill in: libsql://your-db.turso.io _/

# Run: turso db tokens create <db-name>

TURSO_AUTH_TOKEN=/_ TODO: Junior Developer — fill in: TURSO_AUTH_TOKEN _/

# ============================================

# APP CONFIGURATION

# ============================================

# TODO: Junior Developer — Local: http://localhost:3000, Production: https://yourdomain.com

NEXT_PUBLIC_API_URL=/_ TODO: Junior Developer — fill in: NEXT_PUBLIC_API_URL _/

# TODO: Junior Developer — Generate with: openssl rand -base64 32

NEXTAUTH_SECRET=/_ TODO: Junior Developer — fill in: NEXTAUTH_SECRET _/

# TODO: Junior Developer — Same as NEXT_PUBLIC_API_URL

NEXTAUTH_URL=/_ TODO: Junior Developer — fill in: NEXTAUTH_URL _/

# ============================================

# USER PROVISIONING

# ============================================

# TODO: Junior Developer — Set default role for Drive-provisioned users

# Options: "viewer" | "editor" | "admin"

DEFAULT_USER_ROLE=/_ TODO: Junior Developer — fill in: viewer _/

# ============================================

# OBSERVABILITY (OPENTELEMETRY)

# ============================================

# TODO: Junior Developer — Get from your observability provider

# Examples: Honeycomb, Grafana Cloud, Datadog, New Relic

OTEL_EXPORTER_OTLP_ENDPOINT=/_ TODO: Junior Developer — fill in: OTEL endpoint _/
OTEL_EXPORTER_OTLP_HEADERS=/_ TODO: Junior Developer — fill in: x-honeycomb-team=your-api-key _/
OTEL_SERVICE_NAME=/_ TODO: Junior Developer — fill in: drive-sync-app _/

# ============================================

# TESTING (DO NOT COMMIT THESE)

# ============================================

# TODO: Junior Developer — Create test-only Google workspace

TEST_GOOGLE_CLIENT_ID=/_ TODO: Junior Developer — test-only client ID _/
TEST_GOOGLE_CLIENT_SECRET=/_ TODO: Junior Developer — test-only client secret _/
TEST_GOOGLE_REFRESH_TOKEN=/_ TODO: Junior Developer — test-only refresh token _/
TEST_DRIVE_FOLDER_ID=/_ TODO: Junior Developer — test-only folder ID _/

# TODO: Junior Developer — Create test Turso database

TEST_TURSO_DATABASE_URL=/_ TODO: Junior Developer — test database URL _/
TEST_TURSO_AUTH_TOKEN=/_ TODO: Junior Developer — test database token _/

# ============================================

# CRON / BACKGROUND JOBS

# ============================================

# TODO: Junior Developer — Cron secret for securing sync endpoint

# Generate with: openssl rand -base64 32

CRON_SECRET=/_ TODO: Junior Developer — fill in: CRON_SECRET _/

# TODO: Junior Developer — Sync frequency (cron format)

# Default: "0 _/6 _ \* \*" (every 6 hours)

SYNC_CRON_SCHEDULE=/_ TODO: Junior Developer — fill in: 0 _/6 \* \* \* \*/

---

📊 DATABASE SCHEMA (Prisma)
prisma/schema.prisma
generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "sqlite"
url = env("TURSO_DATABASE_URL")
}

// ============================================
// USER MODEL
// ============================================
model User {
id String @id @default(cuid())
email String @unique
name String?
hasAccess Boolean @default(false)
role String @default("viewer") // viewer | editor | admin

// Google-specific fields
googleId String? @unique
googleEmail String? // Original email from Google (before normalization)
drivePermissionId String? // Google Drive permission ID

// Metadata
source String @default("manual") // "drive" | "manual" | "imported"
status String @default("active") // "active" | "suspended" | "revoked"

// Timestamps
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
lastSyncedAt DateTime?
revokedAt DateTime?
lastAccessAt DateTime?

// Relations
syncLogs SyncLog[]
auditLogs AuditLog[]

@@index([email])
@@index([googleId])
@@index([source])
@@index([status])
@@index([hasAccess])
}

// ============================================
// SYNC LOG MODEL
// ============================================
model SyncLog {
id String @id @default(cuid())

// Sync metadata
syncType String // "manual" | "scheduled" | "webhook"
status String // "success" | "partial" | "failed"

// Results
usersCreated Int @default(0)
usersUpdated Int @default(0)
usersRevoked Int @default(0)
errorsCount Int @default(0)

// Details
driveUserCount Int? // Total users in Drive folder
appUserCount Int? // Total users in app
duration Int? // Duration in milliseconds

// Error tracking
errorMessage String?
errorStack String?

// Timestamps
startedAt DateTime @default(now())
completedAt DateTime?

// Relations
userId String?
user User? @relation(fields: [userId], references: [id])

@@index([status])
@@index([syncType])
@@index([startedAt])
}

// ============================================
// AUDIT LOG MODEL
// ============================================
model AuditLog {
id String @id @default(cuid())

// Event details
eventType String // "user.created" | "user.updated" | "access.granted" | "access.revoked"
eventSource String // "drive_sync" | "admin_action" | "api"

// Changes
oldValue String? // JSON string of old state
newValue String? // JSON string of new state

// Actor
performedBy String? // User ID or "system"
performedByEmail String?

// Context
metadata String? // JSON string for additional context
ipAddress String?
userAgent String?

// Timestamp
createdAt DateTime @default(now())

// Relations
userId String?
user User? @relation(fields: [userId], references: [id])

@@index([eventType])
@@index([userId])
@@index([createdAt])
}

// ============================================
// SYNC CONFIG MODEL (OPTIONAL)
// ============================================
model SyncConfig {
id String @id @default(cuid())
key String @unique
value String
description String?
updatedAt DateTime @updatedAt

@@index([key])
}

---

🔄 SYNC ENGINE ALGORITHM (DETAILED)
Core Reconciliation Logic
// lib/sync/reconcile.ts

/\*\*

- 4-STAGE SYNC PIPELINE
-
- Stage 1: FETCH - Get Drive permissions
- Stage 2: MAP - Normalize to internal format
- Stage 3: RECONCILE - Determine actions (create/update/revoke)
- Stage 4: PERSIST - Execute database operations
  \*/

export async function runDriveSync(folderId: string): Promise<SyncResult> {
const span = trace.getTracer('sync').startSpan('runDriveSync');
const startTime = Date.now();

try {
// ============================================
// STAGE 1: FETCH DRIVE PERMISSIONS
// ============================================
const drivePermissions = await fetchDrivePermissions(folderId);
span.addEvent('Fetched Drive permissions', { count: drivePermissions.length });

    // ============================================
    // STAGE 2: MAP TO INTERNAL FORMAT
    // ============================================
    const mappedUsers = drivePermissions
      .map(mapDrivePermissionToUser)
      .filter(Boolean);
    span.addEvent('Mapped permissions', { count: mappedUsers.length });

    // ============================================
    // STAGE 3: RECONCILE WITH DATABASE
    // ============================================
    const driveEmails = new Set(
      mappedUsers.map(u => normalizeEmail(u.email))
    );

    // Fetch existing users from DB
    const existingUsers = await prisma.user.findMany({
      where: {
        OR: [
          { email: { in: Array.from(driveEmails) } },
          { source: 'drive' }
        ]
      }
    });

    const existingByEmail = new Map(
      existingUsers.map(u => [normalizeEmail(u.email), u])
    );

    // Determine actions
    const toCreate: MappedUser[] = [];
    const toUpdate: { user: User; updates: Partial<User> }[] = [];
    const toRevoke: User[] = [];

    // Check Drive users against DB
    for (const mappedUser of mappedUsers) {
      const normalizedEmail = normalizeEmail(mappedUser.email);
      const existing = existingByEmail.get(normalizedEmail);

      if (!existing) {
        toCreate.push(mappedUser);
      } else {
        const updates = determineUpdates(existing, mappedUser);
        if (Object.keys(updates).length > 0) {
          toUpdate.push({ user: existing, updates });
        }
      }
    }

    // Check DB users no longer in Drive
    for (const dbUser of existingUsers) {
      if (dbUser.source === 'drive') {
        const normalizedEmail = normalizeEmail(dbUser.email);
        if (!driveEmails.has(normalizedEmail) && dbUser.hasAccess) {
          toRevoke.push(dbUser);
        }
      }
    }

    span.addEvent('Reconciliation complete', {
      toCreate: toCreate.length,
      toUpdate: toUpdate.length,
      toRevoke: toRevoke.length
    });

    // ============================================
    // STAGE 4: PERSIST CHANGES
    // ============================================
    const results = await persistChanges({
      toCreate,
      toUpdate,
      toRevoke
    });

    const duration = Date.now() - startTime;

    // Log sync completion
    await prisma.syncLog.create({
      data: {
        syncType: 'manual',
        status: 'success',
        usersCreated: results.created.length,
        usersUpdated: results.updated.length,
        usersRevoked: results.revoked.length,
        driveUserCount: mappedUsers.length,
        appUserCount: existingUsers.length,
        duration,
        completedAt: new Date()
      }
    });

    span.end();

    return {
      success: true,
      created: results.created,
      updated: results.updated,
      revoked: results.revoked,
      duration,
      timestamp: new Date().toISOString()
    };

} catch (error) {
span.recordException(error as Error);
span.end();

    // Log sync failure
    await prisma.syncLog.create({
      data: {
        syncType: 'manual',
        status: 'failed',
        errorsCount: 1,
        errorMessage: (error as Error).message,
        errorStack: (error as Error).stack,
        completedAt: new Date()
      }
    });

    throw error;

}
}

Edge Cases Handling
// lib/sync/edge-cases.ts

/\*\*

- EDGE CASE 1: Alias Emails
- Google allows multiple email aliases (e.g., john@domain.com, john+work@domain.com)
- Solution: Normalize emails and use googleId as primary identifier
  \*/
  function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
  }

/\*\*

- EDGE CASE 2: Suspended Google Accounts
- Drive API returns `deleted: true` for suspended users
- Solution: Mark as suspended in app, don't delete
  \*/
  function handleSuspendedAccount(permission: DrivePermission): UserUpdate {
  if (permission.deleted) {
  return {
  status: 'suspended',
  hasAccess: false,
  revokedAt: new Date()
  };
  }
  return {};
  }

/\*\*

- EDGE CASE 3: Token Expiration
- OAuth refresh tokens can expire or be revoked
- Solution: Implement token refresh with fallback
  \*/
  async function getValidOAuthClient(): Promise<OAuth2Client> {
  const client = createOAuthClient();

try {
// Test token validity
await client.getAccessToken();
return client;
} catch (error) {
if (error.code === 401) {
// Token expired, attempt refresh
try {
await client.refreshAccessToken();
return client;
} catch (refreshError) {
// Refresh failed, alert admin
await alertAdminTokenExpired(refreshError);
throw new Error('OAuth token expired and refresh failed');
}
}
throw error;
}
}

/\*\*

- EDGE CASE 4: Rate Limiting
- Google Drive API has quota limits (10,000 queries/100 sec)
- Solution: Implement exponential backoff with jitter
  _/
  async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
  ): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
  try {
  return await fn();
  } catch (error) {
  if (error.code === 429 && i < maxRetries - 1) {
  const delay = Math.min(1000 _ 2 \*_ i + Math.random() _ 1000, 10000);
  await new Promise(resolve => setTimeout(resolve, delay));
  continue;
  }
  throw error;
  }
  }
  throw new Error('Max retries exceeded');
  }

/\*\*

- EDGE CASE 5: Domain-Wide Permissions
- Drive folder might have domain-wide permission (e.g., @company.com)
- Solution: Skip domain permissions, only process individual users
  \*/
  function shouldProcessPermission(permission: DrivePermission): boolean {
  // Skip domain-wide permissions
  if (permission.type === 'domain') {
  return false;
  }

// Skip group permissions (handle separately if needed)
if (permission.type === 'group') {
return false;
}

// Only process user permissions
return permission.type === 'user' && !!permission.emailAddress;
}

/\*\*

- EDGE CASE 6: Duplicate Permissions
- Same user might have multiple permission entries
- Solution: Deduplicate by googleId, prefer highest permission level
  \*/
  function deduplicatePermissions(
  permissions: DrivePermission[]
  ): DrivePermission[] {
  const byGoogleId = new Map<string, DrivePermission>();

for (const perm of permissions) {
const existing = byGoogleId.get(perm.id);
if (!existing || getRoleLevel(perm.role) > getRoleLevel(existing.role)) {
byGoogleId.set(perm.id, perm);
}
}

return Array.from(byGoogleId.values());
}

function getRoleLevel(role: string): number {
const levels = { reader: 1, commenter: 2, writer: 3, owner: 4 };
return levels[role] || 0;
}

/\*\*

- EDGE CASE 7: Large Folders (10,000+ users)
- Fetching and processing thousands of users can timeout
- Solution: Implement pagination and batch processing
  \*/
  async function fetchAllPermissionsPaginated(
  folderId: string
  ): Promise<DrivePermission[]> {
  const allPermissions: DrivePermission[] = [];
  let pageToken: string | undefined;

do {
const response = await fetchWithRetry(() =>
drive.permissions.list({
fileId: folderId,
fields: 'nextPageToken,permissions(id,emailAddress,role,type,deleted)',
pageSize: 100,
pageToken
})
);

    allPermissions.push(...(response.data.permissions || []));
    pageToken = response.data.nextPageToken;

} while (pageToken);

return allPermissions;
}

/\*\*

- EDGE CASE 8: Concurrent Sync Runs
- Multiple sync operations might run simultaneously
- Solution: Implement locking mechanism
  \*/
  async function acquireSyncLock(): Promise<boolean> {
  const lockKey = 'sync:lock';
  const lockDuration = 300000; // 5 minutes

// Check if lock exists
const existing = await prisma.syncConfig.findUnique({
where: { key: lockKey }
});

if (existing) {
const lockTime = new Date(existing.value).getTime();
if (Date.now() - lockTime < lockDuration) {
return false; // Lock still held
}
}

// Acquire lock
await prisma.syncConfig.upsert({
where: { key: lockKey },
update: { value: new Date().toISOString() },
create: { key: lockKey, value: new Date().toISOString() }
});

return true;
}

---

🧪 COMPLETE TESTING STRATEGY

1. Unit Tests (Vitest)
   Test Structure
   // tests/unit/lib/sync/reconcile.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runDriveSync } from '@/lib/sync/reconcile';
import { mockDrivePermissions } from '@/tests/fixtures/mock-google-responses';

describe('Drive Sync Engine', () => {
beforeEach(() => {
vi.clearAllMocks();
});

describe('User Creation', () => {
it('should create new users from Drive permissions', async () => {
// Arrange
vi.mocked(fetchDrivePermissions).mockResolvedValue([
{ emailAddress: 'new@example.com', role: 'reader', type: 'user' }
]);

      // Act
      const result = await runDriveSync('test-folder-id');

      // Assert
      expect(result.created).toHaveLength(1);
      expect(result.created[0].email).toBe('new@example.com');
      expect(result.created[0].source).toBe('drive');
    });

    it('should handle email normalization', async () => {
      // Test lowercase, trim, alias handling
    });

    it('should set default role for new users', async () => {
      // Assert DEFAULT_USER_ROLE is applied
    });

});

describe('User Updates', () => {
it('should update existing users who gained access', async () => {
// Test hasAccess: false -> true
});

    it('should update user metadata from Drive', async () => {
      // Test name, role updates
    });

    it('should update lastSyncedAt timestamp', async () => {
      // Assert timestamp is current
    });

});

describe('Access Revocation', () => {
it('should revoke users removed from Drive', async () => {
// Test hasAccess: true -> false
});

    it('should set revokedAt timestamp', async () => {
      // Assert revokedAt is set
    });

    it('should not revoke manually-created users', async () => {
      // Test source: 'manual' users are skipped
    });

});

describe('Edge Cases', () => {
it('should handle suspended Google accounts', async () => {
vi.mocked(fetchDrivePermissions).mockResolvedValue([
{ emailAddress: 'suspended@example.com', deleted: true }
]);

      const result = await runDriveSync('test-folder-id');
      expect(result.updated[0].status).toBe('suspended');
    });

    it('should handle duplicate emails with different aliases', async () => {
      // Test john@example.com vs john+work@example.com
    });

    it('should skip domain-wide permissions', async () => {
      vi.mocked(fetchDrivePermissions).mockResolvedValue([
        { type: 'domain', domain: 'example.com' }
      ]);

      const result = await runDriveSync('test-folder-id');
      expect(result.created).toHaveLength(0);
    });

    it('should handle token expiration gracefully', async () => {
      // Mock 401 error -> refresh -> retry
    });

    it('should implement rate limit backoff', async () => {
      // Mock 429 error -> exponential backoff
      const mockFetch = vi.fn()
        .mockRejectedValueOnce({ code: 429 })
        .mockResolvedValueOnce({ data: { permissions: [] } });

      await fetchWithRetry(mockFetch);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle large permission lists with pagination', async () => {
      // Mock paginated responses
    });

    it('should prevent concurrent sync runs', async () => {
      // Test sync locking mechanism
    });

});

describe('Error Handling', () => {
it('should log sync failures to database', async () => {
vi.mocked(fetchDrivePermissions).mockRejectedValue(
new Error('Network error')
);

      await expect(runDriveSync('test-folder-id')).rejects.toThrow();

      const syncLog = await prisma.syncLog.findFirst({
        where: { status: 'failed' }
      });
      expect(syncLog).toBeDefined();
      expect(syncLog?.errorMessage).toContain('Network error');
    });

    it('should record OpenTelemetry spans on errors', async () => {
      // Assert span.recordException called
    });

});

describe('Performance', () => {
it('should complete sync in under 30 seconds for 1000 users', async () => {
const largeUserSet = Array.from({ length: 1000 }, (\_, i) => ({
emailAddress: `user${i}@example.com`,
role: 'reader',
type: 'user'
}));

      vi.mocked(fetchDrivePermissions).mockResolvedValue(largeUserSet);

      const start = Date.now();
      await runDriveSync('test-folder-id');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(30000);
    });

});
});

Mock Fixtures
// tests/fixtures/mock-google-responses.ts

export const mockDrivePermissions = {
standard: [
{
id: 'perm-1',
emailAddress: 'alice@example.com',
role: 'reader',
type: 'user',
deleted: false
},
{
id: 'perm-2',
emailAddress: 'bob@example.com',
role: 'writer',
type: 'user',
deleted: false
}
],

withSuspended: [
{
id: 'perm-3',
emailAddress: 'suspended@example.com',
role: 'reader',
type: 'user',
deleted: true
}
],

withDomainWide: [
{
id: 'perm-4',
type: 'domain',
domain: 'example.com',
role: 'reader'
}
],

withAliases: [
{
id: 'perm-5',
emailAddress: 'john@example.com',
role: 'reader',
type: 'user'
},
{
id: 'perm-6',
emailAddress: 'john+work@example.com',
role: 'writer',
type: 'user'
}
]
};

export const mockUsers = {
active: {
id: 'user-1',
email: 'alice@example.com',
hasAccess: true,
source: 'drive',
status: 'active'
},

revoked: {
id: 'user-2',
email: 'old@example.com',
hasAccess: false,
source: 'drive',
status: 'active',
revokedAt: new Date('2024-01-01')
},

manual: {
id: 'user-3',
email: 'manual@example.com',
hasAccess: true,
source: 'manual',
status: 'active'
}
};

---

2. End-to-End Tests (Playwright)
   Playwright Configuration
   // playwright.config.ts

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
testDir: './tests/e2e',
fullyParallel: true,
forbidOnly: !!process.env.CI,
retries: process.env.CI ? 2 : 0,
workers: process.env.CI ? 1 : undefined,
reporter: [
['html'],
['json', { outputFile: 'test-results/results.json' }],
['junit', { outputFile: 'test-results/junit.xml' }]
],

use: {
baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
trace: 'on-first-retry',
screenshot: 'only-on-failure',
video: 'retain-on-failure',
},

projects: [
// ============================================
// DESKTOP BROWSERS
// ============================================
{
name: 'chromium',
use: { ...devices['Desktop Chrome'] },
},
{
name: 'firefox',
use: { ...devices['Desktop Firefox'] },
},
{
name: 'webkit',
use: { ...devices['Desktop Safari'] },
},
{
name: 'edge',
use: {
...devices['Desktop Edge'],
channel: 'msedge'
},
},

    // ============================================
    // MOBILE VIEWPORTS
    // ============================================
    {
      name: 'iphone-13',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'iphone-13-pro',
      use: { ...devices['iPhone 13 Pro'] },
    },
    {
      name: 'ipad-pro',
      use: { ...devices['iPad Pro'] },
    },
    {
      name: 'pixel-5',
      use: { ...devices['Pixel 5'] },
    },

    // ============================================
    // TABLET VIEWPORTS
    // ============================================
    {
      name: 'ipad-landscape',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1366, height: 1024 }
      },
    },

],

webServer: {
command: 'pnpm dev',
url: 'http://localhost:3000',
reuseExistingServer: !process.env.CI,
timeout: 120 \* 1000,
},
});

E2E Test Suite
// tests/e2e/sync-flow.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Drive Sync Flow', () => {
test.beforeEach(async ({ page }) => {
// Setup: Login and navigate to dashboard
await page.goto('/login');
await page.fill('input[name="email"]', 'admin@example.com');
await page.fill('input[name="password"]', 'test-password');
await page.click('button[type="submit"]');
await expect(page).toHaveURL('/dashboard');
});

test('should display sync button on dashboard', async ({ page }) => {
const syncButton = page.getByRole('button', { name: /sync now/i });
await expect(syncButton).toBeVisible();
});

test('should trigger sync and display success toast', async ({ page }) => {
// Click sync button
await page.click('button:has-text("Sync Now")');

    // Verify loading state
    await expect(page.getByText(/syncing/i)).toBeVisible();

    // Wait for completion
    await expect(page.getByText(/sync complete/i)).toBeVisible({ timeout: 30000 });

    // Verify toast notification
    const toast = page.locator('[role="status"]');
    await expect(toast).toContainText(/successfully synced/i);

});

test('should update user table after sync', async ({ page }) => {
// Get initial user count
const initialRows = await page.locator('table tbody tr').count();

    // Trigger sync
    await page.click('button:has-text("Sync Now")');
    await expect(page.getByText(/sync complete/i)).toBeVisible({ timeout: 30000 });

    // Verify table updated
    const newRows = await page.locator('table tbody tr').count();
    expect(newRows).toBeGreaterThanOrEqual(initialRows);

});

test('should display sync history', async ({ page }) => {
await page.goto('/dashboard/sync-history');

    // Verify sync logs table
    await expect(page.getByRole('heading', { name: /sync history/i })).toBeVisible();
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Verify columns
    await expect(table.locator('th:has-text("Date")')).toBeVisible();
    await expect(table.locator('th:has-text("Status")')).toBeVisible();
    await expect(table.locator('th:has-text("Created")')).toBeVisible();
    await expect(table.locator('th:has-text("Updated")')).toBeVisible();
    await expect(table.locator('th:has-text("Revoked")')).toBeVisible();

});

test('should handle sync errors gracefully', async ({ page }) => {
// Mock API error
await page.route('\*\*/api/sync', route =>
route.fulfill({ status: 500, body: 'Internal Server Error' })
);

    // Trigger sync
    await page.click('button:has-text("Sync Now")');

    // Verify error message
    await expect(page.getByText(/sync failed/i)).toBeVisible();

    // Verify error details in toast
    const toast = page.locator('[role="alert"]');
    await expect(toast).toBeVisible();

});
});

// tests/e2e/users-table.spec.ts

test.describe('Users Table', () => {
test('should display all users in table', async ({ page }) => {
await page.goto('/dashboard/users');

    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Verify headers
    await expect(table.locator('th:has-text("Email")')).toBeVisible();
    await expect(table.locator('th:has-text("Name")')).toBeVisible();
    await expect(table.locator('th:has-text("Status")')).toBeVisible();
    await expect(table.locator('th:has-text("Source")')).toBeVisible();

});

test('should filter users by status', async ({ page }) => {
await page.goto('/dashboard/users');

    // Click status filter
    await page.click('button:has-text("Status")');
    await page.click('text=Active');

    // Verify filtered results
    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const statusCell = rows.nth(i).locator('td').nth(3);
      await expect(statusCell).toContainText(/active/i);
    }

});

test('should sort users by email', async ({ page }) => {
await page.goto('/dashboard/users');

    // Click email column header
    await page.click('th:has-text("Email")');

    // Get first email
    const firstEmail = await page.locator('table tbody tr:first-child td:first-child').textContent();

    // Click again to reverse sort
    await page.click('th:has-text("Email")');

    // Get new first email
    const newFirstEmail = await page.locator('table tbody tr:first-child td:first-child').textContent();

    // Verify sort changed
    expect(firstEmail).not.toBe(newFirstEmail);

});

test('should paginate users', async ({ page }) => {
await page.goto('/dashboard/users');

    // Verify pagination controls
    await expect(page.getByRole('button', { name: /previous/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /next/i })).toBeVisible();

    // Get first user email
    const firstUserEmail = await page.locator('table tbody tr:first-child td:first-child').textContent();

    // Go to next page
    await page.click('button:has-text("Next")');

    // Get new first user email
    const newFirstUserEmail = await page.locator('table tbody tr:first-child td:first-child').textContent();

    // Verify different users
    expect(firstUserEmail).not.toBe(newFirstUserEmail);

});

test('should search users by email', async ({ page }) => {
await page.goto('/dashboard/users');

    // Type in search box
    await page.fill('input[placeholder*="Search"]', 'alice@example.com');

    // Verify filtered results
    const rows = page.locator('table tbody tr');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('alice@example.com');

});

test('should open user detail modal', async ({ page }) => {
await page.goto('/dashboard/users');

    // Click first user row
    await page.click('table tbody tr:first-child');

    // Verify modal opened
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Verify modal content
    await expect(modal.getByText(/user details/i)).toBeVisible();
    await expect(modal.getByText(/email/i)).toBeVisible();
    await expect(modal.getByText(/access/i)).toBeVisible();

});
});

// tests/e2e/mobile.spec.ts

test.describe('Mobile Responsiveness', () => {
test('should display mobile menu on iPhone', async ({ page }) => {
// This test automatically uses iPhone 13 viewport from config
await page.goto('/dashboard');

    // Verify hamburger menu visible
    const mobileMenu = page.getByRole('button', { name: /menu/i });
    await expect(mobileMenu).toBeVisible();

    // Click to open
    await mobileMenu.click();

    // Verify navigation visible
    await expect(page.getByRole('navigation')).toBeVisible();

});

test('should scroll table horizontally on mobile', async ({ page }) => {
await page.goto('/dashboard/users');

    // Verify table is scrollable
    const tableContainer = page.locator('[class*="overflow-x-auto"]');
    await expect(tableContainer).toBeVisible();

    // Scroll right
    await tableContainer.evaluate(el => el.scrollLeft = 200);

    // Verify scrolled
    const scrollPosition = await tableContainer.evaluate(el => el.scrollLeft);
    expect(scrollPosition).toBeGreaterThan(0);

});

test('should display sync button as full-width on mobile', async ({ page }) => {
await page.goto('/dashboard');

    const syncButton = page.getByRole('button', { name: /sync now/i });
    const width = await syncButton.evaluate(el => el.offsetWidth);
    const parentWidth = await syncButton.evaluate(el => el.parentElement?.offsetWidth || 0);

    // Button should be close to full-width (allowing for padding)
    expect(width).toBeGreaterThan(parentWidth * 0.9);

});

test('should display cards instead of table on mobile', async ({ page }) => {
await page.goto('/dashboard/users');

    // On mobile, users should display as cards not table
    const isMobile = await page.evaluate(() => window.innerWidth < 768);

    if (isMobile) {
      await expect(page.locator('[data-testid="user-card"]').first()).toBeVisible();
    }

});
});

// tests/e2e/cross-browser.spec.ts

test.describe('Cross-Browser Compatibility', () => {
test('should work in all browsers', async ({ page, browserName }) => {
console.log(`Testing in: ${browserName}`);

    await page.goto('/dashboard');

    // Basic functionality should work in all browsers
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();

    // Sync button works
    const syncButton = page.getByRole('button', { name: /sync now/i });
    await expect(syncButton).toBeVisible();
    await expect(syncButton).toBeEnabled();

    // Table renders
    await page.goto('/dashboard/users');
    await expect(page.locator('table')).toBeVisible();

});

test('should handle CSS Grid in all browsers', async ({ page }) => {
await page.goto('/dashboard');

    // Verify grid layout applied
    const gridContainer = page.locator('[class*="grid"]').first();
    const display = await gridContainer.evaluate(el =>
      window.getComputedStyle(el).display
    );

    expect(display).toBe('grid');

});
});

---

3. Junior Developer Testing Instructions
   📖 TESTING GUIDE FOR JUNIOR DEVELOPERS
   Initial Setup (First Time Only)

# 1. Install test dependencies

pnpm install

# 2. Install Playwright browsers

pnpm exec playwright install

# 3. Install system dependencies for Playwright (Linux only)

pnpm exec playwright install-deps

# 4. Setup test environment

cp .env.example .env.test

# Fill in TEST\_\* variables in .env.test

Daily Development Testing Workflow

# ============================================

# UNIT TESTS (Run frequently during development)

# ============================================

# Run all unit tests

pnpm test

# Run tests in watch mode (auto-rerun on file changes)

pnpm test --watch

# Run specific test file

pnpm test sync.test.ts

# Run tests with coverage report

pnpm test --coverage

# Run tests matching pattern

pnpm test --grep "should create new users"

# ============================================

# E2E TESTS (Run before commits)

# ============================================

# Start dev server first (Terminal 1)

pnpm dev

# Run all E2E tests in headless mode (Terminal 2)

pnpm exec playwright test

# Run with UI mode (visual debugging - RECOMMENDED for development)

pnpm exec playwright test --ui

# Run in headed mode (see browser)

pnpm exec playwright test --headed

# Run specific test file

pnpm exec playwright test sync-flow.spec.ts

# Run specific browser only

pnpm exec playwright test --project=chromium

# Debug specific test

pnpm exec playwright test --debug dashboard.spec.ts

Testing by Browser

# ============================================

# DESKTOP BROWSERS

# ============================================

# Chrome

pnpm exec playwright test --project=chromium

# Firefox

pnpm exec playwright test --project=firefox

# Safari (WebKit)

pnpm exec playwright test --project=webkit

# Edge

pnpm exec playwright test --project=edge

# ============================================

# MOBILE DEVICES

# ============================================

# iPhone 13

pnpm exec playwright test --project=iphone-13

# iPhone 13 Pro

pnpm exec playwright test --project=iphone-13-pro

# iPad Pro

pnpm exec playwright test --project=ipad-pro

# Android (Pixel 5)

pnpm exec playwright test --project=pixel-5

# iPad Landscape

pnpm exec playwright test --project=ipad-landscape

# ============================================

# RUN MULTIPLE PROJECTS

# ============================================

# All desktop browsers

pnpm exec playwright test --project=chromium --project=firefox --project=webkit

# All mobile devices

pnpm exec playwright test --project=iphone-13 --project=ipad-pro --project=pixel-5

# Everything (WARNING: Takes 20+ minutes)

pnpm exec playwright test

Before Creating a Pull Request

# 1. Run linter

pnpm lint

# 2. Fix lint errors

pnpm lint --fix

# 3. Format code

pnpm format

# 4. Type check

pnpm typecheck

# 5. Run all unit tests

pnpm test

# 6. Build the project

pnpm build

# 7. Run E2E in at least Chrome, Firefox, Safari

pnpm exec playwright test --project=chromium --project=firefox --project=webkit

# 8. Run mobile tests if you changed UI

pnpm exec playwright test --project=iphone-13 --project=ipad-pro

# 9. Generate test report

pnpm exec playwright show-report

Debugging Failed Tests

# ============================================

# UNIT TEST DEBUGGING

# ============================================

# Run single test file with verbose output

pnpm test sync.test.ts --reporter=verbose

# Run with Node debugger

node --inspect-brk node_modules/.bin/vitest run sync.test.ts

# Use console.log() - Vitest will show output

# ============================================

# E2E TEST DEBUGGING

# ============================================

# Best option: Use UI mode

pnpm exec playwright test --ui

# Run in headed mode (see browser)

pnpm exec playwright test --headed --project=chromium

# Debug mode (pauses before each action)

pnpm exec playwright test --debug

# Take screenshots on failure (automatic)

# Check: test-results/ folder

# Record video on failure (automatic)

# Check: test-results/ folder

# Generate trace for failed tests

pnpm exec playwright test --trace on
pnpm exec playwright show-trace trace.zip

# Run specific test only

pnpm exec playwright test -g "should trigger sync"

Testing Against Different Environments

# ============================================

# LOCAL DEVELOPMENT

# ============================================

export PLAYWRIGHT_BASE_URL=http://localhost:3000
pnpm exec playwright test

# ============================================

# STAGING ENVIRONMENT

# ============================================

export PLAYWRIGHT_BASE_URL=https://staging.yourapp.com
pnpm exec playwright test

# ============================================

# PRODUCTION (Read-only tests only!)

# ============================================

export PLAYWRIGHT_BASE_URL=https://yourapp.com
pnpm exec playwright test tests/e2e/read-only/

# ============================================

# CI/CD (GitHub Actions)

# ============================================

# Tests run automatically on push/PR

# View results at: https://github.com/your-org/your-repo/actions

Common Testing Scenarios

# Scenario 1: You changed the sync engine

pnpm test lib/sync/ # Unit tests
pnpm exec playwright test sync-flow.spec.ts # E2E tests

# Scenario 2: You changed the UI

pnpm exec playwright test --project=chromium --project=iphone-13

# Scenario 3: You added a new feature

# 1. Write unit tests first

pnpm test --watch new-feature.test.ts

# 2. Write E2E test

pnpm exec playwright test --ui new-feature.spec.ts

# Scenario 4: Tests are flaky

# Run same test 10 times to reproduce

pnpm exec playwright test --repeat-each=10 flaky.spec.ts

# Scenario 5: Need to update snapshots

pnpm exec playwright test --update-snapshots

Continuous Testing During Development

# Terminal 1: Dev server

pnpm dev

# Terminal 2: Unit tests in watch mode

pnpm test --watch

# Terminal 3: Playwright UI mode

pnpm exec playwright test --ui

# Now you can:

# - Make code changes

# - Unit tests auto-rerun

# - Click "Rerun" in Playwright UI for E2E tests

Performance Testing

# Run tests with performance metrics

pnpm exec playwright test --reporter=html

# Check test duration in report

pnpm exec playwright show-report

# Profile slow tests

pnpm exec playwright test --trace on sync-flow.spec.ts

# Tests should complete:

# - Unit tests: < 5 minutes total

# - E2E (single browser): < 10 minutes

# - E2E (all browsers/devices): < 30 minutes

Test Coverage

# Generate coverage report

pnpm test --coverage

# View coverage in browser

pnpm test --coverage --reporter=html
open coverage/index.html

# Coverage targets:

# - Overall: 80%+

# - Critical paths (sync engine): 95%+

# - UI components: 70%+

Troubleshooting

# Problem: Playwright browsers not installed

# Solution:

pnpm exec playwright install

# Problem: Tests fail with "localhost:3000 not responding"

# Solution: Make sure dev server is running

pnpm dev

# Problem: Tests pass locally but fail in CI

# Solution: Check environment variables

echo $PLAYWRIGHT_BASE_URL

# Make sure .env.test is configured

# Problem: "Element not found" errors

# Solution: Increase timeout or use waitFor

await page.waitForSelector('button:has-text("Sync Now")', { timeout: 10000 });

# Problem: Tests are slow

# Solution: Run in parallel

pnpm exec playwright test --workers=4

# Problem: Need to see what test is doing

# Solution: Use headed mode + slow motion

pnpm exec playwright test --headed --slow-mo=1000

---

🚀 IMPLEMENTATION CHECKLIST
Phase 1: Project Setup ✅

# Day 1-2

- [ ] Initialize Next.js project with TypeScript
- [ ] Setup Tailwind CSS + configure
- [ ] Install shadcn/ui CLI and init
- [ ] Setup ESLint + Prettier
- [ ] Configure TypeScript strict mode
- [ ] Setup Prisma + Turso connection
- [ ] Create .env.example with all TODO blocks
- [ ] Setup Git repo + .gitignore
- [ ] Create basic folder structure
- [ ] Install all dependencies (googleapis, zustand, tanstack, etc.)

Phase 2: Database & Models ✅

# Day 3-4

- [ ] Create Prisma schema (User, SyncLog, AuditLog models)
- [ ] Add indexes to schema
- [ ] Create migration
- [ ] Test Turso connection
- [ ] Create Prisma client singleton
- [ ] Create seed script with test data
- [ ] Run migrations
- [ ] Verify data in Turso dashboard

Phase 3: Google Drive Integration ✅

# Day 5-7

- [ ] Create OAuth2 client factory (lib/google/client.ts)
- [ ] Implement listFolderPermissions (lib/google/permissions.ts)
- [ ] Add token refresh logic
- [ ] Add rate limit handling
- [ ] Add error handling for Google API
- [ ] Write unit tests for Google helpers
- [ ] Test with real Google Drive folder
- [ ] Document OAuth setup process

Phase 4: Sync Engine ✅

# Day 8-12

- [ ] Implement fetchDrivePermissions
- [ ] Implement mapDrivePermissionToUser
- [ ] Implement reconciliation logic (create/update/revoke)
- [ ] Implement persistChanges with transactions
- [ ] Add sync locking mechanism
- [ ] Handle all edge cases (suspended accounts, aliases, etc.)
- [ ] Add OpenTelemetry spans
- [ ] Write comprehensive unit tests (80%+ coverage)
- [ ] Test with large permission sets (1000+ users)
- [ ] Optimize for performance

Phase 5: API Routes ✅

# Day 13-15

- [ ] Create POST /api/sync route
- [ ] Create GET /api/users route (with pagination)
- [ ] Create GET /api/users/[id] route
- [ ] Create GET /api/sync/status route
- [ ] Add Zod validation for all inputs
- [ ] Add auth middleware
- [ ] Add rate limiting
- [ ] Add CORS if needed
- [ ] Write API integration tests
- [ ] Document API endpoints

Phase 6: Frontend - Core UI ✅

# Day 16-20

- [ ] Setup shadcn/ui components (button, table, dialog, toast, etc.)
- [ ] Create layout with sidebar/header
- [ ] Create dashboard page
- [ ] Create users table page with TanStack Table
- [ ] Implement sorting, filtering, pagination
- [ ] Create user detail modal/page
- [ ] Create sync button component
- [ ] Create sync status component
- [ ] Add loading skeletons
- [ ] Add error boundaries

Phase 7: State Management ✅

# Day 21-23

- [ ] Create Zustand stores (user, ui, sync)
- [ ] Setup TanStack Query provider
- [ ] Create custom hooks (useUsers, useSync, useToast)
- [ ] Implement optimistic updates
- [ ] Add query invalidation logic
- [ ] Test state persistence
- [ ] Test concurrent updates

Phase 8: Testing - Unit ✅

# Day 24-27

- [ ] Setup Vitest configuration
- [ ] Write tests for all lib/sync/\* functions
- [ ] Write tests for all lib/google/\* functions
- [ ] Write tests for Zod schemas
- [ ] Write tests for Zustand stores
- [ ] Write component tests
- [ ] Achieve 80%+ coverage
- [ ] Fix all failing tests

Phase 9: Testing - E2E ✅

# Day 28-32

- [ ] Setup Playwright configuration
- [ ] Configure all browser projects
- [ ] Write auth flow tests
- [ ] Write dashboard tests
- [ ] Write users table tests
- [ ] Write sync flow tests
- [ ] Write mobile responsive tests
- [ ] Run cross-browser tests
- [ ] Fix flaky tests
- [ ] Generate test reports

Phase 10: Observability ✅

# Day 33-35

- [ ] Setup OpenTelemetry SDK
- [ ] Add tracer to sync engine
- [ ] Add spans to critical operations
- [ ] Add error tracking
- [ ] Setup logging
- [ ] Configure OTLP exporter
- [ ] Test telemetry in staging
- [ ] Create dashboards in observability tool

Phase 11: Documentation ✅

# Day 36-38

- [ ] Write comprehensive README
- [ ] Document .env variables
- [ ] Document API endpoints
- [ ] Document sync algorithm
- [ ] Document testing procedures
- [ ] Create architecture diagram
- [ ] Document deployment process
- [ ] Create troubleshooting guide
- [ ] Add inline code comments
- [ ] Create junior dev onboarding doc

Phase 12: CI/CD ✅

# Day 39-41

- [ ] Create GitHub Actions workflow
- [ ] Add lint job
- [ ] Add typecheck job
- [ ] Add unit test job
- [ ] Add build job
- [ ] Add E2E test job (Chromium only for speed)
- [ ] Add deployment job
- [ ] Configure secrets in GitHub
- [ ] Test CI pipeline
- [ ] Setup branch protection rules

Phase 13: Security & Polish ✅

# Day 42-44

- [ ] Audit all environment variables
- [ ] Ensure no secrets in code
- [ ] Add input sanitization
- [ ] Add CSRF protection
- [ ] Add rate limiting to API routes
- [ ] Review Prisma queries for SQL injection
- [ ] Add security headers
- [ ] Test with OWASP ZAP or similar
- [ ] Review CORS configuration
- [ ] Audit third-party dependencies

Phase 14: Performance Optimization ✅

# Day 45-47

- [ ] Optimize database queries (add indexes)
- [ ] Implement query result caching
- [ ] Add pagination everywhere
- [ ] Optimize bundle size
- [ ] Add lazy loading for routes
- [ ] Optimize images
- [ ] Test with Lighthouse
- [ ] Optimize sync algorithm for large datasets
- [ ] Add database connection pooling
- [ ] Profile and fix slow queries

Phase 15: Deployment ✅

# Day 48-50

- [ ] Choose hosting platform (Vercel, Railway, etc.)
- [ ] Configure production environment variables
- [ ] Setup production Turso database
- [ ] Configure production OAuth credentials
- [ ] Deploy to staging
- [ ] Run full test suite against staging
- [ ] Setup custom domain
- [ ] Configure SSL
- [ ] Deploy to production
- [ ] Monitor production for 24 hours

---

🎯 CODE QUALITY RULES (MANDATORY)
TypeScript Rules
// ✅ GOOD
async function fetchUser(id: string): Promise<User | null> {
const user = await prisma.user.findUnique({ where: { id } });
return user;
}

// ❌ BAD - No explicit return type
async function fetchUser(id: string) {
const user = await prisma.user.findUnique({ where: { id } });
return user;
}

// ❌ BAD - Implicit any
function processData(data) {
return data.map(item => item.value);
}

// ✅ GOOD - Explicit types
function processData(data: Array<{ value: number }>): number[] {
return data.map(item => item.value);
}

Function Size Rules
// ✅ GOOD - Function < 50 lines
async function syncUsers(folderId: string): Promise<SyncResult> {
const permissions = await fetchPermissions(folderId);
const normalized = normalizePermissions(permissions);
const actions = determineActions(normalized);
const result = await executeActions(actions);
return result;
}

// ❌ BAD - Monolithic 200+ line function
async function syncUsers(folderId: string) {
// ... 200 lines of mixed concerns
}

Error Handling Rules
// ✅ GOOD - Explicit error handling
try {
const result = await dangerousOperation();
return { success: true, data: result };
} catch (error) {
logger.error('Operation failed', { error });
span.recordException(error as Error);
return { success: false, error: (error as Error).message };
}

// ❌ BAD - Silent failure
try {
const result = await dangerousOperation();
return result;
} catch {
return null; // Lost error context!
}

TODO Block Rules
// ✅ GOOD - Clear TODO with context
const clientId = process.env.GOOGLE_CLIENT_ID;
/\* TODO: Junior Developer — Get from Google Cloud Console:

1.  Go to https://console.cloud.google.com/apis/credentials
2.  Create OAuth 2.0 Client ID
3.  Add to .env as GOOGLE_CLIENT_ID
    \*/

// ❌ BAD - Vague TODO
const clientId = process.env.GOOGLE_CLIENT_ID;
// TODO: add this

// ❌ NEVER - Hardcoded credentials
const clientId = "123456789-abc.apps.googleusercontent.com"; // NEVER DO THIS!

Import Organization
// ✅ GOOD - Organized imports
// External libraries
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Internal libraries
import { prisma } from '@/lib/prisma/client';
import { fetchDrivePermissions } from '@/lib/google/permissions';

// Types
import type { User, SyncResult } from '@/types';

// ❌ BAD - Messy imports
import type { User } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { fetchDrivePermissions } from '@/lib/google/permissions';
import { prisma } from '@/lib/prisma/client';
import { useState } from 'react';

---

📝 GIT WORKFLOW (MANDATORY)
Branch Naming Convention

# ✅ GOOD

feature/google-drive-sync
fix/user-table-pagination
test/add-e2e-mobile-tests
docs/update-readme-setup
refactor/split-sync-engine

# ❌ BAD

my-changes
fix-bug
update
john-working-branch

Commit Message Convention

# ✅ GOOD - Conventional Commits

feat: add Google Drive permission sync
fix: handle suspended account edge case
test: add unit tests for sync reconciliation
docs: update testing instructions
refactor: extract user creation logic
perf: optimize database queries with indexes
chore: update dependencies

# ❌ BAD

updated files
fix
changes
wip
asdfasdf

Pull Request Template

## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing Checklist

- [ ] Unit tests passing (`pnpm test`)
- [ ] E2E tests passing (`pnpm exec playwright test --project=chromium`)
- [ ] Linter passing (`pnpm lint`)
- [ ] Type check passing (`pnpm typecheck`)
- [ ] Build successful (`pnpm build`)
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tested on mobile (if UI changes)

## Screenshots (if applicable)

Add screenshots for UI changes

## Additional Notes

Any edge cases, concerns, or follow-up tasks

Git Commands (Safe Practices)

# ✅ GOOD - Stage specific files

git add lib/sync/reconcile.ts
git add tests/unit/sync.test.ts
git commit -m "feat: implement sync reconciliation logic"

# ❌ BAD - Stage everything blindly

git add .
git commit -m "changes"

# ✅ GOOD - Review changes before committing

git diff
git status
git add <specific-files>
git commit

# ✅ GOOD - Interactive staging

git add -p # Review each change

Protecting Main Branch

# These commands should NEVER work (main is protected)

git checkout main
git commit -m "direct commit" # ❌ Should fail

# ✅ GOOD - Always work on feature branches

git checkout -b feature/my-feature
git commit -m "feat: add feature"
git push origin feature/my-feature

# Then create PR on GitHub

---

🔧 COMMON DEVELOPMENT TASKS
Task 1: Adding a New API Endpoint

# 1. Create route file

touch app/api/my-endpoint/route.ts

# 2. Implement handler with Zod validation

# 3. Add OpenTelemetry spans

# 4. Write unit tests

touch tests/unit/api/my-endpoint.test.ts

# 5. Test manually

curl -X POST http://localhost:3000/api/my-endpoint \
 -H "Content-Type: application/json" \
 -d '{"test": "data"}'

# 6. Write E2E test

touch tests/e2e/my-endpoint.spec.ts

# 7. Run tests

pnpm test
pnpm exec playwright test my-endpoint.spec.ts

Task 2: Adding a New Component

# 1. Create component

touch components/my-component.tsx

# 2. Add to storybook (if using)

touch components/my-component.stories.tsx

# 3. Write component tests

touch tests/unit/components/my-component.test.tsx

# 4. Import and use

# In your page/component:

import { MyComponent } from '@/components/my-component';

# 5. Test in browser

pnpm dev

# Navigate to page using component

# 6. Test responsive design

pnpm exec playwright test --project=iphone-13

Task 3: Modifying the Sync Engine

# 1. Update sync logic

vim lib/sync/reconcile.ts

# 2. Update/add unit tests

vim tests/unit/lib/sync/reconcile.test.ts

# 3. Run tests in watch mode

pnpm test --watch reconcile.test.ts

# 4. Test with real Google Drive folder

# Make sure .env has valid credentials

pnpm dev

# Trigger sync via UI

# 5. Check logs and telemetry

# View in your observability dashboard

# 6. Run E2E test

pnpm exec playwright test sync-flow.spec.ts

# 7. Commit changes

git add lib/sync/reconcile.ts tests/unit/lib/sync/reconcile.test.ts
git commit -m "feat: improve sync edge case handling"

Task 4: Debugging a Failing Test

# Scenario: E2E test failing in CI but passing locally

# 1. Check CI logs

# Go to GitHub Actions → View failed job

# 2. Run same test locally

pnpm exec playwright test sync-flow.spec.ts --project=chromium

# 3. If still passing, check environment differences

echo $PLAYWRIGHT_BASE_URL
cat .env.test

# 4. Run with same config as CI

export CI=true
pnpm exec playwright test

# 5. Use debug mode

pnpm exec playwright test --debug sync-flow.spec.ts

# 6. Check for timing issues

# Add explicit waits

await page.waitForSelector('button:has-text("Sync Now")');

# 7. Check screenshots/videos from CI

# Download artifacts from GitHub Actions

# 8. Run multiple times to catch flakiness

pnpm exec playwright test --repeat-each=10 sync-flow.spec.ts

Task 5: Updating Dependencies

# 1. Check outdated packages

pnpm outdated

# 2. Update non-breaking changes

pnpm update

# 3. Update breaking changes one at a time

pnpm update next@latest

# 4. Run tests after each update

pnpm test
pnpm exec playwright test --project=chromium

# 5. Check build

pnpm build

# 6. Test locally

pnpm dev

# 7. Commit with changelog

git commit -m "chore: update next to v15.0.0

- Breaking change: App Router syntax updated
- Updated all affected route files
- All tests passing"

---

🚨 TROUBLESHOOTING GUIDE
Problem: "Cannot find module '@/lib/...'"

# Solution: Check TypeScript paths

cat tsconfig.json | grep paths

# Should have:

{
"compilerOptions": {
"paths": {
"@/_": ["./_"]
}
}
}

# Restart TypeScript server

# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

Problem: "Prisma Client not generated"

# Solution:

pnpm prisma generate

# After any schema.prisma changes:

pnpm prisma db push
pnpm prisma generate

Problem: "Google API 401 Unauthorized"

# Solution: Check OAuth token

echo $GOOGLE_REFRESH_TOKEN

# Regenerate token:

pnpm run setup:google-auth

# Update .env with new token

Problem: "Turso database connection failed"

# Solution: Verify credentials

echo $TURSO_DATABASE_URL
echo $TURSO_AUTH_TOKEN

# Test connection:

pnpm prisma db pull

# Check Turso dashboard:

open https://turso.tech

Problem: "Tests timing out"

# Solution: Increase timeout

# In test file:

test('my test', async ({ page }) => {
test.setTimeout(60000); // 60 seconds
// ...
});

# Or globally in playwright.config.ts:

export default defineConfig({
timeout: 60000
});

Problem: "Module not found in Playwright"

# Solution: Playwright uses separate Node process

# Make sure path aliases work:

# playwright.config.ts

import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
use: {
baseURL: 'http://localhost:3000',
},
webServer: {
command: 'pnpm dev',
url: 'http://localhost:3000',
}
});

Problem: "State not persisting in Zustand"

# Solution: Check store initialization

# stores/user-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
persist(
(set) => ({
users: [],
setUsers: (users) => set({ users })
}),
{
name: 'user-storage', // localStorage key
}
)
);

Problem: "CORS error in API route"

# Solution: Add CORS headers

// app/api/sync/route.ts

export async function POST(request: Request) {
// Add CORS headers
const headers = {
'Access-Control-Allow-Origin': '\*',
'Access-Control-Allow-Methods': 'POST',
'Access-Control-Allow-Headers': 'Content-Type',
};

// ... your logic

return NextResponse.json(result, { headers });
}

---

📚 RESOURCES & DOCUMENTATION LINKS
Official Documentation
● Next.js App Router: https://nextjs.org/docs/app
● Prisma: https://www.prisma.io/docs
● TanStack Query: https://tanstack.com/query/latest
● TanStack Table: https://tanstack.com/table/latest
● Playwright: https://playwright.dev/docs/intro
● Vitest: https://vitest.dev/guide/
● shadcn/ui: https://ui.shadcn.com/docs
● Google Drive API: https://developers.google.com/drive/api/guides/about-sdk
● OpenTelemetry: https://opentelemetry.io/docs/
Tutorials & Guides
● OAuth 2.0 Setup: https://developers.google.com/identity/protocols/oauth2
● Turso Getting Started: https://docs.turso.tech/
● Testing Best Practices: https://playwright.dev/docs/best-practices
● TypeScript Strict Mode: https://www.typescriptlang.org/tsconfig#strict

---

🎓 JUNIOR DEVELOPER LEARNING PATH
Week 1: Environment Setup

# Day 1-2: Install tools

- Install Node.js 20+
- Install pnpm
- Install VS Code + extensions
- Setup Git

# Day 3-4: Understand the stack

- Read Next.js App Router docs
- Read Prisma quickstart
- Read TanStack Query basics
- Play with shadcn/ui examples

# Day 5: Run the project

- Clone repo
- Setup .env
- Run migrations
- Start dev server
- Explore UI

Week 2: Make First Contribution

# Day 1-2: Pick a small task

- Find "good first issue" in GitHub
- Read related code
- Ask questions in team chat

# Day 3-4: Implement

- Create feature branch
- Write code
- Write tests
- Test locally

# Day 5: Submit PR

- Push branch
- Create pull request
- Address review comments
- Merge!

Week 3: Deep Dive

# Focus areas:

- Understand sync engine algorithm
- Learn Prisma queries
- Master TanStack Table
- Write comprehensive tests
- Debug with Chrome DevTools

---

✅ DEFINITION OF DONE (PR Acceptance Criteria)
Before marking any task as "done", verify:
● [ ] Code Quality

○ [ ] TypeScript strict mode (no any)
○ [ ] All functions < 50 lines
○ [ ] No unused imports
○ [ ] Descriptive variable names
○ [ ] All TODOs are for credentials only
● [ ] Testing

○ [ ] Unit tests written and passing
○ [ ] E2E test written (if UI/API change)
○ [ ] Coverage ≥ 80% for new code
○ [ ] Tested in Chrome, Firefox, Safari
○ [ ] Tested on mobile (if UI change)
● [ ] Documentation

○ [ ] Code comments for complex logic
○ [ ] README updated (if needed)
○ [ ] API docs updated (if new endpoint)
○ [ ] TODO blocks have clear instructions
● [ ] Security

○ [ ] No secrets in code
○ [ ] Input validation with Zod
○ [ ] SQL injection prevention (Prisma)
○ [ ] XSS prevention
○ [ ] CSRF tokens (if needed)
● [ ] Performance

○ [ ] Database queries optimized
○ [ ] No N+1 queries
○ [ ] Pagination implemented
○ [ ] Images optimized
○ [ ] Bundle size reasonable
● [ ] Git

○ [ ] Conventional commit messages
○ [ ] Feature branch (not main)
○ [ ] Specific files staged (not git add .)
○ [ ] PR template filled out
○ [ ] Linked to issue/task
● [ ] CI/CD

○ [ ] All CI checks passing
○ [ ] Lint passing
○ [ ] Type check passing
○ [ ] Build successful
○ [ ] Tests passing

---

🎯 CLAUDE CODE RESPONSE FORMAT
When Claude Code generates any code, it MUST follow this format:

1. Senior Engineering Summary
   One paragraph explaining what the code does, why it's designed this way, and what trade-offs were made.
2. Junior Developer TODO List

- [ ] Task 1: Specific instruction
- [ ] Task 2: Another specific instruction
- [ ] Task 3: etc.

3. Step-by-Step Implementation

# Step 1: Description

command or file creation

# Step 2: Description

another command

# ... etc

4. Complete Code Examples
   // Full working code
   // Each function < 50 lines
   // All TODO blocks present
   // Fully typed

5. Test Plan
   // Unit test examples
   // E2E test examples
   // How to run tests

6. Testing Instructions

# How to test this feature

# What to look for

# Common issues

7. Edge Cases & Notes

- Edge case 1: How it's handled
- Edge case 2: How it's handled
- Known limitation: Description
- Future improvement: Idea

---

🏁 GETTING STARTED PROMPT FOR CLAUDE CODE
Copy this to start working with Claude Code:
I have a project that follows the specifications in claude.md.

Context:

- Next.js App Router + TypeScript strict
- Prisma + Turso database
- Google Drive sync system
- Full test coverage required (Vitest + Playwright)
- All credentials must be TODO blocks

I need you to: [DESCRIBE YOUR TASK]

Please provide:

1. Senior engineering summary
2. Junior developer TODO checklist
3. Step-by-step implementation
4. Complete code (all functions < 50 lines)
5. Unit + E2E tests
6. Testing instructions for all browsers
7. Edge cases handled

Remember:

- NO real credentials (use TODO blocks)
- TypeScript strict (no any)
- All functions < 50 lines
- Comprehensive tests
- Mobile-responsive
- Cross-browser compatible

---

📞 SUPPORT & ESCALATION
When to Ask for Help
Ask immediately if:
● Tests failing for unknown reason after 30 minutes
● Cannot authenticate with Google API
● Database connection issues
● Deployment failures
● Security concerns
● Breaking changes in dependencies
Try debugging first for:
● Syntax errors
● Import issues
● Styling problems
● Simple logic bugs
How to Ask for Help
Good question format:

## Problem

Clear description of the issue

## What I've Tried

1. Attempted solution 1
2. Attempted solution 2
3. Checked documentation X

## Environment

- OS: macOS 14.0
- Node: 20.10.0
- pnpm: 8.15.0
- Browser: Chrome 120

## Error Message

Full error message with stack trace

## Code Context

````typescript
// Relevant code snippet

Expected vs Actual
Expected: X should happen Actual: Y happens instead

---

## 🎉 SUCCESS METRICS

### Project Launch Criteria

- [ ] **Functionality**
  - [ ] Sync creates new users from Drive
  - [ ] Sync updates existing users
  - [ ] Sync revokes removed users
  - [ ] Manual sync works
  - [ ] Dashboard displays all users
  - [ ] Table sorting/filtering works

- [ ] **Quality**
  - [ ] 80%+ test coverage
  - [ ] All E2E tests pass in 4 browsers
  - [ ] Mobile responsive (tested)
  - [ ] No TypeScript errors
  - [ ] No ESLint errors
  - [ ] Lighthouse score > 90

- [ ] **Performance**
  - [ ] Sync completes < 30 sec for 1000 users
  - [ ] Page load < 2 seconds
  - [ ] API response < 500ms (p95)
  - [ ] Database queries optimized

- [ ] **Security**
  - [ ] No secrets in repo
  - [ ] All inputs validated
  - [ ] Auth implemented
  - [ ] HTTPS enabled
  - [ ] Security headers set

- [ ] **Documentation**
  - [ ] README complete
  - [ ] API docs complete
  - [ ] Setup guide tested
  - [ ] Troubleshooting guide written
  - [ ] Architecture diagram created

- [ ] **Operations**
  - [ ] Deployed to production
  - [ ] Monitoring setup
  - [ ] Alerts configured
  - [ ] Backup strategy defined
  - [ ] Rollback procedure tested

---

## 🚀 YOU'RE READY!

This document contains everything needed to build a production-ready Google Drive sync system.

**Next steps:**

1. **Setup your environment** (Week 1)
2. **Implement Phase 1** (Project setup)
3. **Test your work** (Unit + E2E)
4. **Submit your first PR**
5. **Iterate and improve**

**Remember:**
- Always use TODO blocks for credentials
- Test in multiple browsers
- Write tests first (TDD)
- Ask for help when stuck
- Review the checklist before PRs
- Keep functions small (< 50 lines)
- Document as you go

**Start coding:**

```bash
# Clone repo
git clone <repo-url>
cd <project>

# Setup
cp .env.example .env
# Fill in TODO values
pnpm install
pnpm prisma generate
pnpm prisma db push

# Start development
pnpm dev

# Run tests
pnpm test --watch
pnpm exec playwright test --ui

Good luck! 🎉

````
