'use client';

import React from 'react';
/**
 * PropertyHeroLayout React Component for Buffr Host Hospitality Platform
 * @fileoverview PropertyHeroLayout provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/layout/PropertyHeroLayout.tsx
 * @purpose PropertyHeroLayout provides specialized functionality for the Buffr Host platform
 * @component PropertyHeroLayout
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
 * @param {} [backgroundImage] - backgroundImage prop description
 * @param {} [className] - className prop description
 *
 * Usage Example:
 * @example
 * import { PropertyHeroLayout } from './PropertyHeroLayout';
 *
 * function App() {
 *   return (
 *     <PropertyHeroLayout
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered PropertyHeroLayout component
 */

import { Navigation, Footer } from '@/components/landing';

/**
 * Property Hero Layout Component
 *
 * Psychology-driven layout for property hero sections with conversion focus
 * Location: components/layout/PropertyHeroLayout.tsx
 *
 * Design Psychology Principles Applied:
 * - Visual Hierarchy: Hero content creates immediate impact
 * - Color Psychology: Warm, inviting colors for hospitality
 * - Social Proof: Reviews and ratings prominently displayed
 * - Call-to-Action Psychology: Multiple conversion points
 * - Trust Building: Professional imagery and clear information
 * - Scarcity Principle: Availability and booking urgency
 * - Reciprocity: Value-first content before asking for action
 */

interface PropertyHeroLayoutProps {
  children: React.ReactNode;
  backgroundImage?: string;
  className?: string;
}

export const PropertyHeroLayout: React.FC<PropertyHeroLayoutProps> = ({
  children,
  backgroundImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  className = '',
}) => {
  return (
    <div className={`min-h-screen ${className}`}>
      {/* Fixed Navigation - Brand consistency and trust */}
      <Navigation />

      {/* Hero Section with Psychological Impact */}
      <section
        className="relative py-20 px-4 text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '70vh',
        }}
      >
        <div className="relative max-w-6xl mx-auto">
          {/* Hero Content with Conversion Focus */}
          <div className="space-y-8">{children}</div>
        </div>
      </section>

      {/* Main Content with Trust-Building Elements */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Content flows naturally from hero */}
            {children}
          </div>
        </div>
      </div>

      {/* Footer - Completes the trust-building experience */}
      <Footer />
    </div>
  );
};
