"use client";
'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Bell, 
  Search, 
  Filter, 
  RefreshCw,
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
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Copy,
  ExternalLink,
  Pause,
  Play,
  Trash2,
  Edit,
  Plus,
  Users,
  Mail,
  MessageSquare,
  Phone
} from 'lucide-react';

export default function ServiceAlertsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('alerts');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Sample alerts data
  const alerts = [
    {
      id: 'alert_001',
      title: 'High CPU Usage',
      description: 'CPU usage has exceeded 80% threshold for more than 5 minutes',
      severity: 'warning',
      status: 'active',
      service: 'booking-service',
      serviceName: 'Booking Service',
      metric: 'cpu_usage',
      threshold: 80,
      currentValue: 85.2,
      triggeredAt: '2024-01-20 14:25:00',
      lastUpdated: '2024-01-20 14:30:00',
      duration: '5 minutes',
      notifications: {
        email: true,
        sms: false,
        slack: true,
        webhook: false
      },
      escalation: {
        level: 1,
        maxLevel: 3,
        nextEscalation: '2024-01-20 14:35:00'
      },
      suppression: {
        active: false,
        until: null,
        reason: null
      }
    },
    {
      id: 'alert_002',
      title: 'Service Down',
      description: 'Payment service is not responding to health checks',
      severity: 'critical',
      status: 'active',
      service: 'payment-service',
      serviceName: 'Payment Service',
      metric: 'service_health',
      threshold: 0,
      currentValue: 0,
      triggeredAt: '2024-01-20 14:20:00',
      lastUpdated: '2024-01-20 14:30:00',
      duration: '10 minutes',
      notifications: {
        email: true,
        sms: true,
        slack: true,
        webhook: true
      },
      escalation: {
        level: 2,
        maxLevel: 3,
        nextEscalation: '2024-01-20 14:32:00'
      },
      suppression: {
        active: false,
        until: null,
        reason: null
      }
    },
    {
      id: 'alert_003',
      title: 'High Error Rate',
      description: 'Error rate has exceeded 5% threshold',
      severity: 'error',
      status: 'acknowledged',
      service: 'auth-service',
      serviceName: 'Authentication Service',
      metric: 'error_rate',
      threshold: 5,
      currentValue: 7.2,
      triggeredAt: '2024-01-20 14:15:00',
      lastUpdated: '2024-01-20 14:28:00',
      duration: '13 minutes',
      notifications: {
        email: true,
        sms: false,
        slack: true,
        webhook: false
      },
      escalation: {
        level: 1,
        maxLevel: 3,
        nextEscalation: '2024-01-20 14:33:00'
      },
      suppression: {
        active: false,
        until: null,
        reason: null
      }
    },
    {
      id: 'alert_004',
      title: 'Low Disk Space',
      description: 'Disk usage has exceeded 90% threshold',
      severity: 'warning',
      status: 'suppressed',
      service: 'notification-service',
      serviceName: 'Notification Service',
      metric: 'disk_usage',
      threshold: 90,
      currentValue: 92.1,
      triggeredAt: '2024-01-20 14:10:00',
      lastUpdated: '2024-01-20 14:25:00',
      duration: '15 minutes',
      notifications: {
        email: false,
        sms: false,
        slack: false,
        webhook: false
      },
      escalation: {
        level: 1,
        maxLevel: 3,
        nextEscalation: null
      },
      suppression: {
        active: true,
        until: '2024-01-20 16:00:00',
        reason: 'Maintenance window'
      }
    },
    {
      id: 'alert_005',
      title: 'High Response Time',
      description: 'Average response time has exceeded 500ms threshold',
      severity: 'warning',
      status: 'resolved',
      service: 'analytics-service',
      serviceName: 'Analytics Service',
      metric: 'response_time',
      threshold: 500,
      currentValue: 0,
      triggeredAt: '2024-01-20 14:00:00',
      lastUpdated: '2024-01-20 14:20:00',
      duration: '20 minutes',
      notifications: {
        email: true,
        sms: false,
        slack: true,
        webhook: false
      },
      escalation: {
        level: 0,
        maxLevel: 3,
        nextEscalation: null
      },
      suppression: {
        active: false,
        until: null,
        reason: null
      }
    }
  ];

  const notificationChannels = [
    { id: 'email', name: 'Email', icon: Mail, enabled: true, count: 4 },
    { id: 'sms', name: 'SMS', icon: Phone, enabled: true, count: 1 },
    { id: 'slack', name: 'Slack', icon: MessageSquare, enabled: true, count: 4 },
    { id: 'webhook', name: 'Webhook', icon: ExternalLink, enabled: true, count: 1 }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-error bg-error/10';
      case 'error':
        return 'text-error bg-error/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'info':
        return 'text-info bg-info/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-error bg-error/10';
      case 'acknowledged':
        return 'text-warning bg-warning/10';
      case 'suppressed':
        return 'text-info bg-info/10';
      case 'resolved':
        return 'text-success bg-success/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return AlertTriangle;
      case 'error':
        return AlertTriangle;
      case 'warning':
        return AlertTriangle;
      case 'info':
        return Bell;
      default:
        return Bell;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return AlertTriangle;
      case 'acknowledged':
        return Clock;
      case 'suppressed':
        return Pause;
      case 'resolved':
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const filteredAlerts = alerts.filter(alert =>
    alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(alert =>
    statusFilter === 'all' || alert.status === statusFilter
  ).filter(alert =>
    severityFilter === 'all' || alert.severity === severityFilter
  );

  const tabs = [
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'channels', label: 'Channels', icon: Users },
    { id: 'rules', label: 'Rules', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const refreshData = () => {
    setLastRefresh(new Date());
    // In a real app, this would trigger a data refresh
  };

  const acknowledgeAlert = (alertId: string) => {
    // In a real app, this would acknowledge the alert
    console.log('Acknowledging alert:', alertId);
  };

  const suppressAlert = (alertId: string) => {
    // In a real app, this would suppress the alert
    console.log('Suppressing alert:', alertId);
  };

  const resolveAlert = (alertId: string) => {
    // In a real app, this would resolve the alert
    console.log('Resolving alert:', alertId);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Service Alerts"
        description="Alert configuration, notification channels, escalation rules, and alert analytics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Services', href: '/services' },
          { label: 'Alerts', href: '/services/alerts' }
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
                <ActionButton variant="outline" onClick={refreshData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </ActionButton>
                <ActionButton>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Alert
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search alerts..."
                        className="input input-bordered w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn btn-square">
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <select
                    className="select select-bordered w-full md:w-40"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="acknowledged">Acknowledged</option>
                    <option value="suppressed">Suppressed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <select
                    className="select select-bordered w-full md:w-40"
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                  >
                    <option value="all">All Severity</option>
                    <option value="critical">Critical</option>
                    <option value="error">Error</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-4 mb-8">
              {filteredAlerts.map((alert) => {
                const SeverityIcon = getSeverityIcon(alert.severity);
                const StatusIcon = getStatusIcon(alert.status);
                return (
                  <div key={alert.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Bell className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{alert.title}</h3>
                            <p className="text-sm text-base-content/70">{alert.description}</p>
                            <p className="text-xs text-base-content/50">{alert.serviceName}</p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getSeverityColor(alert.severity)}`}>
                            <SeverityIcon className="w-3 h-3 mr-1" />
                            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                          </div>
                          <div className={`badge ${getStatusColor(alert.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Metric</p>
                          <p className="font-semibold">{alert.metric}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Threshold</p>
                          <p className="font-semibold">{alert.threshold}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Current Value</p>
                          <p className="font-semibold">{alert.currentValue}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Duration</p>
                          <p className="font-semibold">{alert.duration}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Notifications</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(alert.notifications).map(([channel, enabled]) => (
                            <span key={channel} className={`badge badge-sm ${enabled ? 'badge-success' : 'badge-outline'}`}>
                              {channel.charAt(0).toUpperCase() + channel.slice(1)}
                            </span>
                          ))}
                        </div>
                      </div>

                      {alert.suppression.active && (
                        <div className="mb-4">
                          <p className="text-xs text-base-content/70 mb-1">Suppression</p>
                          <div className="bg-info/10 p-2 rounded border-l-4 border-info">
                            <p className="text-sm text-info">
                              Suppressed until {alert.suppression.until} - {alert.suppression.reason}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-base-content/70">
                          Triggered: {alert.triggeredAt}
                        </div>
                        <div className="text-sm text-base-content/70">
                          Updated: {alert.lastUpdated}
                        </div>
                      </div>

                      <div className="card-actions justify-end">
                        {alert.status === 'active' && (
                          <>
                            <button 
                              className="btn btn-warning btn-sm"
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              Acknowledge
                            </button>
                            <button 
                              className="btn btn-info btn-sm"
                              onClick={() => suppressAlert(alert.id)}
                            >
                              <Pause className="w-4 h-4 mr-2" />
                              Suppress
                            </button>
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => resolveAlert(alert.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Resolve
                            </button>
                          </>
                        )}
                        <button className="btn btn-ghost btn-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Channels Tab */}
        {activeTab === 'channels' && (
          <div className="space-y-4 mb-8">
            {notificationChannels.map((channel, index) => {
              const ChannelIcon = channel.icon;
              return (
                <div key={index} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <ChannelIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{channel.name}</h3>
                          <p className="text-sm text-base-content/70">
                            {channel.enabled ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className={`badge ${channel.enabled ? 'badge-success' : 'badge-error'}`}>
                          {channel.enabled ? 'Enabled' : 'Disabled'}
                        </div>
                        <div className="badge badge-outline">
                          {channel.count} alerts
                        </div>
                      </div>
                    </div>

                    <div className="card-actions justify-end">
                      <button className="btn btn-ghost btn-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Edit className="w-4 h-4" />
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
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Alert Rules Configuration</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-base-200 rounded-lg">
                    <h4 className="font-semibold mb-2">CPU Usage Alert</h4>
                    <p className="text-sm text-base-content/70 mb-3">
                      Trigger when CPU usage exceeds 80% for more than 5 minutes
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>Threshold: 80%</span>
                      <span>Duration: 5 minutes</span>
                      <span>Severity: Warning</span>
                    </div>
                  </div>
                  <div className="p-4 bg-base-200 rounded-lg">
                    <h4 className="font-semibold mb-2">Service Health Alert</h4>
                    <p className="text-sm text-base-content/70 mb-3">
                      Trigger when service health check fails
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>Threshold: 0</span>
                      <span>Duration: 1 minute</span>
                      <span>Severity: Critical</span>
                    </div>
                  </div>
                  <div className="p-4 bg-base-200 rounded-lg">
                    <h4 className="font-semibold mb-2">Error Rate Alert</h4>
                    <p className="text-sm text-base-content/70 mb-3">
                      Trigger when error rate exceeds 5% for more than 3 minutes
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>Threshold: 5%</span>
                      <span>Duration: 3 minutes</span>
                      <span>Severity: Error</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Alert Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Alerts</span>
                    <span className="font-semibold">{alerts.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Alerts</span>
                    <span className="font-semibold text-error">
                      {alerts.filter(a => a.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Acknowledged Alerts</span>
                    <span className="font-semibold text-warning">
                      {alerts.filter(a => a.status === 'acknowledged').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resolved Alerts</span>
                    <span className="font-semibold text-success">
                      {alerts.filter(a => a.status === 'resolved').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Suppressed Alerts</span>
                    <span className="font-semibold text-info">
                      {alerts.filter(a => a.status === 'suppressed').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Severity Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Critical</span>
                    <span className="font-semibold text-error">
                      {alerts.filter(a => a.severity === 'critical').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error</span>
                    <span className="font-semibold text-error">
                      {alerts.filter(a => a.severity === 'error').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Warning</span>
                    <span className="font-semibold text-warning">
                      {alerts.filter(a => a.severity === 'warning').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Info</span>
                    <span className="font-semibold text-info">
                      {alerts.filter(a => a.severity === 'info').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-red-500 text-white">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Active Alerts</p>
                  <p className="text-2xl font-bold text-error">
                    {alerts.filter(a => a.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-yellow-500 text-white">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Acknowledged</p>
                  <p className="text-2xl font-bold text-warning">
                    {alerts.filter(a => a.status === 'acknowledged').length}
                  </p>
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
                  <p className="text-sm text-base-content/70">Resolved</p>
                  <p className="text-2xl font-bold text-success">
                    {alerts.filter(a => a.status === 'resolved').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Alerts</p>
                  <p className="text-2xl font-bold">{alerts.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Last Refresh Info */}
        <div className="text-center text-sm text-base-content/70 mt-8">
          Last refreshed: {lastRefresh.toLocaleString()}
        </div>
      </div>
    </div>
  );
}