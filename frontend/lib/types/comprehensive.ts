/**
 * Comprehensive Type Definitions for Buffr Host
 *
 * Purpose: Consolidates all core type definitions for the Buffr Host multi-tenant hospitality platform,
 * including order management, property management, user management, platform analytics, and brand identity integration
 * Location: lib/types/comprehensive.ts
 * Usage: Shared across the entire application as the primary type reference for core business entities
 *
 * @module Comprehensive Types
 * @author Buffr Host Development Team
 * @version 1.0.0
 * @see {@link ./brand-identity.ts} for brand identity types
 * @see {@link ./properties.ts} for extended property types
 *
 * @description
 * This file serves as the central hub for core business type definitions. It imports and extends
 * brand identity types while providing base interfaces for orders, properties, users, analytics,
 * and platform-wide operations. All types use readonly properties for immutability.
 */

// Import brand identity types for use in this file
import type {
  TenantType,
  UserRole,
  SecurityLevel,
  TenantHierarchy,
  MultiTenantContext,
  BusinessType,
  BrandColor,
  BrandFont,
  EmotionalState,
} from './brand-identity';

// Property types are imported from properties.ts when needed

// ============================================================================
// EXISTING IMPLEMENTATION TYPES
// ============================================================================

/**
 * Order Management Types
 */

/**
 * Order Interface
 *
 * Represents a complete order in the Buffr Host system, including customer information,
 * payment details, order items, and financial breakdown.
 *
 * @interface Order
 * @property {string} id - Unique order identifier
 * @property {string} orderNumber - Human-readable order number (e.g., "ORD-2024-001")
 * @property {string} customerId - ID of the customer who placed the order
 * @property {string} propertyId - ID of the property where the order was placed
 * @property {string} tenantId - Tenant ID for multi-tenant isolation (required)
 * @property {OrderStatus} status - Current status of the order
 * @property {PaymentStatus} paymentStatus - Payment status of the order
 * @property {OrderType} orderType - Type of order (dine-in, takeaway, delivery)
 * @property {OrderItem[]} items - Array of items in the order
 * @property {number} subtotal - Order subtotal before taxes and fees
 * @property {number} vatAmount - VAT/tax amount
 * @property {number} serviceFee - Service fee amount
 * @property {number} processingFee - Payment processing fee
 * @property {number} totalAmount - Total amount including all fees and taxes
 * @property {number} propertyAmount - Amount that goes to the property (after platform fees)
 * @property {string} customerName - Customer's name (denormalized for quick access)
 * @property {string} customerEmail - Customer's email (denormalized for notifications)
 * @property {string} customerPhone - Customer's phone (denormalized for contact)
 * @property {string} [deliveryAddress] - Delivery address (required for delivery orders)
 * @property {string} [specialRequests] - Special instructions or requests from customer
 * @property {Date} createdAt - Timestamp when order was created
 * @property {Date} updatedAt - Timestamp when order was last updated
 * @property {Date} [completedAt] - Timestamp when order was completed
 *
 * @example
 * const order: Order = {
 *   id: 'order_123',
 *   orderNumber: 'ORD-2024-001',
 *   customerId: 'cust_456',
 *   propertyId: 'prop_789',
 *   tenantId: 'tenant_abc',
 *   status: 'confirmed',
 *   paymentStatus: 'paid',
 *   orderType: 'dine_in',
 *   items: [...],
 *   subtotal: 500,
 *   vatAmount: 75,
 *   serviceFee: 25,
 *   processingFee: 10,
 *   totalAmount: 610,
 *   propertyAmount: 575,
 *   customerName: 'John Doe',
 *   customerEmail: 'john@example.com',
 *   customerPhone: '+264811234567',
 *   createdAt: new Date(),
 *   updatedAt: new Date()
 * };
 */
/**
 * Comprehensive Type Definitions for Buffr Host Hospitality Platform
 * @fileoverview Comprehensive comprehensive type definitions covering multiple system domains
 * @location buffr-host/lib/types/comprehensive.ts
 * @purpose comprehensive comprehensive type definitions covering multiple system domains
 * @modularity Centralized type definitions providing type safety across the entire Buffr Host application
 * @database_connections Maps directly to PostgreSQL tables: properties, customer
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
 * - 35 Interfaces: Order, OrderItem, Property...
 * - 14 Types: OrderStatus, PaymentStatus, OrderType...
 * - Total: 49 type definitions
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
 * import type { Order, OrderStatus, PaymentStatus... } from './comprehensive';
 *
 * // Usage in component
 * interface ComponentProps {
 *   data: Order;
 *   onAction: (event: OrderStatus) => void;
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
 * @typedef {Interface} Order
 * @typedef {Type} OrderStatus
 * @typedef {Type} PaymentStatus
 * @typedef {Type} OrderType
 * @typedef {Interface} OrderItem
 * @typedef {Interface} Property
 * @typedef {Type} PropertyType
 * @typedef {Type} PropertyStatus
 * @typedef {Interface} User
 * @typedef {Type} UserStatus
 * ... and 49 more type definitions
 *
 * @returns {Object} Type definitions module with all exported types and interfaces
 * @type_safety Ensures 100% type coverage across the Buffr Host application
 * @documentation Comprehensive JSDoc documentation for developer experience
 * @maintainability Type-driven development enabling safe refactoring and evolution
 */

export interface Order {
  readonly id: string;
  readonly orderNumber: string;
  readonly customerId: string;
  readonly propertyId: string;
  readonly tenantId: string;
  readonly status: OrderStatus;
  readonly paymentStatus: PaymentStatus;
  readonly orderType: OrderType;
  readonly items: OrderItem[];
  readonly subtotal: number;
  readonly vatAmount: number;
  readonly serviceFee: number;
  readonly processingFee: number;
  readonly totalAmount: number;
  readonly propertyAmount: number;
  readonly customerName: string;
  readonly customerEmail: string;
  readonly customerPhone: string;
  readonly deliveryAddress?: string;
  readonly specialRequests?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly completedAt?: Date;
}

/**
 * Order Status Type
 *
 * Represents the current state of an order in the fulfillment lifecycle.
 *
 * @typedef OrderStatus
 * @type {'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'}
 */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

/**
 * Payment Status Type
 *
 * Represents the payment state of an order.
 *
 * @typedef PaymentStatus
 * @type {'pending' | 'paid' | 'failed' | 'refunded'}
 */
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/**
 * Order Type
 *
 * Represents the fulfillment type of an order.
 *
 * @typedef OrderType
 * @type {'dine_in' | 'takeaway' | 'delivery'}
 */
export type OrderType = 'dine_in' | 'takeaway' | 'delivery';

/**
 * Order Item Interface
 *
 * Represents a single item within an order.
 *
 * @interface OrderItem
 * @property {string} id - Unique item identifier within the order
 * @property {string} orderId - ID of the parent order
 * @property {string} menuItemId - ID of the menu item this order item represents
 * @property {string} name - Item name (denormalized for historical accuracy)
 * @property {string} [description] - Item description (denormalized)
 * @property {number} price - Unit price at time of order (for price history accuracy)
 * @property {number} quantity - Quantity of this item in the order
 * @property {string} [specialInstructions] - Special instructions for this item
 *
 * @example
 * const orderItem: OrderItem = {
 *   id: 'item_001',
 *   orderId: 'order_123',
 *   menuItemId: 'menu_item_456',
 *   name: 'Grilled Fish',
 *   description: 'Fresh catch of the day',
 *   price: 150,
 *   quantity: 2,
 *   specialInstructions: 'No lemon, extra herbs'
 * };
 */
export interface OrderItem {
  readonly id: string;
  readonly orderId: string;
  readonly menuItemId: string;
  readonly name: string;
  readonly description?: string;
  readonly price: number;
  readonly quantity: number;
  readonly specialInstructions?: string;
}

/**
 * Property Management Types
 */

/**
 * Property Interface
 *
 * Represents a property (hotel, restaurant, etc.) in the Buffr Host system.
 * This is a simplified version; see properties.ts for extended property types.
 *
 * @interface Property
 * @property {string} id - Unique property identifier
 * @property {string} name - Property name
 * @property {PropertyType} type - Type of property
 * @property {string} location - Property location description
 * @property {string} ownerId - ID of the property owner
 * @property {string} tenantId - Tenant ID for multi-tenant isolation (required)
 * @property {PropertyStatus} status - Current status of the property
 * @property {string} [description] - Property description
 * @property {string} address - Physical address of the property
 * @property {string} [phone] - Contact phone number
 * @property {string} [email] - Contact email address
 * @property {string} [website] - Property website URL
 * @property {number} rating - Average customer rating (0-5 scale)
 * @property {number} totalOrders - Total number of orders processed
 * @property {number} totalRevenue - Total revenue generated
 * @property {Date} createdAt - Timestamp when property was created
 * @property {Date} updatedAt - Timestamp when property was last updated
 */
export interface Property {
  readonly id: string;
  readonly name: string;
  readonly type: PropertyType;
  readonly location: string;
  readonly ownerId: string;
  readonly tenantId: string;
  readonly status: PropertyStatus;
  readonly description?: string;
  readonly address: string;
  readonly phone?: string;
  readonly email?: string;
  readonly website?: string;
  readonly rating: number;
  readonly totalOrders: number;
  readonly totalRevenue: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type PropertyType =
  | 'hotel'
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'spa'
  | 'conference_center';
export type PropertyStatus = 'active' | 'pending' | 'suspended' | 'inactive';

/**
 * User Management Types
 */

/**
 * User Interface
 *
 * Represents a user in the Buffr Host system with role-based access control.
 *
 * @interface User
 * @property {string} id - Unique user identifier
 * @property {string} email - User's email address (unique, used for login)
 * @property {string} name - User's display name
 * @property {UserRole} role - User's role in the system
 * @property {UserStatus} status - Current status of the user account
 * @property {string} [tenantId] - Tenant ID for multi-tenant isolation (optional for platform admins)
 * @property {string[]} [properties] - Array of property IDs user has access to
 * @property {Date} [lastLogin] - Timestamp of user's last login
 * @property {Date} createdAt - Timestamp when user account was created
 * @property {Date} updatedAt - Timestamp when user account was last updated
 *
 * @security User role determines access level and available permissions
 */
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly tenantId?: string;
  readonly properties?: string[];
  readonly lastLogin?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

/**
 * Platform Analytics Types
 */

/**
 * Platform Statistics Interface
 *
 * Aggregated statistics for the entire Buffr Host platform, providing high-level
 * metrics for platform administrators and investors.
 *
 * @interface PlatformStats
 * @property {number} totalProperties - Total number of properties on the platform
 * @property {number} activeProperties - Number of currently active properties
 * @property {number} totalUsers - Total number of users across all tenants
 * @property {number} totalCustomers - Total number of customer records
 * @property {number} totalOrders - Total number of orders processed
 * @property {number} totalRevenue - Total revenue generated across all properties
 * @property {number} monthlyRevenue - Revenue generated in the current month
 * @property {number} dailyRevenue - Revenue generated today
 * @property {number} averageOrderValue - Average value per order
 * @property {number} platformGrowth - Platform growth percentage (month-over-month)
 * @property {SystemHealth} systemHealth - Overall system health metrics
 *
 * @example
 * const stats: PlatformStats = {
 *   totalProperties: 150,
 *   activeProperties: 142,
 *   totalUsers: 5000,
 *   totalCustomers: 50000,
 *   totalOrders: 250000,
 *   totalRevenue: 5000000,
 *   monthlyRevenue: 250000,
 *   dailyRevenue: 8500,
 *   averageOrderValue: 200,
 *   platformGrowth: 15.5,
 *   systemHealth: { status: 'healthy', uptime: 99.9, ... }
 * };
 */
export interface PlatformStats {
  readonly totalProperties: number;
  readonly activeProperties: number;
  readonly totalUsers: number;
  readonly totalCustomers: number;
  readonly totalOrders: number;
  readonly totalRevenue: number;
  readonly monthlyRevenue: number;
  readonly dailyRevenue: number;
  readonly averageOrderValue: number;
  readonly platformGrowth: number;
  readonly systemHealth: SystemHealth;
}

/**
 * System Health Interface
 *
 * Represents the health status and metrics of the Buffr Host platform infrastructure.
 *
 * @interface SystemHealth
 * @property {'healthy' | 'warning' | 'critical'} status - Overall system health status
 * @property {number} uptime - System uptime percentage (0-100)
 * @property {number} responseTime - Average API response time in milliseconds
 * @property {number} errorRate - Error rate percentage (0-100)
 * @property {Date} lastChecked - Timestamp when health metrics were last checked
 *
 * @example
 * const health: SystemHealth = {
 *   status: 'healthy',
 *   uptime: 99.95,
 *   responseTime: 150,
 *   errorRate: 0.05,
 *   lastChecked: new Date()
 * };
 */
export interface SystemHealth {
  readonly status: 'healthy' | 'warning' | 'critical';
  readonly uptime: number;
  readonly responseTime: number;
  readonly errorRate: number;
  readonly lastChecked: Date;
}

// Activity Feed Types
export interface RecentActivity {
  readonly id: string;
  readonly type: ActivityType;
  readonly severity: ActivitySeverity;
  readonly title: string;
  readonly description: string;
  readonly timestamp: Date;
  readonly userId?: string;
  readonly propertyId?: string;
  readonly orderId?: string;
  readonly metadata?: Record<string, unknown>;
}

export type ActivityType = 'order' | 'property' | 'user' | 'payment' | 'system';
export type ActivitySeverity = 'success' | 'info' | 'warning' | 'error';

// Payment Processing Types
export interface Payment {
  readonly id: string;
  readonly orderId: string;
  readonly amount: number;
  readonly currency: string;
  readonly method: PaymentMethod;
  readonly status: PaymentStatus;
  readonly adumoTransactionId?: string;
  readonly realpayTransactionId?: string;
  readonly processedAt?: Date;
  readonly createdAt: Date;
}

export type PaymentMethod = 'card' | 'cash' | 'mobile_money' | 'bank_transfer';

// Disbursement Types
export interface Disbursement {
  readonly id: string;
  readonly propertyId: string;
  readonly tenantId: string;
  readonly amount: number;
  readonly status: DisbursementStatus;
  readonly scheduledDate: Date;
  readonly processedDate?: Date;
  readonly realpayTransactionId?: string;
  readonly createdAt: Date;
}

export type DisbursementStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

// Review and Rating Types
export interface Review {
  readonly id: string;
  readonly orderId: string;
  readonly propertyId: string;
  readonly customerId: string;
  readonly ratings: ReviewRatings;
  readonly comment?: string;
  readonly response?: string;
  readonly status: ReviewStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ReviewRatings {
  readonly service: number;
  readonly cleanliness: number;
  readonly value: number;
  readonly location: number;
  readonly amenities: number;
  readonly overall: number;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

// Inventory Management Types
export interface InventoryItem {
  readonly id: string;
  readonly propertyId: string;
  readonly name: string;
  readonly category: string;
  readonly currentStock: number;
  readonly minStock: number;
  readonly maxStock: number;
  readonly unitPrice: number;
  readonly supplierId?: string;
  readonly lastRestocked?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface MenuItem {
  readonly id: string;
  readonly propertyId: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: string;
  readonly isAvailable: boolean;
  readonly inventoryItems: string[];
  readonly imageUrl?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly message?: string;
  readonly timestamp: Date;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
    readonly hasNext: boolean;
    readonly hasPrev: boolean;
  };
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface DashboardStats {
  readonly totalOrders: number;
  readonly totalRevenue: number;
  readonly pendingOrders: number;
  readonly averageRating: number;
  readonly totalReviews: number;
  readonly nextDisbursement?: Date;
  readonly disbursementStatus: DisbursementStatus;
}

export interface PropertyDashboardStats extends DashboardStats {
  readonly propertyId: string;
  readonly propertyName: string;
  readonly todayRevenue: number;
  readonly monthlyRevenue: number;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface OrderFormData {
  readonly customerName: string;
  readonly customerEmail: string;
  readonly customerPhone: string;
  readonly orderType: OrderType;
  readonly deliveryAddress?: string;
  readonly specialRequests?: string;
  readonly paymentMethod: PaymentMethod;
}

export interface PropertyFormData {
  readonly name: string;
  readonly type: PropertyType;
  readonly location: string;
  readonly description?: string;
  readonly address: string;
  readonly phone?: string;
  readonly email?: string;
  readonly website?: string;
}

export interface UserFormData {
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly tenantId?: string;
}

// ============================================================================
// FILTER AND SEARCH TYPES
// ============================================================================

export interface OrderFilters {
  readonly search?: string;
  readonly status?: OrderStatus;
  readonly paymentStatus?: PaymentStatus;
  readonly dateRange?: {
    readonly start: Date;
    readonly end: Date;
  };
  readonly sortBy?: 'created_at' | 'amount' | 'customer_name';
  readonly sortOrder?: 'asc' | 'desc';
}

export interface PropertyFilters {
  readonly search?: string;
  readonly type?: PropertyType;
  readonly status?: PropertyStatus;
  readonly sortBy?: 'name' | 'created_at' | 'revenue' | 'rating';
  readonly sortOrder?: 'asc' | 'desc';
}

export interface UserFilters {
  readonly search?: string;
  readonly role?: UserRole;
  readonly status?: UserStatus;
  readonly sortBy?: 'name' | 'email' | 'created_at' | 'last_login';
  readonly sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface BaseComponentProps {
  readonly className?: string;
  readonly children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  readonly variant?: 'primary' | 'secondary' | 'ghost' | 'luxury';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly onClick?: () => void;
  readonly type?: 'button' | 'submit' | 'reset';
}

export interface CardProps extends BaseComponentProps {
  readonly variant?: 'default' | 'luxury';
  readonly title?: string;
  readonly subtitle?: string;
  readonly actions?: React.ReactNode;
}

export interface TableProps<T = unknown> extends BaseComponentProps {
  readonly data: T[];
  readonly columns: TableColumn<T>[];
  readonly loading?: boolean;
  readonly emptyMessage?: string;
  readonly onRowClick?: (row: T) => void;
}

export interface TableColumn<T = unknown> {
  readonly key: keyof T | string;
  readonly title: string;
  readonly render?: (value: unknown, row: T) => React.ReactNode;
  readonly sortable?: boolean;
  readonly width?: string;
}

// ============================================================================
// HOOK TYPES
// ============================================================================

export interface UseApiState<T = unknown> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly refetch: () => Promise<void>;
}

export interface UsePaginationState {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasNext: boolean;
  readonly hasPrev: boolean;
  readonly setPage: (page: number) => void;
  readonly setLimit: (limit: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
}

export interface UseFiltersState<T = unknown> {
  readonly filters: T;
  readonly setFilters: (filters: Partial<T>) => void;
  readonly clearFilters: () => void;
  readonly hasActiveFilters: boolean;
}

// ============================================================================
// CONTEXT TYPES
// ============================================================================

export interface AuthContextType {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly login: (email: string, password: string) => Promise<void>;
  readonly logout: () => void;
  readonly hasPermission: (permission: string) => boolean;
  readonly hasRole: (role: UserRole) => boolean;
}

export interface TenantContextType {
  readonly currentTenant: TenantHierarchy | null;
  readonly setTenant: (tenant: TenantHierarchy) => void;
  readonly isAuthorized: (action: string, resource: string) => boolean;
  readonly permissions: readonly string[];
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  readonly [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ============================================================================
// BRAND INTEGRATION TYPES
// ============================================================================

export interface BrandedComponentProps extends BaseComponentProps {
  readonly emotionalState?: EmotionalState;
  readonly brandColor?: BrandColor;
  readonly brandFont?: BrandFont;
  readonly variant?: string;
}

export interface HospitalityComponentProps extends BrandedComponentProps {
  readonly propertyType?: PropertyType;
  readonly serviceType?: string;
  readonly isLuxury?: boolean;
  readonly isWarm?: boolean;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export const isOrder = (obj: unknown): obj is Order =>
  typeof obj === 'object' && obj !== null && 'orderNumber' in obj;

export const isProperty = (obj: unknown): obj is Property =>
  typeof obj === 'object' && obj !== null && 'name' in obj && 'type' in obj;

export const isUser = (obj: unknown): obj is User =>
  typeof obj === 'object' && obj !== null && 'email' in obj && 'role' in obj;

export const isApiResponse = <T>(obj: unknown): obj is ApiResponse<T> =>
  typeof obj === 'object' &&
  obj !== null &&
  'success' in obj &&
  'timestamp' in obj;

// ============================================================================
// CONSTANTS
// ============================================================================

export const ORDER_STATUSES: readonly OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'completed',
  'cancelled',
] as const;

export const PAYMENT_STATUSES: readonly PaymentStatus[] = [
  'pending',
  'paid',
  'failed',
  'refunded',
] as const;

export const PROPERTY_TYPES: readonly PropertyType[] = [
  'hotel',
  'restaurant',
  'cafe',
  'bar',
  'spa',
  'conference_center',
] as const;

export const USER_ROLES: readonly UserRole[] = [
  'admin',
  'manager',
  'staff',
  'guest',
  'platform_admin',
  'property_owner',
  'customer',
] as const;

export const ACTIVITY_TYPES: readonly ActivityType[] = [
  'order',
  'property',
  'user',
  'payment',
  'system',
] as const;

export const ACTIVITY_SEVERITIES: readonly ActivitySeverity[] = [
  'success',
  'info',
  'warning',
  'error',
] as const;
