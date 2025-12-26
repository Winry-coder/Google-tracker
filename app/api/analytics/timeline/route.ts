import { NextResponse } from 'next/server';
import { getTimelineData } from '@/lib/analytics/queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/analytics/timeline
 * Query Params: ?days=7|30|90
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7', 10);

    const data = await getTimelineData(days);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch timeline data:', error);
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
