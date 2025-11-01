/**
 * Modular Database Services
 *
 * Centralized exports for all database services
 * Location: lib/database/index.ts
 * Purpose: Provides clean imports for database operations
 * Organization: Groups related services by domain
 * Scalability: Easy to add new services and maintain imports
 * Consistency: Single entry point for all database operations
 */

// Export all types
export * from './types';

// Export property-related services
export * from './properties/PropertyOwnerService';
export { PropertyService } from './properties/PropertyService';

// Export image services
export * from './images/ImageService';

// Export room services (to be added)
export * from './rooms/RoomService';

// Export service management (to be added)
export * from './services/ServiceManager';

// Future exports for additional domains:
// export * from './menu/MenuService';
// export * from './amenities/AmenityService';
// export * from './bookings/BookingService';
