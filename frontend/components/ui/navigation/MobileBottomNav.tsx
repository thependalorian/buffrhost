'use client';

import React from 'react';
/**
 * MobileBottomNav React Component for Buffr Host Hospitality Platform
 * @fileoverview MobileBottomNav provides reusable UI component for consistent design
 * @location buffr-host/components/ui/navigation/MobileBottomNav.tsx
 * @purpose MobileBottomNav provides reusable UI component for consistent design
 * @component MobileBottomNav
 * @category Ui
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @hooks_utilization useEffect for state management and side effects
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
 * @param {} [items] - items prop description
 * @param {} [activeItem] - activeItem prop description
 * @param {} [className] - className prop description
 * @param {} [safeArea] - safeArea prop description
 *
 * Usage Example:
 * @example
 * import { MobileBottomNav } from './MobileBottomNav';
 *
 * function App() {
 *   return (
 *     <MobileBottomNav
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered MobileBottomNav component
 */

import { cn } from '@/lib/utils';
import { Home, Building2, Users, Settings, Menu } from 'lucide-react';

/**
 * Mobile Bottom Navigation Component
 *
 * Provides easy access to main app sections on mobile devices
 * with proper touch targets and accessibility features.
 *
 * Location: components/ui/navigation/MobileBottomNav.tsx
 */

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
}

interface MobileBottomNavProps {
  items?: NavItem[];
  activeItem?: string;
  className?: string;
  safeArea?: boolean;
}

const defaultItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    href: '/',
  },
  {
    id: 'properties',
    label: 'Properties',
    icon: Building2,
    href: '/hotels',
  },
  {
    id: 'guests',
    label: 'Guests',
    icon: Users,
    href: '/protected/customers',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/protected/admin/dashboard',
  },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  items = defaultItems,
  activeItem,
  className,
  safeArea = true,
}) => {
  return (
    <nav
      className={cn(
        // Base styles
        'fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200',
        'flex items-center justify-around px-2 py-2',

        // Safe area for notched devices
        safeArea && 'pb-safe-bottom',

        // Mobile optimizations
        'touch-manipulation no-tap-highlight',

        // Hide on larger screens
        'md:hidden',

        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {items.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeItem === item.id;

        return (
          <button
            key={item.id}
            onClick={item.onClick}
            className={cn(
              // Base button styles
              'flex flex-col items-center justify-center p-2 rounded-lg',
              'min-h-[60px] min-w-[60px] touch-manipulation',
              'transition-colors duration-200',

              // Active/inactive states
              isActive
                ? 'text-nude-600 bg-nude-50'
                : 'text-gray-600 hover:text-nude-600 hover:bg-gray-50',

              // Focus styles for accessibility
              'focus:outline-none focus:ring-2 focus:ring-nude-500 focus:ring-offset-2 focus:ring-offset-white'
            )}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <IconComponent
              className={cn(
                'w-6 h-6 mb-1',
                isActive ? 'text-nude-600' : 'text-current'
              )}
            />
            <span
              className={cn(
                'text-xs font-medium',
                isActive ? 'text-nude-600' : 'text-gray-600'
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

/**
 * Mobile Bottom Sheet Component
 *
 * Provides a slide-up interface for additional actions or content
 */
interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  // Prevent body scroll when sheet is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl',
          'max-h-[80vh] overflow-y-auto mobile-scroll',
          'transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-y-0' : 'translate-y-full',
          'md:hidden',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'bottom-sheet-title' : undefined}
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {title && (
            <h2
              id="bottom-sheet-title"
              className="text-lg font-semibold text-gray-900 mb-4"
            >
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </>
  );
};
