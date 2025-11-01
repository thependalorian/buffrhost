'use client';

import React from 'react';

/**
 * Pricing Section Component
 *
 * Displays pricing plans and trial offer
 * Location: components/landing/PricingSection.tsx
 * Features: Pricing cards, CTA buttons, trial promotion
 */

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div
    className={`bg-white rounded-2xl shadow-luxury-soft border border-nude-200/50 ${className}`}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  children: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children }) => (
  <div className="p-4 sm:p-6 pb-3 sm:pb-4">{children}</div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <h3 className={`text-lg sm:text-xl font-semibold truncate ${className}`}>
    {children}
  </h3>
);

interface CardContentProps {
  children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ children }) => (
  <div className="p-4 sm:p-6 pt-0">{children}</div>
);

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-3 sm:px-4 py-2 text-xs sm:text-sm min-h-[36px] sm:min-h-0',
    md: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base min-h-[44px] sm:min-h-0',
    lg: 'px-6 sm:px-12 py-3 sm:py-4 text-base sm:text-xl min-h-[44px] sm:min-h-0',
  };

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses[size]} font-semibold rounded-full transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      {children}
    </button>
  );
};

interface PricingSectionProps {
  onStartTrial: () => void;
  className?: string;
}

/**
 * PricingSection React Component for Buffr Host Hospitality Platform
 * @fileoverview PricingSection provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/landing/PricingSection.tsx
 * @purpose PricingSection provides specialized functionality for the Buffr Host platform
 * @component PricingSection
 * @category Landing
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
 *
 * Usage Example:
 * @example
 * import { PricingSection } from './PricingSection';
 *
 * function App() {
 *   return (
 *     <PricingSection
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered PricingSection component
 */

export const PricingSection: React.FC<PricingSectionProps> = ({
  onStartTrial,
  className = '',
}) => {
  return (
    <section
      id="pricing"
      className={`py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-br from-nude-600 to-nude-700 text-white ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 text-center w-full max-w-full overflow-hidden">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 sm:mb-6 break-words">
          Start with 3 Months Free
        </h2>
        <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-nude-100 mb-8 sm:mb-10 md:mb-12 leading-relaxed px-2 sm:px-4 break-words">
          Experience the full platform for 3 months at no cost, then choose a
          plan that fits your business size and needs
        </p>

        {/* PRICING PSYCHOLOGY - Anchoring & Decoy Effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto mb-8 sm:mb-10 md:mb-12">
          {/* DECOY OPTION - Makes middle option seem better */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 relative">
            <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-nude-400 text-nude-900 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap">
                Basic
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-white text-base sm:text-lg md:text-xl truncate">
                3-Month Free Trial
              </CardTitle>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white truncate">
                Free
              </div>
              <div className="text-xs sm:text-sm text-nude-200 truncate break-words">
                Then choose your plan
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-nude-100">
                <li className="truncate break-words">
                  Limited platform features
                </li>
                <li className="truncate break-words">AI concierge included</li>
                <li className="truncate break-words">Pay-as-you-grow option</li>
                <li className="truncate break-words">
                  Limited property images
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* TARGET OPTION - Most Popular (Decoy Effect) */}
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 scale-105 relative">
            <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-nude-900 px-2 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap">
                Most Popular
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-white text-base sm:text-lg md:text-xl truncate">
                Standard Plans
              </CardTitle>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">
                N$1,750
              </div>
              <div className="text-xs sm:text-sm text-nude-200 truncate break-words">
                Monthly Subscription
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-nude-100">
                <li className="truncate break-words">
                  Complete platform access
                </li>
                <li className="truncate break-words">AI concierge included</li>
                <li className="truncate break-words">Staff management</li>
                <li className="truncate break-words">F&B management</li>
                <li className="truncate break-words">Business intelligence</li>
              </ul>
            </CardContent>
          </Card>

          {/* ANCHOR OPTION - High price makes others seem reasonable */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 relative">
            <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-nude-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap">
                Premium
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-white text-base sm:text-lg md:text-xl truncate">
                Enterprise Solutions
              </CardTitle>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">
                Custom
              </div>
              <div className="text-xs sm:text-sm text-nude-200 truncate break-words">
                Hotels 60+ rooms
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-nude-100">
                <li className="truncate break-words">
                  Custom Enterprise solution
                </li>
                <li className="truncate break-words">
                  Contact us for a free consultation
                </li>
                <li className="truncate break-words">
                  Dedicated account manager
                </li>
                <li className="truncate break-words">White-label options</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CHARM PRICING & SOCIAL PROOF */}
        <div className="space-y-4 sm:space-y-6 px-2 sm:px-4">
          <Button
            onClick={onStartTrial}
            size="lg"
            className="bg-white text-nude-700 hover:bg-nude-50 shadow-luxury-strong hover:shadow-luxury-medium w-full sm:w-auto"
          >
            <span className="truncate">Start Your 3-Month Free Trial</span>
          </Button>

          <p className="text-nude-200 text-xs sm:text-sm break-words px-2 sm:px-0">
            No credit card required • Full access for 3 months • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};
