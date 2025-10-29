/**
 * Multi-Functional Property Data Service
 *
 * Purpose: Handles data fetching and management for Multi-Functional Property Hub
 * Location: /src/admin/components/views/multi-functional/services/property-data-service.ts
 * Usage: Centralized data management for property hub components
 *
 * @author George Nekwaya (pendanek@gmail.com)
 * @version 1.0.0
 * @framework Buffr Host Framework
 */

import {
  Property,
  HotelData,
  RestaurantData,
  PropertyAmenities,
  PropertyHubState,
} from '../types/property-hub-types';

/**
 * Multi-Functional Property Data Service Class
 *
 * Handles data fetching, caching, and management for the Multi-Functional Property Hub
 * following the 40 rules for better maintainability and separation of concerns.
 */
export class PropertyDataService {
  private cache: Map<string, any> = new Map();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch all multi-functional property data
   */
  async fetchMultiFunctionalData(
    propertyId: string
  ): Promise<PropertyHubState> {
    console.log('📊 Fetching multi-functional property data for:', propertyId);

    try {
      const cacheKey = `property_${propertyId}`;
      const cachedData = this.getCachedData(cacheKey);

      if (cachedData) {
        console.log('✅ Using cached property data');
        return cachedData;
      }

      const [
        propertyRes,
        hotelDetailsRes,
        restaurantDetailsRes,
        bookingsRes,
        roomTypesRes,
        menuItemsRes,
        tablesRes,
        reservationsRes,
        ordersRes,
        inventoryRes,
      ] = await Promise.all([
        this.fetchProperty(propertyId),
        this.fetchHotelDetails(propertyId),
        this.fetchRestaurantDetails(propertyId),
        this.fetchBookings(propertyId),
        this.fetchRoomTypes(propertyId),
        this.fetchMenuItems(propertyId),
        this.fetchTables(propertyId),
        this.fetchReservations(propertyId),
        this.fetchOrders(propertyId),
        this.fetchInventory(propertyId),
      ]);

      const propertyData = await propertyRes.json();
      const hotelDetailsData = await hotelDetailsRes.json();
      const restaurantDetailsData = await restaurantDetailsRes.json();
      const bookingsData = await bookingsRes.json();
      const roomTypesData = await roomTypesRes.json();
      const menuItemsData = await menuItemsRes.json();
      const tablesData = await tablesRes.json();
      const reservationsData = await reservationsRes.json();
      const ordersData = await ordersRes.json();
      const inventoryData = await inventoryRes.json();

      const state: PropertyHubState = {
        property: propertyData,
        hotelData: {
          bookings: bookingsData.docs || [],
          roomTypes: roomTypesData.docs || [],
          roomAvailability: [], // Will be populated separately
          hotelDetails: hotelDetailsData.docs?.[0],
        },
        restaurantData: {
          menuItems: menuItemsData.docs || [],
          tables: tablesData.docs || [],
          reservations: reservationsData.docs || [],
          orders: ordersData.docs || [],
          inventory: inventoryData.docs || [],
          restaurantDetails: restaurantDetailsData.docs?.[0],
        },
        amenities: propertyData.amenities || {},
        loading: false,
        error: null,
      };

      // Cache the data
      this.setCachedData(cacheKey, state);

      console.log('✅ Multi-functional property data fetched successfully');
      return state;
    } catch (error) {
      console.error('❌ Error fetching multi-functional property data:', error);
      return {
        property: null,
        hotelData: { bookings: [], roomTypes: [], roomAvailability: [] },
        restaurantData: {
          menuItems: [],
          tables: [],
          reservations: [],
          orders: [],
          inventory: [],
        },
        amenities: {},
        loading: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Fetch property data
   */
  private async fetchProperty(propertyId: string): Promise<Response> {
    return fetch(`/api/v1/properties/${propertyId}`);
  }

  /**
   * Fetch hotel details
   */
  private async fetchHotelDetails(propertyId: string): Promise<Response> {
    return fetch(
      `/api/v1/hotel-details?where[property][equals]=${propertyId}&limit=1`
    );
  }

  /**
   * Fetch restaurant details
   */
  private async fetchRestaurantDetails(propertyId: string): Promise<Response> {
    return fetch(
      `/api/v1/restaurant-details?where[property][equals]=${propertyId}&limit=1`
    );
  }

  /**
   * Fetch bookings
   */
  private async fetchBookings(propertyId: string): Promise<Response> {
    return fetch(
      `/api/v1/bookings?where[property][equals]=${propertyId}&limit=50&sort=-created_at`
    );
  }

  /**
   * Fetch room types
   */
  private async fetchRoomTypes(propertyId: string): Promise<Response> {
    return fetch(
      `/api/v1/room-types?where[property][equals]=${propertyId}&limit=50`
    );
  }

  /**
   * Fetch menu items
   */
  private async fetchMenuItems(propertyId: string): Promise<Response> {
    return fetch(
      `/api/v1/menu-items?where[property][equals]=${propertyId}&limit=50`
    );
  }

  /**
   * Fetch tables
   */
  private async fetchTables(propertyId: string): Promise<Response> {
    return fetch(
      `/api/v1/restaurant-tables?where[property][equals]=${propertyId}&limit=50`
    );
  }

  /**
   * Fetch reservations
   */
  private async fetchReservations(propertyId: string): Promise<Response> {
    return fetch(
      `/api/v1/table-reservations?where[property][equals]=${propertyId}&limit=50&sort=-reservationTime`
    );
  }

  /**
   * Fetch orders
   */
  private async fetchOrders(propertyId: string): Promise<Response> {
    return fetch(
      `/api/v1/orders?where[property][equals]=${propertyId}&limit=50&sort=-createdAt`
    );
  }

  /**
   * Fetch inventory
   */
  private async fetchInventory(propertyId: string): Promise<Response> {
    return fetch(
      `/api/v1/restaurant-inventory?where[property][equals]=${propertyId}&limit=50`
    );
  }

  /**
   * Get cached data
   */
  private getCachedData(key: string): Record<string, unknown> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  /**
   * Set cached data
   */
  private setCachedData(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Property data cache cleared');
  }

  /**
   * Refresh property data
   */
  async refreshPropertyData(propertyId: string): Promise<PropertyHubState> {
    this.clearCache();
    return await this.fetchMultiFunctionalData(propertyId);
  }
}
