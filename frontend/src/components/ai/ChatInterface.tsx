/**
 * Enhanced Chat Interface with Langfuse Integration
 * Provides AI-powered conversational interface with comprehensive observability
 */

import React, { useState, useEffect, useRef } from 'react';
import { useLangfuseTrace } from '@/lib/langfuse';
import { createSessionId } from '@/lib/langfuse';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  intent?: string;
  confidence?: number;
  metadata?: Record<string, any>;
}

interface ChatInterfaceProps {
  userId: string;
  propertyId?: string;
  onMessageSent?: (message: Message) => void;
  onResponseReceived?: (response: Message) => void;
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  userId,
  propertyId,
  onMessageSent,
  onResponseReceived,
  className = '',
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(createSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { trackConversation, trackUserInteraction, trackError } = useLangfuseTrace();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: 'Welcome to The Shandi! I\'m your AI assistant. How can I help you today?',
      role: 'assistant',
      timestamp: new Date().toISOString(),
      intent: 'greeting',
      confidence: 1.0,
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Track user interaction
    await trackUserInteraction(
      userId,
      'send_message',
      'chat_interface',
      {
        message_length: userMessage.content.length,
        property_id: propertyId,
        session_id: sessionId,
      }
    );

    // Call onMessageSent callback
    onMessageSent?.(userMessage);

    try {
      // Send message to AI service
      const response = await fetch('/api/ai/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          user_id: userId,
          session_id: sessionId,
          property_id: propertyId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        content: data.response,
        role: 'assistant',
        timestamp: data.timestamp,
        intent: data.intent,
        confidence: data.confidence,
        metadata: data.metadata,
      };

      // Add assistant message to chat
      setMessages(prev => [...prev, assistantMessage]);

      // Track conversation in Langfuse
      await trackConversation(
        userId,
        sessionId,
        userMessage.content,
        assistantMessage.content,
        assistantMessage.intent || 'unknown',
        assistantMessage.confidence || 0,
        {
          property_id: propertyId,
          session_id: sessionId,
          response_time: data.metadata?.duration || 0,
        }
      );

      // Call onResponseReceived callback
      onResponseReceived?.(assistantMessage);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Track error in Langfuse
      await trackError(
        userId,
        error as Error,
        {
          message: userMessage.content,
          session_id: sessionId,
          property_id: propertyId,
        },
        {
          component: 'chat_interface',
          action: 'send_message',
        }
      );

      // Add error message to chat
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        intent: 'error',
        confidence: 1.0,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getIntentColor = (intent?: string) => {
    switch (intent) {
      case 'booking': return 'text-blue-600';
      case 'amenities': return 'text-green-600';
      case 'support': return 'text-orange-600';
      case 'payment': return 'text-purple-600';
      case 'loyalty': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-lg ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-sm text-gray-500">The Shandi Hospitality</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-500">Online</span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs opacity-75">
                  {formatTimestamp(message.timestamp)}
                </span>
                {message.intent && message.intent !== 'greeting' && (
                  <span className={`text-xs ${getIntentColor(message.intent)}`}>
                    {message.intent}
                  </span>
                )}
              </div>
              {message.confidence && message.confidence < 1.0 && (
                <div className="mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full"
                      style={{ width: `${message.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs opacity-75">
                    Confidence: {Math.round(message.confidence * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Send'
            )}
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            { label: 'Book Room', intent: 'booking' },
            { label: 'Amenities', intent: 'amenities' },
            { label: 'Support', intent: 'support' },
            { label: 'Payment', intent: 'payment' },
            { label: 'Loyalty', intent: 'loyalty' },
          ].map((action) => (
            <button
              key={action.intent}
              onClick={() => setInputMessage(`I need help with ${action.label.toLowerCase()}`)}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;