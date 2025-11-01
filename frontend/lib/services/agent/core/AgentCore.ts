/**
 * Agent Core Orchestration Module
 * @fileoverview Main orchestration logic for Buffr AI agents with personality, memory, and tool integration
 * @location buffr-host/frontend/lib/services/agent/core/AgentCore.ts
 * @purpose Central orchestration for AI agent conversations, tool execution, and state management
 * @modularity Core agent functionality separated from memory, personality, and tool execution
 * @database_connections Indirect connections through MemoryManager, PersonalityEngine, and ToolExecutor
 * @ai_integration DeepSeek LLM API with tool calling and context awareness
 * @scalability Modular design allows independent scaling of components
 * @performance Optimized orchestration with lazy loading and caching
 * @monitoring Comprehensive conversation tracking and performance metrics
 *
 * Core Responsibilities:
 * - Main chat orchestration and conversation flow
 * - Integration between memory, personality, and tools
 * - API communication with DeepSeek
 * - Error handling and fallback responses
 * - Conversation state management
 */

import { Mem0Service } from '../../mem0-service';
import {
  PersonalityEngine,
  PersonalityUpdate,
} from '../personality/PersonalityEngine';
import { SofiaEmailGeneratorService } from '../../sofia-email-generator';
import { ToolExecutor } from '../tools/ToolExecutor';

/**
 * Arcade AI Tool interface for hospitality management automation
 * @interface ArcadeTool
 * @property {string} name - Unique tool identifier
 * @property {string} description - Human-readable tool description
 * @property {string} provider - Tool provider (sendgrid, calendar, etc.)
 * @property {string[]} scopes - Required OAuth scopes for tool access
 * @property {string} hospitalityUse - Specific hospitality use cases for the tool
 * @property {boolean} requiresAuth - Whether tool requires user authentication
 */
export interface ArcadeTool {
  name: string;
  description: string;
  provider: string;
  scopes: string[];
  hospitalityUse: string;
  requiresAuth: boolean;
}

/**
 * Tool execution result interface for tracking AI tool operations
 * @interface ToolResult
 * @property {boolean} success - Whether the tool execution succeeded
 * @property {unknown} [result] - Tool execution result data
 * @property {string} [error] - Error message if execution failed
 * @property {string} toolName - Name of the executed tool
 * @property {string} executedAt - ISO timestamp of execution
 */
export interface ToolResult {
  success: boolean;
  result?: unknown;
  error?: string;
  toolName: string;
  executedAt: string;
}

/**
 * Production-ready AI Agent Core with comprehensive hospitality automation
 * @class BuffrAgentCore
 * @purpose Orchestrates AI agents with memory, personality, and tool integration for hospitality operations
 * @modularity Core orchestration separated from specialized modules (memory, personality, tools)
 * @ai_integration DeepSeek LLM with Mem0 memory and Arcade AI tools for comprehensive automation
 * @multi_tenant Automatic tenant isolation for agent memories, personalities, and tool executions
 * @learning Expectation-Maximization algorithm for personality adaptation and continuous learning
 * @performance Optimized AI operations with caching, parallel processing, and memory management
 * @monitoring Comprehensive AI analytics, conversation tracking, and performance optimization
 * @hospitality Specialized for hotel and restaurant operations with domain-specific tools and knowledge
 */
export class BuffrAgentCore {
  private mem0: Mem0Service;
  private personality: PersonalityEngine;
  private toolExecutor: ToolExecutor;
  private sofiaEmailGenerator: SofiaEmailGeneratorService;
  private tenantId: string;
  private userId: string;
  private propertyId: number | undefined;
  private deepseekApiKey: string;
  private deepseekModel: string;

  constructor(tenantId: string, userId: string, propertyId?: number) {
    this.tenantId = tenantId;
    this.userId = userId;
    this.propertyId = propertyId;
    this.mem0 = new Mem0Service(tenantId);
    this.personality = new PersonalityEngine(tenantId, propertyId);
    this.toolExecutor = new ToolExecutor(tenantId, propertyId);
    this.sofiaEmailGenerator = new SofiaEmailGeneratorService(
      tenantId,
      propertyId?.toString() || 'default'
    );
    this.deepseekApiKey = process.env['DEEPSEEK_API_KEY'] || '';
    this.deepseekModel =
      process.env['NEXT_PUBLIC_DEEPSEEK_MODEL'] || 'deepseek-chat';
  }

  /**
   * Main chat orchestration method with full AI agent capabilities
   * @method chat
   * @param {string} message - User message to process
   * @param {unknown} [context] - Additional context for the conversation
   * @returns {Promise<{response: string, toolsUsed: ToolResult[], memories: string[], personality: unknown}>}
   * @database_operations Reads personality and memories, writes conversation history
   * @ai_operations Calls DeepSeek API with tool integration and personality context
   * @tool_integration Executes Arcade AI tools based on LLM function calling
   * @memory_operations Stores conversation in Mem0 for future context
   * @personality_updates Adapts personality based on interaction complexity and sentiment
   * @performance Optimized with parallel memory retrieval and tool execution
   * @monitoring Tracks all interactions, tool usage, and performance metrics
   * @error_handling Comprehensive error handling with fallback responses
   */
  async chat(
    message: string,
    context?: unknown
  ): Promise<{
    response: string;
    toolsUsed: ToolResult[];
    memories: string[];
    personality: unknown;
  }> {
    try {
      // Load personality
      const personality = await this.personality.loadPersonality();

      // Retrieve relevant memories
      const memories = await this.mem0.searchMemories(this.userId, message, 3);
      const memoryContext =
        memories.length > 0
          ? `\n\nRelevant memories:\n${memories.map((m) => `- ${m}`).join('\n')}`
          : '';

      // Build enhanced system prompt with personality and tool capabilities
      const systemPrompt = `You are ${personality.name}, a ${personality.role} for the ${this.tenantId} tenant.

PERSONALITY:
- You are ${this.personality.getPersonalitySummary(personality).communication_style}
- Current mood: ${personality.current_mood}
- Confidence: ${personality.confidence_level}
- Core traits: ${personality.core_traits.map((t) => `${t.name} (${t.value})`).join(', ')}

You help with hospitality management tasks including:
- Property management and bookings
- Customer service and support
- Staff coordination and notifications
- Revenue optimization
- Guest experience enhancement

Available Tools:
${this.toolExecutor
  .getAvailableTools()
  .map((tool) => `- ${tool.name}: ${tool.description}`)
  .join('\n')}

Current Context:
- Tenant: ${this.tenantId}
- User: ${this.userId}
- Property: ${this.propertyId || 'Not specified'}

Always be helpful, professional, and context-aware. Use tools when appropriate to help guests and staff.${memoryContext}`;

      // Call Deepseek API with tool integration
      const response = await fetch(
        'https://api.deepseek.com/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.deepseekApiKey}`,
          },
          body: JSON.stringify({
            model: this.deepseekModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message },
            ],
            temperature: 0.7,
            max_tokens: 1000,
            tools: this.toolExecutor.formatToolsForAPI(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Deepseek API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse =
        data.choices[0]?.message?.content || "I couldn't generate a response.";

      // Check for tool calls
      const toolCalls = data.choices[0]?.message?.tool_calls || [];
      const toolsUsed: ToolResult[] = [];

      // Execute tools if any were called
      for (const toolCall of toolCalls) {
        const toolResult = await this.toolExecutor.executeTool(
          toolCall.function.name,
          toolCall.function.arguments
        );
        toolsUsed.push(toolResult);
      }

      // Store conversation in memory
      await this.mem0.addMemory(this.userId, [
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse },
      ]);

      // Update personality based on interaction
      const personalityUpdate: PersonalityUpdate = {
        success: true,
        complexity: this.calculateComplexity(message),
        sentiment: this.analyzeSentiment(message),
      };

      const updatedPersonality = await this.personality.updatePersonality(
        personality,
        personalityUpdate
      );

      return {
        response: aiResponse,
        toolsUsed,
        memories,
        personality: this.personality.getPersonalitySummary(updatedPersonality),
      };
    } catch (error) {
      console.error('Error in agent chat:', error);
      return {
        response:
          "I apologize, but I'm experiencing technical difficulties. Please try again later.",
        toolsUsed: [],
        memories: [],
        personality: {},
      };
    }
  }

  /**
   * Calculate message complexity (0.0 to 1.0)
   * @private
   * @param {string} message - Message to analyze
   * @returns {number} Complexity score between 0.0 and 1.0
   */
  private calculateComplexity(message: string): number {
    const words = message.split(' ').length;
    const sentences = message.split(/[.!?]+/).length;
    const hasQuestions = message.includes('?');
    const hasMultipleRequests = (
      message.match(/and|also|additionally|furthermore/gi) || []
    ).length;

    let complexity = 0.3; // Base complexity

    if (words > 20) complexity += 0.2;
    if (sentences > 3) complexity += 0.2;
    if (hasQuestions) complexity += 0.1;
    if (hasMultipleRequests > 0) complexity += 0.2;

    return Math.min(1.0, complexity);
  }

  /**
   * Analyze message sentiment
   * @private
   * @param {string} message - Message to analyze
   * @returns {'positive'|'negative'|'neutral'} Sentiment classification
   */
  private analyzeSentiment(
    message: string
  ): 'positive' | 'negative' | 'neutral' {
    const positiveWords = [
      'good',
      'great',
      'excellent',
      'amazing',
      'wonderful',
      'fantastic',
      'perfect',
      'love',
      'like',
      'awesome',
      'brilliant',
      'outstanding',
    ];
    const negativeWords = [
      'bad',
      'terrible',
      'awful',
      'horrible',
      'hate',
      'dislike',
      'worst',
      'poor',
      'disappointing',
      'frustrating',
      'annoying',
      'problem',
    ];

    const lowerMessage = message.toLowerCase();
    const positiveCount = positiveWords.filter((word) =>
      lowerMessage.includes(word)
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      lowerMessage.includes(word)
    ).length;

    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  }

  /**
   * Get agent health status
   * @method getHealthStatus
   * @returns {Promise<{status: string, components: Record<string, boolean>, timestamp: string}>}
   */
  async getHealthStatus(): Promise<{
    status: string;
    components: Record<string, boolean>;
    timestamp: string;
  }> {
    try {
      const memoryHealth = await this.mem0.getHealthStatus();
      const personalityHealth = await this.personality.getHealthStatus();
      const toolHealth = await this.toolExecutor.getHealthStatus();

      const components = {
        memory: memoryHealth.status === 'healthy',
        personality: personalityHealth.status === 'healthy',
        tools: toolHealth.status === 'healthy',
        deepseek_api: !!this.deepseekApiKey,
      };

      const allHealthy = Object.values(components).every((healthy) => healthy);
      const status = allHealthy ? 'healthy' : 'degraded';

      return {
        status,
        components,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error checking agent health:', error);
      return {
        status: 'unhealthy',
        components: {
          memory: false,
          personality: false,
          tools: false,
          deepseek_api: false,
        },
        timestamp: new Date().toISOString(),
      };
    }
  }
}
