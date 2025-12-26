import { NextResponse } from 'next/server';
import { getOverviewStats } from '@/lib/analytics/queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/analytics/overview
 * Returns an overview of lead generation statistics
 */
export async function GET() {
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
