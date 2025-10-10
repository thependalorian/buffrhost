"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Car, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  DollarSign,
  Star,
  MapPin,
  Calendar,
  Camera,
  Mountain,
  TreePine,
  Waves
} from 'lucide-react';

export default function EtunaToursPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('bookings');

  // Sample tour booking data
  const tourBookings = [
    {
      id: 'TOUR001',
      tourName: 'Etosha National Park Safari',
      guestName: 'John Smith',
      roomNumber: '101',
      date: '2024-01-22',
      time: '06:00',
      duration: 'Full Day',
      participants: 2,
      totalAmount: 2800,
      status: 'confirmed',
      pickupLocation: 'Etuna Guesthouse',
      specialRequests: 'Vegetarian lunch',
      guide: 'Peter Mwangi',
      vehicle: 'Toyota Land Cruiser'
    },
    {
      id: 'TOUR002',
      tourName: 'Sossusvlei Dunes Tour',
      guestName: 'Maria Garcia',
      roomNumber: '205',
      date: '2024-01-23',
      time: '05:30',
      duration: 'Full Day',
      participants: 1,
      totalAmount: 1800,
      status: 'pending',
      pickupLocation: 'Etuna Guesthouse',
      specialRequests: 'Photography tour',
      guide: 'Sarah van der Merwe',
      vehicle: 'Toyota Hilux'
    },
    {
      id: 'TOUR003',
      tourName: 'Windhoek City Tour',
      guestName: 'David Johnson',
      roomNumber: '102',
      date: '2024-01-21',
      time: '09:00',
      duration: 'Half Day',
      participants: 4,
      totalAmount: 1200,
      status: 'completed',
      pickupLocation: 'Etuna Guesthouse',
      specialRequests: 'Historical sites focus',
      guide: 'Michael Brown',
      vehicle: 'Minibus'
    },
    {
      id: 'TOUR004',
      tourName: 'Swakopmund Adventure',
      guestName: 'Sarah Wilson',
      roomNumber: '301',
      date: '2024-01-24',
      time: '07:00',
      duration: 'Full Day',
      participants: 2,
      totalAmount: 2400,
      status: 'confirmed',
      pickupLocation: 'Etuna Guesthouse',
      specialRequests: 'Sandboarding included',
      guide: 'Anna Schmidt',
      vehicle: 'Toyota Land Cruiser'
    }
  ];

  // Sample tour packages data
  const tourPackages = [
    {
      id: 'PKG001',
      name: 'Etosha National Park Safari',
      description: 'Full day safari to see elephants, lions, and other wildlife',
      duration: 'Full Day (12 hours)',
      price: 1400,
      maxParticipants: 8,
      includes: ['Transport', 'Guide', 'Lunch', 'Park Fees', 'Water'],
      highlights: ['Wildlife Viewing', 'Photography', 'Game Drives'],
      difficulty: 'Easy',
      season: 'Year Round',
      rating: 4.9,
      image: '/images/tours/etosha.jpg',
      isAvailable: true
    },
    {
      id: 'PKG002',
      name: 'Sossusvlei Dunes Tour',
      description: 'Visit the famous red sand dunes and Deadvlei',
      duration: 'Full Day (14 hours)',
      price: 1800,
      maxParticipants: 6,
      includes: ['Transport', 'Guide', 'Breakfast', 'Lunch', 'Park Fees'],
      highlights: ['Dune Climbing', 'Photography', 'Desert Landscape'],
      difficulty: 'Moderate',
      season: 'Year Round',
      rating: 4.8,
      image: '/images/tours/sossusvlei.jpg',
      isAvailable: true
    },
    {
      id: 'PKG003',
      name: 'Windhoek City Tour',
      description: 'Explore the capital city and its historical sites',
      duration: 'Half Day (4 hours)',
      price: 300,
      maxParticipants: 12,
      includes: ['Transport', 'Guide', 'City Map'],
      highlights: ['Historical Sites', 'Local Markets', 'Architecture'],
      difficulty: 'Easy',
      season: 'Year Round',
      rating: 4.6,
      image: '/images/tours/windhoek.jpg',
      isAvailable: true
    },
    {
      id: 'PKG004',
      name: 'Swakopmund Adventure',
      description: 'Coastal adventure with sandboarding and quad biking',
      duration: 'Full Day (10 hours)',
      price: 1200,
      maxParticipants: 8,
      includes: ['Transport', 'Guide', 'Equipment', 'Lunch'],
      highlights: ['Sandboarding', 'Quad Biking', 'Coastal Views'],
      difficulty: 'Moderate',
      season: 'Year Round',
      rating: 4.7,
      image: '/images/tours/swakopmund.jpg',
      isAvailable: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'completed':
        return 'text-info bg-info/10';
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
      case 'completed':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      default:
        return Car;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'badge-success';
      case 'Moderate':
        return 'badge-warning';
      case 'Hard':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getTourIcon = (tourName: string) => {
    if (tourName.includes('Etosha') || tourName.includes('Safari')) return Mountain;
    if (tourName.includes('Sossusvlei') || tourName.includes('Dunes')) return TreePine;
    if (tourName.includes('Swakopmund') || tourName.includes('Coastal')) return Waves;
    return Camera;
  };

  const filteredBookings = tourBookings.filter(booking => {
    const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.roomNumber.includes(searchTerm) ||
                         booking.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'packages', label: 'Tour Packages', icon: Car },
    { id: 'analytics', label: 'Analytics', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Tours & Activities"
        description="Manage tour bookings, packages, and activities for Etuna Guesthouse"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Etuna Management', href: '/protected/etuna' },
          { label: 'Tours & Activities', href: '/protected/etuna/tours' }
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
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
          </div>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <>
            {/* Action Bar */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="form-control">
                      <div className="input-group">
                        <input
                          type="text"
                          placeholder="Search bookings..."
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
                      New Booking
                    </ActionButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {filteredBookings.map((booking) => {
                const StatusIcon = getStatusIcon(booking.status);
                const TourIcon = getTourIcon(booking.tourName);
                return (
                  <div key={booking.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="card-title text-lg">{booking.tourName}</h3>
                          <p className="text-sm text-base-content/70">Booking {booking.id}</p>
                          <p className="text-sm font-semibold">{booking.guestName}</p>
                          <p className="text-sm text-base-content/70">Room {booking.roomNumber}</p>
                        </div>
                        <div className={`badge ${getStatusColor(booking.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm">{booking.date}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm">{booking.time} ({booking.duration})</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-sm">{booking.participants} participants</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="text-sm">{booking.pickupLocation}</span>
                        </div>
                      </div>

                      <div className="divider my-4"></div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Guide</p>
                          <p className="font-semibold text-sm">{booking.guide}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Vehicle</p>
                          <p className="font-semibold text-sm">{booking.vehicle}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold">Total Amount</span>
                        <span className="text-lg font-bold text-success">N$ {booking.totalAmount}</span>
                      </div>

                      {booking.specialRequests && (
                        <div className="mb-4">
                          <p className="text-xs text-base-content/70 mb-1">Special Requests</p>
                          <p className="text-sm bg-base-200 p-2 rounded">
                            {booking.specialRequests}
                          </p>
                        </div>
                      )}

                      <div className="card-actions justify-end">
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
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tourPackages.map((pkg) => {
              const TourIcon = getTourIcon(pkg.name);
              return (
                <div key={pkg.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="card-title text-lg">{pkg.name}</h3>
                        <p className="text-sm text-base-content/70">{pkg.duration}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-warning" />
                        <span className="text-sm font-semibold">{pkg.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm mb-4">{pkg.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-base-content/70">Price per Person</p>
                        <p className="font-semibold">N$ {pkg.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Max Participants</p>
                        <p className="font-semibold">{pkg.maxParticipants}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-base-content/70 mb-2">Highlights</p>
                      <div className="flex flex-wrap gap-1">
                        {pkg.highlights.map((highlight, index) => (
                          <span key={index} className="badge badge-outline badge-sm">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-base-content/70 mb-2">Includes</p>
                      <div className="flex flex-wrap gap-1">
                        {pkg.includes.map((item, index) => (
                          <span key={index} className="badge badge-primary badge-sm">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className={`badge ${getDifficultyColor(pkg.difficulty)}`}>
                        {pkg.difficulty}
                      </span>
                      <span className="text-sm text-base-content/70">{pkg.season}</span>
                    </div>

                    <div className="card-actions justify-end">
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
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-blue-500 text-white">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/70">Bookings Today</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-green-500 text-white">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/70">Revenue Today</p>
                    <p className="text-2xl font-bold">N$ 8,200</p>
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
                    <p className="text-sm text-base-content/70">Participants</p>
                    <p className="text-2xl font-bold">9</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-purple-500 text-white">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/70">Avg Rating</p>
                    <p className="text-2xl font-bold">4.8</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}