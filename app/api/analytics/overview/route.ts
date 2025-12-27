import { NextResponse } from 'next/server';
import { getOverviewStats } from '@/lib/analytics/queries';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

export const dynamic = 'force-dynamic';

/**
 * GET /api/analytics/overview
 * Returns an overview of lead generation statistics
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const stats = await getOverviewStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch analytics overview:', error);
    }

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
