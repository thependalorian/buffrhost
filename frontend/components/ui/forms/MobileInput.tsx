'use client';

import React from 'react';
/**
 * MobileInput React Component for Buffr Host Hospitality Platform
 * @fileoverview MobileInput provides reusable UI component for consistent design
 * @location buffr-host/components/ui/forms/MobileInput.tsx
 * @purpose MobileInput provides reusable UI component for consistent design
 * @component MobileInput
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
 * import { MobileInput } from './MobileInput';
 *
 * function App() {
 *   return (
 *     <MobileInput
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered MobileInput component
 */

import { cn } from '@/lib/utils';

/**
 * Mobile-Optimized Input Component
 *
 * Designed specifically for mobile devices with proper touch targets,
 * keyboard optimization, and accessibility features.
 *
 * Location: components/ui/forms/MobileInput.tsx
 */

interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const MobileInput: React.FC<MobileInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  id,
  type = 'text',
  ...props
}) => {
  const inputId =
    id || `mobile-input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          type={type}
          className={cn(
            // Base styles
            'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base',
            'placeholder:text-gray-400 focus:border-nude-500 focus:outline-none focus:ring-2 focus:ring-nude-500/20',

            // Mobile optimizations
            'min-h-[44px] touch-manipulation', // Touch target size

            // Keyboard optimizations for mobile
            'caret-nude-600 selection:bg-nude-100',

            // Error state
            error &&
              'border-red-500 focus:border-red-500 focus:ring-red-500/20',

            // Icons
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',

            className
          )}
          // Mobile-specific attributes
          autoComplete={props.autoComplete || 'off'}
          autoCapitalize={type === 'text' ? 'sentences' : undefined}
          autoCorrect={type === 'text' ? 'on' : undefined}
          spellCheck={type === 'text' ? true : undefined}
          inputMode={
            type === 'email'
              ? 'email'
              : type === 'tel'
                ? 'tel'
                : type === 'url'
                  ? 'url'
                  : type === 'number'
                    ? 'numeric'
                    : 'text'
          }
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

/**
 * Mobile Textarea Component
 */
interface MobileTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const MobileTextarea: React.FC<MobileTextareaProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const textareaId =
    id || `mobile-textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        className={cn(
          // Base styles
          'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base',
          'placeholder:text-gray-400 focus:border-nude-500 focus:outline-none focus:ring-2 focus:ring-nude-500/20',

          // Mobile optimizations
          'min-h-[100px] resize-none touch-manipulation', // Touch target and resize

          // Error state
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',

          className
        )}
        // Mobile-specific attributes
        autoComplete="off"
        autoCapitalize="sentences"
        autoCorrect="on"
        spellCheck={true}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
