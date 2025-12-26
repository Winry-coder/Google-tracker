'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  RefreshCw,
  CalendarDays,
  Download,
  BarChart2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils/format';

interface OverviewStats {
  totalLeads: number;
  newLeads7d: number;
  newLeads30d: number;
  growthRate: number;
  sources: { source: string; count: number }[];
  topCampaigns: { name: string; count: number }[];
}

interface TimelineItem {
  date: string;
  count: number;
}

interface CampaignStat {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  totalLeads: number;
  newLeads30d: number;
  growth: number;
  lastUpdated: string;
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [overviewRes, timelineRes, campaignsRes] = await Promise.all([
        fetch('/api/analytics/overview'),
        fetch(`/api/analytics/timeline?days=${timeRange}`),
        fetch('/api/analytics/campaigns'),
      ]);

      const [overviewData, timelineData, campaignsData] = await Promise.all([
        overviewRes.json(),
        timelineRes.json(),
        campaignsRes.json(),
      ]);

      if (overviewData.success) setOverview(overviewData.data);
      if (timelineData.success) setTimeline(timelineData.data);
      if (campaignsData.success) setCampaigns(campaignsData.data);
    } catch {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch analytics data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = () => {
    window.location.href = '/api/analytics/export';
  };

  if (isLoading && !overview) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="animate-pulse font-medium text-muted-foreground">
            Crunching your lead data...
          </p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...timeline.map((d) => d.count), 1);
  const maxCampaignLeads = Math.max(...campaigns.map((c) => c.totalLeads), 1);

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-12">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Analytics Insights
              </h1>
              <p className="mt-1 font-medium text-slate-500">
                Deep dive into your campaign performance and lead growth.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg border bg-slate-100 p-1">
                {['7', '30', '90'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`rounded-md px-4 py-1.5 text-xs font-semibold transition-all ${
                      timeRange === range
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {range} Days
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="h-9"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchData()}
                className="h-9 w-9"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto space-y-8 px-4 py-8">
        {/* Stats Row */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Leads"
            value={overview?.totalLeads || 0}
            description="All-time lead capture"
            icon={<Users className="h-5 w-5 text-blue-600" />}
            trend={overview?.growthRate || 0}
          />
          <StatCard
            title="Last 30 Days"
            value={overview?.newLeads30d || 0}
            description="Leads in past month"
            icon={<Calendar className="h-5 w-5 text-purple-600" />}
            trend={overview?.growthRate || 0}
            secondaryValue={`Avg ${Math.round((overview?.newLeads30d || 0) / 30)}/day`}
          />
          <StatCard
            title="Last 7 Days"
            value={overview?.newLeads7d || 0}
            description="Fresh leads gathered"
            icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
            secondaryValue={`↑ ${overview?.newLeads7d || 0} active`}
          />
          <StatCard
            title="Growth Rate"
            value={`${Math.round(overview?.growthRate || 0)}%`}
            description="Month-over-month"
            icon={<ArrowUpRight className="h-5 w-5 text-orange-600" />}
            trend={overview?.growthRate || 0}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Chart */}
          <Card className="border-slate-200/60 shadow-sm lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <div>
                <CardTitle className="text-xl">Growth Timeline</CardTitle>
                <CardDescription>
                  Visualizing lead capture over time
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-50"
                >
                  <CalendarDays className="mr-1.5 h-3 w-3" />
                  Last {timeRange} Days
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex h-[280px] items-end gap-2 px-2 md:gap-4">
                {timeline.map((item, idx) => {
                  const height = `${(item.count / maxCount) * 100}%`;
                  return (
                    <div
                      key={idx}
                      className="group relative flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <div className="pointer-events-none absolute -top-8 z-10 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {item.count} leads
                      </div>
                      <div
                        className="w-full rounded-t-sm bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-500 ease-out hover:from-blue-500 hover:to-blue-300"
                        style={{ height: item.count > 0 ? height : '4px' }}
                      ></div>
                      <div className="mt-3 hidden origin-left rotate-45 whitespace-nowrap text-[10px] font-medium text-slate-400 md:block">
                        {item.date.split('-').slice(1).join('/')}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-12 flex items-center justify-center gap-6 border-t pt-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                  <span>Daily Leads</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-slate-200"></div>
                  <span>Target Projection</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leads by Campaign Column */}
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart2 className="h-4 w-4 text-blue-600" />
                Leads by Campaign
              </CardTitle>
              <CardDescription>Performance comparison</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {campaigns.slice(0, 5).map((campaign) => (
                <div key={campaign.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="mr-4 truncate font-semibold text-slate-700">
                      {campaign.name}
                    </span>
                    <span className="font-bold text-slate-900">
                      {campaign.totalLeads}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width: `${(campaign.totalLeads / maxCampaignLeads) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}

              <div className="mt-4 border-t pt-4">
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Source Distribution
                </p>
                <div className="space-y-4">
                  {overview?.sources.map((source) => (
                    <div
                      key={source.source}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            source.source === 'drive'
                              ? 'bg-blue-600'
                              : source.source === 'manual'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                          }`}
                        ></div>
                        <span className="font-medium capitalize text-slate-600">
                          {source.source}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {source.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance Table */}
        <Card className="overflow-hidden border-slate-200/60 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-white pb-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Campaign Metrics</CardTitle>
                <CardDescription>
                  Detailed stats for all configured sources
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-[11px] font-bold uppercase tracking-wider text-blue-600"
              >
                View Full Report
              </Button>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-slate-50/50">
                  <TableHead className="w-[300px] font-bold text-slate-900">
                    Campaign Name
                  </TableHead>
                  <TableHead className="font-bold text-slate-900">
                    Status
                  </TableHead>
                  <TableHead className="font-bold text-slate-900">
                    Total Leads
                  </TableHead>
                  <TableHead className="font-bold text-slate-900">
                    Last 30 Days
                  </TableHead>
                  <TableHead className="font-bold text-slate-900">
                    Growth
                  </TableHead>
                  <TableHead className="pr-6 text-right font-bold text-slate-900">
                    Last Sync
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow
                    key={campaign.id}
                    className="h-16 transition-colors hover:bg-slate-50/50"
                  >
                    <TableCell className="font-bold text-slate-900">
                      {campaign.name}
                      <div className="mt-0.5 text-[10px] font-medium tracking-tight text-slate-400">
                        slug: /{campaign.slug}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={campaign.isActive ? 'default' : 'secondary'}
                        className={`rounded-full border-0 px-2 py-0 text-[10px] font-bold uppercase ${campaign.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                      >
                        {campaign.isActive ? 'Active' : 'Paused'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">
                      {campaign.totalLeads}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">
                          {campaign.newLeads30d}
                        </span>
                        {campaign.newLeads30d > 0 && (
                          <Badge className="h-4 border-blue-100 bg-blue-50 py-0 text-[9px] font-bold text-blue-700 hover:bg-blue-50">
                            +
                            {Math.round(
                              (campaign.newLeads30d /
                                (campaign.totalLeads || 1)) *
                                100
                            )}
                            %
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`flex items-center gap-1 text-sm font-black ${campaign.growth > 0 ? 'text-emerald-600' : 'text-slate-400'}`}
                      >
                        {campaign.growth > 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : null}
                        {campaign.growth}%
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 text-right text-xs font-medium text-slate-400">
                      {formatDate(campaign.lastUpdated)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  secondaryValue,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: number;
  secondaryValue?: string;
}) {
  return (
    <Card className="border-slate-200/60 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 shadow-sm">
            {icon}
          </div>
          {trend !== undefined && (
            <div
              className={`flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                trend >= 0
                  ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                  : 'border-red-100 bg-red-50 text-red-700'
              }`}
            >
              {trend >= 0 ? (
                <ArrowUpRight className="h-2.5 w-2.5" />
              ) : (
                <ArrowDownRight className="h-2.5 w-2.5" />
              )}
              {Math.abs(Math.round(trend))}%
            </div>
          )}
        </div>
        <div className="mt-4 space-y-1">
          <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black tracking-tighter text-slate-900">
              {value}
            </h3>
            {secondaryValue && (
              <span className="text-[10px] font-bold text-slate-400">
                {secondaryValue}
              </span>
            )}
          </div>
          <p className="mt-1 text-[11px] font-semibold text-slate-400">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
