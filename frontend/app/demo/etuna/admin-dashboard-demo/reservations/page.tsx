import { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  Users,
  Bed,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Home,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { etunaUnifiedData } from "@/lib/data/etuna-property-unified";

export const metadata: Metadata = {
  title: "Etuna Guesthouse - Reservations Management",
  description: "Manage room reservations and bookings for Etuna Guesthouse",
};

export default function EtunaReservationsPage() {
  const property = etunaUnifiedData.property;

  // Sample reservation data
  const reservations = [
    {
      id: "RES001",
      guestName: "John Smith",
      email: "john.smith@email.com",
      phone: "+264 81 234 5678",
      roomType: "Executive Room",
      roomNumber: "E-201",
      checkIn: "2024-01-15",
      checkOut: "2024-01-17",
      nights: 2,
      adults: 2,
      children: 0,
      status: "confirmed",
      totalAmount: 2000,
      paidAmount: 1000,
      balance: 1000,
      specialRequests: "Late check-in requested",
      createdDate: "2024-01-10",
      lastModified: "2024-01-12",
    },
    {
      id: "RES002",
      guestName: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "+264 81 345 6789",
      roomType: "Family Suite 1",
      roomNumber: "FS-301",
      checkIn: "2024-01-16",
      checkOut: "2024-01-19",
      nights: 3,
      adults: 2,
      children: 2,
      status: "pending",
      totalAmount: 4500,
      paidAmount: 0,
      balance: 4500,
      specialRequests: "High chair needed for toddler",
      createdDate: "2024-01-11",
      lastModified: "2024-01-11",
    },
    {
      id: "RES003",
      guestName: "Ahmed Hassan",
      email: "ahmed.hassan@email.com",
      phone: "+264 81 456 7890",
      roomType: "Standard Room",
      roomNumber: "S-101",
      checkIn: "2024-01-14",
      checkOut: "2024-01-16",
      nights: 2,
      adults: 1,
      children: 0,
      status: "checked-in",
      totalAmount: 1500,
      paidAmount: 1500,
      balance: 0,
      specialRequests: "Vegetarian meals only",
      createdDate: "2024-01-08",
      lastModified: "2024-01-14",
    },
    {
      id: "RES004",
      guestName: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+264 81 567 8901",
      roomType: "Luxury Room",
      roomNumber: "L-205",
      checkIn: "2024-01-18",
      checkOut: "2024-01-20",
      nights: 2,
      adults: 2,
      children: 0,
      status: "confirmed",
      totalAmount: 1660,
      paidAmount: 1660,
      balance: 0,
      specialRequests: "Anniversary celebration",
      createdDate: "2024-01-12",
      lastModified: "2024-01-12",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="badge badge-success">Confirmed</span>;
      case "pending":
        return <span className="badge badge-warning">Pending</span>;
      case "checked-in":
        return <span className="badge badge-info">Checked In</span>;
      case "checked-out":
        return <span className="badge badge-neutral">Checked Out</span>;
      case "cancelled":
        return <span className="badge badge-error">Cancelled</span>;
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case "checked-in":
        return <Clock className="w-4 h-4 text-info" />;
      case "checked-out":
        return <XCircle className="w-4 h-4 text-neutral" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return <AlertCircle className="w-4 h-4 text-ghost" />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/demo/etuna/admin-dashboard-demo/dashboard"
                className="btn btn-ghost text-primary-content hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">
                    Reservations Management
                  </h1>
                  <p className="text-primary-content/80">
                    Manage room reservations and bookings
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Reservation
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Filters and Search */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search reservations..."
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select className="select select-bordered">
                  <option>All Status</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Checked In</option>
                  <option>Checked Out</option>
                  <option>Cancelled</option>
                </select>
                <select className="select select-bordered">
                  <option>All Room Types</option>
                  <option>Standard Room</option>
                  <option>Executive Room</option>
                  <option>Luxury Room</option>
                  <option>Family Suite</option>
                  <option>Premier Room</option>
                </select>
                <button className="btn btn-outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Reservation ID</th>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Check-in/out</th>
                    <th>Nights</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>
                        <div className="font-mono text-sm">
                          {reservation.id}
                        </div>
                        <div className="text-xs text-base-content/70">
                          Created: {reservation.createdDate}
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold">
                          {reservation.guestName}
                        </div>
                        <div className="text-sm text-base-content/70">
                          {reservation.email}
                        </div>
                        <div className="text-sm text-base-content/70">
                          {reservation.phone}
                        </div>
                      </td>
                      <td>
                        <div className="font-medium">
                          {reservation.roomType}
                        </div>
                        <div className="text-sm text-base-content/70">
                          Room {reservation.roomNumber}
                        </div>
                        <div className="text-xs text-base-content/50">
                          {reservation.adults} adults, {reservation.children}{" "}
                          children
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div className="font-medium">
                            In: {reservation.checkIn}
                          </div>
                          <div className="font-medium">
                            Out: {reservation.checkOut}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          <div className="font-semibold">
                            {reservation.nights}
                          </div>
                          <div className="text-xs text-base-content/70">
                            nights
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          <div className="font-semibold">
                            N$ {reservation.totalAmount}
                          </div>
                          {reservation.balance > 0 && (
                            <div className="text-xs text-warning">
                              Balance: N$ {reservation.balance}
                            </div>
                          )}
                          {reservation.balance === 0 && (
                            <div className="text-xs text-success">
                              Paid in full
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(reservation.status)}
                          {getStatusBadge(reservation.status)}
                        </div>
                      </td>
                      <td>
                        <div className="flex space-x-1">
                          <button
                            className="btn btn-ghost btn-sm"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm text-error"
                            title="Cancel"
                          >
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Reservations</div>
              <div className="stat-value text-primary">
                {reservations.length}
              </div>
              <div className="stat-desc">This month</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Confirmed</div>
              <div className="stat-value text-secondary">
                {reservations.filter((r) => r.status === "confirmed").length}
              </div>
              <div className="stat-desc">Ready for check-in</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-warning">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Pending</div>
              <div className="stat-value text-warning">
                {reservations.filter((r) => r.status === "pending").length}
              </div>
              <div className="stat-desc">Awaiting confirmation</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <Clock className="w-8 h-8" />
              </div>
              <div className="stat-title">Checked In</div>
              <div className="stat-value text-info">
                {reservations.filter((r) => r.status === "checked-in").length}
              </div>
              <div className="stat-desc">Currently staying</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
