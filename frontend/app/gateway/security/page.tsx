"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Shield, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
  Globe,
  Settings,
  BarChart3,
  Copy,
  ExternalLink,
  TestTube,
  RefreshCw,
  Activity,
  Database,
  Server,
  Lock,
  Unlock,
  Play,
  Pause,
  FileText,
  Key,
  Timer,
  Users,
  Globe2,
  HardDrive,
  Wifi,
  Code,
  Layers,
  Filter as FilterIcon,
  
  Archive,
  Fingerprint,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function GatewaySecurityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample security data
  const securityConfigs = [
    {
      id: 'security_001',
      name: 'JWT Authentication',
      description: 'JSON Web Token authentication and validation',
      category: 'authentication',
      status: 'active',
      priority: 1,
      configuration: {
        algorithm: 'HS256',
        secretKey: 'encrypted_secret_key',
        issuer: 'etuna-auth-service',
        audience: 'etuna-api',
        expiration: 3600,
        refreshThreshold: 300,
        tokenHeader: 'Authorization',
        tokenPrefix: 'Bearer'
      },
      statistics: {
        requests: 12543,
        authenticated: 12498,
        failed: 45,
        successRate: 99.6,
        avgProcessingTime: 12
      },
      lastUpdated: '2024-01-20 14:30:00'
    },
    {
      id: 'security_002',
      name: 'API Key Authentication',
      description: 'API key-based authentication for service-to-service communication',
      category: 'authentication',
      status: 'active',
      priority: 2,
      configuration: {
        keyHeader: 'X-API-Key',
        keyPrefix: 'ak_',
        allowedKeys: ['ak_1234567890abcdef', 'ak_fedcba0987654321'],
        rateLimit: '1000/hour',
        ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8']
      },
      statistics: {
        requests: 8934,
        authenticated: 8934,
        failed: 0,
        successRate: 100,
        avgProcessingTime: 3
      },
      lastUpdated: '2024-01-20 14:29:45'
    },
    {
      id: 'security_003',
      name: 'Rate Limiting',
      description: 'Request rate limiting to prevent abuse and DDoS attacks',
      category: 'protection',
      status: 'active',
      priority: 3,
      configuration: {
        defaultLimit: '100/minute',
        burstLimit: '200/minute',
        windowSize: 60,
        algorithm: 'sliding_window',
        keyBy: 'ip',
        skipSuccessfulRequests: false,
        skipFailedRequests: false,
        storage: 'redis'
      },
      statistics: {
        requests: 15678,
        allowed: 15011,
        blocked: 667,
        blockRate: 4.3,
        avgProcessingTime: 8
      },
      lastUpdated: '2024-01-20 14:30:15'
    },
    {
      id: 'security_004',
      name: 'IP Whitelist',
      description: 'IP address whitelisting for restricted endpoints',
      category: 'access_control',
      status: 'active',
      priority: 4,
      configuration: {
        allowedIPs: ['192.168.1.0/24', '10.0.0.0/8', '172.16.0.0/12'],
        blockedIPs: ['192.168.1.100', '10.0.0.50'],
        geoBlocking: {
          enabled: true,
          blockedCountries: ['CN', 'RU', 'KP'],
          allowedCountries: ['US', 'CA', 'GB', 'DE', 'FR']
        }
      },
      statistics: {
        requests: 9876,
        allowed: 9854,
        blocked: 22,
        blockRate: 0.2,
        avgProcessingTime: 2
      },
      lastUpdated: '2024-01-20 14:30:08'
    },
    {
      id: 'security_005',
      name: 'SSL/TLS Encryption',
      description: 'End-to-end encryption for all API communications',
      category: 'encryption',
      status: 'active',
      priority: 5,
      configuration: {
        protocol: 'TLS 1.3',
        cipherSuites: ['TLS_AES_256_GCM_SHA384', 'TLS_CHACHA20_POLY1305_SHA256'],
        certificateAuthority: 'Let\'s Encrypt',
        certificateExpiry: '2024-04-20',
        hsts: {
          enabled: true,
          maxAge: 31536000,
          includeSubDomains: true
        }
      },
      statistics: {
        requests: 0,
        encrypted: 0,
        failed: 0,
        successRate: 100,
        avgProcessingTime: 0
      },
      lastUpdated: '2024-01-20 14:25:00'
    },
    {
      id: 'security_006',
      name: 'Request Validation',
      description: 'Input validation and sanitization to prevent injection attacks',
      category: 'validation',
      status: 'active',
      priority: 6,
      configuration: {
        maxRequestSize: '10MB',
        maxHeaderSize: '8KB',
        allowedContentTypes: ['application/json', 'application/x-www-form-urlencoded'],
        sanitization: {
          enabled: true,
          removeScripts: true,
          escapeHtml: true,
          validateJson: true
        },
        schemaValidation: {
          enabled: true,
          strictMode: true,
          validateRequired: true
        }
      },
      statistics: {
        requests: 12543,
        validated: 12498,
        rejected: 45,
        rejectRate: 0.4,
        avgProcessingTime: 5
      },
      lastUpdated: '2024-01-20 14:30:00'
    }
  ];

  const securityAlerts = [
    {
      id: 'alert_001',
      title: 'Suspicious IP Activity',
      description: 'Multiple failed authentication attempts from IP 192.168.1.100',
      severity: 'warning',
      status: 'active',
      timestamp: '2024-01-20 14:25:00',
      source: 'rate-limiting',
      action: 'blocked'
    },
    {
      id: 'alert_002',
      title: 'Certificate Expiry Warning',
      description: 'SSL certificate expires in 90 days',
      severity: 'info',
      status: 'acknowledged',
      timestamp: '2024-01-20 14:20:00',
      source: 'ssl-monitoring',
      action: 'notification_sent'
    },
    {
      id: 'alert_003',
      title: 'High Rate Limit Usage',
      description: 'Rate limit threshold exceeded for user user_123',
      severity: 'warning',
      status: 'active',
      timestamp: '2024-01-20 14:15:00',
      source: 'rate-limiting',
      action: 'throttled'
    }
  ];

  const securityMetrics = {
    totalRequests: 125430,
    blockedRequests: 1234,
    authenticationFailures: 89,
    rateLimitHits: 567,
    sslErrors: 12,
    validationFailures: 45,
    securityScore: 94.5
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'authentication':
        return 'text-error bg-error/10';
      case 'protection':
        return 'text-warning bg-warning/10';
      case 'access_control':
        return 'text-info bg-info/10';
      case 'encryption':
        return 'text-success bg-success/10';
      case 'validation':
        return 'text-primary bg-primary/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'inactive':
        return 'text-error bg-error/10';
      case 'maintenance':
        return 'text-warning bg-warning/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'inactive':
        return AlertTriangle;
      case 'maintenance':
        return Clock;
      default:
        return Shield;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication':
        return Key;
      case 'protection':
        return ShieldCheck;
      case 'access_control':
        return Lock;
      case 'encryption':
        return EyeOff;
      case 'validation':
        return CheckCircle2;
      default:
        return Shield;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-error bg-error/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'info':
        return 'text-info bg-info/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return AlertCircle;
      case 'warning':
        return AlertTriangle;
      case 'info':
        return CheckCircle;
      default:
        return Shield;
    }
  };

  const filteredConfigs = securityConfigs.filter(config =>
    config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'configurations', label: 'Configurations', icon: Settings },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Gateway Security"
        description="Security configuration, monitoring, alerts, and compliance"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Gateway', href: '/gateway' },
          { label: 'Security', href: '/gateway/security' }
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
                <ActionButton variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </ActionButton>
                <ActionButton>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Security Rule
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Security Score */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="card-title">Security Score</h3>
                  <div className="text-4xl font-bold text-success">{securityMetrics.securityScore}%</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-error">{securityMetrics.blockedRequests}</div>
                    <div className="text-sm text-base-content/70">Blocked Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">{securityMetrics.authenticationFailures}</div>
                    <div className="text-sm text-base-content/70">Auth Failures</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-info">{securityMetrics.rateLimitHits}</div>
                    <div className="text-sm text-base-content/70">Rate Limit Hits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{securityMetrics.validationFailures}</div>
                    <div className="text-sm text-base-content/70">Validation Failures</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Configurations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {securityConfigs.map((config) => {
                const StatusIcon = getStatusIcon(config.status);
                const CategoryIcon = getCategoryIcon(config.category);
                return (
                  <div key={config.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Shield className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{config.name}</h3>
                            <p className="text-sm text-base-content/70">{config.description}</p>
                          </div>
                        </div>
                        <div className={`badge ${getStatusColor(config.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.status.charAt(0).toUpperCase() + config.status.slice(1)}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-base-content/70">Category</span>
                          <div className={`badge ${getCategoryColor(config.category)}`}>
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {config.category.charAt(0).toUpperCase() + config.category.slice(1)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-base-content/70">Success Rate</span>
                          <span className="font-semibold text-success">{config.statistics.successRate}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-base-content/70">Processing Time</span>
                          <span className="font-semibold">{config.statistics.avgProcessingTime}ms</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-base-content/70">Priority</span>
                          <span className="font-semibold">{config.priority}</span>
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

        {/* Configurations Tab */}
        {activeTab === 'configurations' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search security configurations..."
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
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="authentication">Authentication</option>
                    <option value="protection">Protection</option>
                    <option value="access_control">Access Control</option>
                    <option value="encryption">Encryption</option>
                    <option value="validation">Validation</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Configurations List */}
            <div className="space-y-4 mb-8">
              {filteredConfigs.map((config) => {
                const StatusIcon = getStatusIcon(config.status);
                const CategoryIcon = getCategoryIcon(config.category);
                return (
                  <div key={config.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Shield className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{config.name}</h3>
                            <p className="text-sm text-base-content/70">{config.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="badge badge-outline badge-sm">
                                Priority {config.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(config.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {config.status.charAt(0).toUpperCase() + config.status.slice(1)}
                          </div>
                          <div className={`badge ${getCategoryColor(config.category)}`}>
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {config.category.charAt(0).toUpperCase() + config.category.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Total Requests</p>
                          <p className="font-semibold">{config.statistics.requests.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Success Rate</p>
                          <p className="font-semibold text-success">{config.statistics.successRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Failed/Blocked</p>
                          <p className="font-semibold text-error">
                            {config.statistics.failed || config.statistics.blocked || config.statistics.rejected || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Processing Time</p>
                          <p className="font-semibold">{config.statistics.avgProcessingTime}ms</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Configuration</p>
                        <div className="bg-base-200 p-3 rounded">
                          <pre className="text-sm overflow-x-auto">
                            {JSON.stringify(config.configuration, null, 2)}
                          </pre>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-base-content/70">
                          Last Updated: {config.lastUpdated}
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
                          <TestTube className="w-4 h-4" />
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

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4 mb-8">
            {securityAlerts.map((alert) => {
              const SeverityIcon = getSeverityIcon(alert.severity);
              return (
                <div key={alert.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <AlertTriangle className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{alert.title}</h3>
                          <p className="text-sm text-base-content/70">{alert.description}</p>
                          <p className="text-xs text-base-content/50">{alert.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className={`badge ${getSeverityColor(alert.severity)}`}>
                          <SeverityIcon className="w-3 h-3 mr-1" />
                          {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                        </div>
                        <div className={`badge ${getStatusColor(alert.status)}`}>
                          {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-base-content/70">Source</p>
                        <p className="font-semibold">{alert.source}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Action</p>
                        <p className="font-semibold">{alert.action}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Timestamp</p>
                        <p className="font-semibold">{alert.timestamp}</p>
                      </div>
                    </div>

                    <div className="card-actions justify-end">
                      <button className="btn btn-ghost btn-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <CheckCircle className="w-4 h-4" />
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Security Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Requests</span>
                    <span className="font-semibold">{securityMetrics.totalRequests.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Blocked Requests</span>
                    <span className="font-semibold text-error">{securityMetrics.blockedRequests}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Authentication Failures</span>
                    <span className="font-semibold text-warning">{securityMetrics.authenticationFailures}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rate Limit Hits</span>
                    <span className="font-semibold text-info">{securityMetrics.rateLimitHits}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SSL Errors</span>
                    <span className="font-semibold text-error">{securityMetrics.sslErrors}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Validation Failures</span>
                    <span className="font-semibold text-primary">{securityMetrics.validationFailures}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Security Score Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Authentication Security</span>
                    <span className="font-semibold text-success">98%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rate Limiting</span>
                    <span className="font-semibold text-success">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Access Control</span>
                    <span className="font-semibold text-success">92%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Encryption</span>
                    <span className="font-semibold text-success">100%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Input Validation</span>
                    <span className="font-semibold text-success">96%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Security Score</span>
                    <span className="font-semibold text-success text-lg">{securityMetrics.securityScore}%</span>
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
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Security Configs</p>
                  <p className="text-2xl font-bold">{securityConfigs.length}</p>
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
                  <p className="text-sm text-base-content/70">Active Configs</p>
                  <p className="text-2xl font-bold text-success">
                    {securityConfigs.filter(c => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-red-500 text-white">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Active Alerts</p>
                  <p className="text-2xl font-bold text-error">
                    {securityAlerts.filter(a => a.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Security Score</p>
                  <p className="text-2xl font-bold text-success">{securityMetrics.securityScore}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}