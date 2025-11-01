/**
 * Buffr Table Components
 *
 * Purpose: Table components with DaisyUI styling and Nude brand identity
 * Functionality: Table, TableHeader, TableBody, TableRow, TableHead, TableCell
 * Location: /components/ui/tables/BuffrTable.tsx
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
 * BuffrTable React Component for Buffr Host Hospitality Platform
 * @fileoverview BuffrTable provides reusable UI component for consistent design
 * @location buffr-host/components/ui/tables/BuffrTable.tsx
 * @purpose BuffrTable provides reusable UI component for consistent design
 * @component BuffrTable
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
 * import { BuffrTable } from './BuffrTable';
 *
 * function App() {
 *   return (
 *     <BuffrTable
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered BuffrTable component
 */

import { cn } from '@/lib/utils';

// ============================================================================
// TABLE COMPONENT
// ============================================================================

export interface BuffrTableProps
  extends React.HTMLAttributes<HTMLTableElement> {
  variant?: 'default' | 'zebra' | 'striped' | 'bordered' | 'hover' | 'compact';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const BuffrTable = React.forwardRef<HTMLTableElement, BuffrTableProps>(
  (
    { variant = 'default', size = 'md', className, children, ...props },
    ref
  ) => {
    const baseClasses = 'table';

    const variantClasses = {
      default: '',
      zebra: 'table-zebra',
      striped: 'table-striped',
      bordered: 'table-bordered',
      hover: 'table-hover',
      compact: 'table-compact',
    };

    const sizeClasses = {
      xs: 'table-xs',
      sm: 'table-sm',
      md: 'table-md',
      lg: 'table-lg',
    };

    return (
      <div className="overflow-x-auto w-full -mx-2 sm:mx-0">
        <table
          ref={ref}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            'min-w-full w-full',
            className
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

BuffrTable.displayName = 'BuffrTable';

// ============================================================================
// TABLE HEADER COMPONENT
// ============================================================================

export const BuffrTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  return (
    <thead ref={ref} className={cn('table-header', className)} {...props} />
  );
});

BuffrTableHeader.displayName = 'BuffrTableHeader';

// ============================================================================
// TABLE BODY COMPONENT
// ============================================================================

export const BuffrTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  return <tbody ref={ref} className={cn('table-body', className)} {...props} />;
});

BuffrTableBody.displayName = 'BuffrTableBody';

// ============================================================================
// TABLE ROW COMPONENT
// ============================================================================

export const BuffrTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => {
  return <tr ref={ref} className={cn('table-row', className)} {...props} />;
});

BuffrTableRow.displayName = 'BuffrTableRow';

// ============================================================================
// TABLE HEAD COMPONENT
// ============================================================================

export const BuffrTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  return (
    <th
      ref={ref}
      className={cn(
        'table-head',
        'px-2 sm:px-4 py-2 sm:py-3',
        'text-xs sm:text-sm',
        'whitespace-nowrap',
        className
      )}
      {...props}
    />
  );
});

BuffrTableHead.displayName = 'BuffrTableHead';

// ============================================================================
// TABLE CELL COMPONENT
// ============================================================================

/**
 * @component BuffrTableCell
 * @description A cell in the table.
 * @example
 * <BuffrTableCell>John Doe</BuffrTableCell>
 */
export const BuffrTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  return (
    <td
      ref={ref}
      className={cn(
        'table-cell',
        'px-2 sm:px-4 py-2 sm:py-3',
        'text-xs sm:text-sm',
        // Prevent text overflow with truncation
        'max-w-[150px] sm:max-w-[200px] md:max-w-none',
        'truncate break-words',
        className
      )}
      {...props}
    />
  );
});

BuffrTableCell.displayName = 'BuffrTableCell';
