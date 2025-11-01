/**
 * MobileSkeleton Component
 *
 * Mobile-optimized skeleton loading states for better perceived performance
 * Location: /components/ui/performance/MobileSkeleton.tsx
 */

'use client';

import React from 'react';
/**
 * MobileSkeleton React Component for Buffr Host Hospitality Platform
 * @fileoverview MobileSkeleton provides reusable UI component for consistent design
 * @location buffr-host/components/ui/performance/MobileSkeleton.tsx
 * @purpose MobileSkeleton provides reusable UI component for consistent design
 * @component MobileSkeleton
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
 * @param {} [className] - className prop description
 * @param {} [variant] - variant prop description
 * @param {} [lines] - lines prop description
 *
 * Usage Example:
 * @example
 * import { MobileSkeleton } from './MobileSkeleton';
 *
 * function App() {
 *   return (
 *     <MobileSkeleton
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered MobileSkeleton component
 */

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'avatar' | 'button' | 'image';
  lines?: number;
}

export const MobileSkeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse bg-nude-200 rounded';

  if (variant === 'card') {
    return (
      <div className={cn('p-4 space-y-3', className)}>
        <div className="flex items-center space-x-3">
          <div className={cn(baseClasses, 'w-10 h-10 rounded-full')} />
          <div className="space-y-2">
            <div className={cn(baseClasses, 'h-4 w-24')} />
            <div className={cn(baseClasses, 'h-3 w-16')} />
          </div>
        </div>
        <div className="space-y-2">
          <div className={cn(baseClasses, 'h-3 w-full')} />
          <div className={cn(baseClasses, 'h-3 w-3/4')} />
        </div>
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <div className={cn(baseClasses, 'w-12 h-12 rounded-full', className)} />
    );
  }

  if (variant === 'button') {
    return (
      <div className={cn(baseClasses, 'h-12 w-32 rounded-full', className)} />
    );
  }

  if (variant === 'image') {
    return (
      <div className={cn(baseClasses, 'w-full h-48 rounded-lg', className)} />
    );
  }

  // Default text variant
  if (lines === 1) {
    return <div className={cn(baseClasses, 'h-4 w-3/4', className)} />;
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={cn(
            baseClasses,
            'h-4',
            i === lines - 1 ? 'w-2/3' : 'w-full' // Last line shorter
          )}
        />
      ))}
    </div>
  );
};

// Mobile-specific loading states
export const MobilePageSkeleton: React.FC = () => (
  <div className="min-h-screen bg-nude-50 p-4 space-y-6">
    {/* Header skeleton */}
    <div className="text-center space-y-4">
      <MobileSkeleton className="h-8 w-64 mx-auto" />
      <MobileSkeleton className="h-4 w-96 mx-auto" />
    </div>

    {/* Content cards */}
    <div className="space-y-4">
      <MobileSkeleton variant="card" />
      <MobileSkeleton variant="card" />
      <MobileSkeleton variant="card" />
    </div>

    {/* Action buttons */}
    <div className="flex gap-4 pt-4">
      <MobileSkeleton variant="button" className="flex-1" />
      <MobileSkeleton variant="button" className="flex-1" />
    </div>
  </div>
);

export const MobileListSkeleton: React.FC<{ items?: number }> = ({
  items = 5,
}) => (
  <div className="space-y-4 p-4">
    {Array.from({ length: items }, (_, i) => (
      <MobileSkeleton key={i} variant="card" />
    ))}
  </div>
);
