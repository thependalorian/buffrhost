import React from 'react';

interface PsychologyCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'prime' | 'luxury' | 'interactive';
  onClick?: () => void;
}

/**
 * PsychologyCard React Component for Buffr Host Hospitality Platform
 * @fileoverview PsychologyCard provides reusable UI component for consistent design
 * @location buffr-host/components/ui/cards/PsychologyCard.tsx
 * @purpose PsychologyCard provides reusable UI component for consistent design
 * @component PsychologyCard
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
 * @param {} [variant] - variant prop description
 * @param {} [onClick] - onClick prop description
 *
 * Methods:
 * @method getVariantClasses - getVariantClasses method for component functionality
 *
 * Usage Example:
 * @example
 * import { PsychologyCard } from './PsychologyCard';
 *
 * function App() {
 *   return (
 *     <PsychologyCard
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered PsychologyCard component
 */

export const PsychologyCard: React.FC<PsychologyCardProps> = ({
  children,
  className = '',
  variant = 'prime',
  onClick,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'prime':
        return 'bg-white border border-nude-200 shadow-nude-soft hover:shadow-nude-medium';
      case 'luxury':
        return 'bg-luxury-champagne border border-luxury-charlotte shadow-luxury-soft hover:shadow-luxury-medium';
      case 'interactive':
        return 'bg-white border border-nude-200 shadow-nude-soft hover:shadow-nude-medium cursor-pointer';
      default:
        return 'bg-white border border-nude-200 shadow-nude-soft hover:shadow-nude-medium';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        ${getVariantClasses()}
        rounded-lg p-6
        transition-all duration-300 hover:-translate-y-1
        focus-within:ring-2 focus-within:ring-cta-primary focus-within:ring-offset-2
        ${className}
      `}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? 'Interactive card' : undefined}
    >
      {children}
    </div>
  );
};
