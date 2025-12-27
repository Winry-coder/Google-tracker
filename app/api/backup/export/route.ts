import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/prisma/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/backup/export
 * Admin-only endpoint that returns a JSON snapshot of core tables.
 * Intended as a simple backup/export mechanism for small deployments.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [users, campaigns, syncLogs, auditLogs] = await Promise.all([
    prisma.user.findMany(),
    prisma.campaign.findMany(),
    prisma.syncLog.findMany(),
    prisma.auditLog.findMany(),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    users,
    campaigns,
    syncLogs,
    auditLogs,
  };

  return new NextResponse(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition':
        'attachment; filename="backup-export-' +
        new Date().toISOString().split('T')[0] +
        '.json"',
    },
  });
}