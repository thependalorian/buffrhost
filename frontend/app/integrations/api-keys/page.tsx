"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Key, 
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
  ExternalLink,
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
  Smartphone
} from 'lucide-react';

export default function APIKeysPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('keys');

  // Sample API keys data
  const apiKeys = [
    {
      id: 'key_001',
      name: 'Mobile App API Key',
      description: 'API key for mobile application access',
      key: 'ak_1234567890abcdef1234567890abcdef',
      status: 'active',
      type: 'application',
      permissions: ['read', 'write'],
      rateLimit: {
        requests: 1000,
        window: 'hour'
      },
      restrictions: {
        ipWhitelist: ['192.168.1.0/24'],
        userAgent: ['MobileApp/1.0'],
        referer: ['https://app.etuna.com']
      },
      usage: {
        totalRequests: 12543,
        requestsToday: 234,
        requestsThisMonth: 5678,
        lastUsed: '2024-01-20 14:30:00'
      },
      metadata: {
        createdBy: 'user_123',
        createdByName: 'John Doe',
        environment: 'production',
        service: 'mobile-app'
      },
      expiresAt: '2024-12-31 23:59:59',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 'key_002',
      name: 'Partner Integration Key',
      description: 'API key for partner system integration',
      key: 'ak_fedcba0987654321fedcba0987654321',
      status: 'active',
      type: 'partner',
      permissions: ['read'],
      rateLimit: {
        requests: 500,
        window: 'hour'
      },
      restrictions: {
        ipWhitelist: ['203.0.113.0/24'],
        userAgent: ['PartnerSystem/2.1'],
        referer: ['https://partner.example.com']
      },
      usage: {
        totalRequests: 8934,
        requestsToday: 156,
        requestsThisMonth: 3456,
        lastUsed: '2024-01-20 14:25:00'
      },
      metadata: {
        createdBy: 'user_456',
        createdByName: 'Jane Smith',
        environment: 'production',
        service: 'partner-integration'
      },
      expiresAt: '2024-06-30 23:59:59',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: 'key_003',
      name: 'Admin Dashboard Key',
      description: 'API key for administrative dashboard access',
      key: 'ak_abcdef1234567890abcdef1234567890',
      status: 'inactive',
      type: 'admin',
      permissions: ['read', 'write', 'admin'],
      rateLimit: {
        requests: 2000,
        window: 'hour'
      },
      restrictions: {
        ipWhitelist: ['10.0.0.0/8'],
        userAgent: ['AdminDashboard/1.5'],
        referer: ['https://admin.etuna.com']
      },
      usage: {
        totalRequests: 5678,
        requestsToday: 0,
        requestsThisMonth: 1234,
        lastUsed: '2024-01-18 16:45:00'
      },
      metadata: {
        createdBy: 'user_789',
        createdByName: 'Admin User',
        environment: 'production',
        service: 'admin-dashboard'
      },
      expiresAt: '2024-03-31 23:59:59',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-19'
    },
    {
      id: 'key_004',
      name: 'Testing API Key',
      description: 'API key for development and testing purposes',
      key: 'ak_test1234567890abcdef1234567890ab',
      status: 'active',
      type: 'development',
      permissions: ['read', 'write'],
      rateLimit: {
        requests: 100,
        window: 'hour'
      },
      restrictions: {
        ipWhitelist: ['127.0.0.1', 'localhost'],
        userAgent: ['TestClient/1.0'],
        referer: ['http://localhost:3000']
      },
      usage: {
        totalRequests: 2345,
        requestsToday: 45,
        requestsThisMonth: 890,
        lastUsed: '2024-01-20 14:20:00'
      },
      metadata: {
        createdBy: 'user_321',
        createdByName: 'Developer',
        environment: 'development',
        service: 'testing'
      },
      expiresAt: '2024-02-29 23:59:59',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-20'
    },
    {
      id: 'key_005',
      name: 'Webhook API Key',
      description: 'API key for webhook authentication',
      key: 'ak_webhook1234567890abcdef123456789',
      status: 'active',
      type: 'webhook',
      permissions: ['webhook'],
      rateLimit: {
        requests: 10000,
        window: 'day'
      },
      restrictions: {
        ipWhitelist: ['192.168.1.100'],
        userAgent: ['WebhookClient/1.0'],
        referer: ['https://webhook.example.com']
      },
      usage: {
        totalRequests: 15678,
        requestsToday: 567,
        requestsThisMonth: 12345,
        lastUsed: '2024-01-20 14:30:15'
      },
      metadata: {
        createdBy: 'user_654',
        createdByName: 'System Admin',
        environment: 'production',
        service: 'webhook-service'
      },
      expiresAt: '2024-08-31 23:59:59',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-20'
    }
  ];

  const keyTypes = [
    { type: 'application', name: 'Application', icon: Smartphone, count: 1, color: 'text-primary bg-primary/10' },
    { type: 'partner', name: 'Partner', icon: Building, count: 1, color: 'text-info bg-info/10' },
    { type: 'admin', name: 'Admin', icon: Shield, count: 1, color: 'text-error bg-error/10' },
    { type: 'development', name: 'Development', icon: Code, count: 1, color: 'text-warning bg-warning/10' },
    { type: 'webhook', name: 'Webhook', icon: Zap, count: 1, color: 'text-success bg-success/10' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'inactive':
        return 'text-error bg-error/10';
      case 'expired':
        return 'text-warning bg-warning/10';
      case 'revoked':
        return 'text-base-content bg-base-300';
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
      case 'expired':
        return Clock;
      case 'revoked':
        return XCircle;
      default:
        return Key;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'text-primary bg-primary/10';
      case 'partner':
        return 'text-info bg-info/10';
      case 'admin':
        return 'text-error bg-error/10';
      case 'development':
        return 'text-warning bg-warning/10';
      case 'webhook':
        return 'text-success bg-success/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'application':
        return Smartphone;
      case 'partner':
        return Building;
      case 'admin':
        return Shield;
      case 'development':
        return Code;
      case 'webhook':
        return Zap;
      default:
        return Key;
    }
  };

  const getEnvironmentColor = (environment: string) => {
    switch (environment) {
      case 'production':
        return 'text-success bg-success/10';
      case 'staging':
        return 'text-warning bg-warning/10';
      case 'development':
        return 'text-info bg-info/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const filteredKeys = apiKeys.filter(key =>
    key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.metadata.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'keys', label: 'API Keys', icon: Key },
    { id: 'types', label: 'Key Types', icon: Layers },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'testing', label: 'Testing', icon: TestTube }
  ];

  const generateNewKey = () => {
    // In a real app, this would generate a new API key
    console.log('Generating new API key...');
  };

  const revokeKey = (keyId: string) => {
    // In a real app, this would revoke the API key
    console.log('Revoking API key:', keyId);
  };

  const regenerateKey = (keyId: string) => {
    // In a real app, this would regenerate the API key
    console.log('Regenerating API key:', keyId);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="API Keys Management"
        description="API key generation, management, permissions, and usage analytics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Integrations', href: '/integrations' },
          { label: 'API Keys', href: '/integrations/api-keys' }
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
                <ActionButton onClick={generateNewKey}>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Key
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* API Keys Tab */}
        {activeTab === 'keys' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search API keys..."
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
                    <option value="expired">Expired</option>
                    <option value="revoked">Revoked</option>
                  </select>
                </div>
              </div>
            </div>

            {/* API Keys List */}
            <div className="space-y-4 mb-8">
              {filteredKeys.map((key) => {
                const StatusIcon = getStatusIcon(key.status);
                const TypeIcon = getTypeIcon(key.type);
                return (
                  <div key={key.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Key className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{key.name}</h3>
                            <p className="text-sm text-base-content/70">{key.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="badge badge-outline badge-sm">
                                {key.key.substring(0, 12)}...
                              </span>
                              <span className={`badge ${getEnvironmentColor(key.metadata.environment)} badge-sm`}>
                                {key.metadata.environment}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(key.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                          </div>
                          <div className={`badge ${getTypeColor(key.type)}`}>
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {key.type.charAt(0).toUpperCase() + key.type.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">API Key</p>
                        <div className="flex items-center space-x-2">
                          <code className="bg-base-200 px-2 py-1 rounded text-sm font-mono flex-1">
                            {key.key}
                          </code>
                          <button className="btn btn-ghost btn-sm">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Permissions</p>
                        <div className="flex flex-wrap gap-1">
                          {key.permissions.map((permission, index) => (
                            <span key={index} className="badge badge-secondary badge-sm">
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Rate Limit</p>
                        <div className="text-sm">
                          {key.rateLimit.requests} requests per {key.rateLimit.window}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Total Requests</p>
                          <p className="font-semibold">{key.usage.totalRequests.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Today</p>
                          <p className="font-semibold">{key.usage.requestsToday}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">This Month</p>
                          <p className="font-semibold">{key.usage.requestsThisMonth.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Last Used</p>
                          <p className="font-semibold text-xs">{key.usage.lastUsed}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Restrictions</p>
                        <div className="space-y-1">
                          {key.restrictions.ipWhitelist && (
                            <div className="text-sm">
                              <span className="font-medium">IP Whitelist:</span> {key.restrictions.ipWhitelist.join(', ')}
                            </div>
                          )}
                          {key.restrictions.userAgent && (
                            <div className="text-sm">
                              <span className="font-medium">User Agent:</span> {key.restrictions.userAgent.join(', ')}
                            </div>
                          )}
                          {key.restrictions.referer && (
                            <div className="text-sm">
                              <span className="font-medium">Referer:</span> {key.restrictions.referer.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Metadata</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Created By:</span> {key.metadata.createdByName}
                          </div>
                          <div>
                            <span className="font-medium">Service:</span> {key.metadata.service}
                          </div>
                          <div>
                            <span className="font-medium">Expires:</span> {key.expiresAt}
                          </div>
                          <div>
                            <span className="font-medium">Created:</span> {key.createdAt}
                          </div>
                        </div>
                      </div>

                      <div className="card-actions justify-end">
                        <button className="btn btn-ghost btn-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => regenerateKey(key.id)}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </button>
                        <button 
                          className="btn btn-error btn-sm"
                          onClick={() => revokeKey(key.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Revoke
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Types Tab */}
        {activeTab === 'types' && (
          <div className="space-y-4 mb-8">
            {keyTypes.map((type, index) => {
              const TypeIcon = type.icon;
              return (
                <div key={index} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <TypeIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{type.name}</h3>
                          <p className="text-sm text-base-content/70">
                            {type.count} API key{type.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className={`badge ${type.color}`}>
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {type.type.charAt(0).toUpperCase() + type.type.slice(1)}
                      </div>
                    </div>

                    <div className="card-actions justify-end">
                      <button className="btn btn-ghost btn-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn btn-primary btn-sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Create {type.name} Key
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
                <h3 className="card-title mb-6">API Key Usage</h3>
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{key.name}</span>
                        <span className="font-semibold">{key.usage.totalRequests.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{key.usage.requestsToday} today</span>
                        <span>{key.usage.requestsThisMonth.toLocaleString()} this month</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">API Key Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total API Keys</span>
                    <span className="font-semibold">{apiKeys.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Keys</span>
                    <span className="font-semibold text-success">
                      {apiKeys.filter(k => k.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Requests</span>
                    <span className="font-semibold">
                      {apiKeys.reduce((sum, k) => sum + k.usage.totalRequests, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Requests Today</span>
                    <span className="font-semibold">
                      {apiKeys.reduce((sum, k) => sum + k.usage.requestsToday, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Requests This Month</span>
                    <span className="font-semibold">
                      {apiKeys.reduce((sum, k) => sum + k.usage.requestsThisMonth, 0).toLocaleString()}
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
                <h3 className="card-title mb-6">API Key Testing Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="card bg-base-200">
                      <div className="card-body">
                        <h4 className="card-title text-lg">{key.name}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Status</span>
                            <div className={`badge ${getStatusColor(key.status)} badge-sm`}>
                              {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Type</span>
                            <div className={`badge ${getTypeColor(key.type)} badge-sm`}>
                              {key.type.charAt(0).toUpperCase() + key.type.slice(1)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Requests</span>
                            <span className="font-semibold">{key.usage.totalRequests.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="card-actions justify-end mt-4">
                          <button className="btn btn-sm btn-primary">
                            <TestTube className="w-4 h-4 mr-2" />
                            Test Key
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
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total API Keys</p>
                  <p className="text-2xl font-bold">{apiKeys.length}</p>
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
                  <p className="text-sm text-base-content/70">Active Keys</p>
                  <p className="text-2xl font-bold text-success">
                    {apiKeys.filter(k => k.status === 'active').length}
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
                    {apiKeys.reduce((sum, k) => sum + k.usage.totalRequests, 0).toLocaleString()}
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
                  <p className="text-sm text-base-content/70">Requests Today</p>
                  <p className="text-2xl font-bold">
                    {apiKeys.reduce((sum, k) => sum + k.usage.requestsToday, 0)}
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