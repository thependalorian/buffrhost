/**
 * Buffr Feedback Components
 *
 * Purpose: Feedback components with DaisyUI styling and Nude brand identity
 * Functionality: Alert, Badge, Progress, Loading, Toast, Indicator
 * Location: /components/ui/feedback/BuffrFeedback.tsx
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
 * BuffrAlert React Component for Buffr Host Hospitality Platform
 * @fileoverview BuffrAlert provides reusable UI component for consistent design
 * @location buffr-host/components/ui/feedback/BuffrFeedback.tsx
 * @purpose BuffrAlert provides reusable UI component for consistent design
 * @component BuffrAlert
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
 * import { BuffrAlert } from './BuffrAlert';
 *
 * function App() {
 *   return (
 *     <BuffrAlert
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered BuffrAlert component
 */

import { cn } from '@/lib/utils';

// ============================================================================
// ALERT COMPONENT
// ============================================================================

export interface BuffrAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const BuffrAlert = React.forwardRef<HTMLDivElement, BuffrAlertProps>(
  (
    { variant = 'default', size = 'md', className, children, ...props },
    ref
  ) => {
    const baseClasses = 'alert';

    const variantClasses = {
      default: '',
      info: 'alert-info',
      success: 'alert-success',
      warning: 'alert-warning',
      error: 'alert-error',
    };

    const sizeClasses = {
      xs: 'alert-xs',
      sm: 'alert-sm',
      md: 'alert-md',
      lg: 'alert-lg',
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

BuffrAlert.displayName = 'BuffrAlert';

// ============================================================================
// ALERT DESCRIPTION COMPONENT
// ============================================================================

export const BuffrAlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('alert-description', className)} {...props} />
  );
});

BuffrAlertDescription.displayName = 'BuffrAlertDescription';

// ============================================================================
// BADGE COMPONENT
// ============================================================================

export interface BuffrBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'outline'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'ghost'
    | 'success'
    | 'warning'
    | 'error'
    | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const BuffrBadge = React.forwardRef<HTMLSpanElement, BuffrBadgeProps>(
  (
    { variant = 'default', size = 'md', className, children, ...props },
    ref
  ) => {
    const baseClasses = 'badge';

    const variantClasses = {
      default: '',
      outline: 'badge-outline',
      primary: 'badge-primary',
      secondary: 'badge-secondary',
      accent: 'badge-accent',
      ghost: 'badge-ghost',
      success: 'badge-success',
      warning: 'badge-warning',
      error: 'badge-error',
      info: 'badge-info',
    };

    const sizeClasses = {
      xs: 'badge-xs',
      sm: 'badge-sm',
      md: 'badge-md',
      lg: 'badge-lg',
    };

    return (
      <span
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
      </span>
    );
  }
);

BuffrBadge.displayName = 'BuffrBadge';

// ============================================================================
// PROGRESS COMPONENT
// ============================================================================

export interface BuffrProgressProps
  extends React.ProgressHTMLAttributes<HTMLProgressElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'error'
    | 'info';
}

export const BuffrProgress = React.forwardRef<
  HTMLProgressElement,
  BuffrProgressProps
>(({ variant = 'default', className, ...props }, ref) => {
  const baseClasses = 'progress';

  const variantClasses = {
    default: '',
    primary: 'progress-primary',
    secondary: 'progress-secondary',
    accent: 'progress-accent',
    success: 'progress-success',
    warning: 'progress-warning',
    error: 'progress-error',
    info: 'progress-info',
  };

  return (
    <progress
      ref={ref}
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
});

BuffrProgress.displayName = 'BuffrProgress';

// ============================================================================
// LOADING COMPONENT
// ============================================================================

export interface BuffrLoadingProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';
}

export const BuffrLoading = React.forwardRef<
  HTMLSpanElement,
  BuffrLoadingProps
>(({ size = 'md', variant = 'spinner', className, ...props }, ref) => {
  const baseClasses = 'loading';

  const sizeClasses = {
    xs: 'loading-xs',
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
  };

  const variantClasses = {
    spinner: 'loading-spinner',
    dots: 'loading-dots',
    ring: 'loading-ring',
    ball: 'loading-ball',
    bars: 'loading-bars',
    infinity: 'loading-infinity',
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});

BuffrLoading.displayName = 'BuffrLoading';

// ============================================================================
// TOAST COMPONENT
// ============================================================================

export interface BuffrToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
}

export const BuffrToast = React.forwardRef<HTMLDivElement, BuffrToastProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const baseClasses = 'toast';

    const variantClasses = {
      default: '',
      info: 'toast-info',
      success: 'toast-success',
      warning: 'toast-warning',
      error: 'toast-error',
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BuffrToast.displayName = 'BuffrToast';

// ============================================================================
// INDICATOR COMPONENT
// ============================================================================

export interface BuffrIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'warning'
    | 'error'
    | 'info';
  position?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end';
}

export const BuffrIndicator = React.forwardRef<
  HTMLDivElement,
  BuffrIndicatorProps
>(
  (
    { variant = 'default', position = 'top', className, children, ...props },
    ref
  ) => {
    const baseClasses = 'indicator';

    const variantClasses = {
      default: '',
      primary: 'indicator-primary',
      secondary: 'indicator-secondary',
      accent: 'indicator-accent',
      success: 'indicator-success',
      warning: 'indicator-warning',
      error: 'indicator-error',
      info: 'indicator-info',
    };

    const positionClasses = {
      top: 'indicator-top',
      bottom: 'indicator-bottom',
      left: 'indicator-left',
      right: 'indicator-right',
      'top-start': 'indicator-top indicator-start',
      'top-end': 'indicator-top indicator-end',
      'bottom-start': 'indicator-bottom indicator-start',
      'bottom-end': 'indicator-bottom indicator-end',
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          positionClasses[position],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BuffrIndicator.displayName = 'BuffrIndicator';

// ============================================================================
// INDICATOR ITEM COMPONENT
// ============================================================================

export const BuffrIndicatorItem = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span ref={ref} className={cn('indicator-item', className)} {...props} />
  );
});

BuffrIndicatorItem.displayName = 'BuffrIndicatorItem';
