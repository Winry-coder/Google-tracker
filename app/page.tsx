import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function DashboardPage(): JSX.Element {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Drive Sync Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage Google Drive folder permissions and user access
        </p>
      </div>

      <div className="mb-8">
        <Button>Sync Now</Button>
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
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No users found. Run a sync to fetch users from Google Drive.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="mt-8 rounded-md border p-6">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>Configure your .env file with Google OAuth credentials</li>
          <li>Set up your Turso database connection</li>
          <li>Run database migrations: <code className="bg-muted px-2 py-1 rounded">pnpm prisma db push</code></li>
          <li>Click &quot;Sync Now&quot; to fetch users from Google Drive</li>
        </ol>
      </div>
    </div>
  );
}
