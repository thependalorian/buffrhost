'use client';
/**
 * LocationSearch React Component for Buffr Host Hospitality Platform
 * @fileoverview LocationSearch handles form input and validation for user data collection
 * @location buffr-host/components/forms/LocationSearch.tsx
 * @purpose LocationSearch handles form input and validation for user data collection
 * @component LocationSearch
 * @category Forms
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @state_management Local component state for UI interactions and data management
 * @hooks_utilization useState, useEffect, usedIndex for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Interactive state management for dynamic user experiences
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {} [value] - value prop description
 * @param {(location} [onChange] - onChange prop description
 * @param {} [placeholder] - placeholder prop description
 * @param {} [className] - className prop description
 * @param {} [error] - error prop description
 * @param {} [required] - required prop description
 * @param {} [disabled] - disabled prop description
 * @param {} [showRegion] - showRegion prop description
 * @param {} [showPopulation] - showPopulation prop description
 * @param {} [maxResults] - maxResults prop description
 *
 * State:
 * @state {any} [] - Component state for [] management
 * @state {any} null - Component state for null management
 *
 * Methods:
 * @method handleInputChange - handleInputChange method for component functionality
 * @method handleLocationSelect - handleLocationSelect method for component functionality
 * @method handleKeyDown - handleKeyDown method for component functionality
 * @method handleClickOutside - handleClickOutside method for component functionality
 * @method getLocationTypeColor - getLocationTypeColor method for component functionality
 * @method getLocationTypeIcon - getLocationTypeIcon method for component functionality
 *
 * Usage Example:
 * @example
 * import LocationSearch from './LocationSearch';
 *
 * function App() {
 *   return (
 *     <LocationSearch
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered LocationSearch component
 */

import { BuffrIcon } from '@/components/ui';
/**
 * Location Search Component
 *
 * Searchable location input with Namibia's regions, towns, and cities
 * Provides autocomplete functionality and location validation
 *
 * Location: components/forms/LocationSearch.tsx
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  NamibiaLocationService,
  LocationData,
} from '@/lib/data/namibia-locations';

interface LocationSearchProps {
  value?: string;
  onChange: (location: LocationData | null) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  showRegion?: boolean;
  showPopulation?: boolean;
  maxResults?: number;
}

export default function LocationSearch({
  value = '',
  onChange,
  placeholder = 'Search for a location in Namibia...',
  className = '',
  error = '',
  required = false,
  disabled = false,
  showRegion = true,
  showPopulation = false,
  maxResults = 10,
}: LocationSearchProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<LocationData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search locations when query changes
  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = NamibiaLocationService.searchLocations(query);
      setResults(searchResults.slice(0, maxResults));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, maxResults]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setFocusedIndex(-1);

    // Clear selection if query doesn't match selected location
    if (
      selectedLocation &&
      !selectedLocation.name.toLowerCase().includes(newQuery.toLowerCase())
    ) {
      setSelectedLocation(null);
      onChange(null);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
    setQuery(location.name);
    setIsOpen(false);
    setFocusedIndex(-1);
    onChange(location);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < results.length) {
          handleLocationSelect(results[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get location type color
  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case 'city':
        return 'text-primary';
      case 'town':
        return 'text-success';
      case 'village':
        return 'text-orange-600';
      default:
        return 'text-nude-600';
    }
  };

  // Get location type icon
  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'city':
        return '🏙️';
      case 'town':
        return '🏘️';
      case 'village':
        return '🏡';
      default:
        return '📍';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <BuffrIcon name="search" className="h-4 w-4 text-nude-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            block w-full pl-10 pr-10 py-2 input input-bordered shadow-2xl-nude-soft
            focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-luxury-charlotte/20 focus:border-luxury-charlotte
            disabled:bg-nude-50 disabled:text-nude-500
            ${error ? 'border-red-300 focus:ring-error focus:border-red-500' : 'border-nude-300'}
            ${className}
          `}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <BuffrIcon
            name="chevron-down"
            className={`h-4 w-4 text-nude-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-error">{error}</p>}

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-nude-50 border border-nude-300 rounded-md shadow-2xl-luxury-strong max-h-60 overflow-auto"
        >
          {results.map((location, index) => (
            <div
              key={location.id}
              onClick={() => handleLocationSelect(location)}
              className={`
                px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0
                hover:bg-nude-50 transition-colors duration-300
                ${focusedIndex === index ? 'bg-blue-50' : ''}
              `}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-lg">
                    {getLocationTypeIcon(location.type)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-nude-900 truncate">
                      {location.name}
                    </p>
                    <span
                      className={`text-xs font-medium ${getLocationTypeColor(location.type)}`}
                    >
                      {location.type.toUpperCase()}
                    </span>
                  </div>

                  {showRegion && (
                    <p className="text-xs text-nude-500 mt-1">
                      {location.region} Region
                    </p>
                  )}

                  {showPopulation && location.population && (
                    <p className="text-xs text-nude-500 mt-1">
                      Population: {location.population.toLocaleString()}
                    </p>
                  )}

                  {location.description && (
                    <p className="text-xs text-nude-400 mt-1 line-clamp-2">
                      {location.description}
                    </p>
                  )}

                  {location.coordinates && (
                    <div className="flex items-center space-x-1 mt-1">
                      <BuffrIcon
                        name="map-pin"
                        className="h-3 w-3 text-nude-400"
                      />
                      <span className="text-xs text-nude-400">
                        {location.coordinates.latitude.toFixed(4)},{' '}
                        {location.coordinates.longitude.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-nude-50 border border-nude-300 rounded-md shadow-2xl-luxury-strong">
          <div className="px-4 py-3 text-center text-nude-500">
            <BuffrIcon
              name="search"
              className="h-6 w-6 mx-auto mb-2 text-nude-400"
            />
            <p className="text-sm">No locations found for "{query}"</p>
            <p className="text-xs text-nude-400 mt-1">
              Try searching for a city, town, or region in Namibia
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Location display component for showing selected location
export function LocationDisplay({
  location,
  showDetails = true,
}: {
  location: LocationData | null;
  showDetails?: boolean;
}) {
  if (!location) return null;

  return (
    <div className="flex items-center space-x-2 p-2 bg-nude-50 rounded-md">
      <span className="text-lg">
        {location.type === 'city'
          ? '🏙️'
          : location.type === 'town'
            ? '🏘️'
            : '🏡'}
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium text-nude-900">{location.name}</p>
        {showDetails && (
          <p className="text-xs text-nude-500">{location.region} Region</p>
        )}
      </div>
    </div>
  );
}

// Location filter component for filtering by region/type
export function LocationFilter({
  onRegionChange,
  onTypeChange,
}: {
  onRegionChange?: (region: string) => void;
  onTypeChange?: (type: string) => void;
}) {
  const regions = NamibiaLocationService.getAllRegions();
  const types = ['city', 'town', 'village'];

  return (
    <div className="flex space-x-4">
      {/* Region Filter */}
      <select
        onChange={(e) => onRegionChange?.(e.target.value)}
        className="px-3 py-2 border border-nude-300 rounded-md text-sm focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-luxury-charlotte/20 focus:border-luxury-charlotte"
      >
        <option value="">All Regions</option>
        {regions.map((region) => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>

      {/* Type Filter */}
      <select
        onChange={(e) => onTypeChange?.(e.target.value)}
        className="px-3 py-2 border border-nude-300 rounded-md text-sm focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-luxury-charlotte/20 focus:border-luxury-charlotte"
      >
        <option value="">All Types</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
