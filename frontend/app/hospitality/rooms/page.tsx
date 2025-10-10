"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Bed, 
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
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Shield,
  Settings,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function HospitalityRoomsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('rooms');

  // Sample rooms data
  const rooms = [
    {
      id: 'RM001',
      roomNumber: '101',
      roomType: 'Deluxe Double',
      propertyName: 'Etuna Guesthouse',
      floor: 1,
      status: 'available',
      occupancy: 'double',
      maxGuests: 2,
      size: 35,
      basePrice: 1500,
      currentPrice: 1500,
      amenities: ['wifi', 'ac', 'tv', 'minibar'],
      features: ['balcony', 'city-view'],
      lastCleaned: '2024-01-20',
      nextCleaning: '2024-01-22',
      maintenanceStatus: 'good',
      rating: 4.8,
      reviews: 24,
      bookings: 45,
      revenue: 67500,
      description: 'Spacious deluxe double room with modern amenities and city view'
    },
    {
      id: 'RM002',
      roomNumber: '102',
      roomType: 'Family Suite',
      propertyName: 'Etuna Guesthouse',
      floor: 1,
      status: 'occupied',
      occupancy: 'family',
      maxGuests: 4,
      size: 55,
      basePrice: 2200,
      currentPrice: 2200,
      amenities: ['wifi', 'ac', 'tv', 'kitchenette'],
      features: ['balcony', 'garden-view', 'sofa-bed'],
      lastCleaned: '2024-01-18',
      nextCleaning: '2024-01-25',
      maintenanceStatus: 'good',
      rating: 4.9,
      reviews: 18,
      bookings: 32,
      revenue: 70400,
      description: 'Family-friendly suite with kitchenette and garden view'
    },
    {
      id: 'RM003',
      roomNumber: '201',
      roomType: 'Standard Single',
      propertyName: 'Namibia Safari Lodge',
      floor: 2,
      status: 'maintenance',
      occupancy: 'single',
      maxGuests: 1,
      size: 25,
      basePrice: 1200,
      currentPrice: 1200,
      amenities: ['wifi', 'ac', 'tv'],
      features: ['safari-view'],
      lastCleaned: '2024-01-15',
      nextCleaning: '2024-01-23',
      maintenanceStatus: 'maintenance',
      rating: 4.6,
      reviews: 12,
      bookings: 28,
      revenue: 33600,
      description: 'Comfortable single room with safari view'
    },
    {
      id: 'RM004',
      roomNumber: '301',
      roomType: 'Ocean View Suite',
      propertyName: 'Coastal Retreat',
      floor: 3,
      status: 'available',
      occupancy: 'double',
      maxGuests: 2,
      size: 45,
      basePrice: 2800,
      currentPrice: 2800,
      amenities: ['wifi', 'ac', 'tv', 'minibar', 'jacuzzi'],
      features: ['balcony', 'ocean-view', 'private-terrace'],
      lastCleaned: '2024-01-19',
      nextCleaning: '2024-01-21',
      maintenanceStatus: 'excellent',
      rating: 4.9,
      reviews: 31,
      bookings: 38,
      revenue: 106400,
      description: 'Luxurious ocean view suite with private terrace and jacuzzi'
    },
    {
      id: 'RM005',
      roomNumber: '401',
      roomType: 'Budget Twin',
      propertyName: 'Mountain View Inn',
      floor: 4,
      status: 'out-of-order',
      occupancy: 'twin',
      maxGuests: 2,
      size: 30,
      basePrice: 900,
      currentPrice: 900,
      amenities: ['wifi', 'ac'],
      features: ['mountain-view'],
      lastCleaned: '2024-01-10',
      nextCleaning: '2024-01-24',
      maintenanceStatus: 'repair-needed',
      rating: 4.2,
      reviews: 8,
      bookings: 15,
      revenue: 13500,
      description: 'Budget-friendly twin room with mountain view'
    }
  ];

  const roomTypes = [
    { name: 'Deluxe Double', count: 1, color: 'bg-blue-500' },
    { name: 'Family Suite', count: 1, color: 'bg-green-500' },
    { name: 'Standard Single', count: 1, color: 'bg-yellow-500' },
    { name: 'Ocean View Suite', count: 1, color: 'bg-purple-500' },
    { name: 'Budget Twin', count: 1, color: 'bg-orange-500' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-success bg-success/10';
      case 'occupied':
        return 'text-info bg-info/10';
      case 'maintenance':
        return 'text-warning bg-warning/10';
      case 'out-of-order':
        return 'text-error bg-error/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return CheckCircle;
      case 'occupied':
        return Users;
      case 'maintenance':
        return Settings;
      case 'out-of-order':
        return AlertCircle;
      default:
        return Bed;
    }
  };

  const getMaintenanceColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-success bg-success/10';
      case 'good':
        return 'text-info bg-info/10';
      case 'maintenance':
        return 'text-warning bg-warning/10';
      case 'repair-needed':
        return 'text-error bg-error/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return Wifi;
      case 'ac':
        return Wind;
      case 'tv':
        return Tv;
      case 'minibar':
        return Coffee;
      case 'kitchenette':
        return Coffee;
      case 'jacuzzi':
        return Wind;
      default:
        return Shield;
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'rooms', label: 'Rooms', icon: Bed },
    { id: 'types', label: 'Room Types', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'maintenance', label: 'Maintenance', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Room Management"
        description="Manage rooms, room types, maintenance, and room analytics across all properties"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Hospitality', href: '/hospitality' },
          { label: 'Rooms', href: '/hospitality/rooms' }
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
                  Add Room
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search rooms..."
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
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="out-of-order">Out of Order</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredRooms.map((room) => {
                const StatusIcon = getStatusIcon(room.status);
                return (
                  <div key={room.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="card-title text-lg">Room {room.roomNumber}</h3>
                          <p className="text-sm text-base-content/70">{room.roomType}</p>
                          <p className="text-sm font-semibold">{room.propertyName}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(room.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                          </div>
                          <div className={`badge ${getMaintenanceColor(room.maintenanceStatus)}`}>
                            {room.maintenanceStatus.charAt(0).toUpperCase() + room.maintenanceStatus.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-3">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-sm">Max {room.maxGuests} guests</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="text-sm">N$ {room.currentPrice}/night</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm">{room.size}m²</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-1">
                          {room.amenities.map((amenity, index) => {
                            const AmenityIcon = getAmenityIcon(amenity);
                            return (
                              <span key={index} className="badge badge-outline badge-sm">
                                <AmenityIcon className="w-3 h-3 mr-1" />
                                {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Features</p>
                        <div className="flex flex-wrap gap-1">
                          {room.features.map((feature, index) => (
                            <span key={index} className="badge badge-secondary badge-sm">
                              {feature.charAt(0).toUpperCase() + feature.slice(1)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Rating</p>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-warning" />
                            <span className="font-semibold">{room.rating}</span>
                            <span className="text-sm">({room.reviews})</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Bookings</p>
                          <p className="font-semibold">{room.bookings}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-1">Description</p>
                        <p className="text-sm bg-base-200 p-2 rounded">{room.description}</p>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-base-content/70">
                          Revenue: N$ {room.revenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-base-content/70">
                          Next cleaning: {room.nextCleaning}
                        </div>
                      </div>

                      <div className="card-actions justify-end">
                        <button className="btn btn-ghost btn-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Room Types Tab */}
        {activeTab === 'types' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {roomTypes.map((type, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-lg ${type.color} text-white`}>
                      <Bed className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="card-title text-lg">{type.name}</h3>
                      <p className="text-sm text-base-content/70">{type.count} rooms</p>
                    </div>
                  </div>
                  <div className="card-actions justify-end">
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Edit className="w-4 h-4" />
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
                <h3 className="card-title mb-6">Room Performance</h3>
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div key={room.id} className="p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Room {room.roomNumber}</span>
                        <span className="font-semibold">N$ {room.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{room.bookings} bookings</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-warning" />
                          <span>{room.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Room Status Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Available Rooms</span>
                    <span className="font-semibold text-success">
                      {rooms.filter(r => r.status === 'available').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Occupied Rooms</span>
                    <span className="font-semibold text-info">
                      {rooms.filter(r => r.status === 'occupied').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Maintenance Rooms</span>
                    <span className="font-semibold text-warning">
                      {rooms.filter(r => r.status === 'maintenance').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Out of Order</span>
                    <span className="font-semibold text-error">
                      {rooms.filter(r => r.status === 'out-of-order').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Revenue</span>
                    <span className="font-semibold">
                      N$ {rooms.reduce((sum, r) => sum + r.revenue, 0).toLocaleString()}
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
                  <Bed className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Rooms</p>
                  <p className="text-2xl font-bold">{rooms.length}</p>
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
                  <p className="text-sm text-base-content/70">Available</p>
                  <p className="text-2xl font-bold">
                    {rooms.filter(r => r.status === 'available').length}
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
                    N$ {rooms.reduce((sum, r) => sum + r.revenue, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Avg Rating</p>
                  <p className="text-2xl font-bold">
                    {(rooms.reduce((sum, r) => sum + r.rating, 0) / rooms.length).toFixed(1)}
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