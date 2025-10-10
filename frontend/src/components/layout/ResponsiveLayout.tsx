/**
 * Responsive Layout Component for Buffr Host Frontend
 *
 * Provides responsive layout containers and utilities.
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

export function ResponsiveLayout({
  children,
  className,
  maxWidth = "xl",
  padding = "md",
}: ResponsiveLayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "px-4 py-2",
    md: "px-4 py-4 sm:px-6 sm:py-6",
    lg: "px-6 py-6 sm:px-8 sm:py-8",
    xl: "px-8 py-8 sm:px-12 sm:py-12",
  };

  return (
    <div
      className={cn(
        "w-full mx-auto",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveContainer({
  children,
  className,
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: "sm" | "md" | "lg" | "xl";
}

export function ResponsiveGrid({
  children,
  className,
  columns = 3,
  gap = "md",
}: ResponsiveGridProps) {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
  };

  const gapClasses = {
    sm: "gap-2 sm:gap-3",
    md: "gap-4 sm:gap-6",
    lg: "gap-6 sm:gap-8",
    xl: "gap-8 sm:gap-12",
  };

  return (
    <div
      className={cn("grid", columnClasses[columns], gapClasses[gap], className)}
    >
      {children}
    </div>
  );
}

interface ResponsiveFlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  wrap?: boolean;
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  gap?: "sm" | "md" | "lg" | "xl";
}

export function ResponsiveFlex({
  children,
  className,
  direction = "row",
  wrap = false,
  justify = "start",
  align = "start",
  gap = "md",
}: ResponsiveFlexProps) {
  const directionClasses = {
    row: "flex-row",
    col: "flex-col",
    "row-reverse": "flex-row-reverse",
    "col-reverse": "flex-col-reverse",
  };

  const justifyClasses = {
    start: "justify-start",
    end: "justify-end",
    center: "justify-center",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const alignClasses = {
    start: "items-start",
    end: "items-end",
    center: "items-center",
    baseline: "items-baseline",
    stretch: "items-stretch",
  };

  const gapClasses = {
    sm: "gap-2 sm:gap-3",
    md: "gap-4 sm:gap-6",
    lg: "gap-6 sm:gap-8",
    xl: "gap-8 sm:gap-12",
  };

  return (
    <div
      className={cn(
        "flex",
        directionClasses[direction],
        wrap && "flex-wrap",
        justifyClasses[justify],
        alignClasses[align],
        gapClasses[gap],
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ResponsiveSectionProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "white" | "gray" | "primary" | "secondary";
}

export function ResponsiveSection({
  children,
  className,
  padding = "md",
  background = "white",
}: ResponsiveSectionProps) {
  const paddingClasses = {
    none: "",
    sm: "py-4 sm:py-6",
    md: "py-8 sm:py-12",
    lg: "py-12 sm:py-16",
    xl: "py-16 sm:py-20",
  };

  const backgroundClasses = {
    white: "bg-white",
    gray: "bg-gray-50",
    primary: "bg-primary",
    secondary: "bg-secondary",
  };

  return (
    <section
      className={cn(
        "w-full",
        paddingClasses[padding],
        backgroundClasses[background],
        className,
      )}
    >
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </section>
  );
}

interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right" | "justify";
}

export function ResponsiveText({
  children,
  className,
  size = "md",
  weight = "normal",
  align = "left",
}: ResponsiveTextProps) {
  const sizeClasses = {
    xs: "text-xs sm:text-sm",
    sm: "text-sm sm:text-base",
    md: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl",
    xl: "text-xl sm:text-2xl",
    "2xl": "text-2xl sm:text-3xl",
    "3xl": "text-3xl sm:text-4xl",
    "4xl": "text-4xl sm:text-5xl",
    "5xl": "text-5xl sm:text-6xl",
  };

  const weightClasses = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  return (
    <div
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        alignClasses[align],
        className,
      )}
    >
      {children}
    </div>
  );
}

export {
  ResponsiveLayout,
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveFlex,
  ResponsiveSection,
  ResponsiveText,
};
