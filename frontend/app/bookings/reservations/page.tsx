"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Bed,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Clock3,
  Users,
  CreditCard,
  Receipt,
  Star,
  MessageSquare,
  Settings
} from 'lucide-react';

export default function BookingReservationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('reservations');

  // Sample reservations data
  const reservations = [
    {
      id: 'RES001',
      guestName: 'John Smith',
      guestEmail: 'john.smith@email.com',
      guestPhone: '+264 81 123 4567',
      propertyName: 'Etuna Guesthouse',
      roomNumber: '101',
      roomType: 'Deluxe Double',
      checkIn: '2024-01-25',
      checkOut: '2024-01-28',
      nights: 3,
      guests: 2,
      status: 'confirmed',
      totalAmount: 4500,
      depositPaid: 900,
      balance: 3600,
      paymentStatus: 'partial',
      bookingDate: '2024-01-20',
      specialRequests: 'Late check-in requested',
      source: 'Website',
      notes: 'Anniversary celebration'
    },
    {
      id: 'RES002',
      guestName: 'Maria Garcia',
      guestEmail: 'maria.garcia@email.com',
      guestPhone: '+264 81 234 5678',
      propertyName: 'Namibia Safari Lodge',
      roomNumber: '205',
      roomType: 'Safari Suite',
      checkIn: '2024-01-30',
      checkOut: '2024-02-02',
      nights: 3,
      guests: 4,
      status: 'pending',
      totalAmount: 8500,
      depositPaid: 0,
      balance: 8500,
      paymentStatus: 'pending',
      bookingDate: '2024-01-22',
      specialRequests: 'Vegetarian meals required',
      source: 'Phone',
      notes: 'Family vacation with children'
    },
    {
      id: 'RES003',
      guestName: 'David Johnson',
      guestEmail: 'david.johnson@email.com',
      guestPhone: '+264 81 345 6789',
      propertyName: 'Coastal Retreat',
      roomNumber: '301',
      roomType: 'Ocean View',
      checkIn: '2024-02-05',
      checkOut: '2024-02-08',
      nights: 3,
      guests: 2,
      status: 'checked-in',
      totalAmount: 7200,
      depositPaid: 7200,
      balance: 0,
      paymentStatus: 'paid',
      bookingDate: '2024-01-18',
      specialRequests: 'Early check-in at 12 PM',
      source: 'Booking.com',
      notes: 'Business trip'
    },
    {
      id: 'RES004',
      guestName: 'Sarah Wilson',
      guestEmail: 'sarah.wilson@email.com',
      guestPhone: '+264 81 456 7890',
      propertyName: 'Etuna Guesthouse',
      roomNumber: '102',
      roomType: 'Family Suite',
      checkIn: '2024-01-15',
      checkOut: '2024-01-17',
      nights: 2,
      guests: 3,
      status: 'completed',
      totalAmount: 3200,
      depositPaid: 3200,
      balance: 0,
      paymentStatus: 'paid',
      bookingDate: '2024-01-10',
      specialRequests: 'Extra bed for child',
      source: 'Website',
      notes: 'Weekend getaway'
    },
    {
      id: 'RES005',
      guestName: 'Robert Brown',
      guestEmail: 'robert.brown@email.com',
      guestPhone: '+264 81 567 8901',
      propertyName: 'Mountain View Inn',
      roomNumber: '401',
      roomType: 'Standard Single',
      checkIn: '2024-02-10',
      checkOut: '2024-02-12',
      nights: 2,
      guests: 1,
      status: 'cancelled',
      totalAmount: 1800,
      depositPaid: 360,
      balance: 0,
      paymentStatus: 'refunded',
      bookingDate: '2024-01-25',
      specialRequests: 'Quiet room preferred',
      source: 'Email',
      notes: 'Cancelled due to travel restrictions'
    }
  ];

  const upcomingCheckIns = reservations.filter(r => 
    r.status === 'confirmed' && new Date(r.checkIn) >= new Date()
  ).sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

  const upcomingCheckOuts = reservations.filter(r => 
    r.status === 'checked-in' && new Date(r.checkOut) >= new Date()
  ).sort((a, b) => new Date(a.checkOut).getTime() - new Date(b.checkOut).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'checked-in':
        return 'text-info bg-info/10';
      case 'completed':
        return 'text-primary bg-primary/10';
      case 'cancelled':
        return 'text-error bg-error/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'checked-in':
        return CheckCircle;
      case 'completed':
        return CheckCircle;
      case 'cancelled':
        return AlertCircle;
      default:
        return Calendar;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-success bg-success/10';
      case 'partial':
        return 'text-warning bg-warning/10';
      case 'pending':
        return 'text-error bg-error/10';
      case 'refunded':
        return 'text-info bg-info/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const filteredReservations = reservations.filter(reservation =>
    reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.roomNumber.includes(searchTerm) ||
    reservation.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'checkins', label: 'Check-ins', icon: CheckCircle },
    { id: 'checkouts', label: 'Check-outs', icon: Clock3 },
    { id: 'analytics', label: 'Analytics', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Booking Reservations"
        description="Manage reservations, check-ins, check-outs, and booking analytics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Bookings', href: '/bookings' },
          { label: 'Reservations', href: '/bookings/reservations' }
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="tabs tabs-boxed">
                {tabs.map((tab) => {
                  const TabIcon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <TabIcon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <ActionButton variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </ActionButton>
                <ActionButton>
                  <Plus className="w-4 h-4 mr-2" />
                  New Reservation
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search reservations..."
                        className="input input-bordered w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn btn-square">
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <select
                    className="select select-bordered w-full md:w-40"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="checked-in">Checked-in</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reservations List */}
            <div className="space-y-4 mb-8">
              {filteredReservations.map((reservation) => {
                const StatusIcon = getStatusIcon(reservation.status);
                return (
                  <div key={reservation.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Calendar className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{reservation.guestName}</h3>
                            <p className="text-sm text-base-content/70">{reservation.propertyName}</p>
                            <p className="text-sm font-medium">Room {reservation.roomNumber} - {reservation.roomType}</p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(reservation.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                          </div>
                          <div className={`badge ${getPaymentStatusColor(reservation.paymentStatus)}`}>
                            {reservation.paymentStatus.charAt(0).toUpperCase() + reservation.paymentStatus.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Check-in</p>
                          <p className="font-semibold">{reservation.checkIn}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Check-out</p>
                          <p className="font-semibold">{reservation.checkOut}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Nights</p>
                          <p className="font-semibold">{reservation.nights}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Guests</p>
                          <p className="font-semibold">{reservation.guests}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Total Amount</p>
                          <p className="font-semibold">N$ {reservation.totalAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Deposit Paid</p>
                          <p className="font-semibold">N$ {reservation.depositPaid.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Balance</p>
                          <p className="font-semibold">N$ {reservation.balance.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="text-sm">{reservation.guestEmail}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm">{reservation.guestPhone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CalendarDays className="w-4 h-4 text-primary" />
                          <span className="text-sm">Booked: {reservation.bookingDate}</span>
                        </div>
                      </div>

                      {reservation.specialRequests && (
                        <div className="mb-4">
                          <p className="text-xs text-base-content/70 mb-1">Special Requests</p>
                          <p className="text-sm bg-base-200 p-2 rounded">{reservation.specialRequests}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-base-content/70">
                          Source: {reservation.source} | Notes: {reservation.notes}
                        </div>
                        <div className="flex space-x-2">
                          <button className="btn btn-ghost btn-sm">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm">
                            <Receipt className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Check-ins Tab */}
        {activeTab === 'checkins' && (
          <div className="space-y-4 mb-8">
            {upcomingCheckIns.map((reservation) => {
              const StatusIcon = getStatusIcon(reservation.status);
              return (
                <div key={reservation.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-success/10">
                          <CheckCircle className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{reservation.guestName}</h3>
                          <p className="text-sm text-base-content/70">{reservation.propertyName}</p>
                          <p className="text-sm font-medium">Room {reservation.roomNumber}</p>
                        </div>
                      </div>
                      <div className={`badge ${getStatusColor(reservation.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-base-content/70">Check-in Date</p>
                        <p className="font-semibold">{reservation.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Nights</p>
                        <p className="font-semibold">{reservation.nights}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Guests</p>
                        <p className="font-semibold">{reservation.guests}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-base-content/70">
                        {reservation.specialRequests}
                      </div>
                      <div className="flex space-x-2">
                        <ActionButton variant="outline">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Check In
                        </ActionButton>
                        <button className="btn btn-ghost btn-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Check-outs Tab */}
        {activeTab === 'checkouts' && (
          <div className="space-y-4 mb-8">
            {upcomingCheckOuts.map((reservation) => {
              const StatusIcon = getStatusIcon(reservation.status);
              return (
                <div key={reservation.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-info/10">
                          <Clock3 className="w-5 h-5 text-info" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{reservation.guestName}</h3>
                          <p className="text-sm text-base-content/70">{reservation.propertyName}</p>
                          <p className="text-sm font-medium">Room {reservation.roomNumber}</p>
                        </div>
                      </div>
                      <div className={`badge ${getStatusColor(reservation.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-base-content/70">Check-out Date</p>
                        <p className="font-semibold">{reservation.checkOut}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Total Amount</p>
                        <p className="font-semibold">N$ {reservation.totalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Payment Status</p>
                        <div className={`badge ${getPaymentStatusColor(reservation.paymentStatus)}`}>
                          {reservation.paymentStatus.charAt(0).toUpperCase() + reservation.paymentStatus.slice(1)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-base-content/70">
                        Balance: N$ {reservation.balance.toLocaleString()}
                      </div>
                      <div className="flex space-x-2">
                        <ActionButton variant="outline">
                          <Clock3 className="w-4 h-4 mr-2" />
                          Check Out
                        </ActionButton>
                        <button className="btn btn-ghost btn-sm">
                          <Receipt className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Reservation Analytics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Reservations</span>
                    <span className="font-semibold">{reservations.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Confirmed</span>
                    <span className="font-semibold text-success">
                      {reservations.filter(r => r.status === 'confirmed').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Checked-in</span>
                    <span className="font-semibold text-info">
                      {reservations.filter(r => r.status === 'checked-in').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="font-semibold text-primary">
                      {reservations.filter(r => r.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cancelled</span>
                    <span className="font-semibold text-error">
                      {reservations.filter(r => r.status === 'cancelled').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Revenue Analytics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Revenue</span>
                    <span className="font-semibold">
                      N$ {reservations.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Deposits Collected</span>
                    <span className="font-semibold">
                      N$ {reservations.reduce((sum, r) => sum + r.depositPaid, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Outstanding Balance</span>
                    <span className="font-semibold">
                      N$ {reservations.reduce((sum, r) => sum + r.balance, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Booking Value</span>
                    <span className="font-semibold">
                      N$ {Math.round(reservations.reduce((sum, r) => sum + r.totalAmount, 0) / reservations.length).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Nights</span>
                    <span className="font-semibold">
                      {(reservations.reduce((sum, r) => sum + r.nights, 0) / reservations.length).toFixed(1)} nights
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Reservations</p>
                  <p className="text-2xl font-bold">{reservations.length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-green-500 text-white">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Confirmed</p>
                  <p className="text-2xl font-bold">
                    {reservations.filter(r => r.status === 'confirmed').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    N$ {reservations.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Avg Guests</p>
                  <p className="text-2xl font-bold">
                    {(reservations.reduce((sum, r) => sum + r.guests, 0) / reservations.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}