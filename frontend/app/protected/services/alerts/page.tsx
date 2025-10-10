"use client";

import { useState, useEffect } from "react";
import {
  BellIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface Alert {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'inactive' | 'resolved';
  service: string;
  condition: string;
  threshold: number;
  currentValue: number;
  unit: string;
  lastTriggered: string;
  triggerCount: number;
  notificationChannels: string[];
  escalationRules: string[];
  suppressionRules: string[];
  createdAt: string;
  updatedAt: string;
}

interface AlertHistory {
  id: string;
  alertId: string;
  timestamp: string;
  action: 'triggered' | 'resolved' | 'suppressed' | 'escalated';
  message: string;
  value: number;
  threshold: number;
  unit: string;
}

interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'slack' | 'webhook';
  enabled: boolean;
  configuration: Record<string, any>;
}

export default function AlertManagementPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertHistory, setAlertHistory] = useState<AlertHistory[]>([]);
  const [notificationChannels, setNotificationChannels] = useState<NotificationChannel[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterService, setFilterService] = useState<string>('all');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: 'alert-1',
        name: 'High CPU Usage',
        description: 'Alert when CPU usage exceeds 80%',
        severity: 'high',
        status: 'active',
        service: 'hospitality-service',
        condition: 'cpu_usage > 80',
        threshold: 80,
        currentValue: 85,
        unit: '%',
        lastTriggered: '2025-01-27T10:25:00Z',
        triggerCount: 5,
        notificationChannels: ['email', 'slack'],
        escalationRules: ['escalate-after-5-minutes'],
        suppressionRules: ['suppress-during-maintenance'],
        createdAt: '2025-01-20T09:00:00Z',
        updatedAt: '2025-01-27T10:25:00Z'
      },
      {
        id: 'alert-2',
        name: 'Response Time Critical',
        description: 'Alert when response time exceeds 500ms',
        severity: 'critical',
        status: 'active',
        service: 'menu-service',
        condition: 'response_time > 500',
        threshold: 500,
        currentValue: 0,
        unit: 'ms',
        lastTriggered: '2025-01-27T10:20:00Z',
        triggerCount: 12,
        notificationChannels: ['email', 'sms', 'slack'],
        escalationRules: ['escalate-after-2-minutes'],
        suppressionRules: [],
        createdAt: '2025-01-15T14:30:00Z',
        updatedAt: '2025-01-27T10:20:00Z'
      },
      {
        id: 'alert-3',
        name: 'Memory Usage Warning',
        description: 'Alert when memory usage exceeds 90%',
        severity: 'medium',
        status: 'inactive',
        service: 'auth-service',
        condition: 'memory_usage > 90',
        threshold: 90,
        currentValue: 60,
        unit: '%',
        lastTriggered: '2025-01-26T15:45:00Z',
        triggerCount: 2,
        notificationChannels: ['email'],
        escalationRules: [],
        suppressionRules: [],
        createdAt: '2025-01-10T11:15:00Z',
        updatedAt: '2025-01-26T15:45:00Z'
      },
      {
        id: 'alert-4',
        name: 'Error Rate High',
        description: 'Alert when error rate exceeds 5%',
        severity: 'high',
        status: 'resolved',
        service: 'payment-service',
        condition: 'error_rate > 5',
        threshold: 5,
        currentValue: 2.1,
        unit: '%',
        lastTriggered: '2025-01-25T08:30:00Z',
        triggerCount: 8,
        notificationChannels: ['email', 'slack'],
        escalationRules: ['escalate-after-3-minutes'],
        suppressionRules: [],
        createdAt: '2025-01-05T16:20:00Z',
        updatedAt: '2025-01-25T08:30:00Z'
      }
    ];

    const mockAlertHistory: AlertHistory[] = [
      {
        id: 'history-1',
        alertId: 'alert-1',
        timestamp: '2025-01-27T10:25:00Z',
        action: 'triggered',
        message: 'CPU usage exceeded threshold: 85% > 80%',
        value: 85,
        threshold: 80,
        unit: '%'
      },
      {
        id: 'history-2',
        alertId: 'alert-2',
        timestamp: '2025-01-27T10:20:00Z',
        action: 'triggered',
        message: 'Response time exceeded threshold: 0ms > 500ms',
        value: 0,
        threshold: 500,
        unit: 'ms'
      },
      {
        id: 'history-3',
        alertId: 'alert-4',
        timestamp: '2025-01-25T08:30:00Z',
        action: 'resolved',
        message: 'Error rate returned to normal: 2.1% < 5%',
        value: 2.1,
        threshold: 5,
        unit: '%'
      }
    ];

    const mockChannels: NotificationChannel[] = [
      {
        id: 'channel-1',
        name: 'Admin Email',
        type: 'email',
        enabled: true,
        configuration: { email: 'admin@buffrhost.com' }
      },
      {
        id: 'channel-2',
        name: 'DevOps Slack',
        type: 'slack',
        enabled: true,
        configuration: { webhook: 'https://hooks.slack.com/...' }
      },
      {
        id: 'channel-3',
        name: 'Emergency SMS',
        type: 'sms',
        enabled: false,
        configuration: { phone: '+1234567890' }
      }
    ];

    setAlerts(mockAlerts);
    setAlertHistory(mockAlertHistory);
    setNotificationChannels(mockChannels);
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'medium':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'high':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
      case 'critical':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'triggered':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case 'resolved':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'suppressed':
        return <EyeSlashIcon className="w-4 h-4 text-yellow-500" />;
      case 'escalated':
        return <ArrowPathIcon className="w-4 h-4 text-orange-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filterStatus !== 'all' && alert.status !== filterStatus) return false;
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterService !== 'all' && alert.service !== filterService) return false;
    return true;
  });

  const toggleAlertStatus = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: alert.status === 'active' ? 'inactive' : 'active' }
        : alert
    ));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Alert Management
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Configure alerts, notification channels, and escalation rules
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Create Alert</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <BellIcon className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Severity
              </label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
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
                <option value="api-gateway">API Gateway</option>
                <option value="auth-service">Auth Service</option>
                <option value="hospitality-service">Hospitality Service</option>
                <option value="menu-service">Menu Service</option>
                <option value="payment-service">Payment Service</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Alert Rules ({filteredAlerts.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getSeverityIcon(alert.severity)}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {alert.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {alert.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Service: {alert.service}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Condition: {alert.condition}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Triggered: {alert.triggerCount} times
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(
                        alert.severity
                      )}`}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        alert.status
                      )}`}
                    >
                      {alert.status.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleAlertStatus(alert.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title={alert.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {alert.status === 'active' ? (
                          <EyeSlashIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Edit Alert"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        title="Delete Alert"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert History */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Alert History
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {alertHistory.map((history) => (
              <div key={history.id} className="p-4">
                <div className="flex items-center space-x-3">
                  {getActionIcon(history.action)}
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {history.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(history.timestamp)}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {history.value} {history.unit} (threshold: {history.threshold} {history.unit})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Details Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Alert Details
                  </h2>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Alert Name
                      </label>
                      <p className="text-lg text-gray-900 dark:text-white">
                        {selectedAlert.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Severity
                      </label>
                      <div className="flex items-center space-x-2">
                        {getSeverityIcon(selectedAlert.severity)}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(
                            selectedAlert.severity
                          )}`}
                        >
                          {selectedAlert.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Description
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {selectedAlert.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Service
                      </label>
                      <p className="text-lg text-gray-900 dark:text-white">
                        {selectedAlert.service}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </label>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          selectedAlert.status
                        )}`}
                      >
                        {selectedAlert.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Condition
                      </label>
                      <p className="text-lg text-gray-900 dark:text-white font-mono">
                        {selectedAlert.condition}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Threshold
                      </label>
                      <p className="text-lg text-gray-900 dark:text-white">
                        {selectedAlert.threshold} {selectedAlert.unit}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Current Value
                      </label>
                      <p className="text-lg text-gray-900 dark:text-white">
                        {selectedAlert.currentValue} {selectedAlert.unit}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Trigger Count
                      </label>
                      <p className="text-lg text-gray-900 dark:text-white">
                        {selectedAlert.triggerCount}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Notification Channels
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedAlert.notificationChannels.map((channel) => (
                        <span
                          key={channel}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Last Triggered
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {formatTimestamp(selectedAlert.lastTriggered)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Alert Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Create New Alert
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Alert Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter alert name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                      placeholder="Enter alert description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Severity
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Service
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="api-gateway">API Gateway</option>
                        <option value="auth-service">Auth Service</option>
                        <option value="hospitality-service">Hospitality Service</option>
                        <option value="menu-service">Menu Service</option>
                        <option value="payment-service">Payment Service</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Condition
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., cpu_usage > 80"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Threshold
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="80"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Unit
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="%"
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
                      Create Alert
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
