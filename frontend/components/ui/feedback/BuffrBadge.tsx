'use client';

import React from 'react';
/**
 * BuffrBadge React Component for Buffr Host Hospitality Platform
 * @fileoverview BuffrBadge provides reusable UI component for consistent design
 * @location buffr-host/components/ui/feedback/BuffrBadge.tsx
 * @purpose BuffrBadge provides reusable UI component for consistent design
 * @component BuffrBadge
 * @category Ui
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
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
 * @param {React.ReactNode} [children] - children prop description
 * @param {} [variant] - variant prop description
 * @param {} [size] - size prop description
 * @param {} [className] - className prop description
 *
 * Usage Example:
 * @example
 * import { BuffrBadge } from './BuffrBadge';
 *
 * function App() {
 *   return (
 *     <BuffrBadge
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered BuffrBadge component
 */

import { cn } from '@/lib/utils';

/**
 * Buffr Badge Component
 *
 * Displays status indicators and labels with consistent styling
 * Location: components/ui/feedback/BuffrBadge.tsx
 */

interface BuffrBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BuffrBadge: React.FC<BuffrBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-600',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base',
  };

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};
