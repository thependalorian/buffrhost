/**
 * Base Agent Class
 *
 * Core agent functionality and shared methods
 * All specialized agents inherit from this base class
 * Location: lib/ai/agents/shared/BaseAgent.ts
 * Purpose: Provide common agent operations and infrastructure
 */

import {
  BaseAgent,
  UserRequest,
  AgentResponse,
  AgentConfig,
  CulturalContext,
} from './types';

export abstract class BaseAgentImplementation implements BaseAgent {
  public readonly agentId: string;
  public readonly agentType: string;
  public readonly capabilities: string[];

  protected config: AgentConfig = {
    maxConcurrentRequests: 5,
    timeoutMs: 30000,
    retryAttempts: 3,
    culturalAdaptationEnabled: true,
    sofiaIntegrationEnabled: true,
  };

  protected activeRequests = new Set<string>();
  protected requestQueue: UserRequest[] = [];
  protected culturalCache = new Map<string, CulturalContext>();

  constructor(agentId: string, agentType: string, capabilities: string[]) {
    this.agentId = agentId;
    this.agentType = agentType;
    this.capabilities = capabilities;
  }

  abstract processRequest(request: UserRequest): Promise<AgentResponse>;

  async initialize(): Promise<void> {
    try {
      console.log(`Initializing ${this.agentType} Agent (${this.agentId})...`);

      // Initialize agent-specific components
      await this.initializeAgent();

      // Load cultural adaptation data
      if (this.config.culturalAdaptationEnabled) {
        await this.loadCulturalData();
      }

      // Initialize Sofia AI integrations
      if (this.config.sofiaIntegrationEnabled) {
        await this.initializeSofiaServices();
      }

      console.log(
        `${this.agentType} Agent (${this.agentId}) initialized successfully`
      );
    } catch (error) {
      console.error(
        `Failed to initialize ${this.agentType} Agent (${this.agentId}):`,
        error
      );
      throw error;
    }
  }

  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    last_processed_request?: Date;
    queue_length?: number;
    error_rate?: number;
  }> {
    try {
      const queueLength = this.requestQueue.length;
      const activeCount = this.activeRequests.size;

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

      if (queueLength > this.config.maxConcurrentRequests * 2) {
        status = 'degraded';
      }

      if (activeCount >= this.config.maxConcurrentRequests) {
        status = 'degraded';
      }

      return {
        status,
        last_processed_request: new Date(), // Would track actual last request
        queue_length: queueLength,
        error_rate: 0.02, // Would calculate actual error rate
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        queue_length: this.requestQueue.length,
      };
    }
  }

  // ============================================================================
  // REQUEST PROCESSING
  // ============================================================================

  protected async handleRequest(request: UserRequest): Promise<AgentResponse> {
    // Check if agent can handle this request type
    if (!this.canHandleRequest(request)) {
      throw new Error(
        `Agent ${this.agentId} cannot handle request type: ${request.type}`
      );
    }

    // Add to active requests
    this.activeRequests.add(request.id);

    try {
      // Apply cultural adaptation if needed
      const adaptedRequest = await this.applyCulturalAdaptation(request);

      // Process the request
      const response = await this.processRequestWithTimeout(adaptedRequest);

      // Enhance response with cultural elements
      const enhancedResponse = await this.enhanceResponseWithCulture(
        response,
        request
      );

      return enhancedResponse;
    } finally {
      // Remove from active requests
      this.activeRequests.delete(request.id);
    }
  }

  private async processRequestWithTimeout(
    request: UserRequest
  ): Promise<AgentResponse> {
    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Request timeout after ${this.config.timeoutMs}ms`));
      }, this.config.timeoutMs);

      try {
        const response = await this.processRequest(request);
        clearTimeout(timeout);
        resolve(response);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  protected canHandleRequest(request: UserRequest): boolean {
    // Check if agent capabilities match request type
    const capabilityMap: Record<string, string[]> = {
      kyc: ['kyc_verification', 'document_analysis'],
      booking: ['booking_update', 'sofia_recommendation'],
      support: ['sofia_recommendation', 'communication'],
      property_management: ['property_task', 'analytics_query'],
      communication: ['email_send', 'sms_send', 'voice_generation'],
      analytics: ['analytics_query'],
      general: ['sofia_recommendation', 'communication'],
    };

    const requiredCapabilities = capabilityMap[request.type] || [];
    return requiredCapabilities.some((cap) => this.capabilities.includes(cap));
  }

  // ============================================================================
  // CULTURAL ADAPTATION
  // ============================================================================

  protected async applyCulturalAdaptation(
    request: UserRequest
  ): Promise<UserRequest> {
    if (
      !this.config.culturalAdaptationEnabled ||
      !request.context.culturalContext
    ) {
      return request;
    }

    const culturalContext = request.context.culturalContext;

    // Cache cultural context for future use
    this.culturalCache.set(request.userId, culturalContext);

    // Adapt request content based on cultural context
    const adaptedContent = await this.adaptContentForCulture(
      request.content,
      culturalContext
    );

    return {
      ...request,
      content: adaptedContent,
      context: {
        ...request.context,
        language: culturalContext.language,
      },
    };
  }

  protected async enhanceResponseWithCulture(
    response: AgentResponse,
    originalRequest: UserRequest
  ): Promise<AgentResponse> {
    if (!this.config.culturalAdaptationEnabled) {
      return response;
    }

    const culturalContext = originalRequest.context.culturalContext;
    if (!culturalContext) {
      return response;
    }

    // Add cultural adaptations to response
    const adaptations = await this.generateCulturalAdaptations(culturalContext);

    return {
      ...response,
      culturalAdaptations: adaptations,
    };
  }

  private async adaptContentForCulture(
    content: string,
    culturalContext: CulturalContext
  ): Promise<string> {
    // This would use Sofia AI to adapt content for cultural context
    // For now, return original content
    return content;
  }

  private async generateCulturalAdaptations(
    culturalContext: CulturalContext
  ): Promise<any[]> {
    // Generate cultural adaptations based on context
    const adaptations = [];

    if (culturalContext.namibianOptimized) {
      adaptations.push({
        language: culturalContext.language,
        culturalElements: ['namibian_greeting', 'local_references'],
        voiceProfile: 'namibian_warm',
        greetingStyle: 'african_hospitality',
      });
    }

    return adaptations;
  }

  // ============================================================================
  // SOFIA AI INTEGRATION
  // ============================================================================

  protected async initializeSofiaServices(): Promise<void> {
    // Initialize connections to Sofia AI services
    // This would establish connections to vision, voice, email, etc. services
  }

  protected async callSofiaService(
    service: string,
    operation: string,
    data: any
  ): Promise<any> {
    try {
      // This would make actual calls to Sofia AI services
      // For now, return mock response
      return {
        success: true,
        data: {},
        confidence: 0.9,
        processingTime: 150,
      };
    } catch (error) {
      console.error(
        `Sofia service call failed: ${service}.${operation}`,
        error
      );
      throw error;
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  protected generateConfidenceScore(factors: {
    dataQuality: number;
    historicalAccuracy: number;
    contextRelevance: number;
    culturalAdaptation: number;
  }): number {
    const weights = {
      dataQuality: 0.4,
      historicalAccuracy: 0.3,
      contextRelevance: 0.2,
      culturalAdaptation: 0.1,
    };

    return (
      factors.dataQuality * weights.dataQuality +
      factors.historicalAccuracy * weights.historicalAccuracy +
      factors.contextRelevance * weights.contextRelevance +
      factors.culturalAdaptation * weights.culturalAdaptation
    );
  }

  protected validateUserRequest(request: UserRequest): boolean {
    return !!(
      request.id &&
      request.userId &&
      request.content &&
      request.type &&
      request.priority &&
      request.timestamp instanceof Date
    );
  }

  protected createErrorResponse(
    request: UserRequest,
    error: string
  ): AgentResponse {
    return {
      agentId: this.agentId,
      response: `I apologize, but I encountered an error processing your request: ${error}`,
      confidence: 0,
      actions: [],
      metadata: {
        error: true,
        errorMessage: error,
        requestId: request.id,
      },
    };
  }

  // ============================================================================
  // ABSTRACT METHODS FOR SPECIALIZED AGENTS
  // ============================================================================

  protected abstract initializeAgent(): Promise<void>;
  protected abstract loadCulturalData(): Promise<void>;
}
