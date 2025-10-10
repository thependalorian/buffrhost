/**
 * Universal Loading Components for Buffr Host Platform
 *
 * Comprehensive loading components with multiple variants and animations
 * for displaying loading states across the entire application.
 */

import React from "react";
import { cn } from "@/src/lib/utils";

export interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: "primary" | "secondary" | "muted";
}

export interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  width?: string;
  height?: string;
}

export interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
  color = "primary",
}) => {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    muted: "text-muted-foreground",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        colorClasses[color],
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  lines = 1,
  width = "100%",
  height = "1rem",
}) => {
  return (
    <div className={cn("animate-pulse", className)}>
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className="bg-muted rounded"
          style={{
            width: index === lines - 1 ? "75%" : width,
            height: height,
            marginBottom: index < lines - 1 ? "0.5rem" : "0",
          }}
        />
      ))}
    </div>
  );
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  children,
  text = "Loading...",
  className,
}) => {
  if (!loading) return <>{children}</>;

  return (
    <div className={cn("relative", className)}>
      {children}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-muted-foreground">{text}</p>
        </div>
      </div>
    </div>
  );
};

// Card Loading Skeleton
const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("border rounded-lg p-4", className)}>
    <LoadingSkeleton lines={3} />
  </div>
);

// Table Loading Skeleton
const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className }) => (
  <div className={cn("border rounded-lg overflow-hidden", className)}>
    <div className="border-b bg-muted/50 p-4">
      <LoadingSkeleton width="200px" height="1rem" />
    </div>
    <div className="divide-y">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="p-4 flex gap-4">
          {Array.from({ length: columns }, (_, colIndex) => (
            <LoadingSkeleton
              key={colIndex}
              width={colIndex === 0 ? "150px" : "100px"}
              height="1rem"
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Button Loading State
const ButtonLoading: React.FC<{
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}> = ({ children, loading = false, className }) => (
  <button
    className={cn("inline-flex items-center justify-center gap-2", className)}
    disabled={loading}
  >
    {loading && <LoadingSpinner size="sm" />}
    {children}
  </button>
);

export {
  LoadingSpinner,
  LoadingSkeleton,
  LoadingOverlay,
  CardSkeleton,
  TableSkeleton,
  ButtonLoading,
};
