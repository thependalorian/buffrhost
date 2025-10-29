/**
 * BuffrInput Component
 *
 * Purpose: Input field component with DaisyUI styling and validation states
 * Functionality: Text input with various types, validation states, and accessibility
 * Location: /components/ui/forms/BuffrInput.tsx
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

export interface BuffrInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  state?: 'error' | 'success' | 'warning' | 'info';
  label?: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
}

export const BuffrInput = React.forwardRef<HTMLInputElement, BuffrInputProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      state,
      label,
      helperText,
      errorText,
      required,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = 'input';

    const variantClasses = {
      primary: 'input-primary',
      secondary: 'input-secondary',
      accent: 'input-accent',
      neutral: 'input-neutral',
      ghost: 'input-ghost',
    };

    const sizeClasses = {
      xs: 'input-xs',
      sm: 'input-sm',
      md: 'input-md',
      lg: 'input-lg',
      xl: 'input-xl',
    };

    const stateClasses = {
      error: 'input-error',
      success: 'input-success',
      warning: 'input-warning',
      info: 'input-info',
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      state && stateClasses[state],
      className
    );

    return (
      <div className="form-control w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            <span className="label-text">
              {label}
              {required && <span className="text-error ml-1">*</span>}
            </span>
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={classes}
          required={required}
          {...props}
        />

        {(helperText || errorText) && (
          <label className="label">
            <span
              className={cn(
                'label-text-alt',
                errorText ? 'text-error' : 'text-base-content/70'
              )}
            >
              {errorText || helperText}
            </span>
          </label>
        )}
      </div>
    );
  }
);

BuffrInput.displayName = 'BuffrInput';

export default BuffrInput;
