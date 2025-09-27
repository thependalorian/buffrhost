/**
 * Etuna AI Assistant - Mobile Responsive
 * 
 * Professional AI concierge using DeepSeek API with advanced prompts
 * Features real-time conversation, intelligent booking assistance, and seamless integration
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Star,
  Calendar,
  Bed,
  Utensils,
  Car,
  Wifi,
  Coffee,
  ArrowLeft,
  Home,
  Sparkles,
  MessageSquare,
  Zap,
  Brain,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Settings,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Search,
  Filter,
  BookOpen,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
  Globe,
  Lock,
  Eye,
  Heart,
  Award,
  Crown,
  Rocket,
  Database,
  Network,
  Cpu,
  Activity,
  Play,
  Pause,
  Square,
  RotateCcw,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { etunaUnifiedData } from '@/lib/data/etuna-property-unified';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'action' | 'booking' | 'escalation';
  metadata?: {
    conversationType?: string;
    priority?: string;
    requiresHandoff?: boolean;
    turnCount?: number;
  };
}

export default function EtunaAIAssistantPage() {
  const property = etunaUnifiedData.property;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(`session_${new Date().toISOString()}`);
  const [aiStatus, setAiStatus] = useState<'online' | 'thinking' | 'offline'>('online');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick action suggestions - Mobile optimized
  const quickActions = [
    { icon: Bed, label: 'Check Room Availability', query: 'I want to check room availability for this weekend' },
    { icon: Utensils, label: 'Restaurant Menu', query: 'What dining options do you have available?' },
    { icon: Car, label: 'Tour Information', query: 'Tell me about your tour packages and safaris' },
    { icon: Calendar, label: 'Book Conference', query: 'I need to book conference facilities for a meeting' },
    { icon: Phone, label: 'Contact Information', query: 'What are your contact details and location?' },
    { icon: Star, label: 'Special Services', query: 'What special services and amenities do you offer?' }
  ];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Send message to AI API
  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setAiStatus('thinking');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: sessionId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        metadata: {
          conversationType: data.metadata?.conversationType,
          priority: data.metadata?.priority,
          requiresHandoff: data.metadata?.requiresHandoff,
          turnCount: data.metadata?.turnCount
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      setAiStatus('online');

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m experiencing technical difficulties. Please contact our reception directly at +264 65 231 177 for immediate assistance.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'escalation',
        metadata: {
          conversationType: 'emergency',
          priority: 'high',
          requiresHandoff: true
        }
      };

      setMessages(prev => [...prev, errorMessage]);
      setAiStatus('online');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // Handle quick action click
  const handleQuickAction = (query: string) => {
    sendMessage(query);
  };

  // Copy message to clipboard
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="min-h-screen nude-gradient-light">
      {/* Header - Mobile Responsive */}
      <div className="bg-white shadow-nude border-b border-nude-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-0 sm:h-16 space-y-2 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Link href="/guest/etuna" className="flex items-center space-x-2 text-nude-700 hover:text-nude-800">
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm sm:text-base">Back to Etuna</span>
              </Link>
              <div className="hidden sm:block h-6 w-px bg-gray-300" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium text-nude-700">AI Assistant Online</span>
                </div>
                <div className="flex items-center space-x-1 text-xs sm:text-sm text-nude-800">
                  <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>DeepSeek Powered</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-nude-700">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">+264 65 231 177</span>
                <span className="sm:hidden">+264 65 231 177</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-nude-700">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">bookings@etunaguesthouse.com</span>
                <span className="sm:hidden">bookings@etunaguesthouse.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface - Mobile Responsive */}
      <div className="flex h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)]">
        {/* Chat Area - Takes full width */}
        <div className="flex-1 flex flex-col">
          {/* Welcome Message - Mobile Responsive */}
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
              <div className="max-w-2xl w-full text-center">
                <div className="mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Welcome to Etuna AI Assistant
                  </h1>
                  <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 px-4">
                    Your intelligent concierge powered by DeepSeek AI. I can help with bookings, 
                    dining, tours, and any questions about your stay.
                  </p>
                </div>

                {/* Quick Actions - Mobile Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.query)}
                      className="p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 group-hover:text-blue-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-blue-600">
                          {action.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="text-xs sm:text-sm text-gray-500 px-4">
                  <p>💡 <strong>Pro Tip:</strong> Ask me anything about rooms, dining, tours, or local attractions!</p>
                </div>
              </div>
            </div>
          )}

          {/* Messages - Mobile Responsive */}
          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md lg:max-w-3xl px-3 sm:px-4 py-2 sm:py-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      {message.sender === 'ai' && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="whitespace-pre-wrap text-sm sm:text-base break-words">{message.content}</div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 space-y-1 sm:space-y-0">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            {message.metadata?.conversationType && (
                              <span className="px-1 sm:px-2 py-1 bg-gray-100 rounded-full text-xs">
                                {message.metadata.conversationType}
                              </span>
                            )}
                          </div>
                          {message.sender === 'ai' && (
                            <button
                              onClick={() => copyMessage(message.content)}
                              className="text-gray-400 hover:text-gray-600 transition-colors self-start sm:self-auto"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        {message.metadata?.requiresHandoff && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs sm:text-sm text-yellow-800">
                            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                            This requires human assistance. Please contact reception at +264 65 231 177
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-xs sm:max-w-md lg:max-w-3xl px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        <span className="text-gray-600 text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Area - Mobile Responsive */}
          <div className="border-t bg-white p-3 sm:p-4">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about your stay at Etuna Guesthouse..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
            
            {/* Quick Actions for ongoing conversation - Mobile Responsive */}
            {messages.length > 0 && (
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                {quickActions.slice(0, 4).map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.query)}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex items-center space-x-1"
                    disabled={isLoading}
                  >
                    <action.icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{action.label}</span>
                    <span className="sm:hidden">{action.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}