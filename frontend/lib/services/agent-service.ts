/**
 * AI Agent Service for Buffr Host Hospitality Platform
 * @fileoverview Comprehensive AI agent service with memory management, personality adaptation, and tool integration for hospitality operations
 * @location buffr-host/frontend/lib/services/agent-service.ts
 * @purpose Manages AI agents with persistent memory, personality adaptation, and external tool integration for hotel and restaurant operations
 * @modularity NOW USING MODULAR ARCHITECTURE - Core, Memory, Personality, and Tool modules
 * @database_connections Reads/writes to `agent_memories`, `agent_personalities`, `tool_executions`, `conversation_logs`, `property_operations` tables
 * @api_integration DeepSeek LLM API, Arcade AI tools, SendGrid email, and external service integrations
 * @scalability Multi-tenant AI agent management with distributed memory and personality systems
 * @performance Optimized AI operations with caching, parallel processing, and memory management
 * @monitoring Comprehensive AI analytics, conversation tracking, and performance metrics
 *
 * AI Agent Capabilities:
 * - Persistent memory management with Mem0 integration
 * - Dynamic personality adaptation and emotional intelligence
 * - Multi-modal communication (email, chat, voice)
 * - Tool integration for hospitality automation (bookings, calendar, email)
 * - Real-time conversation processing and context awareness
 * - Multi-tenant data isolation and security
 * - Learning and adaptation from guest interactions
 * - Automated workflow execution and task management
 *
 * MODULAR ARCHITECTURE (v2.0.0):
 * - BuffrAgentCore: Main conversation orchestration
 * - MemoryManager: Persistent memory operations
 * - PersonalityEngine: Dynamic personality adaptation
 * - ToolExecutor: Hospitality tool execution
 *
 * Migration Notes:
 * - Original monolithic service moved to agent/BuffrAgentService.ts
 * - This file now serves as a compatibility layer
 * - New implementations should use agent/ modules directly
 */

import { BuffrAgentService as ModularAgentService } from './agent/BuffrAgentService';
import {
  EmailTemplateGenerationRequest,
  MarketingCampaign,
  PersonalizedEmailContent,
} from '../validation/sofia-email-schemas';

/**
 * Production-ready AI Agent Service with comprehensive hospitality automation
 * @class BuffrAgentService
 * @purpose Orchestrates AI agents with memory, personality, and tool integration for hospitality operations
 * @modularity NOW USING MODULAR ARCHITECTURE with Core, Memory, Personality, and Tool modules
 * @ai_integration DeepSeek LLM with Mem0 memory and Arcade AI tools for comprehensive automation
 * @multi_tenant Automatic tenant isolation for agent memories, personalities, and tool executions
 * @learning Expectation-Maximization algorithm for personality adaptation and continuous learning
 * @performance Optimized AI operations with caching, parallel processing, and memory management
 * @monitoring Comprehensive AI analytics, conversation tracking, and performance optimization
 * @hospitality Specialized for hotel and restaurant operations with domain-specific tools and knowledge
 *
 * MIGRATION STATUS: This class now wraps the modular BuffrAgentService implementation.
 * For new code, consider using the modular components directly:
 * - import { BuffrAgentCore } from './agent/core/AgentCore'
 * - import { MemoryManager } from './agent/memory/MemoryManager'
 * - import { PersonalityEngine } from './agent/personality/PersonalityEngine'
 * - import { ToolExecutor } from './agent/tools/ToolExecutor'
 */
export class BuffrAgentService {
  private modularService: ModularAgentService;

  constructor(tenantId: string, userId: string, propertyId?: number) {
    this.modularService = new ModularAgentService(tenantId, userId, propertyId);
  }

  /**
   * Main chat method - delegates to modular service
   */
  async chat(message: string, context?: unknown) {
    return await this.modularService.chat(message, context);
  }

  /**
   * Get conversation history - delegates to modular service
   */
  async getConversationHistory() {
    return await this.modularService.getConversationHistory();
  }

  /**
   * Clear conversation history - delegates to modular service
   */
  async clearConversationHistory() {
    return await this.modularService.clearConversationHistory();
  }

  /**
   * Get memory statistics - delegates to modular service
   */
  async getMemoryStats() {
    return await this.modularService.getMemoryStats();
  }

  /**
   * Search memories - delegates to modular service
   */
  async searchMemories(query: string, limit: number = 5) {
    return await this.modularService.searchMemories(query, limit);
  }

  /**
   * Update memory - delegates to modular service
   */
  async updateMemory(memoryId: string, newContent: string) {
    return await this.modularService.updateMemory(memoryId, newContent);
  }

  /**
   * Delete memory - delegates to modular service
   */
  async deleteMemory(memoryId: string) {
    return await this.modularService.deleteMemory(memoryId);
  }

  /**
   * Get available tools - delegates to modular service
   */
  getAvailableTools() {
    return this.modularService.getAvailableTools();
  }

  /**
   * Get agent health status - delegates to modular service
   */
  async getHealthStatus() {
    return await this.modularService.getHealthStatus();
  }
}

/**
 * Global agent instance for singleton pattern (legacy support)
 */
let globalAgent: BuffrAgentService | null = null;

/**
 * Factory function to create a Buffr Agent instance
 * @param tenantId - Tenant ID for multi-tenant isolation
 * @param userId - User ID for personalization
 * @param propertyId - Optional property ID for property-specific agents
 * @returns BuffrAgentService instance
 */
export function createBuffrAgent(
  tenantId: string,
  userId: string,
  propertyId?: number
): BuffrAgentService {
  return new BuffrAgentService(tenantId, userId, propertyId);
}

/**
 * Get or create global agent instance (singleton pattern)
 * @param tenantId - Tenant ID for multi-tenant isolation
 * @param userId - User ID for personalization
 * @param propertyId - Optional property ID for property-specific agents
 * @returns Global BuffrAgentService instance
 */
export function getGlobalBuffrAgent(
  tenantId?: string,
  userId?: string,
  propertyId?: number
): BuffrAgentService {
  if (!globalAgent && tenantId && userId) {
    globalAgent = createBuffrAgent(tenantId, userId, propertyId);
  }
  return globalAgent!;
}
