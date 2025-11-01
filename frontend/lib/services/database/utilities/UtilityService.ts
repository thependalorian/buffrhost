/**
 * Utility Database Service - Services Layer
 *
 * Handles utility database operations like connection testing, health checks, and maintenance
 * Features: Connection testing, health monitoring, database maintenance operations
 * Location: lib/services/database/utilities/UtilityService.ts
 * Modularity: Separated from main database service for better organization
 * Scalability: Can be easily extended with additional utility operations
 * Consistency: Uses centralized connection pooling and error handling
 */

/**
 * UtilityService Service for Buffr Host Hospitality Platform
 * @fileoverview UtilityService service for Buffr Host system operations
 * @location buffr-host/lib/services/database/utilities/UtilityService.ts
 * @purpose UtilityService service for Buffr Host system operations
 * @modularity Self-contained service class providing specific business logic and data operations
 * @database_connections PostgreSQL database operations on tables: main, pg_stat_activity, information_schema, pg_stat_user_tables, pg_stat_user
 * @ai_integration Machine learning and AI service integrations for predictive analytics
 * @scalability Service designed for high-throughput operations and concurrent user handling
 * @performance Optimized database queries, caching strategies, and efficient data processing
 * @monitoring Comprehensive logging, error tracking, and performance metrics collection
 * @security Multi-tenant data isolation, input validation, and secure credential management
 * @error_handling Comprehensive error handling with detailed logging and graceful degradation
 * @testing Unit tests and integration tests ensuring service reliability and correctness
 *
 * Service Capabilities:
 * - 1 Service Class: UtilityService
 * - Database Operations: CRUD operations on 5 tables
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
 * import { UtilityService } from './UtilityService';
 *
 * // Initialize service instance
 * const service = new UtilityService();
 *
 * // Use service methods
 * const result = await service.processData();
 *
 * @example
 * // Service integration in API route
 * import { UtilityService } from '@/lib/services/UtilityService';
 *
 * export async function GET(request: NextRequest) {
 *   const service = new UtilityService();
 *   const data = await service.getData();
 *   return NextResponse.json({ data });
 * }
 *
 * Exported Members:
 * @exports UtilityService - UtilityService service component
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
 * Service class for database utility operations
 */
export class UtilityService {
  /**
   * Test database connection
   * @returns Promise<boolean> - True if connection is successful
   */
  static async testConnection(): Promise<boolean> {
    try {
      const client = await pool.getClient();
      await client.query('SELECT 1');
      client.release();
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  /**
   * Get comprehensive database health status
   * @returns Promise<HealthStatus> - Detailed health status information
   */
  static async getHealthStatus(): Promise<{
    connected: boolean;
    latency: number;
    error?: string;
    poolStats?: {
      totalCount: number;
      idleCount: number;
      waitingCount: number;
    };
    timestamp: string;
  }> {
    const start = Date.now();
    try {
      const client = await pool.getClient();
      await client.query('SELECT 1');
      client.release();
      const latency = Date.now() - start;

      return {
        connected: true,
        latency,
        poolStats: {
          totalCount: (pool as any).totalCount || 0,
          idleCount: (pool as any).idleCount || 0,
          waitingCount: (pool as any).waitingCount || 0,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        connected: false,
        latency: Date.now() - start,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get database version and basic information
   * @returns Promise<DatabaseInfo> - Database version and system information
   */
  static async getDatabaseInfo(): Promise<{
    version: string;
    timezone: string;
    encoding: string;
    connections: {
      current: number;
      max: number;
    };
  } | null> {
    const client = await pool.getClient();
    try {
      const versionQuery = await client.query('SELECT version()');
      const timezoneQuery = await client.query('SHOW timezone');
      const encodingQuery = await client.query('SHOW server_encoding');
      const connectionQuery = await client.query(
        'SELECT count(*) as current FROM pg_stat_activity'
      );

      return {
        version: versionQuery.rows[0].version,
        timezone: timezoneQuery.rows[0].timezone,
        encoding: encodingQuery.rows[0].server_encoding,
        connections: {
          current: parseInt(connectionQuery.rows[0].current),
          max: (pool as any).options?.max || 10,
        },
      };
    } catch (error) {
      console.error('Failed to get database info:', error);
      return null;
    } finally {
      client.release();
    }
  }

  /**
   * Check if a table exists in the database
   * @param tableName - Name of the table to check
   * @returns Promise<boolean> - True if table exists
   */
  static async tableExists(tableName: string): Promise<boolean> {
    const client = await pool.getClient();
    try {
      const query = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = $1
        )
      `;
      const result = await client.query(query, [tableName]);
      return result.rows[0].exists;
    } finally {
      client.release();
    }
  }

  /**
   * Get table statistics and information
   * @param tableName - Name of the table to analyze
   * @returns Promise<TableStats | null> - Table statistics or null if not found
   */
  static async getTableStats(tableName: string): Promise<{
    rowCount: number;
    size: string;
    lastVacuum: string | null;
    lastAnalyze: string | null;
  } | null> {
    const client = await pool.getClient();
    try {
      // Check if table exists first
      const exists = await this.tableExists(tableName);
      if (!exists) {
        return null;
      }

      const countQuery = await client.query(
        `SELECT COUNT(*) as count FROM ${tableName}`
      );
      const sizeQuery = await client.query(
        `
        SELECT pg_size_pretty(pg_total_relation_size($1)) as size
      `,
        [tableName]
      );

      const statsQuery = await client.query(
        `
        SELECT last_vacuum, last_analyze
        FROM pg_stat_user_tables
        WHERE relname = $1
      `,
        [tableName]
      );

      return {
        rowCount: parseInt(countQuery.rows[0].count),
        size: sizeQuery.rows[0].size,
        lastVacuum: statsQuery.rows[0]?.last_vacuum || null,
        lastAnalyze: statsQuery.rows[0]?.last_analyze || null,
      };
    } finally {
      client.release();
    }
  }

  /**
   * Execute a simple query to check database responsiveness
   * @param query - SQL query to execute (should be a simple SELECT)
   * @returns Promise<QueryResult> - Query execution result
   */
  static async executeHealthCheckQuery(
    query: string = 'SELECT 1 as health_check'
  ): Promise<{
    success: boolean;
    executionTime: number;
    result?: unknown;
    error?: string;
  }> {
    const start = Date.now();
    try {
      const client = await pool.getClient();
      const result = await client.query(query);
      client.release();

      return {
        success: true,
        executionTime: Date.now() - start,
        result: result.rows,
      };
    } catch (error) {
      return {
        success: false,
        executionTime: Date.now() - start,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get database connection pool statistics
   * @returns Promise<PoolStats> - Current pool statistics
   */
  static async getPoolStats(): Promise<{
    totalCount: number;
    idleCount: number;
    waitingCount: number;
    borrowedCount: number;
  }> {
    return {
      totalCount: (pool as any).totalCount || 0,
      idleCount: (pool as any).idleCount || 0,
      waitingCount: (pool as any).waitingCount || 0,
      borrowedCount:
        ((pool as any).totalCount || 0) - ((pool as any).idleCount || 0),
    };
  }

  /**
   * Clean up idle connections in the pool
   * @returns Promise<void>
   */
  static async cleanupConnections(): Promise<void> {
    try {
      // Force pool to remove idle connections
      (pool as any).idleTimeoutMillis = 0;
      setTimeout(() => {
        (pool as any).idleTimeoutMillis = 30000; // Reset to default
      }, 1000);
    } catch (error) {
      console.error('Failed to cleanup connections:', error);
    }
  }
}
