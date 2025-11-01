/**
 * Property Database Service
 *
 * Handles all database operations related to properties
 * Features: CRUD operations, detailed queries, booking checks
 * Location: lib/database/properties/PropertyService.ts
 * Modularity: Separated from main database service for better organization
 * Scalability: Can be easily extended with additional property-related operations
 * Consistency: Uses centralized types and connection pooling
 */

import { Pool } from 'pg';
import { Property, PropertyFilters, PropertyUpdateData } from '../types';

const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

/**
 * Service class for property database operations
 */
export class PropertyService {
  /**
   * Get properties with detailed information including images, rooms, services, and menu items
   * @param filters - Filters to apply to the query
   * @param includeDetails - Whether to include related data (rooms, services, menu items)
   * @returns Promise<Property[]> - Array of properties with detailed information
   */
  static async getPropertiesDetailed(
    filters: PropertyFilters = {},
    includeDetails: boolean = true
  ): Promise<Property[]> {
    const client = await pool.connect();
    try {
      let whereClause = 'WHERE 1=1';
      const values: (string | number | boolean)[] = [];
      let paramCount = 0;

      if (filters.ownerId) {
        paramCount++;
        whereClause += ` AND p.owner_id = $${paramCount}`;
        values.push(filters.ownerId);
      }

      if (filters.propertyId) {
        paramCount++;
        whereClause += ` AND p.id = $${paramCount}`;
        values.push(filters.propertyId);
      }

      if (filters.type) {
        paramCount++;
        whereClause += ` AND p.type = $${paramCount}`;
        values.push(filters.type);
      }

      if (filters.status) {
        paramCount++;
        whereClause += ` AND p.status = $${paramCount}`;
        values.push(filters.status);
      }

      const query = `
        SELECT
          p.*,
          COALESCE(
            (SELECT json_agg(
              json_build_object(
                'id', pi.id,
                'image_url', pi.image_url,
                'image_type', pi.image_type,
                'alt_text', pi.alt_text,
                'caption', pi.caption,
                'sort_order', pi.sort_order,
                'is_primary', pi.is_primary,
                'is_active', pi.is_active
              ) ORDER BY pi.sort_order, pi.created_at
            )
            FROM property_images pi
            WHERE pi.property_id = p.id AND pi.is_active = true
          ), '[]'::json
          ) as images,
          ${
            includeDetails
              ? `
          COALESCE(
            (SELECT json_agg(
              json_build_object(
                'id', rt.id,
                'room_code', rt.room_code,
                'name', rt.name,
                'description', rt.description,
                'room_type', rt.room_type,
                'size_sqm', rt.size_sqm,
                'max_occupancy', rt.max_occupancy,
                'base_price', rt.base_price,
                'currency', rt.currency,
                'bed_configuration', rt.bed_configuration,
                'amenities', rt.amenities,
                'view_type', rt.view_type,
                'floor_number', rt.floor_number,
                'is_smoking_allowed', rt.is_smoking_allowed,
                'is_pet_friendly', rt.is_pet_friendly,
                'is_accessible', rt.is_accessible,
                'status', rt.status,
                'created_at', rt.created_at,
                'updated_at', rt.updated_at
              ) ORDER BY rt.created_at
            )
            FROM room_types rt
            WHERE rt.property_id = p.id AND rt.status = 'active'
          ), '[]'::json
          ) as rooms,
          COALESCE(
            (SELECT json_agg(
              json_build_object(
                'id', ps.id,
                'service_name', ps.service_name,
                'service_type', ps.service_type,
                'description', ps.description,
                'price', ps.price,
                'price_type', ps.price_type,
                'currency', ps.currency,
                'duration_minutes', ps.duration_minutes,
                'is_available', ps.is_available,
                'requires_booking', ps.requires_booking,
                'advance_booking_hours', ps.advance_booking_hours,
                'max_capacity', ps.max_capacity,
                'age_restriction', ps.age_restriction,
                'service_schedule', ps.service_schedule,
                'created_at', ps.created_at,
                'updated_at', ps.updated_at
              ) ORDER BY ps.created_at
            )
            FROM property_services ps
            WHERE ps.property_id = p.id AND ps.is_available = true
          ), '[]'::json
          ) as services,
          COALESCE(
            (SELECT json_agg(
              json_build_object(
                'id', mi.id,
                'category', mi.category,
                'name', mi.name,
                'description', mi.description,
                'price', mi.price,
                'currency', mi.currency,
                'is_available', mi.is_available,
                'is_featured', mi.is_featured,
                'allergens', mi.allergens,
                'dietary_info', mi.dietary_info,
                'preparation_time', mi.preparation_time,
                'spice_level', mi.spice_level,
                'image_url', mi.image_url,
                'sort_order', mi.sort_order,
                'created_at', mi.created_at,
                'updated_at', mi.updated_at
              ) ORDER BY mi.sort_order, mi.created_at
            )
            FROM menu_items mi
            WHERE mi.property_id = p.id AND mi.is_available = true
          ), '[]'::json
          ) as menu_items
          `
              : ''
          }
        FROM properties p
        ${whereClause}
        ORDER BY p.created_at DESC
      `;

      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Create a new property with detailed information
   * @param data - Property data to create
   * @returns Promise<Property> - Created property
   */
  static async createPropertyDetailed(
    data: Partial<Property>
  ): Promise<Property> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO properties (
          name, type, location, owner_id, tenant_id, status, description, address,
          phone, email, website, property_code, check_in_time, check_out_time,
          cancellation_policy, house_rules, minimum_stay, maximum_stay,
          advance_booking_days, instant_booking, capacity, price_range,
          cuisine_type, star_rating, opening_hours, social_media, amenities
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
        ) RETURNING *
      `;

      const values = [
        data.name,
        data.type,
        data.location,
        data.owner_id,
        data.tenant_id || 'default-tenant',
        data.status || 'active',
        data.description,
        data.address,
        data.phone,
        data.email,
        data.website,
        data.property_code,
        data.check_in_time,
        data.check_out_time,
        data.cancellation_policy,
        data.house_rules,
        data.minimum_stay,
        data.maximum_stay,
        data.advance_booking_days,
        data.instant_booking,
        data.capacity,
        data.price_range,
        data.cuisine_type,
        data.star_rating,
        JSON.stringify(data.opening_hours),
        JSON.stringify(data.social_media),
        JSON.stringify(data.amenities || []),
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Update an existing property with detailed information
   * @param id - Property ID to update
   * @param data - Updated property data
   * @returns Promise<Property> - Updated property
   */
  static async updatePropertyDetailed(
    id: string,
    data: PropertyUpdateData
  ): Promise<Property> {
    const client = await pool.connect();
    try {
      const fields = Object.keys(data).filter((key) => data[key] !== undefined);
      const setClause = fields
        .map((field, index) => `${field} = $${index + 2}`)
        .join(', ');

      const query = `
        UPDATE properties
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const values = [
        id,
        ...fields.map((field) => {
          if (typeof data[field] === 'object' && data[field] !== null) {
            return JSON.stringify(data[field]);
          }
          return data[field];
        }),
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Delete a property by ID
   * @param id - Property ID to delete
   * @returns Promise<void>
   */
  static async deleteProperty(id: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM properties WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }

  /**
   * Check if a property has any active bookings
   * @param id - Property ID to check
   * @returns Promise<boolean> - True if property has bookings, false otherwise
   */
  static async propertyHasBookings(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      // This would check against a bookings table
      // For now, return false as we don't have bookings implemented yet
      return false;
    } finally {
      client.release();
    }
  }
}
