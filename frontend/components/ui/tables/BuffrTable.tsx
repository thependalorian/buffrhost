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
      <table
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
      </table>
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
  return <th ref={ref} className={cn('table-head', className)} {...props} />;
});

BuffrTableHead.displayName = 'BuffrTableHead';

// ============================================================================
// TABLE CELL COMPONENT
// ============================================================================

export const BuffrTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  return <td ref={ref} className={cn('table-cell', className)} {...props} />;
});

BuffrTableCell.displayName = 'BuffrTableCell';
