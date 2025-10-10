/**
 * Emotional Dashboard Layout Component for Buffr Host Frontend
 * 
 * Luxury hospitality-focused dashboard layout with emotional design principles.
 * Implements the comprehensive design system for dashboard layouts.
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { EmotionalNavigation, NavigationItem } from "../navigation/emotional-navigation";
import { StatusBadge } from "../ui/status-badge";

export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  emotional?: boolean;
  className?: string;
}

const DashboardHeader = React.forwardRef<HTMLDivElement, DashboardHeaderProps>(
  ({ title, subtitle, actions, breadcrumbs, emotional = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          emotional ? "bg-white border-b border-nude-200" : "bg-card border-b",
          "px-6 py-4",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex items-center space-x-2 text-sm text-nude-500 mb-2">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                    {crumb.href ? (
                      <a href={crumb.href} className="hover:text-nude-700 transition-colors">
                        {crumb.label}
                      </a>
                    ) : (
                      <span>{crumb.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}
            <h1 className={cn(
              emotional ? "text-2xl font-display font-bold text-nude-900" : "text-2xl font-semibold",
              "leading-tight"
            )}>
              {title}
            </h1>
            {subtitle && (
              <p className={cn(
                emotional ? "text-nude-600 mt-1" : "text-muted-foreground mt-1",
                "text-sm"
              )}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    );
  }
);

DashboardHeader.displayName = "DashboardHeader";

export interface EmotionalDashboardProps {
  children: React.ReactNode;
  navigation: {
    items: NavigationItem[];
    user?: {
      name: string;
      email: string;
      avatar?: string;
      role: string;
    };
  };
  header?: DashboardHeaderProps;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  emotional?: boolean;
  className?: string;
}

const EmotionalDashboard = React.forwardRef<HTMLDivElement, EmotionalDashboardProps>(
  ({ 
    children, 
    navigation, 
    header, 
    sidebarCollapsed = false,
    onSidebarToggle,
    emotional = true,
    className,
    ...props 
  }, ref) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen bg-nude-50",
          emotional ? "" : "bg-background",
          "flex"
        )}
        {...props}
      >
        {/* Sidebar */}
        <div className={cn(
          "flex-shrink-0 transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64",
          "hidden lg:block"
        )}>
          <EmotionalNavigation
            items={navigation.items}
            user={navigation.user}
            emotional={emotional}
            className="h-full"
          />
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <EmotionalNavigation
            items={navigation.items}
            user={navigation.user}
            emotional={emotional}
            className="h-full"
            onItemClick={() => setIsMobileMenuOpen(false)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          {header && (
            <DashboardHeader
              {...header}
              emotional={emotional}
            />
          )}

          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-nude-200 px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              emotional={emotional}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            <h1 className="text-lg font-semibold text-nude-900">
              {header?.title || "Dashboard"}
            </h1>
            <div className="w-8" /> {/* Spacer for centering */}
          </div>

          {/* Page Content */}
          <main className={cn(
            "flex-1 p-6",
            emotional ? "bg-nude-50" : "bg-background",
            className
          )}>
            {children}
          </main>
        </div>
      </div>
    );
  }
);

EmotionalDashboard.displayName = "EmotionalDashboard";

export { EmotionalDashboard, DashboardHeader };