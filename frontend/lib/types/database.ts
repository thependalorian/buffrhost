/**
 * Database-Aligned TypeScript Type Definitions
 *
 * Purpose: Comprehensive type definitions that exactly match the Neon PostgreSQL database schema
 * for Buffr Host. These types ensure type safety between frontend and database operations.
 * Location: lib/types/database.ts
 * Usage: Shared across all database operations, API routes, and services for type safety
 *
 * @module Database Types
 * @author Buffr Host Development Team
 * @version 1.0.0
 *
 * @description
 * This module contains type definitions for all database tables and operations in Buffr Host.
 * All types are aligned with the actual PostgreSQL schema to ensure consistency. These types
 * are used by database services, API routes, and components for type-safe data handling.
 */

// ============================================================================
// CORE SYSTEM TYPES
// ============================================================================

/**
 * User Interface
 *
 * Represents a user in the Buffr Host system as stored in the database.
 * Maps directly to the `users` table in PostgreSQL.
 *
 * @interface User
 * @property {string} id - Unique user identifier (UUID)
 * @property {string} email - User's email address (unique, used for authentication)
 * @property {string} password_hash - Hashed password (never exposed to frontend)
 * @property {string} full_name - User's full name
 * @property {string} [phone] - User's phone number (optional)
 * @property {UserRole} role - User's role in the system
 * @property {string} [tenant_id] - Tenant ID for multi-tenant isolation
 * @property {boolean} is_active - Whether user account is active
 * @property {boolean} email_verified - Whether user's email has been verified
 * @property {string} [last_login] - ISO timestamp of last login
 * @property {number} login_count - Total number of logins
 * @property {string} created_at - ISO timestamp when user was created
 * @property {string} updated_at - ISO timestamp when user was last updated
 * @property {boolean} is_verified - Whether user identity has been verified (KYC)
 *
 * @security password_hash is never returned to the frontend
 * @database Maps to `users` table
 *
 * @example
 * const user: User = {
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   email: 'user@example.com',
 *   password_hash: '$2b$10$...',
 *   full_name: 'John Doe',
 *   phone: '+264811234567',
 *   role: 'manager',
 *   tenant_id: 'tenant_abc',
 *   is_active: true,
 *   email_verified: true,
 *   last_login: '2024-01-20T10:30:00Z',
 *   login_count: 42,
 *   created_at: '2024-01-15T08:00:00Z',
 *   updated_at: '2024-01-20T10:30:00Z',
 *   is_verified: true
 * };
 */
/**
 * Database Type Definitions for Buffr Host Hospitality Platform
 * @fileoverview Database type definitions mapping directly to PostgreSQL database schema for type safety
 * @location buffr-host/lib/types/database.ts
 * @purpose database type definitions mapping directly to PostgreSQL database schema for type safety
 * @modularity Centralized type definitions providing type safety across the entire Buffr Host application
 * @database_connections Maps directly to PostgreSQL tables: restaurant, customer, user, TTS, bookings...
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
 * - 37 Interfaces: User, Tenant, UserPreferences...
 * - 7 Types: UserRole, DatabaseTable, PropertyType...
 * - Total: 44 type definitions
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
 * import type { User, UserRole, Tenant... } from './database';
 *
 * // Usage in component
 * interface ComponentProps {
 *   data: User;
 *   onAction: (event: UserRole) => void;
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
 * @typedef {Interface} User
 * @typedef {Type} UserRole
 * @typedef {Interface} Tenant
 * @typedef {Interface} UserPreferences
 * @typedef {Interface} Property
 * @typedef {Interface} HotelDetails
 * @typedef {Interface} RestaurantDetails
 * @typedef {Interface} RoomType
 * @typedef {Interface} RoomAvailability
 * @typedef {Interface} RoomImage
 * ... and 34 more type definitions
 *
 * @returns {Object} Type definitions module with all exported types and interfaces
 * @type_safety Ensures 100% type coverage across the Buffr Host application
 * @documentation Comprehensive JSDoc documentation for developer experience
 * @maintainability Type-driven development enabling safe refactoring and evolution
 */

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  tenant_id?: string;
  is_active: boolean;
  email_verified: boolean;
  last_login?: string;
  login_count: number;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
}

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'staff'
  | 'property_owner'
  | 'customer'
  | 'guest';

/**
 * Tenant Interface
 *
 * Represents a tenant (organization/business) in the Buffr Host multi-tenant system.
 * Maps directly to the `tenants` table in PostgreSQL.
 *
 * @interface Tenant
 * @property {string} id - Unique tenant identifier (UUID)
 * @property {string} name - Tenant organization name
 * @property {string} [domain] - Custom domain for tenant (optional)
 * @property {boolean} is_active - Whether tenant is currently active
 * @property {string} created_at - ISO timestamp when tenant was created
 * @property {string} updated_at - ISO timestamp when tenant was last updated
 * @property {string} [slug] - URL-friendly slug for tenant
 * @property {Record<string, any>} [settings] - Tenant-specific configuration settings
 *
 * @database Maps to `tenants` table
 * @security All data operations must be scoped by tenant_id
 */
export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  slug?: string;
  settings?: Record<string, any>;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  preference_type: string;
  preference_value: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PROPERTY MANAGEMENT TYPES
// ============================================================================

/**
 * Property Interface
 *
 * Represents a property (hotel or restaurant) in the Buffr Host system.
 * Maps directly to the `properties` table in PostgreSQL with extended computed fields.
 *
 * @interface Property
 * @property {string} id - Unique property identifier (UUID)
 * @property {string} name - Property name
 * @property {string} [description] - Property description
 * @property {'hotel' | 'restaurant'} property_type - Type of property
 * @property {string} address - Physical address
 * @property {string} [city] - City name
 * @property {string} [region] - Region/state name
 * @property {string} [country] - Country name
 * @property {string} [postal_code] - Postal/ZIP code
 * @property {number} [latitude] - GPS latitude coordinate
 * @property {number} [longitude] - GPS longitude coordinate
 * @property {string} [phone] - Contact phone number
 * @property {string} [email] - Contact email address
 * @property {string} [website] - Property website URL
 * @property {string} [check_in_time] - Hotel check-in time (HH:MM format)
 * @property {string} [check_out_time] - Hotel check-out time (HH:MM format)
 * @property {string[] | Record<string, any>} [amenities] - Property amenities list or object
 * @property {Record<string, any>} [policies] - Property policies (cancellation, pets, etc.)
 * @property {string[] | Record<string, any>} [images] - Property images array or object
 * @property {boolean} is_active - Whether property is currently active
 * @property {string} created_at - ISO timestamp when property was created
 * @property {string} updated_at - ISO timestamp when property was last updated
 * @property {string} tenant_id - Tenant ID for multi-tenant isolation (required)
 * @property {number} [average_rating] - Computed average rating (0-5)
 * @property {number} [total_reviews] - Computed total number of reviews
 * @property {number} [total_bookings] - Computed total number of bookings
 * @property {number} [total_orders] - Computed total number of orders
 * @property {any[]} [recent_reviews] - Array of recent review objects
 * @property {HotelDetails} [hotel_details] - Hotel-specific details (if property_type is 'hotel')
 * @property {RestaurantDetails} [restaurant_details] - Restaurant-specific details (if property_type is 'restaurant')
 *
 * @database Maps to `properties` table
 * @security All queries must include tenant_id
 *
 * @example
 * const property: Property = {
 *   id: 'prop_123',
 *   name: 'Luxury Beach Hotel',
 *   description: '5-star beachfront property',
 *   property_type: 'hotel',
 *   address: '123 Beach Road',
 *   city: 'Swakopmund',
 *   country: 'Namibia',
 *   tenant_id: 'tenant_abc',
 *   is_active: true,
 *   hotel_details: { star_rating: 5, room_count: 120 }
 * };
 */
export interface Property {
  id: string;
  name: string;
  description?: string;
  property_type: 'hotel' | 'restaurant';
  address: string;
  city?: string;
  region?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  check_in_time?: string;
  check_out_time?: string;
  amenities?: string[] | Record<string, any>;
  policies?: Record<string, any>;
  images?: string[] | Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tenant_id: string;
  // Additional computed fields
  average_rating?: number;
  total_reviews?: number;
  total_bookings?: number;
  total_orders?: number;
  recent_reviews?: any[];
  // Hotel-specific data
  hotel_details?: HotelDetails;
  // Restaurant-specific data
  restaurant_details?: RestaurantDetails;
}

export interface HotelDetails {
  id: string;
  property_id?: string;
  star_rating?: number;
  room_count?: number;
  check_in_time?: string;
  check_out_time?: string;
  amenities?: string[];
  policies?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface RestaurantDetails {
  id: string;
  property_id?: string;
  cuisine_type?: string;
  price_range?: string;
  seating_capacity?: number;
  operating_hours?: Record<string, any>;
  special_features?: string[];
  created_at: string;
  updated_at: string;
}

export interface RoomType {
  id: string;
  property_id?: string;
  type_name: string;
  description?: string;
  max_occupancy: number;
  base_price: number;
  size_sqm?: number;
  bed_type?: string;
  amenities?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoomAvailability {
  id: string;
  room_type_id?: string;
  date: string;
  available_rooms: number;
  price?: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoomImage {
  id: string;
  room_type_id?: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface RestaurantTable {
  id: string;
  property_id?: string;
  table_number: string;
  capacity: number;
  location?: string;
  status: string;
  floor_plan_data?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// BOOKING & ORDER TYPES
// ============================================================================

/**
 * Booking Interface
 *
 * Represents a booking (reservation) in the Buffr Host system.
 * Maps directly to the `bookings` table in PostgreSQL.
 *
 * @interface Booking
 * @property {string} id - Unique booking identifier (UUID)
 * @property {string} [property_id] - ID of the property where booking was made
 * @property {string} [customer_id] - ID of the customer who made the booking
 * @property {string} booking_type - Type of booking ('hotel', 'restaurant', 'table', etc.)
 * @property {string} [reference_id] - Human-readable booking reference number
 * @property {string} [check_in_date] - Check-in date (ISO date string)
 * @property {string} [check_out_date] - Check-out date (ISO date string)
 * @property {string} [booking_date] - Date when booking was made (ISO date string)
 * @property {string} [booking_time] - Time when booking was made (HH:MM format)
 * @property {number} [party_size] - Number of guests/people
 * @property {string} status - Booking status ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')
 * @property {number} [total_amount] - Total booking amount
 * @property {string} [special_requests] - Special requests from customer
 * @property {string} created_at - ISO timestamp when booking was created
 * @property {string} updated_at - ISO timestamp when booking was last updated
 * @property {string} [guest_name] - Guest name (denormalized for quick access)
 * @property {string} [guest_email] - Guest email (denormalized)
 * @property {string} [guest_phone] - Guest phone (denormalized)
 * @property {string} [check_in] - Check-in timestamp (ISO string)
 * @property {string} [check_out] - Check-out timestamp (ISO string)
 * @property {string} [service_date] - Service date for restaurant bookings (ISO date string)
 * @property {string} [service_time] - Service time for restaurant bookings (HH:MM format)
 * @property {number} paid_amount - Amount that has been paid
 * @property {string} [confirmation_number] - Booking confirmation number
 * @property {string} [notes] - Internal notes about the booking
 *
 * @database Maps to `bookings` table
 * @security All queries must include tenant_id for multi-tenant isolation
 */
export interface Booking {
  id: string;
  property_id?: string;
  customer_id?: string;
  booking_type: string;
  reference_id?: string;
  check_in_date?: string;
  check_out_date?: string;
  booking_date?: string;
  booking_time?: string;
  party_size?: number;
  status: string;
  total_amount?: number;
  special_requests?: string;
  created_at: string;
  updated_at: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  check_in?: string;
  check_out?: string;
  service_date?: string;
  service_time?: string;
  paid_amount: number;
  confirmation_number?: string;
  notes?: string;
}

/**
 * Order Interface
 *
 * Represents an order (restaurant order, room service order, etc.) in the Buffr Host system.
 * Maps directly to the `orders` table in PostgreSQL.
 *
 * @interface Order
 * @property {string} id - Unique order identifier (UUID)
 * @property {string} order_number - Human-readable order number
 * @property {string} [property_id] - ID of the property where order was placed
 * @property {string} [customer_id] - ID of the customer who placed the order
 * @property {string} order_type - Type of order ('restaurant', 'room_service', 'bar', etc.)
 * @property {number} [table_number] - Table number (for restaurant orders)
 * @property {Record<string, any>} items - Order items (denormalized or reference)
 * @property {number} subtotal - Order subtotal before taxes and tips
 * @property {number} tax - Tax amount
 * @property {number} tip - Tip amount
 * @property {number} total_amount - Total amount including tax and tip
 * @property {string} status - Order status ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')
 * @property {string} [special_instructions] - Special instructions for the order
 * @property {number} [estimated_preparation_time] - Estimated preparation time in minutes
 * @property {string} created_at - ISO timestamp when order was created
 * @property {string} updated_at - ISO timestamp when order was last updated
 *
 * @database Maps to `orders` table
 * @security All queries must include tenant_id for multi-tenant isolation
 */
export interface Order {
  id: string;
  order_number: string;
  property_id?: string;
  customer_id?: string;
  order_type: string;
  table_number?: number;
  items: Record<string, any>;
  subtotal: number;
  tax: number;
  tip: number;
  total_amount: number;
  status: string;
  special_instructions?: string;
  estimated_preparation_time?: number;
  created_at: string;
  updated_at: string;
}

export interface TableReservation {
  id: string;
  table_id?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  status: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// STAFF MANAGEMENT TYPES
// ============================================================================

/**
 * Staff Interface
 *
 * Represents a staff member in the Buffr Host system.
 * Maps directly to the `staff` table in PostgreSQL.
 *
 * @interface Staff
 * @property {string} id - Unique staff identifier (UUID)
 * @property {string} user_id - ID of the associated user account
 * @property {string} [property_id] - ID of the property where staff member works (optional)
 * @property {string} tenant_id - Tenant ID for multi-tenant isolation (required)
 * @property {string} employee_id - Employee ID/employee number
 * @property {string} position - Staff position/title
 * @property {string} [department] - Department name (optional)
 * @property {string} hire_date - Date when staff was hired (ISO date string)
 * @property {number} [salary] - Staff salary (optional, sensitive data)
 * @property {string} status - Staff status ('active', 'inactive', 'terminated', 'on_leave')
 * @property {string} shift_type - Type of shift ('full_time', 'part_time', 'contract', etc.)
 * @property {string} [manager_id] - ID of the staff member's manager
 * @property {string} [emergency_contact_name] - Emergency contact name
 * @property {string} [emergency_contact_phone] - Emergency contact phone number
 * @property {string} [emergency_contact_relationship] - Relationship to emergency contact
 * @property {string} created_at - ISO timestamp when staff record was created
 * @property {string} updated_at - ISO timestamp when staff record was last updated
 *
 * @database Maps to `staff` table
 * @security All queries must include tenant_id for multi-tenant isolation
 */
export interface Staff {
  id: string;
  user_id: string;
  property_id?: string;
  tenant_id: string;
  employee_id: string;
  position: string;
  department?: string;
  hire_date: string;
  salary?: number;
  status: string;
  shift_type: string;
  manager_id?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Staff Activity Interface
 *
 * Represents an activity performed by a staff member.
 * Maps directly to the `staff_activities` table in PostgreSQL.
 *
 * @interface StaffActivity
 * @property {string} id - Unique activity identifier (UUID)
 * @property {string} staff_id - ID of the staff member who performed the activity
 * @property {string} tenant_id - Tenant ID for multi-tenant isolation (required)
 * @property {string} activity_type - Type of activity ('check_in', 'service', 'maintenance', etc.)
 * @property {string} [activity_description] - Description of the activity
 * @property {string} [property_id] - ID of the property where activity occurred
 * @property {string} [customer_id] - ID of the customer involved (if applicable)
 * @property {string} [booking_id] - ID of the booking involved (if applicable)
 * @property {string} [order_id] - ID of the order involved (if applicable)
 * @property {number} [duration_minutes] - Duration of the activity in minutes
 * @property {string} status - Activity status ('completed', 'in_progress', 'cancelled', etc.)
 * @property {string} [notes] - Additional notes about the activity
 * @property {string} created_at - ISO timestamp when activity was created
 * @property {string} updated_at - ISO timestamp when activity was last updated
 *
 * @database Maps to `staff_activities` table
 */
export interface StaffActivity {
  id: string;
  staff_id: string;
  tenant_id: string;
  activity_type: string;
  activity_description?: string;
  property_id?: string;
  customer_id?: string;
  booking_id?: string;
  order_id?: string;
  duration_minutes?: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Staff Performance Interface
 *
 * Represents performance metrics for a staff member.
 * Maps directly to the `staff_performance` table in PostgreSQL.
 *
 * @interface StaffPerformance
 * @property {string} id - Unique performance record identifier (UUID)
 * @property {string} staff_id - ID of the staff member
 * @property {string} tenant_id - Tenant ID for multi-tenant isolation (required)
 * @property {string} [property_id] - ID of the property (optional)
 * @property {string} metric_name - Name of the performance metric
 * @property {number} metric_value - Value of the performance metric
 * @property {string} [metric_unit] - Unit of measurement (e.g., 'percentage', 'count', 'rating')
 * @property {number} [target_value] - Target value for the metric
 * @property {string} performance_period_start - Start date of performance period (ISO date string)
 * @property {string} performance_period_end - End date of performance period (ISO date string)
 * @property {string} [trend] - Trend direction ('improving', 'declining', 'stable')
 * @property {string} [notes] - Additional notes about performance
 * @property {string} created_at - ISO timestamp when record was created
 * @property {string} updated_at - ISO timestamp when record was last updated
 *
 * @database Maps to `staff_performance` table
 */
export interface StaffPerformance {
  id: string;
  staff_id: string;
  tenant_id: string;
  property_id?: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  target_value?: number;
  performance_period_start: string;
  performance_period_end: string;
  trend?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Staff Schedule Interface
 *
 * Represents a scheduled shift for a staff member.
 * Maps directly to the `staff_schedules` table in PostgreSQL.
 *
 * @interface StaffSchedule
 * @property {string} id - Unique schedule identifier (UUID)
 * @property {string} staff_id - ID of the staff member
 * @property {string} tenant_id - Tenant ID for multi-tenant isolation (required)
 * @property {string} [property_id] - ID of the property (optional)
 * @property {string} shift_date - Date of the shift (ISO date string)
 * @property {string} start_time - Shift start time (HH:MM format)
 * @property {string} end_time - Shift end time (HH:MM format)
 * @property {number} break_duration_minutes - Break duration in minutes
 * @property {string} shift_type - Type of shift ('morning', 'afternoon', 'night', 'split', etc.)
 * @property {string} status - Schedule status ('scheduled', 'confirmed', 'cancelled', 'completed')
 * @property {string} [notes] - Additional notes about the shift
 * @property {string} created_at - ISO timestamp when schedule was created
 * @property {string} updated_at - ISO timestamp when schedule was last updated
 *
 * @database Maps to `staff_schedules` table
 */
export interface StaffSchedule {
  id: string;
  staff_id: string;
  tenant_id: string;
  property_id?: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  break_duration_minutes: number;
  shift_type: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// SOFIA AI SYSTEM TYPES
// ============================================================================

/**
 * Sofia Agent Interface
 *
 * Represents a Sofia AI agent configured for a property.
 * Maps directly to the `sofia_agents` table in PostgreSQL.
 *
 * @interface SofiaAgent
 * @property {string} id - Unique agent identifier (UUID)
 * @property {string} property_id - ID of the property this agent serves
 * @property {string} tenant_id - Tenant ID for multi-tenant isolation (required)
 * @property {string} name - Agent name/identifier
 * @property {Record<string, any>} personality - Agent personality configuration
 * @property {Record<string, any>} configuration - Agent configuration settings
 * @property {string} status - Agent status ('active', 'inactive', 'maintenance', 'error')
 * @property {boolean} is_active - Whether agent is currently active
 * @property {string} created_at - ISO timestamp when agent was created
 * @property {string} updated_at - ISO timestamp when agent was last updated
 *
 * @database Maps to `sofia_agents` table
 * @see Sofia AI agent system for hospitality customer service
 */
export interface SofiaAgent {
  id: string;
  property_id: string;
  tenant_id: string;
  name: string;
  personality: Record<string, any>;
  configuration: Record<string, any>;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Sofia Conversation Interface
 *
 * Represents a conversation between Sofia AI and a customer.
 * Maps directly to the `sofia_conversations` table in PostgreSQL.
 *
 * @interface SofiaConversation
 * @property {string} id - Unique conversation identifier (UUID)
 * @property {string} agent_id - ID of the Sofia agent handling the conversation
 * @property {string} property_id - ID of the property
 * @property {string} tenant_id - Tenant ID for multi-tenant isolation (required)
 * @property {string} [customer_id] - ID of the customer (if registered)
 * @property {string} [customer_email] - Customer email (if not registered)
 * @property {string} [customer_name] - Customer name (if available)
 * @property {string} conversation_type - Type of conversation ('booking', 'inquiry', 'support', etc.)
 * @property {string} status - Conversation status ('active', 'completed', 'archived')
 * @property {Record<string, any>} context - Conversation context and state
 * @property {Record<string, any>} metadata - Additional metadata
 * @property {string} created_at - ISO timestamp when conversation started
 * @property {string} updated_at - ISO timestamp when conversation was last updated
 *
 * @database Maps to `sofia_conversations` table
 */
export interface SofiaConversation {
  id: string;
  agent_id: string;
  property_id: string;
  tenant_id: string;
  customer_id?: string;
  customer_email?: string;
  customer_name?: string;
  conversation_type: string;
  status: string;
  context: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Sofia Message Interface
 *
 * Represents a message within a Sofia conversation.
 * Maps directly to the `sofia_messages` table in PostgreSQL.
 *
 * @interface SofiaMessage
 * @property {string} id - Unique message identifier (UUID)
 * @property {string} conversation_id - ID of the parent conversation
 * @property {string} sender_type - Type of sender ('user', 'agent', 'system')
 * @property {string} message_type - Type of message ('text', 'image', 'voice', 'rich')
 * @property {string} content - Message content
 * @property {string} [intent] - Detected intent (if message is from user)
 * @property {number} [confidence] - Confidence score for intent detection (0-1)
 * @property {Record<string, any>} context - Message context
 * @property {Record<string, any>} metadata - Additional message metadata
 * @property {string} created_at - ISO timestamp when message was created
 *
 * @database Maps to `sofia_messages` table
 */
export interface SofiaMessage {
  id: string;
  conversation_id: string;
  sender_type: string;
  message_type: string;
  content: string;
  intent?: string;
  confidence?: number;
  context: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
}

/**
 * Sofia Memory Interface
 *
 * Represents a memory stored by Sofia AI for learning and context.
 * Maps directly to the `sofia_memories` table in PostgreSQL.
 *
 * @interface SofiaMemory
 * @property {string} id - Unique memory identifier (UUID)
 * @property {string} agent_id - ID of the Sofia agent
 * @property {string} property_id - ID of the property
 * @property {string} tenant_id - Tenant ID for multi-tenant isolation (required)
 * @property {string} memory_type - Type of memory ('customer_preference', 'property_info', 'conversation_pattern', etc.)
 * @property {string} content - Memory content/stored information
 * @property {number} importance - Importance score (0-100) for memory retention
 * @property {number} access_count - Number of times this memory has been accessed
 * @property {string} [last_accessed] - ISO timestamp of last access
 * @property {Record<string, any>} metadata - Additional metadata about the memory
 * @property {string} created_at - ISO timestamp when memory was created
 * @property {string} updated_at - ISO timestamp when memory was last updated
 *
 * @database Maps to `sofia_memories` table
 */
export interface SofiaMemory {
  id: string;
  agent_id: string;
  property_id: string;
  tenant_id: string;
  memory_type: string;
  content: string;
  importance: number;
  access_count: number;
  last_accessed?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Sofia Capabilities Interface
 *
 * Represents the enabled capabilities and features for a Sofia AI agent.
 * Maps directly to the `sofia_capabilities` table in PostgreSQL.
 *
 * @interface SofiaCapabilities
 * @property {string} id - Unique capabilities identifier (UUID)
 * @property {string} tenant_id - Tenant ID for multi-tenant isolation (required)
 * @property {string} property_id - ID of the property
 * @property {boolean} tts_enabled - Whether text-to-speech is enabled
 * @property {boolean} sms_enabled - Whether SMS messaging is enabled
 * @property {boolean} voice_enabled - Whether voice interactions are enabled
 * @property {boolean} chat_enabled - Whether chat messaging is enabled
 * @property {boolean} analytics_enabled - Whether analytics tracking is enabled
 * @property {boolean} vision_enabled - Whether image/vision analysis is enabled
 * @property {boolean} african_voice_enabled - Whether African voice profiles are enabled
 * @property {boolean} deepseek_vision_enabled - Whether DeepSeek vision model is enabled
 * @property {string} default_language - Default language code (ISO 639-1)
 * @property {string[]} supported_languages - Array of supported language codes
 * @property {string} voice_profile - Voice profile identifier
 * @property {boolean} cultural_context_enabled - Whether cultural context awareness is enabled
 * @property {string} created_at - ISO timestamp when capabilities were created
 * @property {string} updated_at - ISO timestamp when capabilities were last updated
 *
 * @database Maps to `sofia_capabilities` table
 */
export interface SofiaCapabilities {
  id: string;
  tenant_id: string;
  property_id: string;
  tts_enabled: boolean;
  sms_enabled: boolean;
  voice_enabled: boolean;
  chat_enabled: boolean;
  analytics_enabled: boolean;
  vision_enabled: boolean;
  african_voice_enabled: boolean;
  deepseek_vision_enabled: boolean;
  default_language: string;
  supported_languages: string[];
  voice_profile: string;
  cultural_context_enabled: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Sofia Analytics Interface
 *
 * Represents analytics/metrics data for Sofia AI agents.
 * Maps directly to the `sofia_analytics` table in PostgreSQL.
 *
 * @interface SofiaAnalytics
 * @property {string} id - Unique analytics record identifier (UUID)
 * @property {string} agent_id - ID of the Sofia agent
 * @property {string} property_id - ID of the property
 * @property {string} tenant_id - Tenant ID for multi-tenant isolation (required)
 * @property {string} metric_type - Type of metric ('response_time', 'satisfaction', 'conversion', etc.)
 * @property {number} metric_value - Value of the metric
 * @property {string} [metric_unit] - Unit of measurement
 * @property {Record<string, any>} dimensions - Dimension data for the metric (date, customer segment, etc.)
 * @property {Record<string, any>} metadata - Additional metadata
 * @property {string} recorded_at - ISO timestamp when metric was recorded
 *
 * @database Maps to `sofia_analytics` table
 */
export interface SofiaAnalytics {
  id: string;
  agent_id: string;
  property_id: string;
  tenant_id: string;
  metric_type: string;
  metric_value: number;
  metric_unit?: string;
  dimensions: Record<string, any>;
  metadata: Record<string, any>;
  recorded_at: string;
}

/**
 * Sofia Config Interface
 *
 * Represents configuration settings for Sofia AI system.
 * Maps directly to the `sofia_config` table in PostgreSQL.
 *
 * @interface SofiaConfig
 * @property {string} id - Unique config identifier (UUID)
 * @property {string} tenant_id - Tenant ID for multi-tenant isolation (required)
 * @property {string} config_key - Configuration key name
 * @property {string} config_value - Configuration value (may be encrypted)
 * @property {string} config_type - Type of configuration value ('string', 'number', 'boolean', 'json')
 * @property {string} category - Configuration category ('agent', 'integration', 'security', etc.)
 * @property {string} [description] - Description of the configuration
 * @property {boolean} is_encrypted - Whether the config value is encrypted
 * @property {boolean} is_active - Whether configuration is currently active
 * @property {string} created_at - ISO timestamp when config was created
 * @property {string} updated_at - ISO timestamp when config was last updated
 *
 * @database Maps to `sofia_config` table
 * @security Encrypted config values must be decrypted using secure key management
 */
export interface SofiaConfig {
  id: string;
  tenant_id: string;
  config_key: string;
  config_value: string;
  config_type: string;
  category: string;
  description?: string;
  is_encrypted: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Sofia Voice Profile Interface
 *
 * Represents a voice profile configuration for Sofia AI text-to-speech.
 * Maps directly to the `sofia_voice_profiles` table in PostgreSQL.
 *
 * @interface SofiaVoiceProfile
 * @property {string} id - Unique voice profile identifier (UUID)
 * @property {string} profile_name - Internal profile name/identifier
 * @property {string} display_name - Human-readable display name
 * @property {string} context - Context description for the voice profile
 * @property {string} voice_name - Voice name from TTS provider
 * @property {string} style - Voice style ('professional', 'friendly', 'formal', etc.)
 * @property {string} tone - Voice tone ('warm', 'neutral', 'enthusiastic', etc.)
 * @property {string} pace - Speaking pace ('slow', 'normal', 'fast')
 * @property {string} accent - Voice accent ('namibian', 'south_african', 'neutral', etc.)
 * @property {string[]} cultural_markers - Array of cultural markers/characteristics
 * @property {boolean} namibian_optimized - Whether voice is optimized for Namibian context
 * @property {boolean} is_default - Whether this is the default voice profile
 * @property {string} created_at - ISO timestamp when profile was created
 * @property {string} updated_at - ISO timestamp when profile was last updated
 *
 * @database Maps to `sofia_voice_profiles` table
 */
export interface SofiaVoiceProfile {
  id: string;
  profile_name: string;
  display_name: string;
  context: string;
  voice_name: string;
  style: string;
  tone: string;
  pace: string;
  accent: string;
  cultural_markers: string[];
  namibian_optimized: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ANALYTICS & REPORTING TYPES
// ============================================================================

/**
 * Revenue Analytics Interface
 *
 * Represents revenue analytics data for properties.
 * Maps directly to the `revenue_analytics` table in PostgreSQL.
 *
 * @interface RevenueAnalytics
 * @property {string} id - Unique analytics record identifier (UUID)
 * @property {string} [property_id] - ID of the property (optional for tenant-wide analytics)
 * @property {string} tenant_id - Tenant ID for multi-tenant isolation (required)
 * @property {string} period_type - Type of period ('daily', 'weekly', 'monthly', 'yearly')
 * @property {string} period_start - Start date of the period (ISO date string)
 * @property {string} period_end - End date of the period (ISO date string)
 * @property {number} [total_revenue] - Total revenue for the period
 * @property {number} [booking_revenue] - Revenue from bookings
 * @property {number} [order_revenue] - Revenue from orders
 * @property {number} [service_revenue] - Revenue from services
 * @property {number} [other_revenue] - Revenue from other sources
 * @property {number} [total_transactions] - Total number of transactions
 * @property {number} [booking_count] - Number of bookings
 * @property {number} [order_count] - Number of orders
 * @property {number} [service_count] - Number of services
 * @property {number} [average_transaction_value] - Average value per transaction
 * @property {number} [average_booking_value] - Average value per booking
 * @property {number} [average_order_value] - Average value per order
 * @property {number} [revenue_growth_percentage] - Revenue growth percentage
 * @property {number} [transaction_growth_percentage] - Transaction growth percentage
 * @property {number} [previous_period_revenue] - Revenue from previous period (for comparison)
 * @property {number} [previous_period_transactions] - Transactions from previous period
 * @property {string} data_source - Source of the data ('calculated', 'imported', 'manual')
 * @property {string} last_calculated_at - ISO timestamp when analytics were last calculated
 * @property {string} created_at - ISO timestamp when record was created
 * @property {string} updated_at - ISO timestamp when record was last updated
 * @property {number} total_bookings - Total bookings count
 * @property {number} total_orders - Total orders count
 * @property {number} occupancy_rate - Occupancy rate (for hotels, 0-100)
 * @property {number} [revenue] - Alias for total_revenue
 * @property {number} [expenses] - Expenses for the period
 * @property {number} [profit] - Profit (revenue - expenses)
 *
 * @database Maps to `revenue_analytics` table
 */
export interface RevenueAnalytics {
  id: string;
  property_id?: string;
  tenant_id: string;
  period_type: string;
  period_start: string;
  period_end: string;
  total_revenue?: number;
  booking_revenue?: number;
  order_revenue?: number;
  service_revenue?: number;
  other_revenue?: number;
  total_transactions?: number;
  booking_count?: number;
  order_count?: number;
  service_count?: number;
  average_transaction_value?: number;
  average_booking_value?: number;
  average_order_value?: number;
  revenue_growth_percentage?: number;
  transaction_growth_percentage?: number;
  previous_period_revenue?: number;
  previous_period_transactions?: number;
  data_source: string;
  last_calculated_at: string;
  created_at: string;
  updated_at: string;
  total_bookings: number;
  total_orders: number;
  occupancy_rate: number;
  revenue?: number;
  expenses?: number;
  profit?: number;
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  user_id?: string;
  property_id?: string;
  tenant_id?: string;
  event_data: Record<string, any>;
  created_at: string;
}

export interface CrmAnalytics {
  id: string;
  property_id?: string;
  tenant_id: string;
  metric_name: string;
  metric_value: number;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
}

export interface CrmCampaign {
  id: string;
  name: string;
  tenant_id: string;
  campaign_type: string;
  status: string;
  start_date: string;
  end_date?: string;
  target_audience: Record<string, any>;
  content: Record<string, any>;
  metrics: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CrmCustomer {
  id: string;
  tenant_id: string;
  property_id?: string;
  customer_name: string;
  email: string;
  phone?: string;
  customer_type: string;
  status: string;
  total_spent: number;
  last_visit?: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// WAITLIST & LEAD MANAGEMENT TYPES
// ============================================================================

export interface WaitlistEntry {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  business_type: string;
  property_count?: string;
  current_solution?: string;
  challenges?: string;
  timeline?: string;
  lead_score: number;
  status: string;
  priority: string;
  sofia_analysis?: Record<string, any>;
  sofia_recommendations?: string[];
  sofia_confidence?: number;
  last_contacted_at?: string;
  contact_count: number;
  response_rate: number;
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer_url?: string;
  user_agent?: string;
  ip_address?: string;
  created_at: string;
  updated_at: string;
}

export interface WaitlistCommunication {
  id: string;
  waitlist_entry_id: string;
  tenant_id: string;
  type: string;
  direction: string;
  subject?: string;
  content: string;
  sofia_generated: boolean;
  sofia_prompt?: string;
  sofia_response?: string;
  sofia_confidence?: number;
  email_template_id?: string;
  email_status?: string;
  email_provider: string;
  email_provider_id?: string;
  opened_at?: string;
  clicked_at?: string;
  replied_at?: string;
  response_content?: string;
  metadata?: Record<string, any>;
  created_at: string;
  sent_at?: string;
  delivered_at?: string;
}

export interface WaitlistTemplate {
  id: string;
  tenant_id: string;
  name: string;
  type: string;
  subject: string;
  content: string;
  sofia_prompt?: string;
  sofia_enabled: boolean;
  sofia_personality: string;
  trigger_conditions?: Record<string, any>;
  delay_hours: number;
  priority: number;
  active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface WaitlistAnalytics {
  id: string;
  tenant_id: string;
  date: string;
  new_signups?: number;
  emails_sent?: number;
  emails_opened?: number;
  emails_clicked?: number;
  demos_scheduled?: number;
  trials_started?: number;
  conversions?: number;
  sofia_emails_generated?: number;
  sofia_avg_confidence?: number;
  sofia_response_rate?: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  generatedAt?: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  averageRating: number;
  totalReviews: number;
  todayRevenue: number;
  monthlyRevenue: number;
  disbursementStatus: string;
  nextDisbursement: string;
}

export interface PropertyMetrics {
  totalBookings: number;
  totalOrders: number;
  totalRevenue: number;
  occupancyRate: number;
  averageOrderValue: number;
  customerSatisfaction: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DatabaseTable =
  | 'users'
  | 'properties'
  | 'bookings'
  | 'orders'
  | 'hotel_details'
  | 'restaurant_details'
  | 'room_types'
  | 'room_availability'
  | 'restaurant_tables'
  | 'table_reservations'
  | 'staff'
  | 'staff_activities'
  | 'staff_performance'
  | 'staff_schedules'
  | 'sofia_agents'
  | 'sofia_conversations'
  | 'sofia_messages'
  | 'sofia_memories'
  | 'sofia_capabilities'
  | 'sofia_analytics'
  | 'sofia_config'
  | 'revenue_analytics'
  | 'analytics_events'
  | 'crm_analytics'
  | 'crm_campaigns'
  | 'crm_customers'
  | 'waitlist_entries'
  | 'waitlist_communications'
  | 'waitlist_templates'
  | 'waitlist_analytics';

export type PropertyType = 'hotel' | 'restaurant' | 'mixed' | 'other';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled'
  | 'no_show';

export type StaffStatus = 'active' | 'inactive' | 'terminated' | 'on_leave';

export type SofiaStatus = 'active' | 'inactive' | 'maintenance' | 'error';
