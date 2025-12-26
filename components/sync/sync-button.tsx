'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSync } from '@/hooks/use-sync';
import { useUIStore } from '@/store/ui-store';
import { useToast } from '@/hooks/use-toast';

export function SyncButton({
  className = '',
}: {
  className?: string;
}): JSX.Element {
  const { mutate: triggerSync } = useSync();
  const { isSyncing } = useUIStore();
  const { toast } = useToast();

  const handleSync = (): void => {
    triggerSync(undefined, {
      onSuccess: (data) => {
        toast({
          title: '✓ Sync completed successfully',
          description: `Created ${data.created.length} • Updated ${data.updated.length} • Revoked ${data.revoked.length}`,
        });
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: '✗ Sync failed',
          description:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        });
      },
    });
  };

  return (
    <Button
      onClick={handleSync}
      disabled={isSyncing}
      className={`gap-2 ${className}`}
    >
      <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? 'Syncing...' : 'Sync Now'}
    </Button>
  );
}
