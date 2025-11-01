/**
 * Room Database Service
 *
 * Handles all database operations related to property rooms
 * Features: CRUD operations, booking checks, filtering
 * Location: lib/database/rooms/RoomService.ts
 * Modularity: Separated from main database service for better organization
 * Scalability: Can be easily extended with additional room operations
 * Consistency: Uses centralized types and connection pooling
 */

import { Pool } from 'pg';
import { Room } from '../types';

const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

/**
 * Service class for room database operations
 */
export class RoomService {
  /**
   * Get rooms for a specific property with optional filtering
   * @param propertyId - Property ID to get rooms for
   * @param filters - Optional filters to apply
   * @returns Promise<Room[]> - Array of rooms
   */
  static async getPropertyRooms(
    propertyId: string,
    filters: {
      roomId?: string;
      status?: string;
      roomType?: string;
      minPrice?: number;
      maxPrice?: number;
      minCapacity?: number;
      isAvailable?: boolean;
    } = {}
  ): Promise<Room[]> {
    const client = await pool.connect();
    try {
      let whereClause = 'WHERE property_id = $1';
      const values: (string | number | boolean)[] = [propertyId];
      let paramCount = 1;

      if (filters.roomId) {
        paramCount++;
        whereClause += ` AND id = $${paramCount}`;
        values.push(filters.roomId);
      }

      if (filters.status) {
        paramCount++;
        whereClause += ` AND status = $${paramCount}`;
        values.push(filters.status);
      }

      if (filters.roomType) {
        paramCount++;
        whereClause += ` AND room_type = $${paramCount}`;
        values.push(filters.roomType);
      }

      if (filters.minPrice !== undefined) {
        paramCount++;
        whereClause += ` AND base_price >= $${paramCount}`;
        values.push(filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        paramCount++;
        whereClause += ` AND base_price <= $${paramCount}`;
        values.push(filters.maxPrice);
      }

      if (filters.minCapacity !== undefined) {
        paramCount++;
        whereClause += ` AND max_occupancy >= $${paramCount}`;
        values.push(filters.minCapacity);
      }

      if (filters.isAvailable !== undefined) {
        paramCount++;
        whereClause += ` AND status = $${paramCount}`;
        values.push(filters.isAvailable ? 'available' : 'unavailable');
      }

      const query = `
        SELECT
          id, property_id, room_number, room_type, capacity, price_per_night,
          description, amenities, is_active, images, created_at, updated_at
        FROM room_types
        ${whereClause}
        ORDER BY room_number, created_at
      `;

      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Create a new room for a property
   * @param data - Room data to create
   * @returns Promise<Room> - Created room
   */
  static async createPropertyRoom(data: Partial<Room>): Promise<Room> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO room_types (
          property_id, room_code, name, description, room_type, size_sqm,
          max_occupancy, base_price, currency, bed_configuration, amenities,
          view_type, floor_number, is_smoking_allowed, is_pet_friendly, is_accessible
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
      `;

      const values = [
        data.property_id,
        data.room_number || `ROOM-${Date.now()}`,
        data.room_number,
        data.description,
        data.room_type,
        data.capacity, // Using capacity as size_sqm for now
        data.capacity,
        data.price_per_night,
        'USD', // Default currency
        JSON.stringify({}), // bed_configuration
        JSON.stringify(data.amenities || []),
        'standard', // view_type
        1, // floor_number
        false, // is_smoking_allowed
        false, // is_pet_friendly
        false, // is_accessible
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Update an existing room
   * @param id - Room ID to update
   * @param data - Updated room data
   * @returns Promise<Room> - Updated room
   */
  static async updatePropertyRoom(
    id: string,
    data: Partial<Room>
  ): Promise<Room> {
    const client = await pool.connect();
    try {
      const fields = Object.keys(data).filter((key) => data[key] !== undefined);
      const setClause = fields
        .map((field, index) => {
          if (field === 'amenities') {
            return `${field} = $${index + 2}::jsonb`;
          }
          return `${field} = $${index + 2}`;
        })
        .join(', ');

      const query = `
        UPDATE room_types
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const values = [
        id,
        ...fields.map((field) => {
          if (field === 'amenities') {
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
   * Delete a room by ID
   * @param id - Room ID to delete
   * @returns Promise<void>
   */
  static async deletePropertyRoom(id: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM room_types WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }

  /**
   * Check if a room has any active bookings
   * @param id - Room ID to check
   * @returns Promise<boolean> - True if room has bookings, false otherwise
   */
  static async roomHasBookings(id: string): Promise<boolean> {
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
