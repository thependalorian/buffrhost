/**
 * Loading State Components for Buffr Host Frontend
 * 
 * Emotional loading indicators with luxury hospitality design.
 * Implements the comprehensive design system for loading states.
 */

import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  emotional?: boolean;
  className?: string;
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = "md", emotional = true, className, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-6 h-6", 
      lg: "w-8 h-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-2 border-nude-200 border-t-nude-600",
          sizeClasses[size],
          emotional ? "warm-glow-loader" : "",
          className
        )}
        {...props}
      />
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";

export interface LoadingSkeletonProps {
  className?: string;
  emotional?: boolean;
}

const LoadingSkeleton = React.forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  ({ className, emotional = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse rounded-lg bg-nude-200",
          emotional ? "nude-wave-loader" : "",
          className
        )}
        {...props}
      />
    );
  }
);

LoadingSkeleton.displayName = "LoadingSkeleton";

export interface LoadingOverlayProps {
  children: React.ReactNode;
  isLoading: boolean;
  emotional?: boolean;
  className?: string;
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ children, isLoading, emotional = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        {children}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <LoadingSpinner size="lg" emotional={emotional} />
              <p className="text-nude-600 text-sm">Loading...</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

LoadingOverlay.displayName = "LoadingOverlay";

export interface CardSkeletonProps {
  emotional?: boolean;
  className?: string;
}

const CardSkeleton = React.forwardRef<HTMLDivElement, CardSkeletonProps>(
  ({ emotional = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          emotional ? "hospitality-card" : "rounded-lg border bg-card",
          "p-6",
          className
        )}
        {...props}
      >
        <div className="space-y-3">
          <LoadingSkeleton className="h-4 w-3/4" emotional={emotional} />
          <LoadingSkeleton className="h-4 w-1/2" emotional={emotional} />
          <LoadingSkeleton className="h-20 w-full" emotional={emotional} />
        </div>
      </div>
    );
  }
);

CardSkeleton.displayName = "CardSkeleton";

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  emotional?: boolean;
  className?: string;
}

const TableSkeleton = React.forwardRef<HTMLDivElement, TableSkeletonProps>(
  ({ rows = 5, columns = 4, emotional = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          emotional ? "data-table-emotional" : "rounded-lg border bg-card",
          "overflow-hidden",
          className
        )}
        {...props}
      >
        <div className="p-4 border-b border-nude-200">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-4" emotional={emotional} />
            ))}
          </div>
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 border-b border-nude-100 last:border-b-0">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <LoadingSkeleton key={colIndex} className="h-4" emotional={emotional} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

TableSkeleton.displayName = "TableSkeleton";

export interface ButtonLoadingProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading: boolean;
  emotional?: boolean;
  className?: string;
}

const ButtonLoading = React.forwardRef<HTMLButtonElement, ButtonLoadingProps>(
  ({ children, isLoading, emotional = true, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          emotional ? "btn-emotional-primary" : "bg-primary text-primary-foreground hover:bg-primary/90",
          "inline-flex items-center justify-center gap-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading && <LoadingSpinner size="sm" emotional={emotional} />}
        {children}
      </button>
    );
  }
);

ButtonLoading.displayName = "ButtonLoading";

export {
  LoadingSpinner,
  LoadingSkeleton,
  LoadingOverlay,
  CardSkeleton,
  TableSkeleton,
  ButtonLoading,
};