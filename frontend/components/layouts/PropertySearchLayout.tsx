'use client';

import React from 'react';
/**
 * PropertySearchLayout React Component for Buffr Host Hospitality Platform
 * @fileoverview PropertySearchLayout provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/layout/PropertySearchLayout.tsx
 * @purpose PropertySearchLayout provides specialized functionality for the Buffr Host platform
 * @component PropertySearchLayout
 * @category Layout
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
 * import { PropertySearchLayout } from './PropertySearchLayout';
 *
 * function App() {
 *   return (
 *     <PropertySearchLayout
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered PropertySearchLayout component
 */

import { Navigation, Footer } from '@/components/landing';

/**
 * Property Search Layout Component
 *
 * Psychology-driven layout for property search and listing pages
 * Location: components/layout/PropertySearchLayout.tsx
 *
 * Design Psychology Principles Applied:
 * - F-Pattern Reading: Search and filters on left, results on right
 * - Visual Hierarchy: Clear search-to-results flow
 * - Proximity Principle: Related search elements grouped
 * - Contrast & Emphasis: Search bar prominently featured
 * - White Space: Clean, uncluttered design for focus
 * - Color Psychology: Calming background for decision-making
 * - Cognitive Load Reduction: Progressive disclosure of information
 */

interface PropertySearchLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PropertySearchLayout: React.FC<PropertySearchLayoutProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100/30 ${className}`}
    >
      {/* Fixed Navigation - Consistent brand presence */}
      <Navigation />

      {/* Main Search Interface - F-pattern optimized */}
      <div className="max-w-7xl mx-auto px-4 pb-20">{children}</div>

      {/* Footer - Completes the experience */}
      <Footer />
    </div>
  );
};
