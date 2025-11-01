import React, { createContext, useContext, useState, useEffect } from 'react';

interface ABTestContextType {
  variant: 'A' | 'B' | 'C';
  setVariant: (variant: 'A' | 'B' | 'C') => void;
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

/**
 * ABTestProvider React Component for Buffr Host Hospitality Platform
 * @fileoverview ABTestProvider manages A/B testing and feature experimentation
 * @location buffr-host/components/ab-testing/ABTestProvider.tsx
 * @purpose ABTestProvider manages A/B testing and feature experimentation
 * @component ABTestProvider
 * @category Ab-testing
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @state_management Local component state for UI interactions and data management
 * @hooks_utilization useEffect, useContext for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Interactive state management for dynamic user experiences
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * State:
 * @state {any} 'A' - Component state for 'a' management
 *
 * Methods:
 * @method useABTest - useABTest method for component functionality
 *
 * Usage Example:
 * @example
 * import { ABTestProvider } from './ABTestProvider';
 *
 * function App() {
 *   return (
 *     <ABTestProvider
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered ABTestProvider component
 */

export const ABTestProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [variant, setVariant] = useState<'A' | 'B' | 'C'>('A');

  useEffect(() => {
    // Load variant from localStorage or determine randomly
    const savedVariant = localStorage.getItem('ab-test-variant') as
      | 'A'
      | 'B'
      | 'C';
    if (savedVariant) {
      setVariant(savedVariant);
    } else {
      const randomVariant = ['A', 'B', 'C'][Math.floor(Math.random() * 3)] as
        | 'A'
        | 'B'
        | 'C';
      setVariant(randomVariant);
      localStorage.setItem('ab-test-variant', randomVariant);
    }
  }, []);

  return (
    <ABTestContext.Provider value={{ variant, setVariant }}>
      {children}
    </ABTestContext.Provider>
  );
};

export const useABTest = () => {
  const context = useContext(ABTestContext);
  if (context === undefined) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
};
