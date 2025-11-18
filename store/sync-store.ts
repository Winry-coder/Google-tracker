import { create } from 'zustand';
import type { SyncResult } from '@/types/sync';

interface SyncState {
  lastSync: SyncResult | null;
  syncHistory: SyncResult[];
  setLastSync: (result: SyncResult) => void;
  addToHistory: (result: SyncResult) => void;
  clearHistory: () => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  lastSync: null,
  syncHistory: [],

  setLastSync: (result) =>
    set((state) => ({
      lastSync: result,
      syncHistory: [result, ...state.syncHistory.slice(0, 9)],
    })),

  addToHistory: (result) =>
    set((state) => ({
      syncHistory: [result, ...state.syncHistory].slice(0, 10),
    })),

  clearHistory: () => set({ syncHistory: [] }),
}));
