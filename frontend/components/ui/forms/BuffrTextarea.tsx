/**
 * BuffrTextarea Component
 *
 * Purpose: Textarea component with DaisyUI styling and validation states
 * Functionality: Multi-line text input with validation, character count, and accessibility
 * Location: /components/ui/forms/BuffrTextarea.tsx
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

export interface BuffrTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  state?: 'error' | 'success' | 'warning' | 'info';
  label?: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
}

export const BuffrTextarea = React.forwardRef<
  HTMLTextAreaElement,
  BuffrTextareaProps
>(
  (
    {
      variant = 'primary',
      size = 'md',
      state,
      label,
      helperText,
      errorText,
      required,
      showCharCount = false,
      maxLength,
      className,
      id,
      value,
      ...props
    },
    ref
  ) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const currentLength = typeof value === 'string' ? value.length : 0;

    const baseClasses = 'textarea';

    const variantClasses = {
      primary: 'textarea-primary',
      secondary: 'textarea-secondary',
      accent: 'textarea-accent',
      neutral: 'textarea-neutral',
      ghost: 'textarea-ghost',
    };

    const sizeClasses = {
      xs: 'textarea-xs',
      sm: 'textarea-sm',
      md: 'textarea-md',
      lg: 'textarea-lg',
      xl: 'textarea-xl',
    };

    const stateClasses = {
      error: 'textarea-error',
      success: 'textarea-success',
      warning: 'textarea-warning',
      info: 'textarea-info',
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

        <textarea
          ref={ref}
          id={inputId}
          className={classes}
          required={required}
          maxLength={maxLength}
          value={value}
          {...props}
        />

        <div className="label">
          <span
            className={cn(
              'label-text-alt',
              errorText ? 'text-error' : 'text-base-content/70'
            )}
          >
            {errorText || helperText}
          </span>
          {showCharCount && maxLength && (
            <span
              className={cn(
                'label-text-alt',
                currentLength > maxLength * 0.9
                  ? 'text-warning'
                  : 'text-base-content/50'
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

BuffrTextarea.displayName = 'BuffrTextarea';

export default BuffrTextarea;
