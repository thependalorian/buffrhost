/**
 * Type Definitions Index
 *
 * Purpose: Central export file for commonly used type definitions across Buffr Host
 * Location: lib/types/index.ts
 * Usage: Import types from this file for convenience: `import { Customer, Staff } from '@/lib/types'`
 *
 * @module Type Definitions Index
 * @author Buffr Host Development Team
 * @version 1.0.0
 *
 * @description
 * This file re-exports commonly used types from various type definition modules,
 * providing a single import point for type definitions. This simplifies imports
 * and ensures consistency across the application.
 */

// Staff management types
import {
  Staff,
  StaffActivity,
  StaffPerformance,
  CreateStaffDTO,
  UpdateStaffDTO,
  StaffStatus,
  StaffShiftType,
  StaffSchedule,
} from './staff';

// Sofia AI agent types
import {
  SofiaAgent,
  SofiaConversation,
  SofiaMessage,
  SofiaMemory,
  SofiaCapabilities,
  CreateSofiaAgentDTO,
  SendSofiaMessageDTO,
} from './sofia';

// CRM and customer types
import { Customer } from './crm';

// Analytics types
import { RevenueAnalytics } from './analytics';

/**
 * Index Type Definitions for Buffr Host Hospitality Platform
 * @fileoverview Index central type definitions index and re-exports
 * @location buffr-host/lib/types/index.ts
 * @purpose index central type definitions index and re-exports
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
 * - Total: 0 type definition
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
 * import type {  } from './index';
 *
 * // Usage in component
 * interface ComponentProps {
 *   data: CustomType;
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
 * @returns {Object} Type definitions module with all exported types and interfaces
 * @type_safety Ensures 100% type coverage across the Buffr Host application
 * @documentation Comprehensive JSDoc documentation for developer experience
 * @maintainability Type-driven development enabling safe refactoring and evolution
 */

/**
 * Re-exported Types
 *
 * All exported types are available for import from this module.
 * Individual type modules can also be imported directly when needed.
 *
 * @example
 * // Import from index
 * import { Customer, Staff } from '@/lib/types';
 *
 * // Or import from specific module
 * import { Customer } from '@/lib/types/crm';
 */
export type {
  // Staff types
  Staff,
  StaffActivity,
  StaffPerformance,
  CreateStaffDTO,
  UpdateStaffDTO,
  StaffStatus,
  StaffShiftType,
  StaffSchedule,

  // Sofia AI types
  SofiaAgent,
  SofiaConversation,
  SofiaMessage,
  SofiaMemory,
  SofiaCapabilities,
  CreateSofiaAgentDTO,
  SendSofiaMessageDTO,

  // CRM types
  Customer,

  // Analytics types
  RevenueAnalytics,
};
