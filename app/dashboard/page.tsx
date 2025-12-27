'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Database,
  Download,
  User as UserIcon,
  Filter,
  BarChart3,
  CheckSquare,
  Settings,
  Square,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  Loader2,
  Menu,
  LogOut,
  Mail,
  Briefcase,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useUsers } from '@/hooks/use-users';
import { SyncButton } from '@/components/sync/sync-button';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/utils/format';
import { CreateUserDialog } from '@/components/users/create-user-dialog';
import { UserDetailSheet } from '@/components/users/user-detail-sheet';
import { useToast } from '@/hooks/use-toast';

interface Campaign {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  folderId: string;
  isActive: boolean;
  totalLeads: number;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage(): JSX.Element {
  const [search, setSearch] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isBulkActionRunning, setIsBulkActionRunning] = useState(false);
  const [viewUserId, setViewUserId] = useState<string | null>(null);

  const { toast } = useToast();
  const { data, isLoading, refetch } = useUsers({
    page: 1,
    pageSize: 100,
    filters: search ? { search } : undefined,
  });

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const response = await fetch('/api/campaigns');
        const result = await response.json();
        if (result.success) {
          setCampaigns(result.data);
        }
      } catch {
        // Silently fail in production or handle appropriately
      }
    }
    fetchCampaigns();
  }, []);

  const filteredUsers = useMemo(() => {
    return (
      data?.data.filter((user) => {
        if (selectedCampaign === 'all') return true;
        if (selectedCampaign === 'none') return !user.campaignId;
        return user.campaignId === selectedCampaign;
      }) || []
    );
  }, [data, selectedCampaign]);

  const toggleUser = (id: string) => {
    const next = new Set(selectedUsers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedUsers(next);
  };

  const toggleAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const handleBulkStatusChange = async (status: string) => {
    setIsBulkActionRunning(true);
    try {
      const response = await fetch('/api/users/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: Array.from(selectedUsers),
          action: status === 'revoked' ? 'delete' : 'update_status',
          status: status,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Action complete',
          description:
            result.message ||
            `Successfully updated ${selectedUsers.size} users.`,
        });
        setSelectedUsers(new Set());
        refetch();
      } else {
        throw new Error(result.error || 'Failed to perform bulk action');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Bulk action failed',
        description:
          error instanceof Error
            ? error.message
            : 'Could not update selected users.',
      });
    } finally {
      setIsBulkActionRunning(false);
    }
  };

  const handleExport = () => {
    window.location.href = '/api/users/export';
  };

  const NavButtons = ({ vertical = false }: { vertical?: boolean }) => (
    <div
      className={`flex ${vertical ? 'flex-col gap-3' : 'hidden items-center gap-2 lg:flex'}`}
    >
      <Button
        variant="outline"
        size={vertical ? 'lg' : 'sm'}
        onClick={() => (window.location.href = '/campaigns')}
        className={
          vertical ? 'h-12 w-full justify-start rounded-xl' : 'rounded-lg'
        }
      >
        <Filter className="mr-2 h-4 w-4" />
        Campaigns
      </Button>
      <Button
        variant="outline"
        size={vertical ? 'lg' : 'sm'}
        onClick={() => (window.location.href = '/analytics')}
        className={
          vertical ? 'h-12 w-full justify-start rounded-xl' : 'rounded-lg'
        }
      >
        <BarChart3 className="mr-2 h-4 w-4" />
        Analytics
      </Button>
      <Button
        variant="outline"
        size={vertical ? 'lg' : 'sm'}
        onClick={handleExport}
        className={
          vertical ? 'h-12 w-full justify-start rounded-xl' : 'rounded-lg'
        }
      >
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
      <div className={vertical ? 'w-full' : ''}>
        <CreateUserDialog campaigns={campaigns} />
      </div>
      <div className={vertical ? 'w-full' : ''}>
        <SyncButton />
      </div>
      <Button
        variant="outline"
        size={vertical ? 'lg' : 'sm'}
        onClick={() => (window.location.href = '/settings')}
        className={
          vertical ? 'h-12 w-full justify-start rounded-xl' : 'rounded-lg'
        }
      >
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button>
      <Button
        variant="ghost"
        size={vertical ? 'lg' : 'sm'}
        onClick={() => {
          import('next-auth/react').then((mod) => mod.signOut());
        }}
        className={`text-red-600 hover:bg-red-50 hover:text-red-700 ${vertical ? 'h-12 w-full justify-start rounded-xl' : 'rounded-lg'}`}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <UserDetailSheet
        userId={viewUserId}
        open={!!viewUserId}
        onOpenChange={(open) => !open && setViewUserId(null)}
      />

      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-white">
        <div className="container mx-auto px-4 py-3 sm:py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-black tracking-tight sm:text-2xl">
                Drive Sync Dashboard
              </h1>
              <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-wide text-gray-400 text-muted-foreground sm:text-xs">
                Manage Google Drive folder permissions and lead access
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <NavButtons />
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-xl border-gray-200 shadow-sm"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                    <SheetHeader className="pb-6 text-left">
                      <SheetTitle className="text-2xl font-black">
                        Menu
                      </SheetTitle>
                      <SheetDescription>
                        Manage your campaigns and settings
                      </SheetDescription>
                    </SheetHeader>
                    <NavButtons vertical />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto space-y-6 px-4 py-6 sm:space-y-8 sm:py-8">
        <StatsCards />

        {/* Getting Started guide */}
        <Card className="overflow-hidden rounded-2xl border-none bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Launch your campaign in 3 simple steps.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-slate-600 md:grid-cols-3">
            <div>
              <h3 className="mb-1 font-semibold">
                1. Sign in with Google
              </h3>
              <p>
                Connect your Google account to enable secure access to your Drive folders.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold">2. Connect a Folder</h3>
              <p>
                Select the Google Drive folder you want to track leads for.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold">3. Share & Track</h3>
              <p>
                Share your unique access link and watch leads roll in automatically.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="h-full overflow-hidden rounded-2xl border-none shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-white p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold sm:text-xl">
                        User Directory
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {filteredUsers.length} users in current view
                      </CardDescription>
                    </div>
                    {selectedUsers.size > 0 && (
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="default"
                              size="sm"
                              disabled={isBulkActionRunning}
                              className="h-8 rounded-lg bg-slate-900 sm:h-9"
                            >
                              {isBulkActionRunning ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : null}
                              <span className="hidden sm:inline">
                                Bulk Actions
                              </span>
                              <span className="sm:hidden">Actions</span> (
                              {selectedUsers.size})
                              <ChevronDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>
                              Modify Selection
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleBulkStatusChange('active')}
                            >
                              <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" />{' '}
                              Grant Access
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleBulkStatusChange('suspended')
                              }
                            >
                              <ShieldAlert className="mr-2 h-4 w-4 text-orange-500" />{' '}
                              Suspend Access
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleBulkStatusChange('revoked')}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete Users
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-10 rounded-xl border-gray-100 bg-gray-50/50 pl-9 transition-all focus:bg-white"
                      />
                    </div>
                    <select
                      value={selectedCampaign}
                      onChange={(e) => setSelectedCampaign(e.target.value)}
                      className="h-10 rounded-xl border border-gray-100 bg-gray-50/50 px-3 py-1 text-sm shadow-sm transition-all focus:bg-white focus:outline-none"
                    >
                      <option value="all">All Campaigns</option>
                      <option value="none">Manual / Untagged</option>
                      {campaigns.map((campaign) => (
                        <option key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleAll}
                      className="h-10 rounded-xl px-4 font-bold text-blue-600 hover:bg-blue-50"
                    >
                      {selectedUsers.size === filteredUsers.length &&
                      filteredUsers.length > 0
                        ? 'Deselect Items'
                        : 'Select All Items'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b bg-gray-50/30 hover:bg-gray-50/30">
                        <TableHead className="w-12 px-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={toggleAll}
                            disabled={isLoading || filteredUsers.length === 0}
                          >
                            {selectedUsers.size === filteredUsers.length &&
                            filteredUsers.length > 0 ? (
                              <CheckSquare className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Square className="h-4 w-4 text-gray-300" />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead className="font-bold text-gray-900">
                          Email
                        </TableHead>
                        <TableHead className="font-bold text-gray-900">
                          Name
                        </TableHead>
                        <TableHead className="font-bold text-gray-900">
                          Source
                        </TableHead>
                        <TableHead className="font-bold text-gray-900">
                          Status
                        </TableHead>
                        <TableHead className="pr-6 text-right font-bold text-gray-900">
                          Last Synced
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-48 text-center">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                            <p className="mt-3 text-sm font-medium">
                              Loading sync data...
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="h-48 text-center text-muted-foreground"
                          >
                            <Database className="mx-auto mb-2 h-10 w-10 opacity-20" />
                            <p>No users found. Run a sync to fetch users.</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => {
                          const userCampaign = campaigns.find(
                            (c) => c.id === user.campaignId
                          );
                          const isSelected = selectedUsers.has(user.id);
                          return (
                            <TableRow
                              key={user.id}
                              className={`h-16 cursor-pointer ${isSelected ? 'bg-blue-50/30' : 'hover:bg-gray-50/40'}`}
                              onClick={() => setViewUserId(user.id)}
                            >
                              <TableCell
                                className="px-4"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => toggleUser(user.id)}
                                >
                                  {isSelected ? (
                                    <CheckSquare className="h-4 w-4 text-blue-600" />
                                  ) : (
                                    <Square className="h-4 w-4 text-gray-200" />
                                  )}
                                </Button>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-100">
                                    {user.image ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        src={user.image}
                                        alt=""
                                        className="h-full w-full rounded-full object-cover"
                                      />
                                    ) : (
                                      <UserIcon className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-gray-900">
                                      {user.name || 'Anonymous'}
                                    </div>
                                    <div className="text-[11px] font-medium text-gray-400">
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {userCampaign ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-white text-[10px] font-bold uppercase text-gray-600"
                                  >
                                    {userCampaign.name}
                                  </Badge>
                                ) : (
                                  '—'
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm font-bold text-gray-700">
                                  {user.company || '—'}
                                </div>
                                <div className="text-[10px] font-medium uppercase tracking-tight text-gray-400">
                                  {user.jobTitle || 'Lead'}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`rounded-full px-2 py-0 text-[10px] font-bold uppercase ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : user.status === 'suspended' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}
                                >
                                  {user.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="pr-6 text-right text-xs font-medium text-gray-400">
                                {user.lastSyncedAt
                                  ? formatDate(user.lastSyncedAt)
                                  : 'Pending...'}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card List View */}
                <div className="divide-y divide-gray-100 md:hidden">
                  {isLoading ? (
                    <div className="p-12 text-center text-muted-foreground">
                      <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-blue-600" />{' '}
                      Loading...
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                      No users found.
                    </div>
                  ) : (
                    filteredUsers.map((user) => {
                      const userCampaign = campaigns.find(
                        (c) => c.id === user.campaignId
                      );
                      const isSelected = selectedUsers.has(user.id);
                      return (
                        <div
                          key={user.id}
                          className={`flex gap-4 p-4 transition-colors active:bg-gray-50 ${isSelected ? 'bg-blue-50/50' : ''}`}
                          onClick={() => setViewUserId(user.id)}
                        >
                          <div
                            className="mt-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => toggleUser(user.id)}
                            >
                              {isSelected ? (
                                <CheckSquare className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Square className="h-4 w-4 text-gray-200" />
                              )}
                            </Button>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center justify-between gap-2">
                              <div className="truncate font-bold text-gray-900">
                                {user.name || 'Anonymous'}
                              </div>
                              <Badge
                                className={`shrink-0 rounded-full px-2 py-0 text-[9px] font-bold uppercase ${user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                              >
                                {user.status}
                              </Badge>
                            </div>
                            <div className="mb-2 flex items-center truncate text-xs text-gray-400">
                              <Mail className="mr-1 h-3 w-3" /> {user.email}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {userCampaign && (
                                <Badge
                                  variant="secondary"
                                  className="border-none bg-gray-100 px-1.5 py-0 text-[10px] font-medium text-gray-600 shadow-none"
                                >
                                  {userCampaign.name}
                                </Badge>
                              )}
                              {user.company && (
                                <div className="flex items-center rounded-md border border-gray-100 bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-500">
                                  <Briefcase className="mr-1 h-2.5 w-2.5" />{' '}
                                  {user.company}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>
      </div>

      {/* Floating Selection Bar */}
      {selectedUsers.size > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-50 flex items-center justify-between gap-4 rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-2xl duration-500 animate-in slide-in-from-bottom-8 md:left-1/2 md:right-auto md:-translate-x-1/2 md:justify-start">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold leading-none">
              {selectedUsers.size}
            </div>
            <div className="text-sm font-bold">Selected</div>
          </div>
          <div className="hidden h-4 w-px bg-slate-700 md:block"></div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-white hover:bg-white/10"
              onClick={toggleAll}
            >
              Deselect
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="h-9 rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  Action <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => handleBulkStatusChange('active')}
                >
                  Grant Access
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleBulkStatusChange('suspended')}
                >
                  Suspend
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleBulkStatusChange('revoked')}
                >
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </div>
  );
}
