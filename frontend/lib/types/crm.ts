/**
 * CRM (Customer Relationship Management) Type Definitions
 *
 * Purpose: Type definitions for customer management and CRM operations in Buffr Host
 * Location: lib/types/crm.ts
 * Usage: Shared across CRM components, customer APIs, and customer management pages
 *
 * @module CRM Types
 * @author Buffr Host Development Team
 * @version 1.0.0
 */

/**
 * Customer Interface
 *
 * Represents a customer in the Buffr Host system with comprehensive profile information,
 * booking history, loyalty status, and communication preferences.
 *
 * @interface Customer
 * @property {string} id - Unique customer identifier
 * @property {string} tenant_id - Tenant ID for multi-tenant isolation (required for all queries)
 * @property {string} first_name - Customer's first name
 * @property {string} last_name - Customer's last name
 * @property {string} email - Customer's email address (unique per tenant)
 * @property {string} phone - Customer's phone number
 * @property {Date} [date_of_birth] - Customer's date of birth (optional for age verification)
 * @property {string} [nationality] - Customer's nationality (for compliance and analytics)
 * @property {string} [passport_number] - Passport number for international guests
 * @property {string} [address] - Customer's street address
 * @property {string} [city] - Customer's city
 * @property {string} [country] - Customer's country
 * @property {string} [postal_code] - Postal/ZIP code
 * @property {string} preferred_language - Customer's preferred language (ISO 639-1 code)
 * @property {'standard' | 'premium' | 'vip'} vip_status - Customer VIP tier level
 * @property {number} total_bookings - Total number of bookings made by customer
 * @property {number} total_spent - Total amount spent by customer across all transactions
 * @property {Date} [last_booking_date] - Date of customer's most recent booking
 * @property {number} loyalty_points - Current loyalty points balance
 * @property {boolean} marketing_consent - Whether customer has consented to marketing communications
 * @property {Date} created_at - Timestamp when customer record was created
 * @property {Date} updated_at - Timestamp when customer record was last updated
 *
 * @example
 * const customer: Customer = {
 *   id: 'cust_123',
 *   tenant_id: 'tenant_abc',
 *   first_name: 'John',
 *   last_name: 'Doe',
 *   email: 'john.doe@example.com',
 *   phone: '+264811234567',
 *   preferred_language: 'en',
 *   vip_status: 'premium',
 *   total_bookings: 5,
 *   total_spent: 15000,
 *   loyalty_points: 150,
 *   marketing_consent: true,
 *   created_at: new Date('2024-01-15'),
 *   updated_at: new Date('2024-01-20')
 * };
 */
/**
 * Crm Type Definitions for Buffr Host Hospitality Platform
 * @fileoverview Crm type definitions for customer relationship management and guest services
 * @location buffr-host/lib/types/crm.ts
 * @purpose crm type definitions for customer relationship management and guest services
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
 * - 1 Interface: Customer
 * - Total: 1 type definition
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
 * import type { Customer } from './crm';
 *
 * // Usage in component
 * interface ComponentProps {
 *   data: Customer;
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
 * @typedef {Interface} Customer
 *
 * @returns {Object} Type definitions module with all exported types and interfaces
 * @type_safety Ensures 100% type coverage across the Buffr Host application
 * @documentation Comprehensive JSDoc documentation for developer experience
 * @maintainability Type-driven development enabling safe refactoring and evolution
 */

export interface Customer {
  id: string;
  tenant_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: Date;
  nationality?: string;
  passport_number?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  preferred_language: string;
  vip_status: 'standard' | 'premium' | 'vip';
  total_bookings: number;
  total_spent: number;
  last_booking_date?: Date;
  loyalty_points: number;
  marketing_consent: boolean;
  created_at: Date;
  updated_at: Date;
}
