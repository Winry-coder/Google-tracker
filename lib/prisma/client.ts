import 'dotenv/config';
import { PrismaClient } from '@prisma/client'; // Import the newly generated PrismaClient singleton
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

/**
 * Prisma Client Singleton
 * Prevents multiple instances in development with hot-reloading
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.TURSO_DATABASE_URL ?? 'file:./dev.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

// Check if we're using a remote Turso database or local file
const isRemoteDatabase = connectionString.startsWith('libsql://');

let prismaClient: PrismaClient;

if (isRemoteDatabase && authToken) {
  // Use Turso adapter for remote database
  const turso = createClient({
    url: connectionString,
    authToken: authToken,
  });

  const adapter = new PrismaLibSQL(turso);

  prismaClient = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
} else {
  // Use standard Prisma client for local SQLite
  prismaClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? prismaClient;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
