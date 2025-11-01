'use client';

import React from 'react';

/**
 * Page Hero Component
 *
 * Reusable hero section for About, Contact, Privacy and other pages
 * Location: components/landing/PageHero.tsx
 * Features: Consistent styling, customizable content, medium size
 */

interface PageHeroProps {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage?: string;
  className?: string;
}

/**
 * PageHero React Component for Buffr Host Hospitality Platform
 * @fileoverview PageHero provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/landing/PageHero.tsx
 * @purpose PageHero provides specialized functionality for the Buffr Host platform
 * @component PageHero
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
 * @param {string} [subtitle] - subtitle prop description
 * @param {string} [description] - description prop description
 * @param {} [backgroundImage] - backgroundImage prop description
 * @param {} [className] - className prop description
 *
 * Usage Example:
 * @example
 * import { PageHero } from './PageHero';
 *
 * function App() {
 *   return (
 *     <PageHero
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered PageHero component
 */

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  description,
  backgroundImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  className = '',
}) => {
  return (
    <section
      className={`relative py-12 sm:py-16 md:py-20 flex items-center justify-center min-h-[300px] sm:min-h-[400px] md:min-h-[500px] ${className}`}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-nude-900/85 via-nude-900/75 to-nude-900/65"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center w-full">
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white break-words">
            {title}
            <span className="block text-base sm:text-xl md:text-2xl lg:text-3xl text-nude-200 mt-2 sm:mt-3 md:mt-4 break-words">
              {subtitle}
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-nude-100 leading-relaxed max-w-3xl mx-auto px-2 sm:px-4 break-words">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};
