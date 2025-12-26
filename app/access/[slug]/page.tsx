'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2, Loader2, Lock, ChevronRight } from 'lucide-react';

interface CampaignInfo {
  id: string;
  name: string;
  description: string | null;
  activeVariant?: {
    id: string;
    title: string | null;
    description: string | null;
    buttonText: string | null;
  } | null;
}

export default function CampaignRequestPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [campaign, setCampaign] = useState<CampaignInfo | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch campaign info
  useEffect(() => {
    async function fetchCampaign() {
      try {
        const response = await fetch(`/api/campaigns?slug=${slug}`);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
          setCampaign(result.data[0]);
        } else {
          setError('Campaign not found');
        }
      } catch {
        setError('Failed to load campaign details');
      } finally {
        setIsFetching(false);
      }
    }
    fetchCampaign();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/access/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          campaignSlug: slug,
          variantId: campaign?.activeVariant?.id, // Send the variant ID for conversion tracking
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="font-medium text-slate-500">Preparing your access...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4">
        <Card className="w-full max-w-md overflow-hidden border-0 shadow-2xl duration-500 animate-in fade-in zoom-in-95">
          <div className="h-2 w-full bg-emerald-500"></div>
          <CardHeader className="px-8 pb-6 pt-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-200 bg-emerald-100 shadow-sm">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>
            <CardTitle className="text-3xl font-black leading-tight text-slate-900">
              Access Granted!
            </CardTitle>
            <CardDescription className="mt-3 text-lg font-medium text-slate-500">
              We&apos;ve sent a Google Drive invitation to{' '}
              <span className="font-bold text-blue-600">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-10">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-900">
                Next Steps:
              </p>
              <div className="space-y-4">
                {[
                  'Open your email inbox',
                  'Accept the Google Drive invitation',
                  `Access the "${campaign?.name}" folder`,
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                      {i + 1}
                    </div>
                    <span className="font-medium text-slate-600">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="h-12 w-full rounded-xl border-slate-200 font-bold text-slate-600 transition-all hover:text-slate-900"
            >
              Request for another email
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 selection:bg-blue-100">
      <Card className="w-full max-w-lg overflow-hidden rounded-[32px] border-0 shadow-2xl">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-10 text-white sm:px-8 sm:py-12">
          {/* Decor */}
          <div className="absolute right-0 top-0 h-48 w-48 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl sm:h-64 sm:w-64"></div>

          <div className="relative z-10 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md sm:px-4 sm:py-1.5 sm:text-xs">
              Instant Access
            </div>
            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              {campaign?.activeVariant?.title ||
                campaign?.name ||
                'Launch Access'}
            </h1>
            <p className="max-w-sm text-base font-medium text-blue-100 opacity-90 sm:text-lg">
              {campaign?.activeVariant?.description ||
                campaign?.description ||
                'Unlock exclusive resources and materials instantly.'}
            </p>
          </div>
        </div>

        <CardContent className="px-6 py-8 sm:px-8 sm:py-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-xs font-black uppercase tracking-widest text-slate-400"
              >
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="How should we address you?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 rounded-2xl border-slate-100 bg-slate-50 px-5 font-medium text-slate-900 transition-all focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-black uppercase tracking-widest text-slate-400"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Your primary Google email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-2xl border-slate-100 bg-slate-50 px-5 font-medium text-slate-900 transition-all focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="shake-in flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600 duration-300 animate-in">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100">
                  !
                </div>
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="group h-16 w-full rounded-2xl bg-slate-900 text-lg font-black text-white shadow-xl transition-all hover:scale-[1.02] hover:bg-slate-800 active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {campaign?.activeVariant?.buttonText || 'Unlock Access'}
                  <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </Button>

            <div className="flex items-center justify-center gap-3 pt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <Lock className="h-3 w-3" />
              <span>SSL SECURED & PRIVACY PROTECTED</span>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Footer info */}
      <div className="pointer-events-none fixed bottom-8 text-xs font-bold uppercase tracking-widest text-slate-400 opacity-50">
        Powered by Access Tracker Pulse
      </div>
    </div>
  );
}
