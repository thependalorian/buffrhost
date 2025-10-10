"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  Eye,
  Receipt,
  CreditCard,
  Banknote,
  Calculator,
  Target,
  AlertCircle
} from 'lucide-react';

export default function EtunaFinancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');

  // Sample financial data
  const financialOverview = {
    totalRevenue: 125430,
    totalExpenses: 89450,
    netProfit: 35980,
    occupancyRate: 78,
    averageRoomRate: 1450,
    revenueGrowth: 12.5,
    expenseGrowth: 8.2
  };

  const revenueBreakdown = [
    { category: 'Room Revenue', amount: 85600, percentage: 68.2, color: 'bg-blue-500' },
    { category: 'Restaurant Revenue', amount: 24500, percentage: 19.5, color: 'bg-green-500' },
    { category: 'Tour Revenue', amount: 12300, percentage: 9.8, color: 'bg-purple-500' },
    { category: 'Other Services', amount: 3030, percentage: 2.4, color: 'bg-orange-500' }
  ];

  const expenseBreakdown = [
    { category: 'Staff Salaries', amount: 45200, percentage: 50.5, color: 'bg-red-500' },
    { category: 'Food & Beverage', amount: 18900, percentage: 21.1, color: 'bg-yellow-500' },
    { category: 'Utilities', amount: 12300, percentage: 13.7, color: 'bg-blue-500' },
    { category: 'Maintenance', amount: 8500, percentage: 9.5, color: 'bg-green-500' },
    { category: 'Marketing', amount: 4550, percentage: 5.1, color: 'bg-purple-500' }
  ];

  const recentTransactions = [
    {
      id: 'TXN001',
      date: '2024-01-20',
      description: 'Room Payment - John Smith',
      amount: 4500,
      type: 'revenue',
      category: 'Room Revenue',
      method: 'Credit Card'
    },
    {
      id: 'TXN002',
      date: '2024-01-20',
      description: 'Restaurant Order - Room 101',
      amount: 455,
      type: 'revenue',
      category: 'Restaurant Revenue',
      method: 'Room Charge'
    },
    {
      id: 'TXN003',
      date: '2024-01-20',
      description: 'Staff Salary - January',
      amount: -15200,
      type: 'expense',
      category: 'Staff Salaries',
      method: 'Bank Transfer'
    },
    {
      id: 'TXN004',
      date: '2024-01-19',
      description: 'Tour Payment - Etosha Safari',
      amount: 2800,
      type: 'revenue',
      category: 'Tour Revenue',
      method: 'Cash'
    },
    {
      id: 'TXN005',
      date: '2024-01-19',
      description: 'Utility Bill - Electricity',
      amount: -3200,
      type: 'expense',
      category: 'Utilities',
      method: 'Bank Transfer'
    }
  ];

  const monthlyTrends = [
    { month: 'Oct 2023', revenue: 112000, expenses: 82000, profit: 30000 },
    { month: 'Nov 2023', revenue: 118500, expenses: 85000, profit: 33500 },
    { month: 'Dec 2023', revenue: 135200, expenses: 92000, profit: 43200 },
    { month: 'Jan 2024', revenue: 125430, expenses: 89450, profit: 35980 }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Financial Reports"
        description="Revenue, expenses, and financial analytics for Etuna Guesthouse"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Etuna Management', href: '/protected/etuna' },
          { label: 'Financial Reports', href: '/protected/etuna/finance' }
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
                <select
                  className="select select-bordered w-full md:w-40"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <ActionButton variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-green-500 text-white">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Total Revenue</p>
                      <p className="text-2xl font-bold">N$ {financialOverview.totalRevenue.toLocaleString()}</p>
                      <p className="text-sm text-success">+{financialOverview.revenueGrowth}%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-red-500 text-white">
                      <TrendingDown className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Total Expenses</p>
                      <p className="text-2xl font-bold">N$ {financialOverview.totalExpenses.toLocaleString()}</p>
                      <p className="text-sm text-error">+{financialOverview.expenseGrowth}%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-blue-500 text-white">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Net Profit</p>
                      <p className="text-2xl font-bold">N$ {financialOverview.netProfit.toLocaleString()}</p>
                      <p className="text-sm text-success">+15.2%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-purple-500 text-white">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Occupancy Rate</p>
                      <p className="text-2xl font-bold">{financialOverview.occupancyRate}%</p>
                      <p className="text-sm text-success">+5%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Revenue Breakdown */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-6">Revenue Breakdown</h3>
                  <div className="space-y-4">
                    {revenueBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded ${item.color}`}></div>
                          <span className="text-sm font-medium">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">N$ {item.amount.toLocaleString()}</p>
                          <p className="text-sm text-base-content/70">{item.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-6">Expense Breakdown</h3>
                  <div className="space-y-4">
                    {expenseBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded ${item.color}`}></div>
                          <span className="text-sm font-medium">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">N$ {item.amount.toLocaleString()}</p>
                          <p className="text-sm text-base-content/70">{item.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Monthly Trends</h3>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Revenue</th>
                        <th>Expenses</th>
                        <th>Profit</th>
                        <th>Profit Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyTrends.map((trend, index) => {
                        const profitMargin = ((trend.profit / trend.revenue) * 100).toFixed(1);
                        return (
                          <tr key={index}>
                            <td className="font-semibold">{trend.month}</td>
                            <td className="text-success font-semibold">N$ {trend.revenue.toLocaleString()}</td>
                            <td className="text-error font-semibold">N$ {trend.expenses.toLocaleString()}</td>
                            <td className="text-info font-semibold">N$ {trend.profit.toLocaleString()}</td>
                            <td className="font-semibold">{profitMargin}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between mb-6">
                <h3 className="card-title">Recent Transactions</h3>
                <div className="flex gap-2">
                  <ActionButton variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </ActionButton>
                  <ActionButton>
                    <Receipt className="w-4 h-4 mr-2" />
                    New Transaction
                  </ActionButton>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="font-semibold">{transaction.date}</td>
                        <td>{transaction.description}</td>
                        <td>
                          <span className="badge badge-outline badge-sm">
                            {transaction.category}
                          </span>
                        </td>
                        <td className={`font-semibold ${
                          transaction.type === 'revenue' ? 'text-success' : 'text-error'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}N$ {Math.abs(transaction.amount).toLocaleString()}
                        </td>
                        <td>
                          <div className="flex items-center space-x-2">
                            {transaction.method === 'Credit Card' && <CreditCard className="w-4 h-4" />}
                            {transaction.method === 'Bank Transfer' && <Banknote className="w-4 h-4" />}
                            {transaction.method === 'Cash' && <Banknote className="w-4 h-4" />}
                            {transaction.method === 'Room Charge' && <Receipt className="w-4 h-4" />}
                            <span className="text-sm">{transaction.method}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex space-x-2">
                            <button className="btn btn-ghost btn-sm">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="btn btn-ghost btn-sm">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Revenue Sources</h3>
                <div className="space-y-4">
                  {revenueBreakdown.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{item.category}</span>
                        <span className="font-semibold">N$ {item.amount.toLocaleString()}</span>
                      </div>
                      <progress 
                        className="progress progress-primary w-full" 
                        value={item.percentage} 
                        max="100"
                      ></progress>
                      <p className="text-sm text-base-content/70 mt-1">{item.percentage}% of total revenue</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Revenue Performance</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Room Rate</span>
                    <span className="font-semibold">N$ {financialOverview.averageRoomRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Revenue per Available Room</span>
                    <span className="font-semibold">N$ 1,131</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Revenue Growth Rate</span>
                    <span className="font-semibold text-success">+{financialOverview.revenueGrowth}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Repeat Guest Revenue</span>
                    <span className="font-semibold">N$ 18,500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Expense Categories</h3>
                <div className="space-y-4">
                  {expenseBreakdown.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{item.category}</span>
                        <span className="font-semibold">N$ {item.amount.toLocaleString()}</span>
                      </div>
                      <progress 
                        className="progress progress-error w-full" 
                        value={item.percentage} 
                        max="100"
                      ></progress>
                      <p className="text-sm text-base-content/70 mt-1">{item.percentage}% of total expenses</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Expense Analysis</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cost per Occupied Room</span>
                    <span className="font-semibold">N$ 1,147</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Food Cost Percentage</span>
                    <span className="font-semibold">21.1%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Labor Cost Percentage</span>
                    <span className="font-semibold">50.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Expense Growth Rate</span>
                    <span className="font-semibold text-error">+{financialOverview.expenseGrowth}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Monthly P&L Report</h3>
                <p className="text-sm text-base-content/70 mb-4">
                  Comprehensive profit and loss statement
                </p>
                <ActionButton className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </ActionButton>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Revenue Report</h3>
                <p className="text-sm text-base-content/70 mb-4">
                  Detailed revenue breakdown by source
                </p>
                <ActionButton className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Excel
                </ActionButton>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Tax Report</h3>
                <p className="text-sm text-base-content/70 mb-4">
                  Tax calculations and VAT returns
                </p>
                <ActionButton className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </ActionButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}