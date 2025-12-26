'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Shield,
  Database,
  Calendar,
  HardDrive,
  Activity,
  History,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExtendedUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  status: string;
  source: string;
  hasAccess: boolean;
  createdAt: string;
  lastSyncedAt: string | null;
  campaign?: {
    name: string;
    folderId: string;
  };
  company: string | null;
  jobTitle: string | null;
  linkedinUrl: string | null;
  enrichedAt: string | null;
  auditLogs: {
    id: string;
    eventType: string;
    eventSource: string;
    performedBy: string;
    createdAt: string;
    newValue: string | null;
  }[];
}

interface UserDetailSheetProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailSheet({
  userId,
  open,
  onOpenChange,
}: UserDetailSheetProps) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && userId) {
      const fetchUser = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/users/${userId}`);
          if (!response.ok) throw new Error('Failed to fetch user details');
          const data = await response.json();
          if (data.success) {
            setUser(data.data);
          }
        } catch {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not load user details',
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchUser();
    }
  }, [userId, open, toast]);

  if (!open) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full w-full flex-col bg-slate-50/50 sm:w-[540px]">
        <SheetHeader className="border-b bg-white pb-6">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5 text-slate-500" />
            User Details
          </SheetTitle>
          <SheetDescription>
            Comprehensive view of user metadata, access history, and system
            logs.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex animate-pulse flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800" />
              <p className="text-sm text-muted-foreground">
                Loading details...
              </p>
            </div>
          </div>
        ) : user ? (
          <ScrollArea className="-mx-6 flex-1 px-6">
            <div className="space-y-6 py-6">
              {/* Profile Card */}
              <div className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {user.name || 'Unnamed User'}
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-slate-500">
                      <Mail className="mr-1 h-3 w-3" />
                      {user.email}
                    </div>
                  </div>
                  <Badge
                    variant={user.status === 'active' ? 'default' : 'secondary'}
                    className={
                      user.status === 'active'
                        ? 'bg-emerald-500 hover:bg-emerald-600'
                        : user.status === 'suspended'
                          ? 'bg-orange-500 hover:bg-orange-600'
                          : 'bg-red-500 hover:bg-red-600'
                    }
                  >
                    {user.status.toUpperCase()}
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Shield className="h-3 w-3" /> Role
                    </span>
                    <span className="font-medium capitalize">{user.role}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Database className="h-3 w-3" /> Source
                    </span>
                    <span className="font-medium capitalize">
                      {user.source}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" /> Joined
                    </span>
                    <span className="font-medium">
                      {format(new Date(user.createdAt), 'PPP')}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <History className="h-3 w-3" /> Last Synced
                    </span>
                    <span className="font-medium">
                      {user.lastSyncedAt
                        ? format(new Date(user.lastSyncedAt), 'PP p')
                        : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lead Insights (Phase 4) */}
              {(user.company || user.jobTitle) && (
                <div className="my-6 space-y-4 rounded-lg border bg-slate-900 p-4 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded bg-blue-500/20 p-1.5 text-blue-400">
                        <Activity className="h-4 w-4" />
                      </div>
                      <h4 className="text-sm font-bold uppercase tracking-wide">
                        AI Enriched Insights
                      </h4>
                    </div>
                    {user.enrichedAt && (
                      <span className="text-[10px] font-medium text-slate-400">
                        Updated {format(new Date(user.enrichedAt), 'MMM d')}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 rounded-md border border-slate-700/50 bg-slate-800/50 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-700 text-lg font-bold text-blue-400">
                        {user.company?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-tighter text-slate-400">
                          Current Company
                        </p>
                        <p className="text-sm font-bold">
                          {user.company || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-md border border-slate-700/50 bg-slate-800/50 p-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-tighter text-slate-400">
                          Job Title
                        </p>
                        <p className="text-sm font-bold">
                          {user.jobTitle || 'Professional'}
                        </p>
                      </div>
                      {user.linkedinUrl && (
                        <a
                          href={user.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded bg-[#0077b5] transition-opacity hover:opacity-80"
                        >
                          <svg
                            className="h-4 w-4 fill-white"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Campaign / Drive Info */}
              {user.campaign ? (
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-blue-600" />
                    <h4 className="text-sm font-semibold">Campaign Access</h4>
                  </div>
                  <div className="rounded-md border border-blue-100 bg-blue-50 p-3">
                    <p className="text-sm font-medium text-blue-900">
                      {user.campaign.name}
                    </p>
                    <p className="mt-1 font-mono text-xs text-blue-700">
                      {user.campaign.folderId}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-gray-50 p-4 py-6 text-center">
                  <AlertCircle className="mb-2 h-8 w-8 text-gray-300" />
                  <p className="text-sm text-gray-500">
                    No active campaign associated
                  </p>
                </div>
              )}

              {/* Audit Log Timeline */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Activity className="h-4 w-4 text-slate-500" />
                  <h4 className="text-sm font-semibold">Activity Log</h4>
                </div>

                <div className="relative ml-2 space-y-6 border-l-2 border-slate-200 py-2 pl-4">
                  {user.auditLogs?.map((log) => (
                    <div key={log.id} className="relative">
                      <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-slate-300 ring-4 ring-slate-50" />
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {format(new Date(log.createdAt), 'PP p')}
                        </span>
                        <p className="text-sm font-medium text-slate-900">
                          {log.eventType.replace('.', ' ')}
                        </p>
                        <div className="inline-block w-fit rounded border bg-white px-2 py-1 text-xs text-slate-500 shadow-sm">
                          Source: {log.eventSource} • By: {log.performedBy}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!user.auditLogs || user.auditLogs.length === 0) && (
                    <p className="text-sm italic text-muted-foreground">
                      No recent activity recorded.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            User not found.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
