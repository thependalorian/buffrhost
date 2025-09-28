'use client';

import React from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { DollarSign, TrendingUp, CreditCard, Receipt, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';

export default function FinanceDashboardPage() {
  const quickActions = [
    {
      title: 'View Transactions',
      description: 'Review all financial transactions',
      href: '/protected/finance/transactions',
      icon: Receipt,
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Accounts',
      description: 'Configure financial accounts',
      href: '/protected/finance/accounts',
      icon: CreditCard,
      color: 'bg-green-500'
    },
    {
      title: 'Payment Gateways',
      description: 'Configure payment methods',
      href: '/protected/finance/gateways',
      icon: Settings,
      color: 'bg-purple-500'
    },
    {
      title: 'Disbursements',
      description: 'Manage payouts and disbursements',
      href: '/protected/finance/disbursements',
      icon: DollarSign,
      color: 'bg-orange-500'
    }
  ];

  const stats = [
    { label: 'Total Revenue', value: 'N$ 125,430', change: '+12.5%', positive: true },
    { label: 'Pending Payments', value: 'N$ 8,920', change: '-2.1%', positive: false },
    { label: 'Completed Transactions', value: '1,247', change: '+8.3%', positive: true },
    { label: 'Average Transaction', value: 'N$ 156', change: '+5.2%', positive: true }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Finance Dashboard"
        description="Manage your financial operations, transactions, and revenue tracking."
        icon={<DollarSign className="h-4 w-4" />}
        actions={
          <ActionButton
            onClick={() => window.location.href = '/protected/finance/transactions'}
            variant="primary"
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Recent Activity */}
        <div className="card bg-base-100 shadow-xl mt-8">
          <div className="card-body">
            <h3 className="card-title mb-4">Recent Financial Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Payment Received</p>
                    <p className="text-sm text-base-content/70">Booking #BK001 - N$ 2,500</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">+N$ 2,500</p>
                  <p className="text-sm text-base-content/70">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Payment Pending</p>
                    <p className="text-sm text-base-content/70">Booking #BK002 - N$ 1,800</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-warning">N$ 1,800</p>
                  <p className="text-sm text-base-content/70">4 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
