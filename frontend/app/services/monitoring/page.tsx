"use client";
'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Monitor, 
  Search, 
  Filter, 
  RefreshCw,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
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
  Cpu,
  HardDrive,
  Wifi,
  MemoryStick
} from 'lucide-react';

export default function ServiceMonitoringPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('1h');
  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Sample monitoring data
  const services = [
    {
      id: 'auth-service',
      name: 'Authentication Service',
      status: 'healthy',
      metrics: {
        cpu: { current: 15.2, average: 12.8, peak: 45.3, trend: 'down' },
        memory: { current: 45.8, average: 42.1, peak: 67.2, trend: 'stable' },
        disk: { current: 23.1, average: 22.8, peak: 28.9, trend: 'up' },
        network: { current: 12.5, average: 11.2, peak: 34.7, trend: 'stable' }
      },
      requests: {
        total: 12543,
        perSecond: 3.2,
        averageResponseTime: 45,
        p95ResponseTime: 89,
        p99ResponseTime: 156,
        errorRate: 0.4
      },
      throughput: {
        requestsPerSecond: 3.2,
        bytesPerSecond: 125000,
        connections: 45
      }
    },
    {
      id: 'booking-service',
      name: 'Booking Service',
      status: 'warning',
      metrics: {
        cpu: { current: 67.8, average: 45.2, peak: 89.1, trend: 'up' },
        memory: { current: 78.2, average: 65.4, peak: 85.7, trend: 'up' },
        disk: { current: 45.3, average: 42.1, peak: 52.8, trend: 'up' },
        network: { current: 34.7, average: 28.9, peak: 56.2, trend: 'up' }
      },
      requests: {
        total: 8934,
        perSecond: 2.1,
        averageResponseTime: 120,
        p95ResponseTime: 234,
        p99ResponseTime: 456,
        errorRate: 2.0
      },
      throughput: {
        requestsPerSecond: 2.1,
        bytesPerSecond: 89000,
        connections: 23
      }
    },
    {
      id: 'payment-service',
      name: 'Payment Service',
      status: 'error',
      metrics: {
        cpu: { current: 0, average: 0, peak: 0, trend: 'down' },
        memory: { current: 0, average: 0, peak: 0, trend: 'down' },
        disk: { current: 0, average: 0, peak: 0, trend: 'down' },
        network: { current: 0, average: 0, peak: 0, trend: 'down' }
      },
      requests: {
        total: 0,
        perSecond: 0,
        averageResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        errorRate: 100
      },
      throughput: {
        requestsPerSecond: 0,
        bytesPerSecond: 0,
        connections: 0
      }
    },
    {
      id: 'notification-service',
      name: 'Notification Service',
      status: 'healthy',
      metrics: {
        cpu: { current: 23.4, average: 21.8, peak: 45.6, trend: 'stable' },
        memory: { current: 56.7, average: 54.2, peak: 67.8, trend: 'stable' },
        disk: { current: 31.2, average: 29.8, peak: 38.4, trend: 'up' },
        network: { current: 18.9, average: 16.7, peak: 34.2, trend: 'stable' }
      },
      requests: {
        total: 15678,
        perSecond: 4.1,
        averageResponseTime: 78,
        p95ResponseTime: 145,
        p99ResponseTime: 267,
        errorRate: 0.4
      },
      throughput: {
        requestsPerSecond: 4.1,
        bytesPerSecond: 156000,
        connections: 67
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-error';
      case 'down':
        return 'text-success';
      default:
        return 'text-base-content';
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'metrics', label: 'Metrics', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'throughput', label: 'Throughput', icon: Globe }
  ];

  const refreshData = () => {
    setLastRefresh(new Date());
    // In a real app, this would trigger a data refresh
  };

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Service Monitoring"
        description="Real-time service monitoring, metrics visualization, and performance analytics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Services', href: '/services' },
          { label: 'Monitoring', href: '/services/monitoring' }
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
                <select
                  className="select select-bordered w-full md:w-32"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="1h">1 Hour</option>
                  <option value="24h">24 Hours</option>
                  <option value="7d">7 Days</option>
                  <option value="30d">30 Days</option>
                </select>
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
                      <p className="text-sm text-base-content/70">Healthy</p>
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
                      <p className="text-sm text-base-content/70">Warning</p>
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
                      <p className="text-sm text-base-content/70">Error</p>
                      <p className="text-2xl font-bold text-error">
                        {services.filter(s => s.status === 'error').length}
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
                            <Monitor className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{service.name}</h3>
                            <p className="text-sm text-base-content/70">{service.id}</p>
                          </div>
                        </div>
                        <div className={`badge ${getStatusColor(service.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-base-content/70">CPU Usage</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{service.metrics.cpu.current}%</span>
                            <div className={`${getTrendColor(service.metrics.cpu.trend)}`}>
                              {React.createElement(getTrendIcon(service.metrics.cpu.trend), { className: "w-4 h-4" })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-base-content/70">Memory Usage</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{service.metrics.memory.current}%</span>
                            <div className={`${getTrendColor(service.metrics.memory.trend)}`}>
                              {React.createElement(getTrendIcon(service.metrics.memory.trend), { className: "w-4 h-4" })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-base-content/70">Response Time</span>
                          <span className="font-semibold">{service.requests.averageResponseTime}ms</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-base-content/70">Error Rate</span>
                          <span className={`font-semibold ${service.requests.errorRate > 1 ? 'text-error' : 'text-success'}`}>
                            {service.requests.errorRate}%
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

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
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
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="space-y-6 mb-8">
              {filteredServices.map((service) => {
                const StatusIcon = getStatusIcon(service.status);
                return (
                  <div key={service.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Monitor className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{service.name}</h3>
                            <p className="text-sm text-base-content/70">{service.id}</p>
                          </div>
                        </div>
                        <div className={`badge ${getStatusColor(service.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* CPU Metrics */}
                        <div className="p-4 bg-base-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <Cpu className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold">CPU Usage</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Current</span>
                              <span className="font-semibold">{service.metrics.cpu.current}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Average</span>
                              <span className="font-semibold">{service.metrics.cpu.average}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Peak</span>
                              <span className="font-semibold">{service.metrics.cpu.peak}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Trend</span>
                              <div className={`${getTrendColor(service.metrics.cpu.trend)}`}>
                                {React.createElement(getTrendIcon(service.metrics.cpu.trend), { className: "w-4 h-4" })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Memory Metrics */}
                        <div className="p-4 bg-base-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <MemoryStick className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold">Memory Usage</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Current</span>
                              <span className="font-semibold">{service.metrics.memory.current}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Average</span>
                              <span className="font-semibold">{service.metrics.memory.average}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Peak</span>
                              <span className="font-semibold">{service.metrics.memory.peak}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Trend</span>
                              <div className={`${getTrendColor(service.metrics.memory.trend)}`}>
                                {React.createElement(getTrendIcon(service.metrics.memory.trend), { className: "w-4 h-4" })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Disk Metrics */}
                        <div className="p-4 bg-base-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <HardDrive className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold">Disk Usage</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Current</span>
                              <span className="font-semibold">{service.metrics.disk.current}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Average</span>
                              <span className="font-semibold">{service.metrics.disk.average}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Peak</span>
                              <span className="font-semibold">{service.metrics.disk.peak}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Trend</span>
                              <div className={`${getTrendColor(service.metrics.disk.trend)}`}>
                                {React.createElement(getTrendIcon(service.metrics.disk.trend), { className: "w-4 h-4" })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Network Metrics */}
                        <div className="p-4 bg-base-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <Wifi className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold">Network I/O</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Current</span>
                              <span className="font-semibold">{service.metrics.network.current}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Average</span>
                              <span className="font-semibold">{service.metrics.network.average}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Peak</span>
                              <span className="font-semibold">{service.metrics.network.peak}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Trend</span>
                              <div className={`${getTrendColor(service.metrics.network.trend)}`}>
                                {React.createElement(getTrendIcon(service.metrics.network.trend), { className: "w-4 h-4" })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
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
                            <span className="text-sm">Avg Response Time</span>
                            <span className="font-semibold">{service.requests.averageResponseTime}ms</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">P95 Response Time</span>
                            <span className="font-semibold">{service.requests.p95ResponseTime}ms</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">P99 Response Time</span>
                            <span className="font-semibold">{service.requests.p99ResponseTime}ms</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Error Rate</span>
                            <span className={`font-semibold ${service.requests.errorRate > 1 ? 'text-error' : 'text-success'}`}>
                              {service.requests.errorRate}%
                            </span>
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

        {/* Throughput Tab */}
        {activeTab === 'throughput' && (
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Service Throughput Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="card bg-base-200">
                      <div className="card-body">
                        <h4 className="card-title text-lg">{service.name}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Requests/sec</span>
                            <span className="font-semibold">{service.throughput.requestsPerSecond}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Bytes/sec</span>
                            <span className="font-semibold">{service.throughput.bytesPerSecond.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Connections</span>
                            <span className="font-semibold">{service.throughput.connections}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Total Requests</span>
                            <span className="font-semibold">{service.requests.total.toLocaleString()}</span>
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

        {/* Last Refresh Info */}
        <div className="text-center text-sm text-base-content/70 mt-8">
          Last refreshed: {lastRefresh.toLocaleString()}
        </div>
      </div>
    </div>
  );
}