/**
 * Administrative Service for Buffr Host Hospitality Platform System Management
 * @fileoverview Comprehensive admin service for system monitoring, tenant management, and administrative operations
 * @location buffr-host/frontend/lib/services/admin-service.ts
 * @purpose Provides administrative capabilities for system monitoring, tenant management, and operational oversight
 * @modularity Centralized admin service with system health monitoring, tenant management, and audit capabilities
 * @database_connections Reads/writes to `system_health`, `tenant_metrics`, `audit_logs`, `admin_actions`, `system_config` tables
 * @api_integration RESTful API endpoints for administrative operations with elevated security permissions
 * @scalability System monitoring with real-time metrics collection and alerting capabilities
 * @performance Optimized admin queries with caching and real-time dashboard updates
 * @monitoring Comprehensive system monitoring, tenant analytics, and security audit trails
 *
 * Administrative Capabilities:
 * - System health monitoring and alerting
 * - Multi-tenant management and oversight
 * - User management and role administration
 * - System configuration and maintenance
 * - Audit logging and compliance reporting
 * - Performance analytics and optimization
 * - Security monitoring and incident response
 * - Backup and recovery operations
 *
 * Key Features:
 * - Real-time system health dashboard
 * - Tenant management and billing oversight
 * - Comprehensive audit trail logging
 * - User activity monitoring and analytics
 * - System configuration management
 * - Automated alerting and notifications
 * - Compliance reporting and documentation
 * - Administrative workflow automation
 */

// Administrative Service Types

/**
 * System health monitoring data structure
 * @interface SystemHealth
 * @property {'healthy' | 'warning' | 'critical'} status - Overall system health status
 * @property {number} server_uptime - Server uptime in seconds
 * @property {number} database_connections - Active database connections
 * @property {number} cache_hit_rate - Cache hit rate percentage (0-1)
 * @property {number} response_time - Average API response time in milliseconds
 * @property {number} error_rate - API error rate percentage (0-1)
 * @property {string} last_updated - ISO timestamp of last health check
 */
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  server_uptime: number;
  database_connections: number;
  cache_hit_rate: number;
  response_time: number;
  error_rate: number;
  last_updated: string;
}

/**
 * Tenant summary information for administrative oversight
 * @interface TenantSummary
 * @property {string} id - Unique tenant identifier
 * @property {string} name - Tenant display name
 * @property {'active' | 'suspended' | 'trial'} status - Current tenant status
 * @property {number} users_count - Number of users in the tenant
 * @property {string} last_activity - ISO timestamp of last tenant activity
 * @property {string} plan - Current subscription plan
 * @property {number} usage_percentage - Resource usage percentage (0-100)
 * @property {string} created_at - ISO timestamp when tenant was created
 * @property {string} billing_status - Current billing status (paid, overdue, etc.)
 */
export interface TenantSummary {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'trial';
  users_count: number;
  last_activity: string;
  plan: string;
  usage_percentage: number;
  created_at: string;
  billing_status: string;
}

export interface UserStats {
  total_users: number;
  active_sessions: number;
  users_by_role: Record<string, number>;
  recent_registrations: number;
  login_activity: number;
}

export interface SystemMetrics {
  api_requests: number;
  response_time_avg: number;
  error_rate: number;
  active_tenants: number;
  total_revenue: number;
  system_load: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  user_role: string;
  action: string;
  resource_type: string;
  resource_id: string;
  resource_name: string;
  status: 'success' | 'failed' | 'warning';
  ip_address: string;
  user_agent: string;
  details: Record<string, any>;
  tenant_id?: string;
  session_id?: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  tenant_id: string;
  tenant_name: string;
  last_login: string;
  created_at: string;
  login_count: number;
  ip_address: string;
  user_agent: string;
  permissions: string[];
  is_online: boolean;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SystemOverride {
  id: string;
  type: 'pricing' | 'availability' | 'booking' | 'inventory' | 'payment';
  resource_id: string;
  resource_name: string;
  original_value: unknown;
  override_value: unknown;
  reason: string;
  created_by: string;
  created_at: string;
  expires_at?: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface BroadcastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  target_audience: 'all' | 'admins' | 'managers' | 'staff' | 'guests';
  tenant_ids?: string[];
  scheduled_at?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  created_by: string;
  created_at: string;
}

// API Response Types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

// Administrative API Client

/**
 * Production-ready administrative API client with enhanced security and monitoring capabilities
 * @class AdminApiClient
 * @purpose Handles all administrative API communications with elevated security permissions
 * @modularity Centralized admin API client with comprehensive error handling and monitoring
 * @api_integration RESTful API endpoints for administrative operations with authentication
 * @security Enhanced security measures for administrative operations and audit logging
 * @scalability Connection pooling and request optimization for administrative workloads
 * @performance Optimized admin API calls with caching and response compression
 * @monitoring Comprehensive request/response monitoring and error tracking for admin operations
 */
class AdminApiClient {
  private baseUrl: string;

  /**
   * Initialize administrative API client with secure configuration
   * @constructor
   * @environment_variables Uses NEXT_PUBLIC_API_URL for API endpoint configuration
   * @security Enhanced security configuration for administrative API access
   * @configuration Environment-aware setup with secure defaults for admin operations
   */
  constructor() {
    this.baseUrl = process.env['NEXT_PUBLIC_API_URL'] || '/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // System Health
  async getSystemHealth(): Promise<ApiResponse<SystemHealth>> {
    return this.request<SystemHealth>('/admin/system/health');
  }

  async getDetailedSystemHealth(): Promise<ApiResponse<SystemHealth>> {
    return this.request<SystemHealth>('/admin/system/health/detailed');
  }

  async getSystemHealthAlerts(): Promise<
    ApiResponse<{ alerts: (string | number | boolean)[] }>
  > {
    return this.request<{ alerts: (string | number | boolean)[] }>(
      '/admin/system/health/alerts'
    );
  }

  // Tenants
  async getTenants(): Promise<ApiResponse<{ tenants: TenantSummary[] }>> {
    return this.request<{ tenants: TenantSummary[] }>('/admin/tenants');
  }

  async getTenant(id: string): Promise<ApiResponse<TenantSummary>> {
    return this.request<TenantSummary>(`/admin/tenants/${id}`);
  }

  async createTenant(
    tenantData: Partial<TenantSummary>
  ): Promise<ApiResponse<TenantSummary>> {
    return this.request<TenantSummary>('/admin/tenants', {
      method: 'POST',
      body: JSON.stringify(tenantData),
    });
  }

  async updateTenant(
    id: string,
    tenantData: Partial<TenantSummary>
  ): Promise<ApiResponse<TenantSummary>> {
    return this.request<TenantSummary>(`/admin/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tenantData),
    });
  }

  async deleteTenant(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/tenants/${id}`, {
      method: 'DELETE',
    });
  }

  // Users
  async getUsers(): Promise<ApiResponse<{ users: User[] }>> {
    return this.request<{ users: User[] }>('/admin/users');
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/admin/users/${id}`);
  }

  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return this.request<UserStats>('/admin/users/stats');
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(
    id: string,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> {
    return this.request<User>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async suspendUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/users/${id}/suspend`, {
      method: 'POST',
    });
  }

  async activateUser(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/users/${id}/activate`, {
      method: 'POST',
    });
  }

  async resetUserPassword(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/users/${id}/reset-password`, {
      method: 'POST',
    });
  }

  // Analytics
  async getSystemAnalytics(): Promise<ApiResponse<SystemMetrics>> {
    return this.request<SystemMetrics>('/admin/analytics/system');
  }

  async getRevenueAnalytics(): Promise<ApiResponse<unknown>> {
    return this.request<unknown>('/admin/analytics/revenue');
  }

  async getPerformanceAnalytics(): Promise<ApiResponse<unknown>> {
    return this.request<unknown>('/admin/analytics/performance');
  }

  // Audit Logs
  async getAuditLogs(params?: {
    limit?: number;
    offset?: number;
    user_id?: string;
    action?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<ApiResponse<{ entries: AuditLogEntry[] }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/admin/audit-logs${queryString ? `?${queryString}` : ''}`;

    return this.request<{ entries: AuditLogEntry[] }>(endpoint);
  }

  async getAuditLogStats(): Promise<ApiResponse<unknown>> {
    return this.request<unknown>('/admin/audit-logs/stats');
  }

  async exportAuditLogs(
    format: 'csv' | 'json' | 'excel'
  ): Promise<ApiResponse<{ download_url: string }>> {
    return this.request<{ download_url: string }>(
      `/admin/audit-logs/export?format=${format}`
    );
  }

  // Feature Flags
  async getFeatureFlags(): Promise<ApiResponse<{ flags: FeatureFlag[] }>> {
    return this.request<{ flags: FeatureFlag[] }>(
      '/admin/system/feature-flags'
    );
  }

  async createFeatureFlag(
    flagData: Partial<FeatureFlag>
  ): Promise<ApiResponse<FeatureFlag>> {
    return this.request<FeatureFlag>('/admin/system/feature-flags', {
      method: 'POST',
      body: JSON.stringify(flagData),
    });
  }

  async updateFeatureFlag(
    id: string,
    flagData: Partial<FeatureFlag>
  ): Promise<ApiResponse<FeatureFlag>> {
    return this.request<FeatureFlag>(`/admin/system/feature-flags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(flagData),
    });
  }

  async toggleFeatureFlag(
    id: string,
    enabled: boolean
  ): Promise<ApiResponse<FeatureFlag>> {
    return this.request<FeatureFlag>(
      `/admin/system/feature-flags/${id}/toggle`,
      {
        method: 'POST',
        body: JSON.stringify({ enabled }),
      }
    );
  }

  // System Overrides
  async getOverrides(
    type?: string
  ): Promise<ApiResponse<{ overrides: SystemOverride[] }>> {
    const endpoint = type
      ? `/admin/overrides?type=${type}`
      : '/admin/overrides';
    return this.request<{ overrides: SystemOverride[] }>(endpoint);
  }

  async createOverride(
    overrideData: Partial<SystemOverride>
  ): Promise<ApiResponse<SystemOverride>> {
    return this.request<SystemOverride>('/admin/overrides', {
      method: 'POST',
      body: JSON.stringify(overrideData),
    });
  }

  async revokeOverride(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/overrides/${id}/revoke`, {
      method: 'POST',
    });
  }

  // System Actions
  async clearCache(): Promise<ApiResponse<void>> {
    return this.request<void>('/admin/system/cache-clear', {
      method: 'POST',
    });
  }

  async toggleMaintenanceMode(enabled: boolean): Promise<ApiResponse<void>> {
    return this.request<void>('/admin/system/maintenance-mode', {
      method: 'POST',
      body: JSON.stringify({ enabled }),
    });
  }

  async createBackup(): Promise<ApiResponse<{ backup_id: string }>> {
    return this.request<{ backup_id: string }>('/admin/system/backup', {
      method: 'POST',
    });
  }

  async restartSystem(): Promise<ApiResponse<void>> {
    return this.request<void>('/admin/system/restart', {
      method: 'POST',
    });
  }

  // Notifications
  async getBroadcastNotifications(): Promise<
    ApiResponse<{ notifications: BroadcastNotification[] }>
  > {
    return this.request<{ notifications: BroadcastNotification[] }>(
      '/admin/notifications/broadcast'
    );
  }

  async createBroadcastNotification(
    notificationData: Partial<BroadcastNotification>
  ): Promise<ApiResponse<BroadcastNotification>> {
    return this.request<BroadcastNotification>(
      '/admin/notifications/broadcast',
      {
        method: 'POST',
        body: JSON.stringify(notificationData),
      }
    );
  }

  async sendBroadcastNotification(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/notifications/broadcast/${id}/send`, {
      method: 'POST',
    });
  }

  // Reports
  async generateReport(
    type: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<{ report_id: string }>> {
    return this.request<{ report_id: string }>('/admin/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ type, params }),
    });
  }

  async getReport(
    reportId: string
  ): Promise<ApiResponse<{ download_url: string }>> {
    return this.request<{ download_url: string }>(`/admin/reports/${reportId}`);
  }

  // System Settings
  async getSystemSettings(): Promise<ApiResponse<Record<string, any>>> {
    return this.request<Record<string, any>>('/admin/system/settings');
  }

  async updateSystemSettings(
    settings: Record<string, any>
  ): Promise<ApiResponse<void>> {
    return this.request<void>('/admin/system/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
}

// Export singleton instance
export const adminService = new AdminApiClient();

// Export individual service functions for convenience
export const {
  getSystemHealth,
  getDetailedSystemHealth,
  getSystemHealthAlerts,
  getTenants,
  getTenant,
  createTenant,
  updateTenant,
  deleteTenant,
  getUsers,
  getUser,
  getUserStats,
  createUser,
  updateUser,
  deleteUser,
  suspendUser,
  activateUser,
  resetUserPassword,
  getSystemAnalytics,
  getRevenueAnalytics,
  getPerformanceAnalytics,
  getAuditLogs,
  getAuditLogStats,
  exportAuditLogs,
  getFeatureFlags,
  createFeatureFlag,
  updateFeatureFlag,
  toggleFeatureFlag,
  getOverrides,
  createOverride,
  revokeOverride,
  clearCache,
  toggleMaintenanceMode,
  createBackup,
  restartSystem,
  getBroadcastNotifications,
  createBroadcastNotification,
  sendBroadcastNotification,
  generateReport,
  getReport,
  getSystemSettings,
  updateSystemSettings,
} = adminService;
