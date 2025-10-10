"use client";

import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  CpuChipIcon,
  ServerIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  threshold: {
    warning: number;
    critical: number;
  };
  status: 'good' | 'warning' | 'critical';
}

interface ServicePerformance {
  serviceName: string;
  metrics: PerformanceMetric[];
  averageResponseTime: number;
  throughput: number;
  errorRate: number;
  availability: number;
  lastUpdated: string;
}

interface BenchmarkData {
  metric: string;
  current: number;
  benchmark: number;
  improvement: number;
  status: 'above' | 'below' | 'equal';
}

export default function ServiceMetricsPage() {
  const [selectedService, setSelectedService] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [services, setServices] = useState<ServicePerformance[]>([]);
  const [benchmarks, setBenchmarks] = useState<BenchmarkData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockServices: ServicePerformance[] = [
      {
        serviceName: 'API Gateway',
        metrics: [
          {
            id: 'response-time',
            name: 'Response Time',
            value: 12,
            unit: 'ms',
            trend: 'down',
            change: -5.2,
            threshold: { warning: 50, critical: 100 },
            status: 'good'
          },
          {
            id: 'throughput',
            name: 'Throughput',
            value: 15420,
            unit: 'req/min',
            trend: 'up',
            change: 12.5,
            threshold: { warning: 10000, critical: 15000 },
            status: 'warning'
          },
          {
            id: 'cpu-usage',
            name: 'CPU Usage',
            value: 25,
            unit: '%',
            trend: 'stable',
            change: 0.1,
            threshold: { warning: 70, critical: 90 },
            status: 'good'
          },
          {
            id: 'memory-usage',
            name: 'Memory Usage',
            value: 45,
            unit: '%',
            trend: 'up',
            change: 2.3,
            threshold: { warning: 80, critical: 95 },
            status: 'good'
          }
        ],
        averageResponseTime: 12,
        throughput: 15420,
        errorRate: 0.1,
        availability: 99.95,
        lastUpdated: '2025-01-27T10:30:00Z'
      },
      {
        serviceName: 'Authentication Service',
        metrics: [
          {
            id: 'response-time',
            name: 'Response Time',
            value: 45,
            unit: 'ms',
            trend: 'down',
            change: -8.1,
            threshold: { warning: 100, critical: 200 },
            status: 'good'
          },
          {
            id: 'throughput',
            name: 'Throughput',
            value: 8920,
            unit: 'req/min',
            trend: 'up',
            change: 15.3,
            threshold: { warning: 5000, critical: 8000 },
            status: 'warning'
          },
          {
            id: 'cpu-usage',
            name: 'CPU Usage',
            value: 30,
            unit: '%',
            trend: 'up',
            change: 5.2,
            threshold: { warning: 70, critical: 90 },
            status: 'good'
          },
          {
            id: 'memory-usage',
            name: 'Memory Usage',
            value: 60,
            unit: '%',
            trend: 'up',
            change: 3.1,
            threshold: { warning: 80, critical: 95 },
            status: 'good'
          }
        ],
        averageResponseTime: 45,
        throughput: 8920,
        errorRate: 0.05,
        availability: 99.9,
        lastUpdated: '2025-01-27T10:30:00Z'
      },
      {
        serviceName: 'Hospitality Service',
        metrics: [
          {
            id: 'response-time',
            name: 'Response Time',
            value: 120,
            unit: 'ms',
            trend: 'up',
            change: 25.4,
            threshold: { warning: 200, critical: 500 },
            status: 'warning'
          },
          {
            id: 'throughput',
            name: 'Throughput',
            value: 3420,
            unit: 'req/min',
            trend: 'down',
            change: -8.7,
            threshold: { warning: 2000, critical: 1000 },
            status: 'warning'
          },
          {
            id: 'cpu-usage',
            name: 'CPU Usage',
            value: 80,
            unit: '%',
            trend: 'up',
            change: 12.3,
            threshold: { warning: 70, critical: 90 },
            status: 'warning'
          },
          {
            id: 'memory-usage',
            name: 'Memory Usage',
            value: 85,
            unit: '%',
            trend: 'up',
            change: 8.9,
            threshold: { warning: 80, critical: 95 },
            status: 'warning'
          }
        ],
        averageResponseTime: 120,
        throughput: 3420,
        errorRate: 2.5,
        availability: 98.5,
        lastUpdated: '2025-01-27T10:30:00Z'
      }
    ];

    const mockBenchmarks: BenchmarkData[] = [
      {
        metric: 'Response Time',
        current: 59,
        benchmark: 50,
        improvement: -18,
        status: 'below'
      },
      {
        metric: 'Throughput',
        current: 9253,
        benchmark: 8000,
        improvement: 15.7,
        status: 'above'
      },
      {
        metric: 'CPU Usage',
        current: 45,
        benchmark: 60,
        improvement: 25,
        status: 'above'
      },
      {
        metric: 'Memory Usage',
        current: 63,
        benchmark: 70,
        improvement: 10,
        status: 'above'
      },
      {
        metric: 'Error Rate',
        current: 0.9,
        benchmark: 1.0,
        improvement: 10,
        status: 'above'
      }
    ];

    setServices(mockServices);
    setBenchmarks(mockBenchmarks);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
      default:
        return <ArrowRightIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
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

  const getBenchmarkStatusColor = (status: string) => {
    switch (status) {
      case 'above':
        return 'text-green-600';
      case 'below':
        return 'text-red-600';
      case 'equal':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Performance Metrics
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Performance benchmarking, SLA monitoring, and capacity planning
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
                className={`px-4 py-2 rounded-md font-medium ${
                  selectedService === service.serviceName
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {service.serviceName}
              </button>
            ))}
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Avg Response Time
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
                <ChartBarIcon className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Throughput
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedService === 'all' 
                    ? formatNumber(services.reduce((acc, s) => acc + s.throughput, 0))
                    : formatNumber(services.find(s => s.serviceName === selectedService)?.throughput || 0)
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Error Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedService === 'all' 
                    ? formatPercentage(services.reduce((acc, s) => acc + s.errorRate, 0) / services.length)
                    : formatPercentage(services.find(s => s.serviceName === selectedService)?.errorRate || 0)
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Availability
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedService === 'all' 
                    ? formatPercentage(services.reduce((acc, s) => acc + s.availability, 0) / services.length)
                    : formatPercentage(services.find(s => s.serviceName === selectedService)?.availability || 0)
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benchmark Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Performance Benchmarks
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Comparison against industry standards and SLA targets
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benchmarks.map((benchmark) => (
                <div key={benchmark.metric} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {benchmark.metric}
                    </h4>
                    <span className={`text-sm font-medium ${getBenchmarkStatusColor(benchmark.status)}`}>
                      {benchmark.status === 'above' ? '✓ Above' : benchmark.status === 'below' ? '✗ Below' : '= Equal'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Current:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {benchmark.metric === 'Error Rate' ? formatPercentage(benchmark.current) : formatNumber(benchmark.current)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Benchmark:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {benchmark.metric === 'Error Rate' ? formatPercentage(benchmark.benchmark) : formatNumber(benchmark.benchmark)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Improvement:</span>
                      <span className={`text-sm font-medium ${getBenchmarkStatusColor(benchmark.status)}`}>
                        {benchmark.improvement > 0 ? '+' : ''}{benchmark.improvement.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {services
            .filter(service => selectedService === 'all' || service.serviceName === selectedService)
            .map((service) => (
              <div key={service.serviceName} className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {service.serviceName} Metrics
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated: {new Date(service.lastUpdated).toLocaleString()}
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {service.metrics.map((metric) => (
                      <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(metric.status)}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {metric.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {metric.value} {metric.unit}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(metric.trend)}
                            <span className={`text-sm font-medium ${
                              metric.change > 0 ? 'text-red-600' : metric.change < 0 ? 'text-green-600' : 'text-gray-600'
                            }`}>
                              {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                            </span>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              metric.status
                            )}`}
                          >
                            {metric.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Response Time Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Response Time Trends
            </h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  Response Time Chart
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Real-time chart implementation needed
                </p>
              </div>
            </div>
          </div>

          {/* Throughput Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Throughput Trends
            </h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  Throughput Chart
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Real-time chart implementation needed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Capacity Planning */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Capacity Planning
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Resource utilization analysis and scaling recommendations
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  Scaling Recommendation
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Hospitality Service is approaching CPU limits. Consider horizontal scaling.
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  Optimal Performance
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  API Gateway and Auth Service are performing within optimal ranges.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Cost Optimization
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Consider right-sizing Menu Service to reduce costs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
