"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Bed,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Star,
  UserCheck
} from 'lucide-react';

export default function EtunaGuestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample guest data
  const guests = [
    {
      id: 'GUEST001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+264 81 123 4567',
      nationality: 'South African',
      checkInDate: '2024-01-20',
      checkOutDate: '2024-01-23',
      roomNumber: '101',
      status: 'checked-in',
      loyaltyPoints: 1250,
      totalStays: 3,
      lastVisit: '2023-12-15',
      preferences: ['Vegetarian', 'Late check-out'],
      specialRequests: 'Quiet room preferred'
    },
    {
      id: 'GUEST002',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+264 81 234 5678',
      nationality: 'Spanish',
      checkInDate: '2024-01-21',
      checkOutDate: '2024-01-24',
      roomNumber: '205',
      status: 'pending',
      loyaltyPoints: 800,
      totalStays: 1,
      lastVisit: null,
      preferences: ['Non-smoking', 'Ground floor'],
      specialRequests: 'Vegetarian breakfast'
    },
    {
      id: 'GUEST003',
      name: 'David Johnson',
      email: 'david.johnson@email.com',
      phone: '+264 81 345 6789',
      nationality: 'American',
      checkInDate: '2024-01-22',
      checkOutDate: '2024-01-25',
      roomNumber: '102',
      status: 'checked-in',
      loyaltyPoints: 2100,
      totalStays: 5,
      lastVisit: '2023-11-20',
      preferences: ['Business center access', 'WiFi'],
      specialRequests: 'Extra bed for child'
    },
    {
      id: 'GUEST004',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+264 81 456 7890',
      nationality: 'British',
      checkInDate: '2024-01-19',
      checkOutDate: '2024-01-21',
      roomNumber: '301',
      status: 'completed',
      loyaltyPoints: 950,
      totalStays: 2,
      lastVisit: '2024-01-21',
      preferences: ['Romantic package', 'Spa access'],
      specialRequests: 'Anniversary celebration'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in':
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
      case 'checked-in':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'completed':
        return UserCheck;
      case 'cancelled':
        return XCircle;
      default:
        return Users;
    }
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.roomNumber.includes(searchTerm) ||
                         guest.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || guest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Guest Management"
        description="Manage guest profiles, check-ins, and guest services for Etuna Guesthouse"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Etuna Management', href: '/protected/etuna' },
          { label: 'Guest Management', href: '/protected/etuna/guests' }
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
                      placeholder="Search guests..."
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
                  New Guest
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Guests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredGuests.map((guest) => {
            const StatusIcon = getStatusIcon(guest.status);
            return (
              <div key={guest.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="card-title text-lg">{guest.name}</h3>
                      <p className="text-sm text-base-content/70">Guest ID: {guest.id}</p>
                    </div>
                    <div className={`badge ${getStatusColor(guest.status)}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-sm">{guest.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-sm">{guest.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-sm">{guest.nationality}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Bed className="w-4 h-4 text-primary" />
                      <span className="text-sm">Room {guest.roomNumber}</span>
                    </div>
                  </div>

                  <div className="divider my-4"></div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-base-content/70">Check-in</p>
                      <p className="font-semibold text-sm">{guest.checkInDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/70">Check-out</p>
                      <p className="font-semibold text-sm">{guest.checkOutDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-warning" />
                      <span className="text-sm font-semibold">{guest.loyaltyPoints} points</span>
                    </div>
                    <div className="text-sm text-base-content/70">
                      {guest.totalStays} stays
                    </div>
                  </div>

                  {guest.preferences.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-base-content/70 mb-2">Preferences</p>
                      <div className="flex flex-wrap gap-1">
                        {guest.preferences.map((pref, index) => (
                          <span key={index} className="badge badge-outline badge-sm">
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {guest.specialRequests && (
                    <div className="mb-4">
                      <p className="text-xs text-base-content/70 mb-1">Special Requests</p>
                      <p className="text-sm bg-base-200 p-2 rounded">
                        {guest.specialRequests}
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Guests</p>
                  <p className="text-2xl font-bold">{guests.length}</p>
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
                  <p className="text-sm text-base-content/70">Checked-in</p>
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
                  <p className="text-sm text-base-content/70">Pending Check-in</p>
                  <p className="text-2xl font-bold">1</p>
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
                  <p className="text-sm text-base-content/70">Loyalty Members</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}