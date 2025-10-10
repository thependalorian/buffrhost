"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Shield, 
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
  Key,
  Timer,
  Users,
  Globe2,
  HardDrive,
  Wifi
} from 'lucide-react';

export default function GatewayPoliciesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('policies');

  // Sample policies data
  const policies = [
    {
      id: 'policy_001',
      name: 'CORS Policy',
      description: 'Cross-Origin Resource Sharing configuration for API endpoints',
      category: 'security',
      status: 'active',
      version: 'v1.2.0',
      priority: 1,
      rules: [
        { condition: 'origin', operator: 'equals', value: 'https://etuna.com', action: 'allow' },
        { condition: 'origin', operator: 'equals', value: 'https://admin.etuna.com', action: 'allow' },
        { condition: 'origin', operator: 'contains', value: 'localhost', action: 'allow' },
        { condition: 'origin', operator: 'wildcard', value: '*.etuna.com', action: 'allow' }
      ],
      configuration: {
        allowedOrigins: ['https://etuna.com', 'https://admin.etuna.com', 'localhost:*'],
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        maxAge: 3600,
        credentials: true
      },
      statistics: {
        requests: 12543,
        blocked: 234,
        allowed: 12309,
        blockRate: 1.9
      },
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 'policy_002',
      name: 'Rate Limiting Policy',
      description: 'Request rate limiting and throttling to prevent abuse',
      category: 'performance',
      status: 'active',
      version: 'v2.1.0',
      priority: 2,
      rules: [
        { condition: 'ip', operator: 'rate_limit', value: '100/minute', action: 'throttle' },
        { condition: 'user_id', operator: 'rate_limit', value: '1000/hour', action: 'throttle' },
        { condition: 'endpoint', operator: 'equals', value: '/api/v1/auth/login', action: 'limit_5_minute' }
      ],
      configuration: {
        defaultLimit: '100/minute',
        burstLimit: '200/minute',
        windowSize: 60,
        algorithm: 'sliding_window',
        keyBy: 'ip',
        skipSuccessfulRequests: false,
        skipFailedRequests: false
      },
      statistics: {
        requests: 8934,
        blocked: 567,
        allowed: 8367,
        blockRate: 6.3
      },
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: 'policy_003',
      name: 'Authentication Policy',
      description: 'JWT token validation and authorization checks',
      category: 'security',
      status: 'active',
      version: 'v1.5.0',
      priority: 3,
      rules: [
        { condition: 'token', operator: 'exists', value: null, action: 'require' },
        { condition: 'token', operator: 'valid', value: null, action: 'validate' },
        { condition: 'role', operator: 'in', value: ['admin', 'user'], action: 'authorize' }
      ],
      configuration: {
        tokenType: 'jwt',
        secretKey: 'encrypted_secret',
        issuer: 'etuna-auth-service',
        audience: 'etuna-api',
        expiration: 3600,
        refreshThreshold: 300
      },
      statistics: {
        requests: 15678,
        blocked: 89,
        allowed: 15589,
        blockRate: 0.6
      },
      createdAt: '2024-01-05',
      updatedAt: '2024-01-19'
    },
    {
      id: 'policy_004',
      name: 'Logging Policy',
      description: 'Request and response logging for audit and debugging',
      category: 'monitoring',
      status: 'active',
      version: 'v1.0.0',
      priority: 4,
      rules: [
        { condition: 'method', operator: 'in', value: ['POST', 'PUT', 'DELETE'], action: 'log_full' },
        { condition: 'status', operator: 'gte', value: 400, action: 'log_error' },
        { condition: 'duration', operator: 'gte', value: 1000, action: 'log_slow' }
      ],
      configuration: {
        logLevel: 'info',
        includeHeaders: true,
        includeBody: false,
        includeResponse: false,
        maxBodySize: 1024,
        sensitiveFields: ['password', 'token', 'secret']
      },
      statistics: {
        requests: 9876,
        blocked: 0,
        allowed: 9876,
        blockRate: 0
      },
      createdAt: '2024-01-12',
      updatedAt: '2024-01-20'
    },
    {
      id: 'policy_005',
      name: 'Compression Policy',
      description: 'Response compression to reduce bandwidth usage',
      category: 'performance',
      status: 'inactive',
      version: 'v1.1.0',
      priority: 5,
      rules: [
        { condition: 'content_type', operator: 'contains', value: 'application/json', action: 'compress' },
        { condition: 'content_length', operator: 'gte', value: 1024, action: 'compress' },
        { condition: 'accept_encoding', operator: 'contains', value: 'gzip', action: 'compress' }
      ],
      configuration: {
        algorithm: 'gzip',
        minSize: 1024,
        level: 6,
        types: ['application/json', 'text/html', 'text/css', 'application/javascript']
      },
      statistics: {
        requests: 0,
        blocked: 0,
        allowed: 0,
        blockRate: 0
      },
      createdAt: '2024-01-08',
      updatedAt: '2024-01-15'
    }
  ];

  const policyTemplates = [
    {
      id: 'template_001',
      name: 'Basic Security Policy',
      description: 'Standard security policy with CORS and authentication',
      category: 'security',
      policies: ['cors', 'authentication', 'rate-limiting']
    },
    {
      id: 'template_002',
      name: 'High Performance Policy',
      description: 'Performance-focused policy with compression and caching',
      category: 'performance',
      policies: ['compression', 'caching', 'rate-limiting']
    },
    {
      id: 'template_003',
      name: 'Monitoring Policy',
      description: 'Comprehensive monitoring and logging policy',
      category: 'monitoring',
      policies: ['logging', 'metrics', 'health-checks']
    },
    {
      id: 'template_004',
      name: 'Development Policy',
      description: 'Relaxed policy for development environments',
      category: 'development',
      policies: ['cors', 'logging']
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security':
        return 'text-error bg-error/10';
      case 'performance':
        return 'text-warning bg-warning/10';
      case 'monitoring':
        return 'text-info bg-info/10';
      case 'development':
        return 'text-success bg-success/10';
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
      case 'draft':
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
      case 'draft':
        return Clock;
      default:
        return Shield;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security':
        return Lock;
      case 'performance':
        return Zap;
      case 'monitoring':
        return Activity;
      case 'development':
        return Settings;
      default:
        return Shield;
    }
  };

  const filteredPolicies = policies.filter(policy =>
    policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'policies', label: 'Policies', icon: Shield },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'testing', label: 'Testing', icon: TestTube }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Gateway Policies"
        description="Policy configuration, templates, testing, and analytics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Gateway', href: '/gateway' },
          { label: 'Policies', href: '/gateway/policies' }
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
                  Create Policy
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Policies Tab */}
        {activeTab === 'policies' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search policies..."
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
                    <option value="security">Security</option>
                    <option value="performance">Performance</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="development">Development</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Policies List */}
            <div className="space-y-4 mb-8">
              {filteredPolicies.map((policy) => {
                const StatusIcon = getStatusIcon(policy.status);
                const CategoryIcon = getCategoryIcon(policy.category);
                return (
                  <div key={policy.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Shield className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{policy.name}</h3>
                            <p className="text-sm text-base-content/70">{policy.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="badge badge-outline badge-sm">
                                v{policy.version}
                              </span>
                              <span className="badge badge-outline badge-sm">
                                Priority {policy.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(policy.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                          </div>
                          <div className={`badge ${getCategoryColor(policy.category)}`}>
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {policy.category.charAt(0).toUpperCase() + policy.category.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Rules</p>
                        <div className="space-y-1">
                          {policy.rules.slice(0, 3).map((rule, index) => (
                            <div key={index} className="text-sm bg-base-200 p-2 rounded">
                              <span className="font-medium">{rule.condition}</span>
                              <span className="mx-2">{rule.operator}</span>
                              <span className="text-base-content/70">{rule.value || 'N/A'}</span>
                              <span className="ml-2 badge badge-sm badge-outline">{rule.action}</span>
                            </div>
                          ))}
                          {policy.rules.length > 3 && (
                            <div className="text-sm text-base-content/70">
                              +{policy.rules.length - 3} more rules
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Total Requests</p>
                          <p className="font-semibold">{policy.statistics.requests.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Blocked</p>
                          <p className="font-semibold text-error">{policy.statistics.blocked}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Allowed</p>
                          <p className="font-semibold text-success">{policy.statistics.allowed}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Block Rate</p>
                          <p className="font-semibold">{policy.statistics.blockRate}%</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-base-content/70">
                          Created: {policy.createdAt}
                        </div>
                        <div className="text-sm text-base-content/70">
                          Updated: {policy.updatedAt}
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
                          <Settings className="w-4 h-4" />
                        </button>
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
          <div className="space-y-4 mb-8">
            {policyTemplates.map((template, index) => {
              const CategoryIcon = getCategoryIcon(template.category);
              return (
                <div key={index} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{template.name}</h3>
                          <p className="text-sm text-base-content/70">{template.description}</p>
                        </div>
                      </div>
                      <div className={`badge ${getCategoryColor(template.category)}`}>
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-base-content/70 mb-2">Included Policies</p>
                      <div className="flex flex-wrap gap-1">
                        {template.policies.map((policy, index) => (
                          <span key={index} className="badge badge-secondary badge-sm">
                            {policy}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="card-actions justify-end">
                      <button className="btn btn-ghost btn-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="btn btn-primary btn-sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Use Template
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
                <h3 className="card-title mb-6">Policy Performance</h3>
                <div className="space-y-4">
                  {policies.map((policy) => (
                    <div key={policy.id} className="p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{policy.name}</span>
                        <span className="font-semibold">{policy.statistics.blockRate}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{policy.statistics.requests.toLocaleString()} requests</span>
                        <span>{policy.statistics.blocked} blocked</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Policy Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Policies</span>
                    <span className="font-semibold">{policies.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Policies</span>
                    <span className="font-semibold text-success">
                      {policies.filter(p => p.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Requests</span>
                    <span className="font-semibold">
                      {policies.reduce((sum, p) => sum + p.statistics.requests, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Blocked</span>
                    <span className="font-semibold text-error">
                      {policies.reduce((sum, p) => sum + p.statistics.blocked, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Block Rate</span>
                    <span className="font-semibold">
                      {(policies.reduce((sum, p) => sum + p.statistics.blockRate, 0) / policies.length).toFixed(1)}%
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
                <h3 className="card-title mb-6">Policy Testing Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {policies.map((policy) => (
                    <div key={policy.id} className="card bg-base-200">
                      <div className="card-body">
                        <h4 className="card-title text-lg">{policy.name}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Status</span>
                            <div className={`badge ${getStatusColor(policy.status)} badge-sm`}>
                              {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Block Rate</span>
                            <span className="font-semibold">{policy.statistics.blockRate}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Requests</span>
                            <span className="font-semibold">{policy.statistics.requests.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="card-actions justify-end mt-4">
                          <button className="btn btn-sm btn-primary">
                            <TestTube className="w-4 h-4 mr-2" />
                            Test Policy
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
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Policies</p>
                  <p className="text-2xl font-bold">{policies.length}</p>
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
                    {policies.filter(p => p.status === 'active').length}
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
                    {policies.reduce((sum, p) => sum + p.statistics.requests, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Blocked</p>
                  <p className="text-2xl font-bold text-error">
                    {policies.reduce((sum, p) => sum + p.statistics.blocked, 0)}
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