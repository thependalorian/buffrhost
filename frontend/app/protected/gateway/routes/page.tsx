"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface Route {
  id: string;
  path: string;
  method: string;
  targetService: string;
  status: 'active' | 'inactive' | 'maintenance';
  priority: number;
  timeout: number;
  retries: number;
  rateLimit: {
    requests: number;
    window: number;
  };
  authentication: boolean;
  cors: boolean;
  caching: boolean;
  cacheTTL: number;
  loadBalancing: 'round-robin' | 'least-connections' | 'ip-hash';
  healthCheck: boolean;
  healthCheckPath: string;
  healthCheckInterval: number;
  createdAt: string;
  updatedAt: string;
  lastTested: string;
  testStatus: 'passed' | 'failed' | 'pending';
  performance: {
    averageResponseTime: number;
    successRate: number;
    errorRate: number;
    throughput: number;
  };
}

interface RouteTest {
  id: string;
  routeId: string;
  method: string;
  path: string;
  headers: Record<string, string>;
  body?: string;
  expectedStatus: number;
  timeout: number;
}

export default function RouteManagementPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterService, setFilterService] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockRoutes: Route[] = [
      {
        id: 'route-1',
        path: '/api/auth/login',
        method: 'POST',
        targetService: 'auth-service',
        status: 'active',
        priority: 1,
        timeout: 5000,
        retries: 3,
        rateLimit: { requests: 100, window: 60 },
        authentication: false,
        cors: true,
        caching: false,
        cacheTTL: 0,
        loadBalancing: 'round-robin',
        healthCheck: true,
        healthCheckPath: '/health',
        healthCheckInterval: 30,
        createdAt: '2025-01-20T09:00:00Z',
        updatedAt: '2025-01-27T10:30:00Z',
        lastTested: '2025-01-27T10:25:00Z',
        testStatus: 'passed',
        performance: {
          averageResponseTime: 45,
          successRate: 99.5,
          errorRate: 0.5,
          throughput: 15420
        }
      },
      {
        id: 'route-2',
        path: '/api/hospitality/properties',
        method: 'GET',
        targetService: 'hospitality-service',
        status: 'active',
        priority: 2,
        timeout: 10000,
        retries: 2,
        rateLimit: { requests: 200, window: 60 },
        authentication: true,
        cors: true,
        caching: true,
        cacheTTL: 300,
        loadBalancing: 'least-connections',
        healthCheck: true,
        healthCheckPath: '/health',
        healthCheckInterval: 30,
        createdAt: '2025-01-18T14:30:00Z',
        updatedAt: '2025-01-27T10:30:00Z',
        lastTested: '2025-01-27T10:20:00Z',
        testStatus: 'failed',
        performance: {
          averageResponseTime: 120,
          successRate: 97.9,
          errorRate: 2.1,
          throughput: 8920
        }
      },
      {
        id: 'route-3',
        path: '/api/menu/items',
        method: 'GET',
        targetService: 'menu-service',
        status: 'maintenance',
        priority: 3,
        timeout: 5000,
        retries: 1,
        rateLimit: { requests: 150, window: 60 },
        authentication: true,
        cors: true,
        caching: true,
        cacheTTL: 600,
        loadBalancing: 'round-robin',
        healthCheck: true,
        healthCheckPath: '/health',
        healthCheckInterval: 30,
        createdAt: '2025-01-15T11:15:00Z',
        updatedAt: '2025-01-27T10:15:00Z',
        lastTested: '2025-01-27T10:10:00Z',
        testStatus: 'failed',
        performance: {
          averageResponseTime: 0,
          successRate: 0,
          errorRate: 100,
          throughput: 0
        }
      },
      {
        id: 'route-4',
        path: '/api/payments/process',
        method: 'POST',
        targetService: 'payment-service',
        status: 'active',
        priority: 1,
        timeout: 15000,
        retries: 5,
        rateLimit: { requests: 50, window: 60 },
        authentication: true,
        cors: true,
        caching: false,
        cacheTTL: 0,
        loadBalancing: 'ip-hash',
        healthCheck: true,
        healthCheckPath: '/health',
        healthCheckInterval: 15,
        createdAt: '2025-01-10T16:20:00Z',
        updatedAt: '2025-01-27T10:30:00Z',
        lastTested: '2025-01-27T10:28:00Z',
        testStatus: 'passed',
        performance: {
          averageResponseTime: 85,
          successRate: 98.8,
          errorRate: 1.2,
          throughput: 3420
        }
      }
    ];

    setRoutes(mockRoutes);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'inactive':
        return <PauseIcon className="w-5 h-5 text-gray-500" />;
      case 'maintenance':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTestStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const filteredRoutes = routes.filter(route => {
    if (filterStatus !== 'all' && route.status !== filterStatus) return false;
    if (filterService !== 'all' && route.targetService !== filterService) return false;
    if (searchTerm && !route.path.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !route.targetService.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const toggleRouteStatus = (routeId: string) => {
    setRoutes(routes.map(route => 
      route.id === routeId 
        ? { ...route, status: route.status === 'active' ? 'inactive' : 'active' }
        : route
    ));
  };

  const deleteRoute = (routeId: string) => {
    setRoutes(routes.filter(route => route.id !== routeId));
  };

  const testRoute = (routeId: string) => {
    // Mock route testing
    setRoutes(routes.map(route => 
      route.id === routeId 
        ? { 
            ...route, 
            testStatus: 'pending',
            lastTested: new Date().toISOString()
          }
        : route
    ));
    
    // Simulate test completion
    setTimeout(() => {
      setRoutes(routes.map(route => 
        route.id === routeId 
          ? { 
              ...route, 
              testStatus: Math.random() > 0.3 ? 'passed' : 'failed'
            }
          : route
      ));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Route Management
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Configure API routes, load balancing, and performance settings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Create Route</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <ArrowPathIcon className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Service
              </label>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Services</option>
                <option value="auth-service">Auth Service</option>
                <option value="hospitality-service">Hospitality Service</option>
                <option value="menu-service">Menu Service</option>
                <option value="payment-service">Payment Service</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search routes..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterService('all');
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Routes Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              API Routes ({filteredRoutes.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Target Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Test Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRoutes.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {route.method} {route.path}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Priority: {route.priority}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {route.targetService}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {route.loadBalancing}
                      </div>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatTime(route.performance.averageResponseTime)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatPercentage(route.performance.successRate)} success
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getTestStatusIcon(route.testStatus)}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getTestStatusColor(
                            route.testStatus
                          )}`}
                        >
                          {route.testStatus.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(route.lastTested)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => testRoute(route.id)}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                          title="Test Route"
                        >
                          <PlayIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedRoute(route)}
                          className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-300"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowEditModal(true)}
                          className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-300"
                          title="Edit Route"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteRoute(route.id)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                          title="Delete Route"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Route Details Modal */}
        {selectedRoute && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Route Details
                  </h2>
                  <button
                    onClick={() => setSelectedRoute(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Route Path
                      </label>
                      <p className="text-lg text-gray-900 dark:text-white font-mono">
                        {selectedRoute.method} {selectedRoute.path}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Target Service
                      </label>
                      <p className="text-lg text-gray-900 dark:text-white">
                        {selectedRoute.targetService}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Status
                        </label>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(selectedRoute.status)}
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              selectedRoute.status
                            )}`}
                          >
                            {selectedRoute.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Priority
                        </label>
                        <p className="text-lg text-gray-900 dark:text-white">
                          {selectedRoute.priority}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Timeout
                        </label>
                        <p className="text-lg text-gray-900 dark:text-white">
                          {selectedRoute.timeout}ms
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Retries
                        </label>
                        <p className="text-lg text-gray-900 dark:text-white">
                          {selectedRoute.retries}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Rate Limit
                      </label>
                      <p className="text-lg text-gray-900 dark:text-white">
                        {selectedRoute.rateLimit.requests} requests per {selectedRoute.rateLimit.window}s
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Features
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${selectedRoute.authentication ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                          <span className="text-sm text-gray-900 dark:text-white">Authentication</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${selectedRoute.cors ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                          <span className="text-sm text-gray-900 dark:text-white">CORS</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${selectedRoute.caching ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                          <span className="text-sm text-gray-900 dark:text-white">Caching</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${selectedRoute.healthCheck ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                          <span className="text-sm text-gray-900 dark:text-white">Health Check</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Load Balancing
                      </label>
                      <p className="text-lg text-gray-900 dark:text-white">
                        {selectedRoute.loadBalancing}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Performance Metrics
                      </label>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Response Time:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatTime(selectedRoute.performance.averageResponseTime)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatPercentage(selectedRoute.performance.successRate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Throughput:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatNumber(selectedRoute.performance.throughput)} req/min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Route Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Create New Route
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Method
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Path
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="/api/example"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Target Service
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="auth-service">Auth Service</option>
                      <option value="hospitality-service">Hospitality Service</option>
                      <option value="menu-service">Menu Service</option>
                      <option value="payment-service">Payment Service</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Timeout (ms)
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="5000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Retries
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="3"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Rate Limit (requests)
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Rate Limit Window (seconds)
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="60"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Create Route
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
