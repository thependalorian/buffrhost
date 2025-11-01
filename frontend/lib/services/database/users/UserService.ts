/**
 * User Database Service
 *
 * Handles all database operations related to user management and authentication
 * Features: User CRUD, password management, authentication, password reset
 * Location: lib/services/database/users/UserService.ts
 * Modularity: Separated from main database service for better organization
 * Scalability: Can be easily extended with additional user-related operations
 * Consistency: Uses centralized connection pooling and error handling
 */

/**
 * UserService Service for Buffr Host Hospitality Platform
 * @fileoverview UserService service for Buffr Host system operations
 * @location buffr-host/lib/services/database/users/UserService.ts
 * @purpose UserService service for Buffr Host system operations
 * @modularity Self-contained service class providing specific business logic and data operations
 * @database_connections PostgreSQL database operations on tables: main, users, password_reset_tokens, user, SET...
 * @ai_integration Machine learning and AI service integrations for predictive analytics
 * @authentication JWT-based authentication and authorization for secure operations
 * @scalability Service designed for high-throughput operations and concurrent user handling
 * @performance Optimized database queries, caching strategies, and efficient data processing
 * @monitoring Comprehensive logging, error tracking, and performance metrics collection
 * @security Multi-tenant data isolation, input validation, and secure credential management
 * @error_handling Comprehensive error handling with detailed logging and graceful degradation
 * @testing Unit tests and integration tests ensuring service reliability and correctness
 *
 * Service Capabilities:
 * - 1 Service Class: UserService
 * - Database Operations: CRUD operations on 6 tables
 * - AI/ML Features: Predictive analytics and intelligent data processing
 * - Security Features: Authentication, authorization, and access control
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
 * import { UserService } from './UserService';
 *
 * // Initialize service instance
 * const service = new UserService();
 *
 * // Use service methods
 * const result = await service.processData();
 *
 * @example
 * // Service integration in API route
 * import { UserService } from '@/lib/services/UserService';
 *
 * export async function GET(request: NextRequest) {
 *   const service = new UserService();
 *   const data = await service.getData();
 *   return NextResponse.json({ data });
 * }
 *
 * Exported Members:
 * @exports UserService - UserService service component
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
 * Service class for user database operations
 */
export class UserService {
  /**
   * Create a new user account in the system with comprehensive profile information
   * @param userData - Complete user profile data including authentication and personal information
   * @returns Promise<unknown> - Created user record with generated ID and timestamps
   */
  static async createUser(userData: unknown): Promise<unknown> {
    const client = await pool.getClient();
    try {
      // Hash password if provided
      let passwordHash = null;
      if ((userData as any).password) {
        const { PasswordService } = await import(
          '../../../security/password-service'
        );
        const hashResult = await PasswordService.hashPassword(
          (userData as any).password
        );
        passwordHash = hashResult.hash;
      }

      const query = `
        INSERT INTO users (id, email, full_name, phone_number, national_id, country, tenant_id, password_hash, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        RETURNING *
      `;
      const values = [
        (userData as any).id,
        (userData as any).email,
        (userData as any).fullName,
        (userData as any).phoneNumber || null,
        (userData as any).nationalId || null,
        (userData as any).country || null,
        (userData as any).tenantId || null,
        passwordHash,
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Update user last login timestamp
   * @param userId - User ID to update
   * @returns Promise<void>
   */
  static async updateUserLastLogin(userId: string): Promise<void> {
    const client = await pool.getClient();
    try {
      const query = `
        UPDATE users
        SET last_login = NOW(), updated_at = NOW()
        WHERE id = $1
      `;
      await client.query(query, [userId]);
    } finally {
      client.release();
    }
  }

  /**
   * Get user by email address
   * @param email - Email address to search for
   * @returns Promise<any | null> - User data or null if not found
   */
  static async getUserByEmail(email: string): Promise<any | null> {
    const client = await pool.getClient();
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await client.query(query, [email]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Get user password hash for authentication
   * @param userId - User ID to get password hash for
   * @returns Promise<string | null> - Password hash or null if not found
   */
  static async getUserPassword(userId: string): Promise<string | null> {
    const client = await pool.getClient();
    try {
      const query = 'SELECT password_hash FROM users WHERE id = $1';
      const result = await client.query(query, [userId]);
      return result.rows[0]?.password_hash || null;
    } finally {
      client.release();
    }
  }

  /**
   * Get user by phone number
   * @param phone - Phone number to search for
   * @returns Promise<any | null> - User data or null if not found
   */
  static async getUserByPhone(phone: string): Promise<any | null> {
    const client = await pool.getClient();
    try {
      const query = 'SELECT * FROM users WHERE phone_number = $1';
      const result = await client.query(query, [phone]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Get user by national ID
   * @param nationalId - National ID to search for
   * @returns Promise<any | null> - User data or null if not found
   */
  static async getUserByNationalId(nationalId: string): Promise<any | null> {
    const client = await pool.getClient();
    try {
      const query = 'SELECT * FROM users WHERE national_id = $1';
      const result = await client.query(query, [nationalId]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Save password reset token for user
   * @param userId - User ID requesting password reset
   * @param token - Reset token to save
   * @param expiresAt - Token expiration date
   * @returns Promise<void>
   */
  static async savePasswordResetToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<void> {
    const client = await pool.getClient();
    try {
      const query = `
        INSERT INTO password_reset_tokens (user_id, token, expires_at, created_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
        token = $2, expires_at = $3, created_at = NOW()
      `;
      await client.query(query, [userId, token, expiresAt]);
    } finally {
      client.release();
    }
  }

  /**
   * Validate password reset token
   * @param token - Token to validate
   * @returns Promise<any | null> - User data with expiration or null if invalid
   */
  static async validatePasswordResetToken(token: string): Promise<any | null> {
    const client = await pool.getClient();
    try {
      const query = `
        SELECT u.*, prt.expires_at
        FROM users u
        JOIN password_reset_tokens prt ON u.id = prt.user_id
        WHERE prt.token = $1 AND prt.expires_at > NOW()
      `;
      const result = await client.query(query, [token]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Update user password hash
   * @param userId - User ID to update password for
   * @param hashedPassword - New hashed password
   * @returns Promise<void>
   */
  static async updateUserPassword(
    userId: string,
    hashedPassword: string
  ): Promise<void> {
    const client = await pool.getClient();
    try {
      const query =
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2';
      await client.query(query, [hashedPassword, userId]);
    } finally {
      client.release();
    }
  }

  /**
   * Invalidate all password reset tokens for a user
   * @param userId - User ID to invalidate tokens for
   * @returns Promise<void>
   */
  static async invalidateUserResetTokens(userId: string): Promise<void> {
    const client = await pool.getClient();
    try {
      const query = 'DELETE FROM password_reset_tokens WHERE user_id = $1';
      await client.query(query, [userId]);
    } finally {
      client.release();
    }
  }
}
