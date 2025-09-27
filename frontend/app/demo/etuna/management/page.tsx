import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Bed,
  Utensils,
  Car,
  Wifi,
  Star,
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  FileText,
  CreditCard,
  Mail as MailIcon,
  BarChart,
  UserCheck,
  Home,
  ArrowLeft,
  Menu,
  X,
  Target,
  Megaphone,
  Crown,
  Receipt,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useEtunaDemoDashboard, useEtunaDemoReservations, useEtunaDemoOrders } from '@/lib/hooks/useEtunaDemoApi';

export const metadata: Metadata = {
  title: 'Etuna Management Demo - Buffr Host Platform',
  description: 'See how the Buffr Host management dashboard works with real-time data and analytics.',
};

export default function EtunaManagementDemoPage() {
  // Use demo API data
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useEtunaDemoDashboard();
  const { data: reservations, loading: reservationsLoading } = useEtunaDemoReservations();
  const { data: orders, loading: ordersLoading } = useEtunaDemoOrders();

  // Navigation items for demo management
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/demo/etuna/management',
      icon: BarChart3,
      current: true
    },
    {
      name: 'Reservations',
      href: '/demo/etuna/management/reservations',
      icon: Calendar,
      description: 'Manage room reservations and bookings'
    },
    {
      name: 'Guest Management',
      href: '/demo/etuna/management/guests',
      icon: Users,
      description: 'Guest check-ins, profiles, and history'
    },
    {
      name: 'Room Management',
      href: '/demo/etuna/management/rooms',
      icon: Bed,
      description: 'Room inventory, status, and maintenance'
    },
    {
      name: 'Restaurant',
      href: '/demo/etuna/management/restaurant',
      icon: Utensils,
      description: 'Menu management and order tracking'
    },
    {
      name: 'Tours & Activities',
      href: '/demo/etuna/management/tours',
      icon: Car,
      description: 'Tour bookings and activity scheduling'
    },
    {
      name: 'Financial Reports',
      href: '/demo/etuna/management/finance',
      icon: DollarSign,
      description: 'Revenue, expenses, and financial analytics'
    },
    {
      name: 'Analytics',
      href: '/demo/etuna/management/analytics',
      icon: BarChart,
      description: 'Performance metrics and insights'
    },
    {
      name: 'Communications',
      href: '/demo/etuna/management/communications',
      icon: MailIcon,
      description: 'Guest communications and notifications'
    },
    {
      name: 'Staff Management',
      href: '/demo/etuna/management/staff',
      icon: UserCheck,
      description: 'Staff scheduling and HR management'
    },
    {
      name: 'CRM & Leads',
      href: '/demo/etuna/management/crm',
      icon: Target,
      description: 'Customer relationship management'
    },
    {
      name: 'Marketing',
      href: '/demo/etuna/management/marketing',
      icon: Megaphone,
      description: 'Marketing automation and campaigns'
    },
    {
      name: 'Content Management',
      href: '/demo/etuna/management/cms',
      icon: FileText,
      description: 'CMS for all content types and media'
    },
    {
      name: 'Invoice Generation',
      href: '/demo/etuna/management/invoices',
      icon: Receipt,
      description: 'Automated invoice generation and management'
    },
    {
      name: 'Property Settings',
      href: '/demo/etuna/management/settings',
      icon: Settings,
      description: 'Property configuration and preferences'
    }
  ];

  // Quick actions for demo
  const quickActions = [
    {
      name: 'New Reservation',
      href: '/demo/etuna/management/reservations',
      icon: Calendar,
      description: 'Create a new room booking',
      color: 'bg-blue-500'
    },
    {
      name: 'Guest Check-in',
      href: '/demo/etuna/management/guests',
      icon: Users,
      description: 'Process guest arrival',
      color: 'bg-green-500'
    },
    {
      name: 'Restaurant Orders',
      href: '/demo/etuna/management/restaurant',
      icon: Utensils,
      description: 'Manage dining orders',
      color: 'bg-orange-500'
    },
    {
      name: 'View Analytics',
      href: '/demo/etuna/management/analytics',
      icon: BarChart,
      description: 'Check performance metrics',
      color: 'bg-purple-500'
    }
  ];

  // Show loading state
  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-lg text-base-content/70">Loading management demo...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (dashboardError) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-error mb-2">Demo Error</h2>
          <p className="text-base-content/70 mb-4">{dashboardError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            🎯 <strong>Management Demo</strong> - This is a showcase of our management platform
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="nude-gradient-deep text-white py-3 sm:py-4">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href="/demo/etuna" className="btn btn-ghost text-primary-content hover:bg-white/20 btn-sm sm:btn-md">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back to Demo</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <div className="flex items-center space-x-3">
                <Home className="w-6 h-6 sm:w-8 sm:h-8" />
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold">Etuna Management Demo</h1>
                  <p className="text-primary-content/80 text-xs sm:text-sm">Buffr Host platform showcase</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">+264 65 231 177</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">bookings@etunaguesthouse.com</span>
                <span className="text-xs sm:hidden">bookings@etunaguesthouse.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="nude-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-nude-700">Occupancy Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-nude-900">
                  {dashboardData ? `${dashboardData.occupancy_rate}%` : '78.5%'}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bed className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-green-600 font-medium">+5% from last month</span>
            </div>
          </div>

          <div className="nude-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-nude-700">Revenue Today</p>
                <p className="text-xl sm:text-2xl font-bold text-nude-800">
                  N${dashboardData ? dashboardData.today_revenue.toLocaleString() : '12,450'}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-nude-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-nude-700" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-nude-700 font-medium">+12% from yesterday</span>
            </div>
          </div>

          <div className="nude-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-nude-700">Active Guests</p>
                <p className="text-xl sm:text-2xl font-bold text-nude-800">
                  {dashboardData ? dashboardData.active_guests : '28'}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-nude-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-nude-700" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-nude-500">12 check-ins today</span>
            </div>
          </div>

          <div className="nude-card p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-nude-700">Guest Satisfaction</p>
                <p className="text-xl sm:text-2xl font-bold text-nude-800">
                  {dashboardData ? `${dashboardData.guest_satisfaction}/5` : '4.8/5'}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-nude-300 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-nude-700" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-nude-700 font-medium">+0.2 from last week</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-nude-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="nude-card p-4 hover:shadow-nude transition-shadow group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-medium text-nude-800 group-hover:text-nude-700">
                      {action.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-nude-500 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-nude-800 mb-4">Management Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {navigationItems.slice(1).map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="nude-card p-4 hover:shadow-nude transition-shadow group"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-nude-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-nude-200 transition-colors">
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-nude-700 group-hover:text-nude-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-medium text-nude-800 group-hover:text-nude-700">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-nude-500 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Reservations */}
          <div className="nude-card">
            <div className="card-body">
              <h3 className="card-title">Recent Reservations</h3>
              <div className="space-y-3">
                {dashboardData?.recent_reservations.map((reservation, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                    <div>
                      <p className="font-semibold">{reservation.guest_name}</p>
                      <p className="text-sm text-base-content/70">{reservation.room_type}</p>
                      <p className="text-xs text-base-content/50">
                        {reservation.check_in} - {reservation.check_out}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`badge ${
                        reservation.status === 'confirmed' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {reservation.status}
                      </span>
                      <p className="text-sm font-semibold mt-1">N${reservation.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="nude-card">
            <div className="card-body">
              <h3 className="card-title">Recent Orders</h3>
              <div className="space-y-3">
                {dashboardData?.recent_orders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                    <div>
                      <p className="font-semibold">{order.customer_name}</p>
                      <p className="text-sm text-base-content/70">Restaurant Order</p>
                      <p className="text-xs text-base-content/50">{order.order_date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`badge ${
                        order.status === 'delivered' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {order.status}
                      </span>
                      <p className="text-sm font-semibold mt-1">N${order.total_amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="alert alert-info">
          <CheckCircle className="w-6 h-6" />
          <div>
            <h3 className="font-bold">Demo Mode</h3>
            <div className="text-sm">
              This is a demonstration of the Buffr Host management platform. 
              All data shown is simulated for showcase purposes. 
              <Link href="/demo/etuna" className="link link-primary ml-2">
                Return to main demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}