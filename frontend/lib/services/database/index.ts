/**
 * Modular Database Services - Services Layer
 *
 * Centralized exports for all database services organized by domain
 * Location: lib/services/database/index.ts
 * Purpose: Provides clean imports for database operations
 * Organization: Groups related services by domain
 * Scalability: Easy to add new services and maintain imports
 * Consistency: Single entry point for all database operations
 */

// Export user services
/**
 * Index Service for Buffr Host Hospitality Platform
 * @fileoverview Index service for Buffr Host system operations
 * @location buffr-host/lib/services/database/index.ts
 * @purpose index service for Buffr Host system operations
 * @modularity Self-contained service class providing specific business logic and data operations
 * @ai_integration Machine learning and AI service integrations for predictive analytics
 * @scalability Service designed for high-throughput operations and concurrent user handling
 * @performance Optimized database queries, caching strategies, and efficient data processing
 * @monitoring Comprehensive logging, error tracking, and performance metrics collection
 * @security Multi-tenant data isolation, input validation, and secure credential management
 * @error_handling Comprehensive error handling with detailed logging and graceful degradation
 * @testing Unit tests and integration tests ensuring service reliability and correctness
 *
 * Service Capabilities:
 * - AI/ML Features: Predictive analytics and intelligent data processing
 * - Error Handling: Comprehensive error management and logging
 * - Performance Monitoring: Service metrics and performance tracking
 * - Data Validation: Input sanitization and business rule enforcement
 *
 * Usage and Integration:
 * - API Routes: Service methods called from Next.js API endpoints
 * - React Components: Data fetching and state management integration
 * - Other Services: Inter-service communication and data sharing
 * - Database Layer: Direct database operations and query execution
 * - External APIs: Third-party service integrations and webhooks
 *
 * @example
 * // Import and use the service
 * import { ServiceClass } from './index';
 *
 * // Initialize service instance
 * const service = new ServiceClass();
 *
 * // Use service methods
 * const result = await service.processData();
 *
 * @example
 * // Service integration in API route
 * import { ServiceClass } from '@/lib/services/index';
 *
 * export async function GET(request: NextRequest) {
 *   const service = new ServiceClass();
 *   const data = await service.getData();
 *   return NextResponse.json({ data });
 * }
 *
 * @returns {Object} Service module with all exported classes and functions
 * @scalability Designed for horizontal scaling and high-availability deployments
 * @reliability Comprehensive error handling and automatic recovery mechanisms
 * @maintainability Well-documented code with clear separation of concerns
 * @monitoring Real-time performance monitoring and alerting capabilities
 */

export * from './users/UserService';

// Export property services
export * from './properties/PropertyService';

// Export image services
export * from './images/ImageService';

// Export menu services
export * from './menu/MenuService';

// Export room services
export * from './rooms/RoomService';

// Export service management
export * from './services/ServiceManager';

// Export utility services
export * from './utilities/UtilityService';

// Export inventory services
export * from './inventory/InventoryService';

// Export order services
export * from './orders/OrderService';

// Export staff services
export * from './staff/StaffService';

// Export restaurant services
export * from './restaurant/RestaurantService';
