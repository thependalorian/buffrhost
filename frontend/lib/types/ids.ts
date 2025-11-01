/**
 * Buffr Host ID Management System Type Definitions
 *
 * Purpose: Type definitions for multi-tenant ID validation, tenant context, and security levels
 * Location: lib/types/ids.ts
 * Usage: Shared across all API routes, middleware, and services for tenant isolation
 *
 * @module ID Management Types
 * @author Buffr Host Development Team
 * @version 1.0.0
 */

/**
 * Tenant Context Interface
 *
 * Represents the context of a tenant in the Buffr Host system, including tenant type,
 * user role, and permissions for authorization checks.
 *
 * @interface TenantContext
 * @property {string} tenantId - Unique tenant identifier (required for all queries)
 * @property {'hotel' | 'restaurant' | 'platform' | 'guest'} tenantType - Type of tenant business
 * @property {string} userId - Current user's unique identifier
 * @property {'admin' | 'manager' | 'staff' | 'guest' | 'platform_admin'} role - User's role within the tenant
 * @property {string[]} permissions - Array of permission strings granted to the user
 *
 * @example
 * const context: TenantContext = {
 *   tenantId: 'tenant_abc123',
 *   tenantType: 'hotel',
 *   userId: 'user_xyz789',
 *   role: 'manager',
 *   permissions: ['bookings:read', 'bookings:write', 'customers:read']
 * };
 */
/**
 * Ids Type Definitions for Buffr Host Hospitality Platform
 * @fileoverview Ids type definitions for identifier management and ID generation systems
 * @location buffr-host/lib/types/ids.ts
 * @purpose ids type definitions for identifier management and ID generation systems
 * @modularity Centralized type definitions providing type safety across the entire Buffr Host application
 * @security Type-safe security definitions for authentication, authorization, and data protection
 * @ai_integration Machine learning and AI service type definitions for predictive analytics
 * @authentication User authentication and session management type definitions
 * @typescript_strict Strict TypeScript type safety ensuring compile-time error prevention
 * @type_safety Comprehensive type coverage preventing runtime errors and improving developer experience
 * @scalability Type definitions supporting horizontal scaling and multi-tenant architecture
 * @maintainability Self-documenting types enabling easier code maintenance and refactoring
 * @testing Type-driven development supporting comprehensive test coverage
 *
 * Type Definitions Summary:
 * - 4 Interfaces: TenantContext, BusinessContext, ServiceContext...
 * - 1 Enum: SecurityLevel
 * - Total: 5 type definitions
 *
 * Usage and Integration:
 * - Frontend Components: Type-safe props and state management
 * - API Routes: Request/response type validation
 * - Database Services: Schema-aligned data operations
 * - Business Logic: Domain-specific type constraints
 * - Testing: Type-driven test case generation
 *
 * @example
 * // Import type definitions
 * import type { TenantContext, BusinessContext, ServiceContext... } from './ids';
 *
 * // Usage in component
 * interface ComponentProps {
 *   data: TenantContext;
 *   onAction: (event: EventType) => void;
 * }
 *
 * @example
 * // Database service usage
 * const userService = {
 *   async getUser(id: string): Promise<User> {
 *     // Type-safe database operations
 *     return await db.query('SELECT * FROM users WHERE id = $1', [id]);
 *   }
 * };
 *
 * Exported Types:
 * @typedef {Interface} TenantContext
 * @typedef {Interface} BusinessContext
 * @typedef {Interface} ServiceContext
 * @typedef {Interface} QueryContext
 * @typedef {TypeDefinition} ID_VALIDATION_RULES
 * @typedef {Enum} SecurityLevel
 *
 * @returns {Object} Type definitions module with all exported types and interfaces
 * @type_safety Ensures 100% type coverage across the Buffr Host application
 * @documentation Comprehensive JSDoc documentation for developer experience
 * @maintainability Type-driven development enabling safe refactoring and evolution
 */

export interface TenantContext {
  tenantId: string;
  tenantType: 'hotel' | 'restaurant' | 'platform' | 'guest';
  userId: string;
  role: 'admin' | 'manager' | 'staff' | 'guest' | 'platform_admin';
  permissions: string[];
}

/**
 * Business Context Interface
 *
 * Extends TenantContext with business-level information for multi-business tenant scenarios.
 *
 * @interface BusinessContext
 * @extends TenantContext
 * @property {string} businessId - Unique business identifier within the tenant
 * @property {string} [businessGroupId] - Business group identifier (for franchise/chain scenarios)
 * @property {string} [departmentId] - Department identifier within the business
 *
 * @example
 * const businessContext: BusinessContext = {
 *   ...tenantContext,
 *   businessId: 'business_hotel_001',
 *   businessGroupId: 'group_luxury_hotels',
 *   departmentId: 'dept_front_desk'
 * };
 */
export interface BusinessContext extends TenantContext {
  businessId: string;
  businessGroupId?: string;
  departmentId?: string;
}

/**
 * Service Context Interface
 *
 * Extends BusinessContext with service-level information for service-specific operations.
 *
 * @interface ServiceContext
 * @extends BusinessContext
 * @property {string} serviceId - Unique service identifier (e.g., restaurant, spa, concierge)
 * @property {'restaurant' | 'spa' | 'concierge' | 'room_service'} serviceType - Type of service
 *
 * @example
 * const serviceContext: ServiceContext = {
 *   ...businessContext,
 *   serviceId: 'service_restaurant_main',
 *   serviceType: 'restaurant'
 * };
 */
export interface ServiceContext extends BusinessContext {
  serviceId: string;
  serviceType: 'restaurant' | 'spa' | 'concierge' | 'room_service';
}

/**
 * Query Context Interface
 *
 * Defines the context required for database queries with proper tenant isolation.
 * All queries MUST include tenantId and userId for security and auditing.
 *
 * @interface QueryContext
 * @property {string} tenantId - Tenant ID (REQUIRED for all queries - prevents cross-tenant data access)
 * @property {string} userId - User ID (REQUIRED for all queries - required for audit trails)
 * @property {string} [businessId] - Business ID (optional - for business-scoped queries)
 * @property {string} [serviceId] - Service ID (optional - for service-scoped queries)
 * @property {string} [departmentId] - Department ID (optional - for department-scoped queries)
 * @property {'read' | 'write' | 'admin'} accessLevel - Access level for the query operation
 *
 * @security All queries must include tenantId to prevent cross-tenant data access violations
 * @audit All queries must include userId for audit trail tracking
 *
 * @example
 * const queryContext: QueryContext = {
 *   tenantId: 'tenant_abc123',
 *   userId: 'user_xyz789',
 *   businessId: 'business_hotel_001',
 *   accessLevel: 'read'
 * };
 */
export interface QueryContext {
  // Required for all queries
  tenantId: string;
  userId: string;

  // Optional based on context
  businessId?: string;
  serviceId?: string;
  departmentId?: string;

  // Access level
  accessLevel: 'read' | 'write' | 'admin';
}

/**
 * ID Validation Rules
 *
 * Regular expressions for validating various ID formats in the Buffr Host system.
 * All IDs must match these patterns to ensure security and prevent injection attacks.
 *
 * @constant ID_VALIDATION_RULES
 * @property {RegExp} tenantId - Pattern: 8-32 alphanumeric, underscore, or hyphen characters
 * @property {RegExp} businessId - Pattern: 8-32 alphanumeric, underscore, or hyphen characters
 * @property {RegExp} userId - Pattern: 8-32 alphanumeric, underscore, or hyphen characters
 * @property {RegExp} serviceId - Pattern: 8-32 alphanumeric, underscore, or hyphen characters
 * @property {RegExp} bookingId - Pattern: 12-48 alphanumeric, underscore, or hyphen characters
 * @property {RegExp} orderId - Pattern: 12-48 alphanumeric, underscore, or hyphen characters
 *
 * @example
 * // Validate tenant ID
 * if (ID_VALIDATION_RULES.tenantId.test(tenantId)) {
 *   // Valid tenant ID
 * }
 */
// ID Validation Rules
export const ID_VALIDATION_RULES = {
  tenantId: /^[a-zA-Z0-9_-]{8,32}$/,
  businessId: /^[a-zA-Z0-9_-]{8,32}$/,
  userId: /^[a-zA-Z0-9_-]{8,32}$/,
  serviceId: /^[a-zA-Z0-9_-]{8,32}$/,
  bookingId: /^[a-zA-Z0-9_-]{12,48}$/,
  orderId: /^[a-zA-Z0-9_-]{12,48}$/,
} as const;

/**
 * Security Level Enumeration
 *
 * Defines the security levels for data access in the Buffr Host multi-tenant system.
 * Used to enforce proper access control and data isolation.
 *
 * @enum SecurityLevel
 * @property {string} PUBLIC - Public data accessible to anyone (e.g., menus, public info)
 * @property {string} TENANT - Data accessible only within the same tenant
 * @property {string} BUSINESS - Data accessible only within the same business
 * @property {string} DEPARTMENT - Data accessible only within the same department
 * @property {string} USER - Data accessible only to the specific user
 * @property {string} ADMIN - Data accessible only to platform administrators
 *
 * @example
 * // Check if user has access to resource
 * if (securityLevel === SecurityLevel.TENANT && userContext.tenantId === resource.tenantId) {
 *   // Grant access
 * }
 */
// Security Levels
export enum SecurityLevel {
  PUBLIC = 'public', // Anyone can access (menus, public info)
  TENANT = 'tenant', // Same tenant only
  BUSINESS = 'business', // Same business only
  DEPARTMENT = 'department', // Same department only
  USER = 'user', // Same user only
  ADMIN = 'admin', // Platform admins only
}
