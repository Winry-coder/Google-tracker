import { NextAuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma/client';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      status: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
    id: string;
    status: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    status: string;
  }
}

export const authOptions: NextAuthOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
  },
  debug: true,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('User not found or no password set');
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Check for admin role
        if (user.role !== 'admin') {
          throw new Error('Access denied. Admin role required.');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
          scope: [
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive.metadata.readonly',
            'https://www.googleapis.com/auth/drive.readonly',
            'openid',
            'email',
            'profile',
          ].join(' '),
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      // 1. Initial sign in
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.status = user.status;
        return token;
      }

      // 2. Subsequent sessions: Refresh role from database if not cached
      // Using a simple memory cache to avoid hitting DB on every single request
      // In production, use Redis or similar.
      const now = Math.floor(Date.now() / 1000);
      const CACHE_TTL = 60; // 60 seconds

      if (!token.lastRoleCheck || now - (token.lastRoleCheck as number) > CACHE_TTL) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id },
            select: { role: true, status: true },
          });

          if (dbUser) {
            token.role = dbUser.role;
            token.status = dbUser.status; // Store status in token for middleware check
          }
          token.lastRoleCheck = now;
        } catch (error) {
          console.error('JWT Role Refresh Error:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.status = token.status;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
