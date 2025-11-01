/**
 * Image Database Service
 *
 * Handles all database operations related to property and room images
 * Features: CRUD operations, bulk upload, filtering, sorting
 * Location: lib/database/images/ImageService.ts
 * Modularity: Separated from main database service for better organization
 * Scalability: Can be easily extended with additional image operations
 * Consistency: Uses centralized types and connection pooling
 */

import { Pool } from 'pg';
import {
  PropertyImage,
  RoomImage,
  PropertyImageFilters,
  ImageUploadData,
} from '../types';

const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

/**
 * Service class for image database operations
 */
export class ImageService {
  /**
   * Get property images with optional filtering
   * @param propertyId - Property ID to get images for
   * @param filters - Optional filters to apply
   * @returns Promise<PropertyImage[]> - Array of property images
   */
  static async getPropertyImages(
    propertyId: string,
    filters: PropertyImageFilters = {}
  ): Promise<PropertyImage[]> {
    const client = await pool.connect();
    try {
      let whereClause = 'WHERE property_id = $1';
      const values: (string | number | boolean)[] = [propertyId];
      let paramCount = 1;

      if (filters.imageType) {
        paramCount++;
        whereClause += ` AND image_type = $${paramCount}`;
        values.push(filters.imageType);
      }

      if (filters.roomId) {
        paramCount++;
        whereClause += ` AND room_id = $${paramCount}`;
        values.push(filters.roomId);
      }

      if (filters.isPrimary !== undefined) {
        paramCount++;
        whereClause += ` AND is_primary = $${paramCount}`;
        values.push(filters.isPrimary);
      }

      if (filters.isActive !== undefined) {
        paramCount++;
        whereClause += ` AND is_active = $${paramCount}`;
        values.push(filters.isActive);
      }

      const query = `
        SELECT * FROM property_images
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
   * Upload multiple property images in bulk
   * @param data - Upload data including property ID and files
   * @returns Promise<PropertyImage[]> - Array of uploaded image records
   */
  static async uploadPropertyImages(
    data: ImageUploadData
  ): Promise<PropertyImage[]> {
    const client = await pool.connect();
    try {
      const uploadedImages: PropertyImage[] = [];

      for (const file of data.files) {
        // In a real implementation, you would upload the file to a storage service
        // and get the URL back. For now, we'll simulate it.
        const imageUrl = `https://example.com/images/${file.name || 'image'}`;

        const query = `
          INSERT INTO property_images (
            property_id, room_id, image_url, image_type, alt_text, caption,
            is_primary, file_size, mime_type
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *
        `;

        const values = [
          data.propertyId,
          data.roomId || null,
          imageUrl,
          file.type || 'property',
          file.altText || file.name || 'Property image',
          file.caption || null,
          file.isPrimary || false,
          file.fileSize || 0,
          file.mimeType || 'image/jpeg',
        ];

        const result = await client.query(query, values);
        uploadedImages.push(result.rows[0]);
      }

      return uploadedImages;
    } finally {
      client.release();
    }
  }

  /**
   * Update a property image
   * @param id - Image ID to update
   * @param data - Updated image data
   * @returns Promise<PropertyImage> - Updated image record
   */
  static async updatePropertyImage(
    id: string,
    data: Partial<PropertyImage>
  ): Promise<PropertyImage> {
    const client = await pool.connect();
    try {
      const fields = Object.keys(data).filter((key) => data[key] !== undefined);
      const setClause = fields
        .map((field, index) => `${field} = $${index + 2}`)
        .join(', ');

      const query = `
        UPDATE property_images
        SET ${setClause}
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
   * Delete a property image by ID
   * @param id - Image ID to delete
   * @returns Promise<void>
   */
  static async deletePropertyImage(id: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM property_images WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }

  /**
   * Get room images for a specific room
   * @param roomId - Room ID to get images for
   * @param filters - Optional filters to apply
   * @returns Promise<RoomImage[]> - Array of room images
   */
  static async getRoomImages(
    roomId: string,
    filters: { isPrimary?: boolean; isActive?: boolean } = {}
  ): Promise<RoomImage[]> {
    const client = await pool.connect();
    try {
      let whereClause = 'WHERE room_id = $1';
      const values: (string | boolean)[] = [roomId];
      let paramCount = 1;

      if (filters.isPrimary !== undefined) {
        paramCount++;
        whereClause += ` AND is_primary = $${paramCount}`;
        values.push(filters.isPrimary);
      }

      if (filters.isActive !== undefined) {
        paramCount++;
        whereClause += ` AND is_active = $${paramCount}`;
        values.push(filters.isActive);
      }

      const query = `
        SELECT * FROM room_images
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
   * Upload room images
   * @param data - Upload data for room images
   * @returns Promise<RoomImage[]> - Array of uploaded room image records
   */
  static async uploadRoomImages(data: ImageUploadData): Promise<RoomImage[]> {
    const client = await pool.connect();
    try {
      const uploadedImages: RoomImage[] = [];

      for (const file of data.files) {
        const imageUrl = `https://example.com/images/${file.name || 'room-image'}`;

        const query = `
          INSERT INTO room_images (
            room_id, image_url, image_type, alt_text, caption,
            is_primary, file_size, mime_type
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `;

        const values = [
          data.roomId,
          imageUrl,
          file.type || 'room',
          file.altText || file.name || 'Room image',
          file.caption || null,
          file.isPrimary || false,
          file.fileSize || 0,
          file.mimeType || 'image/jpeg',
        ];

        const result = await client.query(query, values);
        uploadedImages.push(result.rows[0]);
      }

      return uploadedImages;
    } finally {
      client.release();
    }
  }
}
