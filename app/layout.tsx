import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';

import { AuthProvider } from '@/components/providers/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Drive Sync Dashboard',
  description: 'Google Drive Access Sync Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            <div className="flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
              <footer className="border-t bg-white/90 py-4 text-xs text-slate-500">
                <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 sm:flex-row">
                  <span className="text-[11px] font-medium">
                    &copy; {new Date().getFullYear()} Access Tracker Pulse. All rights reserved.
                  </span>
                  <nav className="flex flex-wrap items-center gap-4 text-[11px] font-semibold uppercase tracking-wide">
                    <Link
                      href="/help"
                      className="text-slate-500 hover:text-slate-900"
                    >
                      Help
                    </Link>
                    <Link
                      href="/privacy"
                      className="text-slate-500 hover:text-slate-900"
                    >
                      Privacy
                    </Link>
                    <Link
                      href="/terms"
                      className="text-slate-500 hover:text-slate-900"
                    >
                      Terms
                    </Link>
                  </nav>
                </div>
              </footer>
            </div>
            <Toaster />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
