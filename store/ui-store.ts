import { create } from 'zustand';

interface UIState {
  isUserModalOpen: boolean;
  isSyncing: boolean;
  sidebarOpen: boolean;
  openUserModal: () => void;
  closeUserModal: () => void;
  setSyncing: (syncing: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isUserModalOpen: false,
  isSyncing: false,
  sidebarOpen: true,

  openUserModal: () => set({ isUserModalOpen: true }),
  closeUserModal: () => set({ isUserModalOpen: false }),
  setSyncing: (syncing) => set({ isSyncing: syncing }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
