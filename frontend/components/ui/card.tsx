"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export const Card = ({ children, className, ...props }: CardProps) => (
  <div className={`bg-white rounded-xl shadow-sm border border-nude-200 ${className}`} {...props}>
    {children}
  </div>
);

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export const CardHeader = ({ children, className = "", ...props }: CardHeaderProps) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export const CardTitle = ({ children, className = "", ...props }: CardTitleProps) => (
  <h3 className={`text-lg font-semibold text-nude-900 ${className}`} {...props}>
    {children}
  </h3>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export const CardContent = ({ children, className = "", ...props }: CardContentProps) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);
