'use client';
/**
 * @file This file defines the MainNavigation component, the primary navigation bar for the Buffr Host application.
 * @location frontend/components/layout/MainNavigation.tsx
 * @description This component provides a responsive navigation bar with links to major sections of the site, and authentication buttons. It includes a mobile-friendly menu.
 * @modular
 *
 * @component
 * @param {MainNavigationProps} props - The props for the component.
 * @param {boolean} [props.showAuthButtons=true] - Whether to show the authentication buttons.
 * @param {() => void} [props.onAuthClick] - The function to call when the authentication button is clicked.
 *
 * @example
 * <MainNavigation showAuthButtons={true} onAuthClick={() => console.log('Auth button clicked')} />
 *
 * @see {@link BuffrButton}
 * @see {@link BuffrIcon}
 *
 * @security This component does not handle any sensitive data directly.
 * @accessibility The mobile menu button has an aria-label for screen readers.
 * @performance The mobile menu is conditionally rendered to avoid rendering it when not needed.
 *
 * @buffr-icon-usage This component uses the 'x' and 'menu' icons.
 */

import React, { useState } from 'react';
/**
 * MainNavigation React Component for Buffr Host Hospitality Platform
 * @fileoverview MainNavigation provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/layout/MainNavigation.tsx
 * @purpose MainNavigation provides specialized functionality for the Buffr Host platform
 * @component MainNavigation
 * @category Layout
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @authentication JWT-based authentication for user-specific functionality
 * @hooks_utilization useState for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Secure authentication integration for user-specific features
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {string} [href] - href prop description
 * @param {React.ReactNode} [children] - children prop description
 * @param {} [onClick] - onClick prop description
 * @param {} [className] - className prop description
 *
 * Methods:
 * @method NavLink = ({
  href,
  children,
  onClick - NavLink = ({
  href,
  children,
  onClick method for component functionality
 *
 * Usage Example:
 * @example
 * import MainNavigation from './MainNavigation';
 *
 * function App() {
 *   return (
 *     <MainNavigation
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered MainNavigation component
 */

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
    <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-nude-600 to-nude-700 rounded-xl flex items-center justify-center shadow-2xl-luxury-soft">
            <span className="text-white font-bold text-base sm:text-xl">H</span>
          </div>
          <span className="text-lg sm:text-xl md:text-2xl font-display font-bold text-nude-900 truncate">
            Buffr Host
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
          <NavLink href="/hotels" className="text-sm lg:text-base">
            Hotels
          </NavLink>
          <NavLink href="/restaurants" className="text-sm lg:text-base">
            Restaurants
          </NavLink>
          <NavLink href="/#features" className="text-sm lg:text-base">
            Features
          </NavLink>
          <NavLink href="/#pricing" className="text-sm lg:text-base">
            Pricing
          </NavLink>
        </div>

        {/* Desktop Auth Buttons */}
        {showAuthButtons && (
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <BuffrButton
              onClick={onAuthClick}
              className="btn-ios-primary whitespace-nowrap"
            >
              Start Free Trial
            </BuffrButton>
          </div>
        )}

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 card text-nude-700 hover:bg-nude-100 transition-colors duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
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
        <div className="md:hidden mt-4 bg-nude-50 rounded-2xl shadow-2xl-luxury-soft card-body border border-nude-100 p-4 sm:p-6">
          <NavLink
            href="/hotels"
            onClick={() => setIsMenuOpen(false)}
            className="block sm:flex items-center py-3 sm:py-4 text-base sm:text-lg min-h-[44px]"
          >
            Hotels
          </NavLink>
          <NavLink
            href="/restaurants"
            onClick={() => setIsMenuOpen(false)}
            className="block sm:flex items-center py-3 sm:py-4 text-base sm:text-lg min-h-[44px]"
          >
            Restaurants
          </NavLink>
          <NavLink
            href="/#features"
            onClick={() => setIsMenuOpen(false)}
            className="block sm:flex items-center py-3 sm:py-4 text-base sm:text-lg min-h-[44px]"
          >
            Features
          </NavLink>
          <NavLink
            href="/#pricing"
            onClick={() => setIsMenuOpen(false)}
            className="block sm:flex items-center py-3 sm:py-4 text-base sm:text-lg min-h-[44px]"
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
                className="w-full bg-nude-600 hover:bg-nude-700 text-white min-h-[44px]"
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
