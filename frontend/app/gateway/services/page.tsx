"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Server, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  Globe,
  Shield,
  Zap,
  Database,
  Users,
  Settings
} from 'lucide-react';

export default function GatewayServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('services');

  // Sample services data
  const services = [
    {
      id: 'SVC001',
      name: 'auth-service',
      version: '1.2.0',
      port: 8001,
      host: 'localhost',
      status: 'healthy',
      uptime: 99.8,
      responseTime: 45,
      lastHealthCheck: '2024-01-20 14:30:00',
      endpoints: 12,
      requests: 15420,
      errors: 23,
      description: 'Authentication and authorization service',
      tags: ['core', 'authentication', 'security']
    },
    {
      id: 'SVC002',
      name: 'booking-service',
      version: '1.1.5',
      port: 8002,
      host: 'localhost',
      status: 'healthy',
      uptime: 99.5,
      responseTime: 78,
      lastHealthCheck: '2024-01-20 14:30:00',
      endpoints: 18,
      requests: 8950,
      errors: 12,
      description: 'Room booking and reservation management',
      tags: ['core', 'booking', 'reservations']
    },
    {
      id: 'SVC003',
      name: 'payment-service',
      version: '1.3.2',
      port: 8003,
      host: 'localhost',
      status: 'warning',
      uptime: 98.2,
      responseTime: 156,
      lastHealthCheck: '2024-01-20 14:25:00',
      endpoints: 15,
      requests: 6780,
      errors: 45,
      description: 'Payment processing and transaction management',
      tags: ['core', 'payment', 'transactions']
    },
    {
      id: 'SVC004',
      name: 'notification-service',
      version: '1.0.8',
      port: 8004,
      host: 'localhost',
      status: 'error',
      uptime: 95.1,
      responseTime: 234,
      lastHealthCheck: '2024-01-20 14:20:00',
      endpoints: 8,
      requests: 3240,
      errors: 89,
      description: 'Email and SMS notification service',
      tags: ['core', 'notifications', 'communication']
    },
    {
      id: 'SVC005',
      name: 'analytics-service',
      version: '2.0.1',
      port: 8005,
      host: 'localhost',
      status: 'healthy',
      uptime: 99.9,
      responseTime: 32,
      lastHealthCheck: '2024-01-20 14:30:00',
      endpoints: 22,
      requests: 12300,
      errors: 5,
      description: 'Business analytics and reporting service',
      tags: ['core', 'analytics', 'reporting']
    }
  ];

  const routes = [
    {
      id: 'RT001',
      path: '/api/v1/auth/*',
      service: 'auth-service',
      method: 'ALL',
      status: 'active',
      rateLimit: '1000/hour',
      timeout: '30s',
      requests: 15420,
      avgResponseTime: 45,
      errors: 23
    },
    {
      id: 'RT002',
      path: '/api/v1/bookings/*',
      service: 'booking-service',
      method: 'ALL',
      status: 'active',
      rateLimit: '500/hour',
      timeout: '60s',
      requests: 8950,
      avgResponseTime: 78,
      errors: 12
    },
    {
      id: 'RT003',
      path: '/api/v1/payments/*',
      service: 'payment-service',
      method: 'POST,PUT',
      status: 'active',
      rateLimit: '200/hour',
      timeout: '45s',
      requests: 6780,
      avgResponseTime: 156,
      errors: 45
    },
    {
      id: 'RT004',
      path: '/api/v1/notifications/*',
      service: 'notification-service',
      method: 'POST',
      status: 'paused',
      rateLimit: '100/hour',
      timeout: '30s',
      requests: 3240,
      avgResponseTime: 234,
      errors: 89
    }
  ];

  const policies = [
    {
      id: 'POL001',
      name: 'Authentication Required',
      type: 'auth',
      status: 'active',
      services: ['booking-service', 'payment-service'],
      description: 'Requires valid JWT token for access'
    },
    {
      id: 'POL002',
      name: 'Rate Limiting',
      type: 'rate-limit',
      status: 'active',
      services: ['auth-service', 'booking-service'],
      description: 'Limits requests per user/IP address'
    },
    {
      id: 'POL003',
      name: 'CORS Policy',
      type: 'cors',
      status: 'active',
      services: ['*'],
      description: 'Cross-origin resource sharing configuration'
    },
    {
      id: 'POL004',
      name: 'Request Logging',
      type: 'logging',
      status: 'active',
      services: ['*'],
      description: 'Logs all incoming requests and responses'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-success bg-success/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'error':
        return 'text-error bg-error/10';
      case 'active':
        return 'text-success bg-success/10';
      case 'paused':
        return 'text-warning bg-warning/10';
      case 'inactive':
        return 'text-error bg-error/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
        return CheckCircle;
      case 'warning':
      case 'paused':
        return AlertCircle;
      case 'error':
      case 'inactive':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.5) return 'text-success';
    if (uptime >= 98.0) return 'text-warning';
    return 'text-error';
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime <= 100) return 'text-success';
    if (responseTime <= 200) return 'text-warning';
    return 'text-error';
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'services', label: 'Services', icon: Server },
    { id: 'routes', label: 'Routes', icon: Globe },
    { id: 'policies', label: 'Policies', icon: Shield },
    { id: 'monitoring', label: 'Monitoring', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="API Gateway Services"
        description="Manage microservices, routes, and policies for the API Gateway"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'API Gateway', href: '/gateway' },
          { label: 'Services', href: '/gateway/services' }
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
                  Add Service
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search services..."
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
                    <option value="healthy">Healthy</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredServices.map((service) => {
                const StatusIcon = getStatusIcon(service.status);
                return (
                  <div key={service.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="card-title text-lg">{service.name}</h3>
                          <p className="text-sm text-base-content/70">v{service.version}</p>
                          <p className="text-sm font-semibold">{service.host}:{service.port}</p>
                        </div>
                        <div className={`badge ${getStatusColor(service.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-3">
                          <Database className="w-4 h-4 text-primary" />
                          <span className="text-sm">{service.endpoints} endpoints</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Activity className="w-4 h-4 text-primary" />
                          <span className="text-sm">{service.requests.toLocaleString()} requests</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm">Last check: {service.lastHealthCheck}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Uptime</p>
                          <p className={`font-semibold ${getUptimeColor(service.uptime)}`}>
                            {service.uptime}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Response Time</p>
                          <p className={`font-semibold ${getResponseTimeColor(service.responseTime)}`}>
                            {service.responseTime}ms
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Tags</p>
                        <div className="flex flex-wrap gap-1">
                          {service.tags.map((tag, index) => (
                            <span key={index} className="badge badge-outline badge-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-1">Description</p>
                        <p className="text-sm bg-base-200 p-2 rounded">{service.description}</p>
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
                );
              })}
            </div>
          </>
        )}

        {/* Routes Tab */}
        {activeTab === 'routes' && (
          <div className="space-y-6 mb-8">
            {routes.map((route) => {
              const StatusIcon = getStatusIcon(route.status);
              return (
                <div key={route.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="card-title text-lg">{route.path}</h3>
                        <p className="text-sm text-base-content/70">Service: {route.service}</p>
                        <p className="text-sm font-semibold">Method: {route.method}</p>
                      </div>
                      <div className={`badge ${getStatusColor(route.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-base-content/70">Rate Limit</p>
                        <p className="font-semibold">{route.rateLimit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Timeout</p>
                        <p className="font-semibold">{route.timeout}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Requests</p>
                        <p className="font-semibold">{route.requests.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-base-content/70">Avg Response Time</p>
                        <p className={`font-semibold ${getResponseTimeColor(route.avgResponseTime)}`}>
                          {route.avgResponseTime}ms
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Errors</p>
                        <p className={`font-semibold ${route.errors > 50 ? 'text-error' : 'text-success'}`}>
                          {route.errors}
                        </p>
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
                        {route.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Policies Tab */}
        {activeTab === 'policies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {policies.map((policy) => {
              const StatusIcon = getStatusIcon(policy.status);
              return (
                <div key={policy.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="card-title text-lg">{policy.name}</h3>
                        <p className="text-sm text-base-content/70">Type: {policy.type}</p>
                        <p className="text-sm font-semibold">Policy ID: {policy.id}</p>
                      </div>
                      <div className={`badge ${getStatusColor(policy.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-base-content/70 mb-2">Applied to Services</p>
                      <div className="flex flex-wrap gap-1">
                        {policy.services.map((service, index) => (
                          <span key={index} className="badge badge-primary badge-sm">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-base-content/70 mb-1">Description</p>
                      <p className="text-sm bg-base-200 p-2 rounded">{policy.description}</p>
                    </div>

                    <div className="card-actions justify-end">
                      <button className="btn btn-ghost btn-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        {policy.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Service Health Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Healthy Services</span>
                    <span className="font-semibold text-success">
                      {services.filter(s => s.status === 'healthy').length}/{services.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Warning Services</span>
                    <span className="font-semibold text-warning">
                      {services.filter(s => s.status === 'warning').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error Services</span>
                    <span className="font-semibold text-error">
                      {services.filter(s => s.status === 'error').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Requests</span>
                    <span className="font-semibold">
                      {services.reduce((sum, s) => sum + s.requests, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Errors</span>
                    <span className="font-semibold text-error">
                      {services.reduce((sum, s) => sum + s.errors, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Response Time</span>
                    <span className="font-semibold">
                      {Math.round(services.reduce((sum, s) => sum + s.responseTime, 0) / services.length)}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Uptime</span>
                    <span className="font-semibold text-success">
                      {(services.reduce((sum, s) => sum + s.uptime, 0) / services.length).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Endpoints</span>
                    <span className="font-semibold">
                      {services.reduce((sum, s) => sum + s.endpoints, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Routes</span>
                    <span className="font-semibold text-success">
                      {routes.filter(r => r.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Policies</span>
                    <span className="font-semibold text-success">
                      {policies.filter(p => p.status === 'active').length}
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
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Services</p>
                  <p className="text-2xl font-bold">{services.length}</p>
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
                  <p className="text-sm text-base-content/70">Healthy Services</p>
                  <p className="text-2xl font-bold">
                    {services.filter(s => s.status === 'healthy').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Active Routes</p>
                  <p className="text-2xl font-bold">
                    {routes.filter(r => r.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Active Policies</p>
                  <p className="text-2xl font-bold">
                    {policies.filter(p => p.status === 'active').length}
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