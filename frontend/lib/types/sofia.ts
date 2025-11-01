// Sofia AI Agent Types
/**
 * Sofia Type Definitions for Buffr Host Hospitality Platform
 * @fileoverview Sofia type definitions for AI assistant and conversational AI systems
 * @location buffr-host/lib/types/sofia.ts
 * @purpose sofia type definitions for AI assistant and conversational AI systems
 * @modularity Centralized type definitions providing type safety across the entire Buffr Host application
 * @authentication User authentication and session management type definitions
 * @typescript_strict Strict TypeScript type safety ensuring compile-time error prevention
 * @type_safety Comprehensive type coverage preventing runtime errors and improving developer experience
 * @scalability Type definitions supporting horizontal scaling and multi-tenant architecture
 * @maintainability Self-documenting types enabling easier code maintenance and refactoring
 * @testing Type-driven development supporting comprehensive test coverage
 *
 * Type Definitions Summary:
 * - 7 Interfaces: SofiaAgent, SofiaConversation, SofiaMessage...
 * - Total: 7 type definitions
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
 * import type { SofiaAgent, SofiaConversation, SofiaMessage... } from './sofia';
 *
 * // Usage in component
 * interface ComponentProps {
 *   data: SofiaAgent;
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
 * @typedef {Interface} SofiaAgent
 * @typedef {Interface} SofiaConversation
 * @typedef {Interface} SofiaMessage
 * @typedef {Interface} SofiaMemory
 * @typedef {Interface} SofiaCapabilities
 * @typedef {Interface} CreateSofiaAgentDTO
 * @typedef {Interface} SendSofiaMessageDTO
 *
 * @returns {Object} Type definitions module with all exported types and interfaces
 * @type_safety Ensures 100% type coverage across the Buffr Host application
 * @documentation Comprehensive JSDoc documentation for developer experience
 * @maintainability Type-driven development enabling safe refactoring and evolution
 */

export interface SofiaAgent {
  id: string;
  name: string;
  capabilities: SofiaCapabilities;
  memory: SofiaMemory;
  status: 'active' | 'inactive' | 'learning';
  createdAt: Date;
  updatedAt: Date;
}

export interface SofiaConversation {
  id: string;
  agentId: string;
  userId: string;
  messages: SofiaMessage[];
  context: Record<string, any>;
  startedAt: Date;
  endedAt?: Date;
  status: 'active' | 'completed' | 'interrupted';
}

export interface SofiaMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface SofiaMemory {
  shortTerm: SofiaMessage[];
  longTerm: Record<string, any>[];
  preferences: Record<string, any>;
  contextWindow: number;
  lastUpdated: Date;
}

export interface SofiaCapabilities {
  hospitality: boolean;
  booking: boolean;
  customerService: boolean;
  analytics: boolean;
  recommendations: boolean;
  naturalLanguage: boolean;
  multiLanguage: string[];
  integrations: string[];
}

export interface CreateSofiaAgentDTO {
  name: string;
  capabilities: SofiaCapabilities;
  initialMemory?: Partial<SofiaMemory>;
}

export interface SendSofiaMessageDTO {
  conversationId?: string;
  message: string;
  context?: Record<string, any>;
  userId: string;
}
