"use client";
'use client';

import React from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { TrendingUp, DollarSign, Receipt, CreditCard, BarChart3, PieChart } from 'lucide-react';
import Link from 'next/link';

export default function RevenueDashboardPage() {
  const quickActions = [
    {
      title: 'Commission Management',
      description: 'Track and manage commission payments',
      href: '/protected/revenue/commissions',
      icon: DollarSign,
      color: 'bg-blue-500'
    },
    {
      title: 'Fee Management',
      description: 'Configure and monitor service fees',
      href: '/protected/revenue/fees',
      icon: CreditCard,
      color: 'bg-green-500'
    },
    {
      title: 'Invoice Management',
      description: 'Create and manage revenue invoices',
      href: '/protected/revenue/invoices',
      icon: Receipt,
      color: 'bg-purple-500'
    },
    {
      title: 'Subscription Management',
      description: 'Manage recurring subscriptions',
      href: '/protected/revenue/subscriptions',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  const stats = [
    { label: 'Total Revenue', value: 'N$ 245,680', change: '+15.3%', positive: true },
    { label: 'Commission Earned', value: 'N$ 12,284', change: '+8.7%', positive: true },
    { label: 'Service Fees', value: 'N$ 3,450', change: '+12.1%', positive: true },
    { label: 'Subscription Revenue', value: 'N$ 18,900', change: '+22.5%', positive: true }
  ];

  const revenueBreakdown = [
    { category: 'Accommodation', amount: 'N$ 156,800', percentage: 64, color: 'bg-blue-500' },
    { category: 'Restaurant', amount: 'N$ 45,200', percentage: 18, color: 'bg-green-500' },
    { category: 'Tours & Activities', amount: 'N$ 28,400', percentage: 12, color: 'bg-purple-500' },
    { category: 'Other Services', amount: 'N$ 15,280', percentage: 6, color: 'bg-orange-500' }
  ];

  const recentTransactions = [
    {
      id: 'REV001',
      description: 'Room booking commission',
      amount: 'N$ 1,250',
      date: '2024-03-10',
      status: 'completed',
      type: 'commission'
    },
    {
      id: 'REV002',
      description: 'Restaurant service fee',
      amount: 'N$ 450',
      date: '2024-03-09',
      status: 'pending',
      type: 'fee'
    },
    {
      id: 'REV003',
      description: 'Tour booking revenue',
      amount: 'N$ 2,100',
      date: '2024-03-08',
      status: 'completed',
      type: 'revenue'
    }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Revenue Dashboard"
        description="Track and manage your revenue streams, commissions, and financial performance."
        icon={<TrendingUp className="h-4 w-4" />}
        actions={
          <ActionButton
            onClick={() => window.location.href = '/protected/revenue/commissions'}
            variant="default"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Reports
          </ActionButton>
        }
      />

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-base-content/70">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`text-sm ${stat.positive ? 'text-success' : 'text-error'}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                  <div className="card-body text-center">
                    <div className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-base-content/70">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">Recent Revenue</h3>
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">{transaction.description}</p>
                      <p className="text-xs text-base-content/70">{transaction.id} • {transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{transaction.amount}</p>
                      <span className={`badge badge-sm ${
                        transaction.status === 'completed' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="card bg-base-100 shadow-xl mt-8">
          <div className="card-body">
            <h3 className="card-title mb-6">Revenue Breakdown</h3>
            <div className="space-y-4">
              {revenueBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${item.color} rounded`}></div>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-base-200 rounded-full h-2">
                      <div 
                        className={`h-2 ${item.color} rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold w-20 text-right">{item.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <PieChart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="card-title">Revenue Growth</h3>
              <p className="text-3xl font-bold text-success">+15.3%</p>
              <p className="text-sm text-base-content/70">vs last month</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="card-title">Top Revenue Source</h3>
              <p className="text-2xl font-bold">Accommodation</p>
              <p className="text-sm text-base-content/70">64% of total revenue</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="card-title">Monthly Target</h3>
              <p className="text-3xl font-bold text-info">87%</p>
              <p className="text-sm text-base-content/70">of monthly goal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
