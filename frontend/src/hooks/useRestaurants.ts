/**
 * Restaurant Management Hooks
 * React hooks for restaurant CRUD operations and state management
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Restaurant,
  RestaurantCreate,
  RestaurantUpdate,
  RestaurantCard,
  RestaurantFormData,
  UseRestaurantsReturn,
  UseRestaurantReturn,
  RestaurantListRequest,
  RestaurantSearchFilters,
} from '@/src/types/restaurant';

// Base API URL - should be configured in environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// API functions
const restaurantApi = {
  async getRestaurants(params?: RestaurantListRequest): Promise<Restaurant[]> {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());

    const response = await fetch(`${API_BASE_URL}/api/v1/restaurants?${searchParams}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch restaurants: ${response.statusText}`);
    }
    return response.json();
  },

  async getRestaurant(id: number): Promise<Restaurant> {
    const response = await fetch(`${API_BASE_URL}/api/v1/restaurants/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch restaurant: ${response.statusText}`);
    }
    return response.json();
  },

  async createRestaurant(data: RestaurantCreate): Promise<Restaurant> {
    const response = await fetch(`${API_BASE_URL}/api/v1/restaurants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create restaurant: ${response.statusText}`);
    }
    return response.json();
  },

  async updateRestaurant(id: number, data: RestaurantUpdate): Promise<Restaurant> {
    const response = await fetch(`${API_BASE_URL}/api/v1/restaurants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update restaurant: ${response.statusText}`);
    }
    return response.json();
  },

  async deleteRestaurant(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/restaurants/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete restaurant: ${response.statusText}`);
    }
  },
};

// Transform restaurant data for frontend
const transformRestaurant = (restaurant: Restaurant): RestaurantCard => ({
  id: restaurant.restaurant_id,
  name: restaurant.restaurant_name,
  logo: restaurant.logo_url,
  address: restaurant.address,
  phone: restaurant.phone,
  isActive: restaurant.is_active,
  createdAt: restaurant.created_at,
});

// Hook for managing multiple restaurants
export function useRestaurants(params?: RestaurantListRequest): UseRestaurantsReturn {
  const [restaurants, setRestaurants] = useState<RestaurantCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await restaurantApi.getRestaurants(params);
      setRestaurants(data.map(transformRestaurant));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  }, [params]);

  const createRestaurant = useCallback(async (data: RestaurantFormData): Promise<Restaurant> => {
    try {
      const restaurantData: RestaurantCreate = {
        restaurant_name: data.restaurant_name,
        logo_url: data.logo_url,
        address: data.address,
        phone: data.phone,
        is_active: data.is_active,
        timezone: data.timezone,
      };
      
      const newRestaurant = await restaurantApi.createRestaurant(restaurantData);
      setRestaurants(prev => [transformRestaurant(newRestaurant), ...prev]);
      return newRestaurant;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create restaurant');
    }
  }, []);

  const updateRestaurant = useCallback(async (id: number, data: Partial<RestaurantFormData>): Promise<Restaurant> => {
    try {
      const updateData: RestaurantUpdate = {};
      if (data.restaurant_name !== undefined) updateData.restaurant_name = data.restaurant_name;
      if (data.logo_url !== undefined) updateData.logo_url = data.logo_url;
      if (data.address !== undefined) updateData.address = data.address;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.is_active !== undefined) updateData.is_active = data.is_active;
      if (data.timezone !== undefined) updateData.timezone = data.timezone;

      const updatedRestaurant = await restaurantApi.updateRestaurant(id, updateData);
      setRestaurants(prev => 
        prev.map(restaurant => 
          restaurant.id === id ? transformRestaurant(updatedRestaurant) : restaurant
        )
      );
      return updatedRestaurant;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update restaurant');
    }
  }, []);

  const deleteRestaurant = useCallback(async (id: number): Promise<void> => {
    try {
      await restaurantApi.deleteRestaurant(id);
      setRestaurants(prev => prev.filter(restaurant => restaurant.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete restaurant');
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return {
    restaurants,
    loading,
    error,
    refetch: fetchRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
  };
}

// Hook for managing a single restaurant
export function useRestaurant(id: number): UseRestaurantReturn {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurant = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await restaurantApi.getRestaurant(id);
      setRestaurant(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch restaurant');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateRestaurant = useCallback(async (data: Partial<RestaurantFormData>): Promise<Restaurant> => {
    try {
      const updateData: RestaurantUpdate = {};
      if (data.restaurant_name !== undefined) updateData.restaurant_name = data.restaurant_name;
      if (data.logo_url !== undefined) updateData.logo_url = data.logo_url;
      if (data.address !== undefined) updateData.address = data.address;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.is_active !== undefined) updateData.is_active = data.is_active;
      if (data.timezone !== undefined) updateData.timezone = data.timezone;

      const updatedRestaurant = await restaurantApi.updateRestaurant(id, updateData);
      setRestaurant(updatedRestaurant);
      return updatedRestaurant;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update restaurant');
    }
  }, [id]);

  const deleteRestaurant = useCallback(async (): Promise<void> => {
    try {
      await restaurantApi.deleteRestaurant(id);
      setRestaurant(null);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete restaurant');
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchRestaurant();
    }
  }, [id, fetchRestaurant]);

  return {
    restaurant,
    loading,
    error,
    refetch: fetchRestaurant,
    updateRestaurant,
    deleteRestaurant,
  };
}

// Hook for restaurant search and filtering
export function useRestaurantSearch(filters: RestaurantSearchFilters) {
  const [results, setResults] = useState<RestaurantCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const searchParams = new URLSearchParams();
      if (filters.query) searchParams.append('query', filters.query);
      if (filters.is_active !== undefined) searchParams.append('is_active', filters.is_active.toString());
      if (filters.timezone) searchParams.append('timezone', filters.timezone);
      if (filters.created_after) searchParams.append('created_after', filters.created_after);
      if (filters.created_before) searchParams.append('created_before', filters.created_before);

      const response = await fetch(`${API_BASE_URL}/api/v1/restaurants/search?${searchParams}`);
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResults(data.map(transformRestaurant));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  return {
    results,
    loading,
    error,
    search,
  };
}
