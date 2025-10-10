"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  ExternalLink, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
  Globe,
  Shield,
  Settings,
  BarChart3,
  Copy,
  TestTube,
  RefreshCw,
  Activity,
  Database,
  Server,
  Lock,
  Unlock,
  Play,
  Pause,
  FileText,
  Timer,
  Users,
  Globe2,
  HardDrive,
  Wifi,
  Code,
  Layers,
  Filter as FilterIcon,
  
  Archive,
  Fingerprint,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Building,
  Smartphone,
  Key,
  Mail,
  CreditCard,
  MapPin,
  Phone,
  MessageSquare,
  Cloud,
  Download,
  Upload
} from 'lucide-react';

export default function ExternalIntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('integrations');

  // Sample external integrations data
  const integrations = [
    {
      id: 'integration_001',
      name: 'Stripe Payment Gateway',
      description: 'Payment processing integration with Stripe',
      category: 'payment',
      status: 'active',
      provider: 'Stripe',
      version: 'v2023-10-16',
      configuration: {
        apiKey: 'sk_test_...',
        webhookSecret: 'whsec_...',
        currency: 'USD',
        country: 'US',
        testMode: true
      },
      endpoints: [
        { method: 'POST', path: '/v1/payment_intents', description: 'Create payment intent' },
        { method: 'POST', path: '/v1/charges', description: 'Create charge' },
        { method: 'GET', path: '/v1/payment_methods', description: 'List payment methods' }
      ],
      statistics: {
        requests: 12543,
        success: 12498,
        failed: 45,
        successRate: 99.6,
        avgResponseTime: 245
      },
      health: {
        status: 'healthy',
        lastCheck: '2024-01-20 14:30:00',
        responseTime: 245
      },
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 'integration_002',
      name: 'SendGrid Email Service',
      description: 'Email delivery service integration',
      category: 'communication',
      status: 'active',
      provider: 'SendGrid',
      version: 'v3',
      configuration: {
        apiKey: 'SG.xxx...',
        fromEmail: 'noreply@etuna.com',
        fromName: 'Etuna Guesthouse',
        templateId: 'd-template-id'
      },
      endpoints: [
        { method: 'POST', path: '/v3/mail/send', description: 'Send email' },
        { method: 'GET', path: '/v3/suppression/bounces', description: 'Get bounces' },
        { method: 'GET', path: '/v3/stats', description: 'Get statistics' }
      ],
      statistics: {
        requests: 8934,
        success: 8756,
        failed: 178,
        successRate: 98.0,
        avgResponseTime: 189
      },
      health: {
        status: 'healthy',
        lastCheck: '2024-01-20 14:30:00',
        responseTime: 189
      },
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: 'integration_003',
      name: 'Google Maps API',
      description: 'Location services and mapping integration',
      category: 'location',
      status: 'active',
      provider: 'Google',
      version: 'v1',
      configuration: {
        apiKey: 'AIza...',
        region: 'US',
        language: 'en',
        restrictions: ['HTTP referrers']
      },
      endpoints: [
        { method: 'GET', path: '/maps/api/geocode/json', description: 'Geocode address' },
        { method: 'GET', path: '/maps/api/directions/json', description: 'Get directions' },
        { method: 'GET', path: '/maps/api/place/details/json', description: 'Get place details' }
      ],
      statistics: {
        requests: 5678,
        success: 5654,
        failed: 24,
        successRate: 99.6,
        avgResponseTime: 156
      },
      health: {
        status: 'healthy',
        lastCheck: '2024-01-20 14:30:00',
        responseTime: 156
      },
      createdAt: '2024-01-05',
      updatedAt: '2024-01-19'
    },
    {
      id: 'integration_004',
      name: 'Twilio SMS Service',
      description: 'SMS messaging service integration',
      category: 'communication',
      status: 'inactive',
      provider: 'Twilio',
      version: 'v1',
      configuration: {
        accountSid: 'ACxxx...',
        authToken: 'xxx...',
        fromNumber: '+1234567890',
        webhookUrl: 'https://api.etuna.com/webhooks/twilio'
      },
      endpoints: [
        { method: 'POST', path: '/v1/Messages', description: 'Send SMS' },
        { method: 'GET', path: '/v1/Messages', description: 'List messages' },
        { method: 'GET', path: '/v1/Accounts/{AccountSid}', description: 'Get account info' }
      ],
      statistics: {
        requests: 2345,
        success: 2301,
        failed: 44,
        successRate: 98.1,
        avgResponseTime: 234
      },
      health: {
        status: 'warning',
        lastCheck: '2024-01-20 14:25:00',
        responseTime: 234
      },
      createdAt: '2024-01-12',
      updatedAt: '2024-01-19'
    },
    {
      id: 'integration_005',
      name: 'Supabase Storage',
      description: 'Cloud storage integration for file uploads',
      category: 'storage',
      status: 'active',
      provider: 'Supabase',
      version: 'v1',
      configuration: {
        projectUrl: 'https://xxx.supabase.co',
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        bucket: 'etuna-storage',
        region: 'us-east-1'
      },
      endpoints: [
        { method: 'POST', path: '/storage/v1/object/{bucket}', description: 'Upload file' },
        { method: 'GET', path: '/storage/v1/object/{bucket}/{path}', description: 'Download file' },
        { method: 'DELETE', path: '/storage/v1/object/{bucket}/{path}', description: 'Delete file' }
      ],
      statistics: {
        requests: 9876,
        success: 9854,
        failed: 22,
        successRate: 99.8,
        avgResponseTime: 89
      },
      health: {
        status: 'healthy',
        lastCheck: '2024-01-20 14:30:00',
        responseTime: 89
      },
      createdAt: '2024-01-08',
      updatedAt: '2024-01-20'
    },
    {
      id: 'integration_006',
      name: 'Slack Notifications',
      description: 'Team communication and notification integration',
      category: 'communication',
      status: 'active',
      provider: 'Slack',
      version: 'v1',
      configuration: {
        botToken: 'xoxb-...',
        appToken: 'xapp-...',
        signingSecret: 'xxx...',
        channel: '#alerts',
        webhookUrl: 'https://hooks.slack.com/services/...'
      },
      endpoints: [
        { method: 'POST', path: '/api/chat.postMessage', description: 'Send message' },
        { method: 'POST', path: '/api/conversations.create', description: 'Create channel' },
        { method: 'GET', path: '/api/users.list', description: 'List users' }
      ],
      statistics: {
        requests: 3456,
        success: 3423,
        failed: 33,
        successRate: 99.0,
        avgResponseTime: 167
      },
      health: {
        status: 'healthy',
        lastCheck: '2024-01-20 14:30:00',
        responseTime: 167
      },
      createdAt: '2024-01-14',
      updatedAt: '2024-01-20'
    }
  ];

  const integrationCategories = [
    { category: 'payment', name: 'Payment', icon: CreditCard, count: 1, color: 'text-success bg-success/10' },
    { category: 'communication', name: 'Communication', icon: MessageSquare, count: 3, color: 'text-info bg-info/10' },
    { category: 'location', name: 'Location', icon: MapPin, count: 1, color: 'text-warning bg-warning/10' },
    { category: 'storage', name: 'Storage', icon: Cloud, count: 1, color: 'text-primary bg-primary/10' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'payment':
        return 'text-success bg-success/10';
      case 'communication':
        return 'text-info bg-info/10';
      case 'location':
        return 'text-warning bg-warning/10';
      case 'storage':
        return 'text-primary bg-primary/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'inactive':
        return 'text-error bg-error/10';
      case 'maintenance':
        return 'text-warning bg-warning/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'inactive':
        return AlertTriangle;
      case 'maintenance':
        return Clock;
      default:
        return ExternalLink;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment':
        return CreditCard;
      case 'communication':
        return MessageSquare;
      case 'location':
        return MapPin;
      case 'storage':
        return Cloud;
      default:
        return ExternalLink;
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-success bg-success/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'error':
        return 'text-error bg-error/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'error':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    integration.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    integration.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'integrations', label: 'Integrations', icon: ExternalLink },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'testing', label: 'Testing', icon: TestTube }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="External Integrations"
        description="Third-party service integrations, configuration, and monitoring"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Integrations', href: '/integrations' },
          { label: 'External Services', href: '/integrations/external' }
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
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </ActionButton>
                <ActionButton>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Integration
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search integrations..."
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
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="payment">Payment</option>
                    <option value="communication">Communication</option>
                    <option value="location">Location</option>
                    <option value="storage">Storage</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Integrations List */}
            <div className="space-y-4 mb-8">
              {filteredIntegrations.map((integration) => {
                const StatusIcon = getStatusIcon(integration.status);
                const CategoryIcon = getCategoryIcon(integration.category);
                const HealthIcon = getHealthIcon(integration.health.status);
                return (
                  <div key={integration.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <ExternalLink className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{integration.name}</h3>
                            <p className="text-sm text-base-content/70">{integration.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="badge badge-outline badge-sm">
                                {integration.provider}
                              </span>
                              <span className="badge badge-outline badge-sm">
                                {integration.version}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(integration.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                          </div>
                          <div className={`badge ${getCategoryColor(integration.category)}`}>
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {integration.category.charAt(0).toUpperCase() + integration.category.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">API Endpoints</p>
                        <div className="space-y-1">
                          {integration.endpoints.slice(0, 3).map((endpoint, index) => (
                            <div key={index} className="text-sm bg-base-200 p-2 rounded">
                              <span className="badge badge-sm badge-outline mr-2">{endpoint.method}</span>
                              <span className="font-mono">{endpoint.path}</span>
                              <span className="text-base-content/70 ml-2">- {endpoint.description}</span>
                            </div>
                          ))}
                          {integration.endpoints.length > 3 && (
                            <div className="text-sm text-base-content/70">
                              +{integration.endpoints.length - 3} more endpoints
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Total Requests</p>
                          <p className="font-semibold">{integration.statistics.requests.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Success Rate</p>
                          <p className="font-semibold text-success">{integration.statistics.successRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Failed</p>
                          <p className="font-semibold text-error">{integration.statistics.failed}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Avg Response Time</p>
                          <p className="font-semibold">{integration.statistics.avgResponseTime}ms</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Health Status</p>
                        <div className="flex items-center space-x-2">
                          <div className={`badge ${getHealthColor(integration.health.status)}`}>
                            <HealthIcon className="w-3 h-3 mr-1" />
                            {integration.health.status.charAt(0).toUpperCase() + integration.health.status.slice(1)}
                          </div>
                          <span className="text-sm">
                            Response Time: {integration.health.responseTime}ms
                          </span>
                          <span className="text-sm text-base-content/70">
                            Last Check: {integration.health.lastCheck}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Configuration</p>
                        <div className="bg-base-200 p-3 rounded">
                          <pre className="text-sm overflow-x-auto">
                            {JSON.stringify(integration.configuration, null, 2)}
                          </pre>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-base-content/70">
                          Created: {integration.createdAt}
                        </div>
                        <div className="text-sm text-base-content/70">
                          Updated: {integration.updatedAt}
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
                          <Settings className="w-4 h-4" />
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

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-4 mb-8">
            {integrationCategories.map((category, index) => {
              const CategoryIcon = category.icon;
              return (
                <div key={index} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <CategoryIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          <p className="text-sm text-base-content/70">
                            {category.count} integration{category.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className={`badge ${category.color}`}>
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
                      </div>
                    </div>

                    <div className="card-actions justify-end">
                      <button className="btn btn-ghost btn-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn btn-primary btn-sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add {category.name} Integration
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Integration Performance</h3>
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{integration.name}</span>
                        <span className="font-semibold">{integration.statistics.successRate}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{integration.statistics.requests.toLocaleString()} requests</span>
                        <span>{integration.statistics.avgResponseTime}ms avg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Integration Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Integrations</span>
                    <span className="font-semibold">{integrations.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Integrations</span>
                    <span className="font-semibold text-success">
                      {integrations.filter(i => i.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Requests</span>
                    <span className="font-semibold">
                      {integrations.reduce((sum, i) => sum + i.statistics.requests, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Failed</span>
                    <span className="font-semibold text-error">
                      {integrations.reduce((sum, i) => sum + i.statistics.failed, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Success Rate</span>
                    <span className="font-semibold">
                      {(integrations.reduce((sum, i) => sum + i.statistics.successRate, 0) / integrations.length).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Testing Tab */}
        {activeTab === 'testing' && (
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Integration Testing Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="card bg-base-200">
                      <div className="card-body">
                        <h4 className="card-title text-lg">{integration.name}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Status</span>
                            <div className={`badge ${getStatusColor(integration.status)} badge-sm`}>
                              {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Health</span>
                            <div className={`badge ${getHealthColor(integration.health.status)} badge-sm`}>
                              {integration.health.status.charAt(0).toUpperCase() + integration.health.status.slice(1)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Success Rate</span>
                            <span className="font-semibold">{integration.statistics.successRate}%</span>
                          </div>
                        </div>
                        <div className="card-actions justify-end mt-4">
                          <button className="btn btn-sm btn-primary">
                            <TestTube className="w-4 h-4 mr-2" />
                            Test Integration
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <ExternalLink className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Integrations</p>
                  <p className="text-2xl font-bold">{integrations.length}</p>
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
                  <p className="text-2xl font-bold text-success">
                    {integrations.filter(i => i.status === 'active').length}
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
                  <p className="text-sm text-base-content/70">Total Requests</p>
                  <p className="text-2xl font-bold">
                    {integrations.reduce((sum, i) => sum + i.statistics.requests, 0).toLocaleString()}
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
                    {(integrations.reduce((sum, i) => sum + i.statistics.successRate, 0) / integrations.length).toFixed(1)}%
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