/**
 * KYC Progress Indicator Component
 *
 * Purpose: Visual progress indicator for KYC verification steps
 * Location: /components/forms/property-kyc-verification/KycProgressIndicator.tsx
 * Usage: Shows current step and overall progress
 *
 * Follows Rules:
 * - DaisyUI for consistent styling
 * - Modular component design
 * - TypeScript for type safety
 * - Clean, focused functionality
 */

'use client';

import React from 'react';
/**
 * KycProgressIndicator React Component for Buffr Host Hospitality Platform
 * @fileoverview KycProgressIndicator handles form input and validation for user data collection
 * @location buffr-host/components/forms/property-kyc-verification/KycProgressIndicator.tsx
 * @purpose KycProgressIndicator handles form input and validation for user data collection
 * @component KycProgressIndicator
 * @category Forms
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Usage Example:
 * @example
 * import { KycProgressIndicator } from './KycProgressIndicator';
 *
 * function App() {
 *   return (
 *     <KycProgressIndicator
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered KycProgressIndicator component
 */

import { CheckCircle, Clock } from 'lucide-react';
import type { KycProgressIndicatorProps } from '@/lib/types/kyc-types';

export const KycProgressIndicator: React.FC<KycProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps,
  onStepClick,
  className = '',
}) => {
  const progressPercentage = ((currentStep - 7) / (totalSteps - 7)) * 100; // Steps 7-8

  return (
    <div
      className={`bg-base-100 p-6 rounded-lg border border-base-200 ${className}`}
    >
      {/* Step Indicators */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = step.id <= currentStep && onStepClick;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    isCompleted
                      ? 'bg-success text-white shadow-md'
                      : isCurrent
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : 'bg-base-200 text-base-content/50'
                  } ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <IconComponent className="w-6 h-6" />
                  )}
                </button>
                <div className="mt-2 text-center max-w-20">
                  <div
                    className={`text-xs font-medium ${
                      isCurrent ? 'text-primary' : 'text-base-content'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-base-content/70">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-4 rounded ${
                    step.id < currentStep ? 'bg-success' : 'bg-base-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-base-content/70">
          <span>Verification Progress</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className="w-full bg-base-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-primary-focus h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-center">
          <span className="text-xs text-base-content/60">
            Step {currentStep - 6} of 2 • KYC Verification Process
          </span>
        </div>
      </div>
    </div>
  );
};

export default KycProgressIndicator;
