"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Send,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Calendar,
  Bell,
  Settings,
  Archive,
  Reply,
  Forward
} from 'lucide-react';

export default function EtunaCommunicationsPage() {
  const [activeTab, setActiveTab] = useState('messages');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample communication data
  const messages = [
    {
      id: 'MSG001',
      guestName: 'John Smith',
      roomNumber: '101',
      type: 'email',
      subject: 'Late check-in request',
      content: 'Hi, I will be arriving late tonight around 11 PM. Is this possible?',
      status: 'pending',
      timestamp: '2024-01-20 14:30',
      priority: 'medium',
      assignedTo: 'Reception',
      response: null
    },
    {
      id: 'MSG002',
      guestName: 'Maria Garcia',
      roomNumber: '205',
      type: 'sms',
      subject: 'Restaurant reservation',
      content: 'Can I book a table for 2 at 7 PM tonight?',
      status: 'responded',
      timestamp: '2024-01-20 12:15',
      priority: 'low',
      assignedTo: 'Restaurant',
      response: 'Table booked for 2 at 7 PM. Confirmation sent.'
    },
    {
      id: 'MSG003',
      guestName: 'David Johnson',
      roomNumber: '102',
      type: 'phone',
      subject: 'Tour inquiry',
      content: 'Interested in Etosha National Park tour tomorrow',
      status: 'completed',
      timestamp: '2024-01-20 10:45',
      priority: 'high',
      assignedTo: 'Tours',
      response: 'Tour booked for tomorrow 6 AM pickup. Confirmation sent.'
    },
    {
      id: 'MSG004',
      guestName: 'Sarah Wilson',
      roomNumber: '301',
      type: 'email',
      subject: 'Complaint - Room service',
      content: 'Room service was very slow and food was cold when it arrived.',
      status: 'urgent',
      timestamp: '2024-01-20 09:20',
      priority: 'high',
      assignedTo: 'Manager',
      response: 'Apologies for the poor service. We have credited your account and will ensure better service.'
    }
  ];

  const emailTemplates = [
    {
      id: 'TMPL001',
      name: 'Welcome Email',
      subject: 'Welcome to Etuna Guesthouse!',
      category: 'Welcome',
      content: 'Dear {{guestName}}, welcome to Etuna Guesthouse! We hope you enjoy your stay...',
      variables: ['guestName', 'roomNumber', 'checkInDate'],
      isActive: true
    },
    {
      id: 'TMPL002',
      name: 'Check-out Reminder',
      subject: 'Check-out Reminder - Etuna Guesthouse',
      category: 'Check-out',
      content: 'Dear {{guestName}}, this is a reminder that check-out is at 11 AM...',
      variables: ['guestName', 'checkOutTime'],
      isActive: true
    },
    {
      id: 'TMPL003',
      name: 'Tour Confirmation',
      subject: 'Tour Confirmation - {{tourName}}',
      category: 'Tours',
      content: 'Dear {{guestName}}, your tour {{tourName}} has been confirmed...',
      variables: ['guestName', 'tourName', 'pickupTime'],
      isActive: true
    },
    {
      id: 'TMPL004',
      name: 'Feedback Request',
      subject: 'How was your stay at Etuna Guesthouse?',
      category: 'Feedback',
      content: 'Dear {{guestName}}, we hope you enjoyed your stay. Please share your feedback...',
      variables: ['guestName', 'stayDuration'],
      isActive: true
    }
  ];

  const notificationSettings = [
    {
      type: 'email',
      name: 'Email Notifications',
      description: 'Receive notifications via email',
      enabled: true,
      channels: ['New Booking', 'Check-in Alert', 'Payment Received', 'Guest Message']
    },
    {
      type: 'sms',
      name: 'SMS Notifications',
      description: 'Receive notifications via SMS',
      enabled: true,
      channels: ['Urgent Messages', 'Check-in Alert', 'Tour Reminders']
    },
    {
      type: 'push',
      name: 'Push Notifications',
      description: 'Receive notifications on mobile app',
      enabled: false,
      channels: ['All Notifications']
    },
    {
      type: 'webhook',
      name: 'Webhook Notifications',
      description: 'Send notifications to external systems',
      enabled: true,
      channels: ['Booking Updates', 'Payment Status']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'responded':
        return 'text-info bg-info/10';
      case 'completed':
        return 'text-success bg-success/10';
      case 'urgent':
        return 'text-error bg-error/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'responded':
        return Reply;
      case 'completed':
        return CheckCircle;
      case 'urgent':
        return AlertCircle;
      default:
        return MessageSquare;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return Mail;
      case 'sms':
        return MessageSquare;
      case 'phone':
        return Phone;
      default:
        return MessageSquare;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'badge-error';
      case 'medium':
        return 'badge-warning';
      case 'low':
        return 'badge-success';
      default:
        return 'badge-neutral';
    }
  };

  const filteredMessages = messages.filter(message =>
    message.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.roomNumber.includes(searchTerm)
  );

  const tabs = [
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'templates', label: 'Templates', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Communications"
        description="Manage guest communications, notifications, and messaging for Etuna Guesthouse"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Etuna Management', href: '/protected/etuna' },
          { label: 'Communications', href: '/protected/etuna/communications' }
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="tabs tabs-boxed">
                {tabs.map((tab) => {
                  const TabIcon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <TabIcon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <ActionButton variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </ActionButton>
                <ActionButton>
                  <Plus className="w-4 h-4 mr-2" />
                  New Message
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <>
            {/* Search Bar */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="form-control">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="input input-bordered w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-square">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="space-y-4 mb-8">
              {filteredMessages.map((message) => {
                const StatusIcon = getStatusIcon(message.status);
                const TypeIcon = getTypeIcon(message.type);
                return (
                  <div key={message.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <TypeIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{message.guestName}</h3>
                            <p className="text-sm text-base-content/70">Room {message.roomNumber}</p>
                            <p className="text-sm font-medium">{message.subject}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`badge ${getPriorityColor(message.priority)}`}>
                            {message.priority}
                          </span>
                          <div className={`badge ${getStatusColor(message.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm bg-base-200 p-3 rounded-lg">
                          {message.content}
                        </p>
                      </div>

                      {message.response && (
                        <div className="mb-4">
                          <p className="text-xs text-base-content/70 mb-1">Response:</p>
                          <p className="text-sm bg-success/10 p-3 rounded-lg border-l-4 border-success">
                            {message.response}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-base-content/70">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{message.timestamp}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>Assigned to: {message.assignedTo}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="btn btn-ghost btn-sm">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm">
                            <Reply className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm">
                            <Forward className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm">
                            <Archive className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {emailTemplates.map((template) => (
              <div key={template.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="card-title text-lg">{template.name}</h3>
                      <p className="text-sm text-base-content/70">{template.category}</p>
                    </div>
                    <div className={`badge ${template.isActive ? 'badge-success' : 'badge-neutral'}`}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-1">Subject:</p>
                    <p className="text-sm bg-base-200 p-2 rounded">{template.subject}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-1">Content Preview:</p>
                    <p className="text-sm bg-base-200 p-2 rounded line-clamp-3">
                      {template.content}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">Variables:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map((variable, index) => (
                        <span key={index} className="badge badge-outline badge-sm">
                          {`{{${variable}}}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="card-actions justify-end">
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 mb-8">
            {notificationSettings.map((setting) => (
              <div key={setting.type} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="card-title text-lg">{setting.name}</h3>
                      <p className="text-sm text-base-content/70">{setting.description}</p>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={setting.enabled}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">Notification Channels:</p>
                    <div className="flex flex-wrap gap-2">
                      {setting.channels.map((channel, index) => (
                        <span key={index} className="badge badge-outline badge-sm">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Communication Preferences</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Auto-response enabled</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email notifications</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">SMS notifications</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Push notifications</span>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Response Settings</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Response Time SLA</span>
                    </label>
                    <select className="select select-bordered">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>2 hours</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Escalation Time</span>
                    </label>
                    <select className="select select-bordered">
                      <option>1 hour</option>
                      <option>2 hours</option>
                      <option>4 hours</option>
                      <option>8 hours</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Auto-assignment</span>
                    </label>
                    <select className="select select-bordered">
                      <option>Round Robin</option>
                      <option>By Department</option>
                      <option>By Priority</option>
                      <option>Manual</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Messages</p>
                  <p className="text-2xl font-bold">{messages.length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Pending</p>
                  <p className="text-2xl font-bold">
                    {messages.filter(m => m.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-green-500 text-white">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Completed</p>
                  <p className="text-2xl font-bold">
                    {messages.filter(m => m.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-red-500 text-white">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Urgent</p>
                  <p className="text-2xl font-bold">
                    {messages.filter(m => m.status === 'urgent').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}