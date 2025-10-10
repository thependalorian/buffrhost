/**
 * Universal Page Header Component for Buffr Host Platform
 *
 * A reusable page header component with breadcrumbs, actions, and responsive design.
 * Used across all pages in the application for consistent navigation.
 */

import React from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { cn } from "../../lib/utils";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  id?: string;
  label: string;
  href?: string;
  current?: boolean;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  showHomeBreadcrumb?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs = [],
  actions,
  icon,
  className,
  showHomeBreadcrumb = true,
}) => {
  const allBreadcrumbs = showHomeBreadcrumb
    ? [{ label: "Home", href: "/" }, ...breadcrumbs]
    : breadcrumbs;

  return (
    <div
      className={cn(
        "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        {allBreadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            {allBreadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="h-4 w-4" />}
                {item.href && !item.current ? (
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors flex items-center"
                  >
                    {item.label === "Home" && <Home className="h-4 w-4 mr-1" />}
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      item.current && "text-foreground font-medium",
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Header Content */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              {icon && <div className="text-muted-foreground">{icon}</div>}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {title}
              </h1>
            </div>
            {description && (
              <p className="text-muted-foreground text-sm sm:text-base">
                {description}
              </p>
            )}
          </div>

          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
};

export { PageHeader };
