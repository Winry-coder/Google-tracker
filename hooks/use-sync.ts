import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSyncStore } from '@/store/sync-store';
import { useUIStore } from '@/store/ui-store';
import type { SyncResult } from '@/types/sync';

async function triggerSync(campaignId?: string): Promise<SyncResult> {
  const response = await fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ campaignId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Sync failed');
  }

  const json = await response.json();
  return json.data;
}

async function fetchSyncStatus() {
  const response = await fetch('/api/sync/status');

  if (!response.ok) throw new Error('Failed to fetch sync status');

  const json = await response.json();
  return json.data;
}

export function useSync() {
  const queryClient = useQueryClient();
  const { setLastSync } = useSyncStore();
  const { setSyncing } = useUIStore();

  return useMutation({
    mutationFn: triggerSync,
    onMutate: () => {
      setSyncing(true);
    },
    onSuccess: (data) => {
      setLastSync(data);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['sync-status'] });
      setSyncing(false);
    },
    onError: () => {
      setSyncing(false);
    },
  });
}

export function useSyncStatus() {
  return useQuery({
    queryKey: ['sync-status'],
    queryFn: fetchSyncStatus,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
