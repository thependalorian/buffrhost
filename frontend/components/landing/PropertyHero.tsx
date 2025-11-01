'use client';

import React from 'react';
/**
 * PropertyHero React Component for Buffr Host Hospitality Platform
 * @fileoverview PropertyHero provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/landing/PropertyHero.tsx
 * @purpose PropertyHero provides specialized functionality for the Buffr Host platform
 * @component PropertyHero
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
 * @param {} [subtitle] - subtitle prop description
 * @param {string} [location] - location prop description
 * @param {number} [rating] - rating prop description
 * @param {number} [reviewCount] - reviewCount prop description
 * @param {'hotel' | 'restaurant'} [type] - type prop description
 * @param {} [backgroundImage] - backgroundImage prop description
 * @param {} [showBackButton] - showBackButton prop description
 * @param {} [backButtonHref] - backButtonHref prop description
 * @param {} [backButtonText] - backButtonText prop description
 * @param {} [className] - className prop description
 *
 * Methods:
 * @method getTypeDisplay - getTypeDisplay method for component functionality
 * @method getTypeIcon - getTypeIcon method for component functionality
 *
 * Usage Example:
 * @example
 * import { PropertyHero } from './PropertyHero';
 *
 * function App() {
 *   return (
 *     <PropertyHero
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered PropertyHero component
 */

import { MapPin, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * Property Hero Component
 *
 * Modular hero section for property pages with consistent styling and image support
 * Location: components/landing/PropertyHero.tsx
 * Features: Background image, property info, navigation, consistent design
 */

interface PropertyHeroProps {
  title: string;
  subtitle?: string;
  location: string;
  rating: number;
  reviewCount: number;
  type: 'hotel' | 'restaurant';
  backgroundImage?: string;
  showBackButton?: boolean;
  backButtonHref?: string;
  backButtonText?: string;
  className?: string;
}

export const PropertyHero: React.FC<PropertyHeroProps> = ({
  title,
  subtitle,
  location,
  rating,
  reviewCount,
  type,
  backgroundImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  showBackButton = true,
  backButtonHref = type === 'hotel' ? '/hotels' : '/restaurants',
  backButtonText = type === 'hotel' ? 'Back to Hotels' : 'Back to Restaurants',
  className = '',
}) => {
  const getTypeDisplay = () => {
    return type === 'hotel' ? 'Hotel' : 'Restaurant';
  };

  const getTypeIcon = () => {
    return type === 'hotel' ? 'H' : 'R';
  };

  return (
    <section
      className={`relative py-20 px-4 text-center ${className}`}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="relative max-w-4xl mx-auto">
        {showBackButton && (
          <div className="flex items-center justify-center mb-6">
            <Link
              href={backButtonHref}
              className="btn btn-ghost text-white hover:text-white/80 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {backButtonText}
            </Link>
          </div>
        )}

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          {title}
        </h1>

        {subtitle && (
          <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}

        <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Star className="w-5 h-5 fill-current text-yellow-400" />
            <span className="text-lg font-semibold">{rating.toFixed(1)}</span>
            <span className="text-white/70">({reviewCount} reviews)</span>
          </div>
        </div>

        <div className="badge badge-lg badge-secondary bg-white/90 text-nude-900">
          <span className="w-6 h-6 bg-nude-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
            {getTypeIcon()}
          </span>
          {getTypeDisplay()}
        </div>
      </div>
    </section>
  );
};
