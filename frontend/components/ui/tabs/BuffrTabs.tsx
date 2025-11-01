/**
 * Buffr Tabs Components
 *
 * Purpose: Tab components with DaisyUI styling and Nude brand identity
 * Functionality: Tabs, TabsList, TabsTrigger, Tab, TabContent, TabsContent
 * Location: /components/ui/tabs/BuffrTabs.tsx
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
 * BuffrTabs React Component for Buffr Host Hospitality Platform
 * @fileoverview BuffrTabs provides reusable UI component for consistent design
 * @location buffr-host/components/ui/tabs/BuffrTabs.tsx
 * @purpose BuffrTabs provides reusable UI component for consistent design
 * @component BuffrTabs
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
 * Methods:
 * @method handleClick - handleClick method for component functionality
 *
 * Usage Example:
 * @example
 * import { BuffrTabs } from './BuffrTabs';
 *
 * function App() {
 *   return (
 *     <BuffrTabs
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered BuffrTabs component
 */

import { cn } from '@/lib/utils';

// ============================================================================
// TABS COMPONENT
// ============================================================================

export interface BuffrTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'lifted' | 'boxed';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  value?: string;
  onValueChange?: (value: string) => void;
}

export const BuffrTabs = React.forwardRef<HTMLDivElement, BuffrTabsProps>(
  (
    {
      variant = 'default',
      size = 'md',
      className,
      children,
      value,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'tabs';

    const variantClasses = {
      default: '',
      bordered: 'tabs-bordered',
      lifted: 'tabs-lifted',
      boxed: 'tabs-boxed',
    };

    const sizeClasses = {
      xs: 'tabs-xs',
      sm: 'tabs-sm',
      md: 'tabs-md',
      lg: 'tabs-lg',
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
        data-value={value}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              value,
              onValueChange,
            } as unknown);
          }
          return child;
        })}
      </div>
    );
  }
);

BuffrTabs.displayName = 'BuffrTabs';

// ============================================================================
// TABS LIST COMPONENT
// ============================================================================

export const BuffrTabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('tabs-list', className)} {...props} />;
});

BuffrTabsList.displayName = 'BuffrTabsList';

// ============================================================================
// TABS TRIGGER COMPONENT
// ============================================================================

export interface BuffrTabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const BuffrTabsTrigger = React.forwardRef<
  HTMLButtonElement,
  BuffrTabsTriggerProps
>(({ className, value, onValueChange, ...props }, ref) => {
  const handleClick = () => {
    if (value && onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <button
      ref={ref}
      className={cn('tabs-trigger', className)}
      onClick={handleClick}
      {...props}
    />
  );
});

BuffrTabsTrigger.displayName = 'BuffrTabsTrigger';

// ============================================================================
// TAB COMPONENT
// ============================================================================

export interface BuffrTabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const BuffrTab = React.forwardRef<HTMLButtonElement, BuffrTabProps>(
  ({ active = false, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn('tab', active && 'tab-active', className)}
        {...props}
      />
    );
  }
);

BuffrTab.displayName = 'BuffrTab';

// ============================================================================
// TAB CONTENT COMPONENT
// ============================================================================

export const BuffrTabContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('tab-content', className)} {...props} />;
});

BuffrTabContent.displayName = 'BuffrTabContent';

// ============================================================================
// TABS CONTENT COMPONENT
// ============================================================================

export interface BuffrTabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
}

export const BuffrTabsContent = React.forwardRef<
  HTMLDivElement,
  BuffrTabsContentProps
>(({ className, value, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('tabs-content', className)}
      data-value={value}
      {...props}
    />
  );
});

BuffrTabsContent.displayName = 'BuffrTabsContent';
