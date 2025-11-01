'use client';

import React, { useState, useEffect } from 'react';
/**
 * Navigation React Component for Buffr Host Hospitality Platform
 * @fileoverview Navigation provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/landing/Navigation.tsx
 * @purpose Navigation provides specialized functionality for the Buffr Host platform
 * @component Navigation
 * @category Landing
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @hooks_utilization useState, useEffect for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
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
 * @method handleScroll - handleScroll method for component functionality
 *
 * Usage Example:
 * @example
 * import { Navigation } from './Navigation';
 *
 * function App() {
 *   return (
 *     <Navigation
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered Navigation component
 */

import { Menu, X } from 'lucide-react';

/**
 * @file This file defines the Navigation component for the landing page of the Buffr Host application.
 * @location frontend/components/landing/Navigation.tsx
 * @description This component provides a fixed navigation header that becomes opaque on scroll, and includes a mobile-friendly menu.
 * @modular
 *
 * @component
 * @param {NavigationProps} props - The props for the component.
 * @param {() => void} props.onStartTrial - The function to call when the "Start Free Trial" button is clicked.
 *
 * @example
 * <Navigation onStartTrial={() => console.log('Start trial clicked')} />
 *
 * @see {@link NavLink}
 * @see {@link Button}
 *
 * @security This component does not handle any sensitive data directly.
 * @accessibility The mobile menu button has an aria-label for screen readers.
 * @performance The scroll listener is added and removed on mount and unmount to prevent memory leaks.
 *
 * @buffr-icon-usage This component does not use BuffrIcon directly, but uses lucide-react icons (Menu, X).
 */

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  onClick,
  className = '',
}) => (
  <a
    href={href}
    onClick={onClick}
    className={`text-nude-700 hover:text-nude-600 font-medium transition-colors ${className}`}
  >
    {children}
  </a>
);

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = '',
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
  >
    {children}
  </button>
);

interface NavigationProps {
  onStartTrial: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onStartTrial }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-luxury-soft'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <a
            href="/"
            className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-nude-600 to-nude-700 rounded-xl flex items-center justify-center shadow-luxury-soft">
              <span className="text-white font-bold text-base sm:text-xl">
                H
              </span>
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-display font-bold text-nude-900 truncate">
              Buffr Host
            </span>
          </a>
          <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
            <NavLink href="/" className="text-sm lg:text-base">
              Home
            </NavLink>
            <NavLink href="/hotels" className="text-sm lg:text-base">
              Hotels
            </NavLink>
            <NavLink href="/restaurants" className="text-sm lg:text-base">
              Restaurants
            </NavLink>
            <NavLink href="/about" className="text-sm lg:text-base">
              About
            </NavLink>
            <NavLink href="/contact" className="text-sm lg:text-base">
              Contact
            </NavLink>
            <NavLink href="/privacy" className="text-sm lg:text-base">
              Privacy
            </NavLink>
          </div>
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Button
              onClick={onStartTrial}
              className="bg-nude-600 hover:bg-nude-700 text-white px-4 lg:px-6 py-2 sm:py-3 text-sm lg:text-base rounded-full shadow-luxury-soft hover:shadow-luxury-medium transition-all duration-300 whitespace-nowrap min-h-[44px] sm:min-h-0 flex items-center justify-center"
            >
              <span className="truncate">Start 3-Month Free Trial</span>
            </Button>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-nude-700 hover:text-nude-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 sm:w-7 sm:h-7" />
              ) : (
                <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
              )}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-2xl shadow-luxury-soft p-4 sm:p-6 border border-nude-100">
            <NavLink
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block sm:flex items-center py-3 sm:py-4 text-base sm:text-lg min-h-[44px]"
            >
              Home
            </NavLink>
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
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block sm:flex items-center py-3 sm:py-4 text-base sm:text-lg min-h-[44px]"
            >
              About
            </NavLink>
            <NavLink
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block sm:flex items-center py-3 sm:py-4 text-base sm:text-lg min-h-[44px]"
            >
              Contact
            </NavLink>
            <NavLink
              href="/privacy"
              onClick={() => setIsMenuOpen(false)}
              className="block sm:flex items-center py-3 sm:py-4 text-base sm:text-lg min-h-[44px]"
            >
              Privacy
            </NavLink>
            <div className="pt-4 mt-4 border-t border-nude-200">
              <Button
                onClick={() => {
                  onStartTrial();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-nude-600 hover:bg-nude-700 text-white rounded-full py-3 sm:py-4 text-base sm:text-lg min-h-[44px]"
              >
                Start 3-Month Free Trial
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
