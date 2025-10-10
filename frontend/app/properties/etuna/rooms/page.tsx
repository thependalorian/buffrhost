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
  XCircle,
  Clock,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Shield,
  Star,
  Users,
  Calendar
} from 'lucide-react';

export default function EtunaRoomsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Sample room data
  const rooms = [
    {
      id: 'ROOM001',
      number: '101',
      type: 'Deluxe Double',
      floor: 1,
      status: 'occupied',
      capacity: 2,
      price: 1500,
      amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'],
      lastCleaned: '2024-01-19',
      nextMaintenance: '2024-02-15',
      guestName: 'John Smith',
      checkIn: '2024-01-20',
      checkOut: '2024-01-23',
      occupancyRate: 85
    },
    {
      id: 'ROOM002',
      number: '102',
      type: 'Family Suite',
      floor: 1,
      status: 'occupied',
      capacity: 4,
      price: 2400,
      amenities: ['WiFi', 'AC', 'TV', 'Kitchenette', 'Sofa Bed'],
      lastCleaned: '2024-01-19',
      nextMaintenance: '2024-02-20',
      guestName: 'David Johnson',
      checkIn: '2024-01-22',
      checkOut: '2024-01-25',
      occupancyRate: 92
    },
    {
      id: 'ROOM003',
      number: '205',
      type: 'Standard Single',
      floor: 2,
      status: 'available',
      capacity: 1,
      price: 900,
      amenities: ['WiFi', 'AC', 'TV'],
      lastCleaned: '2024-01-20',
      nextMaintenance: '2024-02-10',
      guestName: null,
      checkIn: null,
      checkOut: null,
      occupancyRate: 78
    },
    {
      id: 'ROOM004',
      number: '301',
      type: 'Deluxe Double',
      floor: 3,
      status: 'maintenance',
      capacity: 2,
      price: 1500,
      amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Sea View'],
      lastCleaned: '2024-01-18',
      nextMaintenance: '2024-01-25',
      guestName: null,
      checkIn: null,
      checkOut: null,
      occupancyRate: 65
    },
    {
      id: 'ROOM005',
      number: '302',
      type: 'Executive Suite',
      floor: 3,
      status: 'available',
      capacity: 2,
      price: 3200,
      amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Sea View', 'Jacuzzi'],
      lastCleaned: '2024-01-20',
      nextMaintenance: '2024-03-01',
      guestName: null,
      checkIn: null,
      checkOut: null,
      occupancyRate: 45
    },
    {
      id: 'ROOM006',
      number: '103',
      type: 'Standard Double',
      floor: 1,
      status: 'cleaning',
      capacity: 2,
      price: 1200,
      amenities: ['WiFi', 'AC', 'TV'],
      lastCleaned: '2024-01-21',
      nextMaintenance: '2024-02-05',
      guestName: null,
      checkIn: null,
      checkOut: null,
      occupancyRate: 88
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-success bg-success/10';
      case 'occupied':
        return 'text-info bg-info/10';
      case 'maintenance':
        return 'text-warning bg-warning/10';
      case 'cleaning':
        return 'text-primary bg-primary/10';
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
        return Shield;
      case 'cleaning':
        return Clock;
      case 'out-of-order':
        return XCircle;
      default:
        return Bed;
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.includes(searchTerm) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesType = typeFilter === 'all' || room.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'WiFi':
        return Wifi;
      case 'AC':
        return Wind;
      case 'TV':
        return Tv;
      case 'Mini Bar':
        return Coffee;
      case 'Balcony':
        return Star;
      case 'Kitchenette':
        return Coffee;
      case 'Sofa Bed':
        return Bed;
      case 'Sea View':
        return Star;
      case 'Jacuzzi':
        return Star;
      default:
        return Star;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Room Management"
        description="Manage room inventory, status, and maintenance for Etuna Guesthouse"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Etuna Management', href: '/protected/etuna' },
          { label: 'Room Management', href: '/protected/etuna/rooms' }
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
                      placeholder="Search rooms..."
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
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="out-of-order">Out of Order</option>
                </select>
                <select
                  className="select select-bordered w-full md:w-40"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="Standard Single">Standard Single</option>
                  <option value="Standard Double">Standard Double</option>
                  <option value="Deluxe Double">Deluxe Double</option>
                  <option value="Family Suite">Family Suite</option>
                  <option value="Executive Suite">Executive Suite</option>
                </select>
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

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredRooms.map((room) => {
            const StatusIcon = getStatusIcon(room.status);
            return (
              <div key={room.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="card-title text-lg">Room {room.number}</h3>
                      <p className="text-sm text-base-content/70">{room.type}</p>
                      <p className="text-xs text-base-content/50">Floor {room.floor}</p>
                    </div>
                    <div className={`badge ${getStatusColor(room.status)}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-base-content/70">Capacity</p>
                      <p className="font-semibold">{room.capacity} guests</p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/70">Price/Night</p>
                      <p className="font-semibold">N$ {room.price}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-base-content/70 mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.map((amenity, index) => {
                        const AmenityIcon = getAmenityIcon(amenity);
                        return (
                          <span key={index} className="badge badge-outline badge-sm flex items-center gap-1">
                            <AmenityIcon className="w-3 h-3" />
                            {amenity}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {room.status === 'occupied' && room.guestName && (
                    <div className="mb-4 p-3 bg-info/10 rounded-lg">
                      <p className="text-xs text-base-content/70 mb-1">Current Guest</p>
                      <p className="font-semibold text-sm">{room.guestName}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Check-in: {room.checkIn}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Check-out: {room.checkOut}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                    <div>
                      <p className="text-base-content/70">Last Cleaned</p>
                      <p className="font-semibold">{room.lastCleaned}</p>
                    </div>
                    <div>
                      <p className="text-base-content/70">Next Maintenance</p>
                      <p className="font-semibold">{room.nextMaintenance}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-base-content/70">Occupancy Rate</span>
                      <span className="text-xs font-semibold">{room.occupancyRate}%</span>
                    </div>
                    <progress 
                      className="progress progress-primary w-full" 
                      value={room.occupancyRate} 
                      max="100"
                    ></progress>
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
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Occupied</p>
                  <p className="text-2xl font-bold">
                    {rooms.filter(r => r.status === 'occupied').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Maintenance</p>
                  <p className="text-2xl font-bold">
                    {rooms.filter(r => r.status === 'maintenance').length}
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