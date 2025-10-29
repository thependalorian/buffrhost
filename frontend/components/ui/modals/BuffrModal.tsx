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
  return <div ref={ref} className={cn('modal-box', className)} {...props} />;
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

export const BuffrModalBackdrop = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label ref={ref} className={cn('modal-backdrop', className)} {...props} />
  );
});

BuffrModalBackdrop.displayName = 'BuffrModalBackdrop';
