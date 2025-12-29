'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  RefreshCw,
  Trash2,
  FolderOpen,
  ExternalLink,
  Loader2,
  Info,
} from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/format';
import { CampaignForm } from '@/components/campaigns/campaign-form';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';

interface Campaign {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  folderId: string;
  isActive: boolean;
  totalLeads: number;
  viewCount: number;
  emailSubject?: string | null;
  emailBody?: string | null;
  webhookUrl?: string | null;
  variants: {
    id: string;
    name: string;
    viewCount: number;
    leadCount: number;
    isActive: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | undefined>(
    undefined
  );
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(
    null
  );

  const { toast } = useToast();

  const fetchCampaigns = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/campaigns');
      const result = await response.json();
      if (result.success) {
        setCampaigns(result.data);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch campaigns:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  async function handleSync(id: string) {
    setIsSyncing(id);
    try {
      const response = await fetch(`/api/campaigns/${id}/sync`, {
        method: 'POST',
      });
      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Sync Complete',
          description: `Found ${result.data.created.length} new leads.`,
        });
        fetchCampaigns();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Sync Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsSyncing(null);
    }
  }

  async function handleDelete() {
    if (!campaignToDelete) return;

    try {
      const response = await fetch(`/api/campaigns/${campaignToDelete.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Campaign Deleted',
          description: `"${campaignToDelete.name}" has been removed.`,
        });
        fetchCampaigns();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setCampaignToDelete(null);
    }
  }

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingCampaign(undefined);
    setIsFormOpen(true);
  };

  return (
    <AuthenticatedLayout
      title="Campaign List"
      description="Manage your Google Drive folders and track specific lead sources."
    >
      <div className="space-y-8">
        <div className="flex items-center justify-end">
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>
                  {campaigns.length} campaigns configured for synchronization.
                </CardDescription>
              </div>
              {campaigns.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchCampaigns()}
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                  />
                  Refresh
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-20">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="font-medium text-muted-foreground">
                  Loading your campaigns...
                </p>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                  <FolderOpen className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  No Campaigns Found
                </h3>
                <p className="mb-8 mt-2 max-w-sm text-gray-500">
                  Connect a Google Drive folder to start synchronizing leads
                  automatically.
                </p>
                <Button onClick={handleCreate}>
                  Create Your First Campaign
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-100">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow>
                      <TableHead className="w-[300px]">
                        Campaign Details
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total Leads</TableHead>
                      <TableHead>Conv. Rate</TableHead>
                      <TableHead>Last Synced</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow
                        key={campaign.id}
                        className="group hover:bg-gray-50/30"
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="flex items-center font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                              {campaign.name}
                              <ExternalLink className="ml-2 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                            </span>
                            <span className="text-[11px] font-medium text-gray-400">
                              slug: {campaign.slug}
                            </span>
                            {campaign.description && (
                              <p className="mt-1 line-clamp-1 text-xs italic text-gray-500">
                                &quot;{campaign.description}&quot;
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              campaign.isActive ? 'default' : 'secondary'
                            }
                            className={
                              campaign.isActive
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : ''
                            }
                          >
                            {campaign.isActive ? 'Active' : 'Paused'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center font-semibold text-gray-700">
                            {campaign.totalLeads}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-blue-600">
                                {campaign.viewCount > 0
                                  ? (
                                      (campaign.totalLeads /
                                        campaign.viewCount) *
                                      100
                                    ).toFixed(1)
                                  : '0.0'}
                                %
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">
                                Total
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              {campaign.variants &&
                                campaign.variants.length > 0 &&
                                campaign.variants.map((v) => (
                                  <div
                                    key={v.id}
                                    className="flex items-center justify-between gap-4 rounded border border-slate-100/50 bg-slate-50/80 px-1.5 py-0.5"
                                  >
                                    <span className="max-w-[40px] truncate text-[9px] font-black uppercase tracking-tight text-slate-500">
                                      {v.name}
                                    </span>
                                    <div className="ml-auto flex items-center gap-1.5">
                                      <span className="text-[9px] font-bold text-slate-900">
                                        {v.leadCount} conversions
                                      </span>
                                      <span
                                        className={`text-[9px] font-black ${v.viewCount > 0 && v.leadCount / v.viewCount > campaign.totalLeads / campaign.viewCount ? 'text-emerald-500' : 'text-slate-400'}`}
                                      >
                                        {v.viewCount > 0
                                          ? (
                                              (v.leadCount / v.viewCount) *
                                              100
                                            ).toFixed(1)
                                          : '0.0'}
                                        %
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                            <div className="text-[9px] font-medium text-gray-400">
                              from {campaign.viewCount} views
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(campaign.updatedAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSync(campaign.id)}
                              disabled={
                                isSyncing === campaign.id || !campaign.isActive
                              }
                              className="h-8 border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              {isSyncing === campaign.id ? (
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              ) : (
                                <RefreshCw className="mr-2 h-3 w-3" />
                              )}
                              Sync
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(campaign)}
                              className="h-8 text-gray-600"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCampaignToDelete(campaign)}
                              className="h-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="flex gap-4 rounded-xl border border-blue-100 bg-blue-50/50 p-6">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="mb-2 font-bold leading-none text-blue-900">
              Automated Syncing
            </h4>
            <p className="text-sm leading-relaxed text-blue-700">
              By default, active campaigns are synced every 6 hours
              automatically via the system cron job. You can trigger a manual
              sync at any time using the &quot;Sync&quot; button in the table
              above.
            </p>
          </div>
        </div>
      </div>

      <CampaignForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchCampaigns}
        campaign={editingCampaign}
      />

      <AlertDialog
        open={!!campaignToDelete}
        onOpenChange={() => setCampaignToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the campaign &quot;
              {campaignToDelete?.name}&quot;. Individual users captured from
              this campaign will remain in the database but will no longer be
              synced.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthenticatedLayout>
  );
}
