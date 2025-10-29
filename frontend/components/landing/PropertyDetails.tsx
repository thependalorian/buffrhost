'use client';

import React from 'react';
import { Users, Clock, Car, Wifi, Utensils, Coffee, Star } from 'lucide-react';
import { Property } from '@/lib/types/database';

/**
 * Property Details Component
 * 
 * Modular property details display with amenities and specific information
 * Location: components/landing/PropertyDetails.tsx
 * Features: Amenities, hotel/restaurant specific details, reviews
 */

interface PropertyDetailsProps {
  property: Property;
  className?: string;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
  className = ''
}) => {
  const isHotel = property.property_type === 'hotel';
  const isRestaurant = property.property_type === 'restaurant';

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Description */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">About {property.name}</h2>
          <p className="text-base-content/80 leading-relaxed">{property.description}</p>
        </div>
      </div>

      {/* Amenities */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Amenities & Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {property.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-base-200 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="capitalize">{amenity.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hotel Specific Details */}
      {isHotel && property.hotel_details && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Hotel Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Total Rooms</p>
                    <p className="text-base-content/70">{property.hotel_details.total_rooms}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Check-in/out</p>
                    <p className="text-base-content/70">
                      {property.hotel_details.policies?.check_in || '15:00'} / {property.hotel_details.policies?.check_out || '11:00'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Parking</p>
                    <p className="text-base-content/70">Available</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">WiFi</p>
                    <p className="text-base-content/70">Free</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restaurant Specific Details */}
      {isRestaurant && property.restaurant_details && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Restaurant Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Utensils className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Cuisine</p>
                    <p className="text-base-content/70">{property.restaurant_details.cuisine_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Capacity</p>
                    <p className="text-base-content/70">{property.restaurant_details.max_capacity} guests</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Coffee className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Price Range</p>
                    <p className="text-base-content/70">{property.restaurant_details.price_range}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Prep Time</p>
                    <p className="text-base-content/70">{property.restaurant_details.average_prep_time} minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Summary */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title mb-4">Guest Reviews</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {property.average_rating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 ${i < Math.floor(property.average_rating) ? 'fill-current text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <p className="text-sm text-base-content/70">
              Based on {property.total_reviews} reviews
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};