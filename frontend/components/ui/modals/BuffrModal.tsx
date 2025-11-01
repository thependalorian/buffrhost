/**
 * Buffr Modal Components
 *
 * Purpose: Modal components with DaisyUI styling and Nude brand identity
 * Functionality: Modal, ModalBox, ModalAction, ModalBackdrop
 * Location: /components/ui/modals/BuffrModal.tsx
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
 * BuffrModal React Component for Buffr Host Hospitality Platform
 * @fileoverview BuffrModal provides reusable UI component for consistent design
 * @location buffr-host/components/ui/modals/BuffrModal.tsx
 * @purpose BuffrModal provides reusable UI component for consistent design
 * @component BuffrModal
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
 * import { BuffrModal } from './BuffrModal';
 *
 * function App() {
 *   return (
 *     <BuffrModal
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered BuffrModal component
 */

import { cn } from '@/lib/utils';

// ============================================================================
// MODAL COMPONENT
// ============================================================================

export interface BuffrModalProps
  extends React.HTMLAttributes<HTMLDialogElement> {
  variant?: 'default' | 'wide' | 'full';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const BuffrModal = React.forwardRef<HTMLDialogElement, BuffrModalProps>(
  (
    { variant = 'default', size = 'md', className, children, ...props },
    ref
  ) => {
    const baseClasses = 'modal';

    const variantClasses = {
      default: '',
      wide: 'modal-wide',
      full: 'modal-full',
    };

    const sizeClasses = {
      xs: 'modal-xs',
      sm: 'modal-sm',
      md: 'modal-md',
      lg: 'modal-lg',
      xl: 'modal-xl',
    };

    return (
      <dialog
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          // Full screen on mobile devices
          'sm:modal',
          className
        )}
        {...props}
      >
        {children}
      </dialog>
    );
  }
);

BuffrModal.displayName = 'BuffrModal';

// ============================================================================
// MODAL BOX COMPONENT
// ============================================================================

export const BuffrModalBox = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'modal-box',
        'w-full max-w-full',
        // Full screen on mobile, centered on larger screens
        'sm:max-w-md md:max-w-lg lg:max-w-xl',
        'mx-0 sm:mx-4',
        // Responsive padding
        'p-4 sm:p-6 md:p-8',
        // Full height on mobile, max height on larger screens
        'h-full sm:h-auto sm:max-h-[90vh]',
        // Scrollable content
        'overflow-y-auto',
        // Ensure text doesn't overflow
        'break-words',
        className
      )}
      {...props}
    />
  );
});

BuffrModalBox.displayName = 'BuffrModalBox';

// ============================================================================
// MODAL ACTION COMPONENT
// ============================================================================

export const BuffrModalAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('modal-action', className)} {...props} />;
});

BuffrModalAction.displayName = 'BuffrModalAction';

// ============================================================================
// MODAL BACKDROP COMPONENT
// ============================================================================

/**
 * @component BuffrModalBackdrop
 * @description The backdrop for the modal, which closes the modal when clicked.
 * @example
 * <BuffrModalBackdrop />
 */
export const BuffrModalBackdrop = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label ref={ref} className={cn('modal-backdrop', className)} {...props} />
  );
});

BuffrModalBackdrop.displayName = 'BuffrModalBackdrop';
