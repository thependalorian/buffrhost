'use client';
/**
 * Rooms Listing Page
 *
 * Displays all available rooms across all hotels with search, filter, and booking capabilities
 * Features: Room cards, search, filters, sorting, Buffr branding
 * Location: app/rooms/page.tsx
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BuffrButton,
  BuffrCard,
  BuffrCardContent,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrBadge,
  BuffrIcon,
} from '@/components/ui';

interface Room {
  id: string;
  hotelId: string;
  hotelName: string;
  typeName: string;
  description: string;
  maxOccupancy: number;
  basePrice: number;
  sizeSqm: number;
  bedType: string;
  viewType: string;
  amenities: string[];
  imageUrl: string;
  isActive: boolean;
  rating: number;
  reviewCount: number;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [bedType, setBedType] = useState('');
  const [sortBy, setSortBy] = useState('price');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data
      // In a real app, this would fetch from an API
      const mockRooms: Room[] = [
        {
          id: 'room-1',
          hotelId: '550e8400-e29b-41d4-a716-446655440008',
          hotelName: 'Swakopmund Beach Resort',
          typeName: 'Standard Room',
          description:
            'Comfortable room with ocean views and modern amenities. Perfect for couples and small families.',
          maxOccupancy: 2,
          basePrice: 300,
          sizeSqm: 25,
          bedType: 'queen',
          viewType: 'ocean',
          amenities: [
            'wifi',
            'tv',
            'air_conditioning',
            'ocean_view',
            'minibar',
            'room_service',
          ],
          imageUrl:
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          isActive: true,
          rating: 4.5,
          reviewCount: 23,
        },
        {
          id: 'room-2',
          hotelId: '550e8400-e29b-41d4-a716-446655440008',
          hotelName: 'Swakopmund Beach Resort',
          typeName: 'Deluxe Room',
          description:
            'Spacious room with panoramic ocean views and premium amenities. Features a private balcony.',
          maxOccupancy: 3,
          basePrice: 450,
          sizeSqm: 35,
          bedType: 'king',
          viewType: 'ocean',
          amenities: [
            'wifi',
            'tv',
            'air_conditioning',
            'ocean_view',
            'minibar',
            'balcony',
            'jacuzzi',
            'room_service',
          ],
          imageUrl:
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          isActive: true,
          rating: 4.8,
          reviewCount: 18,
        },
        {
          id: 'room-3',
          hotelId: '550e8400-e29b-41d4-a716-446655440008',
          hotelName: 'Swakopmund Beach Resort',
          typeName: 'Suite',
          description:
            'Luxurious suite with separate living area and stunning ocean views. Perfect for families.',
          maxOccupancy: 4,
          basePrice: 650,
          sizeSqm: 50,
          bedType: 'king',
          viewType: 'ocean',
          amenities: [
            'wifi',
            'tv',
            'air_conditioning',
            'ocean_view',
            'minibar',
            'balcony',
            'jacuzzi',
            'kitchenette',
            'butler_service',
            'room_service',
          ],
          imageUrl:
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          isActive: true,
          rating: 4.9,
          reviewCount: 12,
        },
        {
          id: 'room-4',
          hotelId: '550e8400-e29b-41d4-a716-446655440008',
          hotelName: 'Swakopmund Beach Resort',
          typeName: 'Presidential Suite',
          description:
            'Ultimate luxury with panoramic ocean views and exclusive amenities. Features private elevator access.',
          maxOccupancy: 6,
          basePrice: 1000,
          sizeSqm: 80,
          bedType: 'king',
          viewType: 'ocean',
          amenities: [
            'wifi',
            'tv',
            'air_conditioning',
            'ocean_view',
            'minibar',
            'balcony',
            'jacuzzi',
            'kitchen',
            'butler_service',
            'private_elevator',
            'concierge',
            'room_service',
          ],
          imageUrl:
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          isActive: true,
          rating: 5.0,
          reviewCount: 8,
        },
      ];
      setRooms(mockRooms);
    } catch (err) {
      console.error('Error loading rooms:', err);
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.hotelName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHotel = !selectedHotel || room.hotelName === selectedHotel;
    const matchesPrice =
      !priceRange ||
      (priceRange === 'budget' && room.basePrice < 400) ||
      (priceRange === 'moderate' &&
        room.basePrice >= 400 &&
        room.basePrice < 700) ||
      (priceRange === 'luxury' && room.basePrice >= 700);
    const matchesBedType = !bedType || room.bedType === bedType;

    return matchesSearch && matchesHotel && matchesPrice && matchesBedType;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.basePrice - b.basePrice;
      case 'price-desc':
        return b.basePrice - a.basePrice;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.typeName.localeCompare(b.typeName);
      case 'size':
        return b.sizeSqm - a.sizeSqm;
      default:
        return 0;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: 'NAD',
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <BuffrIcon
        key={i}
        name="star"
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-nude-300'
        }`}
      />
    ));
  };

  const getViewIcon = (viewType: string) => {
    switch (viewType) {
      case 'ocean':
        return 'eye';
      case 'city':
        return 'building';
      case 'garden':
        return 'home';
      case 'mountain':
        return 'mountain';
      case 'pool':
        return 'droplets';
      default:
        return 'eye';
    }
  };

  const getViewColor = (viewType: string) => {
    switch (viewType) {
      case 'ocean':
        return 'text-blue-600';
      case 'city':
        return 'text-gray-600';
      case 'garden':
        return 'text-green-600';
      case 'mountain':
        return 'text-orange-600';
      case 'pool':
        return 'text-cyan-600';
      default:
        return 'text-nude-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nude-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nude-600 mx-auto mb-4"></div>
          <p className="text-nude-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-nude-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-semantic-error mb-4">{error}</p>
          <BuffrButton onClick={loadRooms}>Try Again</BuffrButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nude-50">
      {/* Header */}
      <div className="bg-nude-50 border-b border-nude-200 shadow-nude-soft">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-nude-900 mb-4">
              Find Your Perfect Room
            </h1>
            <p className="text-xl text-nude-600 max-w-2xl mx-auto">
              Discover comfortable accommodations tailored to your needs
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <BuffrCard className="sticky top-4">
              <BuffrCardHeader>
                <BuffrCardTitle>Filters</BuffrCardTitle>
              </BuffrCardHeader>
              <BuffrCardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-nude-700 mb-2">
                    Search Rooms
                  </label>
                  <div className="relative">
                    <BuffrIcon
                      name="search"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-nude-400"
                    />
                    <input
                      type="text"
                      placeholder="Room type or hotel..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-nude-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nude-500"
                    />
                  </div>
                </div>

                {/* Hotel Filter */}
                <div>
                  <label className="block text-sm font-medium text-nude-700 mb-2">
                    Hotel
                  </label>
                  <select
                    value={selectedHotel}
                    onChange={(e) => setSelectedHotel(e.target.value)}
                    className="w-full px-3 py-2 border border-nude-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nude-500"
                  >
                    <option value="">All Hotels</option>
                    <option value="Swakopmund Beach Resort">
                      Swakopmund Beach Resort
                    </option>
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-nude-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-nude-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nude-500"
                  >
                    <option value="">All Prices</option>
                    <option value="budget">Budget (Under N$400)</option>
                    <option value="moderate">Moderate (N$400 - N$700)</option>
                    <option value="luxury">Luxury (N$700+)</option>
                  </select>
                </div>

                {/* Bed Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-nude-700 mb-2">
                    Bed Type
                  </label>
                  <select
                    value={bedType}
                    onChange={(e) => setBedType(e.target.value)}
                    className="w-full px-3 py-2 border border-nude-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nude-500"
                  >
                    <option value="">All Bed Types</option>
                    <option value="queen">Queen</option>
                    <option value="king">King</option>
                    <option value="twin">Twin</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-nude-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-nude-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nude-500"
                  >
                    <option value="price">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="rating">Rating</option>
                    <option value="name">Name</option>
                    <option value="size">Size</option>
                  </select>
                </div>
              </BuffrCardContent>
            </BuffrCard>
          </div>

          {/* Rooms Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-nude-900">
                {sortedRooms.length} Room{sortedRooms.length !== 1 ? 's' : ''}{' '}
                Found
              </h2>
            </div>

            {sortedRooms.length === 0 ? (
              <div className="text-center py-12">
                <BuffrIcon
                  name="bed"
                  className="h-16 w-16 text-nude-300 mx-auto mb-4"
                />
                <h3 className="text-lg font-medium text-nude-900 mb-2">
                  No rooms found
                </h3>
                <p className="text-nude-600">
                  Try adjusting your search criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedRooms.map((room) => (
                  <BuffrCard
                    key={room.id}
                    className="group hover:shadow-luxury-medium transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={room.imageUrl}
                        alt={room.typeName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <BuffrButton
                          variant="ghost"
                          size="sm"
                          className="p-2 bg-nude-50/90 hover:bg-nude-50"
                        >
                          <BuffrIcon name="heart" className="h-4 w-4" />
                        </BuffrButton>
                        <BuffrButton
                          variant="ghost"
                          size="sm"
                          className="p-2 bg-nude-50/90 hover:bg-nude-50"
                        >
                          <BuffrIcon name="share" className="h-4 w-4" />
                        </BuffrButton>
                      </div>
                      <div className="absolute top-4 left-4">
                        <BuffrBadge className="bg-nude-50/90 text-nude-800">
                          {room.maxOccupancy} Guest
                          {room.maxOccupancy !== 1 ? 's' : ''}
                        </BuffrBadge>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="text-lg font-semibold text-nude-50 bg-nude-900/50 px-2 py-1 rounded">
                          {formatCurrency(room.basePrice)}/night
                        </div>
                      </div>
                    </div>

                    <BuffrCardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-display font-bold text-nude-900 mb-2 group-hover:text-nude-700 transition-colors">
                          {room.typeName}
                        </h3>
                        <div className="flex items-center gap-2 text-nude-600 mb-2">
                          <BuffrIcon name="hotel" className="h-4 w-4" />
                          <span>{room.hotelName}</span>
                        </div>
                        <p className="text-nude-600 text-sm line-clamp-2 mb-3">
                          {room.description}
                        </p>
                      </div>

                      {/* Room Specifications */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-nude-50 rounded-lg">
                          <BuffrIcon
                            name="users"
                            className="h-5 w-5 text-nude-500 mx-auto mb-1"
                          />
                          <p className="text-xs font-medium text-nude-700">
                            Max {room.maxOccupancy} guests
                          </p>
                        </div>
                        <div className="text-center p-3 bg-nude-50 rounded-lg">
                          <BuffrIcon
                            name="home"
                            className="h-5 w-5 text-nude-500 mx-auto mb-1"
                          />
                          <p className="text-xs font-medium text-nude-700">
                            {room.sizeSqm} m²
                          </p>
                        </div>
                        <div className="text-center p-3 bg-nude-50 rounded-lg">
                          <BuffrIcon
                            name="bed"
                            className="h-5 w-5 text-nude-500 mx-auto mb-1"
                          />
                          <p className="text-xs font-medium text-nude-700 capitalize">
                            {room.bedType}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-nude-50 rounded-lg">
                          <BuffrIcon
                            name={getViewIcon(room.viewType)}
                            className={`h-5 w-5 ${getViewColor(room.viewType)} mx-auto mb-1`}
                          />
                          <p className="text-xs font-medium text-nude-700 capitalize">
                            {room.viewType} view
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          {renderStars(room.rating)}
                        </div>
                        <span className="text-sm font-medium text-nude-700">
                          {room.rating.toFixed(1)}
                        </span>
                        <span className="text-sm text-nude-500">
                          ({room.reviewCount} reviews)
                        </span>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {room.amenities.slice(0, 3).map((amenity, index) => (
                          <BuffrBadge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {amenity.replace('_', ' ')}
                          </BuffrBadge>
                        ))}
                        {room.amenities.length > 3 && (
                          <BuffrBadge variant="outline" className="text-xs">
                            +{room.amenities.length - 3} more
                          </BuffrBadge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/rooms/${room.id}`} className="flex-1">
                          <BuffrButton className="w-full">
                            View Details
                            <BuffrIcon
                              name="arrow-right"
                              className="h-4 w-4 ml-2"
                            />
                          </BuffrButton>
                        </Link>
                        <BuffrButton
                          variant="ghost"
                          className="border-nude-300 text-nude-700 hover:bg-nude-50"
                        >
                          <BuffrIcon name="calendar" className="h-4 w-4 mr-2" />
                          Book Now
                        </BuffrButton>
                      </div>
                    </BuffrCardContent>
                  </BuffrCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
