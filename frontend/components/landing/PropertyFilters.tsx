'use client';

import React from 'react';
import { Star, MapPin, Clock } from 'lucide-react';

/**
 * Property Filters Component
 * 
 * Reusable filters sidebar for property search pages
 * Location: components/landing/PropertyFilters.tsx
 * Features: Location, price range, rating, amenities, open now filters
 */

interface FilterOption {
  value: string;
  label: string;
}

interface PropertyFiltersProps {
  filters: {
    location: string;
    priceRange: string;
    rating: number;
    amenities: string[];
    openNow: boolean;
  };
  onFilterChange: (key: string, value: any) => void;
  amenityOptions?: FilterOption[];
  className?: string;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFilterChange,
  amenityOptions = [],
  className = ''
}) => {
  const priceRangeOptions = [
    { value: '', label: 'Any Price' },
    { value: 'budget', label: '$ - Budget Friendly' },
    { value: 'mid', label: '$$ - Mid-range' },
    { value: 'upscale', label: '$$$ - Upscale' },
    { value: 'fine_dining', label: '$$$$ - Fine Dining' },
  ];

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    onFilterChange('amenities', newAmenities);
  };

  return (
    <aside className={`lg:w-80 space-y-6 ${className}`}>
      <div className="card bg-white shadow-lg p-6">
        <h3 className="text-xl font-semibold text-nude-900 mb-4">Filters</h3>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-nude-900 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Location
          </label>
          <input
            type="text"
            placeholder="City, neighborhood, or area"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-nude-600/20 focus:outline-none focus:ring-2 focus:ring-nude-600/30"
          />
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-nude-900 mb-2">
            Price Range
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => onFilterChange('priceRange', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-nude-600/20 focus:outline-none focus:ring-2 focus:ring-nude-600/30"
          >
            {priceRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-nude-900 mb-2">
            <Star className="w-4 h-4 inline mr-2" />
            Minimum Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => onFilterChange('rating', rating)}
                className={`p-1 ${filters.rating >= rating ? 'text-nude-600' : 'text-nude-900/30'}`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* Open Now */}
        <div className="mb-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={filters.openNow}
              onChange={(e) => onFilterChange('openNow', e.target.checked)}
              className="rounded border-nude-600/20 text-nude-600 focus:ring-nude-600/30"
            />
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium text-nude-900">Open Now</span>
          </label>
        </div>

        {/* Amenities */}
        {amenityOptions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-nude-900 mb-3">
              Features
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {amenityOptions.map((amenity) => (
                <button
                  key={amenity.value}
                  onClick={() => toggleAmenity(amenity.value)}
                  className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors text-sm ${
                    filters.amenities.includes(amenity.value)
                      ? 'bg-nude-600/10 text-nude-600'
                      : 'text-nude-900/70 hover:bg-nude-50'
                  }`}
                >
                  <span className="capitalize">{amenity.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};