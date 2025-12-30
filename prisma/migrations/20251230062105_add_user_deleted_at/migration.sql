-- AlterTable
ALTER TABLE "accounts" ADD COLUMN "refresh_token_expires_in" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN "deletedAt" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "folderId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isKillSwitchEnabled" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'healthy',
    "lastError" TEXT,
    "watchChannelId" TEXT,
    "watchResourceId" TEXT,
    "watchExpiration" DATETIME,
    "owner_id" TEXT,
    "totalLeads" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "emailSubject" TEXT,
    "emailBody" TEXT,
    "webhookUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "campaigns_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_campaigns" ("createdAt", "deletedAt", "description", "emailBody", "emailSubject", "folderId", "id", "isActive", "name", "owner_id", "slug", "totalLeads", "updatedAt", "viewCount", "webhookUrl") SELECT "createdAt", "deletedAt", "description", "emailBody", "emailSubject", "folderId", "id", "isActive", "name", "owner_id", "slug", "totalLeads", "updatedAt", "viewCount", "webhookUrl" FROM "campaigns";
DROP TABLE "campaigns";
ALTER TABLE "new_campaigns" RENAME TO "campaigns";
CREATE UNIQUE INDEX "campaigns_name_key" ON "campaigns"("name");
CREATE UNIQUE INDEX "campaigns_slug_key" ON "campaigns"("slug");
CREATE INDEX "campaigns_deletedAt_idx" ON "campaigns"("deletedAt");
CREATE INDEX "campaigns_owner_id_idx" ON "campaigns"("owner_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "users_campaignId_status_idx" ON "users"("campaignId", "status");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");
