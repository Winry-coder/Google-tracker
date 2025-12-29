'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Settings,
  Briefcase,
  Menu,
  LogOut,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Campaigns',
    href: '/campaigns',
    icon: Briefcase,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

interface AppNavigationProps {
  className?: string;
}

export function AppNavigation({ className }: AppNavigationProps) {
  const pathname = usePathname();

  const NavButtons = ({ vertical = false }: { vertical?: boolean }) => (
    <div className={`flex gap-2 ${vertical ? 'flex-col w-full' : 'flex-row'}`}>
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? 'default' : 'outline'}
              size={vertical ? 'lg' : 'sm'}
              className={
                vertical
                  ? 'h-12 w-full justify-start rounded-xl'
                  : 'rounded-lg'
              }
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        );
      })}
      <Button
        variant="ghost"
        size={vertical ? 'lg' : 'sm'}
        onClick={() => {
          import('next-auth/react').then((mod) => mod.signOut());
        }}
        className={`text-red-600 hover:bg-red-50 hover:text-red-700 ${
          vertical ? 'h-12 w-full justify-start rounded-xl' : 'rounded-lg'
        }`}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );

  return (
    <div className={className}>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-2">
        <NavButtons />
      </div>

      {/* Mobile Navigation */}
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
                Navigation
              </SheetTitle>
              <SheetDescription>
                Access all sections of your dashboard
              </SheetDescription>
            </SheetHeader>
            <NavButtons vertical />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}