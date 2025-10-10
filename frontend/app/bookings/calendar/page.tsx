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
  Users,
  DollarSign,
  Star,
  Bed,
  Car,
  Utensils,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
  Clock3
} from 'lucide-react';

export default function BookingCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [activeTab, setActiveTab] = useState('calendar');

  // Sample bookings data
  const bookings = [
    {
      id: 'BK001',
      guestName: 'John Smith',
      guestEmail: 'john.smith@email.com',
      guestPhone: '+264 81 123 4567',
      propertyName: 'Etuna Guesthouse',
      roomNumber: '101',
      roomType: 'Deluxe Double',
      checkIn: '2024-01-25',
      checkOut: '2024-01-28',
      status: 'confirmed',
      totalAmount: 4500,
      guests: 2,
      specialRequests: 'Late check-in requested',
      source: 'Website',
      bookingDate: '2024-01-20',
      notes: 'Anniversary celebration'
    },
    {
      id: 'BK002',
      guestName: 'Maria Garcia',
      guestEmail: 'maria.garcia@email.com',
      guestPhone: '+264 81 234 5678',
      propertyName: 'Namibia Safari Lodge',
      roomNumber: '205',
      roomType: 'Safari Suite',
      checkIn: '2024-01-30',
      checkOut: '2024-02-02',
      status: 'pending',
      totalAmount: 8500,
      guests: 4,
      specialRequests: 'Vegetarian meals required',
      source: 'Phone',
      bookingDate: '2024-01-22',
      notes: 'Family vacation with children'
    },
    {
      id: 'BK003',
      guestName: 'David Johnson',
      guestEmail: 'david.johnson@email.com',
      guestPhone: '+264 81 345 6789',
      propertyName: 'Coastal Retreat',
      roomNumber: '301',
      roomType: 'Ocean View',
      checkIn: '2024-02-05',
      checkOut: '2024-02-08',
      status: 'checked-in',
      totalAmount: 7200,
      guests: 2,
      specialRequests: 'Early check-in at 12 PM',
      source: 'Booking.com',
      bookingDate: '2024-01-18',
      notes: 'Business trip'
    },
    {
      id: 'BK004',
      guestName: 'Sarah Wilson',
      guestEmail: 'sarah.wilson@email.com',
      guestPhone: '+264 81 456 7890',
      propertyName: 'Etuna Guesthouse',
      roomNumber: '102',
      roomType: 'Family Suite',
      checkIn: '2024-01-15',
      checkOut: '2024-01-17',
      status: 'completed',
      totalAmount: 3200,
      guests: 3,
      specialRequests: 'Extra bed for child',
      source: 'Website',
      bookingDate: '2024-01-10',
      notes: 'Weekend getaway'
    },
    {
      id: 'BK005',
      guestName: 'Robert Brown',
      guestEmail: 'robert.brown@email.com',
      guestPhone: '+264 81 567 8901',
      propertyName: 'Mountain View Inn',
      roomNumber: '401',
      roomType: 'Standard Single',
      checkIn: '2024-02-10',
      checkOut: '2024-02-12',
      status: 'cancelled',
      totalAmount: 1800,
      guests: 1,
      specialRequests: 'Quiet room preferred',
      source: 'Email',
      bookingDate: '2024-01-25',
      notes: 'Cancelled due to travel restrictions'
    }
  ];

  const properties = [
    { name: 'Etuna Guesthouse', count: 2, color: 'bg-blue-500' },
    { name: 'Namibia Safari Lodge', count: 1, color: 'bg-green-500' },
    { name: 'Coastal Retreat', count: 1, color: 'bg-purple-500' },
    { name: 'Mountain View Inn', count: 1, color: 'bg-orange-500' }
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

  const getPropertyColor = (property: string) => {
    switch (property) {
      case 'Etuna Guesthouse':
        return 'bg-blue-500';
      case 'Namibia Safari Lodge':
        return 'bg-green-500';
      case 'Coastal Retreat':
        return 'bg-purple-500';
      case 'Mountain View Inn':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(booking => 
      booking.checkIn <= dateStr && booking.checkOut > dateStr
    );
  };

  const filteredBookings = bookings.filter(booking =>
    selectedProperty === 'all' || booking.propertyName === selectedProperty
  );

  const tabs = [
    { id: 'calendar', label: 'Calendar View', icon: Calendar },
    { id: 'list', label: 'Booking List', icon: CalendarDays },
    { id: 'properties', label: 'Properties', icon: Bed },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const daysInMonth = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Booking Calendar"
        description="Manage bookings, reservations, and availability across all properties"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Bookings', href: '/bookings' },
          { label: 'Calendar', href: '/bookings/calendar' }
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
                <select
                  className="select select-bordered w-full md:w-40"
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                >
                  <option value="all">All Properties</option>
                  <option value="Etuna Guesthouse">Etuna Guesthouse</option>
                  <option value="Namibia Safari Lodge">Namibia Safari Lodge</option>
                  <option value="Coastal Retreat">Coastal Retreat</option>
                  <option value="Mountain View Inn">Mountain View Inn</option>
                </select>
                <ActionButton>
                  <Plus className="w-4 h-4 mr-2" />
                  New Booking
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <>
            {/* Calendar Header */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h2 className="text-2xl font-bold">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className={`btn btn-sm ${viewMode === 'month' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setViewMode('month')}
                    >
                      Month
                    </button>
                    <button
                      className={`btn btn-sm ${viewMode === 'week' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setViewMode('week')}
                    >
                      Week
                    </button>
                    <button
                      className={`btn btn-sm ${viewMode === 'day' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setViewMode('day')}
                    >
                      Day
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center font-semibold text-base-content/70 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {daysInMonth.map((day, index) => {
                    if (!day) {
                      return <div key={index} className="h-24"></div>;
                    }
                    
                    const dayBookings = getBookingsForDate(day);
                    const isToday = day.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={index}
                        className={`h-24 border border-base-300 p-1 ${
                          isToday ? 'bg-primary/10 border-primary' : 'bg-base-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-semibold ${isToday ? 'text-primary' : ''}`}>
                            {day.getDate()}
                          </span>
                          <span className="text-xs text-base-content/50">
                            {dayBookings.length} bookings
                          </span>
                        </div>
                        <div className="space-y-1">
                          {dayBookings.slice(0, 2).map((booking) => {
                            const StatusIcon = getStatusIcon(booking.status);
                            return (
                              <div
                                key={booking.id}
                                className={`text-xs p-1 rounded ${getStatusColor(booking.status)} cursor-pointer hover:opacity-80`}
                                title={`${booking.guestName} - ${booking.propertyName}`}
                              >
                                <div className="flex items-center space-x-1">
                                  <StatusIcon className="w-2 h-2" />
                                  <span className="truncate">{booking.guestName}</span>
                                </div>
                              </div>
                            );
                          })}
                          {dayBookings.length > 2 && (
                            <div className="text-xs text-base-content/50">
                              +{dayBookings.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* List Tab */}
        {activeTab === 'list' && (
          <div className="space-y-4 mb-8">
            {filteredBookings.map((booking) => {
              const StatusIcon = getStatusIcon(booking.status);
              return (
                <div key={booking.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${getPropertyColor(booking.propertyName)} text-white`}>
                          <Bed className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{booking.guestName}</h3>
                          <p className="text-sm text-base-content/70">{booking.propertyName}</p>
                          <p className="text-sm font-medium">Room {booking.roomNumber} - {booking.roomType}</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className={`badge ${getStatusColor(booking.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                        <div className="badge badge-outline">
                          {booking.guests} guests
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-base-content/70">Check-in</p>
                        <p className="font-semibold">{formatDate(booking.checkIn)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Check-out</p>
                        <p className="font-semibold">{formatDate(booking.checkOut)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Total Amount</p>
                        <p className="font-semibold">N$ {booking.totalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Source</p>
                        <p className="font-semibold">{booking.source}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-sm">{booking.guestEmail}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-sm">{booking.guestPhone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        <span className="text-sm">Booked: {formatDate(booking.bookingDate)}</span>
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-1">Special Requests</p>
                        <p className="text-sm bg-base-200 p-2 rounded">{booking.specialRequests}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-base-content/70">
                        Notes: {booking.notes}
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn btn-ghost btn-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Clock3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {properties.map((property, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-lg ${property.color} text-white`}>
                      <Bed className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="card-title text-lg">{property.name}</h3>
                      <p className="text-sm text-base-content/70">{property.count} bookings</p>
                    </div>
                  </div>
                  <div className="card-actions justify-end">
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Booking Analytics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Bookings</span>
                    <span className="font-semibold">{bookings.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Confirmed</span>
                    <span className="font-semibold text-success">
                      {bookings.filter(b => b.status === 'confirmed').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending</span>
                    <span className="font-semibold text-warning">
                      {bookings.filter(b => b.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Checked-in</span>
                    <span className="font-semibold text-info">
                      {bookings.filter(b => b.status === 'checked-in').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="font-semibold text-primary">
                      {bookings.filter(b => b.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cancelled</span>
                    <span className="font-semibold text-error">
                      {bookings.filter(b => b.status === 'cancelled').length}
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
                      N$ {bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Booking Value</span>
                    <span className="font-semibold">
                      N$ {Math.round(bookings.reduce((sum, b) => sum + b.totalAmount, 0) / bookings.length).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Guests</span>
                    <span className="font-semibold">
                      {bookings.reduce((sum, b) => sum + b.guests, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Guests per Booking</span>
                    <span className="font-semibold">
                      {(bookings.reduce((sum, b) => sum + b.guests, 0) / bookings.length).toFixed(1)}
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
                  <p className="text-sm text-base-content/70">Total Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
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
                    {bookings.filter(b => b.status === 'confirmed').length}
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
                    N$ {bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
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
                  <p className="text-sm text-base-content/70">Total Guests</p>
                  <p className="text-2xl font-bold">
                    {bookings.reduce((sum, b) => sum + b.guests, 0)}
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