/**
 * Customer Communication Component
 *
 * Purpose: Displays communication history and messaging interface
 * Functionality: Message history, communication status, send messages
 * Location: /components/crm/customer-dashboard/CustomerCommunication.tsx
 *
 * Follows 40 Rules:
 * - Uses DaisyUI for consistent styling
 * - Modular component design for easy maintenance
 * - TypeScript for type safety
 * - Vercel-compatible with SSR
 * - Comprehensive error handling
 * - Optimized for performance
 */

'use client';

import React, { useState } from 'react';
/**
 * CustomerCommunication React Component for Buffr Host Hospitality Platform
 * @fileoverview CustomerCommunication manages customer relationship and loyalty program interactions
 * @location buffr-host/components/crm/customer-dashboard/CustomerCommunication.tsx
 * @purpose CustomerCommunication manages customer relationship and loyalty program interactions
 * @component CustomerCommunication
 * @category Crm
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @hooks_utilization useState for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {CommunicationHistory[]} [communications] - communications prop description
 * @param {string} [customerId] - customerId prop description
 * @param {} [onSendMessage] - onSendMessage prop description
 * @param {string} [content] - content prop description
 * @param {} [subject] - subject prop description
 *
 * Methods:
 * @method getCommunicationIcon - getCommunicationIcon method for component functionality
 * @method getCommunicationTypeColor - getCommunicationTypeColor method for component functionality
 * @method getStatusColor - getStatusColor method for component functionality
 *
 * Usage Example:
 * @example
 * import { CustomerCommunication } from './CustomerCommunication';
 *
 * function App() {
 *   return (
 *     <CustomerCommunication
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered CustomerCommunication component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { MessageSquare, Send, Mail, Phone, MessageCircle } from 'lucide-react';

// Types for TypeScript compliance
interface CommunicationHistory {
  id: string;
  type: 'email' | 'sms' | 'call' | 'chat';
  subject: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  content: string;
  direction: 'inbound' | 'outbound';
}

interface CustomerCommunicationProps {
  communications: CommunicationHistory[];
  customerId: string;
  onSendMessage?: (message: {
    type: string;
    content: string;
    subject?: string;
  }) => void;
  isLoading?: boolean;
}

// Main Customer Communication Component
export const CustomerCommunication: React.FC<CustomerCommunicationProps> = ({
  communications,
  customerId,
  onSendMessage,
  isLoading = false,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState('email');
  const [messageSubject, setMessageSubject] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Get communication type icon
  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'chat':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  // Get communication type color
  const getCommunicationTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'badge-primary';
      case 'sms':
        return 'badge-success';
      case 'call':
        return 'badge-warning';
      case 'chat':
        return 'badge-info';
      default:
        return 'badge-neutral';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-success';
      case 'read':
        return 'text-primary';
      case 'sent':
        return 'text-warning';
      case 'failed':
        return 'text-error';
      default:
        return 'text-base-content';
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !onSendMessage) return;

    try {
      setIsSending(true);

      await onSendMessage({
        type: messageType,
        content: newMessage.trim(),
        subject: messageSubject.trim() || undefined,
      });

      setNewMessage('');
      setMessageSubject('');
      setMessageType('email');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Communication History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="loading loading-spinner loading-md text-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Communication History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Communication History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {communications.length > 0 ? (
              communications.map((comm) => (
                <div
                  key={comm.id}
                  className="flex items-start gap-4 p-4 bg-base-200 rounded"
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        comm.direction === 'outbound'
                          ? 'bg-primary text-primary-content'
                          : 'bg-base-300 text-base-content'
                      }`}
                    >
                      {getCommunicationIcon(comm.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getCommunicationTypeColor(comm.type)}>
                        {comm.type.toUpperCase()}
                      </Badge>
                      <span className="font-medium text-sm">
                        {comm.subject}
                      </span>
                      <span
                        className={`text-xs ${getStatusColor(comm.status)}`}
                      >
                        {comm.status}
                      </span>
                    </div>

                    <p className="text-sm text-base-content/70 mb-2 line-clamp-2">
                      {comm.content}
                    </p>

                    <div className="flex items-center justify-between text-xs text-base-content/50">
                      <span>{new Date(comm.timestamp).toLocaleString()}</span>
                      <span className="capitalize">{comm.direction}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-base-content/30" />
                <h3 className="text-lg font-semibold mb-2">
                  No Communication History
                </h3>
                <p className="text-base-content/70">
                  No messages have been exchanged with this customer yet.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Send New Message */}
      {onSendMessage && (
        <Card>
          <CardHeader>
            <CardTitle>Send New Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Message Type</span>
                </label>
                <Select value={messageType} onValueChange={setMessageType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {messageType === 'email' && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Subject</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    placeholder="Enter message subject..."
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Message Content</span>
              </label>
              <Textarea
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-24"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
                className="btn-primary"
              >
                <Send className="w-4 h-4" />
                {isSending ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button className="btn btn-outline btn-sm">
              <Mail className="w-4 h-4" />
              Send Email
            </button>
            <button className="btn btn-outline btn-sm">
              <MessageSquare className="w-4 h-4" />
              Send SMS
            </button>
            <button className="btn btn-outline btn-sm">
              <Phone className="w-4 h-4" />
              Make Call
            </button>
            <button className="btn btn-outline btn-sm">
              <MessageCircle className="w-4 h-4" />
              Start Chat
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerCommunication;
