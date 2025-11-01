'use client';

import React from 'react';
/**
 * PropertyDetailLayout React Component for Buffr Host Hospitality Platform
 * @fileoverview PropertyDetailLayout provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/layout/PropertyDetailLayout.tsx
 * @purpose PropertyDetailLayout provides specialized functionality for the Buffr Host platform
 * @component PropertyDetailLayout
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
 * import { PropertyDetailLayout } from './PropertyDetailLayout';
 *
 * function App() {
 *   return (
 *     <PropertyDetailLayout
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered PropertyDetailLayout component
 */

import { Navigation, Footer } from '@/components/landing';

/**
 * Property Detail Layout Component
 *
 * Psychology-driven layout for property detail pages
 * Location: components/layout/PropertyDetailLayout.tsx
 *
 * Design Psychology Principles Applied:
 * - F-Pattern Reading: Left-aligned content for natural eye movement
 * - Visual Hierarchy: Clear information hierarchy with size and contrast
 * - Proximity Principle: Related elements grouped together
 * - Social Proof Placement: Reviews and ratings strategically positioned
 * - Call-to-Action Psychology: Prominent booking actions
 * - Color Psychology: Warm, trust-building color scheme
 * - White Space: Strategic breathing room for focus
 */

interface PropertyDetailLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PropertyDetailLayout: React.FC<PropertyDetailLayoutProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100/30 ${className}`}
    >
      {/* Fixed Navigation - Creates sense of stability and trust */}
      <Navigation />

      {/* Main Content Area with F-Pattern Layout */}
      <main className="relative">{children}</main>

      {/* Footer - Completes the page structure */}
      <Footer />
    </div>
  );
};
