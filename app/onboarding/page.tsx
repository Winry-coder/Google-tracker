'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Folder, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [step] = useState(1);
  const [folderLink, setFolderLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Check if user already has campaigns
  useEffect(() => {
    if (status === 'authenticated') {
       fetch('/api/users/me')
         .then(res => res.json())
         .then(data => {
            if (data.hasCampaigns) {
                router.replace('/campaigns');
            }
         })
         // eslint-disable-next-line no-console
         .catch(console.error);
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
        </div>
    );
  }

  if (status === 'unauthenticated') {
    router.replace('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Extract ID from URL if provided
    let folderId = folderLink.trim();
    if (folderId.includes('drive.google.com')) {
        const match = folderId.match(/folders\/([-a-zA-Z0-9_]+)/);
        if (match && match[1]) {
            folderId = match[1];
        }
    }

    if (!folderId) {
        setError('Please enter a valid Folder ID or URL');
        setIsSubmitting(false);
        return;
    }

    try {
        // Create campaign
        // We assume POST /api/campaigns handles the creation. 
        // We'll generate a basic name derived from the user name or just "My First Campaign" if frontend doesn't ask for it.
        // Or we could ask for name in Step 2.
        // For now, let's keep it simple as per plan: just folder ID.
        
        const res = await fetch('/api/campaigns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: `${session?.user?.name || 'User'}'s Campaign`,
                slug: `campaign-${Date.now()}`, // Temporary slug
                folderId: folderId,
            })
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to create campaign');
        }

        router.refresh();
        router.push('/campaigns');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-lg space-y-8">
        
        <div className="text-center">
             <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
                <Folder className="h-6 w-6 text-white" />
             </div>
             <h2 className="text-3xl font-extrabold text-gray-900">
                Let&apos;s get you set up
             </h2>
             <p className="mt-2 text-gray-600">
                Connect your Google Drive folder to start tracking access.
             </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Step {step}: Connect Folder</CardTitle>
                <CardDescription>
                    Paste the link to the Google Drive folder you want to share.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <Label htmlFor="folder" className="text-base">Google Drive Folder Link</Label>
                        <Input 
                            id="folder"
                            placeholder="https://drive.google.com/drive/folders/..."
                            value={folderLink}
                            onChange={e => setFolderLink(e.target.value)}
                            required
                        />
                         <p className="text-xs text-muted-foreground">
                            Make sure you have &quot;Editor&quot; access to this folder.
                        </p>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                 <Button 
                    onClick={handleSubmit} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting || !folderLink}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        <>
                            Create Campaign <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>

      </div>
    </div>
  );
}
