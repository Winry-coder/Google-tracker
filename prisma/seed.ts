/* eslint-disable no-console */
import { prisma } from '../lib/prisma/client';

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');

  // Create test users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: {
        email: 'alice@example.com',
        name: 'Alice Johnson',
        hasAccess: true,
        role: 'editor',
        source: 'drive',
        status: 'active',
        googleId: 'google-alice-123',
        googleEmail: 'alice@example.com',
        drivePermissionId: 'perm-alice-123',
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        email: 'bob@example.com',
        name: 'Bob Smith',
        hasAccess: true,
        role: 'viewer',
        source: 'drive',
        status: 'active',
        googleId: 'google-bob-456',
        googleEmail: 'bob@example.com',
        drivePermissionId: 'perm-bob-456',
      },
    }),
    prisma.user.upsert({
      where: { email: 'charlie@example.com' },
      update: {},
      create: {
        email: 'charlie@example.com',
        name: 'Charlie Davis',
        hasAccess: false,
        role: 'viewer',
        source: 'drive',
        status: 'active',
        googleId: 'google-charlie-789',
        googleEmail: 'charlie@example.com',
        revokedAt: new Date('2024-01-01'),
      },
    }),
    prisma.user.upsert({
      where: { email: 'manual@example.com' },
      update: {},
      create: {
        email: 'manual@example.com',
        name: 'Manual User',
        hasAccess: true,
        role: 'admin',
        source: 'manual',
        status: 'active',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create test sync logs
  const syncLogs = await Promise.all([
    prisma.syncLog.create({
      data: {
        syncType: 'manual',
        status: 'success',
        usersCreated: 3,
        usersUpdated: 1,
        usersRevoked: 0,
        driveUserCount: 4,
        appUserCount: 4,
        duration: 1500,
        completedAt: new Date(),
      },
    }),
    prisma.syncLog.create({
      data: {
        syncType: 'scheduled',
        status: 'success',
        usersCreated: 0,
        usersUpdated: 2,
        usersRevoked: 1,
        driveUserCount: 3,
        appUserCount: 4,
        duration: 2000,
        completedAt: new Date(Date.now() - 3600000),
      },
    }),
  ]);

  console.log(`✅ Created ${syncLogs.length} sync logs`);

  // Create test audit logs
  const auditLogs = await Promise.all([
    prisma.auditLog.create({
      data: {
        eventType: 'user.created',
        eventSource: 'drive_sync',
        newValue: JSON.stringify(users[0]),
        performedBy: 'system',
        userId: users[0].id,
      },
    }),
    prisma.auditLog.create({
      data: {
        eventType: 'access.granted',
        eventSource: 'drive_sync',
        newValue: JSON.stringify({ hasAccess: true }),
        performedBy: 'system',
        userId: users[1].id,
      },
    }),
  ]);

  console.log(`✅ Created ${auditLogs.length} audit logs`);

  // Create test campaigns
  const campaigns = await Promise.all([
    prisma.campaign.upsert({
      where: { slug: 'video-course' },
      update: {},
      create: {
        name: 'Video Course 2024',
        slug: 'video-course',
        description: 'The ultimate guide to video production',
        folderId: '1234567890abcdef',
        isActive: true,
        ownerId: users[3].id, // manual@example.com (Admin)
        variants: {
          create: [
            {
              name: 'Variant A',
              title: 'Get Access Now',
              description: 'Join 500+ happy students',
              buttonText: 'Start Learning',
              isActive: true,
            },
            {
              name: 'Variant B',
              title: 'Limited Time Offer',
              description: 'Access closes in 24 hours',
              buttonText: 'Claim Access',
              isActive: true,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${campaigns.length} campaigns`);

  // Create sync config
  await prisma.syncConfig.upsert({
    where: { key: 'last_sync_timestamp' },
    update: { value: new Date().toISOString() },
    create: {
      key: 'last_sync_timestamp',
      value: new Date().toISOString(),
      description: 'Timestamp of last successful sync',
    },
  });

  console.log('✅ Created sync config');
  console.log('🎉 Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
