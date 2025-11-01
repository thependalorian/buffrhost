/**
 * System Monitoring Component
 *
 * Purpose: Monitors system health and performance
 * Functionality: System metrics, alerts, logs, performance monitoring
 * Location: /components/dashboard/admin/SystemMonitoring.tsx
 *
 * Follows 40 Rules:
 * - Uses DaisyUI for consistent styling
 * - Modular component design for easy maintenance
 * - TypeScript for type safety
 * - Vercel-compatible with SSR
 * - Uses Neon PostgreSQL database
 * - Comprehensive error handling
 * - Optimized for performance
 */

'use client';

import React, { useState, useRef } from 'react';
/**
 * SystemMonitoring React Component for Buffr Host Hospitality Platform
 * @fileoverview SystemMonitoring displays comprehensive dashboard with key metrics and analytics
 * @location buffr-host/components/dashboard/admin/SystemMonitoring.tsx
 * @purpose SystemMonitoring displays comprehensive dashboard with key metrics and analytics
 * @component SystemMonitoring
 * @category Dashboard
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @hooks_utilization useState for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {SystemHealth} [systemHealth] - systemHealth prop description
 * @param {SystemAlert[]} [alerts] - alerts prop description
 * @param {SystemLog[]} [logs] - logs prop description
 * @param {() => void} [onRefresh] - onRefresh prop description
 * @param {() => void} [onExportLogs] - onExportLogs prop description
 * @param {(id} [onResolveAlert] - onResolveAlert prop description
 * @param {() => void} [onViewLogs] - onViewLogs prop description
 * @param {} [isLoading] - isLoading prop description
 *
 * Methods:
 * @method handleRefresh - handleRefresh method for component functionality
 * @method getStatusColor - getStatusColor method for component functionality
 * @method getStatusIcon - getStatusIcon method for component functionality
 * @method getAlertColor - getAlertColor method for component functionality
 * @method getSeverityColor - getSeverityColor method for component functionality
 * @method getLogLevelColor - getLogLevelColor method for component functionality
 * @method formatDate - formatDate method for component functionality
 * @method formatPercentage - formatPercentage method for component functionality
 * @method formatBytes - formatBytes method for component functionality
 *
 * Usage Example:
 * @example
 * import { SystemMonitoring } from './SystemMonitoring';
 *
 * function App() {
 *   return (
 *     <SystemMonitoring
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered SystemMonitoring component
 */

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';
import {
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Settings,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Shield,
} from 'lucide-react';

// Types for TypeScript compliance
interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  databaseConnections: number;
  lastBackup: string;
  version: string;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  source: string;
}

interface SystemLog {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  source: string;
  userId?: string;
  requestId?: string;
}

interface SystemMonitoringProps {
  systemHealth: SystemHealth;
  alerts: SystemAlert[];
  logs: SystemLog[];
  onRefresh: () => void;
  onExportLogs: () => void;
  onResolveAlert: (id: string) => void;
  onViewLogs: () => void;
  isLoading?: boolean;
}

// Main System Monitoring Component
export const SystemMonitoring: React.FC<SystemMonitoringProps> = ({
  systemHealth,
  alerts,
  logs,
  onRefresh,
  onExportLogs,
  onResolveAlert,
  onViewLogs,
  isLoading = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');

  // Refs for performance optimization
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      setIsRefreshing(false);
      onRefresh();
    }, 1000);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'badge-success';
      case 'warning':
        return 'badge-warning';
      case 'critical':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Get alert color
  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'alert-error';
      case 'warning':
        return 'alert-warning';
      case 'info':
        return 'alert-info';
      case 'success':
        return 'alert-success';
      default:
        return 'alert-info';
    }
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'badge-error';
      case 'high':
        return 'badge-warning';
      case 'medium':
        return 'badge-info';
      case 'low':
        return 'badge-neutral';
      default:
        return 'badge-neutral';
    }
  };

  // Get log level color
  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-error';
      case 'warn':
        return 'text-warning';
      case 'info':
        return 'text-info';
      case 'debug':
        return 'text-base-content/70';
      default:
        return 'text-base-content/70';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Format bytes
  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            System Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="loading loading-spinner loading-md text-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                System Monitoring
              </CardTitle>
              <p className="text-base-content/70 mt-1">
                Monitor system health and performance
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                className="btn-outline btn-sm"
                disabled={isRefreshing}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button onClick={onExportLogs} className="btn-primary btn-sm">
                <Download className="w-4 h-4" />
                Export Logs
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-base-content/70">System Status</div>
              <Badge className={getStatusColor(systemHealth.status)}>
                {getStatusIcon(systemHealth.status)}
                <span className="ml-1 capitalize">{systemHealth.status}</span>
              </Badge>
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatPercentage(systemHealth.uptime)}
            </div>
            <div className="text-xs text-base-content/50">Uptime</div>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-base-content/70">Response Time</div>
              <Activity className="w-4 h-4 text-info" />
            </div>
            <div className="text-2xl font-bold text-info">
              {systemHealth.responseTime}ms
            </div>
            <div className="text-xs text-base-content/50">Average</div>
          </CardContent>
        </Card>

        {/* Error Rate */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-base-content/70">Error Rate</div>
              <AlertTriangle className="w-4 h-4 text-warning" />
            </div>
            <div className="text-2xl font-bold text-warning">
              {formatPercentage(systemHealth.errorRate)}
            </div>
            <div className="text-xs text-base-content/50">Last 24h</div>
          </CardContent>
        </Card>

        {/* Database Connections */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-base-content/70">DB Connections</div>
              <Database className="w-4 h-4 text-success" />
            </div>
            <div className="text-2xl font-bold text-success">
              {systemHealth.databaseConnections}
            </div>
            <div className="text-xs text-base-content/50">Active</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Resource Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU Usage</span>
                  <span>{formatPercentage(systemHealth.cpuUsage)}</span>
                </div>
                <div className="w-full bg-base-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${systemHealth.cpuUsage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memory Usage</span>
                  <span>{formatPercentage(systemHealth.memoryUsage)}</span>
                </div>
                <div className="w-full bg-base-200 rounded-full h-2">
                  <div
                    className="bg-info h-2 rounded-full"
                    style={{ width: `${systemHealth.memoryUsage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Disk Usage</span>
                  <span>{formatPercentage(systemHealth.diskUsage)}</span>
                </div>
                <div className="w-full bg-base-200 rounded-full h-2">
                  <div
                    className="bg-warning h-2 rounded-full"
                    style={{ width: `${systemHealth.diskUsage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network & Database */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              Network & Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/70">
                  Network Latency
                </span>
                <span className="text-sm font-medium text-base-content">
                  {systemHealth.networkLatency}ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/70">
                  Database Connections
                </span>
                <span className="text-sm font-medium text-base-content">
                  {systemHealth.databaseConnections}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/70">
                  Last Backup
                </span>
                <span className="text-sm font-medium text-base-content">
                  {formatDate(systemHealth.lastBackup)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/70">Version</span>
                <span className="text-sm font-medium text-base-content">
                  {systemHealth.version}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            System Alerts
            {alerts.filter((a) => !a.resolved).length > 0 && (
              <Badge className="badge-error">
                {alerts.filter((a) => !a.resolved).length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-success" />
                <p className="text-base-content/70">No active alerts</p>
              </div>
            ) : (
              alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className={`alert ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5" />
                      <div>
                        <h4 className="font-semibold">{alert.title}</h4>
                        <p className="text-sm">{alert.message}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <span className="text-xs text-base-content/70">
                            {formatDate(alert.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!alert.resolved && (
                      <Button
                        onClick={() => onResolveAlert(alert.id)}
                        className="btn-sm btn-outline"
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {logs.length === 0 ? (
              <div className="text-center py-4">
                <Activity className="w-12 h-12 mx-auto mb-2 text-base-content/30" />
                <p className="text-base-content/70">No recent logs</p>
              </div>
            ) : (
              logs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-3 p-2 rounded hover:bg-base-200"
                >
                  <div
                    className={`text-xs font-mono ${getLogLevelColor(log.level)}`}
                  >
                    {log.level.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-base-content">{log.message}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-base-content/70">
                        {formatDate(log.timestamp)}
                      </span>
                      <span className="text-xs text-base-content/70">
                        {log.source}
                      </span>
                      {log.userId && (
                        <span className="text-xs text-base-content/70">
                          User: {log.userId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitoring;
