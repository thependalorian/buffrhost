"use client";

import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  CpuChipIcon,
  ServerIcon,
  GlobeAltIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { PageHeader } from "@/src/components/layout/page-header";

interface ServiceHealth {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error';
  responseTime: number;
  uptime: number;
  lastCheck: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  dependencies: string[];
}

interface HealthMetrics {
  totalServices: number;
  healthyServices: number;
  warningServices: number;
  errorServices: number;
  averageResponseTime: number;
  systemUptime: number;
}

export default function ServiceHealthPage() {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockServices: ServiceHealth[] = [
      {
        id: 'auth-service',
        name: 'Authentication Service',
        status: 'healthy',
        responseTime: 45,
        uptime: 99.9,
        lastCheck: '2025-01-27T10:30:00Z',
        cpu: 25,
        memory: 60,
        disk: 40,
        network: 15,
        dependencies: ['database', 'redis']
      },
      {
        id: 'api-gateway',
        name: 'API Gateway',
        status: 'healthy',
        responseTime: 12,
        uptime: 99.95,
        lastCheck: '2025-01-27T10:30:00Z',
        cpu: 15,
        memory: 45,
        disk: 20,
        network: 85,
        dependencies: ['auth-service', 'rate-limiter']
      },
      {
        id: 'hospitality-service',
        name: 'Hospitality Service',
        status: 'warning',
        responseTime: 120,
        uptime: 98.5,
        lastCheck: '2025-01-27T10:30:00Z',
        cpu: 80,
        memory: 85,
        disk: 60,
        network: 25,
        dependencies: ['database', 'cache']
      },
      {
        id: 'menu-service',
        name: 'Menu Service',
        status: 'error',
        responseTime: 0,
        uptime: 95.2,
        lastCheck: '2025-01-27T10:25:00Z',
        cpu: 0,
        memory: 0,
        disk: 0,
        network: 0,
        dependencies: ['database']
      }
    ];

    const mockMetrics: HealthMetrics = {
      totalServices: 4,
      healthyServices: 2,
      warningServices: 1,
      errorServices: 1,
      averageResponseTime: 44.25,
      systemUptime: 98.4
    };

    setServices(mockServices);
    setMetrics(mockMetrics);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      default:
        return <ClockIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(1)}%`;
  };

  const formatResponseTime = (time: number) => {
    return time > 0 ? `${time}ms` : 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PageHeader
        title="Service Health Monitoring"
        description="Real-time monitoring of all microservices health and performance"
        breadcrumbs={[
          { label: "Services", href: "/protected/services" },
          { label: "Health", current: true }
        ]}
        actions={
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-md font-medium ${
                autoRefresh
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {autoRefresh ? 'Auto Refresh ON' : 'Auto Refresh OFF'}
            </button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Overview */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ServerIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Services
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics.totalServices}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Healthy Services
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {metrics.healthyServices}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Warning Services
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {metrics.warningServices}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircleIcon className="w-8 h-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Error Services
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {metrics.errorServices}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer ${
                selectedService === service.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(service.status)}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {service.name}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                      service.status
                    )}`}
                  >
                    {service.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Response Time
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatResponseTime(service.responseTime)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Uptime
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatUptime(service.uptime)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      CPU Usage
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.cpu}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Memory Usage
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.memory}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Last Check
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(service.lastCheck).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {service.dependencies.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Dependencies:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {service.dependencies.map((dep) => (
                        <span
                          key={dep}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                        >
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Service Details Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Service Details
                  </h2>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>

                {(() => {
                  const service = services.find(s => s.id === selectedService);
                  if (!service) return null;

                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Service Name
                          </label>
                          <p className="text-lg text-gray-900 dark:text-white">
                            {service.name}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Status
                          </label>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(service.status)}
                            <span className="text-lg font-medium text-gray-900 dark:text-white">
                              {service.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Response Time
                          </label>
                          <p className="text-lg text-gray-900 dark:text-white">
                            {formatResponseTime(service.responseTime)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Uptime
                          </label>
                          <p className="text-lg text-gray-900 dark:text-white">
                            {formatUptime(service.uptime)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Resource Usage
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">CPU</span>
                              <span className="text-sm text-gray-900 dark:text-white">{service.cpu}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${service.cpu}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Memory</span>
                              <span className="text-sm text-gray-900 dark:text-white">{service.memory}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${service.memory}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Dependencies
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {service.dependencies.map((dep) => (
                            <span
                              key={dep}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                            >
                              {dep}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
