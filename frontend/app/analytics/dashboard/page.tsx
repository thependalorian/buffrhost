"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  BarChart3, 
  Search, 
  Filter, 
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Star,
  Eye,
  MousePointer,
  ShoppingCart,
  Bed,
  Utensils,
  Car,
  Activity,
  Target,
  PieChart,
  LineChart,
  Settings
} from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample analytics data
  const overviewMetrics = {
    totalRevenue: 125430,
    totalBookings: 156,
    totalGuests: 312,
    averageRating: 4.8,
    occupancyRate: 78.5,
    revenueGrowth: 12.5,
    bookingGrowth: 8.3,
    guestGrowth: 15.7,
    ratingGrowth: 0.2
  };

  const revenueData = [
    { month: 'Oct 2023', revenue: 112000, bookings: 142 },
    { month: 'Nov 2023', revenue: 118500, bookings: 148 },
    { month: 'Dec 2023', revenue: 135200, bookings: 169 },
    { month: 'Jan 2024', revenue: 125430, bookings: 156 }
  ];

  const propertyPerformance = [
    {
      name: 'Etuna Guesthouse',
      revenue: 85600,
      bookings: 89,
      occupancy: 78,
      rating: 4.8,
      growth: 12.5
    },
    {
      name: 'Namibia Safari Lodge',
      revenue: 24500,
      bookings: 34,
      occupancy: 85,
      rating: 4.9,
      growth: 8.3
    },
    {
      name: 'Coastal Retreat',
      revenue: 12300,
      bookings: 23,
      occupancy: 45,
      rating: 4.6,
      growth: -5.2
    },
    {
      name: 'Mountain View Inn',
      revenue: 3030,
      bookings: 10,
      occupancy: 0,
      rating: 4.2,
      growth: -15.7
    }
  ];

  const guestDemographics = [
    { country: 'South Africa', percentage: 35, guests: 109 },
    { country: 'Germany', percentage: 22, guests: 69 },
    { country: 'United Kingdom', percentage: 18, guests: 56 },
    { country: 'United States', percentage: 12, guests: 37 },
    { country: 'Other', percentage: 13, guests: 41 }
  ];

  const serviceAnalytics = [
    {
      service: 'Room Revenue',
      revenue: 85600,
      percentage: 68.2,
      growth: 12.5,
      icon: Bed
    },
    {
      service: 'Restaurant Revenue',
      revenue: 24500,
      percentage: 19.5,
      growth: 8.3,
      icon: Utensils
    },
    {
      service: 'Tour Revenue',
      revenue: 12300,
      percentage: 9.8,
      growth: 15.7,
      icon: Car
    },
    {
      service: 'Other Services',
      revenue: 3030,
      percentage: 2.4,
      growth: 5.2,
      icon: Activity
    }
  ];

  const bookingSources = [
    { source: 'Website', bookings: 89, percentage: 57.1, revenue: 45600 },
    { source: 'Booking.com', bookings: 34, percentage: 21.8, revenue: 18900 },
    { source: 'Phone', bookings: 23, percentage: 14.7, revenue: 12300 },
    { source: 'Walk-in', bookings: 10, percentage: 6.4, revenue: 6300 }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'properties', label: 'Properties', icon: Bed },
    { id: 'services', label: 'Services', icon: Utensils }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Analytics Dashboard"
        description="Comprehensive analytics and insights for your hospitality business"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Analytics', href: '/analytics' },
          { label: 'Analytics Dashboard', href: '/analytics/dashboard' }
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
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <ActionButton variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-green-500 text-white">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Total Revenue</p>
                      <p className="text-2xl font-bold">N$ {overviewMetrics.totalRevenue.toLocaleString()}</p>
                      <p className="text-sm text-success">+{overviewMetrics.revenueGrowth}%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-blue-500 text-white">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Total Bookings</p>
                      <p className="text-2xl font-bold">{overviewMetrics.totalBookings}</p>
                      <p className="text-sm text-success">+{overviewMetrics.bookingGrowth}%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-purple-500 text-white">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Total Guests</p>
                      <p className="text-2xl font-bold">{overviewMetrics.totalGuests}</p>
                      <p className="text-sm text-success">+{overviewMetrics.guestGrowth}%</p>
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
                      <p className="text-sm text-base-content/70">Average Rating</p>
                      <p className="text-2xl font-bold">{overviewMetrics.averageRating}</p>
                      <p className="text-sm text-success">+{overviewMetrics.ratingGrowth}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-6">Revenue Trend</h3>
                  <div className="space-y-4">
                    {revenueData.map((data, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{data.month}</span>
                          <span className="font-semibold">N$ {data.revenue.toLocaleString()}</span>
                        </div>
                        <progress 
                          className="progress progress-primary w-full" 
                          value={(data.revenue / Math.max(...revenueData.map(d => d.revenue))) * 100} 
                          max="100"
                        ></progress>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-6">Guest Demographics</h3>
                  <div className="space-y-4">
                    {guestDemographics.map((demo, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{demo.country}</span>
                          <span className="font-semibold">{demo.guests} guests</span>
                        </div>
                        <progress 
                          className="progress progress-secondary w-full" 
                          value={demo.percentage} 
                          max="100"
                        ></progress>
                        <p className="text-sm text-base-content/70 mt-1">{demo.percentage}% of total guests</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-8">
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-6">Revenue by Service</h3>
                  <div className="space-y-4">
                    {serviceAnalytics.map((service, index) => {
                      const ServiceIcon = service.icon;
                      return (
                        <div key={index} className="p-4 bg-base-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <ServiceIcon className="w-5 h-5 text-primary" />
                              <span className="font-semibold">{service.service}</span>
                            </div>
                            <span className="font-semibold">N$ {service.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>{service.percentage}% of total</span>
                            <span className={service.growth > 0 ? 'text-success' : 'text-error'}>
                              {service.growth > 0 ? '+' : ''}{service.growth}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-6">Monthly Revenue</h3>
                  <div className="space-y-4">
                    {revenueData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{data.month}</span>
                        <span className="font-semibold">N$ {data.revenue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-6">Booking Sources</h3>
                  <div className="space-y-4">
                    {bookingSources.map((source, index) => (
                      <div key={index} className="p-4 bg-base-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{source.source}</span>
                          <span className="font-semibold">{source.bookings} bookings</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>{source.percentage}% of total</span>
                          <span>N$ {source.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-6">Monthly Bookings</h3>
                  <div className="space-y-4">
                    {revenueData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{data.month}</span>
                        <span className="font-semibold">{data.bookings} bookings</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {propertyPerformance.map((property, index) => (
                <div key={index} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="card-title text-lg">{property.name}</h3>
                        <p className="text-sm text-base-content/70">Property Performance</p>
                      </div>
                      <div className={`badge ${property.growth > 0 ? 'badge-success' : 'badge-error'}`}>
                        {property.growth > 0 ? '+' : ''}{property.growth}%
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Revenue</span>
                        <span className="font-semibold">N$ {property.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Bookings</span>
                        <span className="font-semibold">{property.bookings}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Occupancy</span>
                        <span className="font-semibold">{property.occupancy}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Rating</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-warning" />
                          <span className="font-semibold">{property.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-actions justify-end">
                      <button className="btn btn-ghost btn-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Revenue</p>
                  <p className="text-2xl font-bold">N$ {overviewMetrics.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-green-500 text-white">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Bookings</p>
                  <p className="text-2xl font-bold">{overviewMetrics.totalBookings}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Guests</p>
                  <p className="text-2xl font-bold">{overviewMetrics.totalGuests}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Growth Rate</p>
                  <p className="text-2xl font-bold">+{overviewMetrics.revenueGrowth}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}