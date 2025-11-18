'use client';

import { useState } from 'react';
import { Search, Database } from 'lucide-react';
import { useUsers } from '@/hooks/use-users';
import { SyncButton } from '@/components/sync/sync-button';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils/format';

export default function DashboardPage(): JSX.Element {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useUsers({
    page: 1,
    pageSize: 50,
    filters: search ? { search } : undefined
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Google Drive access sync and user management
              </p>
            </div>
            <SyncButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <StatsCards />

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Manage user access and permissions from Google Drive
                </CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Source</TableHead>
                    <TableHead className="font-semibold">Last Synced</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Loading users...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : !data || data.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32">
                        <div className="flex flex-col items-center justify-center gap-2 text-center">
                          <Database className="h-10 w-10 text-muted-foreground/50" />
                          <div>
                            <p className="font-medium">No users found</p>
                            <p className="text-sm text-muted-foreground">
                              {search
                                ? 'Try adjusting your search'
                                : 'Click "Sync Now" to fetch users from Google Drive'
                              }
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.data.map((user) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.name || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === 'active'
                                ? 'success'
                                : user.status === 'suspended'
                                  ? 'warning'
                                  : 'error'
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.source === 'drive' ? 'default' : 'secondary'}
                          >
                            {user.source}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.lastSyncedAt
                            ? formatDate(user.lastSyncedAt)
                            : 'Never'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {data && data.total > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {data.data.length} of {data.total} users
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RefreshCw({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  );
}
