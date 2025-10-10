"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Route, 
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
  Pause
} from 'lucide-react';

export default function GatewayRoutesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('routes');

  // Sample routes data
  const routes = [
    {
      id: 'route_001',
      name: 'Authentication API',
      path: '/api/v1/auth/*',
      method: 'ALL',
      target: 'auth-service:8001',
      status: 'active',
      priority: 1,
      timeout: 30000,
      retries: 3,
      rateLimit: {
        enabled: true,
        requests: 100,
        window: '1m'
      },
      authentication: {
        required: true,
        type: 'jwt',
        roles: ['user', 'admin']
      },
      policies: ['cors', 'logging', 'rate-limit'],
      middleware: ['auth', 'cors', 'logging'],
      statistics: {
        requests: 12543,
        success: 12498,
        failed: 45,
        avgResponseTime: 45,
        lastRequest: '2024-01-20 14:30:00'
      },
      health: {
        status: 'healthy',
        lastCheck: '2024-01-20 14:29:45',
        responseTime: 45
      },
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 'route_002',
      name: 'Booking API',
      path: '/api/v1/bookings/*',
      method: 'ALL',
      target: 'booking-service:8002',
      status: 'active',
      priority: 2,
      timeout: 60000,
      retries: 2,
      rateLimit: {
        enabled: true,
        requests: 50,
        window: '1m'
      },
      authentication: {
        required: true,
        type: 'jwt',
        roles: ['user', 'admin']
      },
      policies: ['cors', 'logging', 'rate-limit'],
      middleware: ['auth', 'cors', 'logging'],
      statistics: {
        requests: 8934,
        success: 8756,
        failed: 178,
        avgResponseTime: 120,
        lastRequest: '2024-01-20 14:29:30'
      },
      health: {
        status: 'warning',
        lastCheck: '2024-01-20 14:29:30',
        responseTime: 120
      },
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: 'route_003',
      name: 'Payment API',
      path: '/api/v1/payments/*',
      method: 'ALL',
      target: 'payment-service:8003',
      status: 'inactive',
      priority: 3,
      timeout: 45000,
      retries: 3,
      rateLimit: {
        enabled: true,
        requests: 200,
        window: '1m'
      },
      authentication: {
        required: true,
        type: 'jwt',
        roles: ['user', 'admin']
      },
      policies: ['cors', 'logging', 'rate-limit', 'encryption'],
      middleware: ['auth', 'cors', 'logging', 'encryption'],
      statistics: {
        requests: 0,
        success: 0,
        failed: 0,
        avgResponseTime: 0,
        lastRequest: null
      },
      health: {
        status: 'error',
        lastCheck: '2024-01-20 14:25:12',
        responseTime: 0
      },
      createdAt: '2024-01-05',
      updatedAt: '2024-01-19'
    },
    {
      id: 'route_004',
      name: 'Notification API',
      path: '/api/v1/notifications/*',
      method: 'ALL',
      target: 'notification-service:8004',
      status: 'active',
      priority: 4,
      timeout: 30000,
      retries: 2,
      rateLimit: {
        enabled: true,
        requests: 300,
        window: '1m'
      },
      authentication: {
        required: true,
        type: 'jwt',
        roles: ['user', 'admin']
      },
      policies: ['cors', 'logging', 'rate-limit'],
      middleware: ['auth', 'cors', 'logging'],
      statistics: {
        requests: 15678,
        success: 15623,
        failed: 55,
        avgResponseTime: 78,
        lastRequest: '2024-01-20 14:30:15'
      },
      health: {
        status: 'healthy',
        lastCheck: '2024-01-20 14:30:15',
        responseTime: 78
      },
      createdAt: '2024-01-12',
      updatedAt: '2024-01-20'
    },
    {
      id: 'route_005',
      name: 'Analytics API',
      path: '/api/v1/analytics/*',
      method: 'ALL',
      target: 'analytics-service:8005',
      status: 'active',
      priority: 5,
      timeout: 60000,
      retries: 2,
      rateLimit: {
        enabled: true,
        requests: 100,
        window: '1m'
      },
      authentication: {
        required: true,
        type: 'jwt',
        roles: ['admin', 'analyst']
      },
      policies: ['cors', 'logging', 'rate-limit'],
      middleware: ['auth', 'cors', 'logging'],
      statistics: {
        requests: 9876,
        success: 9854,
        failed: 22,
        avgResponseTime: 92,
        lastRequest: '2024-01-20 14:30:08'
      },
      health: {
        status: 'healthy',
        lastCheck: '2024-01-20 14:30:08',
        responseTime: 92
      },
      createdAt: '2024-01-08',
      updatedAt: '2024-01-19'
    }
  ];

  const policies = [
    { id: 'cors', name: 'CORS Policy', description: 'Cross-Origin Resource Sharing configuration', enabled: true },
    { id: 'logging', name: 'Logging Policy', description: 'Request and response logging', enabled: true },
    { id: 'rate-limit', name: 'Rate Limiting', description: 'Request rate limiting and throttling', enabled: true },
    { id: 'encryption', name: 'Encryption Policy', description: 'Data encryption for sensitive endpoints', enabled: false },
    { id: 'compression', name: 'Compression Policy', description: 'Response compression', enabled: false },
    { id: 'caching', name: 'Caching Policy', description: 'Response caching', enabled: false }
  ];

  const middleware = [
    { id: 'auth', name: 'Authentication', description: 'JWT token validation', enabled: true },
    { id: 'cors', name: 'CORS Handler', description: 'Cross-origin request handling', enabled: true },
    { id: 'logging', name: 'Request Logger', description: 'Request and response logging', enabled: true },
    { id: 'encryption', name: 'Data Encryption', description: 'Request/response encryption', enabled: false },
    { id: 'compression', name: 'Response Compression', description: 'Gzip compression', enabled: false },
    { id: 'caching', name: 'Response Caching', description: 'Redis-based caching', enabled: false }
  ];

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
        return Route;
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

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'badge-success';
      case 'POST':
        return 'badge-primary';
      case 'PUT':
        return 'badge-warning';
      case 'DELETE':
        return 'badge-error';
      case 'PATCH':
        return 'badge-info';
      case 'ALL':
        return 'badge-secondary';
      default:
        return 'badge-base-300';
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'routes', label: 'Routes', icon: Route },
    { id: 'policies', label: 'Policies', icon: Shield },
    { id: 'middleware', label: 'Middleware', icon: Settings },
    { id: 'testing', label: 'Testing', icon: TestTube }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="API Gateway Routes"
        description="Route configuration, testing tools, performance analytics, and security settings"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Gateway', href: '/gateway' },
          { label: 'Routes', href: '/gateway/routes' }
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
                  Create Route
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Routes Tab */}
        {activeTab === 'routes' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search routes..."
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
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Routes List */}
            <div className="space-y-4 mb-8">
              {filteredRoutes.map((route) => {
                const StatusIcon = getStatusIcon(route.status);
                const HealthIcon = getHealthIcon(route.health.status);
                return (
                  <div key={route.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Route className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{route.name}</h3>
                            <p className="text-sm text-base-content/70">{route.path}</p>
                            <p className="text-xs text-base-content/50">Target: {route.target}</p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(route.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                          </div>
                          <div className={`badge ${getHealthColor(route.health.status)}`}>
                            <HealthIcon className="w-3 h-3 mr-1" />
                            {route.health.status.charAt(0).toUpperCase() + route.health.status.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Method</p>
                          <span className={`badge ${getMethodColor(route.method)} badge-sm`}>
                            {route.method}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Priority</p>
                          <p className="font-semibold">{route.priority}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Timeout</p>
                          <p className="font-semibold">{route.timeout}ms</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Retries</p>
                          <p className="font-semibold">{route.retries}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Rate Limiting</p>
                        <div className="flex items-center space-x-2">
                          <span className={`badge ${route.rateLimit.enabled ? 'badge-success' : 'badge-error'} badge-sm`}>
                            {route.rateLimit.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                          {route.rateLimit.enabled && (
                            <span className="text-sm">
                              {route.rateLimit.requests} requests per {route.rateLimit.window}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Authentication</p>
                        <div className="flex items-center space-x-2">
                          <span className={`badge ${route.authentication.required ? 'badge-error' : 'badge-success'} badge-sm`}>
                            {route.authentication.required ? 'Required' : 'Optional'}
                          </span>
                          {route.authentication.required && (
                            <span className="text-sm">
                              {route.authentication.type.toUpperCase()} - {route.authentication.roles.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Policies</p>
                        <div className="flex flex-wrap gap-1">
                          {route.policies.map((policy, index) => (
                            <span key={index} className="badge badge-secondary badge-sm">
                              {policy}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Middleware</p>
                        <div className="flex flex-wrap gap-1">
                          {route.middleware.map((middleware, index) => (
                            <span key={index} className="badge badge-accent badge-sm">
                              {middleware}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Total Requests</p>
                          <p className="font-semibold">{route.statistics.requests.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Success Rate</p>
                          <p className="font-semibold text-success">
                            {route.statistics.requests > 0 ? 
                              ((route.statistics.success / route.statistics.requests) * 100).toFixed(1) : 0}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Avg Response Time</p>
                          <p className="font-semibold">{route.statistics.avgResponseTime}ms</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Last Request</p>
                          <p className="font-semibold text-xs">{route.statistics.lastRequest || 'Never'}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-base-content/70">
                          Created: {route.createdAt}
                        </div>
                        <div className="text-sm text-base-content/70">
                          Updated: {route.updatedAt}
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

        {/* Policies Tab */}
        {activeTab === 'policies' && (
          <div className="space-y-4 mb-8">
            {policies.map((policy, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{policy.name}</h3>
                        <p className="text-sm text-base-content/70">{policy.description}</p>
                      </div>
                    </div>
                    <div className={`badge ${policy.enabled ? 'badge-success' : 'badge-error'}`}>
                      {policy.enabled ? 'Enabled' : 'Disabled'}
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
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Middleware Tab */}
        {activeTab === 'middleware' && (
          <div className="space-y-4 mb-8">
            {middleware.map((middleware, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Settings className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{middleware.name}</h3>
                        <p className="text-sm text-base-content/70">{middleware.description}</p>
                      </div>
                    </div>
                    <div className={`badge ${middleware.enabled ? 'badge-success' : 'badge-error'}`}>
                      {middleware.enabled ? 'Enabled' : 'Disabled'}
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
                      <Settings className="w-4 h-4" />
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
                <h3 className="card-title mb-6">Route Testing Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {routes.map((route) => (
                    <div key={route.id} className="card bg-base-200">
                      <div className="card-body">
                        <h4 className="card-title text-lg">{route.name}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Status</span>
                            <div className={`badge ${getStatusColor(route.status)} badge-sm`}>
                              {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Health</span>
                            <div className={`badge ${getHealthColor(route.health.status)} badge-sm`}>
                              {route.health.status.charAt(0).toUpperCase() + route.health.status.slice(1)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Response Time</span>
                            <span className="font-semibold">{route.health.responseTime}ms</span>
                          </div>
                        </div>
                        <div className="card-actions justify-end mt-4">
                          <button className="btn btn-sm btn-primary">
                            <TestTube className="w-4 h-4 mr-2" />
                            Test Route
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
                  <Route className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Routes</p>
                  <p className="text-2xl font-bold">{routes.length}</p>
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
                  <p className="text-sm text-base-content/70">Active Routes</p>
                  <p className="text-2xl font-bold text-success">
                    {routes.filter(r => r.status === 'active').length}
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
                    {routes.reduce((sum, r) => sum + r.statistics.requests, 0).toLocaleString()}
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
                  <p className="text-sm text-base-content/70">Avg Response Time</p>
                  <p className="text-2xl font-bold">
                    {Math.round(routes.reduce((sum, r) => sum + r.statistics.avgResponseTime, 0) / routes.length)}ms
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