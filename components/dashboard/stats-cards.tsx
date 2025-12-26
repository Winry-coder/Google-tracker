'use client';

import { useState, useEffect } from 'react';
import { Users, UserCheck, RefreshCw, FolderOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useSyncStatus } from '@/hooks/use-sync';
import { formatRelativeTime } from '@/lib/utils/format';

interface StatsData {
  totalUsers: number;
  userGrowth: number;
  activeAccess: number;
  totalLeads: number;
  totalViews: number;
  conversionRate: number;
  campaignCount: number;
}

export function StatsCards(): JSX.Element {
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: syncData } = useSyncStatus();

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        const result = await response.json();
        if (result.success) {
          setStatsData(result.data);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch stats:', error);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const stats = [
    {
      title: 'Total Leads',
      value: statsData?.totalUsers || 0,
      trend: statsData?.userGrowth || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Conversion Rate',
      value: `${statsData?.conversionRate.toFixed(1) || 0}%`,
      subtitle: `${statsData?.totalViews || 0} Total Views`,
      icon: FolderOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      isText: true,
    },
    {
      title: 'Active Access',
      value: statsData?.activeAccess || 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'System Health',
      value: syncData?.lastSync ? 'Synced' : 'Pending',
      subtitle: syncData?.lastSync
        ? formatRelativeTime(syncData.lastSync.timestamp)
        : 'Setup Required',
      icon: RefreshCw,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 px-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="group overflow-hidden rounded-2xl border-none shadow-sm transition-shadow duration-300 hover:shadow-md"
        >
          <CardContent className="relative p-5 sm:p-6">
            <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
              <stat.icon className="h-16 w-16" />
            </div>

            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-3 flex items-center gap-2.5">
                <div className={`${stat.bgColor} ${stat.color} rounded-xl p-2`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {stat.title}
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black leading-none text-slate-900 sm:text-3xl">
                  {isLoading
                    ? '...'
                    : stat.isText
                      ? stat.value
                      : stat.value.toLocaleString()}
                </h3>
                {stat.trend !== undefined && stat.trend !== 0 && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ${stat.trend > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}
                  >
                    {stat.trend > 0 ? '+' : ''}
                    {stat.trend.toFixed(0)}%
                  </span>
                )}
              </div>

              {stat.subtitle && (
                <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  {stat.subtitle}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
