'use client';

import { Users, UserCheck, UserX, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useUsers } from '@/hooks/use-users';
import { useSyncStatus } from '@/hooks/use-sync';
import { formatRelativeTime } from '@/lib/utils/format';

export function StatsCards(): JSX.Element {
  const { data: usersData } = useUsers({ page: 1, pageSize: 1000 });
  const { data: syncData } = useSyncStatus();

  const totalUsers = usersData?.total || 0;
  const activeUsers =
    usersData?.data.filter((u) => u.hasAccess && u.status === 'active')
      .length || 0;
  const revokedUsers =
    usersData?.data.filter((u) => !u.hasAccess || u.status === 'revoked')
      .length || 0;

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Revoked',
      value: revokedUsers,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Last Sync',
      value: syncData?.lastSync
        ? formatRelativeTime(syncData.lastSync.timestamp)
        : 'Never',
      icon: RefreshCw,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      isText: true,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mt-2">
                  {stat.isText ? stat.value : stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
