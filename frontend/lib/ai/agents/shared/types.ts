/**
 * Shared Types and Interfaces for Multi-Agent System
 *
 * Centralized type definitions for all agent modules
 * Location: lib/ai/agents/shared/types.ts
 * Purpose: Provide consistent interfaces across all agent components
 * Modularity: Separated types for better maintainability and reusability
 */

export interface UserRequest {
  id: string;
  userId: string;
  propertyId?: string;
  content: string;
  type:
    | 'kyc'
    | 'booking'
    | 'support'
    | 'property_management'
    | 'communication'
    | 'analytics'
    | 'general';
  context: {
    userProfile?: UserProfile;
    propertyData?: PropertyData;
    sessionHistory?: ConversationMessage[];
    kycStatus?: KYCStatus;
    culturalContext?: CulturalContext;
    language?: string;
    communicationChannel?: 'email' | 'sms' | 'chat' | 'voice' | 'whatsapp';
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: Date;
}

export interface AgentResponse {
  agentId: string;
  response: string;
  confidence: number;
  actions: AgentAction[];
  metadata: Record<string, any>;
  culturalAdaptations?: CulturalAdaptation[];
  sofiaTools?: SofiaToolUsage[];
}

export interface AgentAction {
  type:
    | 'kyc_verification'
    | 'booking_update'
    | 'sofia_recommendation'
    | 'property_task'
    | 'document_analysis'
    | 'voice_generation'
    | 'email_send'
    | 'sms_send'
    | 'analytics_query';
  data: Record<string, any>;
  priority: number;
  sofiaService?: string;
}

export interface CulturalContext {
  language: string;
  region: string;
  culturalMarkers: string[];
  communicationStyle: 'formal' | 'casual' | 'professional' | 'hospitality';
  namibianOptimized: boolean;
}

export interface CulturalAdaptation {
  language: string;
  culturalElements: string[];
  voiceProfile: string;
  greetingStyle: string;
}

export interface SofiaToolUsage {
  tool: 'vision' | 'voice' | 'email' | 'sms' | 'chat' | 'analytics' | 'memory';
  service: string;
  confidence: number;
  processingTime: number;
}

export interface UserProfile {
  id: string;
  preferences: {
    communicationStyle: 'formal' | 'casual' | 'professional' | 'hospitality';
    preferredServices: string[];
    language: string;
    timeZone: string;
    africanLanguage?: string;
    culturalRegion?: string;
    voiceProfile?: string;
    communicationChannels: ('email' | 'sms' | 'chat' | 'voice' | 'whatsapp')[];
  };
  history: {
    totalBookings: number;
    favoriteProperties: string[];
    averageRating: number;
    specialRequests: string[];
    culturalInteractions: CulturalInteraction[];
  };
  kycStatus: KYCStatus;
  culturalProfile?: CulturalProfile;
}

export interface CulturalProfile {
  primaryLanguage: string;
  secondaryLanguages: string[];
  region: string;
  culturalMarkers: string[];
  namibianOptimized: boolean;
  hospitalityStyle: 'western' | 'african' | 'mixed';
}

export interface CulturalInteraction {
  language: string;
  context: string;
  satisfaction: number;
  timestamp: Date;
}

export interface PropertyData {
  id: string;
  name: string;
  type: 'hotel' | 'restaurant' | 'guesthouse';
  location: string;
  amenities: string[];
  currentOccupancy: number;
  totalCapacity: number;
}

export interface KYCStatus {
  status: 'not_started' | 'pending' | 'approved' | 'rejected' | 'requires_info';
  completedSteps: string[];
  riskScore: number;
  lastUpdated: Date;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'agent';
  content: string;
  timestamp: Date;
  agentId?: string;
}

// Document analysis interfaces
export interface DocumentAnalysis {
  documentType: string;
  confidence: number;
  extractedData: Record<string, any>;
  validationResults: ValidationResult[];
  riskAssessment: RiskAssessment;
}

export interface KYCAnalysis extends DocumentAnalysis {
  identityVerification: IdentityVerification;
  complianceCheck: ComplianceCheck;
  riskAssessment: RiskAssessment;
}

export interface IdentityVerification {
  nameMatch: boolean;
  documentValidity: boolean;
  biometricMatch?: boolean;
  confidence: number;
}

export interface ComplianceCheck {
  sanctionsCheck: boolean;
  pepCheck: boolean;
  adverseMediaCheck: boolean;
  overallCompliance: boolean;
}

export interface ValidationResult {
  field: string;
  value: any;
  isValid: boolean;
  confidence: number;
  issues?: string[];
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  riskFactors: string[];
  recommendations: string[];
}

// Base agent interface
export interface BaseAgent {
  agentId: string;
  agentType: string;
  capabilities: string[];
  initialize(): Promise<void>;
  processRequest(request: UserRequest): Promise<AgentResponse>;
  getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    last_processed_request?: Date;
    queue_length?: number;
    error_rate?: number;
  }>;
}

// Agent configuration interfaces
export interface AgentConfig {
  maxConcurrentRequests: number;
  timeoutMs: number;
  retryAttempts: number;
  culturalAdaptationEnabled: boolean;
  sofiaIntegrationEnabled: boolean;
}

// Coordination interfaces
export interface AgentAssignment {
  requestId: string;
  agentId: string;
  priority: number;
  assignedAt: Date;
  expectedCompletion: Date;
}

export interface CoordinationResult {
  success: boolean;
  assignedAgent: string;
  confidence: number;
  alternativeAgents?: string[];
  reasoning: string;
}

// Communication interfaces
export interface CommunicationRequest {
  channel: 'email' | 'sms' | 'chat' | 'voice' | 'whatsapp';
  recipient: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  culturalContext?: CulturalContext;
}

export interface CommunicationResponse {
  success: boolean;
  messageId?: string;
  deliveryStatus: 'sent' | 'delivered' | 'failed';
  error?: string;
}

// Analytics interfaces
export interface AnalyticsQuery {
  type: 'revenue' | 'customer' | 'operational' | 'performance';
  timeRange: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, any>;
  metrics: string[];
}

export interface AnalyticsResult {
  queryId: string;
  data: Record<string, any>;
  insights: string[];
  confidence: number;
  generatedAt: Date;
}
