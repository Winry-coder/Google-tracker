import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
} from '@/types/user';
import type { PaginatedResponse } from '@/types/api';

interface UseUsersParams {
  page?: number;
  pageSize?: number;
  filters?: UserFilters;
}

async function fetchUsers(
  params: UseUsersParams
): Promise<PaginatedResponse<User>> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', params.page.toString());
  if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString());
  if (params.filters?.status) searchParams.set('status', params.filters.status);
  if (params.filters?.source) searchParams.set('source', params.filters.source);
  if (params.filters?.hasAccess !== undefined)
    searchParams.set('hasAccess', params.filters.hasAccess.toString());
  if (params.filters?.search) searchParams.set('search', params.filters.search);

  const response = await fetch(`/api/users?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch users');

  const json = await response.json();
  return json.data;
}

async function createUser(input: CreateUserInput): Promise<User> {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error('Failed to create user');

  const json = await response.json();
  return json.data;
}

async function updateUser(id: string, updates: UpdateUserInput): Promise<User> {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) throw new Error('Failed to update user');

  const json = await response.json();
  return json.data;
}

async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Failed to delete user');
}

export function useUsers(params: UseUsersParams = {}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateUserInput }) =>
      updateUser(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
