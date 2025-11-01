/**
 * Property API Service
 *
 * API service functions for property management using database-aligned types
 * Location: lib/api/property-api.ts
 */

import {
  ApiResponse,
  Property,
  DashboardStats,
  Booking,
  Order,
  RoomType,
  RestaurantTable,
} from '../types/database';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Fetch property details by ID
 */
export async function getProperty(
  propertyId: string,
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<Property>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/properties/${propertyId}?tenant_id=${tenantId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching property:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch property',
    };
  }
}

/**
 * Fetch dashboard statistics for a property
 */
export async function getDashboardStats(
  propertyId: string,
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<DashboardStats>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/dashboard/stats?property_id=${propertyId}&tenant_id=${tenantId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch dashboard statistics',
    };
  }
}

/**
 * Fetch property bookings
 */
export async function getPropertyBookings(
  propertyId: string,
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<Booking[]>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/properties/${propertyId}/bookings?tenant_id=${tenantId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching property bookings:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch property bookings',
    };
  }
}

/**
 * Fetch property orders
 */
export async function getPropertyOrders(
  propertyId: string,
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<Order[]>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/properties/${propertyId}/orders?tenant_id=${tenantId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching property orders:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch property orders',
    };
  }
}

/**
 * Fetch room types for a property
 */
export async function getRoomTypes(
  propertyId: string,
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<RoomType[]>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/properties/${propertyId}/room-types?tenant_id=${tenantId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching room types:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch room types',
    };
  }
}

/**
 * Fetch restaurant tables for a property
 */
export async function getRestaurantTables(
  propertyId: string,
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<RestaurantTable[]>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/properties/${propertyId}/tables?tenant_id=${tenantId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching restaurant tables:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch restaurant tables',
    };
  }
}

/**
 * Update property details
 */
export async function updateProperty(
  propertyId: string,
  updates: Partial<Property>,
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<Property>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/properties/${propertyId}?tenant_id=${tenantId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating property:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update property',
    };
  }
}

/**
 * Create a new property
 */
export async function createProperty(
  propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>,
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<Property>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/properties?tenant_id=${tenantId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating property:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create property',
    };
  }
}

/**
 * Delete a property
 */
export async function deleteProperty(
  propertyId: string,
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/properties/${propertyId}?tenant_id=${tenantId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting property:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to delete property',
    };
  }
}
