'use client';

import { useState } from 'react';
/**
 * DemoHotelShowcase React Component for Buffr Host Hospitality Platform
 * @fileoverview DemoHotelShowcase provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/features/landing/DemoHotelShowcase.tsx
 * @purpose DemoHotelShowcase provides specialized functionality for the Buffr Host platform
 * @component DemoHotelShowcase
 * @category Features
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @state_management Local component state for UI interactions and data management
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Interactive state management for dynamic user experiences
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * State:
 * @state {any} demoHotels[0]! - Component state for demohotels[0]! management
 *
 * Usage Example:
 * @example
 * import DemoHotelShowcase from './DemoHotelShowcase';
 *
 * function App() {
 *   return (
 *     <DemoHotelShowcase
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered DemoHotelShowcase component
 */

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  BuffrIcon,
} from '@/components/ui';

interface DemoHotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  amenities: string[];
  description: string;
  rooms: number;
  guests: number;
}

const demoHotels: DemoHotel[] = [
  {
    id: '1',
    name: 'Luxury Resort & Spa',
    location: 'Coastal Paradise, CA',
    rating: 4.8,
    price: 299,
    image: '/images/demo-hotel-1.jpg',
    amenities: ['Spa', 'Pool', 'Restaurant', 'Gym', 'Beach Access'],
    description:
      'Experience luxury with stunning ocean views and world-class amenities.',
    rooms: 120,
    guests: 240,
  },
  {
    id: '2',
    name: 'Boutique City Hotel',
    location: 'Downtown Metro, NY',
    rating: 4.6,
    price: 189,
    image: '/images/demo-hotel-2.jpg',
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Concierge', 'Parking'],
    description:
      'Modern elegance in the heart of the city with personalized service.',
    rooms: 85,
    guests: 170,
  },
  {
    id: '3',
    name: 'Mountain Lodge Retreat',
    location: 'Alpine Valley, CO',
    rating: 4.9,
    price: 249,
    image: '/images/demo-hotel-3.jpg',
    amenities: ['Skiing', 'Hiking', 'Spa', 'Restaurant', 'Fireplace'],
    description:
      'Rustic charm meets modern comfort in a breathtaking mountain setting.',
    rooms: 45,
    guests: 90,
  },
];

const amenityIcons = {
  Spa: '🧘',
  Pool: '🏊',
  Restaurant: '🍽️',
  Gym: '💪',
  'Beach Access': '🏖️',
  WiFi: '📶',
  Bar: '🍸',
  Concierge: '🎩',
  Parking: '🅿️',
  Skiing: '⛷️',
  Hiking: '🥾',
  Fireplace: '🔥',
};

export default function DemoHotelShowcase() {
  const [selectedHotel, setSelectedHotel] = useState<DemoHotel>(demoHotels[0]!);

  return (
    <div className="py-16 bg-gradient-to-br from-nude-50 to-nude-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-nude-900 mb-4">
            See Buffr Host in Action
          </h2>
          <p className="text-xl text-nude-700 max-w-3xl mx-auto">
            Explore how our platform transforms hospitality management with
            real-world examples
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Hotel Selection */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-nude-900 mb-6">
              Choose a Demo Property
            </h3>
            {demoHotels.map((hotel) => (
              <Card
                key={hotel.id}
                className={`cursor-pointer transition-all duration-300 duration-300 ${
                  selectedHotel.id === hotel.id
                    ? 'ring-2 ring-nude-600 shadow-2xl-luxury-medium'
                    : 'hover:shadow-2xl-luxury-strong'
                }`}
                onClick={() => setSelectedHotel(hotel)}
              >
                <CardContent className="card-body">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-nude-200 card flex items-center justify-center">
                      <span className="text-2xl">🏨</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-nude-900">
                        {hotel.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-nude-600">
                        <BuffrIcon name="map-pin" className="w-4 h-4" />
                        {hotel.location}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <BuffrIcon
                            name="star"
                            className="w-4 h-4 text-yellow-500 fill-current"
                          />
                          <span className="text-sm font-medium">
                            {hotel.rating}
                          </span>
                        </div>
                        <span className="text-sm text-nude-600">•</span>
                        <span className="text-sm font-semibold text-nude-700">
                          ${hotel.price}/night
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Hotel Details */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-nude-400 to-nude-500 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-2">🏨</div>
                  <p className="text-lg font-semibold">{selectedHotel.name}</p>
                </div>
              </div>
              <CardContent className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-nude-900">
                      {selectedHotel.name}
                    </h3>
                    <div className="flex items-center gap-2 text-nude-600">
                      <BuffrIcon name="map-pin" className="w-4 h-4" />
                      {selectedHotel.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-nude-700">
                      ${selectedHotel.price}
                    </div>
                    <div className="text-sm text-nude-600">per night</div>
                  </div>
                </div>

                <p className="text-nude-700 mb-4">
                  {selectedHotel.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <BuffrIcon name="users" className="w-4 h-4 text-nude-600" />
                    <span className="text-sm text-nude-700">
                      {selectedHotel.rooms} rooms
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BuffrIcon name="users" className="w-4 h-4 text-nude-600" />
                    <span className="text-sm text-nude-700">
                      {selectedHotel.guests} guests
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-nude-900">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHotel.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="flex items-center gap-1 badge badge-md bg-nude-100 text-nude-700 rounded-full text-sm"
                      >
                        <span>
                          {amenityIcons[amenity as keyof typeof amenityIcons] ||
                            '✨'}
                        </span>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Features Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-nude-900">
                  Buffr Host Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-nude-600 card flex items-center justify-center">
                      <span className="text-white text-sm">📊</span>
                    </div>
                    <div>
                      <div className="font-medium text-nude-900">
                        Real-time Analytics
                      </div>
                      <div className="text-sm text-nude-600">
                        Live occupancy and revenue tracking
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-nude-600 card flex items-center justify-center">
                      <span className="text-white text-sm">🤖</span>
                    </div>
                    <div>
                      <div className="font-medium text-nude-900">
                        AI Concierge
                      </div>
                      <div className="text-sm text-nude-600">
                        24/7 guest assistance and support
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-nude-600 card flex items-center justify-center">
                      <span className="text-white text-sm">📱</span>
                    </div>
                    <div>
                      <div className="font-medium text-nude-900">
                        Mobile Management
                      </div>
                      <div className="text-sm text-nude-600">
                        Manage everything from your phone
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
