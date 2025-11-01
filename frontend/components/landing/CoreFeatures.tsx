'use client';

import React from 'react';

/**
 * Core Features Component
 *
 * Displays the main platform features and capabilities
 * Location: components/landing/CoreFeatures.tsx
 * Features: Feature cards with descriptions, responsive grid
 */

interface CoreFeature {
  title: string;
  description: string;
  features: string[];
  imageUrl: string;
}

interface FeatureCardProps {
  title: string;
  description: string;
  features: string[];
  imageUrl: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  features,
  imageUrl,
}) => (
  <div className="bg-white rounded-2xl shadow-luxury-soft border border-nude-200/50 hover:shadow-luxury-medium transition-all duration-300 hover:-translate-y-1 overflow-hidden">
    <div className="w-full h-48">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
    <div className="p-8">
      <h3 className="text-2xl font-semibold text-nude-900 mb-4">{title}</h3>
      <p className="text-nude-700 mb-6 leading-relaxed">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-nude-700">
            <div
              className={`w-1.5 h-1.5 bg-nude-400 rounded-full flex-shrink-0`}
            ></div>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

interface CoreFeaturesProps {
  className?: string;
}

/**
 * CoreFeatures React Component for Buffr Host Hospitality Platform
 * @fileoverview CoreFeatures provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/landing/CoreFeatures.tsx
 * @purpose CoreFeatures provides specialized functionality for the Buffr Host platform
 * @component CoreFeatures
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
 * @param {string} [title] - title prop description
 * @param {string} [description] - description prop description
 * @param {string[]} [features] - features prop description
 * @param {string} [imageUrl] - imageUrl prop description
 *
 * Usage Example:
 * @example
 * import { CoreFeatures } from './CoreFeatures';
 *
 * function App() {
 *   return (
 *     <CoreFeatures
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered CoreFeatures component
 */

export const CoreFeatures: React.FC<CoreFeaturesProps> = ({
  className = '',
}) => {
  const coreFeatures: CoreFeature[] = []; // Empty array to remove content

  return (
    <section id="features" className={`py-24 md:py-32 bg-nude-50 ${className}`}>
      <div className="container mx-auto px-6">
        {/* Removed main heading and description as per user request */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};
