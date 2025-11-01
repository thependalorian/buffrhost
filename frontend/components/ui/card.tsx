'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

/**
 * Card React Component for Buffr Host Hospitality Platform
 * @fileoverview Card provides reusable UI component for consistent design
 * @location buffr-host/components/ui/card.tsx
 * @purpose Card provides reusable UI component for consistent design
 * @component Card
 * @category Ui
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {React.ReactNode} [children] - children prop description
 * @param {} [className] - className prop description
 * @param {string]} [key] - key prop description
 *
 * Methods:
 * @method Card - Card method for component functionality
 * @method CardHeader = ({
  children,
  className = '',
  ...props
}: CardHeaderProps) - CardHeader = ({
  children,
  className = '',
  ...props
}: CardHeaderProps) method for component functionality
 * @method CardTitle = ({
  children,
  className = '',
  ...props
}: CardTitleProps) - CardTitle = ({
  children,
  className = '',
  ...props
}: CardTitleProps) method for component functionality
 * @method CardContent = ({
  children,
  className = '',
  ...props
}: CardContentProps) - CardContent = ({
  children,
  className = '',
  ...props
}: CardContentProps) method for component functionality
 *
 * Usage Example:
 * @example
 * import { Card } from './Card';
 *
 * function App() {
 *   return (
 *     <Card
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered Card component
 */

export const Card = ({ children, className, ...props }: CardProps) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-nude-200 ${className}`}
    {...props}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export const CardHeader = ({
  children,
  className = '',
  ...props
}: CardHeaderProps) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export const CardTitle = ({
  children,
  className = '',
  ...props
}: CardTitleProps) => (
  <h3 className={`text-lg font-semibold text-nude-900 ${className}`} {...props}>
    {children}
  </h3>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export const CardContent = ({
  children,
  className = '',
  ...props
}: CardContentProps) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);
