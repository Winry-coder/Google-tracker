'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Bell, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';

interface DiscordSettingsResponse {
  success?: boolean;
  error?: string;
  data?: {
    id: string;
    email: string;
    discordWebhookUrl: string | null;
    discordNotificationsEnabled: boolean;
  };
}

export default function SettingsPage() {
  const { status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [webhookUrl, setWebhookUrl] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }

    if (status === 'authenticated') {
      const fetchSettings = async () => {
        try {
          const res = await fetch('/api/users/me/notifications/discord');
          const json: DiscordSettingsResponse = await res.json();

          if (!res.ok || !json.success || !json.data) {
            throw new Error(json.error || 'Failed to load Discord settings');
          }

          setWebhookUrl(json.data.discordWebhookUrl || '');
          setEnabled(json.data.discordNotificationsEnabled ?? false);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
          toast({
            variant: 'destructive',
            title: 'Failed to load settings',
            description:
              error instanceof Error
                ? error.message
                : 'Could not load Discord notification settings.',
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchSettings();
    }
  }, [status, router, toast]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/users/me/notifications/discord', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: webhookUrl.trim(),
          enabled,
        }),
      });

      const json: DiscordSettingsResponse = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save Discord settings');
      }

      toast({
        title: 'Discord settings saved',
        description: 'Your Discord notification settings have been updated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to save settings',
        description:
          error instanceof Error
            ? error.message
            : 'Could not save Discord notification settings.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async () => {
    setIsTesting(true);

    try {
      const res = await fetch('/api/users/me/notifications/discord/test', {
        method: 'POST',
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to send test notification');
      }

      toast({
        title: 'Test notification sent',
        description: 'Check your Discord channel to confirm it arrived.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Test notification failed',
        description:
          error instanceof Error
            ? error.message
            : 'Could not send test Discord notification.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <AuthenticatedLayout
      title="Notification Settings"
      description="Configure your notification preferences and integrations."
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Notification Settings
            </h1>
            <p className="text-sm text-slate-500">
              Connect a personal Discord webhook to get instant alerts when new
              leads are created.
            </p>
          </div>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Discord Alerts</CardTitle>
            <CardDescription>
              Paste a Discord webhook URL from your own server to receive
              notifications in a private channel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="discord-webhook">Discord Webhook URL</Label>
                <Input
                  id="discord-webhook"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  In Discord: Server Settings → Integrations → Webhooks → New
                  Webhook → Copy URL.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Enable Discord notifications
                  </p>
                  <p className="text-xs text-slate-500">
                    When enabled, new leads will trigger a message to this
                    webhook.
                  </p>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={setEnabled}
                  disabled={!webhookUrl.trim()}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="min-w-[120px]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isTesting}
                  onClick={handleTestNotification}
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Test...
                    </>
                  ) : (
                    'Send Test Notification'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
