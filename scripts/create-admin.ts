import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || 'Admin';

  if (!email || !password) {
    console.error(
      'Usage: tsx scripts/create-admin.ts <email> <password> [name]'
    );
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      },
      create: {
        email,
        password: hashedPassword,
        name,
        role: 'admin',
        status: 'active',
        source: 'manual',
      },
    });

    console.log(`✅ Admin user ${user.email} created/updated successfully.`);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
