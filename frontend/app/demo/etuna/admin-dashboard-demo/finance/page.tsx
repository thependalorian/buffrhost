"use client";

import { Metadata } from "next";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  CreditCard,
  Receipt,
  Banknote,
  ArrowLeft,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Plus,
  CheckCircle,
  AlertCircle,
  Info,
  Target,
  Zap,
  Activity,
  Users,
  Bed,
  Utensils,
  Car,
  Star,
  Award,
  Globe,
  Shield,
  Lock,
  Database,
  Network,
  Cpu,
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
} from "lucide-react";
/**
 * Etuna Financial Reports & Analytics
 *
 * Comprehensive financial management for Etuna Guesthouse
 * Features revenue tracking, expense management, and financial analytics
 */

interface FinancialMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: "increase" | "decrease";
  period: string;
  icon: any;
  color: string;
}

interface RevenueSource {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  change: number;
  color: string;
}

interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  budget: number;
  status: "over" | "under" | "on-track";
  color: string;
}

const mockMetrics: FinancialMetric[] = [
  {
    id: "M001",
    name: "Total Revenue",
    value: 485000,
    change: 12.5,
    changeType: "increase",
    period: "This Month",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    id: "M002",
    name: "Room Revenue",
    value: 320000,
    change: 8.2,
    changeType: "increase",
    period: "This Month",
    icon: Bed,
    color: "text-blue-600",
  },
  {
    id: "M003",
    name: "Restaurant Revenue",
    value: 95000,
    change: 15.3,
    changeType: "increase",
    period: "This Month",
    icon: Utensils,
    color: "text-orange-600",
  },
  {
    id: "M004",
    name: "Tour Revenue",
    value: 70000,
    change: 22.1,
    changeType: "increase",
    period: "This Month",
    icon: Car,
    color: "text-purple-600",
  },
];

const mockRevenueSources: RevenueSource[] = [
  {
    id: "R001",
    name: "Room Bookings",
    amount: 320000,
    percentage: 66.0,
    change: 8.2,
    color: "bg-blue-500",
  },
  {
    id: "R002",
    name: "Restaurant",
    amount: 95000,
    percentage: 19.6,
    change: 15.3,
    color: "bg-orange-500",
  },
  {
    id: "R003",
    name: "Tours & Activities",
    amount: 70000,
    percentage: 14.4,
    change: 22.1,
    color: "bg-purple-500",
  },
];

const mockExpenses: ExpenseCategory[] = [
  {
    id: "E001",
    name: "Staff Salaries",
    amount: 180000,
    percentage: 45.0,
    budget: 200000,
    status: "under",
    color: "bg-green-500",
  },
  {
    id: "E002",
    name: "Food & Beverages",
    amount: 75000,
    percentage: 18.8,
    budget: 80000,
    status: "under",
    color: "bg-orange-500",
  },
  {
    id: "E003",
    name: "Utilities",
    amount: 45000,
    percentage: 11.3,
    budget: 50000,
    status: "under",
    color: "bg-yellow-500",
  },
  {
    id: "E004",
    name: "Marketing",
    amount: 25000,
    percentage: 6.3,
    budget: 20000,
    status: "over",
    color: "bg-red-500",
  },
  {
    id: "E005",
    name: "Maintenance",
    amount: 35000,
    percentage: 8.8,
    budget: 30000,
    status: "over",
    color: "bg-purple-500",
  },
  {
    id: "E006",
    name: "Other Expenses",
    amount: 40000,
    percentage: 10.0,
    budget: 35000,
    status: "over",
    color: "bg-gray-500",
  },
];

const monthlyData = [
  { month: "Jan", revenue: 420000, expenses: 380000, profit: 40000 },
  { month: "Feb", revenue: 380000, expenses: 350000, profit: 30000 },
  { month: "Mar", revenue: 450000, expenses: 400000, profit: 50000 },
  { month: "Apr", revenue: 410000, expenses: 370000, profit: 40000 },
  { month: "May", revenue: 480000, expenses: 420000, profit: 60000 },
  { month: "Jun", revenue: 520000, expenses: 450000, profit: 70000 },
  { month: "Jul", revenue: 560000, expenses: 480000, profit: 80000 },
  { month: "Aug", revenue: 540000, expenses: 460000, profit: 80000 },
  { month: "Sep", revenue: 580000, expenses: 490000, profit: 90000 },
  { month: "Oct", revenue: 620000, expenses: 520000, profit: 100000 },
  { month: "Nov", revenue: 590000, expenses: 500000, profit: 90000 },
  { month: "Dec", revenue: 485000, expenses: 400000, profit: 85000 },
];

export default function EtunaFinancePage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "over":
        return "bg-red-100 text-red-800";
      case "under":
        return "bg-green-100 text-green-800";
      case "on-track":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "over":
        return AlertCircle;
      case "under":
        return CheckCircle;
      case "on-track":
        return Info;
      default:
        return Info;
    }
  };

  return (
    <div className="min-h-screen nude-gradient-light">
      {/* Header - Mobile Responsive */}
      <div className="nude-gradient-deep text-white py-3 sm:py-4">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href="/demo/etuna/admin-dashboard-demo/dashboard"
                className="btn btn-ghost text-primary-content hover:nude-card/20 btn-sm sm:btn-md"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <div className="flex items-center space-x-3">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8" />
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold">
                    Financial Reports
                  </h1>
                  <p className="text-primary-content/80 text-xs sm:text-sm">
                    Revenue, expenses, and financial analytics
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="btn btn-sm sm:btn-md nude-card/20 hover:nude-card/30 text-primary-content">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export Report</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Responsive */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Financial Metrics - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {mockMetrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={metric.id}
                className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-nude-700">
                      {metric.name}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-nude-800">
                      N${metric.value.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      {metric.changeType === "increase" ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          metric.changeType === "increase"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        +{metric.change}%
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        {metric.period}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue Sources - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-nude-800 mb-4">
            Revenue Sources
          </h2>
          <div className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="space-y-4">
              {mockRevenueSources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div
                      className={`w-4 h-4 rounded-full ${source.color}`}
                    ></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-medium text-nude-800">
                        {source.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {source.percentage}% of total revenue
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm sm:text-base font-bold text-nude-800">
                      N${source.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600">+{source.change}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expense Categories - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-nude-800 mb-4">
            Expense Categories
          </h2>
          <div className="nude-card rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody className="nude-card divide-y divide-gray-200">
                  {mockExpenses.map((expense) => {
                    const StatusIcon = getStatusIcon(expense.status);
                    return (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full ${expense.color} mr-3`}
                            ></div>
                            <span className="text-sm font-medium text-nude-800">
                              {expense.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-nude-800">
                          N${expense.amount.toLocaleString()}
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          N${expense.budget.toLocaleString()}
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              expense.status,
                            )}`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {expense.status === "over"
                              ? "Over Budget"
                              : expense.status === "under"
                                ? "Under Budget"
                                : "On Track"}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {expense.percentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Monthly Financial Chart - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-nude-800 mb-4">
            Monthly Financial Overview
          </h2>
          <div className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="h-64 sm:h-80 flex items-end space-x-2 sm:space-x-4">
              {monthlyData.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col space-y-1">
                    <div
                      className="bg-green-500 rounded-t w-full transition-all duration-300 hover:bg-green-600"
                      style={{ height: `${(month.revenue / 700000) * 100}%` }}
                      title={`Revenue: N$${month.revenue.toLocaleString()}`}
                    />
                    <div
                      className="bg-red-500 rounded-b w-full transition-all duration-300 hover:bg-red-600"
                      style={{ height: `${(month.expenses / 700000) * 100}%` }}
                      title={`Expenses: N$${month.expenses.toLocaleString()}`}
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-nude-700 mt-2">
                    {month.month}
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:block">
                    N${(month.profit / 1000).toFixed(0)}k profit
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs sm:text-sm text-nude-700">
                  Revenue
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs sm:text-sm text-nude-700">
                  Expenses
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link
            href="/demo/etuna/admin-dashboard-demo/finance"
            className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-nude-800 group-hover:text-blue-600">
                  Generate Report
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Create financial reports
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/demo/etuna/admin-dashboard-demo/finance"
            className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-nude-800 group-hover:text-green-600">
                  Budget Planning
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Plan and manage budgets
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/demo/etuna/admin-dashboard-demo/finance"
            className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <PieChart className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-nude-800 group-hover:text-purple-600">
                  Financial Analytics
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Advanced financial insights
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/demo/etuna/admin-dashboard-demo/finance"
            className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-nude-800 group-hover:text-orange-600">
                  Financial Settings
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Configure financial options
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
