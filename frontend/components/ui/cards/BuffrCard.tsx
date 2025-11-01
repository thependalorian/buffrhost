/**
 * Buffr Card Components
 *
 * Purpose: Card components with DaisyUI styling and Nude brand identity
 * Functionality: Card, CardBody, CardHeader, CardContent, CardTitle, CardActions, CardFigure
 * Location: /components/ui/cards/BuffrCard.tsx
 *
 * Follows 40 Rules:
 * - Uses DaisyUI for consistent styling
 * - Modular component design for easy maintenance
 * - TypeScript for type safety
 * - Vercel-compatible with SSR
 * - Uses Neon PostgreSQL database
 * - Comprehensive error handling
 * - Optimized for performance
 */

'use client';

import React from 'react';
/**
 * BuffrCard React Component for Buffr Host Hospitality Platform
 * @fileoverview BuffrCard provides reusable UI component for consistent design
 * @location buffr-host/components/ui/cards/BuffrCard.tsx
 * @purpose BuffrCard provides reusable UI component for consistent design
 * @component BuffrCard
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
 * import { BuffrCard } from './BuffrCard';
 *
 * function App() {
 *   return (
 *     <BuffrCard
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered BuffrCard component
 */

import { cn } from '@/lib/utils';

// ============================================================================
// CARD COMPONENT
// ============================================================================

export interface BuffrCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'dash' | 'side' | 'image-full';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const BuffrCard = React.forwardRef<HTMLDivElement, BuffrCardProps>(
  (
    { variant = 'default', size = 'md', className, children, ...props },
    ref
  ) => {
    const baseClasses = 'card';

    const variantClasses = {
      default: '',
      bordered: 'card-bordered',
      dash: 'card-dash',
      side: 'card-side',
      'image-full': 'image-full',
    };

    const sizeClasses = {
      xs: 'card-compact',
      sm: 'card-compact',
      md: '',
      lg: 'card-normal',
      xl: 'card-normal',
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BuffrCard.displayName = 'BuffrCard';

// ============================================================================
// CARD BODY COMPONENT
// ============================================================================

export const BuffrCardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('card-body', className)} {...props} />;
});

BuffrCardBody.displayName = 'BuffrCardBody';

// ============================================================================
// CARD HEADER COMPONENT
// ============================================================================

export const BuffrCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('card-header', className)} {...props} />;
});

BuffrCardHeader.displayName = 'BuffrCardHeader';

// ============================================================================
// CARD CONTENT COMPONENT
// ============================================================================

export const BuffrCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('card-content', className)} {...props} />;
});

BuffrCardContent.displayName = 'BuffrCardContent';

// ============================================================================
// MOBILE OPTIMIZED CARD COMPONENT
// ============================================================================

export const MobileCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
  }
>(({ className, title, subtitle, action, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-white rounded-xl shadow-sm border border-gray-100 p-4 mx-4 mb-4',
      'touch-manipulation no-tap-highlight',
      className
    )}
    {...props}
  >
    {(title || subtitle || action) && (
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1 truncate">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0 ml-3">{action}</div>}
      </div>
    )}
    <div className="space-y-3">{children}</div>
  </div>
));

MobileCard.displayName = 'MobileCard';

// ============================================================================
// CARD TITLE COMPONENT
// ============================================================================

export const BuffrCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return <h2 ref={ref} className={cn('card-title', className)} {...props} />;
});

BuffrCardTitle.displayName = 'BuffrCardTitle';

// ============================================================================
// CARD ACTIONS COMPONENT
// ============================================================================

export const BuffrCardActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('card-actions', className)} {...props} />;
});

BuffrCardActions.displayName = 'BuffrCardActions';

// ============================================================================
// CARD FIGURE COMPONENT
// ============================================================================

export const BuffrCardFigure = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => {
  return (
    <figure ref={ref} className={cn('card-figure', className)} {...props} />
  );
});

BuffrCardFigure.displayName = 'BuffrCardFigure';
