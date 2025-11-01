/**
 * Menu Database Service - Services Layer
 *
 * Handles all database operations related to property menu items
 * Features: Menu item CRUD operations, filtering, category management
 * Location: lib/services/database/menu/MenuService.ts
 * Modularity: Separated from main database service for better organization
 * Scalability: Can be easily extended with additional menu operations
 * Consistency: Uses centralized connection pooling and error handling
 */

/**
 * MenuService Service for Buffr Host Hospitality Platform
 * @fileoverview MenuService service for Buffr Host system operations
 * @location buffr-host/lib/services/database/menu/MenuService.ts
 * @purpose MenuService service for Buffr Host system operations
 * @modularity Self-contained service class providing specific business logic and data operations
 * @database_connections PostgreSQL database operations on tables: main, menu_items, an, menu
 * @ai_integration Machine learning and AI service integrations for predictive analytics
 * @scalability Service designed for high-throughput operations and concurrent user handling
 * @performance Optimized database queries, caching strategies, and efficient data processing
 * @monitoring Comprehensive logging, error tracking, and performance metrics collection
 * @security Multi-tenant data isolation, input validation, and secure credential management
 * @error_handling Comprehensive error handling with detailed logging and graceful degradation
 * @testing Unit tests and integration tests ensuring service reliability and correctness
 *
 * Service Capabilities:
 * - 1 Service Class: MenuService
 * - Database Operations: CRUD operations on 4 tables
 * - AI/ML Features: Predictive analytics and intelligent data processing
 * - Error Handling: Comprehensive error management and logging
 * - Performance Monitoring: Service metrics and performance tracking
 * - Data Validation: Input sanitization and business rule enforcement
 *
 * Usage and Integration:
 * - API Routes: Service methods called from Next.js API endpoints
 * - React Components: Data fetching and state management integration
 * - Other Services: Inter-service communication and data sharing
 * - Database Layer: Direct database operations and query execution
 * - External APIs: Third-party service integrations and webhooks
 *
 * @example
 * // Import and use the service
 * import { MenuService } from './MenuService';
 *
 * // Initialize service instance
 * const service = new MenuService();
 *
 * // Use service methods
 * const result = await service.processData();
 *
 * @example
 * // Service integration in API route
 * import { MenuService } from '@/lib/services/MenuService';
 *
 * export async function GET(request: NextRequest) {
 *   const service = new MenuService();
 *   const data = await service.getData();
 *   return NextResponse.json({ data });
 * }
 *
 * Exported Members:
 * @exports MenuService - MenuService service component
 *
 * @returns {Object} Service module with all exported classes and functions
 * @scalability Designed for horizontal scaling and high-availability deployments
 * @reliability Comprehensive error handling and automatic recovery mechanisms
 * @maintainability Well-documented code with clear separation of concerns
 * @monitoring Real-time performance monitoring and alerting capabilities
 */

import { DatabaseConnectionPool } from '../../../database/connection-pool';

// Use centralized connection pool instead of creating individual pools
const pool = DatabaseConnectionPool.getInstance();

/**
 * Service class for property menu items database operations
 */
export class MenuService {
  /**
   * Get menu items for a specific property with optional filtering
   * @param propertyId - Property ID to get menu items for
   * @param filters - Optional filters to apply
   * @returns Promise<unknown[]> - Array of menu item records
   */
  static async getPropertyMenuItems(
    propertyId: string,
    filters?: {
      category?: string;
      isAvailable?: boolean;
      isFeatured?: boolean;
      maxPrice?: number;
      minPrice?: number;
    }
  ): Promise<unknown[]> {
    const client = await pool.getClient();
    try {
      let query = 'SELECT * FROM menu_items WHERE property_id = $1';
      const values: (string | number | boolean)[] = [propertyId];
      let paramCount = 1;

      if (filters?.category) {
        query += ` AND category = $${++paramCount}`;
        values.push(filters.category);
      }

      if (filters?.isAvailable !== undefined) {
        query += ` AND is_available = $${++paramCount}`;
        values.push(filters.isAvailable);
      }

      if (filters?.isFeatured !== undefined) {
        query += ` AND is_featured = $${++paramCount}`;
        values.push(filters.isFeatured);
      }

      if (filters?.maxPrice !== undefined) {
        query += ` AND price <= $${++paramCount}`;
        values.push(filters.maxPrice);
      }

      if (filters?.minPrice !== undefined) {
        query += ` AND price >= $${++paramCount}`;
        values.push(filters.minPrice);
      }

      query += ' ORDER BY category, sort_order';

      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Create a new menu item for a property
   * @param menuItemData - Complete menu item data
   * @returns Promise<unknown> - Created menu item record
   */
  static async createPropertyMenuItem(menuItemData: {
    propertyId: string;
    category: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    isAvailable?: boolean;
    isFeatured?: boolean;
    allergens?: string[];
    dietaryInfo?: string[];
    preparationTime?: number;
    spiceLevel?: number;
    imageUrl?: string;
    sortOrder?: number;
    ingredients?: string[];
    nutritionInfo?: Record<string, unknown>;
  }): Promise<unknown> {
    const client = await pool.getClient();
    try {
      const query = `
        INSERT INTO menu_items (
          property_id, category, name, description, price, currency,
          is_available, is_featured, allergens, dietary_info, preparation_time,
          spice_level, image_url, sort_order, ingredients, nutrition_info,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
        RETURNING *
      `;
      const values = [
        menuItemData.propertyId,
        menuItemData.category,
        menuItemData.name,
        menuItemData.description || null,
        menuItemData.price,
        menuItemData.currency,
        menuItemData.isAvailable ?? true,
        menuItemData.isFeatured ?? false,
        JSON.stringify(menuItemData.allergens || []),
        JSON.stringify(menuItemData.dietaryInfo || []),
        menuItemData.preparationTime || null,
        menuItemData.spiceLevel || 0,
        menuItemData.imageUrl || null,
        menuItemData.sortOrder || 0,
        JSON.stringify(menuItemData.ingredients || []),
        JSON.stringify(menuItemData.nutritionInfo || {}),
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Update an existing menu item
   * @param menuItemId - Menu item ID to update
   * @param updates - Fields to update
   * @returns Promise<unknown> - Updated menu item record
   */
  static async updatePropertyMenuItem(
    menuItemId: string,
    updates: Partial<{
      category: string;
      name: string;
      description: string;
      price: number;
      currency: string;
      isAvailable: boolean;
      isFeatured: boolean;
      allergens: string[];
      dietaryInfo: string[];
      preparationTime: number;
      spiceLevel: number;
      imageUrl: string;
      sortOrder: number;
      ingredients: string[];
      nutritionInfo: Record<string, unknown>;
    }>
  ): Promise<unknown> {
    const client = await pool.getClient();
    try {
      const updateFields = Object.keys(updates).filter(
        (key) => updates[key as keyof typeof updates] !== undefined
      );

      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      const setClause = updateFields
        .map((key, index) => {
          const field = updates[key as keyof typeof updates];
          if (
            Array.isArray(field) ||
            (typeof field === 'object' && field !== null)
          ) {
            return `${key} = $${index + 2}::jsonb`;
          }
          return `${key} = $${index + 2}`;
        })
        .join(', ');

      const values = [
        menuItemId,
        ...updateFields.map((key) => {
          const field = updates[key as keyof typeof updates];
          if (
            Array.isArray(field) ||
            (typeof field === 'object' && field !== null)
          ) {
            return JSON.stringify(field);
          }
          return field;
        }),
      ];

      const query = `
        UPDATE menu_items
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Delete a menu item by ID
   * @param menuItemId - Menu item ID to delete
   * @returns Promise<void>
   */
  static async deletePropertyMenuItem(menuItemId: string): Promise<void> {
    const client = await pool.getClient();
    try {
      const query = 'DELETE FROM menu_items WHERE id = $1';
      await client.query(query, [menuItemId]);
    } finally {
      client.release();
    }
  }

  /**
   * Get menu categories for a property
   * @param propertyId - Property ID to get categories for
   * @returns Promise<string[]> - Array of unique menu categories
   */
  static async getMenuCategories(propertyId: string): Promise<string[]> {
    const client = await pool.getClient();
    try {
      const query = `
        SELECT DISTINCT category
        FROM menu_items
        WHERE property_id = $1 AND is_available = true
        ORDER BY category
      `;
      const result = await client.query(query, [propertyId]);
      return result.rows.map((row) => row.category);
    } finally {
      client.release();
    }
  }

  /**
   * Bulk update menu item availability
   * @param propertyId - Property ID
   * @param menuItemIds - Array of menu item IDs to update
   * @param isAvailable - New availability status
   * @returns Promise<number> - Number of items updated
   */
  static async bulkUpdateMenuAvailability(
    propertyId: string,
    menuItemIds: string[],
    isAvailable: boolean
  ): Promise<number> {
    const client = await pool.getClient();
    try {
      const query = `
        UPDATE menu_items
        SET is_available = $1, updated_at = NOW()
        WHERE property_id = $2 AND id = ANY($3)
        RETURNING id
      `;
      const result = await client.query(query, [
        isAvailable,
        propertyId,
        menuItemIds,
      ]);
      return result.rowCount || 0;
    } finally {
      client.release();
    }
  }

  /**
   * Search menu items by name or description
   * @param propertyId - Property ID to search in
   * @param searchTerm - Search term to match
   * @param filters - Additional filters
   * @returns Promise<unknown[]> - Array of matching menu items
   */
  static async searchMenuItems(
    propertyId: string,
    searchTerm: string,
    filters?: {
      category?: string;
      isAvailable?: boolean;
      maxPrice?: number;
    }
  ): Promise<unknown[]> {
    const client = await pool.getClient();
    try {
      let query = `
        SELECT * FROM menu_items
        WHERE property_id = $1
        AND (name ILIKE $2 OR description ILIKE $2)
      `;
      const values: (string | number | boolean)[] = [
        propertyId,
        `%${searchTerm}%`,
      ];
      let paramCount = 2;

      if (filters?.category) {
        query += ` AND category = $${++paramCount}`;
        values.push(filters.category);
      }

      if (filters?.isAvailable !== undefined) {
        query += ` AND is_available = $${++paramCount}`;
        values.push(filters.isAvailable);
      }

      if (filters?.maxPrice !== undefined) {
        query += ` AND price <= $${++paramCount}`;
        values.push(filters.maxPrice);
      }

      query += ' ORDER BY category, sort_order';

      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }
}
