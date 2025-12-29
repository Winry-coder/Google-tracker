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

const connectionString = process.env.TURSO_DATABASE_URL ?? 'file:./prisma/dev.db';
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

// Encryption Middleware
// import { encrypt, decrypt } from '@/lib/security/encryption';

/*
prismaClient.$use(async (params, next) => {
  if (params.model !== 'Account') {
    return next(params);
  }

  // Encryption on write
  if (['create', 'update', 'upsert'].includes(params.action)) {
    const data = params.args.data;
    if (data) {
        // Handle nested create/update if necessary, but standard NextAuth adapter usually does flat create
        if (typeof data.access_token === 'string') data.access_token = encrypt(data.access_token);
        if (typeof data.refresh_token === 'string') data.refresh_token = encrypt(data.refresh_token);
    }
  }

  const result = await next(params);

  // Decryption on read
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decryptAccount = (acc: any) => {
    if (!acc) return acc;
    if (acc.access_token) acc.access_token = decrypt(acc.access_token);
    if (acc.refresh_token) acc.refresh_token = decrypt(acc.refresh_token);
    return acc;
  };

  if (params.action.startsWith('find')) {
       if (Array.isArray(result)) {
      return result.map(decryptAccount);
    }
    return decryptAccount(result);
  }
 
  return result;
});
*/

export const prisma = globalForPrisma.prisma ?? prismaClient;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
