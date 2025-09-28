"use client";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Bed,
  Utensils,
  Car,
  DollarSign,
  Star,
  Calendar,
  Clock,
  Target,
  Award,
  Activity,
  PieChart,
  LineChart,
  ArrowLeft,
  Download,
  Filter,
  Search,
  Eye,
  RefreshCw,
  Settings,
  Globe,
  MapPin,
  Phone,
  Mail,
  Heart,
  ThumbsUp,
  MessageSquare,
  Bell,
  Zap,
  Database,
  Network,
  Cpu,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
  Share,
} from "lucide-react";
import { useState } from "react";
import {
  ModalForm,
  FormField,
  FormSelect,
  FormTextarea,
  ActionButton,
  DataTable,
  Alert,
} from "@/src/components/ui";

export default function EtunaAnalyticsPage() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCreateReportModal, setShowCreateReportModal] = useState(false);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return TrendingUp;
      case "down":
        return TrendingDown;
      default:
        return Activity;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-nude-700";
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header - Mobile Responsive */}
      <div className="bg-primary text-primary-content py-3 sm:py-4">
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
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold">
                    Analytics & Insights
                  </h1>
                  <p className="text-primary-content/80 text-xs sm:text-sm">
                    Performance metrics and business intelligence
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ActionButton
                onClick={() => setShowExportModal(true)}
                size="sm"
                className="nude-card/20 hover:nude-card/30 text-primary-content"
                icon={<Download className="w-4 h-4" />}
                iconPosition="left"
              >
                <span className="hidden sm:inline">Export Report</span>
                <span className="sm:hidden">Export</span>
              </ActionButton>
              <button className="btn btn-sm sm:btn-md nude-card/20 hover:nude-card/30 text-primary-content">
                <RefreshCw className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Responsive */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Key Metrics - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {mockAnalyticsMetrics.map((metric) => {
            const IconComponent = metric.icon;
            const TrendIcon = getTrendIcon(metric.trend);
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
                      {metric.name === "Average Rating"
                        ? `${metric.value}/5`
                        : metric.name === "Occupancy Rate"
                          ? `${metric.value}%`
                          : metric.name === "Revenue Growth"
                            ? `${metric.value}%`
                            : metric.value.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendIcon
                        className={`h-4 w-4 mr-1 ${getTrendColor(
                          metric.trend,
                        )}`}
                      />
                      <span
                        className={`text-xs sm:text-sm font-medium ${getTrendColor(
                          metric.trend,
                        )}`}
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

        {/* Performance Metrics - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-nude-800 mb-4">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm sm:text-base font-medium text-nude-800">
                  Occupancy Rate
                </h3>
                <Bed className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-nude-800 mb-2">
                {mockPerformanceMetrics.occupancyRate}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${mockPerformanceMetrics.occupancyRate}%` }}
                ></div>
              </div>
            </div>

            <div className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm sm:text-base font-medium text-nude-800">
                  Average Daily Rate
                </h3>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-nude-800 mb-2">
                N${mockPerformanceMetrics.averageDailyRate}
              </div>
              <div className="text-sm text-gray-500">Per room per night</div>
            </div>

            <div className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm sm:text-base font-medium text-nude-800">
                  Guest Satisfaction
                </h3>
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-nude-800 mb-2">
                {mockPerformanceMetrics.guestSatisfaction}/5
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(mockPerformanceMetrics.guestSatisfaction)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Guest Analytics - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-nude-800 mb-4">
            Guest Analytics
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Guest Demographics */}
            <div className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-nude-800 mb-4">
                Guest Demographics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-nude-700">Total Guests</span>
                  <span className="text-sm font-medium text-nude-800">
                    {mockGuestAnalytics.totalGuests.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-nude-700">New Guests</span>
                  <span className="text-sm font-medium text-nude-800">
                    {mockGuestAnalytics.newGuests.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-nude-700">
                    Returning Guests
                  </span>
                  <span className="text-sm font-medium text-nude-800">
                    {mockGuestAnalytics.returningGuests.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-nude-700">Average Stay</span>
                  <span className="text-sm font-medium text-nude-800">
                    {mockGuestAnalytics.averageStay} nights
                  </span>
                </div>
              </div>
            </div>

            {/* Top Countries */}
            <div className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-nude-800 mb-4">
                Top Countries
              </h3>
              <div className="space-y-3">
                {mockGuestAnalytics.topCountries
                  .slice(0, 5)
                  .map((country, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-nude-700">
                          {country.country}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-nude-800">
                          {country.count}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({country.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Analytics - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-nude-800 mb-4">
            Revenue Analytics
          </h2>
          <div className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-nude-800">
                  N${mockRevenueAnalytics.totalRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-nude-700">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-nude-800">
                  N${mockRevenueAnalytics.averageBookingValue.toLocaleString()}
                </div>
                <div className="text-sm text-nude-700">
                  Average Booking Value
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-nude-800">
                  +{mockRevenueAnalytics.revenueGrowth}%
                </div>
                <div className="text-sm text-nude-700">Revenue Growth</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-nude-800">
                  65.2%
                </div>
                <div className="text-sm text-nude-700">Direct Bookings</div>
              </div>
            </div>

            {/* Revenue Sources */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-nude-800">
                Revenue Sources
              </h3>
              {mockRevenueAnalytics.topRevenueSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-nude-700">
                      {source.source}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-nude-800">
                      N${source.amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({source.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trends Chart - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-nude-800 mb-4">
            Monthly Trends
          </h2>
          <div className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="h-64 sm:h-80 flex items-end space-x-2 sm:space-x-4">
              {monthlyData.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col space-y-1">
                    <div
                      className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                      style={{ height: `${(month.guests / 700) * 100}%` }}
                      title={`Guests: ${month.guests}`}
                    />
                    <div
                      className="bg-green-500 rounded-b w-full transition-all duration-300 hover:bg-green-600"
                      style={{ height: `${(month.revenue / 700000) * 100}%` }}
                      title={`Revenue: N$${month.revenue.toLocaleString()}`}
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-nude-700 mt-2">
                    {month.month}
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:block">
                    {month.guests} guests
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-xs sm:text-sm text-nude-700">Guests</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs sm:text-sm text-nude-700">
                  Revenue
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link
            href="/demo/etuna/admin-dashboard-demo/analytics"
            className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Download className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-nude-800 group-hover:text-blue-600">
                  Export Analytics
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Download detailed reports
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/demo/etuna/admin-dashboard-demo/analytics"
            className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-nude-800 group-hover:text-green-600">
                  Custom Reports
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Create custom analytics
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/demo/etuna/admin-dashboard-demo/analytics"
            className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-nude-800 group-hover:text-purple-600">
                  Analytics Settings
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Configure analytics options
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/demo/etuna/admin-dashboard-demo/analytics"
            className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Share className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-nude-800 group-hover:text-orange-600">
                  Share Insights
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Share analytics with team
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Export Report Modal */}
      <ModalForm
        open={showExportModal}
        onOpenChange={setShowExportModal}
        title="Export Analytics Report"
        description="Export your analytics data in various formats"
        size="md"
        onSubmit={async (data) => {
          alert("Analytics report exported successfully!");
          setShowExportModal(false);
        }}
        submitText="Export Report"
        cancelText="Cancel"
      >
        <FormSelect
          label="Report Format"
          name="format"
          placeholder="Select format"
          required
          options={[
            { value: "pdf", label: "PDF Report" },
            { value: "excel", label: "Excel Spreadsheet" },
            { value: "csv", label: "CSV Data" },
            { value: "json", label: "JSON Data" },
          ]}
        />

        <FormSelect
          label="Date Range"
          name="dateRange"
          placeholder="Select range"
          required
          options={[
            { value: "last-7-days", label: "Last 7 Days" },
            { value: "last-30-days", label: "Last 30 Days" },
            { value: "last-3-months", label: "Last 3 Months" },
            { value: "last-year", label: "Last Year" },
            { value: "custom", label: "Custom Range" },
          ]}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Include Data</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="guestAnalytics"
                defaultChecked
                className="checkbox mr-2"
              />
              <label className="text-sm">Guest Analytics</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="revenueAnalytics"
                defaultChecked
                className="checkbox mr-2"
              />
              <label className="text-sm">Revenue Analytics</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="performanceMetrics"
                defaultChecked
                className="checkbox mr-2"
              />
              <label className="text-sm">Performance Metrics</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="detailedCharts"
                className="checkbox mr-2"
              />
              <label className="text-sm">Detailed Charts</label>
            </div>
          </div>
        </div>

        <FormField
          label="Report Title"
          name="title"
          placeholder="Etuna Analytics Report"
        />
      </ModalForm>

      {/* Create Report Modal */}
      <ModalForm
        open={showCreateReportModal}
        onOpenChange={setShowCreateReportModal}
        title="Create Custom Report"
        description="Create a custom analytics report with your preferred metrics and schedule"
        size="lg"
        onSubmit={async (data) => {
          alert("Custom report created successfully!");
          setShowCreateReportModal(false);
        }}
        submitText="Create Report"
        cancelText="Cancel"
      >
        <FormField
          label="Report Name"
          name="name"
          placeholder="Enter report name"
          required
        />

        <FormSelect
          label="Report Type"
          name="type"
          placeholder="Select report type"
          required
          options={[
            { value: "guest-analysis", label: "Guest Analysis" },
            { value: "revenue-analysis", label: "Revenue Analysis" },
            { value: "occupancy-report", label: "Occupancy Report" },
            { value: "performance-summary", label: "Performance Summary" },
            { value: "custom", label: "Custom Report" },
          ]}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Metrics to Include</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="guestCount"
                defaultChecked
                className="checkbox mr-2"
              />
              <label className="text-sm">Guest Count</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="revenue"
                defaultChecked
                className="checkbox mr-2"
              />
              <label className="text-sm">Revenue</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="occupancyRate"
                defaultChecked
                className="checkbox mr-2"
              />
              <label className="text-sm">Occupancy Rate</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="satisfactionScore"
                className="checkbox mr-2"
              />
              <label className="text-sm">Satisfaction Score</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="averageStay"
                className="checkbox mr-2"
              />
              <label className="text-sm">Average Stay</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="repeatGuests"
                className="checkbox mr-2"
              />
              <label className="text-sm">Repeat Guests</label>
            </div>
          </div>
        </div>

        <FormSelect
          label="Schedule"
          name="schedule"
          options={[
            { value: "manual", label: "Manual Generation" },
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
            { value: "monthly", label: "Monthly" },
          ]}
        />

        <FormTextarea
          label="Description"
          name="description"
          placeholder="Describe the purpose of this report"
          rows={3}
        />
      </ModalForm>
    </div>
  );
}

/**
 * Etuna Analytics & Performance Metrics
 *
 * Comprehensive analytics dashboard for Etuna Guesthouse
 * Features performance metrics, guest analytics, and business insights
 * Based on backend analytics.py functionality
 */
import Link from "next/link";

// Metadata moved to layout or removed for client component

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: "increase" | "decrease";
  period: string;
  icon: any;
  color: string;
  trend: "up" | "down" | "stable";
}

interface GuestAnalytics {
  totalGuests: number;
  newGuests: number;
  returningGuests: number;
  averageStay: number;
  satisfactionScore: number;
  topCountries: Array<{ country: string; count: number; percentage: number }>;
  ageGroups: Array<{ group: string; count: number; percentage: number }>;
}

interface RevenueAnalytics {
  totalRevenue: number;
  roomRevenue: number;
  restaurantRevenue: number;
  tourRevenue: number;
  averageBookingValue: number;
  revenueGrowth: number;
  topRevenueSources: Array<{
    source: string;
    amount: number;
    percentage: number;
  }>;
}

interface PerformanceMetrics {
  occupancyRate: number;
  averageDailyRate: number;
  revenuePerAvailableRoom: number;
  guestSatisfaction: number;
  repeatGuestRate: number;
  directBookingRate: number;
}

const mockAnalyticsMetrics: AnalyticsMetric[] = [
  {
    id: "M001",
    name: "Total Guests",
    value: 1247,
    change: 18.5,
    changeType: "increase",
    period: "This Month",
    icon: Users,
    color: "text-blue-600",
    trend: "up",
  },
  {
    id: "M002",
    name: "Occupancy Rate",
    value: 87,
    change: 5.2,
    changeType: "increase",
    period: "This Month",
    icon: Bed,
    color: "text-green-600",
    trend: "up",
  },
  {
    id: "M003",
    name: "Average Rating",
    value: 4.8,
    change: 0.3,
    changeType: "increase",
    period: "This Month",
    icon: Star,
    color: "text-yellow-600",
    trend: "up",
  },
  {
    id: "M004",
    name: "Revenue Growth",
    value: 23.7,
    change: 8.1,
    changeType: "increase",
    period: "This Month",
    icon: TrendingUp,
    color: "text-purple-600",
    trend: "up",
  },
];

const mockGuestAnalytics: GuestAnalytics = {
  totalGuests: 1247,
  newGuests: 892,
  returningGuests: 355,
  averageStay: 3.2,
  satisfactionScore: 4.8,
  topCountries: [
    { country: "Namibia", count: 456, percentage: 36.6 },
    { country: "South Africa", count: 234, percentage: 18.8 },
    { country: "Germany", count: 189, percentage: 15.2 },
    { country: "United States", count: 156, percentage: 12.5 },
    { country: "United Kingdom", count: 123, percentage: 9.9 },
    { country: "Other", count: 89, percentage: 7.1 },
  ],
  ageGroups: [
    { group: "18-25", count: 234, percentage: 18.8 },
    { group: "26-35", count: 456, percentage: 36.6 },
    { group: "36-45", count: 312, percentage: 25.0 },
    { group: "46-55", count: 156, percentage: 12.5 },
    { group: "55+", count: 89, percentage: 7.1 },
  ],
};

const mockRevenueAnalytics: RevenueAnalytics = {
  totalRevenue: 485000,
  roomRevenue: 320000,
  restaurantRevenue: 95000,
  tourRevenue: 70000,
  averageBookingValue: 1250,
  revenueGrowth: 23.7,
  topRevenueSources: [
    { source: "Room Bookings", amount: 320000, percentage: 66.0 },
    { source: "Restaurant", amount: 95000, percentage: 19.6 },
    { source: "Tours & Activities", amount: 70000, percentage: 14.4 },
  ],
};

const mockPerformanceMetrics: PerformanceMetrics = {
  occupancyRate: 87,
  averageDailyRate: 450,
  revenuePerAvailableRoom: 392,
  guestSatisfaction: 4.8,
  repeatGuestRate: 28.5,
  directBookingRate: 65.2,
};

const monthlyData = [
  { month: "Jan", guests: 420, revenue: 420000, satisfaction: 4.6 },
  { month: "Feb", guests: 380, revenue: 380000, satisfaction: 4.5 },
  { month: "Mar", guests: 450, revenue: 450000, satisfaction: 4.7 },
  { month: "Apr", guests: 410, revenue: 410000, satisfaction: 4.6 },
  { month: "May", guests: 480, revenue: 480000, satisfaction: 4.8 },
  { month: "Jun", guests: 520, revenue: 520000, satisfaction: 4.7 },
  { month: "Jul", guests: 560, revenue: 560000, satisfaction: 4.9 },
  { month: "Aug", guests: 540, revenue: 540000, satisfaction: 4.8 },
  { month: "Sep", guests: 580, revenue: 580000, satisfaction: 4.9 },
  { month: "Oct", guests: 620, revenue: 620000, satisfaction: 4.8 },
  { month: "Nov", guests: 590, revenue: 590000, satisfaction: 4.9 },
  { month: "Dec", guests: 485, revenue: 485000, satisfaction: 4.8 },
];
