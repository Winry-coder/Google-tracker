# MANUAL DATABASE SETUP FOR TURSO

Since Prisma CLI has issues with Turso URLs, let's create the tables manually through the Turso web interface.

## Step 1: Access Turso Dashboard
Go to: https://app.turso.tech/
- Select your database: `access-tracker-pulse-winry-coder`

## Step 2: Open SQL Editor
- Click on your database
- Go to the "SQL" tab or "Query" section

## Step 3: Run These SQL Commands (One by One)

```sql
-- Create User table
CREATE TABLE "User" (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    "email" TEXT UNIQUE NOT NULL,
    "emailVerified" DATETIME,
    "name" TEXT,
    "image" TEXT,
    "role" TEXT DEFAULT 'viewer',
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Account table (this fixes your OAuth error!)
CREATE TABLE "Account" (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Session table
CREATE TABLE "Session" (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    "sessionToken" TEXT UNIQUE NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Campaign table
CREATE TABLE "Campaign" (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "folderId" TEXT,
    "userId" TEXT NOT NULL,
    "status" TEXT DEFAULT 'active',
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Variant table
CREATE TABLE "Variant" (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    "name" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "folderId" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create SyncLog table
CREATE TABLE "SyncLog" (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    "campaignId" TEXT,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "recordsProcessed" INTEGER DEFAULT 0,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create AuditLog table
CREATE TABLE "AuditLog" (
    "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for better performance
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE INDEX "Campaign_userId_idx" ON "Campaign"("userId");
CREATE INDEX "Variant_campaignId_idx" ON "Variant"("campaignId");
CREATE INDEX "SyncLog_campaignId_idx" ON "SyncLog"("campaignId");
CREATE INDEX "SyncLog_userId_idx" ON "SyncLog"("userId");
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
```

## Step 4: Verify Tables Created
After running all commands, run this query to verify:
```sql
SELECT name FROM sqlite_master WHERE type='table';
```

You should see:
- User
- Account ✅ (this fixes your OAuth error!)
- Session
- Campaign
- Variant
- SyncLog
- AuditLog

## Step 5: Test Your App
Now try signing in with Google again. The OAuth should work!

## Why This Happened
Prisma CLI has validation issues with Turso's `libsql://` URLs, but the tables work fine once created. This manual approach bypasses the CLI validation.

**Once tables are created, your app will work perfectly!** 🎉