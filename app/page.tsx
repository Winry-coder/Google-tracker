'use client';

import { useUsers } from '@/hooks/use-users';
import { SyncButton } from '@/components/sync/sync-button';
import { SyncStatus } from '@/components/sync/sync-status';
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
  const { data, isLoading } = useUsers({ page: 1, pageSize: 10 });

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Drive Sync Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage Google Drive folder permissions and user access
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <SyncButton />
        </div>
        <div>
          <SyncStatus />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Last Synced</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : !data || data.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No users found. Run a sync to fetch users from Google Drive.
                </TableCell>
              </TableRow>
            ) : (
              data.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.name || '-'}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : user.status === 'suspended'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.source === 'drive'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.source}
                    </span>
                  </TableCell>
                  <TableCell>
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

      <div className="mt-8 rounded-md border p-6">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>Configure your .env file with Google OAuth credentials</li>
          <li>Set up your Turso database connection</li>
          <li>
            Run database migrations:{' '}
            <code className="bg-muted px-2 py-1 rounded">
              pnpm prisma db push
            </code>
          </li>
          <li>Click &quot;Sync Now&quot; to fetch users from Google Drive</li>
        </ol>
      </div>
    </div>
  );
}
