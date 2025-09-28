/**
 * Universal Alert Component for The Shandi Platform
 *
 * A comprehensive alert component with multiple variants, actions, and animations
 * for displaying notifications, warnings, and feedback across the entire application.
 */

import React from "react";
import { cn } from "../../lib/utils";
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";

export interface AlertProps {
  variant?: "default" | "success" | "warning" | "error" | "info";
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({
  variant = "default",
  title,
  description,
  children,
  className,
  dismissible = false,
  onDismiss,
  icon,
  actions,
}) => {
  const variants = {
    default: {
      container: "bg-background border border-border",
      icon: "text-foreground",
      title: "text-foreground",
      description: "text-muted-foreground",
    },
    success: {
      container: "bg-green-50 border-green-200 text-green-800",
      icon: "text-green-600",
      title: "text-green-800",
      description: "text-green-700",
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: "text-yellow-600",
      title: "text-yellow-800",
      description: "text-yellow-700",
    },
    error: {
      container: "bg-red-50 border-red-200 text-red-800",
      icon: "text-red-600",
      title: "text-red-800",
      description: "text-red-700",
    },
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-800",
      icon: "text-blue-600",
      title: "text-blue-800",
      description: "text-blue-700",
    },
  };

  const defaultIcons = {
    default: <Info className="h-4 w-4" />,
    success: <CheckCircle className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    error: <XCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  };

  const currentVariant = variants[variant];
  const currentIcon = icon || defaultIcons[variant];

  return (
    <div
      className={cn(
        "relative rounded-lg border p-4",
        currentVariant.container,
        className,
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={cn("flex-shrink-0", currentVariant.icon)}>
          {currentIcon}
        </div>

        <div className="flex-1 min-w-0">
          {title && (
            <h4
              className={cn("font-medium text-sm mb-1", currentVariant.title)}
            >
              {title}
            </h4>
          )}

          {description && (
            <p className={cn("text-sm", currentVariant.description)}>
              {description}
            </p>
          )}

          {children && (
            <div className={cn("text-sm mt-2", currentVariant.description)}>
              {children}
            </div>
          )}

          {actions && <div className="mt-3 flex gap-2">{actions}</div>}
        </div>

        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              "flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors",
              currentVariant.icon,
            )}
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export { Alert };
