"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Shield,
  Globe,
  Settings,
  BarChart3,
  Zap,
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  TestTube,
  Lock,
  Unlock,
  Wifi,
  Server
} from 'lucide-react';

export default function PaymentGatewaysPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('gateways');

  // Sample payment gateways data
  const gateways = [
    {
      id: 'GW001',
      name: 'PayGate',
      type: 'Credit Card',
      status: 'active',
      environment: 'production',
      merchantId: 'ETUNA001',
      apiKey: 'pk_live_etuna_2024',
      secretKey: 'sk_live_etuna_2024',
      webhookUrl: 'https://api.etuna.com/webhooks/paygate',
      supportedCurrencies: ['NAD', 'USD', 'EUR', 'ZAR'],
      supportedMethods: ['credit_card', 'debit_card', 'bank_transfer'],
      fees: {
        percentage: 2.9,
        fixed: 2.5,
        currency: 'NAD'
      },
      limits: {
        minAmount: 10,
        maxAmount: 100000,
        dailyLimit: 500000,
        monthlyLimit: 10000000
      },
      features: ['3d_secure', 'recurring_payments', 'refunds', 'partial_refunds'],
      lastTest: '2024-01-20 14:30:00',
      testResults: {
        connection: 'success',
        authentication: 'success',
        payment: 'success',
        refund: 'success'
      },
      statistics: {
        totalTransactions: 15420,
        successfulTransactions: 14890,
        failedTransactions: 530,
        totalVolume: 1254300,
        successRate: 96.6,
        averageResponseTime: 1.2
      },
      configuration: {
        autoCapture: true,
        retryFailedPayments: 3,
        timeoutSeconds: 60,
        enableWebhooks: true,
        enableLogging: true
      }
    },
    {
      id: 'GW002',
      name: 'PayPal',
      type: 'Digital Wallet',
      status: 'active',
      environment: 'production',
      merchantId: 'ETUNA_PAYPAL_001',
      apiKey: 'paypal_live_etuna_2024',
      secretKey: 'paypal_secret_etuna_2024',
      webhookUrl: 'https://api.etuna.com/webhooks/paypal',
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD'],
      supportedMethods: ['paypal', 'credit_card'],
      fees: {
        percentage: 3.4,
        fixed: 0.35,
        currency: 'USD'
      },
      limits: {
        minAmount: 1,
        maxAmount: 10000,
        dailyLimit: 100000,
        monthlyLimit: 2000000
      },
      features: ['express_checkout', 'recurring_payments', 'refunds'],
      lastTest: '2024-01-19 16:45:00',
      testResults: {
        connection: 'success',
        authentication: 'success',
        payment: 'success',
        refund: 'success'
      },
      statistics: {
        totalTransactions: 3240,
        successfulTransactions: 3120,
        failedTransactions: 120,
        totalVolume: 245600,
        successRate: 96.3,
        averageResponseTime: 2.1
      },
      configuration: {
        autoCapture: false,
        retryFailedPayments: 2,
        timeoutSeconds: 45,
        enableWebhooks: true,
        enableLogging: true
      }
    },
    {
      id: 'GW003',
      name: 'Stripe',
      type: 'Credit Card',
      status: 'inactive',
      environment: 'sandbox',
      merchantId: 'ETUNA_STRIPE_001',
      apiKey: 'pk_test_etuna_2024',
      secretKey: 'sk_test_etuna_2024',
      webhookUrl: 'https://api.etuna.com/webhooks/stripe',
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
      supportedMethods: ['credit_card', 'debit_card', 'apple_pay', 'google_pay'],
      fees: {
        percentage: 2.9,
        fixed: 0.30,
        currency: 'USD'
      },
      limits: {
        minAmount: 0.50,
        maxAmount: 999999,
        dailyLimit: 1000000,
        monthlyLimit: 50000000
      },
      features: ['3d_secure', 'recurring_payments', 'refunds', 'disputes', 'multi_currency'],
      lastTest: '2024-01-18 10:15:00',
      testResults: {
        connection: 'success',
        authentication: 'success',
        payment: 'failed',
        refund: 'success'
      },
      statistics: {
        totalTransactions: 0,
        successfulTransactions: 0,
        failedTransactions: 0,
        totalVolume: 0,
        successRate: 0,
        averageResponseTime: 0
      },
      configuration: {
        autoCapture: true,
        retryFailedPayments: 3,
        timeoutSeconds: 30,
        enableWebhooks: false,
        enableLogging: true
      }
    },
    {
      id: 'GW004',
      name: 'Bank Transfer',
      type: 'Bank Transfer',
      status: 'active',
      environment: 'production',
      merchantId: 'ETUNA_BANK_001',
      apiKey: 'bank_api_etuna_2024',
      secretKey: 'bank_secret_etuna_2024',
      webhookUrl: 'https://api.etuna.com/webhooks/bank',
      supportedCurrencies: ['NAD', 'USD', 'EUR'],
      supportedMethods: ['bank_transfer', 'eft'],
      fees: {
        percentage: 0.5,
        fixed: 5.0,
        currency: 'NAD'
      },
      limits: {
        minAmount: 100,
        maxAmount: 500000,
        dailyLimit: 1000000,
        monthlyLimit: 20000000
      },
      features: ['instant_transfer', 'batch_processing', 'refunds'],
      lastTest: '2024-01-17 09:30:00',
      testResults: {
        connection: 'success',
        authentication: 'success',
        payment: 'success',
        refund: 'success'
      },
      statistics: {
        totalTransactions: 890,
        successfulTransactions: 875,
        failedTransactions: 15,
        totalVolume: 456700,
        successRate: 98.3,
        averageResponseTime: 0.8
      },
      configuration: {
        autoCapture: true,
        retryFailedPayments: 1,
        timeoutSeconds: 120,
        enableWebhooks: true,
        enableLogging: true
      }
    }
  ];

  const gatewayTypes = [
    { name: 'Credit Card', count: 2, color: 'bg-blue-500' },
    { name: 'Digital Wallet', count: 1, color: 'bg-green-500' },
    { name: 'Bank Transfer', count: 1, color: 'bg-purple-500' },
    { name: 'Mobile Payment', count: 0, color: 'bg-orange-500' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'inactive':
        return 'text-error bg-error/10';
      case 'testing':
        return 'text-warning bg-warning/10';
      case 'maintenance':
        return 'text-info bg-info/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'inactive':
        return AlertCircle;
      case 'testing':
        return TestTube;
      case 'maintenance':
        return Settings;
      default:
        return CreditCard;
    }
  };

  const getEnvironmentColor = (environment: string) => {
    switch (environment) {
      case 'production':
        return 'text-success bg-success/10';
      case 'sandbox':
        return 'text-warning bg-warning/10';
      case 'test':
        return 'text-info bg-info/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getTestResultColor = (result: string) => {
    switch (result) {
      case 'success':
        return 'text-success bg-success/10';
      case 'failed':
        return 'text-error bg-error/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getTestResultIcon = (result: string) => {
    switch (result) {
      case 'success':
        return CheckCircle;
      case 'failed':
        return AlertCircle;
      case 'pending':
        return Clock;
      default:
        return TestTube;
    }
  };

  const filteredGateways = gateways.filter(gateway =>
    gateway.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gateway.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gateway.merchantId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'gateways', label: 'Payment Gateways', icon: CreditCard },
    { id: 'types', label: 'Gateway Types', icon: Settings },
    { id: 'testing', label: 'Testing', icon: TestTube },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Payment Gateways"
        description="Manage payment gateways, configurations, testing, and gateway analytics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Payments', href: '/payments' },
          { label: 'Gateways', href: '/payments/gateways' }
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
                  <TestTube className="w-4 h-4 mr-2" />
                  Test All
                </ActionButton>
                <ActionButton>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Gateway
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Gateways Tab */}
        {activeTab === 'gateways' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search gateways..."
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
                    <option value="inactive">Inactive</option>
                    <option value="testing">Testing</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Gateways Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredGateways.map((gateway) => {
                const StatusIcon = getStatusIcon(gateway.status);
                return (
                  <div key={gateway.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="card-title text-lg">{gateway.name}</h3>
                          <p className="text-sm text-base-content/70">{gateway.type}</p>
                          <p className="text-sm font-semibold">ID: {gateway.merchantId}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(gateway.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {gateway.status.charAt(0).toUpperCase() + gateway.status.slice(1)}
                          </div>
                          <div className={`badge ${getEnvironmentColor(gateway.environment)}`}>
                            {gateway.environment.charAt(0).toUpperCase() + gateway.environment.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-4 h-4 text-primary" />
                          <span className="text-sm">{gateway.supportedCurrencies.join(', ')}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-4 h-4 text-primary" />
                          <span className="text-sm">{gateway.supportedMethods.join(', ')}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="text-sm">
                            {gateway.fees.percentage}% + {gateway.fees.fixed} {gateway.fees.currency}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Features</p>
                        <div className="flex flex-wrap gap-1">
                          {gateway.features.map((feature, index) => (
                            <span key={index} className="badge badge-outline badge-sm">
                              {feature.charAt(0).toUpperCase() + feature.slice(1)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Success Rate</p>
                          <p className="font-semibold text-success">{gateway.statistics.successRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Response Time</p>
                          <p className="font-semibold">{gateway.statistics.averageResponseTime}s</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Total Volume</p>
                          <p className="font-semibold">
                            {gateway.statistics.totalVolume.toLocaleString()} {gateway.fees.currency}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Transactions</p>
                          <p className="font-semibold">{gateway.statistics.totalTransactions.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Test Results</p>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(gateway.testResults).map(([test, result]) => {
                            const ResultIcon = getTestResultIcon(result);
                            return (
                              <div key={test} className={`badge ${getTestResultColor(result)} badge-sm`}>
                                <ResultIcon className="w-3 h-3 mr-1" />
                                {test.charAt(0).toUpperCase() + test.slice(1)}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-base-content/70">
                          Last test: {gateway.lastTest}
                        </div>
                        <div className="text-sm text-base-content/70">
                          Min: {gateway.limits.minAmount} | Max: {gateway.limits.maxAmount}
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

        {/* Gateway Types Tab */}
        {activeTab === 'types' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {gatewayTypes.map((type, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-lg ${type.color} text-white`}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="card-title text-lg">{type.name}</h3>
                      <p className="text-sm text-base-content/70">{type.count} gateways</p>
                    </div>
                  </div>
                  <div className="card-actions justify-end">
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Testing Tab */}
        {activeTab === 'testing' && (
          <div className="space-y-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Gateway Testing Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {gateways.map((gateway) => (
                    <div key={gateway.id} className="card bg-base-200">
                      <div className="card-body">
                        <h4 className="card-title text-lg">{gateway.name}</h4>
                        <div className="space-y-2">
                          {Object.entries(gateway.testResults).map(([test, result]) => {
                            const ResultIcon = getTestResultIcon(result);
                            return (
                              <div key={test} className="flex items-center justify-between">
                                <span className="text-sm">{test.charAt(0).toUpperCase() + test.slice(1)}</span>
                                <div className={`badge ${getTestResultColor(result)} badge-sm`}>
                                  <ResultIcon className="w-3 h-3 mr-1" />
                                  {result.charAt(0).toUpperCase() + result.slice(1)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="card-actions justify-end mt-4">
                          <button className="btn btn-sm btn-primary">
                            <TestTube className="w-4 h-4 mr-2" />
                            Test Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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
                <h3 className="card-title mb-6">Gateway Performance</h3>
                <div className="space-y-4">
                  {gateways.map((gateway) => (
                    <div key={gateway.id} className="p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{gateway.name}</span>
                        <span className="font-semibold text-success">{gateway.statistics.successRate}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{gateway.statistics.totalTransactions.toLocaleString()} transactions</span>
                        <span>{gateway.statistics.averageResponseTime}s avg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Gateway Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Gateways</span>
                    <span className="font-semibold">{gateways.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Gateways</span>
                    <span className="font-semibold text-success">
                      {gateways.filter(g => g.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Volume</span>
                    <span className="font-semibold">
                      {gateways.reduce((sum, g) => sum + g.statistics.totalVolume, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Transactions</span>
                    <span className="font-semibold">
                      {gateways.reduce((sum, g) => sum + g.statistics.totalTransactions, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Success Rate</span>
                    <span className="font-semibold">
                      {(gateways.reduce((sum, g) => sum + g.statistics.successRate, 0) / gateways.length).toFixed(1)}%
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
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Gateways</p>
                  <p className="text-2xl font-bold">{gateways.length}</p>
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
                  <p className="text-sm text-base-content/70">Active Gateways</p>
                  <p className="text-2xl font-bold">
                    {gateways.filter(g => g.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Volume</p>
                  <p className="text-2xl font-bold">
                    {gateways.reduce((sum, g) => sum + g.statistics.totalVolume, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Transactions</p>
                  <p className="text-2xl font-bold">
                    {gateways.reduce((sum, g) => sum + g.statistics.totalTransactions, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}