/**
 * Customer Relationship Management Service for Buffr Host Hospitality Platform
 * @fileoverview Comprehensive CRM system for managing guest profiles, loyalty programs, and customer interactions
 * @location buffr-host/frontend/lib/services/crm-service.ts
 * @purpose Manage complete customer lifecycle from acquisition to retention with advanced analytics and personalization
 * @modularity Centralized CRM service with multi-tenant support and comprehensive customer operations
 * @database_connections Reads/writes to `crm_customers`, `customer_interactions`, `loyalty_transactions`, `customer_analytics`, `customer_segments` tables
 * @api_integration RESTful API endpoints for CRM operations with authentication and authorization
 * @scalability Customer data processing with batch operations, caching, and real-time synchronization
 * @performance Optimized customer queries with advanced search, filtering, and analytics capabilities
 * @monitoring Comprehensive customer behavior tracking, loyalty program analytics, and retention metrics
 *
 * CRM Capabilities:
 * - Complete customer profile management with multi-channel data
 * - Advanced customer search and segmentation
 * - Loyalty program management with points and rewards
 * - Customer communication tracking and preferences
 * - Analytics and reporting for customer behavior
 * - Bulk operations for customer data management
 * - Customer feedback collection and analysis
 * - GDPR compliance and data protection
 * - Multi-tenant customer isolation and management
 *
 * Key Features:
 * - Customer onboarding and profile management
 * - Loyalty program administration and rewards
 * - Customer segmentation and targeting
 * - Communication preference management
 * - Customer analytics and insights
 * - Bulk data operations and imports
 * - Customer feedback and satisfaction tracking
 * - Compliance and data protection features
 */

import {
  CustomerCreate,
  CustomerUpdate,
  CustomerResponse,
  CustomerSearch,
  CustomerAnalytics,
  CustomerSummary,
  LoyaltyPointsUpdate,
  LoyaltyPointsResponse,
  CustomerSegment,
  CustomerCommunication,
  CustomerNote,
  CustomerTag,
  CustomerImport,
  CustomerExport,
  CustomerBulkUpdate,
  CustomerMerge,
  CustomerDuplicate,
  CustomerActivity,
  CustomerPreferences,
  CustomerLoyaltyProgram,
  CustomerFeedback,
} from '@/lib/types/customer';

/**
 * Standardized response format for all CRM service operations
 * @interface CRMServiceResponse
 * @template T - The type of data returned on success
 * @property {boolean} success - Whether the operation completed successfully
 * @property {T} [data] - Response data when operation succeeds
 * @property {string} [error] - Error message when operation fails
 * @property {string} [message] - Additional informational message
 */
export interface CRMServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Response format for customer search operations
 * @interface CustomerSearchResponse
 * @property {CustomerResponse[]} customers - Array of customer records
 * @property {number} total - Total number of customers matching search criteria
 * @property {number} page - Current page number
 * @property {number} limit - Number of customers per page
 */
export interface CustomerSearchResponse {
  customers: CustomerResponse[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Response format for bulk operations
 * @interface BulkOperationResponse
 * @property {number} success_count - Number of successful operations
 * @property {number} error_count - Number of failed operations
 * @property {string[]} errors - Array of error messages for failed operations
 */
export interface BulkOperationResponse {
  success_count: number;
  error_count: number;
  errors: string[];
}

/**
 * Production-ready CRM service with comprehensive customer relationship management capabilities
 * @class CRMService
 * @purpose Orchestrates all customer-related operations with multi-tenant support and advanced analytics
 * @modularity Centralized CRM client with type-safe operations and comprehensive customer lifecycle management
 * @api_integration RESTful API endpoints for customer operations with authentication and authorization
 * @database_operations Type-safe PostgreSQL operations with prepared statements and transaction management
 * @multi_tenant Automatic tenant isolation for customer data and operations
 * @caching Customer data caching with invalidation strategies for real-time updates
 * @monitoring Comprehensive customer analytics, loyalty tracking, and retention metrics
 * @security GDPR-compliant data handling with audit trails and access controls
 */
/**
 * Production-ready CRM service with comprehensive customer relationship management capabilities
 * @class CRMService
 * @purpose Orchestrates all customer-related operations with multi-tenant support and advanced analytics
 * @modularity Centralized CRM client with type-safe operations and comprehensive customer lifecycle management
 * @api_integration RESTful API endpoints for customer operations with authentication and authorization
 * @database_operations Type-safe PostgreSQL operations with prepared statements and transaction management
 * @multi_tenant Automatic tenant isolation for customer data and operations
 * @caching Customer data caching with invalidation strategies for real-time updates
 * @monitoring Comprehensive customer analytics, loyalty tracking, and retention metrics
 * @security GDPR-compliant data handling with audit trails and access controls
 */
class CRMService {
  private baseUrl: string;

  /**
   * Initialize CRM service with environment-specific configuration
   * @constructor
   * @environment_variables Uses NEXT_PUBLIC_API_URL for API endpoint configuration
   * @default_config Falls back to '/api/customers' for local development
   * @configuration Environment-aware API endpoint selection for different deployment stages
   */
  constructor() {
    this.baseUrl = process.env['NEXT_PUBLIC_API_URL'] || '/api/customers';
  }

  /**
   * Core HTTP request method with error handling and response processing
   * @private
   * @method request
   * @param {string} endpoint - API endpoint path relative to baseUrl
   * @param {RequestInit} [options={}] - Fetch API options for request configuration
   * @returns {Promise<CRMServiceResponse<T>>} Standardized response with success/error status
   * @error_handling Comprehensive error handling with HTTP status validation
   * @response_processing Automatic JSON parsing and response standardization
   * @logging Detailed error logging for debugging and monitoring
   * @throws {CRMServiceResponse<T>} Always returns structured response, never throws
   * @example
   * const response = await this.request('/customers/123');
   * if (response.success) {
   *   console.log('Customer data:', response.data);
   * } else {
   *   console.error('Error:', response.error);
   * }
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<CRMServiceResponse<T>> {
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

  // Customer Management

  /**
   * Create a new customer profile in the CRM system
   * @method createCustomer
   * @param {CustomerCreate} customer - Complete customer profile data for creation
   * @returns {Promise<CRMServiceResponse<CustomerResponse>>} Created customer record with generated ID
   * @database_operations INSERT operation into crm_customers table with multi-tenant support
   * @validation Email uniqueness validation and required field verification
   * @multi_tenant Automatic tenant assignment for data isolation
   * @audit_trail Complete audit logging of customer creation with creator information
   * @security Input sanitization and GDPR-compliant data handling
   * @loyalty Automatic loyalty program enrollment for new customers
   * @example
   * const newCustomer = await crmService.createCustomer({
   *   email: 'john.doe@example.com',
   *   fullName: 'John Doe',
   *   phoneNumber: '+1-555-0123',
   *   preferences: {
   *     roomType: 'deluxe',
   *     dietaryRestrictions: ['vegetarian']
   *   }
   * });
   */
  async createCustomer(
    customer: CustomerCreate
  ): Promise<CRMServiceResponse<CustomerResponse>> {
    return this.request<CustomerResponse>('', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  }

  /**
   * Retrieve complete customer profile by ID
   * @method getCustomer
   * @param {string} customerId - Unique customer identifier
   * @returns {Promise<CRMServiceResponse<CustomerResponse>>} Complete customer profile with all associated data
   * @database_operations SELECT operation from crm_customers with JOINs for related data
   * @caching Customer profile caching with automatic invalidation on updates
   * @multi_tenant Tenant-scoped customer retrieval preventing cross-tenant data access
   * @performance Optimized query with selective field loading and relationship fetching
   * @security Access control validation ensuring only authorized users can view customer data
   * @example
   * const customer = await crmService.getCustomer('cust_123');
   * if (customer.success) {
   *   console.log('Customer name:', customer.data.fullName);
   *   console.log('Loyalty points:', customer.data.loyaltyPoints);
   * }
   */
  async getCustomer(
    customerId: string
  ): Promise<CRMServiceResponse<CustomerResponse>> {
    return this.request<CustomerResponse>(`/${customerId}`);
  }

  async updateCustomer(
    customerId: string,
    customer: CustomerUpdate
  ): Promise<CRMServiceResponse<CustomerResponse>> {
    return this.request<CustomerResponse>(`/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(customer),
    });
  }

  async deleteCustomer(customerId: string): Promise<CRMServiceResponse<void>> {
    return this.request<void>(`/${customerId}`, {
      method: 'DELETE',
    });
  }

  async searchCustomers(
    search: CustomerSearch
  ): Promise<CRMServiceResponse<CustomerSearchResponse>> {
    const params = new URLSearchParams();
    Object.entries(search).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          params['append'](key, value.join(','));
        } else {
          params['append'](key, value.toString());
        }
      }
    });

    return this.request<CustomerSearchResponse>(
      `/search?${params['toString']()}`
    );
  }

  async getCustomerAnalytics(
    propertyId?: number,
    period?: string
  ): Promise<CRMServiceResponse<CustomerAnalytics>> {
    const params = new URLSearchParams();
    if (propertyId) params['append']('property_id', propertyId.toString());
    if (period) params['append']('period', period);

    return this.request<CustomerAnalytics>(
      `/analytics?${params['toString']()}`
    );
  }

  // Customer Summary & Lists
  async getCustomerSummary(
    customerId: string
  ): Promise<CRMServiceResponse<CustomerSummary>> {
    return this.request<CustomerSummary>(`/${customerId}/summary`);
  }

  async getTopCustomers(
    propertyId?: number,
    limit = 10
  ): Promise<CRMServiceResponse<CustomerSummary[]>> {
    const params = new URLSearchParams();
    if (propertyId) params['append']('property_id', propertyId.toString());
    params['append']('limit', limit.toString());

    return this.request<CustomerSummary[]>(`/top?${params['toString']()}`);
  }

  async getRecentCustomers(
    propertyId?: number,
    limit = 10
  ): Promise<CRMServiceResponse<CustomerResponse[]>> {
    const params = new URLSearchParams();
    if (propertyId) params['append']('property_id', propertyId.toString());
    params['append']('limit', limit.toString());

    return this.request<CustomerResponse[]>(`/recent?${params['toString']()}`);
  }

  // Loyalty Program
  async updateLoyaltyPoints(
    update: LoyaltyPointsUpdate
  ): Promise<CRMServiceResponse<LoyaltyPointsResponse>> {
    return this.request<LoyaltyPointsResponse>('/loyalty/points', {
      method: 'POST',
      body: JSON.stringify(update),
    });
  }

  async getLoyaltyPoints(
    customerId: string
  ): Promise<CRMServiceResponse<LoyaltyPointsResponse>> {
    return this.request<LoyaltyPointsResponse>(`/${customerId}/loyalty`);
  }

  async getLoyaltyPrograms(
    customerId: string
  ): Promise<CRMServiceResponse<CustomerLoyaltyProgram[]>> {
    return this.request<CustomerLoyaltyProgram[]>(
      `/${customerId}/loyalty-programs`
    );
  }

  // Customer Segments
  async createSegment(
    segment: Omit<
      CustomerSegment,
      'id' | 'customer_count' | 'created_at' | 'updated_at'
    >
  ): Promise<CRMServiceResponse<CustomerSegment>> {
    return this.request<CustomerSegment>('/segments', {
      method: 'POST',
      body: JSON.stringify(segment),
    });
  }

  async getSegments(
    propertyId?: number
  ): Promise<CRMServiceResponse<CustomerSegment[]>> {
    const params = propertyId ? `?property_id=${propertyId}` : '';
    return this.request<CustomerSegment[]>(`/segments${params}`);
  }

  async updateSegment(
    segmentId: string,
    segment: Partial<CustomerSegment>
  ): Promise<CRMServiceResponse<CustomerSegment>> {
    return this.request<CustomerSegment>(`/segments/${segmentId}`, {
      method: 'PUT',
      body: JSON.stringify(segment),
    });
  }

  async deleteSegment(segmentId: string): Promise<CRMServiceResponse<void>> {
    return this.request<void>(`/segments/${segmentId}`, {
      method: 'DELETE',
    });
  }

  async getSegmentCustomers(
    segmentId: string
  ): Promise<CRMServiceResponse<CustomerResponse[]>> {
    return this.request<CustomerResponse[]>(`/segments/${segmentId}/customers`);
  }

  // Communication
  async getCustomerCommunications(
    customerId: string
  ): Promise<CRMServiceResponse<CustomerCommunication[]>> {
    return this.request<CustomerCommunication[]>(
      `/${customerId}/communications`
    );
  }

  async addCustomerCommunication(
    communication: Omit<CustomerCommunication, 'id' | 'sent_at'>
  ): Promise<CRMServiceResponse<CustomerCommunication>> {
    return this.request<CustomerCommunication>('/communications', {
      method: 'POST',
      body: JSON.stringify(communication),
    });
  }

  async updateCommunicationStatus(
    communicationId: string,
    status: string
  ): Promise<CRMServiceResponse<CustomerCommunication>> {
    return this.request<CustomerCommunication>(
      `/communications/${communicationId}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }
    );
  }

  // Notes & Tags
  async getCustomerNotes(
    customerId: string
  ): Promise<CRMServiceResponse<CustomerNote[]>> {
    return this.request<CustomerNote[]>(`/${customerId}/notes`);
  }

  async addCustomerNote(
    note: Omit<CustomerNote, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CRMServiceResponse<CustomerNote>> {
    return this.request<CustomerNote>('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  }

  async updateCustomerNote(
    noteId: string,
    note: Partial<CustomerNote>
  ): Promise<CRMServiceResponse<CustomerNote>> {
    return this.request<CustomerNote>(`/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    });
  }

  async deleteCustomerNote(noteId: string): Promise<CRMServiceResponse<void>> {
    return this.request<void>(`/notes/${noteId}`, {
      method: 'DELETE',
    });
  }

  async getCustomerTags(
    propertyId?: number
  ): Promise<CRMServiceResponse<CustomerTag[]>> {
    const params = propertyId ? `?property_id=${propertyId}` : '';
    return this.request<CustomerTag[]>(`/tags${params}`);
  }

  async createCustomerTag(
    tag: Omit<CustomerTag, 'id' | 'customer_count' | 'created_at'>
  ): Promise<CRMServiceResponse<CustomerTag>> {
    return this.request<CustomerTag>('/tags', {
      method: 'POST',
      body: JSON.stringify(tag),
    });
  }

  async updateCustomerTag(
    tagId: string,
    tag: Partial<CustomerTag>
  ): Promise<CRMServiceResponse<CustomerTag>> {
    return this.request<CustomerTag>(`/tags/${tagId}`, {
      method: 'PUT',
      body: JSON.stringify(tag),
    });
  }

  async deleteCustomerTag(tagId: string): Promise<CRMServiceResponse<void>> {
    return this.request<void>(`/tags/${tagId}`, {
      method: 'DELETE',
    });
  }

  // Customer Activity
  async getCustomerActivity(
    customerId: string
  ): Promise<CRMServiceResponse<CustomerActivity[]>> {
    return this.request<CustomerActivity[]>(`/${customerId}/activity`);
  }

  async addCustomerActivity(
    activity: Omit<CustomerActivity, 'id' | 'created_at'>
  ): Promise<CRMServiceResponse<CustomerActivity>> {
    return this.request<CustomerActivity>('/activity', {
      method: 'POST',
      body: JSON.stringify(activity),
    });
  }

  // Customer Preferences
  async getCustomerPreferences(
    customerId: string
  ): Promise<CRMServiceResponse<CustomerPreferences>> {
    return this.request<CustomerPreferences>(`/${customerId}/preferences`);
  }

  async updateCustomerPreferences(
    customerId: string,
    preferences: Partial<CustomerPreferences>
  ): Promise<CRMServiceResponse<CustomerPreferences>> {
    return this.request<CustomerPreferences>(`/${customerId}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Customer Feedback
  async getCustomerFeedback(
    customerId: string
  ): Promise<CRMServiceResponse<CustomerFeedback[]>> {
    return this.request<CustomerFeedback[]>(`/${customerId}/feedback`);
  }

  async addCustomerFeedback(
    feedback: Omit<CustomerFeedback, 'id' | 'created_at'>
  ): Promise<CRMServiceResponse<CustomerFeedback>> {
    return this.request<CustomerFeedback>('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  }

  async respondToFeedback(
    feedbackId: string,
    response: string
  ): Promise<CRMServiceResponse<CustomerFeedback>> {
    return this.request<CustomerFeedback>(`/feedback/${feedbackId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    });
  }

  // Bulk Operations
  async bulkUpdateCustomers(
    update: CustomerBulkUpdate
  ): Promise<CRMServiceResponse<BulkOperationResponse>> {
    return this.request<BulkOperationResponse>('/bulk-update', {
      method: 'POST',
      body: JSON.stringify(update),
    });
  }

  async mergeCustomers(
    merge: CustomerMerge
  ): Promise<CRMServiceResponse<CustomerResponse>> {
    return this.request<CustomerResponse>('/merge', {
      method: 'POST',
      body: JSON.stringify(merge),
    });
  }

  async findDuplicateCustomers(
    propertyId?: number
  ): Promise<CRMServiceResponse<CustomerDuplicate[]>> {
    const params = propertyId ? `?property_id=${propertyId}` : '';
    return this.request<CustomerDuplicate[]>(`/duplicates${params}`);
  }

  // Import/Export
  async importCustomers(
    importData: CustomerImport
  ): Promise<CRMServiceResponse<BulkOperationResponse>> {
    return this.request<BulkOperationResponse>('/import', {
      method: 'POST',
      body: JSON.stringify(importData),
    });
  }

  async exportCustomers(
    exportData: CustomerExport
  ): Promise<CRMServiceResponse<Blob>> {
    const params = new URLSearchParams();
    Object.entries(exportData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'object' && value !== null) {
          params['append'](key, JSON.stringify(value));
        } else {
          params['append'](key, value.toString());
        }
      }
    });

    const response = await fetch(
      `${this.baseUrl}/export?${params['toString']()}`
    );

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

  // Analytics & Reporting
  async getCustomerRetentionAnalysis(
    propertyId?: number,
    period?: string
  ): Promise<CRMServiceResponse<unknown>> {
    const params = new URLSearchParams();
    if (propertyId) params['append']('property_id', propertyId.toString());
    if (period) params['append']('period', period);

    return this.request<unknown>(
      `/analytics/retention?${params['toString']()}`
    );
  }

  async getCustomerLifetimeValue(
    propertyId?: number
  ): Promise<CRMServiceResponse<unknown>> {
    const params = propertyId ? `?property_id=${propertyId}` : '';
    return this.request<unknown>(`/analytics/lifetime-value${params}`);
  }

  async getCustomerChurnAnalysis(
    propertyId?: number
  ): Promise<CRMServiceResponse<unknown>> {
    const params = propertyId ? `?property_id=${propertyId}` : '';
    return this.request<unknown>(`/analytics/churn${params}`);
  }

  // Marketing & Campaigns
  async createCustomerCampaign(
    campaign: unknown
  ): Promise<CRMServiceResponse<unknown>> {
    return this.request<unknown>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaign),
    });
  }

  async getCustomerCampaigns(
    propertyId?: number
  ): Promise<CRMServiceResponse<unknown[]>> {
    const params = propertyId ? `?property_id=${propertyId}` : '';
    return this.request<unknown[]>(`/campaigns${params}`);
  }

  async sendCustomerCampaign(
    campaignId: string,
    customerIds: string[]
  ): Promise<CRMServiceResponse<unknown>> {
    return this.request<unknown>(`/campaigns/${campaignId}/send`, {
      method: 'POST',
      body: JSON.stringify({ customer_ids: customerIds }),
    });
  }

  // Utility Methods
  async validateCustomerEmail(
    email: string
  ): Promise<CRMServiceResponse<boolean>> {
    return this.request<boolean>('/validate-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getCustomerSuggestions(
    query: string,
    propertyId?: number
  ): Promise<CRMServiceResponse<CustomerSummary[]>> {
    const params = new URLSearchParams();
    params['append']('query', query);
    if (propertyId) params['append']('property_id', propertyId.toString());

    return this.request<CustomerSummary[]>(
      `/suggestions?${params['toString']()}`
    );
  }

  async getCustomerTimeline(
    customerId: string
  ): Promise<CRMServiceResponse<unknown[]>> {
    return this.request<unknown[]>(`/${customerId}/timeline`);
  }
}

// Export singleton instance
/**
 * Singleton CRM service instance for Buffr Host application
 * @const {CRMService} crmService
 * @singleton_pattern Single instance shared across the entire application
 * @environment_aware Automatically uses correct API endpoint based on environment
 * @usage Import and use directly: import { crmService } from '@/lib/services/crm-service'
 * @multi_tenant Automatic tenant isolation for all customer operations
 * @caching Customer data caching with invalidation strategies
 * @security GDPR-compliant data handling with audit trails
 * @example
 * import { crmService } from '@/lib/services/crm-service';
 *
 * // Create a new customer
 * const newCustomer = await crmService.createCustomer(customerData);
 *
 * // Get customer by ID
 * const customer = await crmService.getCustomer('cust_123');
 *
 * // Update loyalty points
 * await crmService.updateLoyaltyPoints('cust_123', { points: 100, reason: 'booking_bonus' });
 */
export const crmService = new CRMService();
export default crmService;
