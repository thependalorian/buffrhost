/**
 * Status Badge Component for Buffr Host Frontend
 * 
 * Emotional status indicators with luxury hospitality design.
 * Implements the comprehensive design system for status displays.
 */

import React from "react";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: "success" | "warning" | "error" | "info" | "pending" | "active" | "inactive";
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  emotional?: boolean;
  className?: string;
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, children, size = "md", emotional = true, className, ...props }, ref) => {
    const baseClasses = emotional
      ? "inline-flex items-center gap-1.5 font-medium rounded-full"
      : "inline-flex items-center gap-1.5 font-medium rounded-full";

    const statusClasses = emotional
      ? {
          success: "status-indicator-success",
          warning: "status-indicator-warning", 
          error: "status-indicator-error",
          info: "status-indicator-info",
          pending: "bg-nude-100 text-nude-700 border border-nude-200",
          active: "bg-semantic-success/10 text-semantic-success border border-semantic-success/20",
          inactive: "bg-nude-100 text-nude-600 border border-nude-200",
        }
      : {
          success: "bg-green-100 text-green-800",
          warning: "bg-yellow-100 text-yellow-800",
          error: "bg-red-100 text-red-800",
          info: "bg-blue-100 text-blue-800",
          pending: "bg-gray-100 text-gray-800",
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-100 text-gray-500",
        };

    const sizeClasses = {
      sm: emotional ? "px-2 py-1 text-xs" : "px-2 py-1 text-xs",
      md: emotional ? "px-3 py-1 text-sm" : "px-3 py-1 text-sm",
      lg: emotional ? "px-4 py-2 text-base" : "px-4 py-2 text-base",
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          statusClasses[status],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

export { StatusBadge };