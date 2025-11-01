'use client';
/**
 * Hotels Listing Page
 *
 * Displays all available hotels with search, filter, and booking capabilities
 * Features: Hotel cards, search, filters, sorting, Buffr branding
 * Location: app/hotels/page.tsx
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Navigation,
  Footer,
  BottomCTA,
  SmartWaitlist,
  PropertySearchHero,
  PropertyFilters,
  PropertyGrid,
  SofiaAIAssistant,
} from '@/components/landing';
import { PropertySearchLayout } from '@/components/layout';
import {
  getHotels,
  PropertyFilters as ApiPropertyFilters,
} from '@/lib/api/properties-api';
import { Property } from '@/lib/types/database';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';

// Transform database Property to display format
interface HotelDisplay {
  id: string;
  name: string;
  location: string;
  address: string;
  description: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  imageUrl: string;
  phone?: string;
  email?: string;
  website?: string;
  features: string[];
  hotelDetails?: {
    starRating: number;
    totalRooms: number;
    availableRooms: number;
    amenities: string[];
  };
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<HotelDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    rating: 0,
    amenities: [] as string[],
    openNow: false,
  });

  useEffect(() => {
    loadHotels();
  }, []);

  // Reload hotels when search query or filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadHotels();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters.location]);

  const transformPropertyToHotel = (property: Property): HotelDisplay => {
    // Get first image URL or use placeholder
    const imageUrl =
      property.images &&
      typeof property.images === 'object' &&
      'url' in property.images
        ? (property.images as any).url
        : 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

    // Extract amenities from property amenities
    const features =
      property.amenities && typeof property.amenities === 'object'
        ? Object.keys(property.amenities).filter(
            (key) => (property.amenities as any)[key] === true
          )
        : [];

    return {
      id: property.id,
      name: property.name,
      location: `${property.city || ''}, ${property.region || ''}`.replace(
        /^,\s*|,\s*$/g,
        ''
      ),
      address: property.address,
      description:
        property.description || 'A wonderful hotel experience awaits you.',
      rating: property.average_rating || 0,
      reviewCount: property.total_reviews || 0,
      priceRange: '$$', // Would come from pricing data
      imageUrl,
      phone: property.phone,
      email: property.email,
      website: property.website,
      features: features.map(
        (f) => f.charAt(0).toUpperCase() + f.slice(1).replace(/_/g, ' ')
      ),
      hotelDetails: {
        starRating: property.hotel_details?.star_rating || 4,
        totalRooms: property.hotel_details?.room_count || 0,
        availableRooms: 0, // Would be calculated from room availability
        amenities: features,
      },
    };
  };

  const loadHotels = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiFilters: ApiPropertyFilters = {
        limit: 50,
        offset: 0,
      };

      if (searchQuery) {
        apiFilters.search = searchQuery;
      }

      if (filters.location) {
        apiFilters.location = filters.location;
      }

      const response = await getHotels(apiFilters);

      if (response.success && response.data) {
        const transformedHotels = response.data.properties.map(
          transformPropertyToHotel
        );
        setHotels(transformedHotels);
      } else {
        setError(response.error || 'Failed to load hotels');
      }
    } catch (err) {
      console.error('Error loading hotels:', err);
      setError('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  // Filtering and sorting is now handled by the PropertyGrid component

  // Rendering functions are now handled by the PropertyCard component

  if (loading) {
    return (
      <div className="bg-nude-50 text-nude-900 font-primary min-h-screen flex flex-col">
        <Navigation onStartTrial={() => setShowWaitlistModal(true)} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nude-600 mx-auto mb-4"></div>
            <p className="text-nude-600">Loading hotels...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-nude-50 text-nude-900 font-primary min-h-screen flex flex-col">
        <Navigation onStartTrial={() => setShowWaitlistModal(true)} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={loadHotels} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleViewDetails = (id: string) => {
    // Navigate to property details page
    window.location.href = `/property/${id}`;
  };

  const handleBookNow = (id: string) => {
    setShowWaitlistModal(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      location: '',
      priceRange: '',
      rating: 0,
      amenities: [],
      openNow: false,
    });
  };

  const amenityOptions = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'parking', label: 'Parking' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'gym', label: 'Gym' },
    { value: 'pool', label: 'Pool' },
    { value: 'spa', label: 'Spa' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-50/30">
      <Navigation onStartTrial={() => setShowWaitlistModal(true)} />

      <PropertySearchHero
        title="Discover Exceptional"
        subtitle="Hotels"
        description="From independent properties to luxury resorts, find your perfect stay with Sofia's personalized recommendations"
        searchPlaceholder="Search hotels by name, location, or amenities..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-20">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Filters - Full Width on Mobile, Sidebar on Desktop */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <PropertyFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              amenityOptions={amenityOptions}
            />
          </aside>

          {/* Main Content - Responsive Grid */}
          <main className="flex-1 min-w-0">
            <PropertyGrid
              properties={hotels}
              loading={loading}
              type="hotel"
              onViewDetails={handleViewDetails}
              onBookNow={handleBookNow}
              onClearFilters={handleClearFilters}
            />
          </main>
        </div>
      </div>

      <Footer />

      <SmartWaitlist
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </div>
  );
}
