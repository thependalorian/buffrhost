'use client';
/**
 * Main Navigation Component
 *
 * Reusable navigation component for the Buffr Host platform
 * Features: Responsive design, proper Next.js routing, brand identity
 * Location: components/layout/MainNavigation.tsx
 */

import React, { useState } from 'react';
import { BuffrIcon, BuffrButton } from '@/components/ui';
import Link from 'next/link';
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const NavLink = ({
  href,
  children,
  onClick = () => {},
  className = '',
}: NavLinkProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={`text-nude-700 hover:text-nude-600 transition-colors duration-300 duration-300 font-medium ${className}`}
  >
    {children}
  </Link>
);

interface MainNavigationProps {
  showAuthButtons?: boolean;
  onAuthClick?: () => void;
}

export default function MainNavigation({
  showAuthButtons = true,
  onAuthClick,
}: MainNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-nude-600 to-nude-700 rounded-xl flex items-center justify-center shadow-2xl-luxury-soft">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <span className="text-2xl font-display font-bold text-nude-900">
            Buffr Host
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          <NavLink href="/hotels">Hotels</NavLink>
          <NavLink href="/restaurants">Restaurants</NavLink>
          <NavLink href="/#features">Features</NavLink>
          <NavLink href="/#pricing">Pricing</NavLink>
        </div>

        {/* Desktop Auth Buttons */}
        {showAuthButtons && (
          <div className="hidden md:flex items-center space-x-4">
            <BuffrButton onClick={onAuthClick} className="btn-ios-primary">
              Start Free Trial
            </BuffrButton>
          </div>
        )}

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 card text-nude-700 hover:bg-nude-100 transition-colors duration-300 duration-300"
          >
            {isMenuOpen ? (
              <BuffrIcon name="x" className="w-6 h-6" />
            ) : (
              <BuffrIcon name="menu" className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-nude-50 rounded-2xl shadow-2xl-luxury-soft card-body border border-nude-100">
          <NavLink
            href="/hotels"
            onClick={() => setIsMenuOpen(false)}
            className="block py-3 text-lg"
          >
            Hotels
          </NavLink>
          <NavLink
            href="/restaurants"
            onClick={() => setIsMenuOpen(false)}
            className="block py-3 text-lg"
          >
            Restaurants
          </NavLink>
          <NavLink
            href="/#features"
            onClick={() => setIsMenuOpen(false)}
            className="block py-3 text-lg"
          >
            Features
          </NavLink>
          <NavLink
            href="/#pricing"
            onClick={() => setIsMenuOpen(false)}
            className="block py-3 text-lg"
          >
            Pricing
          </NavLink>

          {showAuthButtons && (
            <div className="pt-4 mt-4 border-t border-nude-200">
              <BuffrButton
                onClick={() => {
                  onAuthClick?.();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-nude-600 hover:bg-nude-700 text-white"
              >
                Start Free Trial
              </BuffrButton>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
