"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Globe, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Server,
  Shield,
  Settings,
  BarChart3,
  Activity,
  Zap,
  Database,
  Users,
  Download,
  Upload,
  Terminal,
  Monitor,
  RefreshCw,
  Play,
  Pause,
  
  Lock,
  Unlock
} from 'lucide-react';

export default function AdminGatewayPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample API Gateway data
  const gatewayStats = {
    totalRequests: 125430,
    successfulRequests: 120890,
    failedRequests: 4540,
    averageResponseTime: 145,
    uptime: 99.8,
    activeRoutes: 45,
    totalServices: 15,
    cacheHitRate: 78.5,
    bandwidthUsed: 2.3,
    errorRate: 3.6
  };

  const routes = [
    {
      id: 'RT001',
      path: '/api/v1/auth/*',
      method: 'ALL',
      service: 'auth-service',
      status: 'active',
      priority: 1,
      rateLimit: 1000,
      timeout: 30,
      retries: 3,
      cache: true,
      cacheTTL: 300,
      authentication: 'required',
      cors: true,
      requests: 15420,
      avgResponseTime: 45,
      errorRate: 2.1,
      lastUpdated: '2024-01-20 14:30:00'
    },
    {
      id: 'RT002',
      path: '/api/v1/bookings/*',
      method: 'ALL',
      service: 'booking-service',
      status: 'active',
      priority: 2,
      rateLimit: 500,
      timeout: 60,
      retries: 2,
      cache: false,
      cacheTTL: 0,
      authentication: 'required',
      cors: true,
      requests: 8950,
      avgResponseTime: 78,
      errorRate: 1.8,
      lastUpdated: '2024-01-19 16:45:00'
    },
    {
      id: 'RT003',
      path: '/api/v1/payments/*',
      method: 'ALL',
      service: 'payment-service',
      status: 'active',
      priority: 1,
      rateLimit: 200,
      timeout: 45,
      retries: 3,
      cache: false,
      cacheTTL: 0,
      authentication: 'required',
      cors: true,
      requests: 6780,
      avgResponseTime: 156,
      errorRate: 4.2,
      lastUpdated: '2024-01-18 10:15:00'
    },
    {
      id: 'RT004',
      path: '/api/v1/public/*',
      method: 'GET',
      service: 'content-service',
      status: 'active',
      priority: 5,
      rateLimit: 5000,
      timeout: 15,
      retries: 1,
      cache: true,
      cacheTTL: 3600,
      authentication: 'none',
      cors: true,
      requests: 23400,
      avgResponseTime: 32,
      errorRate: 0.8,
      lastUpdated: '2024-01-17 09:30:00'
    },
    {
      id: 'RT005',
      path: '/api/v1/admin/*',
      method: 'ALL',
      service: 'admin-service',
      status: 'maintenance',
      priority: 1,
      rateLimit: 100,
      timeout: 30,
      retries: 2,
      cache: false,
      cacheTTL: 0,
      authentication: 'admin',
      cors: true,
      requests: 1200,
      avgResponseTime: 89,
      errorRate: 12.5,
      lastUpdated: '2024-01-16 14:20:00'
    }
  ];

  const policies = [
    {
      id: 'POL001',
      name: 'Rate Limiting',
      type: 'rate_limit',
      status: 'active',
      description: 'Global rate limiting policy',
      configuration: {
        requestsPerMinute: 1000,
        burstLimit: 2000,
        windowSize: 60
      },
      appliedTo: ['all'],
      lastModified: '2024-01-20 10:30:00'
    },
    {
      id: 'POL002',
      name: 'CORS Policy',
      type: 'cors',
      status: 'active',
      description: 'Cross-origin resource sharing policy',
      configuration: {
        allowedOrigins: ['https://etuna.com', 'https://admin.etuna.com'],
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        maxAge: 86400
      },
      appliedTo: ['all'],
      lastModified: '2024-01-19 15:45:00'
    },
    {
      id: 'POL003',
      name: 'Authentication Required',
      type: 'auth',
      status: 'active',
      description: 'Require authentication for protected routes',
      configuration: {
        tokenValidation: true,
        tokenExpiry: 3600,
        refreshToken: true
      },
      appliedTo: ['/api/v1/auth/*', '/api/v1/bookings/*', '/api/v1/payments/*'],
      lastModified: '2024-01-18 12:15:00'
    },
    {
      id: 'POL004',
      name: 'Request Logging',
      type: 'logging',
      status: 'active',
      description: 'Log all incoming requests',
      configuration: {
        logLevel: 'info',
        includeHeaders: true,
        includeBody: false,
        retentionDays: 30
      },
      appliedTo: ['all'],
      lastModified: '2024-01-17 09:20:00'
    }
  ];

  const middleware = [
    { name: 'Authentication', status: 'active', requests: 125430, avgTime: 12 },
    { name: 'Rate Limiting', status: 'active', requests: 125430, avgTime: 5 },
    { name: 'CORS', status: 'active', requests: 125430, avgTime: 3 },
    { name: 'Logging', status: 'active', requests: 125430, avgTime: 8 },
    { name: 'Caching', status: 'active', requests: 98420, avgTime: 2 },
    { name: 'Compression', status: 'active', requests: 125430, avgTime: 15 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'inactive':
        return 'text-error bg-error/10';
      case 'maintenance':
        return 'text-warning bg-warning/10';
      case 'testing':
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
      case 'maintenance':
        return Settings;
      case 'testing':
        return Clock;
      default:
        return Globe;
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
      case 'ALL':
        return 'badge-info';
      default:
        return 'badge-base-300';
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'routes', label: 'Routes', icon: Globe },
    { id: 'policies', label: 'Policies', icon: Shield },
    { id: 'middleware', label: 'Middleware', icon: Zap },
    { id: 'monitoring', label: 'Monitoring', icon: Monitor }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="API Gateway Administration"
        description="Manage API Gateway routes, policies, middleware, and monitoring"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Admin', href: '/admin' },
          { label: 'Gateway', href: '/admin/gateway' }
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
                  Add Route
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-blue-500 text-white">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Total Requests</p>
                      <p className="text-2xl font-bold">{gatewayStats.totalRequests.toLocaleString()}</p>
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
                      <p className="text-sm text-base-content/70">Success Rate</p>
                      <p className="text-2xl font-bold">{Math.round((gatewayStats.successfulRequests / gatewayStats.totalRequests) * 100)}%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-purple-500 text-white">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Avg Response Time</p>
                      <p className="text-2xl font-bold">{gatewayStats.averageResponseTime}ms</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-orange-500 text-white">
                      <Server className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Uptime</p>
                      <p className="text-2xl font-bold">{gatewayStats.uptime}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-4">Route Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Routes</span>
                      <span className="font-semibold">{gatewayStats.activeRoutes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Services</span>
                      <span className="font-semibold">{gatewayStats.totalServices}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cache Hit Rate</span>
                      <span className="font-semibold text-success">{gatewayStats.cacheHitRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-4">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Error Rate</span>
                      <span className="font-semibold text-error">{gatewayStats.errorRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bandwidth Used</span>
                      <span className="font-semibold">{gatewayStats.bandwidthUsed} GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Failed Requests</span>
                      <span className="font-semibold text-error">{gatewayStats.failedRequests.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="btn btn-sm btn-primary w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reload Config
                    </button>
                    <button className="btn btn-sm btn-outline w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export Logs
                    </button>
                    <button className="btn btn-sm btn-outline w-full">
                      <Terminal className="w-4 h-4 mr-2" />
                      Open Console
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

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
                return (
                  <div key={route.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Globe className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{route.path}</h3>
                            <p className="text-sm text-base-content/70">{route.service}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`badge ${getMethodColor(route.method)} badge-sm`}>
                                {route.method}
                              </span>
                              <span className="badge badge-outline badge-sm">
                                Priority {route.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(route.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                          </div>
                          <div className="badge badge-outline">
                            {route.requests.toLocaleString()} requests
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Rate Limit</p>
                          <p className="font-semibold">{route.rateLimit}/min</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Timeout</p>
                          <p className="font-semibold">{route.timeout}s</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Retries</p>
                          <p className="font-semibold">{route.retries}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Avg Response</p>
                          <p className="font-semibold">{route.avgResponseTime}ms</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Authentication</p>
                          <div className={`badge ${route.authentication === 'required' ? 'badge-success' : 'badge-warning'} badge-sm`}>
                            {route.authentication.charAt(0).toUpperCase() + route.authentication.slice(1)}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">CORS</p>
                          <div className={`badge ${route.cors ? 'badge-success' : 'badge-error'} badge-sm`}>
                            {route.cors ? 'Enabled' : 'Disabled'}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Cache</p>
                          <div className={`badge ${route.cache ? 'badge-success' : 'badge-error'} badge-sm`}>
                            {route.cache ? `Enabled (${route.cacheTTL}s)` : 'Disabled'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-base-content/70">
                          Error Rate: {route.errorRate}%
                        </div>
                        <div className="text-sm text-base-content/70">
                          Last Updated: {route.lastUpdated}
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
                          <BarChart3 className="w-4 h-4" />
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

        {/* Policies Tab */}
        {activeTab === 'policies' && (
          <div className="space-y-4 mb-8">
            {policies.map((policy) => {
              const StatusIcon = getStatusIcon(policy.status);
              return (
                <div key={policy.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="card-title text-lg">{policy.name}</h3>
                        <p className="text-sm text-base-content/70">{policy.type.charAt(0).toUpperCase() + policy.type.slice(1)} Policy</p>
                        <p className="text-sm font-medium">{policy.description}</p>
                      </div>
                      <div className={`badge ${getStatusColor(policy.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-base-content/70 mb-2">Applied To</p>
                      <div className="flex flex-wrap gap-1">
                        {policy.appliedTo.map((target, index) => (
                          <span key={index} className="badge badge-outline badge-sm">
                            {target}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-base-content/70 mb-2">Configuration</p>
                      <div className="bg-base-200 p-3 rounded">
                        <pre className="text-xs">
                          {JSON.stringify(policy.configuration, null, 2)}
                        </pre>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-base-content/70">
                        Last Modified: {policy.lastModified}
                      </div>
                      <div className="flex space-x-2">
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
                </div>
              );
            })}
          </div>
        )}

        {/* Middleware Tab */}
        {activeTab === 'middleware' && (
          <div className="space-y-4 mb-8">
            {middleware.map((mw, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="card-title text-lg">{mw.name}</h3>
                        <p className="text-sm text-base-content/70">Middleware Component</p>
                      </div>
                    </div>
                    <div className={`badge ${getStatusColor(mw.status)}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {mw.status.charAt(0).toUpperCase() + mw.status.slice(1)}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-base-content/70">Requests Processed</p>
                      <p className="font-semibold">{mw.requests.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/70">Average Time</p>
                      <p className="font-semibold">{mw.avgTime}ms</p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/70">Status</p>
                      <div className={`badge ${getStatusColor(mw.status)} badge-sm`}>
                        {mw.status.charAt(0).toUpperCase() + mw.status.slice(1)}
                      </div>
                    </div>
                  </div>

                  <div className="card-actions justify-end">
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
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
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Active Routes</p>
                  <p className="text-2xl font-bold">{gatewayStats.activeRoutes}</p>
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
                  <p className="text-sm text-base-content/70">Success Rate</p>
                  <p className="text-2xl font-bold">{Math.round((gatewayStats.successfulRequests / gatewayStats.totalRequests) * 100)}%</p>
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
                  <p className="text-2xl font-bold">{gatewayStats.totalRequests.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Uptime</p>
                  <p className="text-2xl font-bold">{gatewayStats.uptime}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}