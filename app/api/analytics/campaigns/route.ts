import { NextResponse } from 'next/server';
import { getCampaignsAnalytics } from '@/lib/analytics/queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/analytics/campaigns
 * Returns detailed stats per campaign
 */
export async function GET() {
  try {
    const data = await getCampaignsAnalytics();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch campaign analytics:', error);
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
