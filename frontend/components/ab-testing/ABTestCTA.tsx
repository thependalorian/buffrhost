import React from 'react';
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
