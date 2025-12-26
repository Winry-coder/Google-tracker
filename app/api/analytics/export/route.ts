import { NextResponse } from 'next/server';
import { getCampaignsAnalytics } from '@/lib/analytics/queries';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getCampaignsAnalytics();

    // Create CSV header
    const headers = [
      'Campaign Name',
      'Slug',
      'Status',
      'Total Leads',
      'New Leads (30d)',
      'Growth %',
      'Last Updated',
    ];

    // Create CSV rows
    const rows = stats.map(
      (s: {
        name: string;
        slug: string;
        isActive: boolean;
        totalLeads: number;
        newLeads30d: number;
        growth: number;
        lastUpdated: Date;
      }) => [
        s.name,
        s.slug,
        s.isActive ? 'Active' : 'Paused',
        s.totalLeads,
        s.newLeads30d,
        `${s.growth}%`,
        new Date(s.lastUpdated).toISOString(),
      ]
    );

    const csvContent = [
      headers.join(','),
      ...rows.map((row: (string | number)[]) =>
        row.map((cell: string | number) => `"${cell}"`).join(',')
      ),
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=campaign_analytics_${new Date().toISOString().split('T')[0]}.csv`,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Analytics export failed:', error);
    }
    return NextResponse.json(
      { error: 'Failed to export analytics' },
      { status: 500 }
    );
  }
}
