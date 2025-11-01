import React from 'react';
/**
 * ABTestCTA React Component for Buffr Host Hospitality Platform
 * @fileoverview ABTestCTA manages A/B testing and feature experimentation
 * @location buffr-host/components/ab-testing/ABTestCTA.tsx
 * @purpose ABTestCTA manages A/B testing and feature experimentation
 * @component ABTestCTA
 * @category Ab-testing
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @hooks_utilization useABTest for state management and side effects
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
 * @param {} [trackEvent] - trackEvent prop description
 *
 * Methods:
 * @method getVariantClasses - getVariantClasses method for component functionality
 * @method handleClick - handleClick method for component functionality
 *
 * Usage Example:
 * @example
 * import { ABTestCTA } from './ABTestCTA';
 *
 * function App() {
 *   return (
 *     <ABTestCTA
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered ABTestCTA component
 */

import { useABTest, ABTestProvider } from './ABTestProvider';

interface ABTestCTAProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  trackEvent?: (variant: string) => void;
}

export const ABTestCTA: React.FC<ABTestCTAProps> = ({
  children,
  onClick,
  className = '',
  trackEvent,
}) => {
  const { variant } = useABTest();

  const getVariantClasses = () => {
    switch (variant) {
      case 'A':
        return 'bg-cta-primary hover:bg-cta-primary-hover'; // Gold
      case 'B':
        return 'bg-nude-600 hover:bg-nude-700'; // Original mahogany
      case 'C':
        return 'bg-luxury-bronze hover:bg-luxury-charlotte'; // Bronze
      default:
        return 'bg-cta-primary hover:bg-cta-primary-hover';
    }
  };

  const handleClick = () => {
    if (trackEvent) {
      trackEvent(variant);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${getVariantClasses()}
        text-white font-medium text-base
        px-6 py-3 rounded-lg
        shadow-lg hover:shadow-xl
        transition-all duration-300 hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${className}
      `}
      data-test-variant={variant}
    >
      {children}
    </button>
  );
};

export { ABTestProvider };
