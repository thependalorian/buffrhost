/**
 * Universal Breadcrumb Component for The Shandi Platform
 *
 * A reusable breadcrumb component with responsive design and accessibility
 * for navigation across the entire application.
 */

import React from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  homeHref?: string;
  separator?: React.ReactNode;
  maxItems?: number;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
  showHome = true,
  homeHref = "/",
  separator = <ChevronRight className="h-4 w-4" />,
  maxItems = 5,
}) => {
  const allItems = showHome
    ? [
        { label: "Home", href: homeHref, icon: <Home className="h-4 w-4" /> },
        ...items,
      ]
    : items;

  // Truncate items if too many
  const displayItems =
    allItems.length > maxItems
      ? [
          allItems[0],
          { label: "...", href: undefined, current: false },
          ...allItems.slice(-(maxItems - 2)),
        ]
      : allItems;

  return (
    <nav
      className={cn(
        "flex items-center space-x-1 text-sm text-muted-foreground",
        className,
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {displayItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-muted-foreground" aria-hidden="true">
                {separator}
              </span>
            )}

            {item.href && !item.current ? (
              <Link
                href={item.href}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                <span className="truncate">{item.label}</span>
              </Link>
            ) : (
              <span
                className={cn(
                  "flex items-center gap-1 truncate",
                  item.current && "text-foreground font-medium",
                )}
                aria-current={item.current ? "page" : undefined}
              >
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export { Breadcrumb };
