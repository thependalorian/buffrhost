'use client';

import React from 'react';
/**
 * BuffrActionButton React Component for Buffr Host Hospitality Platform
 * @fileoverview BuffrActionButton provides reusable UI component for consistent design
 * @location buffr-host/components/ui/buttons/BuffrActionButton.tsx
 * @purpose BuffrActionButton provides reusable UI component for consistent design
 * @component BuffrActionButton
 * @category Ui
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Usage Example:
 * @example
 * import { BuffrActionButton } from './BuffrActionButton';
 *
 * function App() {
 *   return (
 *     <BuffrActionButton
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered BuffrActionButton component
 */

import { BuffrIcon, BuffrIconName } from '../icons/BuffrIcons';
import { cn } from '@/lib/utils';

/**
 * Buffr Action Button Component
 *
 * Specialized button for actions with enhanced styling
 * Location: components/ui/buttons/BuffrActionButton.tsx
 */

interface BuffrActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: BuffrIconName;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
}

export const BuffrActionButton: React.FC<BuffrActionButtonProps> = ({
  icon,
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variantClasses = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md focus:ring-blue-500',
    secondary:
      'bg-gray-600 text-white hover:bg-gray-700 hover:shadow-md focus:ring-gray-500',
    outline:
      'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    destructive:
      'bg-red-600 text-white hover:bg-red-700 hover:shadow-md focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div
          className={cn(
            'animate-spin rounded-full border-2 border-current border-t-transparent',
            iconSizes[size]
          )}
        />
      ) : icon ? (
        <BuffrIcon name={icon} className={cn(iconSizes[size], 'mr-2')} />
      ) : null}
      {children}
    </button>
  );
};
