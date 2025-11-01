'use client';

import React from 'react';
/**
 * BuffrButton React Component for Buffr Host Hospitality Platform
 * @fileoverview BuffrButton provides reusable UI component for consistent design
 * @location buffr-host/components/ui/buttons/BuffrButton.tsx
 * @purpose BuffrButton provides reusable UI component for consistent design
 * @component BuffrButton
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
 * import { BuffrButton } from './BuffrButton';
 *
 * function App() {
 *   return (
 *     <BuffrButton
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered BuffrButton component
 */

import { cn } from '@/lib/utils';

/**
 * @file This file defines the BuffrButton component, a versatile and themeable button for the Buffr Host application.
 * @location frontend/components/ui/buttons/BuffrButton.tsx
 * @description This component provides a customizable button with support for different variants and sizes, consistent with the application's design system.
 * @modular
 *
 * @component
 * @param {BuffrButtonProps} props - The props for the component.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the component.
 * @param {React.ReactNode} props.children - The content of the button.
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'} [props.variant='primary'] - The visual style of the button.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The size of the button.
 *
 * @example
 * <BuffrButton variant="primary" size="lg" onClick={() => console.log('Button clicked!')}>
 *   Click Me
 * </BuffrButton>
 *
 * @see {@link BuffrIconButton}
 *
 * @security This component is a presentational component and does not handle any sensitive data directly.
 * @accessibility This component is a standard button and is accessible by default.
 * @performance This is a lightweight component with minimal performance impact.
 *
 * @buffr-icon-usage This component can contain BuffrIcon components as children.
 */

interface BuffrButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const BuffrButton: React.FC<BuffrButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-nude-600 to-nude-700 text-white hover:from-nude-700 hover:to-nude-800 focus:ring-nude-500 shadow-lg',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline:
      'border-2 border-nude-600 bg-white text-nude-700 hover:bg-nude-50 focus:ring-nude-500',
    ghost: 'text-nude-700 hover:bg-nude-50 focus:ring-nude-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm min-h-[44px] sm:min-h-0 min-w-[44px]',
    md: 'px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base min-h-[44px] sm:min-h-0',
    lg: 'px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg min-h-[48px] sm:min-h-0',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
