'use client';

import React, { useState, useEffect } from 'react';
import { PropertyOverview } from '@/components/property/PropertyOverview';
import { PropertyAnalytics } from '@/components/property/PropertyAnalytics';
import { PropertyBookings } from '@/components/property/PropertyBookings';
import { BuffrTabs, BuffrTabsContent, BuffrTabsList, BuffrTabsTrigger } from '@/components/ui/tabs/BuffrTabs';

/**
 * Refactored Property Dashboard Page
 * 
 * Modular property dashboard using smaller, reusable components
 * Location: app/property-dashboard/page-refactored.tsx
 */

interface PropertyData {
  id: string;
  name: string;
  type: 'hotel' | 'restaurant';
  status: 'active' | 'inactive' | 'maintenance' | 'suspended';
  location: string;
  totalRooms?: number;
  totalTables?: number;
  occupancyRate?: number;
  averageRating?: number;
  lastUpdated: Date;
}

interface Booking {
  id: string;
  guestName: string;
  checkIn: Date;
  checkOut?: Date;
  roomNumber?: string;
  tableNumber?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'checked-in' | 'checked-out';
  amount: number;
  currency: string;
}

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: 'dollar-sign' | 'users' | 'calendar' | 'star' | 'trending-up' | 'trending-down';
  format?: 'currency' | 'percentage' | 'number';
}

export default function PropertyDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);

  useEffect(() => {
    const loadPropertyData = async () => {
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock property data
        const mockProperty: PropertyData = {
          id: 'prop-123',
          name: 'Grand Hotel & Spa',
          type: 'hotel',
          status: 'active',
          location: 'Windhoek, Namibia',
          totalRooms: 120,
          occupancyRate: 87.5,
          averageRating: 4.8,
          lastUpdated: new Date()
        };
        
        setProperty(mockProperty);

        // Mock bookings data
        const mockBookings: Booking[] = [
          {
            id: '1',
            guestName: 'John Doe',
            checkIn: new Date('2024-02-15T15:00:00'),
            checkOut: new Date('2024-02-17T11:00:00'),
            roomNumber: '205',
            status: 'confirmed',
            amount: 450,
            currency: 'NAD'
          },
          {
            id: '2',
            guestName: 'Jane Smith',
            checkIn: new Date('2024-02-16T14:00:00'),
            checkOut: new Date('2024-02-18T10:00:00'),
            roomNumber: '312',
            status: 'checked-in',
            amount: 380,
            currency: 'NAD'
          },
          {
            id: '3',
            guestName: 'Mike Johnson',
            checkIn: new Date('2024-02-17T16:00:00'),
            roomNumber: '108',
            status: 'pending',
            amount: 320,
            currency: 'NAD'
          }
        ];
        
        setBookings(mockBookings);

        // Mock metrics data
        const mockMetrics: MetricCard[] = [
          {
            title: 'Total Revenue',
            value: 125430,
            change: 12.5,
            changeType: 'increase',
            icon: 'dollar-sign',
            format: 'currency'
          },
          {
            title: 'Occupancy Rate',
            value: 87.5,
            change: 5.2,
            changeType: 'increase',
            icon: 'trending-up',
            format: 'percentage'
          },
          {
            title: 'Total Bookings',
            value: 342,
            change: 8.1,
            changeType: 'increase',
            icon: 'calendar',
            format: 'number'
          },
          {
            title: 'Average Rating',
            value: 4.8,
            change: 0.3,
            changeType: 'increase',
            icon: 'star',
            format: 'number'
          }
        ];
        
        setMetrics(mockMetrics);

      } catch (error) {
        console.error('Error loading property data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPropertyData();
  }, []);

  const handleEditProperty = () => {
    console.log('Edit property');
    // Navigate to edit page
  };

  const handleViewDetails = () => {
    console.log('View property details');
    // Navigate to details page
  };

  const handleViewAllBookings = () => {
    console.log('View all bookings');
    // Navigate to bookings page
  };

  const handleViewBooking = (bookingId: string) => {
    console.log('View booking:', bookingId);
    // Navigate to booking details
  };

  const handleTimeRangeChange = (range: '7d' | '30d' | '90d' | '1y') => {
    setTimeRange(range);
    // Reload metrics for new time range
    console.log('Time range changed to:', range);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property dashboard...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Overview */}
        <PropertyOverview
          propertyName={property.name}
          propertyType={property.type}
          status={property.status}
          location={property.location}
          totalRooms={property.totalRooms}
          totalTables={property.totalTables}
          occupancyRate={property.occupancyRate}
          averageRating={property.averageRating}
          lastUpdated={property.lastUpdated}
          onEdit={handleEditProperty}
          onViewDetails={handleViewDetails}
          className="mb-6"
        />

        {/* Tabs */}
        <BuffrTabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <BuffrTabsList className="grid w-full grid-cols-3">
            <BuffrTabsTrigger value="overview">Overview</BuffrTabsTrigger>
            <BuffrTabsTrigger value="analytics">Analytics</BuffrTabsTrigger>
            <BuffrTabsTrigger value="bookings">Bookings</BuffrTabsTrigger>
          </BuffrTabsList>

          {/* Overview Tab */}
          <BuffrTabsContent value="overview" className="space-y-6">
            <PropertyAnalytics
              metrics={metrics}
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
            />
            <PropertyBookings
              bookings={bookings}
              propertyType={property.type}
              maxItems={5}
              onViewAll={handleViewAllBookings}
              onViewBooking={handleViewBooking}
            />
          </BuffrTabsContent>

          {/* Analytics Tab */}
          <BuffrTabsContent value="analytics">
            <PropertyAnalytics
              metrics={metrics}
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
            />
          </BuffrTabsContent>

          {/* Bookings Tab */}
          <BuffrTabsContent value="bookings">
            <PropertyBookings
              bookings={bookings}
              propertyType={property.type}
              maxItems={10}
              onViewAll={handleViewAllBookings}
              onViewBooking={handleViewBooking}
            />
          </BuffrTabsContent>
        </BuffrTabs>
      </div>
    </div>
  );
}