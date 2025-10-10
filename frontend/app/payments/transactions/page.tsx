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
  Receipt,
  User,
  Calendar,
  Phone,
  Mail,
  Building2,
  TrendingUp,
  TrendingDown,
  Shield,
  RefreshCw,
  Download,
  BarChart3,
  Settings
} from 'lucide-react';

export default function PaymentTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('transactions');

  // Sample transactions data
  const transactions = [
    {
      id: 'TXN001',
      transactionId: 'TXN_20240120_001',
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      customerPhone: '+264 81 123 4567',
      propertyName: 'Etuna Guesthouse',
      reservationId: 'RES001',
      amount: 4500,
      currency: 'NAD',
      status: 'completed',
      paymentMethod: 'Credit Card',
      paymentGateway: 'PayGate',
      gatewayTransactionId: 'PG_123456789',
      fees: 135,
      netAmount: 4365,
      description: 'Room booking payment - 3 nights',
      transactionDate: '2024-01-20 14:30:00',
      processedDate: '2024-01-20 14:31:15',
      refundAmount: 0,
      refundStatus: null,
      metadata: {
        cardLast4: '1234',
        cardBrand: 'Visa',
        authCode: 'AUTH123'
      }
    },
    {
      id: 'TXN002',
      transactionId: 'TXN_20240120_002',
      customerName: 'Maria Garcia',
      customerEmail: 'maria.garcia@email.com',
      customerPhone: '+264 81 234 5678',
      propertyName: 'Namibia Safari Lodge',
      reservationId: 'RES002',
      amount: 8500,
      currency: 'NAD',
      status: 'pending',
      paymentMethod: 'Bank Transfer',
      paymentGateway: 'PayGate',
      gatewayTransactionId: 'PG_987654321',
      fees: 255,
      netAmount: 8245,
      description: 'Safari lodge booking - deposit',
      transactionDate: '2024-01-20 16:45:00',
      processedDate: null,
      refundAmount: 0,
      refundStatus: null,
      metadata: {
        bankName: 'First National Bank',
        accountLast4: '5678'
      }
    },
    {
      id: 'TXN003',
      transactionId: 'TXN_20240119_001',
      customerName: 'David Johnson',
      customerEmail: 'david.johnson@email.com',
      customerPhone: '+264 81 345 6789',
      propertyName: 'Coastal Retreat',
      reservationId: 'RES003',
      amount: 7200,
      currency: 'NAD',
      status: 'completed',
      paymentMethod: 'Mobile Payment',
      paymentGateway: 'PayGate',
      gatewayTransactionId: 'PG_456789123',
      fees: 216,
      netAmount: 6984,
      description: 'Ocean view room payment',
      transactionDate: '2024-01-19 10:15:00',
      processedDate: '2024-01-19 10:16:30',
      refundAmount: 0,
      refundStatus: null,
      metadata: {
        mobileProvider: 'MTC',
        phoneLast4: '6789'
      }
    },
    {
      id: 'TXN004',
      transactionId: 'TXN_20240118_001',
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah.wilson@email.com',
      customerPhone: '+264 81 456 7890',
      propertyName: 'Etuna Guesthouse',
      reservationId: 'RES004',
      amount: 3200,
      currency: 'NAD',
      status: 'refunded',
      paymentMethod: 'Credit Card',
      paymentGateway: 'PayGate',
      gatewayTransactionId: 'PG_789123456',
      fees: 96,
      netAmount: 3104,
      description: 'Weekend getaway payment',
      transactionDate: '2024-01-18 09:30:00',
      processedDate: '2024-01-18 09:31:45',
      refundAmount: 3200,
      refundStatus: 'completed',
      metadata: {
        cardLast4: '5678',
        cardBrand: 'Mastercard',
        authCode: 'AUTH456',
        refundReason: 'Customer cancellation'
      }
    },
    {
      id: 'TXN005',
      transactionId: 'TXN_20240117_001',
      customerName: 'Robert Brown',
      customerEmail: 'robert.brown@email.com',
      customerPhone: '+264 81 567 8901',
      propertyName: 'Mountain View Inn',
      reservationId: 'RES005',
      amount: 1800,
      currency: 'NAD',
      status: 'failed',
      paymentMethod: 'Credit Card',
      paymentGateway: 'PayGate',
      gatewayTransactionId: 'PG_321654987',
      fees: 0,
      netAmount: 0,
      description: 'Mountain inn booking attempt',
      transactionDate: '2024-01-17 15:20:00',
      processedDate: null,
      refundAmount: 0,
      refundStatus: null,
      metadata: {
        cardLast4: '9012',
        cardBrand: 'Visa',
        failureReason: 'Insufficient funds'
      }
    }
  ];

  const paymentMethods = [
    { name: 'Credit Card', count: 3, color: 'bg-blue-500', icon: CreditCard },
    { name: 'Bank Transfer', count: 1, color: 'bg-green-500', icon: Building2 },
    { name: 'Mobile Payment', count: 1, color: 'bg-purple-500', icon: Phone },
    { name: 'Cash', count: 0, color: 'bg-orange-500', icon: DollarSign }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'failed':
        return 'text-error bg-error/10';
      case 'refunded':
        return 'text-info bg-info/10';
      case 'cancelled':
        return 'text-base-content bg-base-300';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'failed':
        return AlertCircle;
      case 'refunded':
        return RefreshCw;
      case 'cancelled':
        return AlertCircle;
      default:
        return CreditCard;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Credit Card':
        return CreditCard;
      case 'Bank Transfer':
        return Building2;
      case 'Mobile Payment':
        return Phone;
      case 'Cash':
        return DollarSign;
      default:
        return CreditCard;
    }
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.reservationId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'methods', label: 'Payment Methods', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Payment Transactions"
        description="Manage payment transactions, methods, analytics, and payment gateway settings"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Payments', href: '/payments' },
          { label: 'Transactions', href: '/payments/transactions' }
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
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </ActionButton>
                <ActionButton>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search transactions..."
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
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className="space-y-4 mb-8">
              {filteredTransactions.map((transaction) => {
                const StatusIcon = getStatusIcon(transaction.status);
                const PaymentMethodIcon = getPaymentMethodIcon(transaction.paymentMethod);
                return (
                  <div key={transaction.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <PaymentMethodIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{transaction.customerName}</h3>
                            <p className="text-sm text-base-content/70">{transaction.propertyName}</p>
                            <p className="text-sm font-medium">Reservation: {transaction.reservationId}</p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(transaction.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </div>
                          <div className="badge badge-outline">
                            {transaction.paymentMethod}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Amount</p>
                          <p className="font-semibold">{transaction.currency} {transaction.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Fees</p>
                          <p className="font-semibold">{transaction.currency} {transaction.fees.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Net Amount</p>
                          <p className="font-semibold">{transaction.currency} {transaction.netAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Gateway</p>
                          <p className="font-semibold">{transaction.paymentGateway}</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="text-sm">{transaction.customerEmail}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm">{transaction.customerPhone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm">Transaction: {transaction.transactionDate}</span>
                        </div>
                        {transaction.processedDate && (
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-4 h-4 text-success" />
                            <span className="text-sm">Processed: {transaction.processedDate}</span>
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-1">Description</p>
                        <p className="text-sm bg-base-200 p-2 rounded">{transaction.description}</p>
                      </div>

                      {transaction.refundAmount > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-base-content/70 mb-1">Refund Information</p>
                          <div className="bg-info/10 p-2 rounded border-l-4 border-info">
                            <p className="text-sm">
                              Refunded: {transaction.currency} {transaction.refundAmount.toLocaleString()} 
                              {transaction.metadata.refundReason && ` - ${transaction.metadata.refundReason}`}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-base-content/70">
                          Gateway ID: {transaction.gatewayTransactionId}
                        </div>
                        <div className="flex space-x-2">
                          <button className="btn btn-ghost btn-sm">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm">
                            <Receipt className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm">
                            <Download className="w-4 h-4" />
                          </button>
                          {transaction.status === 'completed' && (
                            <button className="btn btn-ghost btn-sm">
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'methods' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {paymentMethods.map((method, index) => {
              const MethodIcon = method.icon;
              return (
                <div key={index} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-3 rounded-lg ${method.color} text-white`}>
                        <MethodIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="card-title text-lg">{method.name}</h3>
                        <p className="text-sm text-base-content/70">{method.count} transactions</p>
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
              );
            })}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Transaction Analytics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Transactions</span>
                    <span className="font-semibold">{transactions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="font-semibold text-success">
                      {transactions.filter(t => t.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending</span>
                    <span className="font-semibold text-warning">
                      {transactions.filter(t => t.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Failed</span>
                    <span className="font-semibold text-error">
                      {transactions.filter(t => t.status === 'failed').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Refunded</span>
                    <span className="font-semibold text-info">
                      {transactions.filter(t => t.status === 'refunded').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Revenue Analytics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Revenue</span>
                    <span className="font-semibold">
                      NAD {transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Fees</span>
                    <span className="font-semibold">
                      NAD {transactions.reduce((sum, t) => sum + t.fees, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Net Revenue</span>
                    <span className="font-semibold">
                      NAD {transactions.reduce((sum, t) => sum + t.netAmount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Refunded Amount</span>
                    <span className="font-semibold">
                      NAD {transactions.reduce((sum, t) => sum + t.refundAmount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Transaction</span>
                    <span className="font-semibold">
                      NAD {Math.round(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Payment Gateway Settings</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Primary Gateway</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="PayGate">PayGate</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Stripe">Stripe</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Merchant ID</span>
                    </label>
                    <input type="text" className="input input-bordered" defaultValue="ETUNA001" />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">API Key</span>
                    </label>
                    <input type="password" className="input input-bordered" defaultValue="pk_live_etuna_2024" />
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Test Mode</span>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Payment Processing</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Auto-capture</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="immediate">Immediate</option>
                      <option value="manual">Manual</option>
                      <option value="delayed">Delayed (24h)</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Retry Failed Payments</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="0">No Retry</option>
                      <option value="1">1 Retry</option>
                      <option value="3" selected>3 Retries</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Transaction Timeout</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="30">30 seconds</option>
                      <option value="60" selected>60 seconds</option>
                      <option value="120">120 seconds</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Enable Webhooks</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
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
                  <p className="text-sm text-base-content/70">Total Transactions</p>
                  <p className="text-2xl font-bold">{transactions.length}</p>
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
                  <p className="text-sm text-base-content/70">Completed</p>
                  <p className="text-2xl font-bold">
                    {transactions.filter(t => t.status === 'completed').length}
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
                  <p className="text-sm text-base-content/70">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    NAD {transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Success Rate</p>
                  <p className="text-2xl font-bold">
                    {Math.round((transactions.filter(t => t.status === 'completed').length / transactions.length) * 100)}%
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