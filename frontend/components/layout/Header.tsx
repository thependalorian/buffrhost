'use client';
import Link from 'next/link';
import React, { Suspense } from 'react';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavItem = {
  id: string;
  label: string;
  url: string;
};

type Props = {
  navItems?: NavItem[];
};

export function Header({ navItems = [] }: Props) {
  const pathname = usePathname();

  return (
    <div className="relative z-20 border-b border-nude-200 bg-gradient-to-br from-nude-50 to-nude-100 shadow-nude-soft transition-all duration-300">
      <nav className="flex items-center md:items-end justify-between container pt-2">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>{/* Mobile menu would go here */}</Suspense>
        </div>
        <div className="flex w-full items-end justify-between">
          <div className="flex w-full items-end gap-6 md:w-1/3">
            <Link
              className="flex w-full items-center justify-center pt-4 pb-4 md:w-auto hover:opacity-80 transition-opacity duration-300"
              href="/"
              data-emotional-impact="Welcoming, professional, trustworthy"
            >
              <LogoIcon className="w-6 h-auto" />
            </Link>
            {navItems.length ? (
              <ul className="hidden gap-4 text-sm md:flex md:items-center">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.url}
                      className={cn(
                        'relative navLink text-nude-700 hover:text-nude-900 transition-colors duration-300',
                        {
                          'text-nude-900 font-medium':
                            item.url && item.url !== '/'
                              ? pathname.includes(item.url)
                              : false,
                        }
                      )}
                      data-emotional-impact="Clear, helpful, professional"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="flex justify-end md:w-1/3 gap-4">
            {/* Cart or user menu would go here */}
          </div>
        </div>
      </nav>
    </div>
  );
}
