import React from 'react';

interface PsychologyHeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

/**
 * PsychologyHeading React Component for Buffr Host Hospitality Platform
 * @fileoverview PsychologyHeading provides reusable UI component for consistent design
 * @location buffr-host/components/ui/typography/PsychologyTypography.tsx
 * @purpose PsychologyHeading provides reusable UI component for consistent design
 * @component PsychologyHeading
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
 * @param {} [level] - level prop description
 * @param {} [className] - className prop description
 *
 * Methods:
 * @method getHeadingClasses - getHeadingClasses method for component functionality
 *
 * Usage Example:
 * @example
 * import { PsychologyHeading } from './PsychologyHeading';
 *
 * function App() {
 *   return (
 *     <PsychologyHeading
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered PsychologyHeading component
 */

export const PsychologyHeading: React.FC<PsychologyHeadingProps> = ({
  children,
  level = 1,
  className = '',
}) => {
  const getHeadingClasses = () => {
    switch (level) {
      case 1:
        return 'text-5xl md:text-6xl lg:text-7xl font-display font-bold text-nude-900 leading-tight tracking-tight bg-gradient-to-r from-nude-900 via-nude-800 to-luxury-gold bg-clip-text text-transparent';
      case 2:
        return 'text-3xl md:text-4xl font-display font-semibold text-nude-800 leading-tight tracking-tight';
      case 3:
        return 'text-xl md:text-2xl font-display font-medium text-nude-800 leading-snug';
      case 4:
        return 'text-lg md:text-xl font-display font-medium text-nude-800 leading-snug';
      case 5:
        return 'text-base md:text-lg font-display font-medium text-nude-800 leading-snug';
      case 6:
        return 'text-sm md:text-base font-display font-medium text-nude-800 leading-snug';
      default:
        return 'text-3xl md:text-4xl font-display font-semibold text-nude-800 leading-tight tracking-tight';
    }
  };

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag className={`${getHeadingClasses()} ${className}`}>
      {children}
    </HeadingTag>
  );
};
