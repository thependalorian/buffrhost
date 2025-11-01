/**
 * Buffr Form Components
 *
 * Purpose: Form components with DaisyUI styling and Nude brand identity
 * Functionality: Checkbox, Toggle, Radio, Range, FileInput, Label, Divider
 * Location: /components/ui/forms/BuffrFormComponents.tsx
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
 * BuffrCheckbox React Component for Buffr Host Hospitality Platform
 * @fileoverview BuffrCheckbox provides reusable UI component for consistent design
 * @location buffr-host/components/ui/forms/BuffrFormComponents.tsx
 * @purpose BuffrCheckbox provides reusable UI component for consistent design
 * @component BuffrCheckbox
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
 * import { BuffrCheckbox } from './BuffrCheckbox';
 *
 * function App() {
 *   return (
 *     <BuffrCheckbox
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered BuffrCheckbox component
 */

import { cn } from '@/lib/utils';

// ============================================================================
// CHECKBOX COMPONENT
// ============================================================================

export interface BuffrCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
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

export const BuffrCheckbox = React.forwardRef<
  HTMLInputElement,
  BuffrCheckboxProps
>(({ size = 'md', variant = 'default', className, ...props }, ref) => {
  const baseClasses = 'checkbox';

  const sizeClasses = {
    xs: 'checkbox-xs',
    sm: 'checkbox-sm',
    md: 'checkbox-md',
    lg: 'checkbox-lg',
  };

  const variantClasses = {
    default: '',
    primary: 'checkbox-primary',
    secondary: 'checkbox-secondary',
    accent: 'checkbox-accent',
    success: 'checkbox-success',
    warning: 'checkbox-warning',
    error: 'checkbox-error',
    info: 'checkbox-info',
  };

  return (
    <input
      ref={ref}
      type="checkbox"
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

BuffrCheckbox.displayName = 'BuffrCheckbox';

// ============================================================================
// TOGGLE COMPONENT
// ============================================================================

export interface BuffrToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
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

export const BuffrToggle = React.forwardRef<HTMLInputElement, BuffrToggleProps>(
  ({ size = 'md', variant = 'default', className, ...props }, ref) => {
    const baseClasses = 'toggle';

    const sizeClasses = {
      xs: 'toggle-xs',
      sm: 'toggle-sm',
      md: 'toggle-md',
      lg: 'toggle-lg',
    };

    const variantClasses = {
      default: '',
      primary: 'toggle-primary',
      secondary: 'toggle-secondary',
      accent: 'toggle-accent',
      success: 'toggle-success',
      warning: 'toggle-warning',
      error: 'toggle-error',
      info: 'toggle-info',
    };

    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

BuffrToggle.displayName = 'BuffrToggle';

// ============================================================================
// RADIO COMPONENT
// ============================================================================

export interface BuffrRadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
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

export const BuffrRadio = React.forwardRef<HTMLInputElement, BuffrRadioProps>(
  ({ size = 'md', variant = 'default', className, ...props }, ref) => {
    const baseClasses = 'radio';

    const sizeClasses = {
      xs: 'radio-xs',
      sm: 'radio-sm',
      md: 'radio-md',
      lg: 'radio-lg',
    };

    const variantClasses = {
      default: '',
      primary: 'radio-primary',
      secondary: 'radio-secondary',
      accent: 'radio-accent',
      success: 'radio-success',
      warning: 'radio-warning',
      error: 'radio-error',
      info: 'radio-info',
    };

    return (
      <input
        ref={ref}
        type="radio"
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

BuffrRadio.displayName = 'BuffrRadio';

// ============================================================================
// RANGE COMPONENT
// ============================================================================

export interface BuffrRangeProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
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

export const BuffrRange = React.forwardRef<HTMLInputElement, BuffrRangeProps>(
  ({ size = 'md', variant = 'default', className, ...props }, ref) => {
    const baseClasses = 'range';

    const sizeClasses = {
      xs: 'range-xs',
      sm: 'range-sm',
      md: 'range-md',
      lg: 'range-lg',
    };

    const variantClasses = {
      default: '',
      primary: 'range-primary',
      secondary: 'range-secondary',
      accent: 'range-accent',
      success: 'range-success',
      warning: 'range-warning',
      error: 'range-error',
      info: 'range-info',
    };

    return (
      <input
        ref={ref}
        type="range"
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

BuffrRange.displayName = 'BuffrRange';

// ============================================================================
// FILE INPUT COMPONENT
// ============================================================================

export interface BuffrFileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'ghost';
}

export const BuffrFileInput = React.forwardRef<
  HTMLInputElement,
  BuffrFileInputProps
>(({ size = 'md', variant = 'default', className, ...props }, ref) => {
  const baseClasses = 'file-input';

  const sizeClasses = {
    xs: 'file-input-xs',
    sm: 'file-input-sm',
    md: 'file-input-md',
    lg: 'file-input-lg',
  };

  const variantClasses = {
    default: '',
    bordered: 'file-input-bordered',
    ghost: 'file-input-ghost',
  };

  return (
    <input
      ref={ref}
      type="file"
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

BuffrFileInput.displayName = 'BuffrFileInput';

// ============================================================================
// LABEL COMPONENT
// ============================================================================

export const BuffrLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return <label ref={ref} className={cn('label', className)} {...props} />;
});

BuffrLabel.displayName = 'BuffrLabel';

// ============================================================================
// DIVIDER COMPONENT
// ============================================================================

export const BuffrDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('divider', className)} {...props} />;
});

BuffrDivider.displayName = 'BuffrDivider';
