/**
 * BuffrSelect Component
 *
 * Purpose: Select dropdown component with DaisyUI styling and Buffr brand identity
 * Functionality: Dropdown selection with accessibility support
 * Location: /components/ui/forms/BuffrSelect.tsx
 *
 * Follows 40 Rules:
 * - Uses DaisyUI for consistent styling
 * - Modular component design for easy maintenance
 * - TypeScript for type safety
 * - Vercel-compatible with SSR
 * - Comprehensive error handling
 * - Optimized for performance
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface BuffrSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  error?: boolean;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
}

export const BuffrSelect = React.forwardRef<
  HTMLSelectElement,
  BuffrSelectProps
>(
  (
    { 
      className, 
      variant = 'primary', 
      size = 'md', 
      error, 
      disabled,
      label,
      helperText,
      errorText,
      required,
      id,
      ...props 
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const baseClasses = 'select';
    const variantClasses = {
      primary: 'select-primary',
      secondary: 'select-secondary',
      accent: 'select-accent',
      ghost: 'select-ghost',
      link: 'select-link',
      outline: 'select-outline',
    };
    const sizeClasses = {
      xs: 'select-xs',
      sm: 'select-sm',
      md: 'select-md',
      lg: 'select-lg',
    };

    const selectElement = (
      <select
        id={selectId}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          error && 'select-error',
          disabled && 'select-disabled',
          className
        )}
        ref={ref}
        disabled={disabled}
        required={required}
        {...props}
      />
    );

    if (label || helperText || errorText) {
      return (
        <div className="form-control w-full">
          {label && (
            <label htmlFor={selectId} className="label">
              <span className="label-text">
                {label}
                {required && <span className="text-error ml-1">*</span>}
              </span>
            </label>
          )}
          {selectElement}
          {(helperText || errorText) && (
            <label className="label">
              <span className={cn(
                'label-text-alt',
                errorText ? 'text-error' : 'text-base-content/70'
              )}>
                {errorText || helperText}
              </span>
            </label>
          )}
        </div>
      );
    }

    return selectElement;
  }
);

BuffrSelect.displayName = 'BuffrSelect';

// Simple wrapper components for compatibility
export const BuffrSelectTrigger = React.forwardRef<
  HTMLSelectElement,
  BuffrSelectProps
>((props, ref) => <BuffrSelect {...props} ref={ref} />);

export const BuffrSelectValue = React.forwardRef<
  HTMLDivElement,
  { placeholder?: string }
>(({ placeholder, ...props }, ref) => (
  <div ref={ref} {...props}>
    {placeholder}
  </div>
));

export const BuffrSelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('dropdown-content', className)} {...props} />
));

export const BuffrSelectItem = React.forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement>
>(({ className, ...props }, ref) => (
  <option ref={ref} className={cn(className)} {...props} />
));

BuffrSelectTrigger.displayName = 'BuffrSelectTrigger';
BuffrSelectValue.displayName = 'BuffrSelectValue';
BuffrSelectContent.displayName = 'BuffrSelectContent';
BuffrSelectItem.displayName = 'BuffrSelectItem';
