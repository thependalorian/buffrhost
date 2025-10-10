"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Star,
  Users,
  Bed,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  TreePine,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function HospitalityPropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('properties');

  // Sample properties data
  const properties = [
    {
      id: 'PROP001',
      name: 'Etuna Guesthouse',
      type: 'Guesthouse',
      status: 'active',
      location: 'Windhoek, Namibia',
      address: '123 Wildlife Drive, Windhoek',
      rooms: 25,
      occupancy: 78,
      rating: 4.8,
      priceRange: 'N$ 800 - N$ 2,500',
      amenities: ['WiFi', 'Parking', 'Restaurant', 'Pool', 'Gym', 'Spa'],
      description: 'Luxury guesthouse in the heart of Windhoek with wildlife tours',
      manager: 'Peter Mwangi',
      lastUpdated: '2024-01-20',
      revenue: 125430,
      bookings: 156
    },
    {
      id: 'PROP002',
      name: 'Namibia Safari Lodge',
      type: 'Lodge',
      status: 'active',
      location: 'Etosha National Park, Namibia',
      address: '456 Safari Road, Etosha',
      rooms: 40,
      occupancy: 85,
      rating: 4.9,
      priceRange: 'N$ 1,200 - N$ 3,500',
      amenities: ['WiFi', 'Parking', 'Restaurant', 'Pool', 'Safari Tours', 'Wildlife Viewing'],
      description: 'Premium safari lodge with direct access to Etosha National Park',
      manager: 'Sarah van der Merwe',
      lastUpdated: '2024-01-19',
      revenue: 198750,
      bookings: 203
    },
    {
      id: 'PROP003',
      name: 'Coastal Retreat',
      type: 'Resort',
      status: 'maintenance',
      location: 'Swakopmund, Namibia',
      address: '789 Ocean View, Swakopmund',
      rooms: 60,
      occupancy: 45,
      rating: 4.6,
      priceRange: 'N$ 1,500 - N$ 4,000',
      amenities: ['WiFi', 'Parking', 'Restaurant', 'Pool', 'Beach Access', 'Water Sports'],
      description: 'Beachfront resort with ocean views and water activities',
      manager: 'Michael Brown',
      lastUpdated: '2024-01-18',
      revenue: 89200,
      bookings: 89
    },
    {
      id: 'PROP004',
      name: 'Mountain View Inn',
      type: 'Inn',
      status: 'inactive',
      location: 'Otjiwarongo, Namibia',
      address: '321 Mountain Road, Otjiwarongo',
      rooms: 15,
      occupancy: 0,
      rating: 4.2,
      priceRange: 'N$ 600 - N$ 1,800',
      amenities: ['WiFi', 'Parking', 'Restaurant', 'Hiking Trails'],
      description: 'Cozy mountain inn with hiking trails and scenic views',
      manager: 'Anna Schmidt',
      lastUpdated: '2024-01-15',
      revenue: 0,
      bookings: 0
    }
  ];

  const propertyTypes = [
    { name: 'Guesthouse', count: 1, color: 'bg-blue-500' },
    { name: 'Lodge', count: 1, color: 'bg-green-500' },
    { name: 'Resort', count: 1, color: 'bg-purple-500' },
    { name: 'Inn', count: 1, color: 'bg-orange-500' },
    { name: 'Hotel', count: 0, color: 'bg-red-500' },
    { name: 'Camp', count: 0, color: 'bg-yellow-500' }
  ];

  const amenities = [
    { name: 'WiFi', icon: Wifi, count: 4 },
    { name: 'Parking', icon: Car, count: 4 },
    { name: 'Restaurant', icon: Coffee, count: 4 },
    { name: 'Pool', icon: Waves, count: 3 },
    { name: 'Gym', icon: Dumbbell, count: 1 },
    { name: 'Spa', icon: TreePine, count: 1 },
    { name: 'Safari Tours', icon: TreePine, count: 1 },
    { name: 'Beach Access', icon: Waves, count: 1 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'maintenance':
        return 'text-warning bg-warning/10';
      case 'inactive':
        return 'text-error bg-error/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'maintenance':
        return AlertCircle;
      case 'inactive':
        return Clock;
      default:
        return Building2;
    }
  };

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'types', label: 'Types', icon: Building2 },
    { id: 'amenities', label: 'Amenities', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Hospitality Properties"
        description="Manage properties, types, amenities, and analytics for the hospitality ecosystem"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Hospitality', href: '/hospitality' },
          { label: 'Properties', href: '/hospitality/properties' }
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
                  Add Property
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search properties..."
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
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredProperties.map((property) => {
                const StatusIcon = getStatusIcon(property.status);
                return (
                  <div key={property.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="card-title text-lg">{property.name}</h3>
                          <p className="text-sm text-base-content/70">{property.type}</p>
                          <p className="text-sm font-semibold">{property.location}</p>
                        </div>
                        <div className={`badge ${getStatusColor(property.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="text-sm">{property.address}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Bed className="w-4 h-4 text-primary" />
                          <span className="text-sm">{property.rooms} rooms</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-sm">{property.occupancy}% occupancy</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Star className="w-4 h-4 text-warning" />
                          <span className="text-sm">{property.rating}/5 rating</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Revenue</p>
                          <p className="font-semibold">N$ {property.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Bookings</p>
                          <p className="font-semibold">{property.bookings}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-1">
                          {property.amenities.slice(0, 4).map((amenity, index) => (
                            <span key={index} className="badge badge-outline badge-sm">
                              {amenity}
                            </span>
                          ))}
                          {property.amenities.length > 4 && (
                            <span className="badge badge-outline badge-sm">
                              +{property.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-1">Description</p>
                        <p className="text-sm bg-base-200 p-2 rounded line-clamp-2">{property.description}</p>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-base-content/70">
                          Manager: {property.manager}
                        </div>
                        <div className="text-sm text-base-content/70">
                          Updated: {property.lastUpdated}
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

        {/* Property Types Tab */}
        {activeTab === 'types' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {propertyTypes.map((type, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-lg ${type.color} text-white`}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="card-title text-lg">{type.name}</h3>
                      <p className="text-sm text-base-content/70">{type.count} properties</p>
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

        {/* Amenities Tab */}
        {activeTab === 'amenities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {amenities.map((amenity, index) => {
              const AmenityIcon = amenity.icon;
              return (
                <div key={index} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <AmenityIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="card-title text-lg">{amenity.name}</h3>
                        <p className="text-sm text-base-content/70">{amenity.count} properties</p>
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
              );
            })}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Property Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Properties</span>
                    <span className="font-semibold">{properties.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Properties</span>
                    <span className="font-semibold text-success">
                      {properties.filter(p => p.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Occupancy</span>
                    <span className="font-semibold">
                      {Math.round(properties.reduce((sum, p) => sum + p.occupancy, 0) / properties.length)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Rating</span>
                    <span className="font-semibold">
                      {(properties.reduce((sum, p) => sum + p.rating, 0) / properties.length).toFixed(1)}/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Revenue</span>
                    <span className="font-semibold">
                      N$ {properties.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Property Types Distribution</h3>
                <div className="space-y-4">
                  {propertyTypes.map((type, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{type.name}</span>
                        <span className="font-semibold">{type.count}</span>
                      </div>
                      <progress 
                        className="progress progress-primary w-full" 
                        value={(type.count / properties.length) * 100} 
                        max="100"
                      ></progress>
                    </div>
                  ))}
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
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Properties</p>
                  <p className="text-2xl font-bold">{properties.length}</p>
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
                  <p className="text-sm text-base-content/70">Active Properties</p>
                  <p className="text-2xl font-bold">
                    {properties.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Bed className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Rooms</p>
                  <p className="text-2xl font-bold">
                    {properties.reduce((sum, p) => sum + p.rooms, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    N$ {properties.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
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