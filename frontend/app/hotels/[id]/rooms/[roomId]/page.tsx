'use client';
import {
  BuffrIcon,
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrCardContent,
  BuffrButton,
  BuffrBadge,
} from '@/components/ui';
/**
 * Individual Room Detail Page
 *
 * Displays detailed information about a specific room type within a hotel
 * Features: Room images, amenities, pricing, availability, booking
 * Location: app/hotels/[id]/rooms/[roomId]/page.tsx
 */

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MainNavigation from '@/components/layouts/MainNavigation';

interface RoomImage {
  id: string;
  roomTypeId: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface RoomType {
  id: string;
  hotelId: string;
  typeName: string;
  description: string;
  maxOccupancy: number;
  basePrice: number;
  sizeSqm: number;
  bedType: string;
  amenities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: RoomImage[];
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  starRating: number;
  checkInTime: string;
  checkOutTime: string;
  totalRooms: number;
  availableRooms: number;
}

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params?.['id'] as string;
  const _roomId = params?.['roomId'] as string;

  const [room, setRoom] = useState<RoomType | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDates, setSelectedDates] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  useEffect(() => {
    if (hotelId && roomId) {
      fetchRoomDetails();
    }
  }, [hotelId, roomId]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);

      // Fetch room details
      const roomResponse = await fetch(
        `/api/hotels/${hotelId}/rooms/${roomId}`
      );
      if (!roomResponse.ok) {
        throw new Error('Room not found');
      }
      const roomData = await roomResponse.json();
      setRoom(roomData.data);

      // Fetch hotel details
      const hotelResponse = await fetch(`/api/hotels/${hotelId}`);
      if (hotelResponse.ok) {
        const hotelData = await hotelResponse.json();
        setHotel(hotelData.data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load room details'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (!room?.images) return;

    if (direction === 'prev') {
      setCurrentImageIndex((prev) =>
        prev === 0 ? room.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === room.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      wifi: <BuffrIcon name="wifi" className="h-4 w-4" />,
      parking: <BuffrIcon name="car" className="h-4 w-4" />,
      minibar: <BuffrIcon name="coffee" className="h-4 w-4" />,
      tv: <BuffrIcon name="tv" className="h-4 w-4" />,
      air_conditioning: <BuffrIcon name="wind" className="h-4 w-4" />,
      safe: <BuffrIcon name="shield" className="h-4 w-4" />,
      balcony: <BuffrIcon name="wind" className="h-4 w-4" />,
      ocean_view: <BuffrIcon name="wind" className="h-4 w-4" />,
      desert_view: <BuffrIcon name="wind" className="h-4 w-4" />,
    };
    return iconMap[amenity] || <BuffrIcon name="wind" className="h-4 w-4" />;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: 'NAD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nude-50">
        <MainNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-nude-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-nude-200 rounded mb-6"></div>
            <div className="h-32 bg-nude-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-nude-50">
        <MainNavigation />
        <div className="container mx-auto px-4 py-8">
          <BuffrCard className="border-nude-200 shadow-luxury-soft">
            <BuffrCardContent className="text-center py-12">
              <div className="w-16 h-16 bg-semantic-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BuffrIcon
                  name="shield"
                  className="h-8 w-8 text-semantic-error"
                />
              </div>
              <h2 className="text-2xl font-display font-bold text-nude-900 mb-2">
                Room Not Found
              </h2>
              <p className="text-nude-600 mb-6">
                {error || 'The room you are looking for does not exist.'}
              </p>
              <BuffrButton
                onClick={() => router.back()}
                className="bg-nude-600 hover:bg-nude-700 text-nude-50 shadow-luxury-soft"
              >
                <BuffrIcon name="arrow-left" className="h-4 w-4 mr-2" />
                Go Back
              </BuffrButton>
            </BuffrCardContent>
          </BuffrCard>
        </div>
      </div>
    );
  }

  const currentImage = room.images?.[currentImageIndex];
  const imageUrl =
    currentImage?.imageUrl ||
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';

  return (
    <div className="min-h-screen bg-nude-50">
      <MainNavigation />

      {/* Breadcrumb */}
      <div className="bg-nude-50 border-b border-nude-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/hotels"
              className="text-nude-600 hover:text-nude-700 transition-colors duration-300"
            >
              Hotels
            </Link>
            <span className="text-nude-400">/</span>
            <Link
              href={`/hotels/${hotelId}`}
              className="text-nude-600 hover:text-nude-700 transition-colors duration-300"
            >
              {hotel?.name || 'Hotel'}
            </Link>
            <span className="text-nude-400">/</span>
            <span className="text-nude-900 font-medium">{room.typeName}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <BuffrButton
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 border-nude-300 text-nude-700 hover:bg-nude-50"
        >
          <BuffrIcon name="arrow-left" className="h-4 w-4 mr-2" />
          Back to Hotel
        </BuffrButton>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Room Images */}
            <BuffrCard className="border-nude-200 shadow-luxury-soft overflow-hidden">
              <BuffrCardContent className="p-0">
                {room.images && room.images.length > 0 ? (
                  <div className="relative">
                    <div className="aspect-video relative">
                      <Image
                        src={imageUrl}
                        alt={currentImage?.altText || room.typeName}
                        fill
                        className="object-cover"
                        priority
                      />

                      {/* Image Navigation */}
                      {room.images.length > 1 && (
                        <>
                          <BuffrButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleImageNavigation('prev')}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-nude-50/80 hover:bg-nude-50 border-nude-300"
                          >
                            <BuffrIcon
                              name="chevron-left"
                              className="h-4 w-4"
                            />
                          </BuffrButton>
                          <BuffrButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleImageNavigation('next')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-nude-50/80 hover:bg-nude-50 border-nude-300"
                          >
                            <BuffrIcon
                              name="chevron-right"
                              className="h-4 w-4"
                            />
                          </BuffrButton>
                        </>
                      )}
                    </div>

                    {/* Image Thumbnails */}
                    {room.images.length > 1 && (
                      <div className="p-4 bg-nude-50">
                        <div className="flex space-x-2 overflow-x-auto">
                          {room.images.map((image, index) => (
                            <button
                              key={image.id}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors duration-300 ${
                                index === currentImageIndex
                                  ? 'border-nude-600'
                                  : 'border-nude-200 hover:border-nude-400'
                              }`}
                            >
                              <Image
                                src={image.imageUrl}
                                alt={image.altText}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-nude-100 flex items-center justify-center">
                    <div className="text-center">
                      <BuffrIcon
                        name="wind"
                        className="h-12 w-12 text-nude-400 mx-auto mb-2"
                      />
                      <p className="text-nude-600">No images available</p>
                    </div>
                  </div>
                )}
              </BuffrCardContent>
            </BuffrCard>

            {/* Room Details */}
            <BuffrCard className="border-nude-200 shadow-luxury-soft">
              <BuffrCardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <BuffrCardTitle className="text-2xl font-display font-bold text-nude-900 mb-2">
                      {room.typeName}
                    </BuffrCardTitle>
                    <div className="flex items-center gap-4 text-nude-600">
                      <div className="flex items-center gap-1">
                        <BuffrIcon name="users" className="h-4 w-4" />
                        <span className="text-sm">
                          Up to {room.maxOccupancy} guests
                        </span>
                      </div>
                      {room.sizeSqm && (
                        <div className="flex items-center gap-1">
                          <BuffrIcon name="wind" className="h-4 w-4" />
                          <span className="text-sm">{room.sizeSqm} sqm</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <BuffrIcon name="wind" className="h-4 w-4" />
                        <span className="text-sm capitalize">
                          {room.bedType} bed
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-nude-900">
                      {formatPrice(room.basePrice)}
                    </div>
                    <div className="text-sm text-nude-600">per night</div>
                  </div>
                </div>
              </BuffrCardHeader>

              <BuffrCardContent className="space-y-6">
                {/* Description */}
                {room.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-nude-900 mb-2">
                      Description
                    </h3>
                    <p className="text-nude-700 leading-relaxed">
                      {room.description}
                    </p>
                  </div>
                )}

                {/* Amenities */}
                {room.amenities && room.amenities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-nude-900 mb-3">
                      Amenities
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {room.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-nude-700"
                        >
                          {getAmenityIcon(amenity)}
                          <span className="text-sm capitalize">
                            {amenity.replace(/_/g, ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </BuffrCardContent>
            </BuffrCard>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <BuffrCard className="border-nude-200 shadow-luxury-soft sticky top-8">
              <BuffrCardHeader>
                <BuffrCardTitle className="text-xl font-display font-bold text-nude-900">
                  Book This Room
                </BuffrCardTitle>
                <div className="text-2xl font-bold text-nude-900">
                  {formatPrice(room.basePrice)}
                  <span className="text-sm font-normal text-nude-600">
                    /night
                  </span>
                </div>
              </BuffrCardHeader>

              <BuffrCardContent className="space-y-4">
                {/* Check-in/Check-out */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-nude-700 mb-1">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={selectedDates.checkIn}
                      onChange={(e) =>
                        setSelectedDates((prev) => ({
                          ...prev,
                          checkIn: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-nude-300 rounded-md text-sm focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-nude-500 focus:border-nude-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nude-700 mb-1">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={selectedDates.checkOut}
                      onChange={(e) =>
                        setSelectedDates((prev) => ({
                          ...prev,
                          checkOut: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-nude-300 rounded-md text-sm focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-nude-500 focus:border-nude-500"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-nude-700 mb-1">
                    Guests
                  </label>
                  <select
                    value={selectedDates.guests}
                    onChange={(e) =>
                      setSelectedDates((prev) => ({
                        ...prev,
                        guests: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-nude-300 rounded-md text-sm focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-nude-500 focus:border-nude-500"
                  >
                    {Array.from(
                      { length: room.maxOccupancy },
                      (_, i) => i + 1
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <BuffrButton
                    className="w-full bg-nude-600 hover:bg-nude-700 text-nude-50 shadow-luxury-soft hover:shadow-luxury-medium"
                    disabled={!selectedDates.checkIn || !selectedDates.checkOut}
                  >
                    <BuffrIcon name="calendar" className="h-4 w-4 mr-2" />
                    Book Now
                  </BuffrButton>

                  <div className="flex gap-2">
                    <BuffrButton
                      variant="ghost"
                      className="flex-1 border-nude-300 text-nude-700 hover:bg-nude-50"
                    >
                      <BuffrIcon name="heart" className="h-4 w-4 mr-2" />
                      Save
                    </BuffrButton>
                    <BuffrButton
                      variant="ghost"
                      className="flex-1 border-nude-300 text-nude-700 hover:bg-nude-50"
                    >
                      <BuffrIcon name="share-2" className="h-4 w-4 mr-2" />
                      Share
                    </BuffrButton>
                  </div>
                </div>

                {/* Hotel Info */}
                {hotel && (
                  <div className="pt-4 border-t border-nude-200">
                    <h4 className="font-semibold text-nude-900 mb-2">
                      Hotel Information
                    </h4>
                    <div className="space-y-2 text-sm text-nude-600">
                      <div className="flex items-center gap-2">
                        <BuffrIcon name="map-pin" className="h-4 w-4" />
                        <span>{hotel.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BuffrIcon name="phone" className="h-4 w-4" />
                        <span>{hotel.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BuffrIcon name="mail" className="h-4 w-4" />
                        <span>{hotel.email}</span>
                      </div>
                      {hotel.website && (
                        <div className="flex items-center gap-2">
                          <BuffrIcon name="globe" className="h-4 w-4" />
                          <a
                            href={`https://${hotel.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-nude-700 transition-colors duration-300"
                          >
                            {hotel.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </BuffrCardContent>
            </BuffrCard>
          </div>
        </div>
      </div>
    </div>
  );
}
