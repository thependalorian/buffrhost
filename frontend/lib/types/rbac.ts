/**
 * RBAC (Role-Based Access Control) Type Definitions
 *
 * Purpose: Type definitions for role-based access control, permissions, and authorization
 * in Buffr Host. Ensures secure access control across all system resources.
 * Location: lib/types/rbac.ts
 * Usage: Shared across all API routes, middleware, components, and services for authorization checks
 *
 * @module RBAC Types
 * @author Buffr Host Development Team
 * @version 1.0.0
 *
 * @description
 * This module defines the complete permission system for Buffr Host, including all available
 * permissions, roles, and access control contexts. All permissions follow the format:
 * 'resource:action' (e.g., 'bookings:read', 'customers:write').
 */

/**
 * Permission Enumeration
 *
 * Defines all available permissions in the Buffr Host system. Permissions are organized
 * by resource type and action level.
 *
 * @enum Permission
 * @property {string} USERS_READ - Read user information
 * @property {string} USERS_WRITE - Create/update users
 * @property {string} USERS_DELETE - Delete users
 * @property {string} USERS_MANAGE - Full user management access
 * @property {string} ROLES_READ - Read role information
 * @property {string} ROLES_WRITE - Create/update roles
 * @property {string} ROLES_DELETE - Delete roles
 * @property {string} ROLES_MANAGE - Full role management access
 * @property {string} PERMISSIONS_READ - Read permission information
 * @property {string} PERMISSIONS_WRITE - Create/update permissions
 * @property {string} PERMISSIONS_MANAGE - Full permission management access
 * @property {string} TENANTS_READ - Read tenant information
 * @property {string} TENANTS_WRITE - Create/update tenants
 * @property {string} TENANTS_DELETE - Delete tenants
 * @property {string} TENANTS_MANAGE - Full tenant management access
 * @property {string} PROPERTIES_READ - Read property information
 * @property {string} PROPERTIES_WRITE - Create/update properties
 * @property {string} PROPERTIES_DELETE - Delete properties
 * @property {string} PROPERTIES_MANAGE - Full property management access
 * @property {string} HOTEL_CONFIG_READ - Read hotel configuration
 * @property {string} HOTEL_CONFIG_WRITE - Create/update hotel configuration
 * @property {string} HOTEL_CONFIG_DELETE - Delete hotel configuration
 * @property {string} HOTEL_CONFIG_MANAGE - Full hotel configuration management
 * @property {string} BOOKINGS_READ - Read booking information
 * @property {string} BOOKINGS_WRITE - Create/update bookings
 * @property {string} BOOKINGS_DELETE - Delete bookings
 * @property {string} BOOKINGS_MANAGE - Full booking management access
 * @property {string} FINANCIAL_READ - Read financial information
 * @property {string} FINANCIAL_WRITE - Create/update financial records
 * @property {string} FINANCIAL_DELETE - Delete financial records
 * @property {string} FINANCIAL_MANAGE - Full financial management access
 * @property {string} SETTINGS_READ - Read system settings
 * @property {string} SETTINGS_WRITE - Update system settings
 * @property {string} SETTINGS_MANAGE - Full settings management access
 * @property {string} ANALYTICS_READ - Read analytics data
 * @property {string} ANALYTICS_WRITE - Create analytics reports
 * @property {string} ANALYTICS_MANAGE - Full analytics management access
 * @property {string} CUSTOMERS_READ - Read customer information
 * @property {string} CUSTOMERS_WRITE - Create/update customers
 * @property {string} CUSTOMERS_DELETE - Delete customers
 * @property {string} CUSTOMERS_MANAGE - Full customer management access
 * @property {string} STAFF_READ - Read staff information
 * @property {string} STAFF_WRITE - Create/update staff
 * @property {string} STAFF_DELETE - Delete staff
 * @property {string} STAFF_MANAGE - Full staff management access
 * @property {string} MENU_READ - Read menu information
 * @property {string} MENU_WRITE - Create/update menu items
 * @property {string} MENU_DELETE - Delete menu items
 * @property {string} MENU_MANAGE - Full menu management access
 * @property {string} ORDERS_READ - Read order information
 * @property {string} ORDERS_WRITE - Create/update orders
 * @property {string} ORDERS_DELETE - Delete orders
 * @property {string} ORDERS_MANAGE - Full order management access
 * @property {string} PAYMENTS_READ - Read payment information
 * @property {string} PAYMENTS_WRITE - Process payments
 * @property {string} PAYMENTS_DELETE - Delete payment records
 * @property {string} PAYMENTS_MANAGE - Full payment management access
 * @property {string} CMS_READ - Read CMS content
 * @property {string} CMS_WRITE - Create/update CMS content
 * @property {string} CMS_DELETE - Delete CMS content
 * @property {string} CMS_MANAGE - Full CMS management access
 * @property {string} LOYALTY_READ - Read loyalty program information
 * @property {string} LOYALTY_WRITE - Manage loyalty points
 * @property {string} LOYALTY_DELETE - Delete loyalty records
 * @property {string} LOYALTY_MANAGE - Full loyalty program management
 * @property {string} INVENTORY_READ - Read inventory information
 * @property {string} INVENTORY_WRITE - Update inventory levels
 * @property {string} INVENTORY_DELETE - Delete inventory records
 * @property {string} INVENTORY_MANAGE - Full inventory management access
 * @property {string} CALENDAR_READ - Read calendar information
 * @property {string} CALENDAR_WRITE - Create/update calendar events
 * @property {string} CALENDAR_DELETE - Delete calendar events
 * @property {string} CALENDAR_MANAGE - Full calendar management access
 * @property {string} SPA_READ - Read spa information
 * @property {string} SPA_WRITE - Create/update spa services
 * @property {string} SPA_DELETE - Delete spa services
 * @property {string} SPA_MANAGE - Full spa management access
 * @property {string} CONFERENCE_READ - Read conference room information
 * @property {string} CONFERENCE_WRITE - Create/update conference bookings
 * @property {string} CONFERENCE_DELETE - Delete conference bookings
 * @property {string} CONFERENCE_MANAGE - Full conference management access
 * @property {string} TRANSPORTATION_READ - Read transportation information
 * @property {string} TRANSPORTATION_WRITE - Create/update transportation bookings
 * @property {string} TRANSPORTATION_DELETE - Delete transportation bookings
 * @property {string} TRANSPORTATION_MANAGE - Full transportation management access
 * @property {string} AI_READ - Read AI/ML information
 * @property {string} AI_WRITE - Manage AI configurations
 * @property {string} AI_MANAGE - Full AI/ML management access
 * @property {string} REPORTS_READ - Read reports
 * @property {string} REPORTS_WRITE - Generate reports
 * @property {string} REPORTS_MANAGE - Full report management access
 * @property {string} NOTIFICATIONS_READ - Read notifications
 * @property {string} NOTIFICATIONS_WRITE - Send notifications
 * @property {string} NOTIFICATIONS_MANAGE - Full notification management access
 * @property {string} EMAIL_READ - Read email information
 * @property {string} EMAIL_WRITE - Send emails
 * @property {string} EMAIL_MANAGE - Full email management access
 * @property {string} FILES_READ - Read file information
 * @property {string} FILES_WRITE - Upload files
 * @property {string} FILES_DELETE - Delete files
 * @property {string} FILES_MANAGE - Full file management access
 *
 * @security Permissions are checked at the API route level and component level
 * @see {@link PermissionScope} for permission scope levels
 */
/**
 * Rbac Type Definitions for Buffr Host Hospitality Platform
 * @fileoverview Rbac type definitions for role-based access control and permission management
 * @location buffr-host/lib/types/rbac.ts
 * @purpose rbac type definitions for role-based access control and permission management
 * @modularity Centralized type definitions providing type safety across the entire Buffr Host application
 * @api_integration REST API endpoints, HTTP request/response handling
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
 * - 5 Interfaces: UserPermission, UserRoleAssignment, RolePermission...
 * - 4 Enums: Permission, Role, UserRole...
 * - Total: 9 type definitions
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
 * import type { Permission, Role, UserRole... } from './rbac';
 *
 * // Usage in component
 * interface ComponentProps {
 *   data: UserPermission;
 *   onAction: (event: EventType) => void;
 * }
 *
 * @example
 * // Database service usage
 * const userService = {
 *   async getUser(id: string): Promise<UserPermission> {
 *     // Type-safe database operations
 *     return await db.query('SELECT * FROM users WHERE id = $1', [id]);
 *   }
 * };
 *
 * Exported Types:
 * @typedef {Enum} Permission
 * @typedef {Enum} Role
 * @typedef {Enum} UserRole
 * @typedef {Enum} PermissionScope
 * @typedef {Interface} UserPermission
 * @typedef {Interface} UserRoleAssignment
 * @typedef {Interface} RolePermission
 * @typedef {Interface} PermissionCheck
 * @typedef {Interface} RBACContext
 *
 * @returns {Object} Type definitions module with all exported types and interfaces
 * @type_safety Ensures 100% type coverage across the Buffr Host application
 * @documentation Comprehensive JSDoc documentation for developer experience
 * @maintainability Type-driven development enabling safe refactoring and evolution
 */

export enum Permission {
  // User management
  USERS_READ = 'users:read',
  USERS_WRITE = 'users:write',
  USERS_DELETE = 'users:delete',
  USERS_MANAGE = 'users:manage',

  // Role management
  ROLES_READ = 'roles:read',
  ROLES_WRITE = 'roles:write',
  ROLES_DELETE = 'roles:delete',
  ROLES_MANAGE = 'roles:manage',

  // Permission management
  PERMISSIONS_READ = 'permissions:read',
  PERMISSIONS_WRITE = 'permissions:write',
  PERMISSIONS_MANAGE = 'permissions:manage',

  // Tenant management
  TENANTS_READ = 'tenants:read',
  TENANTS_WRITE = 'tenants:write',
  TENANTS_DELETE = 'tenants:delete',
  TENANTS_MANAGE = 'tenants:manage',

  // Property management
  PROPERTIES_READ = 'properties:read',
  PROPERTIES_WRITE = 'properties:write',
  PROPERTIES_DELETE = 'properties:delete',
  PROPERTIES_MANAGE = 'properties:manage',

  // Hotel configuration
  HOTEL_CONFIG_READ = 'hotel_configuration:read',
  HOTEL_CONFIG_WRITE = 'hotel_configuration:write',
  HOTEL_CONFIG_DELETE = 'hotel_configuration:delete',
  HOTEL_CONFIG_MANAGE = 'hotel_configuration:manage',

  // Booking management
  BOOKINGS_READ = 'bookings:read',
  BOOKINGS_WRITE = 'bookings:write',
  BOOKINGS_DELETE = 'bookings:delete',
  BOOKINGS_MANAGE = 'bookings:manage',

  // Financial management
  FINANCIAL_READ = 'financial:read',
  FINANCIAL_WRITE = 'financial:write',
  FINANCIAL_DELETE = 'financial:delete',
  FINANCIAL_MANAGE = 'financial:manage',

  // System management
  SETTINGS_READ = 'settings:read',
  SETTINGS_WRITE = 'settings:write',
  SETTINGS_MANAGE = 'settings:manage',

  // Analytics
  ANALYTICS_READ = 'analytics:read',
  ANALYTICS_WRITE = 'analytics:write',
  ANALYTICS_MANAGE = 'analytics:manage',

  // Customer management
  CUSTOMERS_READ = 'customers:read',
  CUSTOMERS_WRITE = 'customers:write',
  CUSTOMERS_DELETE = 'customers:delete',
  CUSTOMERS_MANAGE = 'customers:manage',

  // Staff management
  STAFF_READ = 'staff:read',
  STAFF_WRITE = 'staff:write',
  STAFF_DELETE = 'staff:delete',
  STAFF_MANAGE = 'staff:manage',

  // Menu management
  MENU_READ = 'menu:read',
  MENU_WRITE = 'menu:write',
  MENU_DELETE = 'menu:delete',
  MENU_MANAGE = 'menu:manage',

  // Order management
  ORDERS_READ = 'orders:read',
  ORDERS_WRITE = 'orders:write',
  ORDERS_DELETE = 'orders:delete',
  ORDERS_MANAGE = 'orders:manage',

  // Payment management
  PAYMENTS_READ = 'payments:read',
  PAYMENTS_WRITE = 'payments:write',
  PAYMENTS_DELETE = 'payments:delete',
  PAYMENTS_MANAGE = 'payments:manage',

  // CMS management
  CMS_READ = 'cms:read',
  CMS_WRITE = 'cms:write',
  CMS_DELETE = 'cms:delete',
  CMS_MANAGE = 'cms:manage',

  // Loyalty management
  LOYALTY_READ = 'loyalty:read',
  LOYALTY_WRITE = 'loyalty:write',
  LOYALTY_DELETE = 'loyalty:delete',
  LOYALTY_MANAGE = 'loyalty:manage',

  // Inventory management
  INVENTORY_READ = 'inventory:read',
  INVENTORY_WRITE = 'inventory:write',
  INVENTORY_DELETE = 'inventory:delete',
  INVENTORY_MANAGE = 'inventory:manage',

  // Calendar management
  CALENDAR_READ = 'calendar:read',
  CALENDAR_WRITE = 'calendar:write',
  CALENDAR_DELETE = 'calendar:delete',
  CALENDAR_MANAGE = 'calendar:manage',

  // Spa management
  SPA_READ = 'spa:read',
  SPA_WRITE = 'spa:write',
  SPA_DELETE = 'spa:delete',
  SPA_MANAGE = 'spa:manage',

  // Conference management
  CONFERENCE_READ = 'conference:read',
  CONFERENCE_WRITE = 'conference:write',
  CONFERENCE_DELETE = 'conference:delete',
  CONFERENCE_MANAGE = 'conference:manage',

  // Transportation management
  TRANSPORTATION_READ = 'transportation:read',
  TRANSPORTATION_WRITE = 'transportation:write',
  TRANSPORTATION_DELETE = 'transportation:delete',
  TRANSPORTATION_MANAGE = 'transportation:manage',

  // AI/ML management
  AI_READ = 'ai:read',
  AI_WRITE = 'ai:write',
  AI_MANAGE = 'ai:manage',

  // Reports management
  REPORTS_READ = 'reports:read',
  REPORTS_WRITE = 'reports:write',
  REPORTS_MANAGE = 'reports:manage',

  // Notifications management
  NOTIFICATIONS_READ = 'notifications:read',
  NOTIFICATIONS_WRITE = 'notifications:write',
  NOTIFICATIONS_MANAGE = 'notifications:manage',

  // Email management
  EMAIL_READ = 'email:read',
  EMAIL_WRITE = 'email:write',
  EMAIL_MANAGE = 'email:manage',

  // File management
  FILES_READ = 'files:read',
  FILES_WRITE = 'files:write',
  FILES_DELETE = 'files:delete',
  FILES_MANAGE = 'files:manage',
}

/**
 * Role Enumeration
 *
 * Defines the predefined roles in the Buffr Host system. Roles are assigned to users
 * and determine their default permissions.
 *
 * @enum Role
 * @property {string} SUPER_ADMIN - Platform super administrator with full system access
 * @property {string} ADMIN - Tenant administrator with full tenant access
 * @property {string} MANAGER - Property manager with management-level access
 * @property {string} STAFF - Staff member with operational access
 * @property {string} GUEST - Guest user with read-only access
 */
export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
  GUEST = 'guest',
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
  GUEST = 'guest',
}

export enum PermissionScope {
  GLOBAL = 'global', // System-wide access
  TENANT = 'tenant', // Tenant-specific access
  PROPERTY = 'property', // Property-specific access
  USER = 'user', // User-specific access
}

export interface UserPermission {
  permission: Permission;
  granted: boolean;
  source: string; // role, custom, etc.
}

export interface UserRoleAssignment {
  user_id: string;
  role: UserRole;
  assigned_by: string;
  assigned_at: Date;
}

export interface RolePermission {
  role: Role;
  permissions: Permission[];
  scope: PermissionScope;
}

export interface PermissionCheck {
  user_id: string;
  permission: Permission;
  resource_id?: string;
  scope?: PermissionScope;
}

/**
 * RBAC Context Interface
 *
 * Represents the authorization context for a user, including their role, permissions,
 * and tenant/property associations. Used throughout the application for access control checks.
 *
 * @interface RBACContext
 * @property {string} user_id - User ID for authorization checks
 * @property {UserRole} role - User's role in the system
 * @property {Permission[]} permissions - Array of permissions granted to the user
 * @property {string} [tenant_id] - Tenant ID for tenant-scoped operations
 * @property {string} [property_id] - Property ID for property-scoped operations
 *
 * @security This context must be validated on every API request
 * @example
 * const context: RBACContext = {
 *   user_id: 'user_123',
 *   role: UserRole.MANAGER,
 *   permissions: [Permission.BOOKINGS_READ, Permission.BOOKINGS_WRITE],
 *   tenant_id: 'tenant_abc',
 *   property_id: 'prop_xyz'
 * };
 */
export interface RBACContext {
  user_id: string;
  role: UserRole;
  permissions: Permission[];
  tenant_id?: string;
  property_id?: string;
}
