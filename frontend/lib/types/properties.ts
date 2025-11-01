/**
 * Property Type Definitions for Buffr Host
 *
 * Purpose: Comprehensive type definitions for properties (hotels, restaurants, cafes, etc.),
 * including property details, images, features, and type-specific configurations
 * Location: lib/types/properties.ts
 * Usage: Shared across property management, property listing, property detail pages, and property APIs
 *
 * @module Property Types
 * @author Buffr Host Development Team
 * @version 1.0.0
 * @see {@link ./database.ts} for database-aligned Property interface
 */

/**
 * Property Interface
 *
 * Extended property interface with comprehensive property information, including Buffr ID
 * for cross-project integration, images, and type-specific details.
 *
 * @interface Property
 * @property {string} id - Unique property identifier (UUID)
 * @property {string} [buffrId] - Unified Buffr ID for cross-project integration (optional)
 * @property {string} name - Property name
 * @property {PropertyType} type - Type of property (hotel, restaurant, cafe, etc.)
 * @property {string} location - Property location description
 * @property {string} ownerId - ID of the property owner
 * @property {string} tenantId - Tenant ID for multi-tenant isolation (required)
 * @property {PropertyStatus} status - Current status of the property
 * @property {string} [description] - Property description
 * @property {string} address - Physical address of the property
 * @property {string} [phone] - Contact phone number
 * @property {string} [email] - Contact email address
 * @property {string} [website] - Property website URL
 * @property {number | string} rating - Average customer rating (can be string from database)
 * @property {number} totalOrders - Total number of orders processed
 * @property {number} totalRevenue - Total revenue generated
 * @property {Date} createdAt - Timestamp when property was created
 * @property {Date} updatedAt - Timestamp when property was last updated
 * @property {PropertyImage[]} [images] - Array of property images
 * @property {HotelDetails} [hotelDetails] - Hotel-specific details (if type is 'hotel')
 * @property {RestaurantDetails} [restaurantDetails] - Restaurant-specific details (if type is 'restaurant')
 *
 * @example
 * const property: Property = {
 *   id: 'prop_123',
 *   buffrId: 'BFR-PROP-HOST-NA-abc123-20240120',
 *   name: 'Luxury Beach Resort',
 *   type: 'hotel',
 *   location: 'Swakopmund, Namibia',
 *   ownerId: 'owner_456',
 *   tenantId: 'tenant_abc',
 *   status: 'active',
 *   address: '123 Beach Road',
 *   rating: 4.8,
 *   totalOrders: 1250,
 *   totalRevenue: 500000,
 *   hotelDetails: { starRating: 5, totalRooms: 120 }
 * };
 */
// Base Property Interface (matches database properties table)
/**
 * Properties Type Definitions for Buffr Host Hospitality Platform
 * @fileoverview Properties type definitions for property management and real estate operations
 * @location buffr-host/lib/types/properties.ts
 * @purpose properties type definitions for property management and real estate operations
 * @modularity Centralized type definitions providing type safety across the entire Buffr Host application
 * @database_connections Maps directly to PostgreSQL tables: database
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
 * - 19 Interfaces: Property, PropertyImage, PropertyFeature...
 * - 2 Types: PropertyType, PropertyStatus
 * - Total: 21 type definitions
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
 * import type { Property, PropertyType, PropertyStatus... } from './properties';
 *
 * // Usage in component
 * interface ComponentProps {
 *   data: Property;
 *   onAction: (event: PropertyType) => void;
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
 * @typedef {Interface} Property
 * @typedef {Type} PropertyType
 * @typedef {Type} PropertyStatus
 * @typedef {Interface} PropertyImage
 * @typedef {Interface} PropertyFeature
 * @typedef {Interface} RestaurantDetails
 * @typedef {Interface} HotelDetails
 * @typedef {Interface} RoomType
 * @typedef {Interface} MenuItem
 * @typedef {Interface} PropertyReview
 * ... and 17 more type definitions
 *
 * @returns {Object} Type definitions module with all exported types and interfaces
 * @type_safety Ensures 100% type coverage across the Buffr Host application
 * @documentation Comprehensive JSDoc documentation for developer experience
 * @maintainability Type-driven development enabling safe refactoring and evolution
 */

export interface Property {
  readonly id: string;
  readonly buffrId?: string; // Unified Buffr ID for cross-project integration
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
  readonly rating: number | string; // Can be string from database
  readonly totalOrders: number;
  readonly totalRevenue: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly images?: PropertyImage[];
  readonly hotelDetails?: HotelDetails;
  readonly restaurantDetails?: RestaurantDetails;
}

/**
 * Property Type
 *
 * Defines the different types of properties supported in Buffr Host.
 *
 * @typedef PropertyType
 * @type {'hotel' | 'restaurant' | 'cafe' | 'bar' | 'spa' | 'conference_center'}
 */
export type PropertyType =
  | 'hotel'
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'spa'
  | 'conference_center';

/**
 * Property Status
 *
 * Defines the current status of a property.
 *
 * @typedef PropertyStatus
 * @type {'active' | 'pending' | 'suspended' | 'inactive'}
 */
export type PropertyStatus = 'active' | 'pending' | 'suspended' | 'inactive';

/**
 * Property Image Interface
 *
 * Represents an image associated with a property.
 *
 * @interface PropertyImage
 * @property {string} id - Unique image identifier
 * @property {string} propertyId - ID of the property this image belongs to
 * @property {string} imageUrl - URL to the image file
 * @property {'main' | 'gallery' | 'menu' | 'amenity'} imageType - Type/category of the image
 * @property {string} [altText] - Alt text for accessibility
 * @property {number} sortOrder - Display order for sorting images
 * @property {boolean} isActive - Whether image is currently active/visible
 * @property {Date} createdAt - Timestamp when image was uploaded
 */
// Property Images
export interface PropertyImage {
  readonly id: string;
  readonly propertyId: string;
  readonly imageUrl: string;
  readonly imageType: 'main' | 'gallery' | 'menu' | 'amenity';
  readonly altText?: string;
  readonly sortOrder: number;
  readonly isActive: boolean;
  readonly createdAt: Date;
}

/**
 * Property Feature Interface
 *
 * Represents a feature, amenity, service, or specialty of a property.
 *
 * @interface PropertyFeature
 * @property {string} id - Unique feature identifier
 * @property {string} propertyId - ID of the property this feature belongs to
 * @property {string} featureName - Name of the feature
 * @property {'amenity' | 'service' | 'cuisine' | 'specialty'} featureType - Type of feature
 * @property {string} [description] - Feature description
 * @property {boolean} isActive - Whether feature is currently active
 * @property {Date} createdAt - Timestamp when feature was created
 */
// Property Features/Amenities
export interface PropertyFeature {
  readonly id: string;
  readonly propertyId: string;
  readonly featureName: string;
  readonly featureType: 'amenity' | 'service' | 'cuisine' | 'specialty';
  readonly description?: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
}

/**
 * Restaurant Details Interface
 *
 * Contains restaurant-specific configuration and information.
 *
 * @interface RestaurantDetails
 * @property {string} id - Unique restaurant details identifier
 * @property {string} propertyId - ID of the property
 * @property {string} cuisineType - Type of cuisine (e.g., 'Namibian', 'Seafood', 'Italian')
 * @property {'$' | '$$' | '$$$' | '$$$$'} priceRange - Price range indicator
 * @property {OpeningHours} openingHours - Operating hours for each day of the week
 * @property {boolean} deliveryAvailable - Whether delivery service is available
 * @property {boolean} takeawayAvailable - Whether takeaway service is available
 * @property {boolean} dineInAvailable - Whether dine-in service is available
 * @property {number} [maxCapacity] - Maximum seating capacity
 * @property {number} [averagePrepTime] - Average food preparation time in minutes
 * @property {string[]} specialDietaryOptions - Available dietary options (vegan, gluten-free, etc.)
 * @property {string[]} paymentMethods - Accepted payment methods
 * @property {Date} createdAt - Timestamp when details were created
 * @property {Date} updatedAt - Timestamp when details were last updated
 */
// Restaurant-specific details
export interface RestaurantDetails {
  readonly id: string;
  readonly propertyId: string;
  readonly cuisineType: string;
  readonly priceRange: '$' | '$$' | '$$$' | '$$$$';
  readonly openingHours: OpeningHours;
  readonly deliveryAvailable: boolean;
  readonly takeawayAvailable: boolean;
  readonly dineInAvailable: boolean;
  readonly maxCapacity?: number;
  readonly averagePrepTime?: number; // in minutes
  readonly specialDietaryOptions: string[];
  readonly paymentMethods: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Hotel Details Interface
 *
 * Contains hotel-specific configuration and information.
 *
 * @interface HotelDetails
 * @property {string} id - Unique hotel details identifier
 * @property {string} propertyId - ID of the property
 * @property {number} [starRating] - Hotel star rating (1-5 stars)
 * @property {string} checkInTime - Standard check-in time (HH:MM format)
 * @property {string} checkOutTime - Standard check-out time (HH:MM format)
 * @property {number} totalRooms - Total number of rooms in the hotel
 * @property {number} availableRooms - Number of currently available rooms
 * @property {RoomTypeInfo[]} roomTypes - Array of room type information
 * @property {string[]} amenities - List of hotel amenities (wifi, pool, gym, etc.)
 * @property {HotelPolicies} policies - Hotel policies (cancellation, pets, smoking)
 * @property {Date} createdAt - Timestamp when details were created
 * @property {Date} updatedAt - Timestamp when details were last updated
 */
// Hotel-specific details
export interface HotelDetails {
  readonly id: string;
  readonly propertyId: string;
  readonly starRating?: number; // 1-5 stars
  readonly checkInTime: string; // HH:MM format
  readonly checkOutTime: string; // HH:MM format
  readonly totalRooms: number;
  readonly availableRooms: number;
  readonly roomTypes: RoomTypeInfo[];
  readonly amenities: string[];
  readonly policies: HotelPolicies;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Room Types for hotels
export interface RoomType {
  readonly id: string;
  readonly hotelId: string;
  readonly typeName: string;
  readonly description?: string;
  readonly maxOccupancy: number;
  readonly basePrice: number;
  readonly sizeSqm?: number;
  readonly bedType?: 'single' | 'double' | 'queen' | 'king' | 'twin';
  readonly amenities: string[];
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Menu Items for restaurants
export interface MenuItem {
  readonly id: string;
  readonly restaurantId: string;
  readonly name: string;
  readonly description?: string;
  readonly price: number;
  readonly category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  readonly dietaryInfo: string[];
  readonly allergens: string[];
  readonly preparationTime?: number; // in minutes
  readonly isAvailable: boolean;
  readonly isFeatured: boolean;
  readonly imageUrl?: string;
  readonly sortOrder: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Property Reviews
export interface PropertyReview {
  readonly id: string;
  readonly propertyId: string;
  readonly customerId: string;
  readonly customerName: string;
  readonly customerEmail?: string;
  readonly rating: number; // 1-5
  readonly reviewText?: string;
  readonly serviceRating?: number;
  readonly cleanlinessRating?: number;
  readonly valueRating?: number;
  readonly locationRating?: number;
  readonly amenitiesRating?: number;
  readonly isVerified: boolean;
  readonly isPublic: boolean;
  readonly responseText?: string;
  readonly responseDate?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Supporting types
export interface OpeningHours {
  readonly monday: DayHours;
  readonly tuesday: DayHours;
  readonly wednesday: DayHours;
  readonly thursday: DayHours;
  readonly friday: DayHours;
  readonly saturday: DayHours;
  readonly sunday: DayHours;
}

export interface DayHours {
  readonly open: string; // HH:MM format
  readonly close: string; // HH:MM format
  readonly closed: boolean;
}

export interface RoomTypeInfo {
  readonly type: string;
  readonly count: number;
  readonly price: number;
}

export interface HotelPolicies {
  readonly cancellation: string;
  readonly pets: 'allowed' | 'not_allowed';
  readonly smoking: 'prohibited' | 'designated_areas' | 'allowed';
}

// Extended Property interfaces with related data
export interface PropertyWithDetails extends Property {
  readonly images: PropertyImage[];
  readonly features: PropertyFeature[];
  readonly reviews: PropertyReview[];
  readonly restaurantDetails?: RestaurantDetails;
  readonly hotelDetails?: HotelDetails;
  readonly menuItems?: MenuItem[];
  readonly roomTypes?: RoomType[];
}

export interface RestaurantProperty extends PropertyWithDetails {
  readonly restaurantDetails: RestaurantDetails;
  readonly menuItems: MenuItem[];
}

export interface HotelProperty extends PropertyWithDetails {
  readonly hotelDetails: HotelDetails;
  readonly roomTypes: RoomType[];
}

// API Response types
export interface PropertiesResponse {
  readonly success: boolean;
  readonly data: PropertyWithDetails[];
  readonly total: number;
  readonly page?: number;
  readonly limit?: number;
}

export interface PropertyResponse {
  readonly success: boolean;
  readonly data: PropertyWithDetails;
}

// Filter types
export interface PropertyFilters {
  readonly type?: PropertyType;
  readonly location?: string;
  readonly minRating?: number;
  readonly maxPrice?: number;
  readonly amenities?: string[];
  readonly cuisine?: string; // for restaurants
  readonly starRating?: number; // for hotels
  readonly status?: PropertyStatus;
}

// Search types
export interface PropertySearchParams {
  readonly query?: string;
  readonly filters?: PropertyFilters;
  readonly sortBy?: 'rating' | 'price' | 'name' | 'createdAt';
  readonly sortOrder?: 'asc' | 'desc';
  readonly page?: number;
  readonly limit?: number;
}

// Type guards
export function isRestaurantProperty(
  property: PropertyWithDetails
): property is RestaurantProperty {
  return (
    property.type === 'restaurant' && property.restaurantDetails !== undefined
  );
}

export function isHotelProperty(
  property: PropertyWithDetails
): property is HotelProperty {
  return property.type === 'hotel' && property.hotelDetails !== undefined;
}

export function isPropertyType(type: string): type is PropertyType {
  return [
    'hotel',
    'restaurant',
    'cafe',
    'bar',
    'spa',
    'conference_center',
  ].includes(type);
}

export function isPropertyStatus(status: string): status is PropertyStatus {
  return ['active', 'pending', 'suspended', 'inactive'].includes(status);
}

// Utility functions
export function getPropertyMainImage(
  property: PropertyWithDetails
): PropertyImage | undefined {
  return property.images.find(
    (img) => img.imageType === 'main' && img.isActive
  );
}

export function getPropertyGalleryImages(
  property: PropertyWithDetails
): PropertyImage[] {
  return property.images
    .filter((img) => img.imageType === 'gallery' && img.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPropertyFeaturesByType(
  property: PropertyWithDetails,
  type: PropertyFeature['featureType']
): PropertyFeature[] {
  return property.features.filter(
    (feature) => feature.featureType === type && feature.isActive
  );
}

export function getAverageReviewRating(reviews: PropertyReview[]): number {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

export function isPropertyOpen(property: PropertyWithDetails): boolean {
  if (!isRestaurantProperty(property)) return true; // Hotels are always "open"

  const now = new Date();
  const dayName = now
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase(); // monday, tuesday, etc.
  const dayHours =
    property.restaurantDetails.openingHours[dayName as keyof OpeningHours];

  if (dayHours.closed) return false;

  const currentTime = now.toTimeString().substring(0, 5); // HH:MM format
  return currentTime >= dayHours.open && currentTime <= dayHours.close;
}

// Constants
export const PROPERTY_TYPES: PropertyType[] = [
  'hotel',
  'restaurant',
  'cafe',
  'bar',
  'spa',
  'conference_center',
];
export const PROPERTY_STATUSES: PropertyStatus[] = [
  'active',
  'pending',
  'suspended',
  'inactive',
];
export const PRICE_RANGES = ['$', '$$', '$$$', '$$$$'] as const;
export const CUISINE_TYPES = [
  'Namibian',
  'Seafood',
  'International',
  'Kalahari',
  'African',
  'European',
  'Asian',
  'Mediterranean',
  'Italian',
  'French',
  'Indian',
  'Chinese',
  'Japanese',
] as const;
export const HOTEL_AMENITIES = [
  'wifi',
  'pool',
  'gym',
  'spa',
  'restaurant',
  'bar',
  'business_center',
  'conference_rooms',
  'beach_access',
  'safari_tours',
  'game_drives',
] as const;
export const RESTAURANT_AMENITIES = [
  'outdoor_seating',
  'live_music',
  'wine_selection',
  'private_dining',
  'delivery',
  'takeaway',
  'dine_in',
  'vegetarian_options',
] as const;
