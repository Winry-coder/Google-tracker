import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/test
 * Simple test endpoint to verify cron authentication is working
 * Requires CRON_SECRET header
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Security Check: Only allow requests with the correct secret
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Invalid or missing CRON_SECRET',
        },
        { status: 401 }
      );
    }

    // If we get here, authentication passed!
    return NextResponse.json({
      success: true,
      message: '✅ Cron authentication is working correctly!',
      timestamp: new Date().toISOString(),
      environment: {
        hasCronSecret: !!cronSecret,
        secretLength: cronSecret?.length || 0,
      },
    });
  } catch (error) {
    console.error('Cron test failed:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
