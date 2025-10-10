'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Phone,
  Mail,
  Star,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface Property {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'active' | 'inactive' | 'pending';
  logo_url?: string;
  description?: string;
  contact: {
    phone: string;
    email: string;
  };
  stats: {
    rooms: number;
    occupancy: number;
    revenue: number;
  };
  created_at: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      // This would fetch from your API
      // const response = await fetch('/api/properties');
      // const data = await response.json();
      
      // Mock data for now
      const mockProperties: Property[] = [
        {
          id: '1',
          name: 'Etuna Guesthouse and Tours',
          type: 'guesthouse',
          location: 'Ongwediva, Namibia',
          status: 'active',
          logo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
          description: 'Luxury guesthouse with tour services',
          contact: {
            phone: '+264 65 231 177',
            email: 'bookings@etunaguesthouse.com'
          },
          stats: {
            rooms: 25,
            occupancy: 78,
            revenue: 125000
          },
          created_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Windhoek City Hotel',
          type: 'hotel',
          location: 'Windhoek, Namibia',
          status: 'active',
          logo_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2070&auto=format&fit=crop',
          description: 'Modern city center hotel',
          contact: {
            phone: '+264 61 123 456',
            email: 'info@windhoekhotel.com'
          },
          stats: {
            rooms: 50,
            occupancy: 85,
            revenue: 250000
          },
          created_at: '2024-02-01T00:00:00Z'
        },
        {
          id: '3',
          name: 'Swakopmund Beach Resort',
          type: 'resort',
          location: 'Swakopmund, Namibia',
          status: 'pending',
          logo_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop',
          description: 'Beachfront resort with ocean views',
          contact: {
            phone: '+264 64 987 654',
            email: 'reservations@swakopresort.com'
          },
          stats: {
            rooms: 75,
            occupancy: 0,
            revenue: 0
          },
          created_at: '2024-03-01T00:00:00Z'
        }
      ];
      
      setProperties(mockProperties);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'badge-success',
      inactive: 'badge-warning',
      pending: 'badge-info'
    };
    return `badge ${statusClasses[status as keyof typeof statusClasses]}`;
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending Review'
    };
    return statusTexts[status as keyof typeof statusTexts];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nude-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nude-600 mx-auto mb-4"></div>
          <p className="text-nude-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nude-50">
      <PageHeader
        title="Properties"
        description="Manage all your hospitality properties"
        icon={<Building2 className="h-6 w-6" />}
        actions={
          <Link href="/properties/register">
            <ActionButton variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </ActionButton>
          </Link>
        }
      />

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-nude-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="select select-bordered"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-nude-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-nude-600 mb-2">No Properties Found</h3>
            <p className="text-nude-500 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first property'
              }
            </p>
            <Link href="/properties/register">
              <Button variant="default">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Property
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {property.logo_url && (
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-lg">
                            <img src={property.logo_url} alt={property.name} />
                          </div>
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{property.name}</CardTitle>
                        <p className="text-sm text-nude-600 capitalize">{property.type}</p>
                      </div>
                    </div>
                    <div className="dropdown dropdown-end">
                      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                        <MoreVertical className="w-4 h-4" />
                      </div>
                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
                        <li><Link href={`/properties/${property.id}`}><Eye className="w-4 h-4" />View</Link></li>
                        <li><Link href={`/properties/${property.id}/settings`}><Edit className="w-4 h-4" />Edit</Link></li>
                        <li><button><Trash2 className="w-4 h-4" />Delete</button></li>
                      </ul>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-nude-600">
                      <MapPin className="w-4 h-4" />
                      {property.location}
                    </div>
                    
                    {property.description && (
                      <p className="text-sm text-nude-700 line-clamp-2">
                        {property.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className={`badge ${getStatusBadge(property.status)}`}>
                        {getStatusText(property.status)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-nude-600">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span>4.8</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-nude-800">{property.stats.rooms}</p>
                        <p className="text-xs text-nude-600">Rooms</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-nude-800">{property.stats.occupancy}%</p>
                        <p className="text-xs text-nude-600">Occupancy</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-nude-800">${property.stats.revenue.toLocaleString()}</p>
                        <p className="text-xs text-nude-600">Revenue</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/properties/${property.id}`} className="flex-1">
                        <Button variant="default" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Dashboard
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}