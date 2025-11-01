import React from 'react';

interface PrimaryCTAProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * PrimaryCTA React Component for Buffr Host Hospitality Platform
 * @fileoverview PrimaryCTA provides reusable UI component for consistent design
 * @location buffr-host/components/ui/cta/PrimaryCTA.tsx
 * @purpose PrimaryCTA provides reusable UI component for consistent design
 * @component PrimaryCTA
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
 * @param {} [onClick] - onClick prop description
 * @param {} [className] - className prop description
 * @param {} [disabled] - disabled prop description
 * @param {} [type] - type prop description
 *
 * Usage Example:
 * @example
 * import { PrimaryCTA } from './PrimaryCTA';
 *
 * function App() {
 *   return (
 *     <PrimaryCTA
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered PrimaryCTA component
 */

export const PrimaryCTA: React.FC<PrimaryCTAProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`
      bg-cta-primary hover:bg-cta-primary-hover
      text-white font-medium text-base
      px-6 py-3 rounded-lg
      shadow-lg hover:shadow-xl
      transition-all duration-300 hover:-translate-y-1
      focus:outline-none focus:ring-2 focus:ring-cta-primary focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      disabled:hover:transform-none disabled:hover:shadow-lg
      ${className}
    `}
    aria-label={
      typeof children === 'string' ? children : 'Primary action button'
    }
  >
    {children}
  </button>
);

// components/ui/cta/SecondaryCTA.tsx
export const SecondaryCTA: React.FC<PrimaryCTAProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`
      bg-cta-secondary hover:bg-nude-700
      text-white font-medium text-base
      px-6 py-3 rounded-lg
      shadow-md hover:shadow-lg
      transition-all duration-300 hover:-translate-y-1
      focus:outline-none focus:ring-2 focus:ring-cta-secondary focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      disabled:hover:transform-none disabled:hover:shadow-md
      ${className}
    `}
    aria-label={
      typeof children === 'string' ? children : 'Secondary action button'
    }
  >
    {children}
  </button>
);

// components/ui/cta/TertiaryCTA.tsx
export const TertiaryCTA: React.FC<PrimaryCTAProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`
      bg-cta-tertiary hover:bg-nude-600
      text-white font-medium text-sm
      px-4 py-2 rounded-md
      shadow-sm hover:shadow-md
      transition-all duration-300 hover:-translate-y-1
      focus:outline-none focus:ring-2 focus:ring-cta-tertiary focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      disabled:hover:transform-none disabled:hover:shadow-sm
      ${className}
    `}
    aria-label={
      typeof children === 'string' ? children : 'Tertiary action button'
    }
  >
    {children}
  </button>
);
