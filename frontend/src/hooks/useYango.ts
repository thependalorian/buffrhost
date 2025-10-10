/**
 * Yango Hooks
 * React hooks for Yango ride-hailing integration
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiServices } from '../../lib/api-client';

// Types
export interface Location {
  lat: number;
  lon: number;
}

export interface YangoTripOption {
  class_name: string;
  class_text: string;
  class_level: number;
  min_price: number;
  price: number;
  price_text: string;
  waiting_time?: number;
}

export interface YangoTripInfo {
  currency: string;
  distance?: number;
  time?: number;
  options: YangoTripOption[];
}

export interface YangoZoneInfo {
  tariffs: Array<{
    class: string;
    supported_requirements: Array<{
      name: string;
    }>;
  }>;
}

export interface YangoBookingLink {
  booking_url: string;
}

export interface YangoServiceAvailability {
  available: boolean;
  location: Location;
}

// API service functions
const yangoApi = {
  getTripInfo: async (params: {
    pickup_lat: number;
    pickup_lon: number;
    destination_lat: number;
    destination_lon: number;
    fare_class?: string;
    requirements?: string;
    language?: string;
  }): Promise<YangoTripInfo> => {
    const response = await apiServices.yango.getTripInfo(params);
    return response.data;
  },

  getZoneInfo: async (params: {
    lat: number;
    lon: number;
  }): Promise<YangoZoneInfo> => {
    const response = await apiServices.yango.getZoneInfo(params);
    return response.data;
  },

  getBookingLink: async (params: {
    pickup_lat: number;
    pickup_lon: number;
    destination_lat: number;
    destination_lon: number;
    ref?: string;
  }): Promise<YangoBookingLink> => {
    const response = await apiServices.yango.getBookingLink(params);
    return response.data;
  },

  checkServiceAvailability: async (params: {
    lat: number;
    lon: number;
  }): Promise<YangoServiceAvailability> => {
    const response = await apiServices.yango.checkServiceAvailability(params);
    return response.data;
  }
};

// Hooks
export const useYangoTripInfo = (params: {
  pickup_lat: number;
  pickup_lon: number;
  destination_lat: number;
  destination_lon: number;
  fare_class?: string;
  requirements?: string;
  language?: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['yango', 'trip-info', params],
    queryFn: () => yangoApi.getTripInfo(params),
    enabled: params.enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2
  });
};

export const useYangoZoneInfo = (params: {
  lat: number;
  lon: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['yango', 'zone-info', params],
    queryFn: () => yangoApi.getZoneInfo(params),
    enabled: params.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};

export const useYangoBookingLink = () => {
  return useMutation({
    mutationFn: yangoApi.getBookingLink,
    onSuccess: (data) => {
      // Open booking link in new tab
      window.open(data.booking_url, '_blank');
    }
  });
};

export const useYangoServiceAvailability = (params: {
  lat: number;
  lon: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['yango', 'service-availability', params],
    queryFn: () => yangoApi.checkServiceAvailability(params),
    enabled: params.enabled !== false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1
  });
};

// Custom hook for hotel services
export const useHotelYangoServices = (hotelLocation: Location) => {
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null);

  // Check if Yango is available at hotel location
  const { data: hotelAvailability, isLoading: checkingHotelAvailability } = useYangoServiceAvailability({
    lat: hotelLocation.lat,
    lon: hotelLocation.lon,
    enabled: true
  });

  // Get trip info when destination is selected
  const { data: tripInfo, isLoading: loadingTripInfo } = useYangoTripInfo({
    pickup_lat: hotelLocation.lat,
    pickup_lon: hotelLocation.lon,
    destination_lat: selectedDestination?.lat || 0,
    destination_lon: selectedDestination?.lon || 0,
    enabled: !!selectedDestination
  });

  // Booking mutation
  const bookingMutation = useYangoBookingLink();

  const bookRide = useCallback((destination: Location, ref?: string) => {
    bookingMutation.mutate({
      pickup_lat: hotelLocation.lat,
      pickup_lon: hotelLocation.lon,
      destination_lat: destination.lat,
      destination_lon: destination.lon,
      ref: ref || 'buffr_hotel'
    });
  }, [hotelLocation, bookingMutation]);

  const setDestination = useCallback((destination: Location) => {
    setSelectedDestination(destination);
  }, []);

  return {
    // Data
    hotelAvailability,
    tripInfo,
    selectedDestination,
    
    // Loading states
    checkingHotelAvailability,
    loadingTripInfo,
    isBooking: bookingMutation.isPending,
    
    // Actions
    bookRide,
    setDestination,
    
    // Computed
    isYangoAvailable: hotelAvailability?.available || false,
    hasTripInfo: !!tripInfo && tripInfo.options.length > 0
  };
};

// Custom hook for restaurant delivery
export const useRestaurantDelivery = (restaurantLocation: Location) => {
  const [customerLocation, setCustomerLocation] = useState<Location | null>(null);

  // Check if Yango is available at restaurant location
  const { data: restaurantAvailability } = useYangoServiceAvailability({
    lat: restaurantLocation.lat,
    lon: restaurantLocation.lon,
    enabled: true
  });

  // Get delivery info when customer location is set
  const { data: deliveryInfo, isLoading: loadingDeliveryInfo } = useYangoTripInfo({
    pickup_lat: restaurantLocation.lat,
    pickup_lon: restaurantLocation.lon,
    destination_lat: customerLocation?.lat || 0,
    destination_lon: customerLocation?.lon || 0,
    enabled: !!customerLocation
  });

  // Booking mutation
  const bookingMutation = useYangoBookingLink();

  const bookDelivery = useCallback((customer: Location, ref?: string) => {
    bookingMutation.mutate({
      pickup_lat: restaurantLocation.lat,
      pickup_lon: restaurantLocation.lon,
      destination_lat: customer.lat,
      destination_lon: customer.lon,
      ref: ref || 'buffr_restaurant'
    });
  }, [restaurantLocation, bookingMutation]);

  const setCustomerLocation = useCallback((location: Location) => {
    setCustomerLocation(location);
  }, []);

  return {
    // Data
    restaurantAvailability,
    deliveryInfo,
    customerLocation,
    
    // Loading states
    loadingDeliveryInfo,
    isBooking: bookingMutation.isPending,
    
    // Actions
    bookDelivery,
    setCustomerLocation,
    
    // Computed
    isYangoAvailable: restaurantAvailability?.available || false,
    hasDeliveryInfo: !!deliveryInfo && deliveryInfo.options.length > 0
  };
};

// Utility hook for location services
export const useLocationServices = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        setCurrentLocation(location);
        setLocationError(null);
      },
      (error) => {
        setLocationError(`Location error: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, []);

  return {
    currentLocation,
    locationError,
    getCurrentLocation,
    hasLocation: !!currentLocation
  };
};