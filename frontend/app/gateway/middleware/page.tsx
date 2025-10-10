"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Settings, 
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
  Wifi,
  Code,
  Layers,
  Filter as FilterIcon,
  
  Archive
} from 'lucide-react';

export default function GatewayMiddlewarePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('middleware');

  // Sample middleware data
  const middleware = [
    {
      id: 'middleware_001',
      name: 'Authentication Middleware',
      description: 'JWT token validation and user authentication',
      type: 'auth',
      status: 'active',
      version: 'v2.1.0',
      priority: 1,
      configuration: {
        tokenType: 'jwt',
        secretKey: 'encrypted_secret',
        issuer: 'etuna-auth-service',
        audience: 'etuna-api',
        expiration: 3600,
        refreshThreshold: 300,
        skipPaths: ['/health', '/metrics']
      },
      dependencies: ['redis', 'auth-service'],
      statistics: {
        requests: 12543,
        authenticated: 12498,
        failed: 45,
        successRate: 99.6,
        avgProcessingTime: 12
      },
      health: {
        status: 'healthy',
        lastCheck: '2024-01-20 14:30:00',
        responseTime: 12
      },
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 'middleware_002',
      name: 'CORS Middleware',
      description: 'Cross-Origin Resource Sharing handling',
      type: 'cors',
      status: 'active',
      version: 'v1.3.0',
      priority: 2,
      configuration: {
        allowedOrigins: ['https://etuna.com', 'https://admin.etuna.com', 'localhost:*'],
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        maxAge: 3600,
        credentials: true,
        preflightContinue: false
      },
      dependencies: [],
      statistics: {
        requests: 8934,
        authenticated: 8934,
        failed: 0,
        successRate: 100,
        avgProcessingTime: 2
      },
      health: {
        status: 'healthy',
        lastCheck: '2024-01-20 14:30:00',
        responseTime: 2
      },
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: 'middleware_003',
      name: 'Logging Middleware',
      description: 'Request and response logging for audit trails',
      type: 'logging',
      status: 'active',
      version: 'v1.2.0',
      priority: 3,
      configuration: {
        logLevel: 'info',
        includeHeaders: true,
        includeBody: false,
        includeResponse: false,
        maxBodySize: 1024,
        sensitiveFields: ['password', 'token', 'secret'],
        outputFormat: 'json'
      },
      dependencies: ['log-service'],
      statistics: {
        requests: 15678,
        authenticated: 15678,
        failed: 0,
        successRate: 100,
        avgProcessingTime: 5
      },
      health: {
        status: 'healthy',
        lastCheck: '2024-01-20 14:30:00',
        responseTime: 5
      },
      createdAt: '2024-01-05',
      updatedAt: '2024-01-19'
    },
    {
      id: 'middleware_004',
      name: 'Rate Limiting Middleware',
      description: 'Request rate limiting and throttling',
      type: 'rate-limit',
      status: 'active',
      version: 'v1.8.0',
      priority: 4,
      configuration: {
        defaultLimit: '100/minute',
        burstLimit: '200/minute',
        windowSize: 60,
        algorithm: 'sliding_window',
        keyBy: 'ip',
        skipSuccessfulRequests: false,
        skipFailedRequests: false,
        storage: 'redis'
      },
      dependencies: ['redis'],
      statistics: {
        requests: 9876,
        authenticated: 9309,
        failed: 567,
        successRate: 94.3,
        avgProcessingTime: 8
      },
      health: {
        status: 'healthy',
        lastCheck: '2024-01-20 14:30:00',
        responseTime: 8
      },
      createdAt: '2024-01-12',
      updatedAt: '2024-01-20'
    },
    {
      id: 'middleware_005',
      name: 'Compression Middleware',
      description: 'Response compression to reduce bandwidth',
      type: 'compression',
      status: 'inactive',
      version: 'v1.1.0',
      priority: 5,
      configuration: {
        algorithm: 'gzip',
        minSize: 1024,
        level: 6,
        types: ['application/json', 'text/html', 'text/css', 'application/javascript'],
        threshold: 1024
      },
      dependencies: [],
      statistics: {
        requests: 0,
        authenticated: 0,
        failed: 0,
        successRate: 0,
        avgProcessingTime: 0
      },
      health: {
        status: 'inactive',
        lastCheck: '2024-01-20 14:25:00',
        responseTime: 0
      },
      createdAt: '2024-01-08',
      updatedAt: '2024-01-15'
    },
    {
      id: 'middleware_006',
      name: 'Caching Middleware',
      description: 'Response caching for improved performance',
      type: 'caching',
      status: 'draft',
      version: 'v0.9.0',
      priority: 6,
      configuration: {
        storage: 'redis',
        ttl: 300,
        keyPrefix: 'cache:',
        skipPaths: ['/api/v1/auth/*', '/api/v1/admin/*'],
        cacheControl: 'public, max-age=300'
      },
      dependencies: ['redis'],
      statistics: {
        requests: 0,
        authenticated: 0,
        failed: 0,
        successRate: 0,
        avgProcessingTime: 0
      },
      health: {
        status: 'draft',
        lastCheck: null,
        responseTime: 0
      },
      createdAt: '2024-01-18',
      updatedAt: '2024-01-19'
    }
  ];

  const middlewareTypes = [
    { type: 'auth', name: 'Authentication', icon: Lock, count: 1, color: 'text-error bg-error/10' },
    { type: 'cors', name: 'CORS', icon: Globe, count: 1, color: 'text-info bg-info/10' },
    { type: 'logging', name: 'Logging', icon: FileText, count: 1, color: 'text-success bg-success/10' },
    { type: 'rate-limit', name: 'Rate Limiting', icon: Timer, count: 1, color: 'text-warning bg-warning/10' },
    { type: 'compression', name: 'Compression', icon: Archive, count: 1, color: 'text-base-content bg-base-300' },
    { type: 'caching', name: 'Caching', icon: Archive, count: 1, color: 'text-base-content bg-base-300' }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'auth':
        return 'text-error bg-error/10';
      case 'cors':
        return 'text-info bg-info/10';
      case 'logging':
        return 'text-success bg-success/10';
      case 'rate-limit':
        return 'text-warning bg-warning/10';
      case 'compression':
        return 'text-base-content bg-base-300';
      case 'caching':
        return 'text-base-content bg-base-300';
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
        return Settings;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'auth':
        return Lock;
      case 'cors':
        return Globe;
      case 'logging':
        return FileText;
      case 'rate-limit':
        return Timer;
      case 'compression':
        return Archive; // Using Archive as substitute for Compress
      case 'caching':
        return Archive;
      default:
        return Settings;
    }
  };

  const filteredMiddleware = middleware.filter(mw =>
    mw.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mw.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mw.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'middleware', label: 'Middleware', icon: Settings },
    { id: 'types', label: 'Types', icon: Layers },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'testing', label: 'Testing', icon: TestTube }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Gateway Middleware"
        description="Middleware configuration, management, and performance analytics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Gateway', href: '/gateway' },
          { label: 'Middleware', href: '/gateway/middleware' }
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
                  Create Middleware
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Middleware Tab */}
        {activeTab === 'middleware' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search middleware..."
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
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Middleware List */}
            <div className="space-y-4 mb-8">
              {filteredMiddleware.map((mw) => {
                const StatusIcon = getStatusIcon(mw.status);
                const TypeIcon = getTypeIcon(mw.type);
                return (
                  <div key={mw.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Settings className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{mw.name}</h3>
                            <p className="text-sm text-base-content/70">{mw.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="badge badge-outline badge-sm">
                                v{mw.version}
                              </span>
                              <span className="badge badge-outline badge-sm">
                                Priority {mw.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(mw.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {mw.status.charAt(0).toUpperCase() + mw.status.slice(1)}
                          </div>
                          <div className={`badge ${getTypeColor(mw.type)}`}>
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {mw.type.charAt(0).toUpperCase() + mw.type.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Dependencies</p>
                        <div className="flex flex-wrap gap-1">
                          {mw.dependencies.length > 0 ? (
                            mw.dependencies.map((dep, index) => (
                              <span key={index} className="badge badge-secondary badge-sm">
                                {dep}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-base-content/50">No dependencies</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Total Requests</p>
                          <p className="font-semibold">{mw.statistics.requests.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Success Rate</p>
                          <p className="font-semibold text-success">{mw.statistics.successRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Failed</p>
                          <p className="font-semibold text-error">{mw.statistics.failed}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Avg Processing Time</p>
                          <p className="font-semibold">{mw.statistics.avgProcessingTime}ms</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Configuration</p>
                        <div className="bg-base-200 p-3 rounded">
                          <pre className="text-sm overflow-x-auto">
                            {JSON.stringify(mw.configuration, null, 2)}
                          </pre>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-base-content/70">
                          Created: {mw.createdAt}
                        </div>
                        <div className="text-sm text-base-content/70">
                          Updated: {mw.updatedAt}
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

        {/* Types Tab */}
        {activeTab === 'types' && (
          <div className="space-y-4 mb-8">
            {middlewareTypes.map((type, index) => {
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
                            {type.count} middleware instance{type.count !== 1 ? 's' : ''}
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
                      <button className="btn btn-ghost btn-sm">
                        <Plus className="w-4 h-4" />
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
                <h3 className="card-title mb-6">Middleware Performance</h3>
                <div className="space-y-4">
                  {middleware.map((mw) => (
                    <div key={mw.id} className="p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{mw.name}</span>
                        <span className="font-semibold">{mw.statistics.successRate}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{mw.statistics.requests.toLocaleString()} requests</span>
                        <span>{mw.statistics.avgProcessingTime}ms avg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Middleware Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Middleware</span>
                    <span className="font-semibold">{middleware.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Middleware</span>
                    <span className="font-semibold text-success">
                      {middleware.filter(mw => mw.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Requests</span>
                    <span className="font-semibold">
                      {middleware.reduce((sum, mw) => sum + mw.statistics.requests, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Failed</span>
                    <span className="font-semibold text-error">
                      {middleware.reduce((sum, mw) => sum + mw.statistics.failed, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Success Rate</span>
                    <span className="font-semibold">
                      {(middleware.reduce((sum, mw) => sum + mw.statistics.successRate, 0) / middleware.length).toFixed(1)}%
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
                <h3 className="card-title mb-6">Middleware Testing Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {middleware.map((mw) => (
                    <div key={mw.id} className="card bg-base-200">
                      <div className="card-body">
                        <h4 className="card-title text-lg">{mw.name}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Status</span>
                            <div className={`badge ${getStatusColor(mw.status)} badge-sm`}>
                              {mw.status.charAt(0).toUpperCase() + mw.status.slice(1)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Success Rate</span>
                            <span className="font-semibold">{mw.statistics.successRate}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Processing Time</span>
                            <span className="font-semibold">{mw.statistics.avgProcessingTime}ms</span>
                          </div>
                        </div>
                        <div className="card-actions justify-end mt-4">
                          <button className="btn btn-sm btn-primary">
                            <TestTube className="w-4 h-4 mr-2" />
                            Test Middleware
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
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Middleware</p>
                  <p className="text-2xl font-bold">{middleware.length}</p>
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
                    {middleware.filter(mw => mw.status === 'active').length}
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
                    {middleware.reduce((sum, mw) => sum + mw.statistics.requests, 0).toLocaleString()}
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
                    {(middleware.reduce((sum, mw) => sum + mw.statistics.successRate, 0) / middleware.length).toFixed(1)}%
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