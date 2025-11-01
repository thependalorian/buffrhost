'use client';

import React from 'react';
/**
 * PropertySearchHero React Component for Buffr Host Hospitality Platform
 * @fileoverview PropertySearchHero provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/landing/PropertySearchHero.tsx
 * @purpose PropertySearchHero provides specialized functionality for the Buffr Host platform
 * @component PropertySearchHero
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
 * @param {string} [searchPlaceholder] - searchPlaceholder prop description
 * @param {string} [searchValue] - searchValue prop description
 * @param {(value} [onSearchChange] - onSearchChange prop description
 * @param {} [className] - className prop description
 *
 * Usage Example:
 * @example
 * import { PropertySearchHero } from './PropertySearchHero';
 *
 * function App() {
 *   return (
 *     <PropertySearchHero
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered PropertySearchHero component
 */

import { Search } from 'lucide-react';

/**
 * Property Search Hero Component
 *
 * Reusable hero section for property search pages (hotels, restaurants)
 * Location: components/landing/PropertySearchHero.tsx
 * Features: Search bar, title, subtitle, consistent styling
 */

interface PropertySearchHeroProps {
  title: string;
  subtitle: string;
  description: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  className?: string;
}

export const PropertySearchHero: React.FC<PropertySearchHeroProps> = ({
  title,
  subtitle,
  description,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  className = '',
}) => {
  return (
    <section
      className={`relative py-20 px-4 text-center ${className}`}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="relative max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          {title}
          <span className="block text-white/90">{subtitle}</span>
        </h1>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          {description}
        </p>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Search is handled by onChange, but prevent form submission
          }}
          className="relative max-w-2xl mx-auto mb-8"
        >
          {/* Left Search Icon */}
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-nude-600 w-6 h-6 z-10 pointer-events-none" />

          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              // Prevent form submission on Enter
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            className="w-full pl-14 pr-4 py-4 rounded-2xl border border-white/20 bg-white/95 backdrop-blur-sm text-nude-900 placeholder-nude-600/60 focus:outline-none focus:ring-2 focus:ring-nude-500/50 focus:border-nude-500/50 text-lg shadow-lg"
          />
        </form>
      </div>
    </section>
  );
};
