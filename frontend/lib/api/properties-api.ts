/**
 * Properties API Service
 *
 * API service functions for fetching properties (hotels and restaurants) from database
 * Location: lib/api/properties-api.ts
 */

import { ApiResponse, Property } from '../types/database';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface PropertyFilters {
  type?: 'hotel' | 'restaurant';
  location?: string;
  search?: string;
  limit?: number;
  page?: number;
}

export interface PropertiesResponse {
  properties: Property[];
  pagination: {
    total: number;
    limit: number;
    page: number;
    total_pages: number;
    hasMore: boolean;
  };
}

/**
 * Fetch properties with filters
 */
export async function getProperties(
  filters: PropertyFilters = {},
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<PropertiesResponse>> {
  try {
    const searchParams = new URLSearchParams();

    if (filters.type) searchParams.set('type', filters.type);
    if (filters.location) searchParams.set('location', filters.location);
    if (filters.search) searchParams.set('search', filters.search);
    if (filters.limit) searchParams.set('limit', filters.limit.toString());
    if (filters.page) searchParams.set('page', filters.page.toString());

    const response = await fetch(`/api/properties?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse = await response.json();

    // Transform the API response to match the expected format
    if (apiResponse.success) {
      const { properties, pagination } = apiResponse.data;
      const offset = (pagination.page - 1) * pagination.limit;
      const hasMore = pagination.page < pagination.total_pages;

      return {
        success: true,
        data: {
          properties,
          pagination: {
            total: pagination.total,
            limit: pagination.limit,
            page: pagination.page,
            total_pages: pagination.total_pages,
            hasMore,
          },
        },
      };
    } else {
      return apiResponse;
    }
  } catch (error) {
    console.error('Error fetching properties:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch properties',
    };
  }
}

/**
 * Fetch hotels specifically
 */
export async function getHotels(
  filters: Omit<PropertyFilters, 'type'> = {},
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<PropertiesResponse>> {
  return getProperties({ ...filters, type: 'hotel' }, tenantId);
}

/**
 * Fetch restaurants specifically
 */
export async function getRestaurants(
  filters: Omit<PropertyFilters, 'type'> = {},
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<PropertiesResponse>> {
  return getProperties({ ...filters, type: 'restaurant' }, tenantId);
}

/**
 * Fetch a single property by ID
 */
export async function getProperty(
  propertyId: string,
  tenantId: string = 'default-tenant'
): Promise<
  ApiResponse<{
    property: Property;
    hotelDetails?: any;
    restaurantDetails?: any;
    roomTypes: any[];
    restaurantTables: any[];
  }>
> {
  try {
    // Note: The /api/properties endpoint doesn't support individual property fetching yet
    // For now, we'll fetch all properties and filter, but this should be optimized later
    const response = await fetch(`/api/properties?limit=1000`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse = await response.json();

    if (apiResponse.success && apiResponse.data) {
      const property = apiResponse.data.properties.find(
        (p: Property) => p.id === propertyId
      );

      if (property) {
        return {
          success: true,
          data: {
            property,
            hotelDetails: undefined,
            restaurantDetails: undefined,
            roomTypes: [],
            restaurantTables: [],
          },
        };
      } else {
        return {
          success: false,
          error: 'Property not found',
        };
      }
    }

    return apiResponse;
  } catch (error) {
    console.error('Error fetching property:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch property',
    };
  }
}
