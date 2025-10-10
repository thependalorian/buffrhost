/**
 * KPI Card Component for Buffr Host Frontend
 * 
 * Emotional KPI display cards with luxury hospitality design.
 * Implements the comprehensive design system for dashboard metrics.
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";

export interface KPICardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  emotional?: boolean;
}

const KPICard = React.forwardRef<HTMLDivElement, KPICardProps>(
  ({ 
    title, 
    value, 
    trend, 
    icon, 
    description, 
    className,
    emotional = true,
    ...props 
  }, ref) => {
    return (
      <Card
        ref={ref}
        variant={emotional ? "default" : "default"}
        emotional={emotional}
        className={cn(
          emotional ? "kpi-card-emotional" : "",
          className
        )}
        {...props}
      >
        <CardContent emotional={emotional} className="text-center">
          {icon && (
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-nude-100 text-nude-600">
                {icon}
              </div>
            </div>
          )}
          
          <div className={cn(
            emotional ? "kpi-value-emotional" : "text-3xl font-bold mb-1"
          )}>
            {value}
          </div>
          
          <div className={cn(
            emotional ? "kpi-label-emotional" : "text-sm font-medium text-muted-foreground"
          )}>
            {title}
          </div>
          
          {description && (
            <p className="text-xs text-nude-600 mt-1">{description}</p>
          )}
          
          {trend && (
            <div className={cn(
              "flex items-center justify-center gap-1 mt-2",
              emotional ? "kpi-trend-emotional" : "text-sm",
              trend.positive !== false ? "text-semantic-success" : "text-semantic-error"
            )}>
              <span className="text-xs">
                {trend.positive !== false ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-nude-600">{trend.label}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

KPICard.displayName = "KPICard";

export { KPICard };