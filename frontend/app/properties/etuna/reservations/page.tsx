"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Calendar, 
  Users, 
  Bed, 
  Clock, 
  DollarSign, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function EtunaReservationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample reservation data
  const reservations = [
    {
      id: 'RES001',
      guestName: 'John Smith',
      roomNumber: '101',
      roomType: 'Deluxe Double',
      checkIn: '2024-01-20',
      checkOut: '2024-01-23',
      nights: 3,
      guests: 2,
      totalAmount: 4500,
      status: 'confirmed',
      bookingDate: '2024-01-15',
      specialRequests: 'Late check-in requested'
    },
    {
      id: 'RES002',
      guestName: 'Maria Garcia',
      roomNumber: '205',
      roomType: 'Standard Single',
      checkIn: '2024-01-21',
      checkOut: '2024-01-24',
      nights: 3,
      guests: 1,
      totalAmount: 2700,
      status: 'pending',
      bookingDate: '2024-01-18',
      specialRequests: 'Vegetarian breakfast'
    },
    {
      id: 'RES003',
      guestName: 'David Johnson',
      roomNumber: '102',
      roomType: 'Family Suite',
      checkIn: '2024-01-22',
      checkOut: '2024-01-25',
      nights: 3,
      guests: 4,
      totalAmount: 7200,
      status: 'checked-in',
      bookingDate: '2024-01-10',
      specialRequests: 'Extra bed for child'
    },
    {
      id: 'RES004',
      guestName: 'Sarah Wilson',
      roomNumber: '301',
      roomType: 'Deluxe Double',
      checkIn: '2024-01-19',
      checkOut: '2024-01-21',
      nights: 2,
      guests: 2,
      totalAmount: 3000,
      status: 'completed',
      bookingDate: '2024-01-12',
      specialRequests: 'Anniversary celebration'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'checked-in':
        return 'text-info bg-info/10';
      case 'completed':
        return 'text-base-content bg-base-300';
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
        return Users;
      case 'completed':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.roomNumber.includes(searchTerm) ||
                         reservation.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Reservations Management"
        description="Manage room reservations and bookings for Etuna Guesthouse"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Etuna Management', href: '/protected/etuna' },
          { label: 'Reservations', href: '/protected/etuna/reservations' }
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Action Bar */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="form-control">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Search reservations..."
                      className="input input-bordered w-full md:w-80"
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
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked-in">Checked-in</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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

        {/* Reservations Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Reservation ID</th>
                    <th>Guest Name</th>
                    <th>Room</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Nights</th>
                    <th>Guests</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => {
                    const StatusIcon = getStatusIcon(reservation.status);
                    return (
                      <tr key={reservation.id}>
                        <td>
                          <div className="font-mono text-sm font-semibold">
                            {reservation.id}
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="font-semibold">{reservation.guestName}</div>
                            <div className="text-sm text-base-content/70">
                              Booked: {reservation.bookingDate}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="font-semibold">Room {reservation.roomNumber}</div>
                            <div className="text-sm text-base-content/70">
                              {reservation.roomType}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{reservation.checkIn}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{reservation.checkOut}</span>
                          </div>
                        </td>
                        <td>
                          <div className="text-center">
                            <span className="font-semibold">{reservation.nights}</span>
                            <div className="text-sm text-base-content/70">nights</div>
                          </div>
                        </td>
                        <td>
                          <div className="text-center">
                            <span className="font-semibold">{reservation.guests}</span>
                            <div className="text-sm text-base-content/70">guests</div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-success" />
                            <span className="font-semibold">N$ {reservation.totalAmount}</span>
                          </div>
                        </td>
                        <td>
                          <div className={`badge ${getStatusColor(reservation.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                          </div>
                        </td>
                        <td>
                          <div className="flex space-x-2">
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
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
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Checked-in Today</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Pending</p>
                  <p className="text-2xl font-bold">1</p>
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
                  <p className="text-sm text-base-content/70">Today&apos;s Revenue</p>
                  <p className="text-2xl font-bold">N$ 17,400</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}