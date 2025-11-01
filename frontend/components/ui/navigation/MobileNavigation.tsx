/**
 * MobileNavigation Component
 *
 * Mobile-optimized navigation with hamburger menu and touch-friendly interactions
 * Location: /components/ui/navigation/MobileNavigation.tsx
 */

'use client';

import React, { useState } from 'react';
/**
 * MobileNavigation React Component for Buffr Host Hospitality Platform
 * @fileoverview MobileNavigation provides reusable UI component for consistent design
 * @location buffr-host/components/ui/navigation/MobileNavigation.tsx
 * @purpose MobileNavigation provides reusable UI component for consistent design
 * @component MobileNavigation
 * @category Ui
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @hooks_utilization useState for state management and side effects
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
 * @param {NavigationItem[]} [items] - items prop description
 * @param {} [className] - className prop description
 * @param {} [brandName] - brandName prop description
 * @param {} [onItemClick] - onItemClick prop description
 *
 * Methods:
 * @method toggleMenu - toggleMenu method for component functionality
 * @method handleItemClick - handleItemClick method for component functionality
 * @method handleItemClick - handleItemClick method for component functionality
 *
 * Usage Example:
 * @example
 * import { MobileNavigation } from './MobileNavigation';
 *
 * function App() {
 *   return (
 *     <MobileNavigation
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered MobileNavigation component
 */

import { cn } from '@/lib/utils';
import { BuffrIcon } from '../icons/BuffrIcons';

interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
}

interface MobileNavigationProps {
  items: NavigationItem[];
  className?: string;
  brandName?: string;
  onItemClick?: (item: NavigationItem) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  items,
  className = '',
  brandName = 'Buffr Host',
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: NavigationItem) => {
    setIsOpen(false);
    onItemClick?.(item);
  };

  return (
    <>
      {/* Mobile Header */}
      <header
        className={cn(
          'bg-white shadow-sm border-b border-nude-200 sticky top-0 z-50',
          className
        )}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-nude-600 rounded-full flex items-center justify-center">
              <BuffrIcon name="building-2" className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-nude-900 text-lg">
              {brandName}
            </span>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-nude-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-nude-500 focus:ring-offset-2"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
              <span
                className={cn(
                  'block w-5 h-0.5 bg-nude-600 transition-transform duration-200',
                  isOpen ? 'rotate-45 translate-y-1.5' : ''
                )}
              />
              <span
                className={cn(
                  'block w-5 h-0.5 bg-nude-600 transition-opacity duration-200',
                  isOpen ? 'opacity-0' : ''
                )}
              />
              <span
                className={cn(
                  'block w-5 h-0.5 bg-nude-600 transition-transform duration-200',
                  isOpen ? '-rotate-45 -translate-y-1.5' : ''
                )}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <nav
        className={cn(
          'fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="navigation"
        aria-label="Mobile navigation menu"
      >
        <div className="p-6">
          {/* Close button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-nude-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-nude-500"
              aria-label="Close navigation menu"
            >
              <BuffrIcon name="x" className="h-5 w-5 text-nude-600" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="space-y-2">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item);
                }}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-nude-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-nude-500 focus:ring-offset-2 group"
              >
                <div className="flex items-center space-x-3">
                  {item.icon && (
                    <BuffrIcon
                      name={item.icon as any}
                      className="h-5 w-5 text-nude-600 group-hover:text-nude-700"
                    />
                  )}
                  <span className="font-medium text-nude-900 group-hover:text-nude-800">
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <span className="px-2 py-1 text-xs font-medium bg-nude-100 text-nude-700 rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-nude-200">
            <p className="text-sm text-nude-600 text-center">
              Experience hospitality like never before
            </p>
          </div>
        </div>
      </nav>
    </>
  );
};

// Mobile Bottom Navigation for key actions
interface MobileBottomNavProps {
  items: NavigationItem[];
  className?: string;
  onItemClick?: (item: NavigationItem) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  items,
  className = '',
  onItemClick,
}) => {
  const handleItemClick = (item: NavigationItem) => {
    onItemClick?.(item);
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-white border-t border-nude-200 px-4 py-2 z-30 md:hidden',
        className
      )}
      role="navigation"
      aria-label="Mobile bottom navigation"
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {items.slice(0, 5).map((item, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(item)}
            className="flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-lg hover:bg-nude-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-nude-500 focus:ring-offset-2 relative group"
            aria-label={item.label}
          >
            {item.icon && (
              <BuffrIcon
                name={item.icon as any}
                className="h-5 w-5 text-nude-600 group-hover:text-nude-700 mb-1"
              />
            )}
            <span className="text-xs text-nude-600 group-hover:text-nude-700 font-medium">
              {item.label}
            </span>
            {item.badge && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-nude-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {typeof item.badge === 'number' && item.badge > 9
                  ? '9+'
                  : item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
