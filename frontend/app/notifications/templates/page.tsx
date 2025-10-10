"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Mail, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Phone,
  Bell,
  Users,
  Calendar,
  Settings,
  Copy,
  Play,
  Pause,
  BarChart3,
  Star,
  Globe,
  Smartphone
} from 'lucide-react';

export default function NotificationTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('templates');

  // Sample templates data
  const templates = [
    {
      id: 'TMPL001',
      name: 'Welcome Email',
      type: 'email',
      category: 'Welcome',
      subject: 'Welcome to Etuna Guesthouse!',
      status: 'active',
      language: 'English',
      isDefault: true,
      variables: ['guestName', 'roomNumber', 'checkInDate', 'propertyName'],
      content: `Dear {{guestName}},

Welcome to {{propertyName}}! We're excited to have you stay with us.

Your reservation details:
- Room: {{roomNumber}}
- Check-in: {{checkInDate}}

If you have any questions, please don't hesitate to contact us.

Best regards,
The Etuna Team`,
      lastUsed: '2024-01-20',
      usageCount: 156,
      openRate: 28.5,
      clickRate: 4.2,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-18'
    },
    {
      id: 'TMPL002',
      name: 'Booking Confirmation',
      type: 'email',
      category: 'Booking',
      subject: 'Booking Confirmation - {{propertyName}}',
      status: 'active',
      language: 'English',
      isDefault: true,
      variables: ['guestName', 'bookingId', 'checkIn', 'checkOut', 'totalAmount'],
      content: `Dear {{guestName}},

Thank you for your booking! Your reservation has been confirmed.

Booking Details:
- Booking ID: {{bookingId}}
- Check-in: {{checkIn}}
- Check-out: {{checkOut}}
- Total Amount: {{totalAmount}}

We look forward to welcoming you!

Best regards,
The Etuna Team`,
      lastUsed: '2024-01-20',
      usageCount: 234,
      openRate: 32.1,
      clickRate: 6.8,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-19'
    },
    {
      id: 'TMPL003',
      name: 'Check-in Reminder',
      type: 'sms',
      category: 'Reminder',
      subject: 'Check-in Reminder',
      status: 'active',
      language: 'English',
      isDefault: false,
      variables: ['guestName', 'checkInTime', 'propertyName'],
      content: `Hi {{guestName}}, your check-in at {{propertyName}} is tomorrow at {{checkInTime}}. Safe travels!`,
      lastUsed: '2024-01-19',
      usageCount: 89,
      openRate: 95.2,
      clickRate: 12.3,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-17'
    },
    {
      id: 'TMPL004',
      name: 'Payment Reminder',
      type: 'email',
      category: 'Payment',
      subject: 'Payment Reminder - {{bookingId}}',
      status: 'active',
      language: 'English',
      isDefault: false,
      variables: ['guestName', 'bookingId', 'amount', 'dueDate'],
      content: `Dear {{guestName}},

This is a friendly reminder that payment for booking {{bookingId}} is due.

Amount: {{amount}}
Due Date: {{dueDate}}

Please complete your payment to secure your reservation.

Best regards,
The Etuna Team`,
      lastUsed: '2024-01-18',
      usageCount: 67,
      openRate: 24.8,
      clickRate: 3.1,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-16'
    },
    {
      id: 'TMPL005',
      name: 'Tour Confirmation',
      type: 'email',
      category: 'Tours',
      subject: 'Tour Confirmation - {{tourName}}',
      status: 'draft',
      language: 'English',
      isDefault: false,
      variables: ['guestName', 'tourName', 'tourDate', 'pickupTime'],
      content: `Dear {{guestName}},

Your tour booking has been confirmed!

Tour Details:
- Tour: {{tourName}}
- Date: {{tourDate}}
- Pickup Time: {{pickupTime}}

Please be ready at the designated pickup location.

Best regards,
The Etuna Team`,
      lastUsed: null,
      usageCount: 0,
      openRate: 0,
      clickRate: 0,
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20'
    },
    {
      id: 'TMPL006',
      name: 'Feedback Request',
      type: 'email',
      category: 'Feedback',
      subject: 'How was your stay at {{propertyName}}?',
      status: 'active',
      language: 'English',
      isDefault: false,
      variables: ['guestName', 'propertyName', 'stayDuration'],
      content: `Dear {{guestName}},

We hope you enjoyed your {{stayDuration}} stay at {{propertyName}}!

Your feedback is important to us. Please take a moment to share your experience.

[Review Link]

Thank you for choosing us!

Best regards,
The Etuna Team`,
      lastUsed: '2024-01-17',
      usageCount: 45,
      openRate: 18.7,
      clickRate: 8.9,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-15'
    }
  ];

  const templateCategories = [
    { name: 'Welcome', count: 1, color: 'bg-blue-500' },
    { name: 'Booking', count: 1, color: 'bg-green-500' },
    { name: 'Reminder', count: 1, color: 'bg-yellow-500' },
    { name: 'Payment', count: 1, color: 'bg-red-500' },
    { name: 'Tours', count: 1, color: 'bg-purple-500' },
    { name: 'Feedback', count: 1, color: 'bg-orange-500' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'draft':
        return 'text-warning bg-warning/10';
      case 'inactive':
        return 'text-error bg-error/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'draft':
        return Clock;
      case 'inactive':
        return AlertCircle;
      default:
        return Mail;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return Mail;
      case 'sms':
        return Phone;
      case 'push':
        return Bell;
      default:
        return MessageSquare;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-blue-500';
      case 'sms':
        return 'bg-green-500';
      case 'push':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'templates', label: 'Templates', icon: Mail },
    { id: 'categories', label: 'Categories', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Notification Templates"
        description="Manage email, SMS, and push notification templates for guest communications"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Notifications', href: '/notifications' },
          { label: 'Templates', href: '/notifications/templates' }
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
                  New Template
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search templates..."
                        className="input input-bordered w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn btn-square">
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <select
                    className="select select-bordered w-full md:w-40"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredTemplates.map((template) => {
                const StatusIcon = getStatusIcon(template.status);
                const TypeIcon = getTypeIcon(template.type);
                return (
                  <div key={template.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${getTypeColor(template.type)} text-white`}>
                            <TypeIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="card-title text-lg">{template.name}</h3>
                            <p className="text-sm text-base-content/70">{template.category}</p>
                            <p className="text-sm font-semibold">{template.language}</p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(template.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                          </div>
                          {template.isDefault && (
                            <div className="badge badge-primary badge-sm">
                              Default
                            </div>
                          )}
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
                        <p className="text-xs text-base-content/70 mb-2">Variables:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.variables.map((variable, index) => (
                            <span key={index} className="badge badge-outline badge-sm">
                              {`{{${variable}}}`}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Usage</p>
                          <p className="font-semibold">{template.usageCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Open Rate</p>
                          <p className="font-semibold">{template.openRate}%</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-base-content/70">
                          Last used: {template.lastUsed || 'Never'}
                        </div>
                        <div className="text-sm text-base-content/70">
                          Updated: {template.updatedAt}
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
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {templateCategories.map((category, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-lg ${category.color} text-white`}>
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="card-title text-lg">{category.name}</h3>
                      <p className="text-sm text-base-content/70">{category.count} templates</p>
                    </div>
                  </div>
                  <div className="card-actions justify-end">
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Template Performance</h3>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`p-1 rounded ${getTypeColor(template.type)}`}>
                            {React.createElement(getTypeIcon(template.type), { className: "w-4 h-4 text-white" })}
                          </div>
                          <span className="font-semibold">{template.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-warning" />
                          <span className="font-semibold">{template.openRate}%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-base-content/70">Usage</p>
                          <p className="font-semibold">{template.usageCount}</p>
                        </div>
                        <div>
                          <p className="text-base-content/70">Open Rate</p>
                          <p className="font-semibold">{template.openRate}%</p>
                        </div>
                        <div>
                          <p className="text-base-content/70">Click Rate</p>
                          <p className="font-semibold">{template.clickRate}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Channel Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Templates</span>
                    <span className="font-semibold">
                      {templates.filter(t => t.type === 'email').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS Templates</span>
                    <span className="font-semibold">
                      {templates.filter(t => t.type === 'sms').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Push Templates</span>
                    <span className="font-semibold">
                      {templates.filter(t => t.type === 'push').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Templates</span>
                    <span className="font-semibold text-success">
                      {templates.filter(t => t.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Usage</span>
                    <span className="font-semibold">
                      {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Template Settings</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Default Language</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="English">English</option>
                      <option value="Afrikaans">Afrikaans</option>
                      <option value="German">German</option>
                      <option value="Portuguese">Portuguese</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Default Sender Name</span>
                    </label>
                    <input type="text" className="input input-bordered" defaultValue="Etuna Guesthouse" />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Default Sender Email</span>
                    </label>
                    <input type="email" className="input input-bordered" defaultValue="noreply@etuna.com" />
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Auto-save drafts</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Delivery Settings</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email Rate Limit</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="100">100/hour</option>
                      <option value="500" selected>500/hour</option>
                      <option value="1000">1000/hour</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">SMS Rate Limit</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="50">50/hour</option>
                      <option value="100" selected>100/hour</option>
                      <option value="200">200/hour</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Enable delivery tracking</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Enable open tracking</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
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
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Templates</p>
                  <p className="text-2xl font-bold">{templates.length}</p>
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
                  <p className="text-sm text-base-content/70">Active Templates</p>
                  <p className="text-2xl font-bold">
                    {templates.filter(t => t.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Usage</p>
                  <p className="text-2xl font-bold">
                    {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Avg Open Rate</p>
                  <p className="text-2xl font-bold">
                    {Math.round(templates.reduce((sum, t) => sum + t.openRate, 0) / templates.length)}%
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