import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';

interface UserState {
  users: User[];
  selectedUser: User | null;
  filters: {
    status?: string;
    source?: string;
    hasAccess?: boolean;
    search?: string;
  };
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  removeUser: (id: string) => void;
  setSelectedUser: (user: User | null) => void;
  setFilters: (filters: UserState['filters']) => void;
  clearFilters: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      users: [],
      selectedUser: null,
      filters: {},

      setUsers: (users) => set({ users }),

      addUser: (user) =>
        set((state) => ({
          users: [user, ...state.users],
        })),

      updateUser: (id, updates) =>
        set((state: UserState) => ({
          users: state.users.map((u: User) =>
            u.id === id ? { ...u, ...updates } : u
          ),
        })),

      removeUser: (id) =>
        set((state: UserState) => ({
          users: state.users.filter((u: User) => u.id !== id),
        })),

      setSelectedUser: (user) => set({ selectedUser: user }),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      clearFilters: () => set({ filters: {} }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);
