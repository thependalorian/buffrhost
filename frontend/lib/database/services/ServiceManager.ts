/**
 * Service Manager Database Service
 *
 * Handles all database operations related to property services and menu items
 * Features: CRUD operations for services and menu items, filtering, booking checks
 * Location: lib/database/services/ServiceManager.ts
 * Modularity: Separated from main database service for better organization
 * Scalability: Can be easily extended with additional service operations
 * Consistency: Uses centralized types and connection pooling
 */

import { Pool } from 'pg';
import { PropertyService, MenuItem } from '../types';

const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

/**
 * Service class for property services and menu items database operations
 */
export class ServiceManager {
  /**
   * Get services for a specific property with optional filtering
   * @param propertyId - Property ID to get services for
   * @param filters - Optional filters to apply
   * @returns Promise<PropertyService[]> - Array of property services
   */
  static async getPropertyServices(
    propertyId: string,
    filters: {
      serviceId?: string;
      serviceType?: string;
      isAvailable?: boolean;
      requiresBooking?: boolean;
    } = {}
  ): Promise<PropertyService[]> {
    const client = await pool.connect();
    try {
      let whereClause = 'WHERE property_id = $1';
      const values: (string | boolean)[] = [propertyId];
      let paramCount = 1;

      if (filters.serviceId) {
        paramCount++;
        whereClause += ` AND id = $${paramCount}`;
        values.push(filters.serviceId);
      }

      if (filters.serviceType) {
        paramCount++;
        whereClause += ` AND service_type = $${paramCount}`;
        values.push(filters.serviceType);
      }

      if (filters.isAvailable !== undefined) {
        paramCount++;
        whereClause += ` AND is_available = $${paramCount}`;
        values.push(filters.isAvailable);
      }

      if (filters.requiresBooking !== undefined) {
        paramCount++;
        whereClause += ` AND requires_booking = $${paramCount}`;
        values.push(filters.requiresBooking);
      }

      const query = `
        SELECT * FROM property_services
        ${whereClause}
        ORDER BY created_at
      `;

      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Create a new service for a property
   * @param data - Service data to create
   * @returns Promise<PropertyService> - Created service
   */
  static async createPropertyService(
    data: Partial<PropertyService>
  ): Promise<PropertyService> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO property_services (
          property_id, service_name, service_type, description, price, duration_minutes,
          is_active, max_capacity, booking_required
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;

      const values = [
        data.property_id,
        data.service_name,
        data.service_type,
        data.description,
        data.price,
        data.duration_minutes,
        data.is_active !== false,
        data.max_capacity,
        data.booking_required !== false,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Update an existing property service
   * @param id - Service ID to update
   * @param data - Updated service data
   * @returns Promise<PropertyService> - Updated service
   */
  static async updatePropertyService(
    id: string,
    data: Partial<PropertyService>
  ): Promise<PropertyService> {
    const client = await pool.connect();
    try {
      const fields = Object.keys(data).filter((key) => data[key] !== undefined);
      const setClause = fields
        .map((field, index) => `${field} = $${index + 2}`)
        .join(', ');

      const query = `
        UPDATE property_services
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const values = [id, ...fields.map((field) => data[field])];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Delete a property service by ID
   * @param id - Service ID to delete
   * @returns Promise<void>
   */
  static async deletePropertyService(id: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM property_services WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }

  /**
   * Check if a service has any active bookings
   * @param id - Service ID to check
   * @returns Promise<boolean> - True if service has bookings, false otherwise
   */
  static async serviceHasBookings(id: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      // This would check against a bookings table
      // For now, return false as we don't have bookings implemented yet
      return false;
    } finally {
      client.release();
    }
  }

  /**
   * Get menu items for a specific property with optional filtering
   * @param propertyId - Property ID to get menu items for
   * @param filters - Optional filters to apply
   * @returns Promise<MenuItem[]> - Array of menu items
   */
  static async getPropertyMenuItems(
    propertyId: string,
    filters: {
      category?: string;
      isAvailable?: boolean;
      isFeatured?: boolean;
    } = {}
  ): Promise<MenuItem[]> {
    const client = await pool.connect();
    try {
      let whereClause = 'WHERE property_id = $1';
      const values: (string | boolean)[] = [propertyId];
      let paramCount = 1;

      if (filters.category) {
        paramCount++;
        whereClause += ` AND category = $${paramCount}`;
        values.push(filters.category);
      }

      if (filters.isAvailable !== undefined) {
        paramCount++;
        whereClause += ` AND is_available = $${paramCount}`;
        values.push(filters.isAvailable);
      }

      if (filters.isFeatured !== undefined) {
        paramCount++;
        whereClause += ` AND is_featured = $${paramCount}`;
        values.push(filters.isFeatured);
      }

      const query = `
        SELECT * FROM menu_items
        ${whereClause}
        ORDER BY sort_order, created_at
      `;

      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Create a new menu item for a property
   * @param data - Menu item data to create
   * @returns Promise<MenuItem> - Created menu item
   */
  static async createPropertyMenuItem(
    data: Partial<MenuItem>
  ): Promise<MenuItem> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO menu_items (
          property_id, name, description, price, category, is_available
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

      const values = [
        data.property_id,
        data.name,
        data.description,
        data.price,
        data.category,
        data.is_available !== false,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Update an existing menu item
   * @param id - Menu item ID to update
   * @param data - Updated menu item data
   * @returns Promise<MenuItem> - Updated menu item
   */
  static async updatePropertyMenuItem(
    id: string,
    data: Partial<MenuItem>
  ): Promise<MenuItem> {
    const client = await pool.connect();
    try {
      const fields = Object.keys(data).filter((key) => data[key] !== undefined);
      const setClause = fields
        .map((field, index) => `${field} = $${index + 2}`)
        .join(', ');

      const query = `
        UPDATE menu_items
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const values = [id, ...fields.map((field) => data[field])];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Delete a menu item by ID
   * @param id - Menu item ID to delete
   * @returns Promise<void>
   */
  static async deletePropertyMenuItem(id: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM menu_items WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }
}
