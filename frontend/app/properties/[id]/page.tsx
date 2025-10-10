'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Bed, 
  Utensils, 
  Car, 
  DollarSign, 
  Mail, 
  UserCheck, 
  Target, 
  Megaphone, 
  FileText, 
  Receipt, 
  Settings,
  TrendingUp,
  Activity,
  Star,
  Clock,
  MapPin,
  Building2,
  Phone
} from 'lucide-react';
import Link from 'next/link';

interface Property {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'active' | 'inactive' | 'pending';
  logo_url?: string;
  description?: string;
  amenities: string[];
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  stats: {
    totalRooms: number;
    occupancyRate: number;
    revenue: number;
    bookings: number;
  };
}

export default function PropertyDashboardPage() {
  const params = useParams();
  const propertyId = params?.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch property data based on ID
    fetchPropertyData(propertyId);
  }, [propertyId]);

  const fetchPropertyData = async (id: string) => {
    try {
      // This would fetch from your API
      // const response = await fetch(`/api/properties/${id}`);
      // const data = await response.json();
      
      // Mock data for now
      const mockProperty: Property = {
        id,
        name: `Property ${id}`,
        type: 'hotel',
        location: 'Windhoek, Namibia',
        status: 'active',
        logo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        description: 'Luxury hospitality experience',
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar'],
        contact: {
          phone: '+264 65 231 177',
          email: `contact@property${id}.com`,
          website: `https://property${id}.com`
        },
        stats: {
          totalRooms: 25,
          occupancyRate: 78,
          revenue: 125000,
          bookings: 156
        }
      };
      
      setProperty(mockProperty);
    } catch (error) {
      console.error('Failed to fetch property data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nude-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nude-600 mx-auto mb-4"></div>
          <p className="text-nude-600">Loading property dashboard...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-nude-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-nude-800 mb-4">Property Not Found</h1>
          <p className="text-nude-600 mb-6">The property you're looking for doesn't exist.</p>
          <Link href="/properties" className="btn btn-primary">
            View All Properties
          </Link>
        </div>
      </div>
    );
  }

  // Navigation items for property management
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, href: `/properties/${propertyId}` },
    { id: 'rooms', label: 'Rooms', icon: Bed, href: `/properties/${propertyId}/rooms` },
    { id: 'bookings', label: 'Bookings', icon: Calendar, href: `/properties/${propertyId}/bookings` },
    { id: 'restaurant', label: 'Restaurant', icon: Utensils, href: `/properties/${propertyId}/restaurant` },
    { id: 'services', label: 'Services', icon: Car, href: `/properties/${propertyId}/services` },
    { id: 'guests', label: 'Guests', icon: Users, href: `/properties/${propertyId}/guests` },
    { id: 'staff', label: 'Staff', icon: UserCheck, href: `/properties/${propertyId}/staff` },
    { id: 'marketing', label: 'Marketing', icon: Megaphone, href: `/properties/${propertyId}/marketing` },
    { id: 'reports', label: 'Reports', icon: FileText, href: `/properties/${propertyId}/reports` },
    { id: 'finance', label: 'Finance', icon: DollarSign, href: `/properties/${propertyId}/finance` },
    { id: 'settings', label: 'Settings', icon: Settings, href: `/properties/${propertyId}/settings` },
  ];

  return (
    <div className="min-h-screen bg-nude-50">
      {/* Header */}
      <PageHeader
        title={property.name}
        description={`${property.type.charAt(0).toUpperCase() + property.type.slice(1)} Management Dashboard`}
        icon={<Building2 className="h-6 w-6" />}
        breadcrumbs={[
          { label: 'Properties', href: '/properties' },
          { label: property.name, href: `/properties/${propertyId}`, current: true }
        ]}
        actions={
          <div className="flex gap-2">
            <ActionButton variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </ActionButton>
            <ActionButton variant="default">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Reports
            </ActionButton>
          </div>
        }
      />

      <div className="container mx-auto px-4 py-8">
        {/* Property Status & Info */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {property.logo_url && (
                <div className="avatar">
                  <div className="w-24 h-24 rounded-xl">
                    <img src={property.logo_url} alt={property.name} />
                  </div>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-nude-800">{property.name}</h2>
                  <div className={`badge ${property.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                    {property.status}
                  </div>
                </div>
                <p className="text-nude-600 mb-4">{property.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-nude-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {property.contact.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {property.contact.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-nude-600">Total Rooms</p>
                  <p className="text-2xl font-bold text-nude-800">{property.stats.totalRooms}</p>
                </div>
                <Bed className="w-8 h-8 text-nude-400" />
              </div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-nude-600">Occupancy Rate</p>
                  <p className="text-2xl font-bold text-nude-800">{property.stats.occupancyRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-nude-400" />
              </div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-nude-600">Revenue</p>
                  <p className="text-2xl font-bold text-nude-800">${property.stats.revenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-nude-400" />
              </div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-nude-600">Bookings</p>
                  <p className="text-2xl font-bold text-nude-800">{property.stats.bookings}</p>
                </div>
                <Calendar className="w-8 h-8 text-nude-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="card-body text-center">
                  <item.icon className="w-12 h-12 text-nude-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-nude-800">{item.label}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}