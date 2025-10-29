'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  EnhancedBuffrAgentOrchestrator,
  EnhancedAgentContext,
} from '../../lib/ai-agents/enhanced-agent-system';

interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  agentName?: string;
  metadata?: unknown;
}

interface AIAgentChatProps {
  className?: string;
}

export default function AIAgentChat({ className = '' }: AIAgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<
    'all' | 'alex' | 'sarah' | 'marcus'
  >('all');
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const orchestrator = new EnhancedBuffrAgentOrchestrator();

  const agents = [
    {
      id: 'all',
      name: 'All Agents',
      description: 'Strategic, Financial & Operational Analysis',
      color: 'bg-nude-500',
    },
    {
      id: 'alex',
      name: 'Alex (CEO)',
      description: 'Strategic Decision Making',
      color: 'bg-green-500',
    },
    {
      id: 'sarah',
      name: 'Sarah (CFO)',
      description: 'Financial Optimization',
      color: 'bg-purple-500',
    },
    {
      id: 'marcus',
      name: 'Marcus (COO)',
      description: 'Operational Excellence',
      color: 'bg-orange-500',
    },
  ];

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: 'welcome',
        type: 'system',
        content:
          'Welcome to Buffr Host AI Agent Chat! I can help you with strategic decisions, financial analysis, and operational optimization. What would you like to discuss?',
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Create context for the agent
      const context: EnhancedAgentContext = {
        tenantId: 'buffr-host',
        adminId: 'george-nekwaya',
        currentData: {
          message: inputMessage,
          selectedAgent,
          timestamp: new Date().toISOString(),
        },
        previousDecisions: messages
          .filter((m) => m.type === 'agent')
          .map((m) => m.metadata),
        iteration: messages.filter((m) => m.type === 'agent').length + 1,
      };

      let response;

      if (selectedAgent === 'all') {
        // Use orchestrator for comprehensive analysis
        response = await orchestrator.executeComplexDecision(
          context,
          'comprehensive_analysis'
        );
      } else {
        // Use specific agent
        const agent =
          selectedAgent === 'alex'
            ? 'strategic'
            : selectedAgent === 'sarah'
              ? 'financial'
              : 'operational';
        response = await orchestrator.executeComplexDecision(context, agent);
      }

      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: formatAgentResponse(response),
        timestamp: new Date(),
        agentName:
          selectedAgent === 'all'
            ? 'AI Orchestrator'
            : selectedAgent === 'alex'
              ? 'Alex (CEO)'
              : selectedAgent === 'sarah'
                ? 'Sarah (CFO)'
                : 'Marcus (COO)',
        metadata: response,
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content:
          'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAgentResponse = (response: unknown): string => {
    let formatted = `## ${response.decision || 'Analysis Complete'}\n\n`;

    if (response.summary) {
      formatted += `**Summary:** ${response.summary}\n\n`;
    }

    if (response.keyInsights && response.keyInsights.length > 0) {
      formatted += `**Key Insights:**\n`;
      response.keyInsights.forEach((insight: string) => {
        formatted += `• ${insight}\n`;
      });
      formatted += `\n`;
    }

    if (response.recommendations && response.recommendations.length > 0) {
      formatted += `**Recommendations:**\n`;
      response.recommendations.forEach((rec: string) => {
        formatted += `• ${rec}\n`;
      });
      formatted += `\n`;
    }

    if (response.keyMetrics) {
      formatted += `**Key Metrics:**\n`;
      Object.entries(response.keyMetrics).forEach(([key, value]) => {
        formatted += `• ${key}: ${value}\n`;
      });
      formatted += `\n`;
    }

    if (response.nextSteps && response.nextSteps.length > 0) {
      formatted += `**Next Steps:**\n`;
      response.nextSteps.forEach((step: string) => {
        formatted += `• ${step}\n`;
      });
      formatted += `\n`;
    }

    if (response.timeline) {
      formatted += `**Timeline:** ${response.timeline}\n\n`;
    }

    if (response.expectedOutcomes) {
      formatted += `**Expected Outcomes:**\n`;
      Object.entries(response.expectedOutcomes).forEach(([key, value]) => {
        formatted += `• ${key}: ${value}\n`;
      });
    }

    return formatted;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        type: 'system',
        content:
          'Welcome to Buffr Host AI Agent Chat! I can help you with strategic decisions, financial analysis, and operational optimization. What would you like to discuss?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div
      className={`flex flex-col h-full bg-nude-50 rounded-lg shadow-luxury-strong ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-nude-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-nude-900">
              Buffr Host AI Agents
            </h3>
            <p className="text-sm text-nude-500">
              Strategic, Financial & Operational Intelligence
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAgentSelector(!showAgentSelector)}
            className="px-3 py-1 bg-nude-100 hover:bg-nude-200 rounded-md text-sm font-medium text-nude-700 transition-colors duration-300"
          >
            {agents.find((a) => a.id === selectedAgent)?.name}
          </button>
          <button
            onClick={clearChat}
            className="p-2 text-nude-400 hover:text-nude-600 transition-colors duration-300"
            title="Clear chat"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Agent Selector */}
      {showAgentSelector && (
        <div className="p-4 border-b border-nude-200 bg-nude-50">
          <div className="grid grid-cols-2 gap-3">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => {
                  setSelectedAgent(agent.id as unknown);
                  setShowAgentSelector(false);
                }}
                className={`p-3 rounded-lg text-left transition-colors duration-300 ${
                  selectedAgent === agent.id
                    ? 'bg-nude-100 border-2 border-nude-500'
                    : 'bg-nude-50 border border-nude-200 hover:bg-nude-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${agent.color}`}></div>
                  <span className="font-medium text-nude-900">
                    {agent.name}
                  </span>
                </div>
                <p className="text-sm text-nude-500 mt-1">
                  {agent.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl px-4 py-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-nude-500 text-white'
                  : message.type === 'agent'
                    ? 'bg-nude-100 text-nude-900'
                    : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
              }`}
            >
              {message.type === 'agent' && message.agentName && (
                <div className="flex items-center space-x-2 mb-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      message.agentName.includes('Alex')
                        ? 'bg-green-500'
                        : message.agentName.includes('Sarah')
                          ? 'bg-purple-500'
                          : message.agentName.includes('Marcus')
                            ? 'bg-orange-500'
                            : 'bg-nude-500'
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-nude-600">
                    {message.agentName}
                  </span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-nude-100 text-nude-900 px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-nude-600"></div>
                <span>AI agents are analyzing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-nude-200">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about strategy, finance, operations, or any business decision..."
            className="flex-1 px-4 py-2 border border-nude-300 rounded-lg focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-nude-500 focus:border-transparent outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-2 bg-nude-500 text-white rounded-lg hover:bg-nude-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            Send
          </button>
        </div>
        <div className="mt-2 text-xs text-nude-500">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
