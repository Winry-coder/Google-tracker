'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Zap, UserPlus, Mail, Search, CheckCircle2, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Activity {
  id: string;
  eventType: string;
  eventSource: string;
  createdAt: string;
  user?: {
    name: string | null;
    email: string;
    image: string | null;
    company: string | null;
  };
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivity = async () => {
    try {
      const response = await fetch('/api/activity');
      const data = await response.json();
      if (data.success) {
        setActivities(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
    // Poll every 30 seconds for "live" feel
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'user.created':
        return <UserPlus className="h-4 w-4 text-emerald-500" />;
      case 'access.granted':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'email.sent':
        return <Mail className="h-4 w-4 text-purple-500" />;
      case 'enrichment.completed':
        return <Search className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-none shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Live Pulse</CardTitle>
            <CardDescription className="text-xs">
              Real-time lead events
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="animate-pulse border-emerald-100 bg-emerald-50 text-[10px] font-bold uppercase text-emerald-600"
          >
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[400px]">
          <div className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_: unknown, i: number) => (
                <div key={i} className="flex animate-pulse gap-3 p-4">
                  <div className="h-8 w-8 rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                    <div className="h-2 w-1/4 rounded bg-slate-100" />
                  </div>
                </div>
              ))
            ) : activities.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">
                <p className="text-sm font-medium">No recent activity</p>
              </div>
            ) : (
              activities.map((activity: Activity) => (
                <div
                  key={activity.id}
                  className="group flex gap-3 p-4 transition-colors hover:bg-slate-50/50"
                >
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-white shadow-sm">
                    {getIcon(activity.eventType)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {activity.user?.name ||
                          activity.user?.email ||
                          'System'}
                      </p>
                      <span className="shrink-0 text-[10px] font-medium text-slate-400">
                        {formatDistanceToNow(new Date(activity.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500">
                      <span className="capitalize">
                        {activity.eventType.replace('.', ' ')}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {activity.eventSource}
                      </span>
                    </p>
                    {activity.user?.company && (
                      <div className="mt-2 flex w-fit items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-tight text-blue-600">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        {activity.user.company}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
