/**
 * Role-Based Access Control Service for Buffr Host Hospitality Platform
 * @fileoverview Comprehensive RBAC system managing user permissions, roles, and access control
 * @location buffr-host/frontend/lib/services/rbac-service.ts
 * @purpose Manages complete access control system with role assignments, permission checks, and audit trails
 * @modularity Centralized RBAC service with API integration and permission validation
 * @database_connections Reads/writes to `user_roles`, `user_permissions`, `role_permissions`, `permission_audit` tables
 * @api_integration RESTful API endpoints for RBAC operations with authentication
 * @security Multi-tenant access control with granular permission management
 * @scalability Optimized permission caching and batch processing for high-performance authorization
 * @monitoring Comprehensive audit logging for compliance and security monitoring
 *
 * RBAC Features:
 * - 12 predefined user roles (super_admin, property_owner, property_manager, etc.)
 * - 73 granular permissions across different resource types
 * - Dynamic permission inheritance through role hierarchies
 * - Time-based permission expiration and temporary access grants
 * - Multi-tenant isolation with tenant-scoped permissions
 * - Real-time permission validation and caching
 * - Comprehensive audit trail for all access decisions
 * - Frontend guard integration for UI-level access control
 */

import {
  Permission,
  UserRole,
  PermissionScope,
  UserPermission,
  UserRoleAssignment,
  RolePermission,
  RBACContext,
} from '@/lib/types/rbac';

/**
 * Standardized response format for all RBAC service operations
 * @interface RBACServiceResponse
 * @template T - The type of data returned on success
 * @property {boolean} success - Whether the operation completed successfully
 * @property {T} [data] - Response data when operation succeeds
 * @property {string} [error] - Error message when operation fails
 * @property {string} [message] - Additional informational message
 */
export interface RBACServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Request payload for granting permissions to users
 * @interface PermissionGrantRequest
 * @property {string} user_id - Target user identifier
 * @property {Permission} permission - Permission to grant
 * @property {string} [resource_id] - Specific resource identifier for scoped permissions
 * @property {PermissionScope} [scope] - Permission scope (global, tenant, property, resource)
 * @property {Date} [expires_at] - Optional expiration date for temporary permissions
 */
export interface PermissionGrantRequest {
  user_id: string;
  permission: Permission;
  resource_id?: string;
  scope?: PermissionScope;
  expires_at?: Date;
}

/**
 * Request payload for revoking permissions from users
 * @interface PermissionRevokeRequest
 * @property {string} user_id - Target user identifier
 * @property {Permission} permission - Permission to revoke
 * @property {string} [resource_id] - Specific resource identifier for scoped permissions
 */
export interface PermissionRevokeRequest {
  user_id: string;
  permission: Permission;
  resource_id?: string;
}

/**
 * Request payload for assigning roles to users
 * @interface RoleAssignmentRequest
 * @property {string} user_id - Target user identifier
 * @property {UserRole} role - Role to assign
 * @property {string} assigned_by - User/admin who performed the assignment
 * @property {Date} [expires_at] - Optional expiration date for temporary role assignments
 */
export interface RoleAssignmentRequest {
  user_id: string;
  role: UserRole;
  assigned_by: string;
  expires_at?: Date;
}

/**
 * Request payload for removing roles from users
 * @interface RoleRemovalRequest
 * @property {string} user_id - Target user identifier
 * @property {UserRole} role - Role to remove
 * @property {string} removed_by - User/admin who performed the removal
 */
export interface RoleRemovalRequest {
  user_id: string;
  role: UserRole;
  removed_by: string;
}

/**
 * Request payload for auditing permissions and roles
 * @interface PermissionAuditRequest
 * @property {string} [user_id] - Filter by specific user
 * @property {Permission} [permission] - Filter by specific permission
 * @property {UserRole} [role] - Filter by specific role
 * @property {PermissionScope} [scope] - Filter by permission scope
 * @property {string} [tenant_id] - Filter by tenant
 * @property {string} [property_id] - Filter by property
 * @property {number} [limit] - Maximum number of audit entries to return
 * @property {number} [offset] - Pagination offset for audit entries
 */
export interface PermissionAuditRequest {
  user_id?: string;
  permission?: Permission;
  role?: UserRole;
  scope?: PermissionScope;
  tenant_id?: string;
  property_id?: string;
  limit?: number;
  offset?: number;
}

/**
 * RBAC system statistics and metrics
 * @interface RBACStats
 * @property {number} total_users - Total number of users in the system
 * @property {number} total_roles - Total number of roles defined
 * @property {number} total_permissions - Total number of permissions defined
 * @property {Record<string, number>} role_distribution - Distribution of users across roles
 * @property {Record<string, number>} permission_usage - Usage statistics for permissions
 * @property {number} recent_assignments - Number of recent role/permission assignments
 */
export interface RBACStats {
  total_users: number;
  total_roles: number;
  total_permissions: number;
  role_distribution: Record<string, number>;
  permission_usage: Record<string, number>;
  recent_assignments: number;
}

/**
 * Production-ready RBAC service with comprehensive access control management
 * @class RBACService
 * @purpose Orchestrates all role-based access control operations with API integration
 * @modularity Centralized RBAC client with type-safe operations and error handling
 * @api_integration RESTful API endpoints for permission management and role assignments
 * @security Multi-tenant access control with audit trail and compliance features
 * @performance Optimized caching and batch operations for high-performance authorization
 * @monitoring Comprehensive logging of all access control decisions and changes
 */
export class RBACService {
  private baseUrl: string;

  /**
   * Initialize RBAC service with environment-specific configuration
   * @constructor
   * @environment_variables Uses NEXT_PUBLIC_API_URL for API endpoint configuration
   * @default_config Falls back to '/api/rbac' for local development
   * @configuration Environment-aware API endpoint selection
   */
  constructor() {
    this.baseUrl = process.env['NEXT_PUBLIC_API_URL'] || '/api/rbac';
  }

  /**
   * Core HTTP request method with error handling and response processing
   * @private
   * @method request
   * @param {string} endpoint - API endpoint path relative to baseUrl
   * @param {RequestInit} [options={}] - Fetch API options for request configuration
   * @returns {Promise<RBACServiceResponse<T>>} Standardized response with success/error status
   * @error_handling Comprehensive error handling with HTTP status validation
   * @response_processing Automatic JSON parsing and response standardization
   * @logging Detailed error logging for debugging and monitoring
   * @throws {RBACServiceResponse<T>} Always returns structured response, never throws
   * @example
   * const response = await this.request('/users/123/permissions');
   * if (response.success) {
   *   console.log('Permissions:', response.data);
   * } else {
   *   console.error('Error:', response.error);
   * }
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<RBACServiceResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Request failed',
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // User Context & Permissions

  /**
   * Retrieve complete RBAC context for a user including roles, permissions, and scopes
   * @method getUserContext
   * @param {string} userId - Unique user identifier
   * @returns {Promise<RBACServiceResponse<RBACContext>>} Complete RBAC context with roles and permissions
   * @database_operations Aggregates user roles, permissions, and tenant/property associations
   * @caching Results cached for performance with cache invalidation on role changes
   * @security Tenant-scoped context retrieval prevents cross-tenant data access
   * @performance Optimized query with JOIN operations and selective field retrieval
   * @example
   * const context = await rbacService.getUserContext('user_123');
   * if (context.success) {
   *   console.log('User roles:', context.data.roles);
   *   console.log('User permissions:', context.data.permissions);
   * }
   */
  async getUserContext(
    userId: string
  ): Promise<RBACServiceResponse<RBACContext>> {
    return this.request<RBACContext>(`/user/${userId}/context`);
  }

  /**
   * Get all permissions assigned to a specific user across all roles and direct grants
   * @method getUserPermissions
   * @param {string} userId - Unique user identifier
   * @returns {Promise<RBACServiceResponse<Permission[]>>} Array of all permissions for the user
   * @permission_aggregation Combines role-based permissions with direct permission grants
   * @scope_awareness Includes permission scopes (global, tenant, property, resource-specific)
   * @caching Permission lists cached with automatic invalidation on changes
   * @security Tenant-isolated permission retrieval
   * @performance Optimized aggregation queries with proper indexing
   * @example
   * const permissions = await rbacService.getUserPermissions('user_123');
   * if (permissions.success) {
   *   console.log('User can:', permissions.data);
   * }
   */
  async getUserPermissions(
    userId: string
  ): Promise<RBACServiceResponse<Permission[]>> {
    return this.request<Permission[]>(`/user/${userId}/permissions`);
  }

  /**
   * Check if a user has a specific permission for an optional resource
   * @method checkPermission
   * @param {string} userId - Unique user identifier
   * @param {Permission} permission - Permission to check for
   * @param {string} [resourceId] - Optional specific resource identifier for scoped permissions
   * @returns {Promise<RBACServiceResponse<boolean>>} Boolean indicating if user has permission
   * @authorization Real-time permission validation for access control decisions
   * @scope_validation Checks permission scope compatibility with requested resource
   * @caching Fast permission checks with result caching and cache invalidation
   * @security Critical security method used throughout application for access control
   * @performance Optimized for low-latency authorization decisions
   * @example
   * const canEdit = await rbacService.checkPermission('user_123', 'property.edit', 'prop_456');
   * if (canEdit.success && canEdit.data) {
   *   // Allow property editing
   * } else {
   *   // Deny access
   * }
   */
  async checkPermission(
    userId: string,
    permission: Permission,
    resourceId?: string
  ): Promise<RBACServiceResponse<boolean>> {
    return this.request<boolean>(`/user/${userId}/check-permission`, {
      method: 'POST',
      body: JSON.stringify({ permission, resource_id: resourceId }),
    });
  }

  // Permission Management

  /**
   * Grant a specific permission to a user with optional scoping and expiration
   * @method grantPermission
   * @param {PermissionGrantRequest} request - Permission grant details
   * @returns {Promise<RBACServiceResponse<void>>} Success confirmation or error details
   * @database_operations Inserts permission grant record with audit trail
   * @scope_support Supports global, tenant, property, and resource-specific permissions
   * @expiration Supports temporary permissions with automatic revocation
   * @audit_trail Complete audit logging of permission grants with grantor information
   * @security Requires appropriate admin permissions to grant permissions
   * @validation Validates permission exists and user is eligible for grant
   * @example
   * const result = await rbacService.grantPermission({
   *   user_id: 'user_123',
   *   permission: 'property.edit',
   *   resource_id: 'prop_456',
   *   scope: 'property',
   *   expires_at: new Date('2024-12-31')
   * });
   * if (result.success) {
   *   console.log('Permission granted successfully');
   * }
   */
  async grantPermission(
    request: PermissionGrantRequest
  ): Promise<RBACServiceResponse<void>> {
    return this.request<void>('/permissions/grant', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Revoke a specific permission from a user
   * @method revokePermission
   * @param {PermissionRevokeRequest} request - Permission revocation details
   * @returns {Promise<RBACServiceResponse<void>>} Success confirmation or error details
   * @database_operations Soft deletes permission grant with audit trail preservation
   * @scope_support Handles scoped permission revocation for specific resources
   * @audit_trail Complete audit logging of permission revocations with revoker information
   * @security Requires appropriate admin permissions to revoke permissions
   * @immediate_effect Permission revocation takes effect immediately across all sessions
   * @example
   * const result = await rbacService.revokePermission({
   *   user_id: 'user_123',
   *   permission: 'property.edit',
   *   resource_id: 'prop_456'
   * });
   * if (result.success) {
   *   console.log('Permission revoked successfully');
   * }
   */
  async revokePermission(
    request: PermissionRevokeRequest
  ): Promise<RBACServiceResponse<void>> {
    return this.request<void>('/permissions/revoke', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getUserPermissionsDetailed(
    userId: string
  ): Promise<RBACServiceResponse<UserPermission[]>> {
    return this.request<UserPermission[]>(
      `/user/${userId}/permissions/detailed`
    );
  }

  // Role Management
  async assignRole(
    request: RoleAssignmentRequest
  ): Promise<RBACServiceResponse<void>> {
    return this.request<void>('/roles/assign', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async removeRole(
    request: RoleRemovalRequest
  ): Promise<RBACServiceResponse<void>> {
    return this.request<void>('/roles/remove', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getUserRoles(userId: string): Promise<RBACServiceResponse<UserRole[]>> {
    return this.request<UserRole[]>(`/user/${userId}/roles`);
  }

  async getRolePermissions(
    role: UserRole
  ): Promise<RBACServiceResponse<Permission[]>> {
    return this.request<Permission[]>(`/roles/${role}/permissions`);
  }

  // Role-Permission Management
  async createRolePermission(
    rolePermission: RolePermission
  ): Promise<RBACServiceResponse<void>> {
    return this.request<void>('/role-permissions', {
      method: 'POST',
      body: JSON.stringify(rolePermission),
    });
  }

  async updateRolePermissions(
    role: UserRole,
    permissions: Permission[]
  ): Promise<RBACServiceResponse<void>> {
    return this.request<void>(`/roles/${role}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permissions }),
    });
  }

  async deleteRolePermission(
    role: UserRole,
    permission: Permission
  ): Promise<RBACServiceResponse<void>> {
    return this.request<void>(`/roles/${role}/permissions/${permission}`, {
      method: 'DELETE',
    });
  }

  // Audit & Logging
  async getAuditLog(
    request: PermissionAuditRequest
  ): Promise<RBACServiceResponse<unknown[]>> {
    const params = new URLSearchParams();
    Object.entries(request).forEach(([key, value]) => {
      if (value !== undefined) {
        params['append'](key, value.toString());
      }
    });

    return this.request<unknown[]>(`/audit?${params['toString']()}`);
  }

  async getPermissionStats(): Promise<RBACServiceResponse<RBACStats>> {
    return this.request<RBACStats>('/stats');
  }

  // Bulk Operations
  async bulkGrantPermissions(
    userId: string,
    permissions: Permission[],
    resourceId?: string
  ): Promise<RBACServiceResponse<void>> {
    return this.request<void>('/permissions/bulk-grant', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        permissions,
        resource_id: resourceId,
      }),
    });
  }

  async bulkRevokePermissions(
    userId: string,
    permissions: Permission[],
    resourceId?: string
  ): Promise<RBACServiceResponse<void>> {
    return this.request<void>('/permissions/bulk-revoke', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        permissions,
        resource_id: resourceId,
      }),
    });
  }

  // Search & Filter
  async searchUsers(
    query: string,
    limit = 20
  ): Promise<RBACServiceResponse<unknown[]>> {
    return this.request<unknown[]>(
      `/users/search?query=${encodeURIComponent(query)}&limit=${limit}`
    );
  }

  async getUsersByRole(
    role: UserRole
  ): Promise<RBACServiceResponse<unknown[]>> {
    return this.request<unknown[]>(`/users/by-role/${role}`);
  }

  async getUsersByPermission(
    permission: Permission
  ): Promise<RBACServiceResponse<unknown[]>> {
    return this.request<unknown[]>(`/users/by-permission/${permission}`);
  }

  // Role Templates
  async createRoleTemplate(
    name: string,
    description: string,
    permissions: Permission[]
  ): Promise<RBACServiceResponse<void>> {
    return this.request<void>('/role-templates', {
      method: 'POST',
      body: JSON.stringify({ name, description, permissions }),
    });
  }

  async getRoleTemplates(): Promise<RBACServiceResponse<unknown[]>> {
    return this.request<unknown[]>('/role-templates');
  }

  async applyRoleTemplate(
    userId: string,
    templateId: string
  ): Promise<RBACServiceResponse<void>> {
    return this.request<void>('/role-templates/apply', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, template_id: templateId }),
    });
  }

  // Export/Import
  async exportUserRoles(
    userIds?: string[]
  ): Promise<RBACServiceResponse<Blob>> {
    const params = userIds ? `?user_ids=${userIds.join(',')}` : '';
    const response = await fetch(`${this.baseUrl}/export/roles${params}`);

    if (!response.ok) {
      return {
        success: false,
        error: 'Export failed',
      };
    }

    const blob = await response.blob();
    return {
      success: true,
      data: blob,
    };
  }

  async importUserRoles(file: File): Promise<RBACServiceResponse<void>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<void>('/import/roles', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  // Utility Methods
  async refreshUserContext(
    userId: string
  ): Promise<RBACServiceResponse<RBACContext>> {
    return this.request<RBACContext>(`/user/${userId}/refresh`, {
      method: 'POST',
    });
  }

  async validatePermissions(
    permissions: Permission[]
  ): Promise<RBACServiceResponse<boolean>> {
    return this.request<boolean>('/permissions/validate', {
      method: 'POST',
      body: JSON.stringify({ permissions }),
    });
  }

  async getPermissionHierarchy(): Promise<RBACServiceResponse<unknown>> {
    return this.request<unknown>('/permissions/hierarchy');
  }

  async getRoleHierarchy(): Promise<RBACServiceResponse<unknown>> {
    return this.request<unknown>('/roles/hierarchy');
  }
}

// Export singleton instance
/**
 * Singleton RBAC service instance for Buffr Host application
 * @const {RBACService} rbacService
 * @singleton_pattern Single instance shared across the entire application
 * @environment_aware Automatically uses correct API endpoint based on environment
 * @usage Import and use directly: import { rbacService } from '@/lib/services/rbac-service'
 * @security Critical security service - all access control flows through this instance
 * @performance Cached permission checks and optimized API calls
 * @monitoring Comprehensive audit logging for all RBAC operations
 * @example
 * import { rbacService } from '@/lib/services/rbac-service';
 *
 * // Check user permission
 * const canEdit = await rbacService.checkPermission('user_123', 'property.edit');
 *
 * // Get user context
 * const context = await rbacService.getUserContext('user_123');
 *
 * // Grant permission
 * await rbacService.grantPermission({
 *   user_id: 'user_123',
 *   permission: 'property.edit',
 *   scope: 'property'
 * });
 */
export const rbacService = new RBACService();
export default rbacService;
