import { Metadata } from 'next';
import Image from 'next/image';
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
  Activity
} from 'lucide-react';
import { etunaUnifiedData } from '@/lib/data/etuna-property-unified';

export const metadata: Metadata = {
  title: 'Etuna Guesthouse - Admin Dashboard',
  description: 'Comprehensive management dashboard for Etuna Guesthouse and Tours',
};

export default function EtunaDashboardPage() {
  const property = etunaUnifiedData.property;

  // Dummy data for dashboard
  const dashboardData = {
    occupancy: {
      current: 28,
      total: 35,
      percentage: 80
    },
    revenue: {
      today: 15600,
      thisMonth: 468000,
      lastMonth: 420000,
      growth: 11.4
    },
    bookings: {
      today: 8,
      thisWeek: 45,
      thisMonth: 180,
      pending: 12
    },
    guests: {
      current: 42,
      arrivals: 15,
      departures: 8,
      totalThisMonth: 320
    },
    ratings: {
      average: 4.8,
      total: 127,
      breakdown: {
        excellent: 89,
        good: 28,
        average: 8,
        poor: 2
      }
    }
  };

  const recentBookings = [
    {
      id: 'BK001',
      guest: 'John Smith',
      room: 'Executive Room',
      checkIn: '2024-01-15',
      checkOut: '2024-01-17',
      status: 'confirmed',
      amount: 2000
    },
    {
      id: 'BK002',
      guest: 'Maria Garcia',
      room: 'Family Suite 1',
      checkIn: '2024-01-16',
      checkOut: '2024-01-19',
      status: 'pending',
      amount: 4500
    },
    {
      id: 'BK003',
      guest: 'Ahmed Hassan',
      room: 'Standard Room',
      checkIn: '2024-01-14',
      checkOut: '2024-01-16',
      status: 'checked-in',
      amount: 1500
    },
    {
      id: 'BK004',
      guest: 'Sarah Johnson',
      room: 'Luxury Room',
      checkIn: '2024-01-18',
      checkOut: '2024-01-20',
      status: 'confirmed',
      amount: 1660
    }
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 420000 },
    { month: 'Feb', revenue: 380000 },
    { month: 'Mar', revenue: 450000 },
    { month: 'Apr', revenue: 410000 },
    { month: 'May', revenue: 480000 },
    { month: 'Jun', revenue: 520000 },
    { month: 'Jul', revenue: 560000 },
    { month: 'Aug', revenue: 540000 },
    { month: 'Sep', revenue: 580000 },
    { month: 'Oct', revenue: 620000 },
    { month: 'Nov', revenue: 590000 },
    { month: 'Dec', revenue: 468000 }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{property.property_name}</h1>
              <p className="text-primary-content/80">Your House Away From Home</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm">Current Occupancy</p>
                <p className="text-2xl font-bold">{dashboardData.occupancy.current}/{dashboardData.occupancy.total} rooms</p>
                <p className="text-sm">{dashboardData.occupancy.percentage}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Today&apos;s Revenue</div>
              <div className="stat-value text-primary">N$ {dashboardData.revenue.today.toLocaleString()}</div>
              <div className="stat-desc">+{dashboardData.revenue.growth}% from last month</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="stat-title">Bookings Today</div>
              <div className="stat-value text-secondary">{dashboardData.bookings.today}</div>
              <div className="stat-desc">{dashboardData.bookings.pending} pending</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Current Guests</div>
              <div className="stat-value text-accent">{dashboardData.guests.current}</div>
              <div className="stat-desc">{dashboardData.guests.arrivals} arrivals, {dashboardData.guests.departures} departures</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <Star className="w-8 h-8" />
              </div>
              <div className="stat-title">Average Rating</div>
              <div className="stat-value text-info">{dashboardData.ratings.average}</div>
              <div className="stat-desc">{dashboardData.ratings.total} reviews</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Recent Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Guest</th>
                        <th>Room</th>
                        <th>Check-in</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="font-mono">{booking.id}</td>
                          <td>{booking.guest}</td>
                          <td>{booking.room}</td>
                          <td>{booking.checkIn}</td>
                          <td>N$ {booking.amount}</td>
                          <td>
                            <span className={`badge ${
                              booking.status === 'confirmed' ? 'badge-success' :
                              booking.status === 'pending' ? 'badge-warning' :
                              booking.status === 'checked-in' ? 'badge-info' :
                              'badge-error'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="btn btn-primary btn-sm w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    New Booking
                  </button>
                  <button className="btn btn-secondary btn-sm w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Check-in Guest
                  </button>
                  <button className="btn btn-accent btn-sm w-full">
                    <Utensils className="w-4 h-4 mr-2" />
                    Restaurant Orders
                  </button>
                  <button className="btn btn-outline btn-sm w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Reports
                  </button>
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4">Property Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-sm text-base-content/70">{property.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-sm text-base-content/70">{property.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-sm text-base-content/70">{property.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Check-in/out</p>
                      <p className="text-sm text-base-content/70">{property.check_in_time} / {property.check_out_time}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Status */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4">Room Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Standard Rooms (12)</span>
                    <span className="badge badge-success">10 Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Executive Rooms (13)</span>
                    <span className="badge badge-warning">8 Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Luxury Rooms (10)</span>
                    <span className="badge badge-success">9 Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Family Suites (7)</span>
                    <span className="badge badge-info">5 Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premier Rooms (4)</span>
                    <span className="badge badge-success">3 Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="card bg-base-100 shadow-xl mt-8">
          <div className="card-body">
            <h3 className="card-title mb-6">Monthly Revenue Trend</h3>
            <div className="h-64 flex items-end space-x-2">
              {monthlyRevenue.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="bg-primary rounded-t"
                    style={{ height: `${(data.revenue / 700000) * 200}px` }}
                  ></div>
                  <span className="text-xs mt-2">{data.month}</span>
                  <span className="text-xs text-base-content/70">N$ {(data.revenue / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
