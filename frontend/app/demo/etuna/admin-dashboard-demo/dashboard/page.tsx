"use client";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
  Monitor,
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
} from "lucide-react";
import { etunaUnifiedData } from "@/lib/data/etuna-property-unified";
import ErrorBoundary, {
  DashboardErrorFallback,
} from "@/components/ErrorBoundary";
import {
  useEtunaDemoDashboard,
  useEtunaDemoReservations,
  useEtunaDemoOrders,
} from "@/lib/hooks/useEtunaDemoApi";

export default function EtunaDashboardPage() {
  // Use demo API data
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
  } = useEtunaDemoDashboard();
  const { data: reservations, loading: reservationsLoading } =
    useEtunaDemoReservations();
  const { data: orders, loading: ordersLoading } = useEtunaDemoOrders();

  const property = etunaUnifiedData.property;

  // Navigation items for Etuna demo admin - Buffr Host Standard
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/demo/etuna/admin-dashboard-demo/dashboard",
      icon: BarChart3,
      current: true,
    },
    {
      name: "Reservations",
      href: "/demo/etuna/admin-dashboard-demo/reservations",
      icon: Calendar,
      description: "Manage room reservations and bookings",
    },
    {
      name: "Guest Management",
      href: "/demo/etuna/admin-dashboard-demo/guests",
      icon: Users,
      description: "Guest check-ins, profiles, and history",
    },
    {
      name: "Room Management",
      href: "/demo/etuna/admin-dashboard-demo/rooms",
      icon: Bed,
      description: "Room inventory, status, and maintenance",
    },
    {
      name: "Restaurant",
      href: "/demo/etuna/admin-dashboard-demo/restaurant",
      icon: Utensils,
      description: "Menu management and order tracking",
    },
    {
      name: "Tours & Activities",
      href: "/demo/etuna/admin-dashboard-demo/tours",
      icon: Car,
      description: "Tour bookings and activity scheduling",
    },
    {
      name: "Financial Reports",
      href: "/demo/etuna/admin-dashboard-demo/finance",
      icon: DollarSign,
      description: "Revenue, expenses, and financial analytics",
    },
    {
      name: "Analytics",
      href: "/demo/etuna/admin-dashboard-demo/analytics",
      icon: BarChart,
      description: "Performance metrics and insights",
    },
    {
      name: "Communications",
      href: "/demo/etuna/admin-dashboard-demo/communications",
      icon: MailIcon,
      description: "Guest communications and notifications",
    },
    {
      name: "Staff Management",
      href: "/demo/etuna/admin-dashboard-demo/staff",
      icon: UserCheck,
      description: "Staff scheduling and HR management",
    },
    {
      name: "CRM & Leads",
      href: "/demo/etuna/admin-dashboard-demo/crm",
      icon: Target,
      description: "Customer relationship management",
    },
    {
      name: "Marketing",
      href: "/demo/etuna/admin-dashboard-demo/marketing",
      icon: Megaphone,
      description: "Marketing automation and campaigns",
    },
    {
      name: "Join Waitlist",
      href: "/demo/etuna/admin-dashboard-demo/waitlist",
      icon: Crown,
      description: "Waitlist management and conversions",
    },
    {
      name: "Content Management",
      href: "/demo/etuna/admin-dashboard-demo/cms",
      icon: FileText,
      description: "CMS for all content types and media",
    },
    {
      name: "Invoice Generation",
      href: "/demo/etuna/admin-dashboard-demo/invoices",
      icon: Receipt,
      description: "Automated invoice generation and management",
    },
    {
      name: "Property Settings",
      href: "/demo/etuna/admin-dashboard-demo/settings",
      icon: Settings,
      description: "Property configuration and preferences",
    },
  ];

  // Quick actions for Buffr Host ecosystem
  const quickActions = [
    {
      name: "New Reservation",
      href: "/demo/etuna/admin-dashboard-demo/reservations",
      icon: Calendar,
      description: "Create a new room booking",
      color: "bg-blue-500",
    },
    {
      name: "Guest Check-in",
      href: "/demo/etuna/admin-dashboard-demo/guests",
      icon: Users,
      description: "Process guest arrival",
      color: "bg-green-500",
    },
    {
      name: "Restaurant Orders",
      href: "/demo/etuna/admin-dashboard-demo/restaurant",
      icon: Utensils,
      description: "Manage dining orders",
      color: "bg-orange-500",
    },
    {
      name: "View Analytics",
      href: "/demo/etuna/admin-dashboard-demo/analytics",
      icon: BarChart,
      description: "Check performance metrics",
      color: "bg-purple-500",
    },
  ];

  // Use real data if available, otherwise fallback to mock data
  const recentBookings = reservations
    ? reservations.slice(0, 4).map((res) => ({
        id: `RES${res.reservation_id}`,
        guest: res.customer_name,
        room: "Standard Room", // Would need to join with room_types table
        checkIn: res.check_in_date,
        checkOut: res.check_out_date,
        status: res.status,
        amount: res.total_amount,
      }))
    : [
        {
          id: "BK001",
          guest: "John Smith",
          room: "Executive Room",
          checkIn: "2024-01-15",
          checkOut: "2024-01-17",
          status: "confirmed",
          amount: 2000,
        },
        {
          id: "BK002",
          guest: "Maria Garcia",
          room: "Standard Room",
          checkIn: "2024-01-16",
          checkOut: "2024-01-18",
          status: "checked-in",
          amount: 1500,
        },
        {
          id: "BK003",
          guest: "Ahmed Hassan",
          room: "Standard Room",
          checkIn: "2024-01-14",
          checkOut: "2024-01-16",
          status: "checked-in",
          amount: 1500,
        },
        {
          id: "BK004",
          guest: "Sarah Johnson",
          room: "Luxury Room",
          checkIn: "2024-01-18",
          checkOut: "2024-01-20",
          status: "confirmed",
          amount: 1660,
        },
      ];

  const monthlyRevenue = [
    { month: "Jan", revenue: 420000 },
    { month: "Feb", revenue: 380000 },
    { month: "Mar", revenue: 450000 },
    { month: "Apr", revenue: 410000 },
    { month: "May", revenue: 480000 },
    { month: "Jun", revenue: 520000 },
    { month: "Jul", revenue: 560000 },
    { month: "Aug", revenue: 540000 },
    { month: "Sep", revenue: 580000 },
    { month: "Oct", revenue: 620000 },
    { month: "Nov", revenue: 590000 },
    { month: "Dec", revenue: 468000 },
  ];

  return (
    <ErrorBoundary fallback={DashboardErrorFallback}>
      <div className="min-h-screen bg-base-200">
        {/* Header - Mobile Responsive */}
        <div className="nude-gradient-deep text-white py-3 sm:py-4">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/demo/etuna"
                  className="btn btn-ghost text-primary-content hover:bg-white/20 btn-sm sm:btn-md"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Back to Etuna</span>
                  <span className="sm:hidden">Back</span>
                </Link>
                <div className="flex items-center space-x-3">
                  <Home className="w-6 h-6 sm:w-8 sm:h-8" />
                  <div>
                    <h1 className="text-lg sm:text-2xl font-bold">
                      Etuna Admin Dashboard
                    </h1>
                    <p className="text-primary-content/80 text-xs sm:text-sm">
                      Manage your guesthouse operations
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <Link
                  href="/demo/etuna/management-demo"
                  className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-gray-900"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Management Demo
                </Link>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">+264 65 231 177</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm hidden sm:inline">
                    bookings@etunaguesthouse.com
                  </span>
                  <span className="text-xs sm:hidden">
                    bookings@etunaguesthouse.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm">
              🎯 <strong>Demo Admin Dashboard</strong> - No authentication
              required - Showcasing Buffr Host platform capabilities
            </p>
          </div>
        </div>

        {/* Main Content - Mobile Responsive */}
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Metrics Cards - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="nude-card p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-nude-700">
                    Occupancy Rate
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-nude-900">
                    {dashboardData ? `${dashboardData.occupancy_rate}%` : "85%"}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bed className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <span className="text-xs sm:text-sm text-green-600 font-medium">
                  +5% from last month
                </span>
              </div>
            </div>

            <div className="nude-card p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-nude-700">
                    Revenue Today
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-nude-800">
                    N$
                    {dashboardData
                      ? dashboardData.today_revenue.toLocaleString()
                      : "12,450"}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-nude-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-nude-700" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <span className="text-xs sm:text-sm text-nude-700 font-medium">
                  +12% from yesterday
                </span>
              </div>
            </div>

            <div className="nude-card p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-nude-700">
                    Active Guests
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-nude-800">
                    {dashboardData ? dashboardData.active_guests : "28"}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-nude-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-nude-700" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <span className="text-xs sm:text-sm text-nude-500">
                  12 check-ins today
                </span>
              </div>
            </div>

            <div className="nude-card p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-nude-700">
                    Guest Satisfaction
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-nude-800">
                    {dashboardData
                      ? `${dashboardData.guest_satisfaction}/5`
                      : "4.8/5"}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-nude-300 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 text-nude-700" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <span className="text-xs sm:text-sm text-nude-700 font-medium">
                  +0.2 from last week
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions - Mobile Responsive */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-nude-800 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="nude-card p-4 hover:shadow-nude transition-shadow group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
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

          {/* Navigation Grid - Mobile Responsive */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-nude-800 mb-4">
              Management Tools
            </h2>
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

          {/* Recent Bookings - Mobile Responsive */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-nude-800 mb-4">
              Recent Bookings
            </h2>
            <div className="nude-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-nude-200">
                  <thead className="bg-nude-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-nude-700 uppercase tracking-wider">
                        Guest
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-nude-700 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-nude-700 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-nude-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-nude-700 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-nude-200">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-nude-50">
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm font-medium text-nude-800">
                          {booking.guest}
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-nude-700">
                          {booking.room}
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-nude-700">
                          <div className="flex flex-col">
                            <span className="text-xs">
                              Check-in: {booking.checkIn}
                            </span>
                            <span className="text-xs">
                              Check-out: {booking.checkOut}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === "checked-in"
                                ? "bg-nude-200 text-nude-800"
                                : "bg-nude-300 text-nude-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-nude-800">
                          N${booking.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Revenue Chart - Mobile Responsive */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-nude-800 mb-4">
              Monthly Revenue
            </h2>
            <div className="nude-card p-4 sm:p-6">
              <div className="h-64 sm:h-80 flex items-end space-x-2 sm:space-x-4">
                {monthlyRevenue.map((month, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="bg-nude-500 rounded-t w-full transition-all duration-300 hover:bg-nude-600"
                      style={{ height: `${(month.revenue / 700000) * 100}%` }}
                    />
                    <span className="text-xs sm:text-sm text-nude-700 mt-2">
                      {month.month}
                    </span>
                    <span className="text-xs text-nude-500 hidden sm:block">
                      N${(month.revenue / 1000).toFixed(0)}k
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
