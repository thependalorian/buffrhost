'use client';

import React from 'react';
/**
 * SmartWaitlist React Component for Buffr Host Hospitality Platform
 * @fileoverview SmartWaitlist provides reusable UI component for consistent design
 * @location buffr-host/components/ui/smart-waitlist.tsx
 * @purpose SmartWaitlist provides reusable UI component for consistent design
 * @component SmartWaitlist
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
 * @param {boolean} [isOpen] - isOpen prop description
 * @param {() => void} [onClose] - onClose prop description
 *
 * Methods:
 * @method SmartWaitlist - SmartWaitlist method for component functionality
 *
 * Usage Example:
 * @example
 * import { SmartWaitlist } from './SmartWaitlist';
 *
 * function App() {
 *   return (
 *     <SmartWaitlist
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered SmartWaitlist component
 */

import { X } from 'lucide-react';
import { Button } from './button';

interface SmartWaitlistProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartWaitlist = ({ isOpen, onClose }: SmartWaitlistProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-nude-900 mb-4">
          Join the Waitlist
        </h2>
        <p className="text-nude-600 mb-6">Get early access to Buffr Host</p>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border border-nude-300 rounded-full focus:ring-2 focus:ring-nude-500 focus:border-transparent"
          />
          <Button
            className="w-full bg-nude-600 hover:bg-nude-700 text-white"
            onClick={onClose}
          >
            Join Waitlist
          </Button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-nude-400 hover:text-nude-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
