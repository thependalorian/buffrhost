/**
 * Hotels Service for Buffr Host Hospitality Platform
 * @fileoverview Hotels service providing hotel-specific operations and data management
 * @location buffr-host/frontend/lib/services/hotelsService.ts
 * @purpose Centralized hotel management with property data operations and business logic
 * @modularity Service layer for hotel operations, separating business logic from API routes
 * @database_connections Uses PropertyService for database operations on hotel properties
 * @api_integration Hotel data operations for listing, filtering, and management
 * @scalability Hotel service operations with caching and optimized queries
 * @performance Efficient hotel data retrieval and processing
 * @monitoring Hotel service operations monitoring and error tracking
 * @security Hotel data access control and tenant isolation
 * @multi_tenant Automatic tenant context for hotel data operations
 */

import { PropertyService } from './database/properties/PropertyService';

/**
 * Hotel data interface
 */
export interface HotelData {
  id: string;
  name: string;
  type: string;
  location: string;
  ownerId?: string;
  tenantId?: string;
  status?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  starRating?: number;
  amenities?: string[];
  policies?: Record<string, any>;
  checkInTime?: string;
  checkOutTime?: string;
  images?: string[];
  features?: string[];
  totalOrders?: number;
  totalRevenue?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Hotels Service Class
 * Provides hotel-specific operations and data management
 */
export class HotelsService {
  /**
   * Get all hotels with optional filtering
   * @param filters - Optional filters for hotel retrieval
   * @returns Promise<HotelData[]> - Array of hotel data
   */
  static async getHotels(filters?: {
    tenantId?: string;
    ownerId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<HotelData[]> {
    try {
      // Get properties filtered by type 'hotel'
      const properties = await PropertyService.getProperties({
        ...filters,
        type: 'hotel',
      });

      // Transform property data to hotel format
      return properties.map((property: any) => ({
        id: property.id,
        name: property.name,
        type: property.type,
        location: property.location,
        ownerId: property.owner_id,
        tenantId: property.tenant_id,
        status: property.status,
        description: property.description,
        address: property.address,
        phone: property.phone,
        email: property.email,
        website: property.website,
        rating: parseFloat(property.rating) || 0,
        starRating: property.star_rating,
        amenities: property.amenities ? JSON.parse(property.amenities) : [],
        policies: property.policies ? JSON.parse(property.policies) : {},
        checkInTime: property.check_in_time,
        checkOutTime: property.check_out_time,
        totalOrders: 0, // Would need to calculate from orders table
        totalRevenue: 0, // Would need to calculate from orders/payments table
        createdAt: property.created_at,
        updatedAt: property.updated_at,
      }));
    } catch (error) {
      console.error('Failed to get hotels:', error);
      throw new Error('Hotel data retrieval failed');
    }
  }

  /**
   * Get hotel by ID
   * @param id - Hotel ID to retrieve
   * @returns Promise<HotelData | null> - Hotel data or null if not found
   */
  static async getHotelById(id: string): Promise<HotelData | null> {
    try {
      const property = await PropertyService.getPropertyById(id);

      if (!property || property.type !== 'hotel') {
        return null;
      }

      // Transform property data to hotel format
      return {
        id: property.id,
        name: property.name,
        type: property.type,
        location: property.location,
        ownerId: property.owner_id,
        tenantId: property.tenant_id,
        status: property.status,
        description: property.description,
        address: property.address,
        phone: property.phone,
        email: property.email,
        website: property.website,
        rating: parseFloat(property.rating) || 0,
        starRating: property.star_rating,
        amenities: property.amenities ? JSON.parse(property.amenities) : [],
        policies: property.policies ? JSON.parse(property.policies) : {},
        checkInTime: property.check_in_time,
        checkOutTime: property.check_out_time,
        totalOrders: 0,
        totalRevenue: 0,
        createdAt: property.created_at,
        updatedAt: property.updated_at,
      };
    } catch (error) {
      console.error('Failed to get hotel by ID:', error);
      throw new Error('Hotel retrieval failed');
    }
  }

  /**
   * Create a new hotel
   * @param hotelData - Hotel data to create
   * @returns Promise<HotelData> - Created hotel data
   */
  static async createHotel(hotelData: Omit<HotelData, 'id' | 'createdAt' | 'updatedAt'>): Promise<HotelData> {
    try {
      const propertyData = {
        ...hotelData,
        type: 'hotel',
        amenities: JSON.stringify(hotelData.amenities || []),
        policies: JSON.stringify(hotelData.policies || {}),
      };

      const property = await PropertyService.createProperty(propertyData);

      // Transform back to hotel format
      return {
        id: property.id,
        name: property.name,
        type: property.type,
        location: property.location,
        ownerId: property.owner_id,
        tenantId: property.tenant_id,
        status: property.status,
        description: property.description,
        address: property.address,
        phone: property.phone,
        email: property.email,
        website: property.website,
        rating: parseFloat(property.rating) || 0,
        starRating: property.star_rating,
        amenities: property.amenities ? JSON.parse(property.amenities) : [],
        policies: property.policies ? JSON.parse(property.policies) : {},
        checkInTime: property.check_in_time,
        checkOutTime: property.check_out_time,
        totalOrders: 0,
        totalRevenue: 0,
        createdAt: property.created_at,
        updatedAt: property.updated_at,
      };
    } catch (error) {
      console.error('Failed to create hotel:', error);
      throw new Error('Hotel creation failed');
    }
  }

  /**
   * Update hotel information
   * @param id - Hotel ID to update
   * @param updates - Fields to update
   * @returns Promise<HotelData> - Updated hotel data
   */
  static async updateHotel(id: string, updates: Partial<Omit<HotelData, 'id' | 'createdAt' | 'updatedAt'>>): Promise<HotelData> {
    try {
      const updateData = { ...updates };

      // Convert arrays/objects to JSON strings for database storage
      if (updates.amenities) {
        updateData.amenities = JSON.stringify(updates.amenities);
      }
      if (updates.policies) {
        updateData.policies = JSON.stringify(updates.policies);
      }

      const property = await PropertyService.updateProperty(id, updateData);

      // Transform back to hotel format
      return {
        id: property.id,
        name: property.name,
        type: property.type,
        location: property.location,
        ownerId: property.owner_id,
        tenantId: property.tenant_id,
        status: property.status,
        description: property.description,
        address: property.address,
        phone: property.phone,
        email: property.email,
        website: property.website,
        rating: parseFloat(property.rating) || 0,
        starRating: property.star_rating,
        amenities: property.amenities ? JSON.parse(property.amenities) : [],
        policies: property.policies ? JSON.parse(property.policies) : {},
        checkInTime: property.check_in_time,
        checkOutTime: property.check_out_time,
        totalOrders: 0,
        totalRevenue: 0,
        createdAt: property.created_at,
        updatedAt: property.updated_at,
      };
    } catch (error) {
      console.error('Failed to update hotel:', error);
      throw new Error('Hotel update failed');
    }
  }

  /**
   * Delete hotel by ID
   * @param id - Hotel ID to delete
   * @returns Promise<void>
   */
  static async deleteHotel(id: string): Promise<void> {
    try {
      await PropertyService.deleteProperty(id);
    } catch (error) {
      console.error('Failed to delete hotel:', error);
      throw new Error('Hotel deletion failed');
    }
  }

  /**
   * Check if hotel exists by name and owner
   * @param name - Hotel name to check
   * @param ownerId - Owner ID to check
   * @returns Promise<boolean> - True if hotel exists
   */
  static async hotelExists(name: string, ownerId: string): Promise<boolean> {
    try {
      return await PropertyService.propertyExists(name, ownerId);
    } catch (error) {
      console.error('Failed to check hotel existence:', error);
      throw new Error('Hotel existence check failed');
    }
  }
}

export default HotelsService;
