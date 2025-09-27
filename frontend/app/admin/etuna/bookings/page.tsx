/**
 * Etuna Bookings Management Page - Showcase Demo
 * 
 * Demonstrates the booking management capabilities of Buffr Host platform
 * with realistic demo data for Etuna Guesthouse & Tours
 */

import { Metadata } from 'next';
import { 
  Calendar,
  Clock,
  Users,
  Bed,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  Plus
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Etuna Bookings - Buffr Host Demo',
  description: 'Booking management dashboard showcasing Buffr Host platform capabilities for Etuna Guesthouse',
};

export default function EtunaBookingsPage() {
  // Demo bookings data
  const bookings = [
    {
      id: 'BK-001',
      guestName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+264 81 234 5678',
      checkIn: '2024-02-15',
      checkOut: '2024-02-18',
      roomType: 'Executive Room',
      roomNumber: 'E-205',
      adults: 2,
      children: 0,
      status: 'confirmed',
      totalAmount: 3000,
      currency: 'NAD',
      bookingDate: '2024-02-10',
      source: 'Website',
      specialRequests: 'Late check-in requested',
      notes: 'Anniversary celebration'
    },
    {
      id: 'BK-002',
      guestName: 'Maria Garcia',
      email: 'maria.garcia@company.com',
      phone: '+264 81 345 6789',
      checkIn: '2024-02-16',
      checkOut: '2024-02-20',
      roomType: 'Family Suite',
      roomNumber: 'F-301',
      adults: 2,
      children: 2,
      status: 'confirmed',
      totalAmount: 6000,
      currency: 'NAD',
      bookingDate: '2024-02-12',
      source: 'Booking.com',
      specialRequests: 'Extra bed for children',
      notes: 'Business trip with family'
    },
    {
      id: 'BK-003',
      guestName: 'David Johnson',
      email: 'david.j@email.com',
      phone: '+264 81 456 7890',
      checkIn: '2024-02-14',
      checkOut: '2024-02-16',
      roomType: 'Standard Room',
      roomNumber: 'S-102',
      adults: 1,
      children: 0,
      status: 'pending',
      totalAmount: 1500,
      currency: 'NAD',
      bookingDate: '2024-02-13',
      source: 'Phone',
      specialRequests: 'Ground floor room preferred',
      notes: 'First time guest'
    },
    {
      id: 'BK-004',
      guestName: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+264 81 567 8901',
      checkIn: '2024-02-20',
      checkOut: '2024-02-25',
      roomType: 'Luxury Room',
      roomNumber: 'L-108',
      adults: 2,
      children: 0,
      status: 'confirmed',
      totalAmount: 4150,
      currency: 'NAD',
      bookingDate: '2024-02-08',
      source: 'Expedia',
      specialRequests: 'Romantic dinner setup',
      notes: 'Honeymoon stay'
    },
    {
      id: 'BK-005',
      guestName: 'Michael Brown',
      email: 'michael.brown@corp.com',
      phone: '+264 81 678 9012',
      checkIn: '2024-02-18',
      checkOut: '2024-02-22',
      roomType: 'Premier Room',
      roomNumber: 'P-401',
      adults: 1,
      children: 0,
      status: 'cancelled',
      totalAmount: 8000,
      currency: 'NAD',
      bookingDate: '2024-02-05',
      source: 'Direct',
      specialRequests: 'Business center access',
      notes: 'Cancelled due to travel restrictions'
    },
    {
      id: 'BK-006',
      guestName: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      phone: '+264 81 789 0123',
      checkIn: '2024-02-22',
      checkOut: '2024-02-24',
      roomType: 'Executive Room',
      roomNumber: 'E-203',
      adults: 2,
      children: 1,
      status: 'confirmed',
      totalAmount: 2000,
      currency: 'NAD',
      bookingDate: '2024-02-14',
      source: 'Website',
      specialRequests: 'Baby cot needed',
      notes: 'Weekend getaway'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalAmount, 0)
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-base-content">Bookings Management</h1>
            <p className="text-base-content/70 mt-2">Manage all guest reservations and bookings</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn btn-outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Total Revenue</p>
                <p className="text-2xl font-bold">NAD {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Search bookings by guest name, email, or booking ID..."
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="select select-bordered">
                <option>All Status</option>
                <option>Confirmed</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
              <select className="select select-bordered">
                <option>All Sources</option>
                <option>Website</option>
                <option>Booking.com</option>
                <option>Expedia</option>
                <option>Phone</option>
                <option>Direct</option>
              </select>
              <button className="btn btn-outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Guest</th>
                  <th>Check-in/out</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Source</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="font-mono text-sm">{booking.id}</div>
                      <div className="text-xs text-base-content/70">{booking.bookingDate}</div>
                    </td>
                    <td>
                      <div className="font-medium">{booking.guestName}</div>
                      <div className="text-sm text-base-content/70">{booking.email}</div>
                      <div className="text-sm text-base-content/70">{booking.phone}</div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {booking.checkIn}
                        </div>
                        <div className="flex items-center gap-1 text-base-content/70">
                          <Calendar className="w-3 h-3" />
                          {booking.checkOut}
                        </div>
                        <div className="text-xs text-base-content/50">
                          {booking.adults} adults, {booking.children} children
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">{booking.roomType}</div>
                      <div className="text-sm text-base-content/70">{booking.roomNumber}</div>
                    </td>
                    <td>
                      <div className={`badge ${getStatusColor(booking.status)} gap-1`}>
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold">{booking.currency} {booking.totalAmount.toLocaleString()}</div>
                    </td>
                    <td>
                      <div className="text-sm">{booking.source}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button className="btn btn-ghost btn-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm text-error">
                          <Trash2 className="w-4 h-4" />
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

      {/* Booking Details Modal would go here */}
      <div className="mt-6 text-center">
        <p className="text-sm text-base-content/70">
          This is a demo showcase. In the full Buffr Host platform, you would have:
        </p>
        <ul className="text-sm text-base-content/70 mt-2 space-y-1">
          <li>• Real-time booking synchronization</li>
          <li>• Automated confirmation emails</li>
          <li>• Payment processing integration</li>
          <li>• Room availability management</li>
          <li>• Guest communication tools</li>
          <li>• Advanced reporting and analytics</li>
        </ul>
      </div>
    </div>
  );
}
