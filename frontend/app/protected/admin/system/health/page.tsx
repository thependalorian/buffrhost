'use client';

import {
  BuffrIcon,
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrButton,
  BuffrBadge,
  BuffrAlert,
  BuffrTable,
} from '@/components/ui';

import React, { useState, useEffect } from 'react';
import { PermissionGuard } from '@/components/features/rbac/PermissionGuard';
import { Permission } from '@/lib/types/rbac';

interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  value: string | number;
  description: string;
  lastChecked: string;
}

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'error';
  uptime: string;
  version: string;
  environment: string;
  metrics: HealthMetric[];
  services: {
    name: string;
    status: 'up' | 'down' | 'degraded';
    responseTime: number;
    lastChecked: string;
  }[];
  database: {
    status: 'connected' | 'disconnected' | 'error';
    responseTime: number;
    connections: number;
    maxConnections: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    loadAverage: number[];
  };
}

/**
 * System Health Monitoring Page
 * Real-time system health and performance monitoring
 */
export default function SystemHealthPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadHealthData();

    if (autoRefresh) {
      const interval = setInterval(loadHealthData, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadHealthData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/system/health');
      const data = await response.json();

      if (data.success) {
        setHealth(data.health);
      } else {
        setError(data.error || 'Failed to load health data');
      }
    } catch (error) {
      console.error('Error loading health data:', error);
      setError('Failed to load health data');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'up':
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'warning':
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
      case 'down':
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-nude-100 text-nude-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'up':
      case 'connected':
        return (
          <BuffrIcon name="check-circle" className="h-4 w-4 text-green-600" />
        );
      case 'warning':
      case 'degraded':
        return (
          <BuffrIcon
            name="alert-triangle"
            className="h-4 w-4 text-yellow-600"
          />
        );
      case 'error':
      case 'down':
      case 'disconnected':
        return <BuffrIcon name="x-circle" className="h-4 w-4 text-red-600" />;
      default:
        return (
          <BuffrIcon name="help-circle" className="h-4 w-4 text-nude-600" />
        );
    }
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatUptime = (uptime: string) => {
    // Parse uptime and format it nicely
    return uptime;
  };

  if (!health && !isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <BuffrIcon
            name="alert-circle"
            className="h-12 w-12 text-red-500 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-nude-900 mb-2">
            Unable to load system health
          </h2>
          <p className="text-nude-600 mb-4">
            There was an error loading the system health data.
          </p>
          <BuffrButton
            onClick={loadHealthData}
            className="bg-nude-600 hover:bg-nude-700"
          >
            Retry
          </BuffrButton>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-nude-900">System Health</h1>
          <p className="text-nude-600 mt-1">
            Monitor system performance and health metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BuffrButton
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              autoRefresh
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-nude-200 text-nude-700 hover:bg-nude-300'
            }`}
          >
            <BuffrIcon
              name={autoRefresh ? 'pause' : 'play'}
              className="h-4 w-4 mr-2 inline"
            />
            {autoRefresh ? 'Pause' : 'Resume'} Auto-refresh
          </BuffrButton>
          <BuffrButton
            onClick={loadHealthData}
            disabled={isLoading}
            className="px-4 py-2 bg-nude-600 text-white rounded-lg hover:bg-nude-700 transition-colors disabled:opacity-50"
          >
            <BuffrIcon
              name="refresh-cw"
              className={`h-4 w-4 mr-2 inline ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </BuffrButton>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <BuffrAlert className="bg-red-50 border-red-200 text-red-800">
          <BuffrIcon name="alert-circle" className="h-4 w-4" />
          {error}
        </BuffrAlert>
      )}

      {/* Overall Status */}
      {health && (
        <BuffrCard>
          <BuffrCardBody className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(health.overall)}
                <div className="ml-3">
                  <h2 className="text-xl font-semibold text-nude-900">
                    System Status
                  </h2>
                  <p className="text-nude-600">Overall system health</p>
                </div>
              </div>
              <div className="text-right">
                <BuffrBadge
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(health.overall)}`}
                >
                  {health.overall.toUpperCase()}
                </BuffrBadge>
                <p className="text-sm text-nude-500 mt-1">
                  Uptime: {formatUptime(health.uptime)}
                </p>
              </div>
            </div>
          </BuffrCardBody>
        </BuffrCard>
      )}

      {/* Key Metrics */}
      {health && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <BuffrCard>
            <BuffrCardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BuffrIcon
                    name="database"
                    className="h-6 w-6 text-blue-600"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-nude-600">Database</p>
                  <p className="text-2xl font-bold text-nude-900">
                    {health.database.responseTime}ms
                  </p>
                  <p className="text-xs text-nude-500">
                    {health.database.connections}/
                    {health.database.maxConnections} connections
                  </p>
                </div>
              </div>
            </BuffrCardBody>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BuffrIcon name="cpu" className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-nude-600">CPU Usage</p>
                  <p className="text-2xl font-bold text-nude-900">
                    {health.cpu.usage}%
                  </p>
                  <p className="text-xs text-nude-500">
                    Load: {health.cpu.loadAverage[0]?.toFixed(2)}
                  </p>
                </div>
              </div>
            </BuffrCardBody>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BuffrIcon
                    name="hard-drive"
                    className="h-6 w-6 text-purple-600"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-nude-600">Memory</p>
                  <p className="text-2xl font-bold text-nude-900">
                    {health.memory.percentage}%
                  </p>
                  <p className="text-xs text-nude-500">
                    {formatBytes(health.memory.used)} /{' '}
                    {formatBytes(health.memory.total)}
                  </p>
                </div>
              </div>
            </BuffrCardBody>
          </BuffrCard>

          <BuffrCard>
            <BuffrCardBody className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BuffrIcon
                    name="server"
                    className="h-6 w-6 text-orange-600"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-nude-600">Services</p>
                  <p className="text-2xl font-bold text-nude-900">
                    {health.services.filter((s) => s.status === 'up').length}/
                    {health.services.length}
                  </p>
                  <p className="text-xs text-nude-500">Active services</p>
                </div>
              </div>
            </BuffrCardBody>
          </BuffrCard>
        </div>
      )}

      {/* Services Status */}
      {health && (
        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Services Status</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-nude-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                      Response Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                      Last Checked
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nude-200">
                  {health.services.map((service, index) => (
                    <tr key={index} className="hover:bg-nude-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(service.status)}
                          <span className="ml-2 text-sm font-medium text-nude-900">
                            {service.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <BuffrBadge
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}
                        >
                          {service.status}
                        </BuffrBadge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-900">
                        {service.responseTime}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-500">
                        {new Date(service.lastChecked).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </BuffrCardBody>
        </BuffrCard>
      )}

      {/* Health Metrics */}
      {health && (
        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Health Metrics</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-nude-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                      Last Checked
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nude-200">
                  {health.metrics.map((metric, index) => (
                    <tr key={index} className="hover:bg-nude-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-nude-900">
                          {metric.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-900">
                        {metric.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <BuffrBadge
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}
                        >
                          {metric.status}
                        </BuffrBadge>
                      </td>
                      <td className="px-6 py-4 text-sm text-nude-600">
                        {metric.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-500">
                        {new Date(metric.lastChecked).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </BuffrCardBody>
        </BuffrCard>
      )}
    </div>
  );
}
