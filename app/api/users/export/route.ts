import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { formatDate } from '@/lib/utils/format';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

/**
 * GET /api/users/export
 * Downloads all users as a CSV file
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 }
    );
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Define CSV headers
    const headers = [
      'Email',
      'Name',
      'Status',
      'Role',
      'Source',
      'Has Access',
      'Last Synced',
    ].join(',');

    // Map users to CSV rows
    const rows = users.map((user) => {
      return [
        user.email,
        `"${user.name || ''}"`, // Wrap in quotes to handle commas in names
        user.status,
        user.role,
        user.source,
        user.hasAccess ? 'Yes' : 'No',
        user.lastSyncedAt ? formatDate(user.lastSyncedAt) : 'Never',
      ].join(',');
    });

    // Combine headers and rows
    const csvContent = [headers, ...rows].join('\n');

    // Create response with CSV headers
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="drive-users-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Export failed:', error);
    }
    return NextResponse.json(
      { success: false, error: 'Failed to export users' },
      { status: 500 }
    );
  }
}
