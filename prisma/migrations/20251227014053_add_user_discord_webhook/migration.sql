-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT,
    "image" TEXT,
    "hasAccess" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "googleId" TEXT,
    "googleEmail" TEXT,
    "drivePermissionId" TEXT,
    "discordWebhookUrl" TEXT,
    "discordNotificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "campaignId" TEXT,
    "variantId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "status" TEXT NOT NULL DEFAULT 'active',
    "company" TEXT,
    "jobTitle" TEXT,
    "linkedinUrl" TEXT,
    "enrichedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastSyncedAt" DATETIME,
    "revokedAt" DATETIME,
    CONSTRAINT "users_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "users_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "variants" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("campaignId", "company", "createdAt", "drivePermissionId", "email", "enrichedAt", "googleEmail", "googleId", "hasAccess", "id", "image", "jobTitle", "lastSyncedAt", "linkedinUrl", "name", "password", "revokedAt", "role", "source", "status", "updatedAt", "variantId") SELECT "campaignId", "company", "createdAt", "drivePermissionId", "email", "enrichedAt", "googleEmail", "googleId", "hasAccess", "id", "image", "jobTitle", "lastSyncedAt", "linkedinUrl", "name", "password", "revokedAt", "role", "source", "status", "updatedAt", "variantId" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_googleId_idx" ON "users"("googleId");
CREATE INDEX "users_status_idx" ON "users"("status");
CREATE INDEX "users_source_idx" ON "users"("source");
CREATE INDEX "users_campaignId_idx" ON "users"("campaignId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
