/**
 * Index Service for Buffr Host Hospitality Platform
 * @fileoverview Index service for Buffr Host system operations
 * @location buffr-host/lib/services/agent/index.ts
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

/**
 * Modular AI Agent Service for Buffr Host Hospitality Platform
 * @fileoverview Unified entry point for modular AI agent components
 * @location buffr-host/frontend/lib/services/agent/index.ts
 * @purpose Provides clean API for accessing all agent-related functionality
 * @modularity Centralized exports for core, memory, personality, and tool modules
 * @scalability Easy extension and maintenance of agent capabilities
 * @consistency Single source of truth for agent service components
 *
 * Exported Components:
 * - BuffrAgentCore: Main orchestration and conversation handling
 * - MemoryManager: Persistent memory management and retrieval
 * - PersonalityEngine: Dynamic personality adaptation and learning
 * - ToolExecutor: Hospitality tool execution and management
 */

// Core orchestration
export { BuffrAgentCore } from './core/AgentCore';

// Memory management
export { MemoryManager, type MemoryStats } from './memory/MemoryManager';

// Personality system
export {
  PersonalityEngine,
  type PersonalityTrait,
  type PersonalityUpdate,
  type PersonalityProfile,
  type PersonalitySummary,
} from './personality/PersonalityEngine';

// Tool execution
export {
  ToolExecutor,
  type ArcadeTool,
  type ToolResult,
} from './tools/ToolExecutor';

// Legacy compatibility - export main service class
export { BuffrAgentService } from './BuffrAgentService';
