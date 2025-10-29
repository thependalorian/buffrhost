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
