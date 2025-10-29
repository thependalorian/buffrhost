'use client';
/**
 * Restaurants Listing Page
 *
 * Displays all available restaurants with search, filter, and booking capabilities
 * Features: Restaurant cards, search, filters, sorting, Buffr branding
 * Location: app/restaurants/page.tsx
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
  SofiaAIAssistant
} from '@/components/landing';
import { PropertySearchLayout } from '@/components/layout';
import { getRestaurants, PropertyFilters as ApiPropertyFilters } from '@/lib/api/properties-api';
import { Property } from '@/lib/types/database';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';

// Transform database Property to display format
interface RestaurantDisplay {
  id: string;
  name: string;
  location: string;
  address: string;
  description: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  imageUrl: string;
  phone?: string;
  email?: string;
  website?: string;
  features: string[];
  isOpen: boolean;
  openingHours: string;
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantDisplay[]>([]);
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

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
    { value: 'outdoor_seating', label: 'Outdoor Seating' },
    { value: 'takeout', label: 'Takeout' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'reservations', label: 'Reservations' },
    { value: 'private_dining', label: 'Private Dining' },
    { value: 'bar', label: 'Bar' },
    { value: 'wine_list', label: 'Wine List' },
    { value: 'live_music', label: 'Live Music' },
    { value: 'pet_friendly', label: 'Pet Friendly' },
    { value: 'wheelchair_accessible', label: 'Wheelchair Accessible' },
  ];

  useEffect(() => {
    loadRestaurants();
  }, []);

  // Reload restaurants when search query or filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadRestaurants();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters.location]);

  const transformPropertyToRestaurant = (property: Property): RestaurantDisplay => {
    // Get first image URL or use placeholder
    const imageUrl = property.images && typeof property.images === 'object' && 'url' in property.images 
      ? (property.images as any).url 
      : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

    // Extract amenities from property amenities
    const features = property.amenities && typeof property.amenities === 'object' 
      ? Object.keys(property.amenities).filter(key => (property.amenities as any)[key] === true)
      : [];

    return {
      id: property.id,
      name: property.name,
      location: `${property.city || ''}, ${property.region || ''}`.replace(/^,\s*|,\s*$/g, ''),
      address: property.address,
      description: property.description || 'A wonderful dining experience awaits you.',
      cuisine: property.restaurant_details?.cuisine_type || 'International',
      rating: property.average_rating || 0,
      reviewCount: property.total_reviews || 0,
      priceRange: property.restaurant_details?.price_range || '$$',
      imageUrl,
      phone: property.phone,
      email: property.email,
      website: property.website,
      features: features.map(f => f.charAt(0).toUpperCase() + f.slice(1).replace(/_/g, ' ')),
      isOpen: true, // Would be calculated from opening hours
      openingHours: 'Mon-Sun: 11:00 AM - 10:00 PM', // Would come from restaurant_details table
    };
  };

  const loadRestaurants = async () => {
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

      const response = await getRestaurants(apiFilters);

      if (response.success && response.data) {
        const transformedRestaurants = response.data.properties.map(transformPropertyToRestaurant);
        setRestaurants(transformedRestaurants);
      } else {
        setError(response.error || 'Failed to load restaurants');
      }
    } catch (err) {
      console.error('Error loading restaurants:', err);
      setError('Failed to load restaurants');
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
            <p className="text-nude-600">Loading restaurants...</p>
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
            <button 
              onClick={loadRestaurants}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-50/30">
      <Navigation onStartTrial={() => setShowWaitlistModal(true)} />
      
      <PropertySearchHero
        title="Savor Exceptional"
        subtitle="Restaurants"
        description="From local gems to fine dining experiences, discover culinary excellence with Sofia's expert recommendations"
        searchPlaceholder="Search restaurants by name, cuisine, or location..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          <PropertyFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            amenityOptions={amenityOptions}
          />

          <main className="flex-1">
            <PropertyGrid
              properties={restaurants}
              loading={loading}
              type="restaurant"
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
