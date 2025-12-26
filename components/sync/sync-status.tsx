'use client';

import { useSyncStatus } from '@/hooks/use-sync';
import { formatRelativeTime, formatDuration } from '@/lib/utils/format';

export function SyncStatus(): JSX.Element {
  const { data, isLoading } = useSyncStatus();

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  if (!data?.lastSync) {
    return (
      <div className="text-sm text-muted-foreground">
        No sync history available
      </div>
    );
  }

  const { lastSync } = data;

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-2 font-semibold">Last Sync</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Time:</span>
          <span>{formatRelativeTime(lastSync.timestamp)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span
            className={
              lastSync.status === 'success' ? 'text-green-600' : 'text-red-600'
            }
          >
            {lastSync.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Created:</span>
          <span>{lastSync.usersCreated}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Updated:</span>
          <span>{lastSync.usersUpdated}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Revoked:</span>
          <span>{lastSync.usersRevoked}</span>
        </div>
        {lastSync.duration && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration:</span>
            <span>{formatDuration(lastSync.duration)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
