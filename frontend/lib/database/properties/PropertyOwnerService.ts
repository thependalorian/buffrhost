/**
 * Property Owner Database Service
 *
 * Handles all database operations related to property owners
 * Features: CRUD operations for property owners
 * Location: lib/database/properties/PropertyOwnerService.ts
 * Modularity: Separated from main database service for better organization
 * Scalability: Can be easily extended with additional owner-related operations
 * Consistency: Uses centralized types and connection pooling
 */

import { Pool } from 'pg';
import { PropertyOwner } from '../types';

const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

/**
 * Service class for property owner database operations
 */
export class PropertyOwnerService {
  /**
   * Create a new property owner
   * @param data - Property owner data to create
   * @returns Promise<PropertyOwner> - Created property owner
   */
  static async createPropertyOwner(
    data: Partial<PropertyOwner>
  ): Promise<PropertyOwner> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO property_owners (
          user_id, business_name, business_type, registration_number, tax_id,
          contact_person, phone, email, address, city, country, website, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `;

      const values = [
        data.user_id,
        data.business_name,
        data.business_type,
        data.registration_number,
        data.tax_id,
        data.contact_person,
        data.phone,
        data.email,
        data.address,
        data.city,
        data.country,
        data.website,
        data.description,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Get property owner by user ID
   * @param userId - User ID to search for
   * @returns Promise<PropertyOwner | null> - Property owner data or null if not found
   */
  static async getPropertyOwner(userId: string): Promise<PropertyOwner | null> {
    const client = await pool.connect();
    try {
      const query = 'SELECT * FROM property_owners WHERE user_id = $1';
      const result = await client.query(query, [userId]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
}
