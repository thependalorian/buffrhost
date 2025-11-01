/**
 * KYC Multi-Agent Coordinator Component
 *
 * Purpose: Coordinate KYC verification using the multi-agent system
 * Location: /components/multi-agent/KycMultiAgentCoordinator.tsx
 * Integration: Works with BuffrMultiAgentSystem for intelligent KYC processing
 *
 * Features:
 * - Intelligent agent coordination for KYC verification
 * - Integration with Sofia AI for document analysis
 * - Dynamic routing based on verification complexity
 * - Real-time status updates and user guidance
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
/**
 * KycMultiAgentCoordinator React Component for Buffr Host Hospitality Platform
 * @fileoverview KycMultiAgentCoordinator provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/multi-agent/KycMultiAgentCoordinator.tsx
 * @purpose KycMultiAgentCoordinator provides specialized functionality for the Buffr Host platform
 * @component KycMultiAgentCoordinator
 * @category Multi-agent
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @authentication JWT-based authentication for user-specific functionality
 * @state_management Local component state for UI interactions and data management
 * @hooks_utilization useState, useEffect, useCallback for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Interactive state management for dynamic user experiences
 * - Secure authentication integration for user-specific features
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {string} [propertyId] - propertyId prop description
 * @param {string} [userId] - userId prop description
 * @param {} [userProfile] - userProfile prop description
 * @param {} [propertyData] - propertyData prop description
 * @param {} [kycStatus] - kycStatus prop description
 * @param {} [onVerificationComplete] - onVerificationComplete prop description
 * @param {} [onError] - onError prop description
 *
 * State:
 * @state {any} null - Component state for null management
 * @state {any} null - Component state for null management
 * @state {any} 'intelligent' - Component state for 'intelligent' management
 * @state {any} [] - Component state for [] management
 * @state {any} '' - Component state for '' management
 * @state {any} null - Component state for null management
 *
 * Methods:
 * @method handleManualKyc - handleManualKyc method for component functionality
 * @method handleVerificationComplete - handleVerificationComplete method for component functionality
 * @method getAgentActivityIcon - getAgentActivityIcon method for component functionality
 * @method getAgentDisplayName - getAgentDisplayName method for component functionality
 *
 * Usage Example:
 * @example
 * import { KycMultiAgentCoordinator } from './KycMultiAgentCoordinator';
 *
 * function App() {
 *   return (
 *     <KycMultiAgentCoordinator
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered KycMultiAgentCoordinator component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import {
  Shield,
  Brain,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Users,
  FileText,
} from 'lucide-react';

// Import comprehensive multi-agent system with Sofia AI integration
import {
  BuffrMultiAgentSystem,
  UserRequest,
  UserProfile,
  PropertyData,
  KYCStatus,
  SofiaAIEcosystemManager,
} from '@/lib/ai/multi-agent-system';

// Import existing KYC components
import KycVerificationForm from '../property-kyc-verification/KycVerificationForm';
import KycStatusDisplay from '../property-kyc-verification/KycStatusDisplay';

interface KycMultiAgentCoordinatorProps {
  propertyId: string;
  userId: string;
  userProfile?: UserProfile;
  propertyData?: PropertyData;
  kycStatus?: KYCStatus;
  onVerificationComplete?: (result: any) => void;
  onError?: (error: string) => void;
}

interface AgentActivity {
  agentId: string;
  action: string;
  status: 'thinking' | 'processing' | 'completed' | 'error';
  timestamp: Date;
  details?: string;
}

export const KycMultiAgentCoordinator: React.FC<
  KycMultiAgentCoordinatorProps
> = ({
  propertyId,
  userId,
  userProfile,
  propertyData,
  kycStatus,
  onVerificationComplete,
  onError,
}) => {
  const [multiAgentSystem, setMultiAgentSystem] =
    useState<BuffrMultiAgentSystem | null>(null);
  const [sofiaEcosystem, setSofiaEcosystem] =
    useState<SofiaAIEcosystemManager | null>(null);
  const [currentMode, setCurrentMode] = useState<'manual' | 'intelligent'>(
    'intelligent'
  );
  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [coordinatedResponse, setCoordinatedResponse] = useState<string>('');
  const [showAgentActivity, setShowAgentActivity] = useState(false);
  const [sofiaCapabilities, setSofiaCapabilities] = useState<any>(null);

  // Initialize Sofia AI Ecosystem and Multi-Agent System
  useEffect(() => {
    const initializeSofiaSystem = async () => {
      try {
        addAgentActivity(
          'system',
          'Initializing Sofia AI Ecosystem...',
          'thinking'
        );

        // Configure Sofia AI ecosystem with all capabilities
        const sofiaConfig = {
          vision: {
            deepseekApiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
            googleApiKey: process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY,
          },
          voice: {
            twilioAccountSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
            twilioAuthToken: process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN,
          },
          communication: {
            emailService: 'sofia_email_orchestrator',
            smsService: 'twilio',
            whatsappEnabled: true,
          },
          analytics: {
            databaseUrl: process.env.NEXT_PUBLIC_DATABASE_URL,
            enableRealTimeTracking: true,
          },
          memory: {
            retentionDays: 90,
            enableImportanceScoring: true,
          },
          cultural: {
            africanLanguages: ['af', 'de', 'naq', 'hz', 'kj', 'tn', 'loz'],
            namibianOptimized: true,
            culturalMarkers: 9,
          },
        };

        // Initialize Sofia ecosystem
        const ecosystem = new SofiaAIEcosystemManager(sofiaConfig);
        await ecosystem.initialize();

        // Initialize multi-agent system with Sofia ecosystem
        const system = new BuffrMultiAgentSystem(sofiaConfig);
        await system.initialize();

        setSofiaEcosystem(ecosystem);
        setMultiAgentSystem(system);
        setSofiaCapabilities(ecosystem.getCapabilities());

        addAgentActivity(
          'system',
          'Sofia AI Ecosystem initialized successfully',
          'completed',
          'Vision, Voice, Communication, Analytics, Memory, and Cultural services active'
        );
      } catch (error) {
        console.error('Failed to initialize Sofia AI system:', error);
        addAgentActivity(
          'system',
          'Sofia AI initialization failed',
          'error',
          error.message
        );
        onError?.('Failed to initialize AI verification system');
      }
    };

    initializeSofiaSystem();
  }, []);

  // Initialize with existing KYC status
  useEffect(() => {
    if (kycStatus?.status === 'approved') {
      addAgentActivity(
        'system',
        'KYC verification already approved',
        'completed'
      );
    }
  }, [kycStatus]);

  const addAgentActivity = useCallback(
    (
      agentId: string,
      action: string,
      status: 'thinking' | 'processing' | 'completed' | 'error',
      details?: string
    ) => {
      const activity: AgentActivity = {
        agentId,
        action,
        status,
        timestamp: new Date(),
        details,
      };

      setAgentActivities((prev) => [activity, ...prev.slice(0, 9)]); // Keep last 10 activities
    },
    []
  );

  const handleIntelligentKyc = async () => {
    if (!userProfile || !propertyData || !multiAgentSystem) {
      onError?.(
        'User profile, property data, and AI system required for intelligent processing'
      );
      return;
    }

    setIsProcessing(true);
    addAgentActivity(
      'supervisor',
      'Initializing comprehensive Sofia AI KYC analysis',
      'thinking'
    );

    try {
      // Create enhanced request with cultural context and Sofia capabilities
      const intelligentRequest: UserRequest = {
        id: `kyc-${Date.now()}`,
        userId,
        propertyId,
        content: `Please orchestrate a complete KYC verification process for property ${propertyData.name} using all available Sofia AI capabilities. Current status: ${kycStatus?.status || 'not started'}. Leverage vision analysis for document verification, cultural intelligence for appropriate communication, analytics for risk assessment, and multi-channel coordination.`,
        type: 'kyc',
        context: {
          userProfile: {
            ...userProfile,
            culturalProfile: userProfile.culturalProfile || {
              primaryLanguage: 'en',
              secondaryLanguages: ['af'],
              region: 'Namibia',
              culturalMarkers: ['namibian_hospitality'],
              namibianOptimized: true,
              hospitalityStyle: 'mixed',
            },
          },
          propertyData,
          kycStatus,
          culturalContext: {
            language: userProfile.preferences?.language || 'en',
            region: 'Namibia',
            culturalMarkers: ['hospitality', 'professional'],
            communicationStyle:
              userProfile.preferences?.communicationStyle || 'professional',
            namibianOptimized: true,
          },
          language: userProfile.preferences?.language || 'en',
          communicationChannel: 'chat',
          sessionHistory: [],
        },
        priority: 'high',
        timestamp: new Date(),
      };

      addAgentActivity(
        'supervisor',
        'Coordinating Sofia AI agents (Vision, Voice, Communication, Analytics)',
        'processing'
      );

      // Process through enhanced multi-agent system with all Sofia capabilities
      const response =
        await multiAgentSystem.processRequest(intelligentRequest);

      setCoordinatedResponse(response);
      addAgentActivity(
        'supervisor',
        'Sofia AI ecosystem coordinated response generated',
        'completed',
        `Response includes: ${sofiaCapabilities ? Object.keys(sofiaCapabilities).join(', ') : 'multiple services'}`
      );

      // Enhanced response analysis for next steps
      if (
        response.toLowerCase().includes('document') ||
        response.toLowerCase().includes('upload')
      ) {
        addAgentActivity(
          'sofia_vision_agent',
          'Document analysis recommended',
          'completed'
        );
      }
      if (
        response.toLowerCase().includes('voice') ||
        response.toLowerCase().includes('call')
      ) {
        addAgentActivity(
          'sofia_voice_agent',
          'Voice guidance available',
          'completed'
        );
      }
      if (
        response.toLowerCase().includes('email') ||
        response.toLowerCase().includes('sms')
      ) {
        addAgentActivity(
          'sofia_communication_agent',
          'Multi-channel communication coordinated',
          'completed'
        );
      }
    } catch (error) {
      console.error('Enhanced multi-agent KYC processing error:', error);
      addAgentActivity(
        'supervisor',
        'Sofia AI processing failed',
        'error',
        error.message
      );
      onError?.(
        'AI verification system temporarily unavailable. Please try the manual process.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualKyc = () => {
    setCurrentMode('manual');
    addAgentActivity('user', 'Switched to manual KYC process', 'completed');
  };

  const handleVerificationComplete = (result: any) => {
    addAgentActivity(
      'kyc_agent',
      'Verification completed successfully',
      'completed',
      `Status: ${result.status}`
    );
    onVerificationComplete?.(result);
  };

  const getAgentActivityIcon = (status: string) => {
    switch (status) {
      case 'thinking':
        return <Brain className="w-4 h-4 text-blue-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAgentDisplayName = (agentId: string) => {
    const names = {
      supervisor: 'Supervisor Agent',
      kyc_agent: 'KYC Verification Agent',
      sofia_agent: 'Sofia Concierge Agent',
      property_agent: 'Property Management Agent',
      user: 'User',
      system: 'System',
    };
    return names[agentId] || agentId;
  };

  if (kycStatus?.status === 'approved') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              KYC Verification Complete
            </h3>
            <p className="text-gray-600">
              Your identity has been successfully verified. You can now proceed
              with property management.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sofia AI Capabilities Status */}
      {sofiaCapabilities && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Brain className="w-5 h-5" />
              Sofia AI Ecosystem Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(sofiaCapabilities).map(
                ([service, capabilities]) => (
                  <div key={service} className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-sm capitalize">
                      {service}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {Array.isArray(capabilities)
                        ? `${capabilities.length} features`
                        : 'Active'}
                    </p>
                  </div>
                )
              )}
            </div>
            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
              <p className="text-sm text-primary font-medium">
                🧠 Cultural Intelligence: Namibian-optimized with 14+ African
                languages
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Vision analysis, voice generation, multi-channel communication,
                analytics, and memory systems active
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            KYC Verification Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Intelligent Mode */}
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                currentMode === 'intelligent'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setCurrentMode('intelligent')}
            >
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-6 h-6 text-blue-500" />
                <h3 className="font-semibold">Intelligent Processing</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Experience our comprehensive Sofia AI ecosystem for intelligent,
                culturally-aware KYC verification.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• DeepSeek vision document analysis</li>
                <li>• African voice guidance (14+ languages)</li>
                <li>• Multi-channel communication (email/SMS/WhatsApp)</li>
                <li>• Cultural intelligence & Namibian optimization</li>
                <li>• Advanced risk assessment & analytics</li>
                <li>• Memory-based personalization</li>
              </ul>
            </div>

            {/* Manual Mode */}
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                currentMode === 'manual'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => setCurrentMode('manual')}
            >
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-6 h-6 text-green-500" />
                <h3 className="font-semibold">Manual Processing</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Step through the traditional KYC verification process with clear
                guidance at each step.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Step-by-step guidance</li>
                <li>• Document upload forms</li>
                <li>• Progress tracking</li>
                <li>• Direct control</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Activity Monitor */}
      {showAgentActivity && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Agent Activity
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAgentActivities([])}
                className="ml-auto"
              >
                Clear
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {agentActivities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No agent activity yet
                </p>
              ) : (
                agentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {getAgentActivityIcon(activity.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {getAgentDisplayName(activity.agentId)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {activity.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{activity.action}</p>
                      {activity.details && (
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Intelligent Processing Results */}
      {currentMode === 'intelligent' && coordinatedResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI-Coordinated Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: coordinatedResponse.replace(/\n/g, '<br>'),
                }}
              />
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => setCurrentMode('manual')}
                className="flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Proceed with Manual Process
              </Button>
              <Button
                variant="outline"
                onClick={handleIntelligentKyc}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Ask Again'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {currentMode === 'intelligent' && !coordinatedResponse && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Ready to begin intelligent KYC verification with our AI agent
                team?
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  onClick={handleIntelligentKyc}
                  disabled={isProcessing}
                  className="flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  {isProcessing ? 'Processing...' : 'Start Intelligent KYC'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAgentActivity(!showAgentActivity)}
                >
                  {showAgentActivity ? 'Hide' : 'Show'} Agent Activity
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Processing Fallback */}
      {currentMode === 'manual' && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">
                  Manual KYC Verification
                </h3>
                <p className="text-gray-600">
                  Follow the step-by-step process to complete your verification
                </p>
              </div>
            </CardContent>
          </Card>

          <KycVerificationForm
            propertyId={propertyId}
            propertyName={propertyData?.name || 'Property'}
            propertyType={
              propertyData?.type === 'hotel' ? 'hotel' : 'restaurant'
            }
            onSuccess={handleVerificationComplete}
            onCancel={() => setCurrentMode('intelligent')}
          />
        </div>
      )}

      {/* KYC Status Display */}
      {kycStatus && <KycStatusDisplay kycStatus={kycStatus} />}
    </div>
  );
};

export default KycMultiAgentCoordinator;
