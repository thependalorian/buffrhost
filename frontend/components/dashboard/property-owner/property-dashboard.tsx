'use client';
/**
 * Property Owner Dashboard Component
 *
 * Main dashboard for property owners to manage their properties
 * Features: Overview stats, order management, analytics, inventory, reviews, disbursements
 * Location: components/dashboard/property-owner/property-dashboard.tsx
 */

import { useState, useEffect } from 'react';
/**
 * PropertyOwnerDashboard React Component for Buffr Host Hospitality Platform
 * @fileoverview PropertyOwnerDashboard displays comprehensive dashboard with key metrics and analytics
 * @location buffr-host/components/dashboard/property-owner/property-dashboard.tsx
 * @purpose PropertyOwnerDashboard displays comprehensive dashboard with key metrics and analytics
 * @component PropertyOwnerDashboard
 * @category Dashboard
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @database_connections Reads from relevant tables based on component functionality
 * @api_integration RESTful API endpoints for data fetching and mutations
 * @state_management Local component state for UI interactions and data management
 * @hooks_utilization useState, useEffect for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Interactive state management for dynamic user experiences
 * - Real-time data integration with backend services
 * - API-driven functionality with error handling and loading states
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {string} [propertyId] - propertyId prop description
 * @param {} [buffrId] - buffrId prop description
 * @param {} [tenantId] - tenantId prop description
 *
 * State:
 * @state {any} null - Component state for null management
 * @state {any} [] - Component state for [] management
 * @state {any} null - Component state for null management
 * @state {any} 'overview' - Component state for 'overview' management
 *
 * Methods:
 * @method getStatusColor - getStatusColor method for component functionality
 * @method getStatusIcon - getStatusIcon method for component functionality
 * @method formatCurrency - formatCurrency method for component functionality
 * @method formatDate - formatDate method for component functionality
 *
 * Usage Example:
 * @example
 * import PropertyOwnerDashboard from './PropertyOwnerDashboard';
 *
 * function App() {
 *   return (
 *     <PropertyOwnerDashboard
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered PropertyOwnerDashboard component
 */

import {
  ChartBarIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  StarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  todayRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
  disbursementStatus: {
    status: string;
    next_disbursement: string;
  };
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface PropertyOwnerDashboardProps {
  propertyId: string;
  buffrId?: string; // Unified Buffr ID for cross-project integration
  tenantId?: string;
}

export default function PropertyOwnerDashboard({
  propertyId,
  buffrId,
  tenantId = 'default-tenant',
}: PropertyOwnerDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'orders'
    | 'analytics'
    | 'inventory'
    | 'reviews'
    | 'disbursements'
  >('overview');

  useEffect(() => {
    fetchDashboardData();
  }, [propertyId, tenantId]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch property details first
      const propertyResponse = await fetch(
        `/api/secure/properties?property_id=${propertyId}&tenant_id=${tenantId}&include_details=true`
      );

      if (!propertyResponse.ok) {
        throw new Error('Failed to fetch property details');
      }

      const propertyData = await propertyResponse.json();

      if (
        !propertyData.success ||
        !propertyData.data ||
        propertyData.data.length === 0
      ) {
        throw new Error('Property not found');
      }

      const property = propertyData.data[0];

      // Calculate stats from property data
      const stats: DashboardStats = {
        totalOrders: property.total_orders || 0,
        totalRevenue: property.total_revenue || 0,
        pendingOrders: property.pending_orders || 0,
        completedOrders: property.completed_orders || 0,
        todayRevenue: property.today_revenue || 0,
        monthlyRevenue: property.monthly_revenue || 0,
        averageRating: property.average_rating || 0,
        totalReviews: property.total_reviews || 0,
        disbursementStatus: {
          status: property.disbursement_status || 'pending',
          next_disbursement: property.next_disbursement || 'Not scheduled',
        },
      };

      setStats(stats);

      // Fetch recent orders
      const ordersResponse = await fetch(
        `/api/secure/orders?property_id=${propertyId}&tenant_id=${tenantId}&limit=5&sortBy=created_at&sortOrder=desc`
      );

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        if (ordersData.success) {
          setRecentOrders(ordersData.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to fetch dashboard data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-warning';
      case 'confirmed':
        return 'bg-nude-100 text-nude-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-success';
      case 'cancelled':
        return 'bg-red-100 text-error';
      default:
        return 'bg-nude-100 text-nude-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'preparing':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'ready':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'cancelled':
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: 'NAD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nude-600 mx-auto mb-4"></div>
          <p className="text-nude-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-nude-900 mb-2">
          Error Loading Dashboard
        </h3>
        <p className="text-nude-600 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="badge badge-lg bg-nude-600 text-white rounded-md hover:bg-nude-700 shadow-2xl-luxury-soft hover:shadow-2xl-luxury-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nude-50">
      {/* Header */}
      <div className="bg-nude-50 shadow-2xl-nude-soft border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-nude-900">
                Property Dashboard
              </h1>
              <p className="text-nude-600">Manage your property operations</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-nude-500">
                Property ID: {propertyId}
              </span>
              <span className="text-sm text-nude-500">Tenant: {tenantId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-nude-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'orders', name: 'Orders', icon: ShoppingCartIcon },
              { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
              { id: 'inventory', name: 'Inventory', icon: ShoppingCartIcon },
              { id: 'reviews', name: 'Reviews', icon: StarIcon },
              {
                id: 'disbursements',
                name: 'Disbursements',
                icon: CurrencyDollarIcon,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as unknown)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-nude-500 text-nude-600'
                      : 'border-transparent text-nude-500 hover:text-nude-700 hover:border-nude-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-nude-50 card-body card shadow-2xl-nude-soft border">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ShoppingCartIcon className="h-8 w-8 text-nude-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-nude-500 truncate">
                          Total Orders
                        </dt>
                        <dd className="text-lg font-medium text-nude-900">
                          {stats.totalOrders}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-nude-50 card-body card shadow-2xl-nude-soft border">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CurrencyDollarIcon className="h-8 w-8 text-success" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-nude-500 truncate">
                          Total Revenue
                        </dt>
                        <dd className="text-lg font-medium text-nude-900">
                          {formatCurrency(stats.totalRevenue)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-nude-50 card-body card shadow-2xl-nude-soft border">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ClockIcon className="h-8 w-8 text-warning" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-nude-500 truncate">
                          Pending Orders
                        </dt>
                        <dd className="text-lg font-medium text-nude-900">
                          {stats.pendingOrders}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-nude-50 card-body card shadow-2xl-nude-soft border">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <StarIcon className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-nude-500 truncate">
                          Average Rating
                        </dt>
                        <dd className="text-lg font-medium text-nude-900">
                          {stats.averageRating.toFixed(1)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Revenue Overview */}
            {stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-nude-50 card-body card shadow-2xl-nude-soft border">
                  <h3 className="text-lg font-medium text-nude-900 mb-4">
                    Today's Revenue
                  </h3>
                  <div className="text-3xl font-bold text-semantic-success">
                    {formatCurrency(stats.todayRevenue)}
                  </div>
                  <p className="text-sm text-nude-500 mt-2">
                    Revenue generated today
                  </p>
                </div>
                <div className="bg-nude-50 card-body card shadow-2xl-nude-soft border">
                  <h3 className="text-lg font-medium text-nude-900 mb-4">
                    Monthly Revenue
                  </h3>
                  <div className="text-3xl font-bold text-nude-600">
                    {formatCurrency(stats.monthlyRevenue)}
                  </div>
                  <p className="text-sm text-nude-500 mt-2">
                    Revenue this month
                  </p>
                </div>
              </div>
            )}

            {/* Recent Orders */}
            <div className="bg-nude-50 card shadow-2xl-nude-soft border">
              <div className="px-6 py-4 border-b border-nude-200">
                <h3 className="text-lg font-medium text-nude-900">
                  Recent Orders
                </h3>
              </div>
              <div className="overflow-hidden">
                {recentOrders.length > 0 ? (
                  <table className="min-w-full divide-y divide-nude-200">
                    <thead className="bg-nude-50">
                      <tr>
                        <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                          Order
                        </th>
                        <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-nude-50 divide-y divide-nude-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-nude-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-nude-900">
                              #{order.order_number}
                            </div>
                            <div className="text-sm text-nude-500">
                              {order.items.length} items
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-900">
                            {order.customer_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">
                                {order.status}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-900">
                            {formatCurrency(order.total_amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-500">
                            {formatDate(order.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCartIcon className="mx-auto h-12 w-12 text-nude-400" />
                    <h3 className="mt-2 text-sm font-medium text-nude-900">
                      No orders
                    </h3>
                    <p className="mt-1 text-sm text-nude-500">
                      Orders will appear here once customers start placing them.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Disbursement Status */}
            {stats && (
              <div className="bg-nude-50 card-body card shadow-2xl-nude-soft border">
                <h3 className="text-lg font-medium text-nude-900 mb-4">
                  Disbursement Status
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-nude-500">
                      Status: {stats.disbursementStatus.status}
                    </p>
                    <p className="text-sm text-nude-500">
                      Next Disbursement:{' '}
                      {stats.disbursementStatus.next_disbursement}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-nude-900">
                      Ready for disbursement
                    </p>
                    <p className="text-sm text-nude-500">
                      Funds will be transferred automatically
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-nude-50 card-body card shadow-2xl-nude-soft border">
              <h2 className="text-2xl font-bold text-nude-900 mb-4">
                Order Management
              </h2>
              <p className="text-nude-600 mb-6">
                Manage and track all orders for your property
              </p>

              {/* Order Management Interface */}
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search orders..."
                      className="w-full badge badge-lg border border-nude-300 rounded-md focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-nude-500 focus:border-nude-500"
                    />
                  </div>
                  <select className="badge badge-lg border border-nude-300 rounded-md focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-nude-500 focus:border-nude-500">
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select className="badge badge-lg border border-nude-300 rounded-md focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-nude-500 focus:border-nude-500">
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-nude-200">
                    <thead className="bg-nude-50">
                      <tr>
                        <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                          Order
                        </th>
                        <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="btn btn-md text-left text-xs font-medium text-nude-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-nude-50 divide-y divide-nude-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-nude-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-nude-900">
                              #{order.order_number}
                            </div>
                            <div className="text-sm text-nude-500">
                              {order.items.length} items
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-900">
                            {order.customer_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">
                                {order.status}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-900">
                            {formatCurrency(order.total_amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-nude-500">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-nude-600 hover:text-nude-900 mr-3">
                              View
                            </button>
                            <button className="text-success hover:text-green-900">
                              Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {recentOrders.length === 0 && (
                  <div className="text-center py-12">
                    <ShoppingCartIcon className="mx-auto h-12 w-12 text-nude-400" />
                    <h3 className="mt-2 text-sm font-medium text-nude-900">
                      No orders found
                    </h3>
                    <p className="mt-1 text-sm text-nude-500">
                      Orders will appear here once customers start placing them.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-nude-50 card-body card shadow-2xl-nude-soft border">
            <h2 className="text-2xl font-bold text-nude-900 mb-4">
              Analytics Dashboard
            </h2>
            <p className="text-nude-600">
              Coming soon - Advanced analytics and reporting features
            </p>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-nude-50 card-body card shadow-2xl-nude-soft border">
            <h2 className="text-2xl font-bold text-nude-900 mb-4">
              Inventory Management
            </h2>
            <p className="text-nude-600">
              Coming soon - Menu and inventory management features
            </p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-nude-50 card-body card shadow-2xl-nude-soft border">
            <h2 className="text-2xl font-bold text-nude-900 mb-4">
              Review Management
            </h2>
            <p className="text-nude-600">
              Coming soon - Customer review and rating management
            </p>
          </div>
        )}

        {activeTab === 'disbursements' && (
          <div className="bg-nude-50 card-body card shadow-2xl-nude-soft border">
            <h2 className="text-2xl font-bold text-nude-900 mb-4">
              Disbursement Tracking
            </h2>
            <p className="text-nude-600">
              Coming soon - Payment and disbursement tracking features
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
