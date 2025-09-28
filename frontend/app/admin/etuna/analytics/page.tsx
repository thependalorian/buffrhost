import { Metadata } from "next";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Bed,
  Utensils,
  Car,
  BarChart3,
  PieChart,
  Activity,
  Eye,
  Clock,
  Star,
  MapPin,
} from "lucide-react";
import { StatCard, PageHeader } from "@/src/components/ui";
/**
 * Etuna Analytics Page - Showcase Demo
 *
 * Demonstrates the analytics capabilities of Buffr Host platform
 * with realistic demo data for Etuna Guesthouse & Tours
 */

export const metadata: Metadata = {
  title: "Etuna Analytics - Buffr Host Demo",
  description:
    "Analytics dashboard showcasing Buffr Host platform capabilities for Etuna Guesthouse",
};

export default function EtunaAnalyticsPage() {
  // Demo analytics data
  const analyticsData = {
    overview: {
      totalRevenue: 468000,
      totalBookings: 180,
      occupancyRate: 78.5,
      averageRating: 4.8,
      totalGuests: 324,
      repeatGuests: 45.2,
    },
    revenue: {
      today: 15600,
      thisWeek: 98000,
      thisMonth: 468000,
      lastMonth: 420000,
      growth: 11.4,
      breakdown: {
        accommodation: 320000,
        restaurant: 98000,
        tours: 35000,
        conference: 15000,
      },
    },
    occupancy: {
      current: 28,
      total: 35,
      percentage: 80,
      byRoomType: {
        standard: { occupied: 12, total: 15, percentage: 80 },
        executive: { occupied: 8, total: 10, percentage: 80 },
        luxury: { occupied: 5, total: 6, percentage: 83 },
        family: { occupied: 2, total: 3, percentage: 67 },
        premier: { occupied: 1, total: 1, percentage: 100 },
      },
    },
    bookings: {
      today: 8,
      thisWeek: 45,
      thisMonth: 180,
      pending: 12,
      confirmed: 156,
      cancelled: 12,
      bySource: {
        direct: 45,
        bookingCom: 38,
        expedia: 32,
        walkIn: 25,
        phone: 20,
        website: 20,
      },
    },
    guests: {
      total: 324,
      new: 178,
      returning: 146,
      demographics: {
        business: 45.2,
        leisure: 38.7,
        conference: 16.1,
      },
      topCountries: [
        { country: "Namibia", guests: 156, percentage: 48.1 },
        { country: "South Africa", guests: 89, percentage: 27.5 },
        { country: "Germany", guests: 34, percentage: 10.5 },
        { country: "United Kingdom", guests: 28, percentage: 8.6 },
        { country: "Other", guests: 17, percentage: 5.3 },
      ],
    },
    services: {
      restaurant: {
        orders: 245,
        revenue: 98000,
        averageOrder: 400,
        topItems: [
          { name: "Traditional Half Chicken", orders: 45, revenue: 6750 },
          { name: "Oxtail Stew", orders: 38, revenue: 5700 },
          { name: "Rump Steak", orders: 32, revenue: 4800 },
          { name: "King Klip", orders: 28, revenue: 4200 },
          { name: "Pizza Haden Hawaiian", orders: 25, revenue: 2500 },
        ],
      },
      tours: {
        bookings: 67,
        revenue: 35000,
        averageBooking: 522,
        popularTours: [
          { name: "Etosha National Park Safari", bookings: 23, revenue: 27600 },
          { name: "Ruacana Falls Tour", bookings: 18, revenue: 14400 },
          { name: "Baobab Tree Heritage Tour", bookings: 15, revenue: 6000 },
          { name: "Omhedi Palace Tour", bookings: 11, revenue: 6600 },
        ],
      },
      conference: {
        bookings: 12,
        revenue: 15000,
        averageBooking: 1250,
        events: [
          { name: "Corporate Training", bookings: 5, revenue: 7500 },
          { name: "Wedding Reception", bookings: 3, revenue: 4500 },
          { name: "Business Meeting", bookings: 4, revenue: 3000 },
        ],
      },
    },
    performance: {
      pageViews: 12450,
      uniqueVisitors: 3240,
      conversionRate: 5.6,
      bounceRate: 34.2,
      averageSession: 4.2,
      topPages: [
        { page: "/rooms", views: 3450, percentage: 27.7 },
        { page: "/restaurant", views: 2890, percentage: 23.2 },
        { page: "/tours", views: 2340, percentage: 18.8 },
        { page: "/conference", views: 1890, percentage: 15.2 },
        { page: "/contact", views: 1880, percentage: 15.1 },
      ],
    },
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-base-content">
              Analytics Dashboard
            </h1>
            <p className="text-base-content/70 mt-2">
              Etuna Guesthouse & Tours - Performance Insights
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Live Data</span>
            </div>
            <select className="select select-bordered select-sm">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 3 Months</option>
              <option>Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Total Revenue</p>
                <p className="text-2xl font-bold">
                  NAD {analyticsData.overview.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />+
                  {analyticsData.revenue.growth}% vs last month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Total Bookings</p>
                <p className="text-2xl font-bold">
                  {analyticsData.overview.totalBookings}
                </p>
                <p className="text-sm text-blue-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {analyticsData.bookings.pending} pending
                </p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Occupancy Rate</p>
                <p className="text-2xl font-bold">
                  {analyticsData.overview.occupancyRate}%
                </p>
                <p className="text-sm text-orange-600 flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  {analyticsData.occupancy.current}/
                  {analyticsData.occupancy.total} rooms
                </p>
              </div>
              <Bed className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Average Rating</p>
                <p className="text-2xl font-bold">
                  {analyticsData.overview.averageRating}
                </p>
                <p className="text-sm text-yellow-600 flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {analyticsData.overview.totalGuests} total guests
                </p>
              </div>
              <Star className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Breakdown */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">Revenue Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Accommodation</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    NAD{" "}
                    {analyticsData.revenue.breakdown.accommodation.toLocaleString()}
                  </p>
                  <p className="text-sm text-base-content/70">68.4%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Restaurant</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    NAD{" "}
                    {analyticsData.revenue.breakdown.restaurant.toLocaleString()}
                  </p>
                  <p className="text-sm text-base-content/70">20.9%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span>Tours</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    NAD {analyticsData.revenue.breakdown.tours.toLocaleString()}
                  </p>
                  <p className="text-sm text-base-content/70">7.5%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span>Conference</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    NAD{" "}
                    {analyticsData.revenue.breakdown.conference.toLocaleString()}
                  </p>
                  <p className="text-sm text-base-content/70">3.2%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Occupancy by Room Type */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">Occupancy by Room Type</h3>
            <div className="space-y-4">
              {Object.entries(analyticsData.occupancy.byRoomType).map(
                ([type, data]) => (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="capitalize font-medium">
                        {type} Rooms
                      </span>
                      <span className="text-sm text-base-content/70">
                        {data.occupied}/{data.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${data.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">
                        {data.percentage}%
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Guest Demographics */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">Guest Demographics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Business Travelers</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "45.2%" }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">45.2%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Leisure Travelers</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "38.7%" }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">38.7%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Conference Attendees</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: "16.1%" }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">16.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Countries */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">Top Guest Countries</h3>
            <div className="space-y-3">
              {analyticsData.guests.topCountries.map((country, index) => (
                <div
                  key={country.country}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {country.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-base-content/70">
                      {country.guests} guests
                    </span>
                    <span className="text-sm font-semibold">
                      {country.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Website Performance */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">Website Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Page Views</span>
                <span className="font-semibold">
                  {analyticsData.performance.pageViews.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Unique Visitors</span>
                <span className="font-semibold">
                  {analyticsData.performance.uniqueVisitors.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Conversion Rate</span>
                <span className="font-semibold text-green-600">
                  {analyticsData.performance.conversionRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Bounce Rate</span>
                <span className="font-semibold text-red-600">
                  {analyticsData.performance.bounceRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Avg. Session</span>
                <span className="font-semibold">
                  {analyticsData.performance.averageSession} min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restaurant Performance */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">Restaurant Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total Orders</span>
                <span className="font-semibold">
                  {analyticsData.services.restaurant.orders}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Revenue</span>
                <span className="font-semibold">
                  NAD{" "}
                  {analyticsData.services.restaurant.revenue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Average Order</span>
                <span className="font-semibold">
                  NAD {analyticsData.services.restaurant.averageOrder}
                </span>
              </div>
              <div className="divider"></div>
              <h4 className="font-semibold mb-2">Top Menu Items</h4>
              <div className="space-y-2">
                {analyticsData.services.restaurant.topItems
                  .slice(0, 3)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{item.name}</span>
                      <span className="font-semibold">
                        {item.orders} orders
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tours Performance */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">Tours Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total Bookings</span>
                <span className="font-semibold">
                  {analyticsData.services.tours.bookings}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Revenue</span>
                <span className="font-semibold">
                  NAD {analyticsData.services.tours.revenue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Average Booking</span>
                <span className="font-semibold">
                  NAD {analyticsData.services.tours.averageBooking}
                </span>
              </div>
              <div className="divider"></div>
              <h4 className="font-semibold mb-2">Popular Tours</h4>
              <div className="space-y-2">
                {analyticsData.services.tours.popularTours
                  .slice(0, 3)
                  .map((tour, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{tour.name}</span>
                      <span className="font-semibold">
                        {tour.bookings} bookings
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
