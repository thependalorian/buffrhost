"use client";
'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  BarChart3, 
  Search, 
  Filter, 
  RefreshCw,
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
  Activity,
  Settings,
  Eye,
  Download,
  Bell,
  Cpu,
  HardDrive,
  Wifi,
  MemoryStick,
  Target,
  Gauge,
  Timer,
  Users
} from 'lucide-react';

export default function ServiceMetricsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('1h');
  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Sample metrics data
  const services = [
    {
      id: 'auth-service',
      name: 'Authentication Service',
      status: 'healthy',
      sla: 99.9,
      performance: {
        responseTime: { current: 45, average: 42, p95: 89, p99: 156 },
        throughput: { requestsPerSecond: 3.2, bytesPerSecond: 125000 },
        errorRate: 0.4,
        availability: 99.9
      },
      resources: {
        cpu: { current: 15.2, average: 12.8, peak: 45.3, limit: 100 },
        memory: { current: 45.8, average: 42.1, peak: 67.2, limit: 100 },
        disk: { current: 23.1, average: 22.8, peak: 28.9, limit: 100 },
        network: { current: 12.5, average: 11.2, peak: 34.7, limit: 100 }
      },
      capacity: {
        currentLoad: 15.2,
        maxCapacity: 100,
        utilizationRate: 15.2,
        scalingThreshold: 80
      },
      trends: {
        responseTime: 'down',
        throughput: 'up',
        errorRate: 'down',
        cpu: 'down',
        memory: 'stable',
        disk: 'up',
        network: 'stable'
      }
    },
    {
      id: 'booking-service',
      name: 'Booking Service',
      status: 'warning',
      sla: 98.5,
      performance: {
        responseTime: { current: 120, average: 95, p95: 234, p99: 456 },
        throughput: { requestsPerSecond: 2.1, bytesPerSecond: 89000 },
        errorRate: 2.0,
        availability: 98.5
      },
      resources: {
        cpu: { current: 67.8, average: 45.2, peak: 89.1, limit: 100 },
        memory: { current: 78.2, average: 65.4, peak: 85.7, limit: 100 },
        disk: { current: 45.3, average: 42.1, peak: 52.8, limit: 100 },
        network: { current: 34.7, average: 28.9, peak: 56.2, limit: 100 }
      },
      capacity: {
        currentLoad: 67.8,
        maxCapacity: 100,
        utilizationRate: 67.8,
        scalingThreshold: 80
      },
      trends: {
        responseTime: 'up',
        throughput: 'down',
        errorRate: 'up',
        cpu: 'up',
        memory: 'up',
        disk: 'up',
        network: 'up'
      }
    },
    {
      id: 'payment-service',
      name: 'Payment Service',
      status: 'error',
      sla: 0,
      performance: {
        responseTime: { current: 0, average: 0, p95: 0, p99: 0 },
        throughput: { requestsPerSecond: 0, bytesPerSecond: 0 },
        errorRate: 100,
        availability: 0
      },
      resources: {
        cpu: { current: 0, average: 0, peak: 0, limit: 100 },
        memory: { current: 0, average: 0, peak: 0, limit: 100 },
        disk: { current: 0, average: 0, peak: 0, limit: 100 },
        network: { current: 0, average: 0, peak: 0, limit: 100 }
      },
      capacity: {
        currentLoad: 0,
        maxCapacity: 100,
        utilizationRate: 0,
        scalingThreshold: 80
      },
      trends: {
        responseTime: 'down',
        throughput: 'down',
        errorRate: 'up',
        cpu: 'down',
        memory: 'down',
        disk: 'down',
        network: 'down'
      }
    },
    {
      id: 'notification-service',
      name: 'Notification Service',
      status: 'healthy',
      sla: 99.7,
      performance: {
        responseTime: { current: 78, average: 72, p95: 145, p99: 267 },
        throughput: { requestsPerSecond: 4.1, bytesPerSecond: 156000 },
        errorRate: 0.4,
        availability: 99.7
      },
      resources: {
        cpu: { current: 23.4, average: 21.8, peak: 45.6, limit: 100 },
        memory: { current: 56.7, average: 54.2, peak: 67.8, limit: 100 },
        disk: { current: 31.2, average: 29.8, peak: 38.4, limit: 100 },
        network: { current: 18.9, average: 16.7, peak: 34.2, limit: 100 }
      },
      capacity: {
        currentLoad: 23.4,
        maxCapacity: 100,
        utilizationRate: 23.4,
        scalingThreshold: 80
      },
      trends: {
        responseTime: 'stable',
        throughput: 'up',
        errorRate: 'down',
        cpu: 'stable',
        memory: 'stable',
        disk: 'up',
        network: 'stable'
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

  const getTrendColor = (trend: string, metric: string) => {
    if (metric === 'errorRate') {
      return trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-base-content';
    }
    if (metric === 'responseTime') {
      return trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-base-content';
    }
    return trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-base-content';
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'resources', label: 'Resources', icon: Server },
    { id: 'capacity', label: 'Capacity', icon: Target }
  ];

  const refreshData = () => {
    setLastRefresh(new Date());
    // In a real app, this would trigger a data refresh
  };

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Service Metrics"
        description="Performance benchmarking, SLA monitoring, capacity planning, and resource utilization"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Services', href: '/services' },
          { id: 'metrics', label: 'Metrics', href: '/services/metrics' }
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
                      <Gauge className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Avg SLA</p>
                      <p className="text-2xl font-bold">
                        {(services.reduce((sum, s) => sum + s.sla, 0) / services.length).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-green-500 text-white">
                      <Timer className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Avg Response Time</p>
                      <p className="text-2xl font-bold">
                        {Math.round(services.reduce((sum, s) => sum + s.performance.responseTime.current, 0) / services.length)}ms
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-purple-500 text-white">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Total Throughput</p>
                      <p className="text-2xl font-bold">
                        {services.reduce((sum, s) => sum + s.performance.throughput.requestsPerSecond, 0).toFixed(1)}/s
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
                      <p className="text-sm text-base-content/70">Avg Error Rate</p>
                      <p className="text-2xl font-bold">
                        {(services.reduce((sum, s) => sum + s.performance.errorRate, 0) / services.length).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {services.map((service) => {
                const StatusIcon = getStatusIcon(service.status);
                return (
                  <div key={service.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <BarChart3 className="w-5 h-5 text-primary" />
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
                          <span className="text-sm text-base-content/70">SLA</span>
                          <span className="font-semibold">{service.sla}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-base-content/70">Response Time</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{service.performance.responseTime.current}ms</span>
                            <div className={`${getTrendColor(service.trends.responseTime, 'responseTime')}`}>
                              {React.createElement(getTrendIcon(service.trends.responseTime), { className: "w-4 h-4" })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-base-content/70">Throughput</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{service.performance.throughput.requestsPerSecond}/s</span>
                            <div className={`${getTrendColor(service.trends.throughput, 'throughput')}`}>
                              {React.createElement(getTrendIcon(service.trends.throughput), { className: "w-4 h-4" })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-base-content/70">Error Rate</span>
                          <div className="flex items-center space-x-2">
                            <span className={`font-semibold ${service.performance.errorRate > 1 ? 'text-error' : 'text-success'}`}>
                              {service.performance.errorRate}%
                            </span>
                            <div className={`${getTrendColor(service.trends.errorRate, 'errorRate')}`}>
                              {React.createElement(getTrendIcon(service.trends.errorRate), { className: "w-4 h-4" })}
                            </div>
                          </div>
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

        {/* Performance Tab */}
        {activeTab === 'performance' && (
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

            {/* Performance Metrics */}
            <div className="space-y-6 mb-8">
              {filteredServices.map((service) => {
                const StatusIcon = getStatusIcon(service.status);
                return (
                  <div key={service.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Zap className="w-5 h-5 text-primary" />
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
                        {/* Response Time Metrics */}
                        <div className="p-4 bg-base-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <Timer className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold">Response Time</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Current</span>
                              <span className="font-semibold">{service.performance.responseTime.current}ms</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Average</span>
                              <span className="font-semibold">{service.performance.responseTime.average}ms</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">P95</span>
                              <span className="font-semibold">{service.performance.responseTime.p95}ms</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">P99</span>
                              <span className="font-semibold">{service.performance.responseTime.p99}ms</span>
                            </div>
                          </div>
                        </div>

                        {/* Throughput Metrics */}
                        <div className="p-4 bg-base-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <Activity className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold">Throughput</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Requests/sec</span>
                              <span className="font-semibold">{service.performance.throughput.requestsPerSecond}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Bytes/sec</span>
                              <span className="font-semibold">{service.performance.throughput.bytesPerSecond.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Trend</span>
                              <div className={`${getTrendColor(service.trends.throughput, 'throughput')}`}>
                                {React.createElement(getTrendIcon(service.trends.throughput), { className: "w-4 h-4" })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Error Rate Metrics */}
                        <div className="p-4 bg-base-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <AlertTriangle className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold">Error Rate</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Current</span>
                              <span className={`font-semibold ${service.performance.errorRate > 1 ? 'text-error' : 'text-success'}`}>
                                {service.performance.errorRate}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Availability</span>
                              <span className="font-semibold">{service.performance.availability}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">SLA</span>
                              <span className="font-semibold">{service.sla}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Trend</span>
                              <div className={`${getTrendColor(service.trends.errorRate, 'errorRate')}`}>
                                {React.createElement(getTrendIcon(service.trends.errorRate), { className: "w-4 h-4" })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* SLA Metrics */}
                        <div className="p-4 bg-base-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <Target className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold">SLA</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Current</span>
                              <span className="font-semibold">{service.sla}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Target</span>
                              <span className="font-semibold">99.9%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Status</span>
                              <span className={`badge ${service.sla >= 99.9 ? 'badge-success' : service.sla >= 99.0 ? 'badge-warning' : 'badge-error'} badge-sm`}>
                                {service.sla >= 99.9 ? 'Met' : service.sla >= 99.0 ? 'Warning' : 'Failed'}
                              </span>
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

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Resource Utilization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="card bg-base-200">
                      <div className="card-body">
                        <h4 className="card-title text-lg">{service.name}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">CPU</span>
                            <span className="font-semibold">{service.resources.cpu.current}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Memory</span>
                            <span className="font-semibold">{service.resources.memory.current}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Disk</span>
                            <span className="font-semibold">{service.resources.disk.current}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Network</span>
                            <span className="font-semibold">{service.resources.network.current}%</span>
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

        {/* Capacity Tab */}
        {activeTab === 'capacity' && (
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Capacity Planning</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="card bg-base-200">
                      <div className="card-body">
                        <h4 className="card-title text-lg">{service.name}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Current Load</span>
                            <span className="font-semibold">{service.capacity.currentLoad}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Max Capacity</span>
                            <span className="font-semibold">{service.capacity.maxCapacity}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Utilization</span>
                            <span className="font-semibold">{service.capacity.utilizationRate}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Scaling Threshold</span>
                            <span className="font-semibold">{service.capacity.scalingThreshold}%</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">Capacity Usage</span>
                            <span className="text-sm">{service.capacity.currentLoad}%</span>
                          </div>
                          <progress 
                            className="progress w-full" 
                            value={service.capacity.currentLoad} 
                            max="100"
                          ></progress>
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