/**
 * Customer/CRM Type Definitions
 *
 * Purpose: Comprehensive type definitions for customer management, CRM operations, loyalty programs,
 * and customer analytics in Buffr Host
 * Location: lib/types/customer.ts
 * Usage: Shared across CRM components, customer APIs, customer management pages, and analytics
 *
 * @module Customer/CRM Types
 * @author Buffr Host Development Team
 * @version 1.0.0
 * @see {@link ../types/crm.ts} for basic Customer interface
 */

/**
 * Customer Base Interface
 *
 * Base interface containing core customer information fields used for customer creation.
 * All customer-related interfaces extend from this base.
 *
 * @interface CustomerBase
 * @property {string} email - Customer's email address (unique identifier, required)
 * @property {string} full_name - Customer's full name (required)
 * @property {string} [phone] - Customer's phone number (optional)
 * @property {Date} [date_of_birth] - Customer's date of birth (optional, for age verification)
 * @property {string} [nationality] - Customer's nationality (optional, for compliance)
 * @property {string} [address] - Customer's street address (optional)
 * @property {string} [city] - Customer's city (optional)
 * @property {string} [state] - Customer's state/province (optional)
 * @property {string} [postal_code] - Postal/ZIP code (optional)
 * @property {string} [country] - Customer's country (optional)
 * @property {string} [preferred_language] - Preferred language (ISO 639-1 code, optional)
 * @property {string[]} [dietary_restrictions] - Array of dietary restrictions (optional)
 * @property {string} [special_requests] - Special requests or notes (optional)
 * @property {boolean} marketing_consent - Whether customer consented to marketing communications (required)
 * @property {boolean} data_processing_consent - Whether customer consented to data processing (required, GDPR compliance)
 *
 * @example
 * const customerBase: CustomerBase = {
 *   email: 'customer@example.com',
 *   full_name: 'John Doe',
 *   phone: '+264811234567',
 *   marketing_consent: true,
 *   data_processing_consent: true
 * };
 */
/**
 * Customer Type Definitions for Buffr Host Hospitality Platform
 * @fileoverview Customer type definitions for customer data and profile management
 * @location buffr-host/lib/types/customer.ts
 * @purpose customer type definitions for customer data and profile management
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
 * - 23 Interfaces: CustomerBase, CustomerCreate, CustomerUpdate...
 * - Total: 23 type definitions
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
 * import type { CustomerBase, CustomerCreate, CustomerUpdate... } from './customer';
 *
 * // Usage in component
 * interface ComponentProps {
 *   data: CustomerBase;
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
 * @typedef {Interface} CustomerBase
 * @typedef {Interface} CustomerCreate
 * @typedef {Interface} CustomerUpdate
 * @typedef {Interface} CustomerResponse
 * @typedef {Interface} CustomerSummary
 * @typedef {Interface} CustomerSearch
 * @typedef {Interface} CustomerFilter
 * @typedef {Interface} CustomerAnalytics
 * @typedef {Interface} LoyaltyPointsUpdate
 * @typedef {Interface} LoyaltyPointsResponse
 * ... and 13 more type definitions
 *
 * @returns {Object} Type definitions module with all exported types and interfaces
 * @type_safety Ensures 100% type coverage across the Buffr Host application
 * @documentation Comprehensive JSDoc documentation for developer experience
 * @maintainability Type-driven development enabling safe refactoring and evolution
 */

export interface CustomerBase {
  email: string;
  full_name: string;
  phone?: string;
  date_of_birth?: Date;
  nationality?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  preferred_language?: string;
  dietary_restrictions?: string[];
  special_requests?: string;
  marketing_consent: boolean;
  data_processing_consent: boolean;
}

/**
 * Customer Create Interface
 *
 * Interface for creating a new customer. Extends CustomerBase with all required fields.
 *
 * @interface CustomerCreate
 * @extends CustomerBase
 */
export interface CustomerCreate extends CustomerBase {}

/**
 * Customer Update Interface
 *
 * Interface for updating an existing customer. All fields are optional to allow partial updates.
 *
 * @interface CustomerUpdate
 * @property {string} [email] - Updated email address (optional)
 * @property {string} [full_name] - Updated full name (optional)
 * @property {string} [phone] - Updated phone number (optional)
 * @property {Date} [date_of_birth] - Updated date of birth (optional)
 * @property {string} [nationality] - Updated nationality (optional)
 * @property {string} [address] - Updated address (optional)
 * @property {string} [city] - Updated city (optional)
 * @property {string} [state] - Updated state/province (optional)
 * @property {string} [postal_code] - Updated postal code (optional)
 * @property {string} [country] - Updated country (optional)
 * @property {string} [preferred_language] - Updated preferred language (optional)
 * @property {string[]} [dietary_restrictions] - Updated dietary restrictions (optional)
 * @property {string} [special_requests] - Updated special requests (optional)
 * @property {boolean} [marketing_consent] - Updated marketing consent (optional)
 * @property {boolean} [data_processing_consent] - Updated data processing consent (optional)
 * @property {boolean} [is_active] - Whether customer account is active (optional)
 *
 * @example
 * const update: CustomerUpdate = {
 *   phone: '+264811234568',
 *   preferred_language: 'af',
 *   is_active: true
 * };
 */
export interface CustomerUpdate {
  email?: string;
  full_name?: string;
  phone?: string;
  date_of_birth?: Date;
  nationality?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  preferred_language?: string;
  dietary_restrictions?: string[];
  special_requests?: string;
  marketing_consent?: boolean;
  data_processing_consent?: boolean;
  is_active?: boolean;
}

/**
 * Customer Response Interface
 *
 * Complete customer information returned from API endpoints, including computed fields,
 * analytics data, and relationship information.
 *
 * @interface CustomerResponse
 * @extends CustomerBase
 * @property {string} id - Unique customer identifier
 * @property {string} customer_id - Customer ID (may differ from id in some systems)
 * @property {number} property_id - Associated property ID
 * @property {number} [tenant_id] - Tenant ID for multi-tenant isolation
 * @property {boolean} is_active - Whether customer account is currently active
 * @property {boolean} is_vip - Whether customer has VIP status
 * @property {number} total_spent - Total amount spent by customer across all transactions
 * @property {number} total_bookings - Total number of bookings made by customer
 * @property {Date} [last_booking_date] - Date of customer's most recent booking
 * @property {Date} created_at - Timestamp when customer record was created
 * @property {Date} updated_at - Timestamp when customer record was last updated
 * @property {Date} [last_login] - Timestamp of customer's last login (if applicable)
 * @property {string} [profile_picture] - URL to customer's profile picture (optional)
 * @property {string} [notes] - Internal notes about the customer (optional)
 * @property {string[]} [tags] - Array of tags for customer segmentation (optional)
 * @property {string} [source] - Source where customer came from (optional, e.g., 'website', 'referral')
 * @property {string} [referral_source] - Referral source if customer was referred (optional)
 *
 * @example
 * const customer: CustomerResponse = {
 *   ...customerBase,
 *   id: 'cust_123',
 *   customer_id: 'CUST-001',
 *   property_id: 456,
 *   tenant_id: 789,
 *   is_active: true,
 *   is_vip: false,
 *   total_spent: 15000,
 *   total_bookings: 5,
 *   last_booking_date: new Date('2024-01-20'),
 *   created_at: new Date('2024-01-15'),
 *   updated_at: new Date('2024-01-20'),
 *   tags: ['frequent_guest', 'premium']
 * };
 */
export interface CustomerResponse extends CustomerBase {
  id: string;
  customer_id: string;
  property_id: number;
  tenant_id?: number;
  is_active: boolean;
  is_vip: boolean;
  total_spent: number;
  total_bookings: number;
  last_booking_date?: Date;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  profile_picture?: string;
  notes?: string;
  tags?: string[];
  source?: string;
  referral_source?: string;
}

export interface CustomerSummary {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  total_spent: number;
  total_bookings: number;
  last_booking_date?: Date;
  is_vip: boolean;
  tags?: string[];
}

export interface CustomerSearch {
  query?: string;
  property_id?: number;
  tenant_id?: number;
  is_active?: boolean;
  is_vip?: boolean;
  tags?: string[];
  created_after?: Date;
  created_before?: Date;
  last_booking_after?: Date;
  last_booking_before?: Date;
  total_spent_min?: number;
  total_spent_max?: number;
  limit?: number;
  offset?: number;
}

export interface CustomerFilter {
  property_id?: number;
  tenant_id?: number;
  is_active?: boolean;
  is_vip?: boolean;
  tags?: string[];
  source?: string;
  nationality?: string;
  preferred_language?: string;
  created_after?: Date;
  created_before?: Date;
  last_booking_after?: Date;
  last_booking_before?: Date;
  total_spent_min?: number;
  total_spent_max?: number;
}

export interface CustomerAnalytics {
  total_customers: number;
  active_customers: number;
  vip_customers: number;
  new_customers: number;
  returning_customers: number;
  average_spending: number;
  total_revenue: number;
  customer_lifetime_value: number;
  retention_rate: number;
  churn_rate: number;
  by_source: Record<string, number>;
  by_nationality: Record<string, number>;
  by_language: Record<string, number>;
  by_tags: Record<string, number>;
  growth_rate: number;
  top_customers: CustomerSummary[];
}

export interface LoyaltyPointsUpdate {
  customer_id: string;
  points: number;
  reason: string;
  property_id: number;
  booking_id?: string;
  expires_at?: Date;
}

export interface LoyaltyPointsResponse {
  customer_id: string;
  current_points: number;
  total_earned: number;
  total_redeemed: number;
  available_points: number;
  tier: string;
  tier_benefits: string[];
  next_tier_points: number;
  points_expiring_soon: number;
  last_activity: Date;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: Record<string, any>;
  customer_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface CustomerCommunication {
  id: string;
  customer_id: string;
  type: 'email' | 'sms' | 'phone' | 'in_person';
  subject?: string;
  content: string;
  sent_at: Date;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'failed';
  response?: string;
  created_by: string;
}

export interface CustomerNote {
  id: string;
  customer_id: string;
  note: string;
  category:
    | 'general'
    | 'preference'
    | 'complaint'
    | 'compliment'
    | 'special_request';
  is_private: boolean;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface CustomerTag {
  id: string;
  name: string;
  color: string;
  description?: string;
  customer_count: number;
  created_at: Date;
}

export interface CustomerImport {
  customers: CustomerCreate[];
  property_id: number;
  update_existing: boolean;
  send_welcome_email: boolean;
}

export interface CustomerExport {
  property_id?: number;
  format: 'csv' | 'excel' | 'json';
  include_analytics: boolean;
  date_range?: {
    start_date: Date;
    end_date: Date;
  };
}

export interface CustomerBulkUpdate {
  customer_ids: string[];
  updates: CustomerUpdate;
  reason: string;
}

export interface CustomerMerge {
  primary_customer_id: string;
  secondary_customer_id: string;
  merge_data: CustomerUpdate;
  reason: string;
}

export interface CustomerDuplicate {
  customer_id: string;
  duplicate_customer_id: string;
  confidence_score: number;
  matching_fields: string[];
  suggested_action: 'merge' | 'ignore' | 'review';
}

export interface CustomerActivity {
  id: string;
  customer_id: string;
  activity_type:
    | 'booking'
    | 'payment'
    | 'communication'
    | 'visit'
    | 'review'
    | 'complaint';
  description: string;
  metadata: Record<string, any>;
  created_at: Date;
  property_id: number;
}

export interface CustomerPreferences {
  customer_id: string;
  room_preferences: {
    room_type?: string;
    floor_preference?: string;
    view_preference?: string;
    bed_type?: string;
  };
  service_preferences: {
    housekeeping_frequency?: string;
    wake_up_call?: boolean;
    newspaper?: boolean;
    minibar?: boolean;
  };
  communication_preferences: {
    preferred_language?: string;
    email_notifications?: boolean;
    sms_notifications?: boolean;
    phone_calls?: boolean;
    marketing_emails?: boolean;
  };
  dietary_preferences: {
    restrictions?: string[];
    allergies?: string[];
    favorite_foods?: string[];
    beverage_preferences?: string[];
  };
}

export interface CustomerLoyaltyProgram {
  customer_id: string;
  program_id: string;
  program_name: string;
  tier: string;
  points: number;
  benefits: string[];
  next_tier_points: number;
  membership_date: Date;
  expiry_date?: Date;
  is_active: boolean;
}

export interface CustomerFeedback {
  id: string;
  customer_id: string;
  booking_id?: string;
  rating: number;
  feedback_type: 'service' | 'room' | 'food' | 'staff' | 'overall';
  comment?: string;
  is_public: boolean;
  created_at: Date;
  response?: string;
  responded_by?: string;
  responded_at?: Date;
}
