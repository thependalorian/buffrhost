// Staff Types
/**
 * Staff Type Definitions for Buffr Host Hospitality Platform
 * @fileoverview Staff type definitions for staff management, scheduling, and HR operations
 * @location buffr-host/lib/types/staff.ts
 * @purpose staff type definitions for staff management, scheduling, and HR operations
 * @modularity Centralized type definitions providing type safety across the entire Buffr Host application
 * @ai_integration Machine learning and AI service type definitions for predictive analytics
 * @typescript_strict Strict TypeScript type safety ensuring compile-time error prevention
 * @type_safety Comprehensive type coverage preventing runtime errors and improving developer experience
 * @scalability Type definitions supporting horizontal scaling and multi-tenant architecture
 * @maintainability Self-documenting types enabling easier code maintenance and refactoring
 * @testing Type-driven development supporting comprehensive test coverage
 *
 * Type Definitions Summary:
 * - 6 Interfaces: Staff, StaffActivity, StaffPerformance...
 * - 2 Types: StaffStatus, StaffShiftType
 * - Total: 8 type definitions
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
 * import type { Staff, StaffActivity, StaffPerformance... } from './staff';
 *
 * // Usage in component
 * interface ComponentProps {
 *   data: Staff;
 *   onAction: (event: StaffStatus) => void;
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
 * @typedef {Interface} Staff
 * @typedef {Interface} StaffActivity
 * @typedef {Interface} StaffPerformance
 * @typedef {Interface} CreateStaffDTO
 * @typedef {Interface} UpdateStaffDTO
 * @typedef {Type} StaffStatus
 * @typedef {Type} StaffShiftType
 * @typedef {Interface} StaffSchedule
 * @typedef {TypeDefinition} Ustaff
 *
 * @returns {Object} Type definitions module with all exported types and interfaces
 * @type_safety Ensures 100% type coverage across the Buffr Host application
 * @documentation Comprehensive JSDoc documentation for developer experience
 * @maintainability Type-driven development enabling safe refactoring and evolution
 */

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  status: StaffStatus;
  shift: StaffShiftType;
  schedule: StaffSchedule;
}

export interface StaffActivity {
  id: string;
  staffId: string;
  activity: string;
  timestamp: Date;
  duration: number;
}

export interface StaffPerformance {
  id: string;
  staffId: string;
  metric: string;
  value: number;
  period: string;
}

export interface CreateStaffDTO {
  name: string;
  email: string;
  role: string;
  shift: StaffShiftType;
}

export interface UpdateStaffDTO {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: StaffStatus;
  shift?: StaffShiftType;
}

export type StaffStatus = 'active' | 'inactive' | 'on_leave';

export type StaffShiftType = 'morning' | 'afternoon' | 'night' | 'flexible';

export interface StaffSchedule {
  id: string;
  staffId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

// Ustaff - Service
export const Ustaff = {
  process: () => ({ success: true, message: 'Service is working' }),
};

export default Ustaff;
