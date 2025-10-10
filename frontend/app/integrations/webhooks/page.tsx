"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Webhook, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Globe,
  Shield,
  Settings,
  BarChart3,
  Copy,
  ExternalLink,
  TestTube,
  RefreshCw,
  Activity,
  Database,
  Server
} from 'lucide-react';

export default function WebhooksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('webhooks');

  // Sample webhooks data
  const webhooks = [
    {
      id: 'WH001',
      name: 'Booking Created',
      url: 'https://crm.example.com/webhooks/booking-created',
      events: ['booking.created', 'booking.confirmed'],
      status: 'active',
      secret: 'whsec_1234567890abcdef',
      authentication: 'secret',
      retryPolicy: {
        maxRetries: 3,
        retryDelay: 1000,
        backoffMultiplier: 2
      },
      statistics: {
        totalDeliveries: 1234,
        successfulDeliveries: 1189,
        failedDeliveries: 45,
        successRate: 96.4,
        averageResponseTime: 245
      },
      lastDelivery: '2024-01-20 14:30:00',
      lastError: null,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 'WH002',
      name: 'Payment Completed',
      url: 'https://accounting.example.com/webhooks/payment',
      events: ['payment.completed', 'payment.failed'],
      status: 'active',
      secret: 'whsec_abcdef1234567890',
      authentication: 'secret',
      retryPolicy: {
        maxRetries: 5,
        retryDelay: 2000,
        backoffMultiplier: 1.5
      },
      statistics: {
        totalDeliveries: 567,
        successfulDeliveries: 545,
        failedDeliveries: 22,
        successRate: 96.1,
        averageResponseTime: 189
      },
      lastDelivery: '2024-01-20 13:45:00',
      lastError: null,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: 'WH003',
      name: 'Guest Check-in',
      url: 'https://notifications.example.com/webhooks/checkin',
      events: ['guest.checkin', 'guest.checkout'],
      status: 'inactive',
      secret: 'whsec_9876543210fedcba',
      authentication: 'secret',
      retryPolicy: {
        maxRetries: 2,
        retryDelay: 500,
        backoffMultiplier: 2
      },
      statistics: {
        totalDeliveries: 234,
        successfulDeliveries: 201,
        failedDeliveries: 33,
        successRate: 85.9,
        averageResponseTime: 456
      },
      lastDelivery: '2024-01-18 09:15:00',
      lastError: 'Connection timeout after 30s',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-19'
    },
    {
      id: 'WH004',
      name: 'Inventory Update',
      url: 'https://inventory.example.com/webhooks/update',
      events: ['inventory.updated', 'inventory.low_stock'],
      status: 'testing',
      secret: 'whsec_test123456789',
      authentication: 'secret',
      retryPolicy: {
        maxRetries: 3,
        retryDelay: 1000,
        backoffMultiplier: 2
      },
      statistics: {
        totalDeliveries: 89,
        successfulDeliveries: 78,
        failedDeliveries: 11,
        successRate: 87.6,
        averageResponseTime: 312
      },
      lastDelivery: '2024-01-19 16:20:00',
      lastError: 'HTTP 500 Internal Server Error',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-19'
    }
  ];

  const events = [
    { name: 'booking.created', description: 'Triggered when a new booking is created', count: 2 },
    { name: 'booking.confirmed', description: 'Triggered when a booking is confirmed', count: 2 },
    { name: 'payment.completed', description: 'Triggered when a payment is completed', count: 1 },
    { name: 'payment.failed', description: 'Triggered when a payment fails', count: 1 },
    { name: 'guest.checkin', description: 'Triggered when a guest checks in', count: 1 },
    { name: 'guest.checkout', description: 'Triggered when a guest checks out', count: 1 },
    { name: 'inventory.updated', description: 'Triggered when inventory is updated', count: 1 },
    { name: 'inventory.low_stock', description: 'Triggered when inventory is low', count: 1 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'inactive':
        return 'text-error bg-error/10';
      case 'testing':
        return 'text-warning bg-warning/10';
      case 'paused':
        return 'text-info bg-info/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'inactive':
        return AlertCircle;
      case 'testing':
        return TestTube;
      case 'paused':
        return Clock;
      default:
        return Webhook;
    }
  };

  const getAuthColor = (auth: string) => {
    switch (auth) {
      case 'secret':
        return 'badge-success';
      case 'jwt':
        return 'badge-primary';
      case 'basic':
        return 'badge-warning';
      case 'none':
        return 'badge-error';
      default:
        return 'badge-base-300';
    }
  };

  const filteredWebhooks = webhooks.filter(webhook =>
    webhook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    webhook.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    webhook.events.some(event => event.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const tabs = [
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'events', label: 'Events', icon: Zap },
    { id: 'testing', label: 'Testing', icon: TestTube },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Webhook Management"
        description="Manage webhooks, events, testing, and delivery analytics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Integrations', href: '/integrations' },
          { label: 'Webhooks', href: '/integrations/webhooks' }
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
                  <TestTube className="w-4 h-4 mr-2" />
                  Test All
                </ActionButton>
                <ActionButton>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Webhook
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Webhooks Tab */}
        {activeTab === 'webhooks' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search webhooks..."
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
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="testing">Testing</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Webhooks List */}
            <div className="space-y-4 mb-8">
              {filteredWebhooks.map((webhook) => {
                const StatusIcon = getStatusIcon(webhook.status);
                return (
                  <div key={webhook.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Webhook className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{webhook.name}</h3>
                            <p className="text-sm text-base-content/70 break-all">{webhook.url}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`badge ${getAuthColor(webhook.authentication)} badge-sm`}>
                                {webhook.authentication.charAt(0).toUpperCase() + webhook.authentication.slice(1)}
                              </span>
                              <span className="badge badge-outline badge-sm">
                                {webhook.events.length} events
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(webhook.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {webhook.status.charAt(0).toUpperCase() + webhook.status.slice(1)}
                          </div>
                          <div className="badge badge-outline">
                            {webhook.statistics.successRate}% success
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Events</p>
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.map((event, index) => (
                            <span key={index} className="badge badge-secondary badge-sm">
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Total Deliveries</p>
                          <p className="font-semibold">{webhook.statistics.totalDeliveries.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Success Rate</p>
                          <p className="font-semibold text-success">{webhook.statistics.successRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Failed Deliveries</p>
                          <p className="font-semibold text-error">{webhook.statistics.failedDeliveries}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Avg Response Time</p>
                          <p className="font-semibold">{webhook.statistics.averageResponseTime}ms</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Retry Policy</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>Max Retries: {webhook.retryPolicy.maxRetries}</span>
                          <span>Delay: {webhook.retryPolicy.retryDelay}ms</span>
                          <span>Backoff: {webhook.retryPolicy.backoffMultiplier}x</span>
                        </div>
                      </div>

                      {webhook.lastError && (
                        <div className="mb-4">
                          <p className="text-xs text-base-content/70 mb-1">Last Error</p>
                          <div className="bg-error/10 p-2 rounded border-l-4 border-error">
                            <p className="text-sm text-error">{webhook.lastError}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-base-content/70">
                          Last Delivery: {webhook.lastDelivery}
                        </div>
                        <div className="text-sm text-base-content/70">
                          Updated: {webhook.updatedAt}
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
                          <TestTube className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4 mb-8">
            {events.map((event, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{event.name}</h3>
                        <p className="text-sm text-base-content/70">{event.description}</p>
                      </div>
                    </div>
                    <div className="badge badge-outline">
                      {event.count} webhooks
                    </div>
                  </div>

                  <div className="card-actions justify-end">
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <TestTube className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Testing Tab */}
        {activeTab === 'testing' && (
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Webhook Testing Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {webhooks.map((webhook) => (
                    <div key={webhook.id} className="card bg-base-200">
                      <div className="card-body">
                        <h4 className="card-title text-lg">{webhook.name}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Status</span>
                            <div className={`badge ${getStatusColor(webhook.status)} badge-sm`}>
                              {webhook.status.charAt(0).toUpperCase() + webhook.status.slice(1)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Success Rate</span>
                            <span className="font-semibold text-success">{webhook.statistics.successRate}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Last Delivery</span>
                            <span className="text-xs">{webhook.lastDelivery}</span>
                          </div>
                        </div>
                        <div className="card-actions justify-end mt-4">
                          <button className="btn btn-sm btn-primary">
                            <TestTube className="w-4 h-4 mr-2" />
                            Test Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Webhook Performance</h3>
                <div className="space-y-4">
                  {webhooks.map((webhook) => (
                    <div key={webhook.id} className="p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{webhook.name}</span>
                        <span className="font-semibold text-success">{webhook.statistics.successRate}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{webhook.statistics.totalDeliveries.toLocaleString()} deliveries</span>
                        <span>{webhook.statistics.averageResponseTime}ms avg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Webhook Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Webhooks</span>
                    <span className="font-semibold">{webhooks.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Webhooks</span>
                    <span className="font-semibold text-success">
                      {webhooks.filter(w => w.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Deliveries</span>
                    <span className="font-semibold">
                      {webhooks.reduce((sum, w) => sum + w.statistics.totalDeliveries, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Failed Deliveries</span>
                    <span className="font-semibold text-error">
                      {webhooks.reduce((sum, w) => sum + w.statistics.failedDeliveries, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Success Rate</span>
                    <span className="font-semibold">
                      {(webhooks.reduce((sum, w) => sum + w.statistics.successRate, 0) / webhooks.length).toFixed(1)}%
                    </span>
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
                  <Webhook className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Webhooks</p>
                  <p className="text-2xl font-bold">{webhooks.length}</p>
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
                  <p className="text-sm text-base-content/70">Active</p>
                  <p className="text-2xl font-bold">
                    {webhooks.filter(w => w.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Deliveries</p>
                  <p className="text-2xl font-bold">
                    {webhooks.reduce((sum, w) => sum + w.statistics.totalDeliveries, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Avg Success Rate</p>
                  <p className="text-2xl font-bold">
                    {(webhooks.reduce((sum, w) => sum + w.statistics.successRate, 0) / webhooks.length).toFixed(1)}%
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