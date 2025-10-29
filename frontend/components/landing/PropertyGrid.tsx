'use client';

import React from 'react';
import { PropertyCard } from './PropertyCard';
import { Search, Utensils } from 'lucide-react';

/**
 * Property Grid Component
 * 
 * Reusable property grid with loading states and empty states
 * Location: components/landing/PropertyGrid.tsx
 * Features: Loading skeleton, empty state, property cards
 */

interface Property {
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
}

interface PropertyGridProps {
  properties: Property[];
  loading: boolean;
  type: 'hotel' | 'restaurant';
  onViewDetails: (id: string) => void;
  onBookNow: (id: string) => void;
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
  onClearFilters?: () => void;
  className?: string;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  loading,
  type,
  onViewDetails,
  onBookNow,
  onFavorite,
  onShare,
  onClearFilters,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-nude-50/50 rounded-2xl h-64 mb-4" />
            <div className="space-y-2">
              <div className="bg-nude-50/50 rounded h-4 w-3/4" />
              <div className="bg-nude-50/50 rounded h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 rounded-full bg-nude-600/10 flex items-center justify-center mx-auto mb-6">
          {type === 'hotel' ? (
            <Search className="w-8 h-8 text-nude-600/60" />
          ) : (
            <Utensils className="w-8 h-8 text-nude-600/60" />
          )}
        </div>
        <h3 className="text-2xl font-semibold text-nude-900 mb-4">
          No {type === 'hotel' ? 'Hotels' : 'Restaurants'} Found
        </h3>
        <p className="text-nude-900/60 mb-8 max-w-md mx-auto">
          Try adjusting your search criteria or filters to find more {type === 'hotel' ? 'hotels' : 'restaurants'}.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="btn btn-primary"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-nude-900">
          {properties.length} {type === 'hotel' ? 'Hotel' : 'Restaurant'}
          {properties.length !== 1 ? 's' : ''} Found
        </h2>
        <select className="px-4 py-2 rounded-lg border border-nude-600/20 focus:outline-none focus:ring-2 focus:ring-nude-600/30">
          <option>Sort by Relevance</option>
          <option>Rating: High to Low</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Distance</option>
          {type === 'hotel' ? (
            <option>Newest First</option>
          ) : (
            <option>Name A-Z</option>
          )}
        </select>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 ${className}`}>
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            type={type}
            onViewDetails={onViewDetails}
            onBookNow={onBookNow}
            onFavorite={onFavorite}
            onShare={onShare}
          />
        ))}
      </div>
    </>
  );
};