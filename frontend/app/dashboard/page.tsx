"use client";

import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  QrCodeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  BellIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  BuildingOffice2Icon,
  EyeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const NavLink = ({ href, children, active = false }) => (
  <a
    href={href}
    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
      active
        ? "bg-primary text-white"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`}
  >
    {children}
  </a>
);

const StatCard = ({ title, value, change, icon: Icon, color = "primary" }) => (
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        <p
          className={`text-sm ${
            change >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {change >= 0 ? "+" : ""}
          {change}% from last month
        </p>
      </div>
      <div
        className={`w-12 h-12 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg flex items-center justify-center`}
      >
        <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          window.location.href = "/signin";
          return;
        }

        // Fetch analytics data
        const analyticsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/analytics/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          setStats(analyticsData);
        }

        // Fetch recent orders
        const ordersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders?limit=5&status=all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setRecentOrders(ordersData.orders || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-sand-900/20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-sand-800 to-black rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                Buffr Host
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="w-5 h-5" />
              </button>
              <button className="btn btn-ghost btn-circle">
                <CogIcon className="w-5 h-5" />
              </button>
              <button className="btn btn-ghost" onClick={handleSignOut}>
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Navigation
              </h3>
              <nav className="space-y-2">
                <NavLink href="/dashboard" active={activeTab === "overview"}>
                  <ChartBarIcon className="w-5 h-5" />
                  <span>Overview</span>
                </NavLink>
                <NavLink href="/dashboard/orders">
                  <QrCodeIcon className="w-5 h-5" />
                  <span>Orders</span>
                </NavLink>
                <NavLink href="/dashboard/customers">
                  <UserGroupIcon className="w-5 h-5" />
                  <span>Customers</span>
                </NavLink>
                <NavLink href="/dashboard/properties">
                  <BuildingOffice2Icon className="w-5 h-5" />
                  <span>Properties</span>
                </NavLink>
                <NavLink href="/dashboard/analytics">
                  <EyeIcon className="w-5 h-5" />
                  <span>Analytics</span>
                </NavLink>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back! Here&apos;s what&apos;s happening with your
                business today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {isLoading
                ? // Loading skeleton
                  Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 animate-pulse"
                      role="status"
                      aria-label="Loading analytics data"
                    >
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <span className="sr-only">Loading analytics data...</span>
                    </div>
                  ))
                : stats
                  ? // Real stats data
                    [
                      {
                        title: "Total Revenue",
                        value: `N$${
                          stats.total_revenue?.toLocaleString() || "0"
                        }`,
                        change: stats.revenue_change || 0,
                        icon: CurrencyDollarIcon,
                        color: "green",
                      },
                      {
                        title: "Active Orders",
                        value: stats.active_orders?.toString() || "0",
                        change: stats.orders_change || 0,
                        icon: QrCodeIcon,
                        color: "blue",
                      },
                      {
                        title: "Total Customers",
                        value: stats.total_customers?.toLocaleString() || "0",
                        change: stats.customers_change || 0,
                        icon: UserGroupIcon,
                        color: "purple",
                      },
                      {
                        title: "Properties",
                        value: stats.total_properties?.toString() || "0",
                        change: 0,
                        icon: BuildingOffice2Icon,
                        color: "orange",
                      },
                    ].map((stat, index) => <StatCard key={index} {...stat} />)
                  : // Fallback stats
                    [
                      {
                        title: "Total Revenue",
                        value: "N$0",
                        change: 0,
                        icon: CurrencyDollarIcon,
                        color: "green",
                      },
                      {
                        title: "Active Orders",
                        value: "0",
                        change: 0,
                        icon: QrCodeIcon,
                        color: "blue",
                      },
                      {
                        title: "Total Customers",
                        value: "0",
                        change: 0,
                        icon: UserGroupIcon,
                        color: "purple",
                      },
                      {
                        title: "Properties",
                        value: "0",
                        change: 0,
                        icon: BuildingOffice2Icon,
                        color: "orange",
                      },
                    ].map((stat, index) => <StatCard key={index} {...stat} />)}
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Orders
                </h2>
                <button className="btn btn-primary btn-sm">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Order
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      // Loading skeleton for orders
                      Array.from({ length: 4 }).map((_, index) => (
                        <tr
                          key={index}
                          role="status"
                          aria-label="Loading orders"
                        >
                          <td>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </td>
                          <td>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </td>
                          <td>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </td>
                          <td>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </td>
                          <td>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </td>
                        </tr>
                      ))
                    ) : recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr key={order.order_id}>
                          <td className="font-medium">#{order.order_number}</td>
                          <td>{order.customer?.name || "Guest"}</td>
                          <td>N${order.total}</td>
                          <td>
                            <span
                              className={`badge ${
                                order.status === "completed"
                                  ? "badge-success"
                                  : order.status === "pending"
                                    ? "badge-warning"
                                    : order.status === "processing"
                                      ? "badge-info"
                                      : "badge-error"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center text-gray-500 py-8"
                        >
                          No recent orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="btn btn-outline w-full justify-start">
                    <QrCodeIcon className="w-5 h-5 mr-2" />
                    Generate QR Code
                  </button>
                  <button className="btn btn-outline w-full justify-start">
                    <UserGroupIcon className="w-5 h-5 mr-2" />
                    Add Customer
                  </button>
                  <button className="btn btn-outline w-full justify-start">
                    <BuildingOffice2Icon className="w-5 h-5 mr-2" />
                    Manage Properties
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      New order #1234 received
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Customer John Doe registered
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Inventory low on item #456
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  System Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      API Status
                    </span>
                    <span className="badge badge-success">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Payment Gateway
                    </span>
                    <span className="badge badge-success">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Database
                    </span>
                    <span className="badge badge-success">Healthy</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
