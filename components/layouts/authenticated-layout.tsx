'use client';

import { AppNavigation } from '@/components/navigation/app-navigation';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AuthenticatedLayout({
  children,
  title = 'Dashboard',
  description,
}: AuthenticatedLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-white">
        <div className="container mx-auto px-4 py-3 sm:py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-black tracking-tight sm:text-2xl">
                {title}
              </h1>
              {description && (
                <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-wide text-gray-400 text-muted-foreground sm:text-xs">
                  {description}
                </p>
              )}
            </div>

            <AppNavigation />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}