"use client";
'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Heart, 
  Search, 
  Filter, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Server,
  Database,
  Globe,
  Shield,
  Zap,
  BarChart3,
  Settings,
  Eye,
  Download,
  Bell,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

export default function ServiceHealthPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Sample service health data
  const services = [
    {
      id: 'auth-service',
      name: 'Authentication Service',
      status: 'healthy',
      responseTime: 45,
      uptime: 99.9,
      lastCheck: '2024-01-20 14:30:00',
      version: 'v2.1.0',
      port: 8001,
      dependencies: ['database', 'redis'],
      metrics: {
        cpu: 15.2,
        memory: 45.8,
        disk: 23.1,
        network: 12.5
      },
      alerts: 0,
      requests: {
        total: 12543,
        success: 12498,
        failed: 45,
        successRate: 99.6
      }
    },
    {
      id: 'booking-service',
      name: 'Booking Service',
      status: 'warning',
      responseTime: 120,
      uptime: 98.5,
      lastCheck: '2024-01-20 14:29:45',
      version: 'v1.8.2',
      port: 8002,
      dependencies: ['database', 'payment-service'],
      metrics: {
        cpu: 67.8,
        memory: 78.2,
        disk: 45.3,
        network: 34.7
      },
      alerts: 2,
      requests: {
        total: 8934,
        success: 8756,
        failed: 178,
        successRate: 98.0
      }
    },
    {
      id: 'payment-service',
      name: 'Payment Service',
      status: 'error',
      responseTime: 0,
      uptime: 0,
      lastCheck: '2024-01-20 14:25:12',
      version: 'v2.0.1',
      port: 8003,
      dependencies: ['database', 'external-gateway'],
      metrics: {
        cpu: 0,
        memory: 0,
        disk: 0,
        network: 0
      },
      alerts: 5,
      requests: {
        total: 0,
        success: 0,
        failed: 0,
        successRate: 0
      }
    },
    {
      id: 'notification-service',
      name: 'Notification Service',
      status: 'healthy',
      responseTime: 78,
      uptime: 99.7,
      lastCheck: '2024-01-20 14:30:15',
      version: 'v1.5.3',
      port: 8004,
      dependencies: ['database', 'email-provider'],
      metrics: {
        cpu: 23.4,
        memory: 56.7,
        disk: 31.2,
        network: 18.9
      },
      alerts: 0,
      requests: {
        total: 15678,
        success: 15623,
        failed: 55,
        successRate: 99.6
      }
    },
    {
      id: 'analytics-service',
      name: 'Analytics Service',
      status: 'healthy',
      responseTime: 92,
      uptime: 99.8,
      lastCheck: '2024-01-20 14:30:08',
      version: 'v1.2.0',
      port: 8005,
      dependencies: ['database', 'redis'],
      metrics: {
        cpu: 34.6,
        memory: 67.3,
        disk: 28.9,
        network: 22.1
      },
      alerts: 0,
      requests: {
        total: 9876,
        success: 9854,
        failed: 22,
        successRate: 99.8
      }
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
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
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

  const getTrendIcon = (value: number, threshold: number) => {
    if (value > threshold) return TrendingUp;
    if (value < threshold) return TrendingDown;
    return Minus;
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'services', label: 'Services', icon: Server },
    { id: 'metrics', label: 'Metrics', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: Bell }
  ];

  const refreshData = () => {
    setLastRefresh(new Date());
    // In a real app, this would trigger a data refresh
  };

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Service Health Monitoring"
        description="Real-time service health monitoring, metrics, and alerting"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Services', href: '/services' },
          { label: 'Health Monitoring', href: '/services/health' }
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
                <ActionButton variant="outline" onClick={refreshData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </ActionButton>
                <ActionButton>
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-green-500 text-white">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Healthy Services</p>
                      <p className="text-2xl font-bold text-success">
                        {services.filter(s => s.status === 'healthy').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-yellow-500 text-white">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Warning Services</p>
                      <p className="text-2xl font-bold text-warning">
                        {services.filter(s => s.status === 'warning').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-red-500 text-white">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Error Services</p>
                      <p className="text-2xl font-bold text-error">
                        {services.filter(s => s.status === 'error').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-blue-500 text-white">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Total Alerts</p>
                      <p className="text-2xl font-bold">
                        {services.reduce((sum, s) => sum + s.alerts, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {services.map((service) => {
                const StatusIcon = getStatusIcon(service.status);
                return (
                  <div key={service.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Server className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{service.name}</h3>
                            <p className="text-sm text-base-content/70">{service.id}</p>
                            <p className="text-xs text-base-content/50">v{service.version}</p>
                          </div>
                        </div>
                        <div className={`badge ${getStatusColor(service.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-base-content/70">Response Time</span>
                          <span className="font-semibold">{service.responseTime}ms</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-base-content/70">Uptime</span>
                          <span className="font-semibold">{service.uptime}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-base-content/70">Success Rate</span>
                          <span className="font-semibold">{service.requests.successRate}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-base-content/70">Alerts</span>
                          <span className={`font-semibold ${service.alerts > 0 ? 'text-error' : 'text-success'}`}>
                            {service.alerts}
                          </span>
                        </div>
                      </div>

                      <div className="card-actions justify-end mt-4">
                        <button className="btn btn-ghost btn-sm">
                          <Eye className="w-4 h-4" />
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

            {/* Services List */}
            <div className="space-y-4 mb-8">
              {filteredServices.map((service) => {
                const StatusIcon = getStatusIcon(service.status);
                return (
                  <div key={service.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Server className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{service.name}</h3>
                            <p className="text-sm text-base-content/70">{service.id}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="badge badge-outline badge-sm">
                                Port {service.port}
                              </span>
                              <span className="badge badge-outline badge-sm">
                                {service.version}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(service.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                          </div>
                          <div className="badge badge-outline">
                            {service.responseTime}ms
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">CPU Usage</p>
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold">{service.metrics.cpu}%</p>
                            {getTrendIcon(service.metrics.cpu, 50) === TrendingUp && (
                              <TrendingUp className="w-4 h-4 text-error" />
                            )}
                            {getTrendIcon(service.metrics.cpu, 50) === TrendingDown && (
                              <TrendingDown className="w-4 h-4 text-success" />
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Memory Usage</p>
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold">{service.metrics.memory}%</p>
                            {getTrendIcon(service.metrics.memory, 70) === TrendingUp && (
                              <TrendingUp className="w-4 h-4 text-error" />
                            )}
                            {getTrendIcon(service.metrics.memory, 70) === TrendingDown && (
                              <TrendingDown className="w-4 h-4 text-success" />
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Disk Usage</p>
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold">{service.metrics.disk}%</p>
                            {getTrendIcon(service.metrics.disk, 80) === TrendingUp && (
                              <TrendingUp className="w-4 h-4 text-error" />
                            )}
                            {getTrendIcon(service.metrics.disk, 80) === TrendingDown && (
                              <TrendingDown className="w-4 h-4 text-success" />
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Network I/O</p>
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold">{service.metrics.network}%</p>
                            {getTrendIcon(service.metrics.network, 60) === TrendingUp && (
                              <TrendingUp className="w-4 h-4 text-error" />
                            )}
                            {getTrendIcon(service.metrics.network, 60) === TrendingDown && (
                              <TrendingDown className="w-4 h-4 text-success" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Dependencies</p>
                        <div className="flex flex-wrap gap-1">
                          {service.dependencies.map((dep, index) => (
                            <span key={index} className="badge badge-secondary badge-sm">
                              {dep}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-base-content/70">
                          Last Check: {service.lastCheck}
                        </div>
                        <div className="text-sm text-base-content/70">
                          Requests: {service.requests.total.toLocaleString()}
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
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Service Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="card bg-base-200">
                      <div className="card-body">
                        <h4 className="card-title text-lg">{service.name}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">CPU</span>
                            <span className="font-semibold">{service.metrics.cpu}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Memory</span>
                            <span className="font-semibold">{service.metrics.memory}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Disk</span>
                            <span className="font-semibold">{service.metrics.disk}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Network</span>
                            <span className="font-semibold">{service.metrics.network}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Active Alerts</h3>
                <div className="space-y-4">
                  {services.filter(s => s.alerts > 0).map((service) => (
                    <div key={service.id} className="alert alert-warning">
                      <AlertTriangle className="w-5 h-5" />
                      <div>
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm">
                          {service.alerts} active alerts - Service experiencing issues
                        </p>
                      </div>
                    </div>
                  ))}
                  {services.filter(s => s.alerts === 0).length === services.length && (
                    <div className="alert alert-success">
                      <CheckCircle className="w-5 h-5" />
                      <div>
                        <h4 className="font-semibold">All Systems Operational</h4>
                        <p className="text-sm">No active alerts at this time</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Last Refresh Info */}
        <div className="text-center text-sm text-base-content/70 mt-8">
          Last refreshed: {lastRefresh.toLocaleString()}
        </div>
      </div>
    </div>
  );
}