/**
 * Database Connection Utility
 * Handles database connections and queries for Buffr Host
 */

import { Pool } from 'pg';
import DatabaseServiceComplete from './database-complete';

// Database connection configuration
const pool = new Pool({
  connectionString:
    process.env['DATABASE_URL'] || process.env['NEON_DATABASE_URL'],
  ssl:
    process.env['NODE_ENV'] === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

export interface Property {
  id: string;
  buffr_id?: string;
  name: string;
  type: 'hotel' | 'restaurant' | 'cafe' | 'bar' | 'spa' | 'conference_center';
  location: string;
  owner_id: string;
  tenant_id: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  rating: number;
  total_orders: number;
  total_revenue: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePropertyData {
  name: string;
  type: string;
  location: string;
  owner_id: string;
  tenant_id: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  buffr_id?: string;
}

export class DatabaseService {
  /**
   * Create a new property in the database
   */
  static async createProperty(data: CreatePropertyData): Promise<Property> {
    const client = await pool.connect();

    try {
      const query = `
        INSERT INTO properties (
          buffr_id, name, type, location, owner_id, tenant_id, 
          description, address, phone, email, website, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending')
        RETURNING *
      `;

      const values = [
        data.buffr_id,
        data.name,
        data.type,
        data.location,
        data.owner_id,
        data.tenant_id,
        data.description || '',
        data.address,
        data.phone || null,
        data.email || null,
        data.website || null,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Get property by ID
   */
  static async getPropertyById(id: string): Promise<Property | null> {
    const client = await pool.connect();

    try {
      const query = 'SELECT * FROM properties WHERE id = $1';
      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Get property by Buffr ID
   */
  static async getPropertyByBuffrId(buffrId: string): Promise<Property | null> {
    const client = await pool.connect();

    try {
      const query = 'SELECT * FROM properties WHERE buffr_id = $1';
      const result = await client.query(query, [buffrId]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Get all properties with optional filters
   */
  static async getProperties(
    filters: {
      type?: string;
      location?: string;
      minRating?: number;
      status?: string;
      tenantId?: string;
    } = {}
  ): Promise<Property[]> {
    const client = await pool.connect();

    try {
      let query = `
        SELECT 
          p.id,
          p.buffr_id as "buffrId",
          p.name,
          p.type,
          p.location,
          p.owner_id as "ownerId",
          p.tenant_id as "tenantId",
          p.status,
          p.description,
          p.address,
          p.phone,
          p.email,
          p.website,
          p.rating,
          p.total_orders as "totalOrders",
          p.total_revenue as "totalRevenue",
          p.created_at as "createdAt",
          p.updated_at as "updatedAt",
          COALESCE(
            (
              SELECT json_agg(
                jsonb_build_object(
                  'id', pi.id,
                  'imageUrl', pi.image_url,
                  'imageType', pi.image_type,
                  'altText', pi.alt_text,
                  'sortOrder', pi.sort_order,
                  'isActive', pi.is_active
                )
                ORDER BY pi.sort_order
              )
              FROM property_images pi 
              WHERE pi.property_id = p.id AND pi.is_active = true
            ),
            '[]'::json
          ) as images,
          CASE 
            WHEN p.type = 'hotel' THEN 
              COALESCE(
                (
                  SELECT json_build_object(
                    'starRating', hd.star_rating,
                    'checkInTime', hd.check_in_time,
                    'checkOutTime', hd.check_out_time,
                    'totalRooms', hd.total_rooms,
                    'availableRooms', hd.available_rooms,
                    'roomTypes', hd.room_types,
                    'amenities', hd.amenities,
                    'policies', hd.policies
                  )
                  FROM hotel_details hd 
                  WHERE hd.property_id = p.id
                  LIMIT 1
                ),
                '{}'::json
              )
            WHEN p.type = 'restaurant' THEN
              COALESCE(
                (
                  SELECT json_build_object(
                    'cuisineType', rd.cuisine_type,
                    'priceRange', rd.price_range,
                    'openingHours', rd.opening_hours,
                    'deliveryAvailable', rd.delivery_available,
                    'takeawayAvailable', rd.takeaway_available,
                    'dineInAvailable', rd.dine_in_available,
                    'maxCapacity', rd.max_capacity,
                    'averagePrepTime', rd.average_prep_time,
                    'specialDietaryOptions', rd.special_dietary_options,
                    'paymentMethods', rd.payment_methods
                  )
                  FROM restaurant_details rd 
                  WHERE rd.property_id = p.id
                ),
                '{}'::json
              )
            ELSE '{}'::json
          END as details
        FROM properties p
        WHERE 1=1
      `;

      const values: (string | number | boolean)[] = [];
      const paramCount = 0;

      if (filters.type) {
        paramCount++;
        query += ` AND p.type = $${paramCount}`;
        values.push(filters.type);
      }

      if (filters.location) {
        paramCount++;
        query += ` AND p.location ILIKE $${paramCount}`;
        values.push(`%${filters.location}%`);
      }

      if (filters.minRating) {
        paramCount++;
        query += ` AND p.rating >= $${paramCount}`;
        values.push(filters.minRating);
      }

      if (filters.status) {
        paramCount++;
        query += ` AND p.status = $${paramCount}`;
        values.push(filters.status);
      }

      if (filters.tenantId) {
        paramCount++;
        query += ` AND p.tenant_id = $${paramCount}`;
        values.push(filters.tenantId);
      }

      query += `
        ORDER BY p.created_at DESC
      `;

      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Update property status
   */
  static async updatePropertyStatus(
    id: string,
    status: string
  ): Promise<Property | null> {
    const client = await pool.connect();

    try {
      const query = `
        UPDATE properties 
        SET status = $1, updated_at = NOW() 
        WHERE id = $2 
        RETURNING *
      `;

      const result = await client.query(query, [status, id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Check if property exists by name and owner
   */
  static async propertyExists(name: string, ownerId: string): Promise<boolean> {
    const client = await pool.connect();

    try {
      const query =
        'SELECT 1 FROM properties WHERE name = $1 AND owner_id = $2 LIMIT 1';
      const result = await client.query(query, [name, ownerId]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  /**
   * Test database connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  // User management methods
  static async getUserByEmail(email: string): Promise<any | null> {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [
        email,
      ]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  static async getUserByNationalId(nationalId: string): Promise<any | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE national_id = $1',
        [nationalId]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user by national ID:', error);
      return null;
    }
  }

  static async getUserByPhone(phoneNumber: string): Promise<any | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE phone_number = $1',
        [phoneNumber]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user by phone:', error);
      return null;
    }
  }

  // Password reset methods
  static async savePasswordResetToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<void> {
    try {
      await pool.query(
        'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [userId, token, expiresAt]
      );
    } catch (error) {
      console.error('Error saving password reset token:', error);
      throw error;
    }
  }

  static async validatePasswordResetToken(token: string): Promise<any | null> {
    try {
      const result = await pool.query(
        `SELECT u.*, prt.expires_at 
         FROM users u 
         JOIN password_reset_tokens prt ON u.id = prt.user_id 
         WHERE prt.token = $1 AND prt.expires_at > NOW() AND prt.used = false`,
        [token]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error validating password reset token:', error);
      return null;
    }
  }

  static async updateUserPassword(
    userId: string,
    hashedPassword: string
  ): Promise<void> {
    try {
      await pool.query(
        'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
        [hashedPassword, userId]
      );
    } catch (error) {
      console.error('Error updating user password:', error);
      throw error;
    }
  }

  static async invalidateUserResetTokens(userId: string): Promise<void> {
    try {
      await pool.query(
        'UPDATE password_reset_tokens SET used = true WHERE user_id = $1',
        [userId]
      );
    } catch (error) {
      console.error('Error invalidating reset tokens:', error);
      throw error;
    }
  }

  static async updateUserLastLogin(userId: string): Promise<void> {
    try {
      await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [
        userId,
      ]);
    } catch (error) {
      console.error('Error updating user last login:', error);
      throw error;
    }
  }

  static async createUser(userData: unknown): Promise<unknown> {
    try {
      const result = await pool.query(
        `INSERT INTO users (
          national_id, phone_number, email, full_name, country, 
          password_hash, projects, terms_accepted, marketing_consent, 
          is_verified, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        RETURNING *`,
        [
          userData.nationalId,
          userData.phoneNumber,
          userData.email,
          userData.fullName,
          userData.country,
          userData.passwordHash,
          JSON.stringify(userData.projects),
          userData.termsAccepted,
          userData.marketingConsent,
          userData.isVerified || false,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getPropertyImages(
    propertyId: string,
    filters: unknown = {}
  ): Promise<unknown[]> {
    try {
      let query = 'SELECT * FROM property_images WHERE property_id = $1';
      const params: (string | number | boolean)[] = [propertyId];
      let paramIndex = 2;

      if (filters.imageType) {
        query += ` AND image_type = $${paramIndex}`;
        params.push(filters.imageType);
        paramIndex++;
      }

      if (filters.roomId) {
        query += ` AND room_id = $${paramIndex}`;
        params.push(filters.roomId);
        paramIndex++;
      }

      query += ' ORDER BY sort_order, created_at DESC';

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting property images:', error);
      throw error;
    }
  }

  static async uploadPropertyImages(imageData: unknown): Promise<unknown[]> {
    try {
      const result = await pool.query(
        `INSERT INTO property_images (
          property_id, room_id, image_url, alt_text, image_type, 
          sort_order, is_active, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *`,
        [
          imageData.propertyId,
          imageData.roomId,
          imageData.imageUrl,
          imageData.altText,
          imageData.imageType,
          imageData.sortOrder || 0,
          imageData.isActive !== false,
        ]
      );
      return result.rows;
    } catch (error) {
      console.error('Error uploading property images:', error);
      throw error;
    }
  }

  static async updatePropertyImage(
    imageId: string,
    updateData: unknown
  ): Promise<unknown> {
    try {
      const setClause: (string | number)[] = [];
      const values: (string | number)[] = [];
      let paramIndex = 1;

      if (updateData.alt_text !== undefined) {
        setClause.push(`alt_text = $${paramIndex}`);
        values.push(updateData.alt_text);
        paramIndex++;
      }

      if (updateData.caption !== undefined) {
        setClause.push(`caption = $${paramIndex}`);
        values.push(updateData.caption);
        paramIndex++;
      }

      if (updateData.sort_order !== undefined) {
        setClause.push(`sort_order = $${paramIndex}`);
        values.push(updateData.sort_order);
        paramIndex++;
      }

      if (updateData.is_active !== undefined) {
        setClause.push(`is_active = $${paramIndex}`);
        values.push(updateData.is_active);
        paramIndex++;
      }

      if (setClause.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(imageId);
      const query = `UPDATE property_images SET ${setClause.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`;

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating property image:', error);
      throw error;
    }
  }

  // =============================================================================
  // COMPLETE PROPERTY MANAGEMENT METHODS
  // =============================================================================

  /**
   * Get properties with detailed information
   */
  static async getPropertiesDetailed(
    filters: unknown = {},
    includeDetails: boolean = true
  ): Promise<Property[]> {
    // Implementation for getting detailed properties
    const properties = await this.getProperties(filters);
    return properties;
  }

  /**
   * Create property with detailed information
   */
  static async createPropertyDetailed(data: unknown): Promise<Property> {
    // Implementation for creating detailed property
    return await this.createProperty(data);
  }

  /**
   * Update property with detailed information
   */
  static async updatePropertyDetailed(
    id: string,
    data: unknown
  ): Promise<Property> {
    // Implementation for updating detailed property
    // Implementation for updating property
    const client = await pool.connect();
    try {
      const {
        name,
        description,
        address,
        city,
        country,
        latitude,
        longitude,
        property_type,
        status,
        owner_id,
      } = data;
      const result = await client.query(
        'UPDATE properties SET name = $1, description = $2, address = $3, city = $4, country = $5, latitude = $6, longitude = $7, property_type = $8, status = $9, owner_id = $10, updated_at = NOW() WHERE id = $11 RETURNING *',
        [
          name,
          description,
          address,
          city,
          country,
          latitude,
          longitude,
          property_type,
          status,
          owner_id,
          id,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete property
   */
  static async deleteProperty(id: string): Promise<void> {
    // Implementation for deleting property
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM properties WHERE id = $1', [id]);
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Check if property has bookings
   */
  static async propertyHasBookings(id: string): Promise<boolean> {
    // Implementation for checking if property has bookings
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT 1 FROM bookings WHERE property_id = $1 LIMIT 1',
        [id]
      );
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking property bookings:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // =============================================================================
  // STAFF MANAGEMENT
  // =============================================================================

  static async createStaff(data: unknown): Promise<unknown> {
    return DatabaseServiceComplete.createStaff(data);
  }

  static async getStaff(
    propertyId: string,
    filters: unknown = {}
  ): Promise<unknown[]> {
    return DatabaseServiceComplete.getStaff(propertyId, filters);
  }

  static async updateStaff(id: string, data: unknown): Promise<unknown> {
    return DatabaseServiceComplete.updateStaff(id, data);
  }

  // =============================================================================
  // RESTAURANT TABLE MANAGEMENT
  // =============================================================================

  static async createTable(data: unknown): Promise<unknown> {
    return DatabaseServiceComplete.createTable(data);
  }

  static async getTables(
    propertyId: string,
    filters: unknown = {}
  ): Promise<unknown[]> {
    return DatabaseServiceComplete.getTables(propertyId, filters);
  }

  static async updateTable(id: string, data: unknown): Promise<unknown> {
    return DatabaseServiceComplete.updateTable(id, data);
  }

  // =============================================================================
  // TABLE RESERVATIONS
  // =============================================================================

  static async createReservation(data: unknown): Promise<unknown> {
    return DatabaseServiceComplete.createReservation(data);
  }

  static async getReservations(
    propertyId: string,
    filters: unknown = {}
  ): Promise<unknown[]> {
    return DatabaseServiceComplete.getReservations(propertyId, filters);
  }

  // =============================================================================
  // INVENTORY MANAGEMENT
  // =============================================================================

  static async createInventoryItem(data: unknown): Promise<unknown> {
    return DatabaseServiceComplete.createInventoryItem(data);
  }

  static async getInventoryItems(
    propertyId: string,
    filters: unknown = {}
  ): Promise<unknown[]> {
    return DatabaseServiceComplete.getInventoryItems(propertyId, filters);
  }

  static async updateInventoryStock(
    itemId: string,
    quantity: number,
    reason: string,
    staffId?: string
  ): Promise<void> {
    return DatabaseServiceComplete.updateInventoryStock(
      itemId,
      quantity,
      reason,
      staffId
    );
  }

  // =============================================================================
  // ORDER MANAGEMENT
  // =============================================================================

  static async createOrder(data: unknown): Promise<unknown> {
    return DatabaseServiceComplete.createOrder(data);
  }

  static async addOrderItem(data: unknown): Promise<unknown> {
    return DatabaseServiceComplete.addOrderItem(data);
  }

  static async getOrders(
    propertyId: string,
    filters: unknown = {}
  ): Promise<unknown[]> {
    return DatabaseServiceComplete.getOrders(propertyId, filters);
  }

  static async updateOrderStatus(id: string, status: string): Promise<unknown> {
    return DatabaseServiceComplete.updateOrderStatus(id, status);
  }

  // =============================================================================
  // MENU MANAGEMENT
  // =============================================================================

  static async createMenuItem(data: unknown): Promise<unknown> {
    return DatabaseServiceComplete.createMenuItem(data);
  }

  static async getMenuItems(
    propertyId: string,
    filters: unknown = {}
  ): Promise<unknown[]> {
    return DatabaseServiceComplete.getMenuItems(propertyId, filters);
  }

  // =============================================================================
  // ROOM MANAGEMENT
  // =============================================================================

  static async createRoom(data: unknown): Promise<unknown> {
    return DatabaseServiceComplete.createRoom(data);
  }

  static async getRooms(
    propertyId: string,
    filters: unknown = {}
  ): Promise<unknown[]> {
    return DatabaseServiceComplete.getRooms(propertyId, filters);
  }

  // =============================================================================
  // BOOKING MANAGEMENT
  // =============================================================================

  static async createBooking(data: unknown): Promise<unknown> {
    return DatabaseServiceComplete.createBooking(data);
  }

  static async getBookings(
    propertyId: string,
    filters: unknown = {}
  ): Promise<unknown[]> {
    return DatabaseServiceComplete.getBookings(propertyId, filters);
  }

  // =============================================================================
  // ANALYTICS
  // =============================================================================

  static async getPropertyAnalytics(
    propertyId: string,
    dateRange: { start: string; end: string }
  ): Promise<unknown[]> {
    return DatabaseServiceComplete.getPropertyAnalytics(propertyId, dateRange);
  }

  static async recordAnalytics(
    propertyId: string,
    metricType: string,
    value: number,
    additionalData?: unknown
  ): Promise<void> {
    return DatabaseServiceComplete.recordAnalytics(
      propertyId,
      metricType,
      value,
      additionalData
    );
  }
}

export default DatabaseService;
