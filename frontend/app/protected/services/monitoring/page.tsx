"use client";

import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  CpuChipIcon,
  ServerIcon,
  GlobeAltIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface MonitoringData {
  timestamp: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  requests: number;
  responseTime: number;
  errors: number;
}

interface ServiceMetrics {
  serviceName: string;
  status: 'healthy' | 'warning' | 'error';
  metrics: MonitoringData[];
  averageCpu: number;
  averageMemory: number;
  averageResponseTime: number;
  totalRequests: number;
  errorRate: number;
}

export default function ServiceMonitoringPage() {
  const [selectedService, setSelectedService] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [services, setServices] = useState<ServiceMetrics[]>([]);
  const [realTimeData, setRealTimeData] = useState<MonitoringData[]>([]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockServices: ServiceMetrics[] = [
      {
        serviceName: 'API Gateway',
        status: 'healthy',
        metrics: [],
        averageCpu: 25,
        averageMemory: 45,
        averageResponseTime: 12,
        totalRequests: 15420,
        errorRate: 0.1
      },
      {
        serviceName: 'Authentication Service',
        status: 'healthy',
        metrics: [],
        averageCpu: 30,
        averageMemory: 60,
        averageResponseTime: 45,
        totalRequests: 8920,
        errorRate: 0.05
      },
      {
        serviceName: 'Hospitality Service',
        status: 'warning',
        metrics: [],
        averageCpu: 80,
        averageMemory: 85,
        averageResponseTime: 120,
        totalRequests: 3420,
        errorRate: 2.5
      },
      {
        serviceName: 'Menu Service',
        status: 'error',
        metrics: [],
        averageCpu: 0,
        averageMemory: 0,
        averageResponseTime: 0,
        totalRequests: 0,
        errorRate: 100
      }
    ];

    // Generate mock real-time data
    const generateMockData = (): MonitoringData[] => {
      const data: MonitoringData[] = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          timestamp: timestamp.toISOString(),
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          disk: Math.random() * 100,
          network: Math.random() * 100,
          requests: Math.floor(Math.random() * 1000),
          responseTime: Math.random() * 200,
          errors: Math.floor(Math.random() * 10)
        });
      }
      
      return data;
    };

    setServices(mockServices);
    setRealTimeData(generateMockData());
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const formatTime = (time: number) => {
    return `${time.toFixed(0)}ms`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Service Monitoring Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Real-time metrics and performance monitoring for all microservices
              </p>
            </div>
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Service Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedService('all')}
              className={`px-4 py-2 rounded-md font-medium ${
                selectedService === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Services
            </button>
            {services.map((service) => (
              <button
                key={service.serviceName}
                onClick={() => setSelectedService(service.serviceName)}
                className={`px-4 py-2 rounded-md font-medium flex items-center space-x-2 ${
                  selectedService === service.serviceName
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {getStatusIcon(service.status)}
                <span>{service.serviceName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CpuChipIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Average CPU Usage
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedService === 'all' 
                    ? formatPercentage(services.reduce((acc, s) => acc + s.averageCpu, 0) / services.length)
                    : formatPercentage(services.find(s => s.serviceName === selectedService)?.averageCpu || 0)
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ServerIcon className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Average Memory Usage
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedService === 'all' 
                    ? formatPercentage(services.reduce((acc, s) => acc + s.averageMemory, 0) / services.length)
                    : formatPercentage(services.find(s => s.serviceName === selectedService)?.averageMemory || 0)
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Average Response Time
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedService === 'all' 
                    ? formatTime(services.reduce((acc, s) => acc + s.averageResponseTime, 0) / services.length)
                    : formatTime(services.find(s => s.serviceName === selectedService)?.averageResponseTime || 0)
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GlobeAltIcon className="w-8 h-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedService === 'all' 
                    ? formatNumber(services.reduce((acc, s) => acc + s.totalRequests, 0))
                    : formatNumber(services.find(s => s.serviceName === selectedService)?.totalRequests || 0)
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* CPU Usage Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              CPU Usage Over Time
            </h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  CPU Usage Chart
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Real-time chart implementation needed
                </p>
              </div>
            </div>
          </div>

          {/* Memory Usage Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Memory Usage Over Time
            </h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  Memory Usage Chart
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Real-time chart implementation needed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Details Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Service Performance Details
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    CPU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Memory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Response Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Requests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Error Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {services
                  .filter(service => selectedService === 'all' || service.serviceName === selectedService)
                  .map((service) => (
                    <tr key={service.serviceName} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(service.status)}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {service.serviceName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                            service.status
                          )}`}
                        >
                          {service.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatPercentage(service.averageCpu)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatPercentage(service.averageMemory)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatTime(service.averageResponseTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatNumber(service.totalRequests)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatPercentage(service.errorRate)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Data Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Real-time Metrics
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {realTimeData.slice(-4).map((data, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {new Date(data.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">CPU:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatPercentage(data.cpu)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Memory:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatPercentage(data.memory)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Requests:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatNumber(data.requests)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Response:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatTime(data.responseTime)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
