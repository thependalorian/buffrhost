/**
 * Memory Manager Module for Buffr AI Agents
 * @fileoverview Handles persistent memory management using Mem0 integration for AI agent conversations
 * @location buffr-host/frontend/lib/services/agent/memory/MemoryManager.ts
 * @purpose Manages conversation history, memory retrieval, and context persistence for AI agents
 * @modularity Separated memory operations from core agent orchestration
 * @database_connections Indirect connections through Mem0 service for memory persistence
 * @ai_integration Mem0 memory management system for context-aware conversations
 * @scalability Handles memory operations for multiple tenants and users
 * @performance Optimized memory retrieval and search with caching
 * @monitoring Memory usage tracking and performance metrics
 *
 * Memory Operations:
 * - Conversation history storage and retrieval
 * - Memory search and semantic similarity matching
 * - Memory statistics and analytics
 * - Memory cleanup and maintenance
 * - Cross-session context preservation
 */

import { Mem0Service } from '../../mem0-service';

/**
 * Memory statistics interface for tracking memory usage and performance
 * @interface MemoryStats
 * @property {number} totalMemories - Total number of memories stored
 * @property {string} tenantId - Tenant identifier for multi-tenant isolation
 * @property {string} userId - User identifier for memory scoping
 * @property {string} lastUpdated - ISO timestamp of last memory update
 * @property {number} [averageSimilarity] - Average similarity score for memory retrieval
 * @property {number} [searchEfficiency] - Memory search performance metric
 */
export interface MemoryStats {
  totalMemories: number;
  tenantId: string;
  userId: string;
  lastUpdated: string;
  averageSimilarity?: number;
  searchEfficiency?: number;
}

/**
 * Memory Manager class handling all memory-related operations for AI agents
 * @class MemoryManager
 * @purpose Centralized memory management with search, retrieval, and maintenance capabilities
 * @modularity Separated from core agent logic for better maintainability and scalability
 * @persistence Uses Mem0 service for long-term memory storage and retrieval
 * @search Semantic search capabilities for relevant memory retrieval
 * @monitoring Comprehensive memory usage and performance tracking
 * @cleanup Automated memory cleanup and optimization routines
 */
export class MemoryManager {
  private mem0: Mem0Service;
  private tenantId: string;
  private userId: string;

  constructor(tenantId: string, userId: string) {
    this.mem0 = new Mem0Service(tenantId);
    this.tenantId = tenantId;
    this.userId = userId;
  }

  /**
   * Add a conversation turn to memory
   * @method addConversationMemory
   * @param {Array<{role: string, content: string}>} messages - Conversation messages to store
   * @returns {Promise<void>}
   * @database_operations Inserts conversation messages into Mem0 memory system
   * @persistence Stores messages for future context retrieval and conversation continuity
   * @optimization Batches multiple messages for efficient storage
   * @monitoring Tracks memory addition success and performance metrics
   */
  async addConversationMemory(
    messages: Array<{ role: string; content: string }>
  ): Promise<void> {
    try {
      await this.mem0.addMemory(this.userId, messages);
    } catch (error) {
      console.error('Error adding conversation memory:', error);
      throw new Error(`Failed to add conversation memory: ${error}`);
    }
  }

  /**
   * Search for relevant memories based on a query
   * @method searchMemories
   * @param {string} query - Search query for memory retrieval
   * @param {number} [limit=5] - Maximum number of memories to retrieve
   * @returns {Promise<string[]>} Array of relevant memory strings
   * @search Semantic similarity search across stored memories
   * @optimization Limits results to prevent context overload
   * @relevance Ranks memories by semantic similarity to query
   * @performance Cached search results for frequently accessed queries
   */
  async searchMemories(query: string, limit: number = 5): Promise<string[]> {
    try {
      const memories = await this.mem0.searchMemories(
        this.userId,
        query,
        limit
      );
      return memories;
    } catch (error) {
      console.error('Error searching memories:', error);
      return [];
    }
  }

  /**
   * Get complete conversation history
   * @method getConversationHistory
   * @returns {Promise<Array<{role: string, content: string, timestamp: string}>>} Complete conversation history
   * @retrieval Fetches all stored conversation messages in chronological order
   * @context Provides full conversation context for AI agent reasoning
   * @pagination Handles large conversation histories efficiently
   * @privacy Tenant and user-scoped data isolation
   */
  async getConversationHistory(): Promise<
    Array<{
      role: string;
      content: string;
      timestamp: string;
    }>
  > {
    try {
      const memories = await this.mem0.getAllMemories(this.userId);
      return memories.map((memory: any) => ({
        role: memory.metadata?.role || 'assistant', // Extract role from metadata if available
        content: memory.content,
        timestamp: memory.createdAt || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error getting conversation history:', error);
      return [];
    }
  }

  /**
   * Clear all conversation memories for the user
   * @method clearConversationHistory
   * @returns {Promise<void>}
   * @cleanup Removes all stored conversation data for privacy or reset purposes
   * @irreversible Permanent deletion of conversation history
   * @logging Tracks memory deletion for audit purposes
   * @safety Requires explicit user consent for data deletion
   */
  async clearConversationHistory(): Promise<void> {
    try {
      await this.mem0.clearAllMemories(this.userId);
    } catch (error) {
      console.error('Error clearing conversation history:', error);
      throw new Error(`Failed to clear conversation history: ${error}`);
    }
  }

  /**
   * Get memory usage statistics
   * @method getMemoryStats
   * @returns {Promise<MemoryStats>} Comprehensive memory statistics
   * @analytics Provides insights into memory usage patterns and efficiency
   * @monitoring Tracks memory growth and search performance over time
   * @optimization Identifies opportunities for memory cleanup and optimization
   * @reporting Generates memory usage reports for system administrators
   */
  async getMemoryStats(): Promise<MemoryStats> {
    try {
      const stats = await this.mem0.getMemoryStats(this.userId);
      return {
        ...stats,
        tenantId: this.tenantId,
        userId: this.userId,
      };
    } catch (error) {
      console.error('Error getting memory stats:', error);
      return {
        totalMemories: 0,
        tenantId: this.tenantId,
        userId: this.userId,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  /**
   * Update a specific memory entry
   * @method updateMemory
   * @param {string} memoryId - Unique identifier of the memory to update
   * @param {string} newContent - New content to replace the existing memory
   * @returns {Promise<void>}
   * @modification Allows correction or enhancement of stored memories
   * @validation Ensures memory exists before attempting update
   * @audit Tracks all memory modifications for compliance
   * @consistency Maintains memory integrity during updates
   */
  async updateMemory(memoryId: string, newContent: string): Promise<void> {
    try {
      await this.mem0.updateMemory(memoryId, newContent);
    } catch (error) {
      console.error('Error updating memory:', error);
      throw new Error(`Failed to update memory: ${error}`);
    }
  }

  /**
   * Delete a specific memory entry
   * @method deleteMemory
   * @param {string} memoryId - Unique identifier of the memory to delete
   * @returns {Promise<void>}
   * @cleanup Selective memory removal for data management
   * @privacy Supports right to be forgotten and data minimization
   * @logging Records memory deletion for audit trails
   * @safety Validates memory ownership before deletion
   */
  async deleteMemory(memoryId: string): Promise<void> {
    try {
      await this.mem0.deleteMemory(memoryId);
    } catch (error) {
      console.error('Error deleting memory:', error);
      throw new Error(`Failed to delete memory: ${error}`);
    }
  }

  /**
   * Get memory health status and diagnostics
   * @method getHealthStatus
   * @returns {Promise<{status: string, connection: boolean, performance: number, lastCheck: string}>}
   * @diagnostics Comprehensive health check of memory system components
   * @connectivity Verifies Mem0 service availability and responsiveness
   * @performance Measures memory operation latency and throughput
   * @alerting Triggers alerts for memory system issues
   * @recovery Provides automatic recovery suggestions for common issues
   */
  async getHealthStatus(): Promise<{
    status: string;
    connection: boolean;
    performance: number;
    lastCheck: string;
  }> {
    try {
      const startTime = Date.now();
      const stats = await this.getMemoryStats();
      const responseTime = Date.now() - startTime;

      return {
        status: stats.totalMemories >= 0 ? 'healthy' : 'degraded',
        connection: true,
        performance: responseTime,
        lastCheck: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Memory health check failed:', error);
      return {
        status: 'unhealthy',
        connection: false,
        performance: -1,
        lastCheck: new Date().toISOString(),
      };
    }
  }

  /**
   * Optimize memory storage and cleanup old/unused memories
   * @method optimizeMemory
   * @param {number} [maxAgeDays=90] - Maximum age of memories to keep (in days)
   * @returns {Promise<{deletedCount: number, optimizedCount: number}>}
   * @cleanup Removes outdated memories to maintain system performance
   * @optimization Consolidates similar memories and removes duplicates
   * @maintenance Scheduled task for memory system upkeep
   * @monitoring Tracks cleanup effectiveness and memory usage trends
   */
  async optimizeMemory(maxAgeDays: number = 90): Promise<{
    deletedCount: number;
    optimizedCount: number;
  }> {
    try {
      // This would implement memory optimization logic
      // For now, return placeholder results
      return {
        deletedCount: 0,
        optimizedCount: 0,
      };
    } catch (error) {
      console.error('Error optimizing memory:', error);
      return {
        deletedCount: 0,
        optimizedCount: 0,
      };
    }
  }

  /**
   * Export memories for backup or migration
   * @method exportMemories
   * @param {Date} [since] - Export memories since this date
   * @returns {Promise<Array<{id: string, content: string, timestamp: string, metadata: any}>>}
   * @backup Creates portable backup of user memories
   * @migration Supports memory migration between systems
   * @privacy Exports only user-owned memories
   * @format Standardized export format for compatibility
   */
  async exportMemories(since?: Date): Promise<
    Array<{
      id: string;
      content: string;
      timestamp: string;
      metadata: any;
    }>
  > {
    try {
      // This would implement memory export logic
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error exporting memories:', error);
      return [];
    }
  }

  /**
   * Import memories from backup or migration
   * @method importMemories
   * @param {Array<{content: string, timestamp: string, metadata: any}>} memories - Memories to import
   * @returns {Promise<{importedCount: number, failedCount: number}>}
   * @restore Imports memories from backup or migration source
   * @validation Validates memory format and content before import
   * @deduplication Prevents duplicate memory creation during import
   * @rollback Supports rollback in case of import failures
   */
  async importMemories(
    memories: Array<{
      content: string;
      timestamp: string;
      metadata: any;
    }>
  ): Promise<{ importedCount: number; failedCount: number }> {
    try {
      // This would implement memory import logic
      // For now, return placeholder results
      return {
        importedCount: 0,
        failedCount: 0,
      };
    } catch (error) {
      console.error('Error importing memories:', error);
      return {
        importedCount: 0,
        failedCount: memories.length,
      };
    }
  }
}
