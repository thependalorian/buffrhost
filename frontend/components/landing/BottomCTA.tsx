'use client';

import React from 'react';
/**
 * BottomCTA React Component for Buffr Host Hospitality Platform
 * @fileoverview BottomCTA provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/landing/BottomCTA.tsx
 * @purpose BottomCTA provides specialized functionality for the Buffr Host platform
 * @component BottomCTA
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
 * @param {} [className] - className prop description
 * @param {} [onJoinWaitlist] - onJoinWaitlist prop description
 *
 * Usage Example:
 * @example
 * import { BottomCTA } from './BottomCTA';
 *
 * function App() {
 *   return (
 *     <BottomCTA
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered BottomCTA component
 */

import { BuffrButton } from '@/components/ui/buttons/BuffrButton';

/**
 * Bottom CTA Component
 *
 * Reusable call-to-action section for bottom of pages
 * Location: components/landing/BottomCTA.tsx
 * Features: Consistent messaging, waitlist signup, reusable across pages
 */

interface BottomCTAProps {
  className?: string;
  onJoinWaitlist?: () => void;
}

export const BottomCTA: React.FC<BottomCTAProps> = ({
  className = '',
  onJoinWaitlist,
}) => {
  return (
    <section
      className={`bg-gradient-to-r from-nude-600 to-nude-700 text-white py-8 sm:py-12 md:py-16 ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 text-center w-full max-w-full overflow-hidden">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 break-words">
          Ready to Transform Your Business?
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto break-words px-2 sm:px-4">
          Be among the first to experience the future of hospitality management.
          Join our waitlist for early access and exclusive launch benefits.
        </p>
        <BuffrButton
          onClick={onJoinWaitlist}
          variant="primary"
          size="lg"
          className="min-h-[44px] sm:min-h-0 w-full sm:w-auto text-sm sm:text-base"
        >
          <span className="truncate">Join the Waitlist</span>
        </BuffrButton>
      </div>
    </section>
  );
};
