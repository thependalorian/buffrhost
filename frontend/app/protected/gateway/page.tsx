"use client";

import { useState, useEffect } from "react";
import {
  GlobeAltIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ServerIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

interface GatewayMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
  activeConnections: number;
  uptime: number;
}

interface RouteStats {
  path: string;
  method: string;
  requests: number;
  averageResponseTime: number;
  errorRate: number;
  status: 'healthy' | 'warning' | 'error';
}

interface GatewayHealth {
  status: 'healthy' | 'warning' | 'error';
  lastCheck: string;
  version: string;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export default function GatewayDashboardPage() {
  const [metrics, setMetrics] = useState<GatewayMetrics | null>(null);
  const [routeStats, setRouteStats] = useState<RouteStats[]>([]);
  const [gatewayHealth, setGatewayHealth] = useState<GatewayHealth | null>(null);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockMetrics: GatewayMetrics = {
      totalRequests: 125420,
      successfulRequests: 120890,
      failedRequests: 4530,
      averageResponseTime: 45,
      errorRate: 3.6,
      throughput: 1254,
      activeConnections: 89,
      uptime: 99.8
    };

    const mockRouteStats: RouteStats[] = [
      {
        path: '/api/auth/login',
        method: 'POST',
        requests: 15420,
        averageResponseTime: 45,
        errorRate: 0.5,
        status: 'healthy'
      },
      {
        path: '/api/hospitality/properties',
        method: 'GET',
        requests: 8920,
        averageResponseTime: 120,
        errorRate: 2.1,
        status: 'warning'
      },
      {
        path: '/api/menu/items',
        method: 'GET',
        requests: 0,
        averageResponseTime: 0,
        errorRate: 100,
        status: 'error'
      },
      {
        path: '/api/payments/process',
        method: 'POST',
        requests: 3420,
        averageResponseTime: 85,
        errorRate: 1.2,
        status: 'healthy'
      },
      {
        path: '/api/notifications/send',
        method: 'POST',
        requests: 12540,
        averageResponseTime: 25,
        errorRate: 0.8,
        status: 'healthy'
      }
    ];

    const mockGatewayHealth: GatewayHealth = {
      status: 'healthy',
      lastCheck: '2025-01-27T10:30:00Z',
      version: '2.1.4',
      uptime: 99.8,
      memoryUsage: 45,
      cpuUsage: 25
    };

    setMetrics(mockMetrics);
    setRouteStats(mockRouteStats);
    setGatewayHealth(mockGatewayHealth);
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

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                API Gateway Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Gateway overview, request statistics, and performance metrics
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
        {/* Gateway Health Status */}
        {gatewayHealth && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(gatewayHealth.status)}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Gateway Status
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                    gatewayHealth.status
                  )}`}
                >
                  {gatewayHealth.status.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Version {gatewayHealth.version} • Last check: {new Date(gatewayHealth.lastCheck).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GlobeAltIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Requests
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(metrics.totalRequests)}
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
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPercentage((metrics.successfulRequests / metrics.totalRequests) * 100)}
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
                    Avg Response Time
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatTime(metrics.averageResponseTime)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="w-8 h-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Throughput
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(metrics.throughput)} req/min
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gateway Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Request Volume Over Time
            </h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  Request Volume Chart
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Real-time chart implementation needed
                </p>
              </div>
            </div>
          </div>

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
        </div>

        {/* Route Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Route Performance
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Performance metrics for each API route
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Requests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Avg Response Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Error Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {routeStats.map((route, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {route.path}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        {route.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatNumber(route.requests)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {route.averageResponseTime > 0 ? formatTime(route.averageResponseTime) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatPercentage(route.errorRate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(route.status)}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                            route.status
                          )}`}
                        >
                          {route.status.toUpperCase()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gateway Configuration Summary */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Gateway Configuration
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Version</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {gatewayHealth?.version}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatUptime(gatewayHealth?.uptime || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Routes</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {routeStats.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Connections</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {metrics?.activeConnections}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Resource Usage
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">CPU Usage</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatPercentage(gatewayHealth?.cpuUsage || 0)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${gatewayHealth?.cpuUsage || 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatPercentage(gatewayHealth?.memoryUsage || 0)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${gatewayHealth?.memoryUsage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
