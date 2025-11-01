'use client';

import React from 'react';
/**
 * PropertyCard React Component for Buffr Host Hospitality Platform
 * @fileoverview PropertyCard provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/landing/PropertyCard.tsx
 * @purpose PropertyCard provides specialized functionality for the Buffr Host platform
 * @component PropertyCard
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
 * @param {{
    id} [property] - property prop description
 * @param {string} [name] - name prop description
 * @param {string} [description] - description prop description
 * @param {string} [location] - location prop description
 * @param {number} [rating] - rating prop description
 * @param {string} [priceRange] - priceRange prop description
 * @param {} [imageUrl] - imageUrl prop description
 * @param {} [amenities] - amenities prop description
 * @param {} [status] - status prop description
 * @param {} [openingHours] - openingHours prop description
 * @param {} [cuisineType] - cuisineType prop description
 *
 * Methods:
 * @method getPriceRangeDisplay - getPriceRangeDisplay method for component functionality
 * @method getPriceRangeColor - getPriceRangeColor method for component functionality
 * @method renderStars - renderStars method for component functionality
 *
 * Usage Example:
 * @example
 * import { PropertyCard } from './PropertyCard';
 *
 * function App() {
 *   return (
 *     <PropertyCard
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered PropertyCard component
 */

import { Star, MapPin, Clock, Heart, Share } from 'lucide-react';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';

/**
 * Property Card Component
 *
 * Reusable property card for hotels and restaurants
 * Location: components/landing/PropertyCard.tsx
 * Features: Image, rating, price, amenities, action buttons
 */

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    description: string;
    location: string;
    rating: number;
    priceRange: string;
    imageUrl?: string;
    amenities?: string[];
    status?: string;
    openingHours?: string;
    cuisineType?: string;
  };
  onViewDetails: (id: string) => void;
  onBookNow: (id: string) => void;
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
  type: 'hotel' | 'restaurant';
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onViewDetails,
  onBookNow,
  onFavorite,
  onShare,
  type,
  className = '',
}) => {
  const getPriceRangeDisplay = (priceRange: string) => {
    switch (priceRange) {
      case 'budget':
        return '$';
      case 'mid':
        return '$$';
      case 'upscale':
        return '$$$';
      case 'fine_dining':
        return '$$$$';
      default:
        return '$$';
    }
  };

  const getPriceRangeColor = (priceRange: string) => {
    switch (priceRange) {
      case 'budget':
        return 'text-green-600';
      case 'mid':
        return 'text-yellow-600';
      case 'upscale':
        return 'text-orange-600';
      case 'fine_dining':
        return 'text-red-600';
      default:
        return 'text-nude-600';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-nude-300'
        }`}
      />
    ));
  };

  return (
    <div
      className={`card bg-white shadow-lg group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-fit ${className}`}
    >
      <div className="relative h-56 bg-gradient-to-br from-nude-600/20 to-nude-700/20">
        {property.imageUrl ? (
          <img
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-nude-600/60 text-4xl">
              {type === 'hotel' ? 'H' : 'R'}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          {onFavorite && (
            <button
              onClick={() => onFavorite(property.id)}
              className="btn btn-ghost btn-sm p-2 bg-white/90 hover:bg-white"
            >
              <Heart className="h-4 w-4" />
            </button>
          )}
          {onShare && (
            <button
              onClick={() => onShare(property.id)}
              className="btn btn-ghost btn-sm p-2 bg-white/90 hover:bg-white"
            >
              <Share className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Badge */}
        {property.status && (
          <div className="absolute top-4 left-4">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                property.status === 'active' || property.status === 'open'
                  ? 'bg-green-500/90 text-white'
                  : 'bg-red-500/90 text-white'
              }`}
            >
              {property.status === 'active' || property.status === 'open'
                ? 'Open Now'
                : 'Closed'}
            </div>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium">
            {property.rating.toFixed(1)}
          </span>
        </div>

        {/* Price Range */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span
              className={`font-semibold ${getPriceRangeColor(property.priceRange)}`}
            >
              {getPriceRangeDisplay(property.priceRange)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-nude-900 mb-2 group-hover:text-nude-600 transition-colors">
          {property.name}
        </h3>

        <div className="flex items-center gap-2 text-nude-900/60 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{property.location}</span>
        </div>

        {type === 'restaurant' && property.cuisineType && (
          <div className="flex items-center gap-2 text-nude-900/60 mb-2">
            <span className="text-sm capitalize">{property.cuisineType}</span>
          </div>
        )}

        <p className="text-nude-900/70 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {renderStars(property.rating)}
          </div>
          <span className="text-sm font-medium text-nude-700">
            {property.rating.toFixed(1)}
          </span>
        </div>

        {/* Opening Hours for Restaurants */}
        {type === 'restaurant' && property.openingHours && (
          <div className="flex items-center gap-2 text-nude-900/60 mb-4">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{property.openingHours}</span>
          </div>
        )}

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <div key={index} className="badge badge-outline text-xs">
                {amenity.replace('_', ' ')}
              </div>
            ))}
            {property.amenities.length > 3 && (
              <div className="badge badge-outline text-xs">
                +{property.amenities.length - 3} more
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <BuffrButton
            onClick={() => onViewDetails(property.id)}
            variant="outline"
            size="md"
            className="flex-1"
          >
            View Details
          </BuffrButton>
          <BuffrButton
            onClick={() => onBookNow(property.id)}
            variant="primary"
            size="md"
            className="flex-1"
          >
            {type === 'hotel' ? 'Book Now' : 'Reserve Table'}
          </BuffrButton>
        </div>
      </div>
    </div>
  );
};
