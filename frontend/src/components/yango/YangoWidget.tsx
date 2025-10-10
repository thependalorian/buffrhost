/**
 * Yango Widget Component
 * Integration with Yango ride-hailing services for Buffr Host
 */

import React, { useState, useEffect } from 'react';

// Types
interface Location {
  lat: number;
  lon: number;
}

interface YangoTripOption {
  class_name: string;
  class_text: string;
  class_level: number;
  min_price: number;
  price: number;
  price_text: string;
  waiting_time?: number;
}

interface YangoTripInfo {
  currency: string;
  distance?: number;
  time?: number;
  options: YangoTripOption[];
}

interface YangoWidgetProps {
  pickupLocation?: Location;
  destinationLocation?: Location;
  serviceType: 'food_delivery' | 'airport_shuttle' | 'general_ride' | 'parcel_delivery';
  hotelName: string;
  onTripInfo?: (info: YangoTripInfo) => void;
  className?: string;
}

// Service configuration
const serviceConfig = {
  food_delivery: {
    title: 'Food Delivery',
    description: 'Order food delivery to your room',
    icon: '🍽️',
    color: 'bg-orange-500'
  },
  airport_shuttle: {
    title: 'Airport Shuttle',
    description: 'Safe ride to/from airport',
    icon: '✈️',
    color: 'bg-blue-500'
  },
  general_ride: {
    title: 'Call a Taxi',
    description: 'Safe ride anywhere in the city',
    icon: '🚗',
    color: 'bg-green-500'
  },
  parcel_delivery: {
    title: 'Parcel Delivery',
    description: 'Send or receive packages',
    icon: '📦',
    color: 'bg-purple-500'
  }
};

// Yango API Service
class YangoService {
  private baseUrl = 'https://taxi-routeinfo.taxi.yandex.net';
  private apiKey: string;
  private clientId: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_YANGO_API_KEY || '';
    this.clientId = process.env.NEXT_PUBLIC_YANGO_CLIENT_ID || '';
  }

  async getTripInfo(
    pickupLat: number,
    pickupLon: number,
    destinationLat: number,
    destinationLon: number,
    fareClass: string = 'econom',
    requirements: string[] = [],
    language: string = 'en'
  ): Promise<YangoTripInfo> {
    const params = new URLSearchParams({
      clid: this.clientId,
      apikey: this.apiKey,
      rll: `${pickupLon},${pickupLat}~${destinationLon},${destinationLat}`,
      class: fareClass,
      req: requirements.join(','),
      lang: language
    });

    const response = await fetch(`${this.baseUrl}/taxi_info?${params}`, {
      headers: {
        'Accept': 'application/json',
        'YaTaxi-Api-Key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Yango API error: ${response.status}`);
    }

    return await response.json();
  }

  generateBookingLink(
    pickupLat: number,
    pickupLon: number,
    destinationLat: number,
    destinationLon: number,
    ref: string = 'buffr_host'
  ): string {
    const baseUrl = 'https://yango.go.link/route';
    const params = new URLSearchParams({
      'start-lat': pickupLat.toString(),
      'start-lon': pickupLon.toString(),
      'end-lat': destinationLat.toString(),
      'end-lon': destinationLon.toString(),
      'ref': ref,
      'adj_t': 'vokme8e_nd9s9z9',
      'lang': 'en',
      'adj_deeplink_js': '1',
      'adj_fallback': `https://yango.com/en_int/order/?gfrom=${pickupLon},${pickupLat}&gto=${destinationLon},${destinationLat}&ref=${ref}`
    });

    return `${baseUrl}?${params.toString()}`;
  }
}

// Main Yango Widget Component
export const YangoWidget: React.FC<YangoWidgetProps> = ({
  pickupLocation,
  destinationLocation,
  serviceType,
  hotelName,
  onTripInfo,
  className = ''
}) => {
  const [tripInfo, setTripInfo] = useState<YangoTripInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yangoService] = useState(() => new YangoService());

  const config = serviceConfig[serviceType];

  useEffect(() => {
    if (pickupLocation && destinationLocation) {
      fetchTripInfo();
    }
  }, [pickupLocation, destinationLocation]);

  const fetchTripInfo = async () => {
    if (!pickupLocation || !destinationLocation) return;

    setLoading(true);
    setError(null);

    try {
      const info = await yangoService.getTripInfo(
        pickupLocation.lat,
        pickupLocation.lon,
        destinationLocation.lat,
        destinationLocation.lon
      );

      setTripInfo(info);
      onTripInfo?.(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trip info');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = () => {
    if (!pickupLocation || !destinationLocation) return;

    const bookingUrl = yangoService.generateBookingLink(
      pickupLocation.lat,
      pickupLocation.lon,
      destinationLocation.lat,
      destinationLocation.lon,
      `buffr_${hotelName.replace(/\s+/g, '_').toLowerCase()}`
    );

    window.open(bookingUrl, '_blank');
  };

  return (
    <div className={`yango-widget bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 ${config.color} rounded-lg flex items-center justify-center mr-4`}>
          <span className="text-2xl">{config.icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
          <p className="text-gray-600 text-sm">{config.description}</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Getting trip information...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Trip Information */}
      {tripInfo && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Available Options</h4>
          <div className="space-y-3">
            {tripInfo.options.map((option, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{option.class_text}</span>
                      <span className="text-lg font-bold text-blue-600">
                        {option.price_text}
                      </span>
                    </div>
                    {option.waiting_time && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="inline-flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Arrival: {Math.round(option.waiting_time / 60)} min
                        </span>
                      </p>
                    )}
                    {tripInfo.distance && (
                      <p className="text-sm text-gray-500 mt-1">
                        Distance: {(tripInfo.distance / 1000).toFixed(1)} km
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Button */}
      <button
        onClick={handleBookRide}
        disabled={loading || !pickupLocation || !destinationLocation}
        className={`w-full ${config.color} text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center`}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Loading...
          </>
        ) : (
          <>
            <span className="mr-2">{config.icon}</span>
            Book {config.title}
          </>
        )}
      </button>

      {/* Footer */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Powered by <span className="font-medium">Yango</span> • Prices may vary based on demand
        </p>
      </div>
    </div>
  );
};

// Hotel-specific service components
export const HotelYangoServices = {
  // Airport transfers
  AirportTransfer: ({ hotelLocation, airportLocation, hotelName }: {
    hotelLocation: Location;
    airportLocation: Location;
    hotelName: string;
  }) => (
    <YangoWidget
      pickupLocation={hotelLocation}
      destinationLocation={airportLocation}
      serviceType="airport_shuttle"
      hotelName={hotelName}
    />
  ),

  // Food delivery to rooms
  RoomService: ({ hotelLocation, restaurantLocation, hotelName }: {
    hotelLocation: Location;
    restaurantLocation: Location;
    hotelName: string;
  }) => (
    <YangoWidget
      pickupLocation={restaurantLocation}
      destinationLocation={hotelLocation}
      serviceType="food_delivery"
      hotelName={hotelName}
    />
  ),

  // General transportation
  GeneralRide: ({ hotelLocation, destination, hotelName }: {
    hotelLocation: Location;
    destination?: Location;
    hotelName: string;
  }) => (
    <YangoWidget
      pickupLocation={hotelLocation}
      destinationLocation={destination}
      serviceType="general_ride"
      hotelName={hotelName}
    />
  ),

  // Parcel delivery
  ParcelDelivery: ({ pickupLocation, destinationLocation, hotelName }: {
    pickupLocation: Location;
    destinationLocation: Location;
    hotelName: string;
  }) => (
    <YangoWidget
      pickupLocation={pickupLocation}
      destinationLocation={destinationLocation}
      serviceType="parcel_delivery"
      hotelName={hotelName}
    />
  )
};

export default YangoWidget;