/**
 * Emotional Navigation Component for Buffr Host Frontend
 * 
 * Luxury hospitality-focused navigation system with emotional design principles.
 * Implements the comprehensive design system for navigation elements.
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { StatusBadge } from "../ui/status-badge";

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavigationItem[];
  active?: boolean;
}

export interface EmotionalNavigationProps {
  items: NavigationItem[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  onItemClick?: (item: NavigationItem) => void;
  emotional?: boolean;
  className?: string;
}

const EmotionalNavigation = React.forwardRef<HTMLDivElement, EmotionalNavigationProps>(
  ({ items, user, onItemClick, emotional = true, className, ...props }, ref) => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleExpanded = (itemId: string) => {
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    };

    const renderNavigationItem = (item: NavigationItem, level = 0) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems.has(item.id);
      const isActive = item.active;

      return (
        <div key={item.id} className="space-y-1">
          <button
            onClick={() => {
              if (hasChildren) {
                toggleExpanded(item.id);
              } else {
                onItemClick?.(item);
              }
            }}
            className={cn(
              emotional ? "nav-link-emotional" : "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              isActive && emotional ? "nav-link-emotional-active" : "",
              isActive && !emotional ? "bg-accent text-accent-foreground" : "",
              "w-full text-left",
              level > 0 && "ml-4"
            )}
          >
            <div className="flex items-center gap-3 flex-1">
              {item.icon && (
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
              )}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <StatusBadge 
                  status="info" 
                  size="sm" 
                  emotional={emotional}
                >
                  {item.badge}
                </StatusBadge>
              )}
              {hasChildren && (
                <div className={cn(
                  "transition-transform duration-200",
                  isExpanded ? "rotate-90" : "rotate-0"
                )}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>
          
          {hasChildren && isExpanded && (
            <div className="space-y-1">
              {item.children!.map(child => renderNavigationItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          emotional ? "bg-white border-r border-nude-200 h-full" : "bg-card border-r",
          "flex flex-col",
          className
        )}
        {...props}
      >
        {/* User Profile Section */}
        {user && (
          <div className={cn(
            emotional ? "p-6 border-b border-nude-200" : "p-4 border-b",
            "flex items-center gap-3"
          )}>
            <div className="w-10 h-10 rounded-full bg-nude-100 flex items-center justify-center">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-nude-600 font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-nude-800 truncate">
                {user.name}
              </p>
              <p className="text-xs text-nude-500 truncate">
                {user.role}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-nude">
          {items.map(item => renderNavigationItem(item))}
        </nav>

        {/* Quick Actions */}
        <div className={cn(
          emotional ? "p-4 border-t border-nude-200" : "p-4 border-t",
          "space-y-2"
        )}>
          <Button
            variant="ghost"
            size="sm"
            emotional={emotional}
            className="w-full justify-start"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Button>
          <Button
            variant="ghost"
            size="sm"
            emotional={emotional}
            className="w-full justify-start"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Help & Support
          </Button>
        </div>
      </div>
    );
  }
);

EmotionalNavigation.displayName = "EmotionalNavigation";

export { EmotionalNavigation };