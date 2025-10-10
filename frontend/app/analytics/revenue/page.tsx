"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  DollarSign, 
  Search, 
  Filter, 
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Users,
  Bed,
  Utensils,
  Car,
  Activity,
  Star,
  Clock,
  Globe,
  Building2,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react';

export default function AnalyticsRevenuePage() {
  const [dateRange, setDateRange] = useState('30d');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample revenue data
  const revenueData = [
    {
      period: '2024-01',
      totalRevenue: 125430,
      roomRevenue: 85600,
      restaurantRevenue: 24500,
      tourRevenue: 12300,
      otherRevenue: 3030,
      bookings: 156,
      averageBookingValue: 804,
      occupancyRate: 78.5,
      revenueGrowth: 12.5,
      previousPeriod: 111500
    },
    {
      period: '2023-12',
      totalRevenue: 135200,
      roomRevenue: 92400,
      restaurantRevenue: 26800,
      tourRevenue: 14200,
      otherRevenue: 1800,
      bookings: 169,
      averageBookingValue: 800,
      occupancyRate: 82.3,
      revenueGrowth: 8.3,
      previousPeriod: 124800
    },
    {
      period: '2023-11',
      totalRevenue: 118500,
      roomRevenue: 81200,
      restaurantRevenue: 22300,
      tourRevenue: 12300,
      otherRevenue: 2700,
      bookings: 148,
      averageBookingValue: 801,
      occupancyRate: 75.2,
      revenueGrowth: 15.7,
      previousPeriod: 102400
    },
    {
      period: '2023-10',
      totalRevenue: 112000,
      roomRevenue: 76800,
      restaurantRevenue: 21200,
      tourRevenue: 11200,
      otherRevenue: 2800,
      bookings: 142,
      averageBookingValue: 789,
      occupancyRate: 73.8,
      revenueGrowth: 5.2,
      previousPeriod: 106400
    }
  ];

  const propertyRevenue = [
    {
      property: 'Etuna Guesthouse',
      revenue: 85600,
      percentage: 68.2,
      growth: 12.5,
      bookings: 89,
      averageValue: 962,
      occupancy: 78,
      color: 'bg-blue-500'
    },
    {
      property: 'Namibia Safari Lodge',
      revenue: 24500,
      percentage: 19.5,
      growth: 8.3,
      bookings: 34,
      averageValue: 721,
      occupancy: 85,
      color: 'bg-green-500'
    },
    {
      property: 'Coastal Retreat',
      revenue: 12300,
      percentage: 9.8,
      growth: 15.7,
      bookings: 23,
      averageValue: 535,
      occupancy: 45,
      color: 'bg-purple-500'
    },
    {
      property: 'Mountain View Inn',
      revenue: 3030,
      percentage: 2.4,
      growth: -5.2,
      bookings: 10,
      averageValue: 303,
      occupancy: 0,
      color: 'bg-orange-500'
    }
  ];

  const serviceRevenue = [
    {
      service: 'Room Revenue',
      revenue: 85600,
      percentage: 68.2,
      growth: 12.5,
      transactions: 89,
      averageValue: 962,
      icon: Bed,
      color: 'bg-blue-500'
    },
    {
      service: 'Restaurant Revenue',
      revenue: 24500,
      percentage: 19.5,
      growth: 8.3,
      transactions: 234,
      averageValue: 105,
      icon: Utensils,
      color: 'bg-green-500'
    },
    {
      service: 'Tour Revenue',
      revenue: 12300,
      percentage: 9.8,
      growth: 15.7,
      transactions: 45,
      averageValue: 273,
      icon: Car,
      color: 'bg-purple-500'
    },
    {
      service: 'Other Services',
      revenue: 3030,
      percentage: 2.4,
      growth: 5.2,
      transactions: 67,
      averageValue: 45,
      icon: Activity,
      color: 'bg-orange-500'
    }
  ];

  const paymentMethodRevenue = [
    {
      method: 'Credit Card',
      revenue: 67800,
      percentage: 54.0,
      transactions: 234,
      averageValue: 290,
      icon: CreditCard,
      color: 'bg-blue-500'
    },
    {
      method: 'Bank Transfer',
      revenue: 34500,
      percentage: 27.5,
      transactions: 89,
      averageValue: 388,
      icon: Banknote,
      color: 'bg-green-500'
    },
    {
      method: 'Mobile Payment',
      revenue: 18900,
      percentage: 15.1,
      transactions: 156,
      averageValue: 121,
      icon: Smartphone,
      color: 'bg-purple-500'
    },
    {
      method: 'Cash',
      revenue: 4230,
      percentage: 3.4,
      transactions: 45,
      averageValue: 94,
      icon: Banknote,
      color: 'bg-orange-500'
    }
  ];

  const currentPeriod = revenueData[0];
  const previousPeriod = revenueData[1];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'services', label: 'Services', icon: Utensils },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'trends', label: 'Trends', icon: LineChart }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Revenue Analytics"
        description="Comprehensive revenue analysis, trends, and performance metrics across all properties and services"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Analytics', href: '/analytics' },
          { label: 'Revenue', href: '/analytics/revenue' }
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
                <select
                  className="select select-bordered w-full md:w-40"
                  value={propertyFilter}
                  onChange={(e) => setPropertyFilter(e.target.value)}
                >
                  <option value="all">All Properties</option>
                  <option value="Etuna Guesthouse">Etuna Guesthouse</option>
                  <option value="Namibia Safari Lodge">Namibia Safari Lodge</option>
                  <option value="Coastal Retreat">Coastal Retreat</option>
                  <option value="Mountain View Inn">Mountain View Inn</option>
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
                      <p className="text-2xl font-bold">N$ {currentPeriod.totalRevenue.toLocaleString()}</p>
                      <p className="text-sm text-success">+{currentPeriod.revenueGrowth}%</p>
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
                      <p className="text-sm text-base-content/70">Bookings</p>
                      <p className="text-2xl font-bold">{currentPeriod.bookings}</p>
                      <p className="text-sm text-success">+{Math.round(((currentPeriod.bookings - previousPeriod.bookings) / previousPeriod.bookings) * 100)}%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-purple-500 text-white">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Avg Booking Value</p>
                      <p className="text-2xl font-bold">N$ {currentPeriod.averageBookingValue}</p>
                      <p className="text-sm text-success">+{Math.round(((currentPeriod.averageBookingValue - previousPeriod.averageBookingValue) / previousPeriod.averageBookingValue) * 100)}%</p>
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
                      <p className="text-sm text-base-content/70">Occupancy Rate</p>
                      <p className="text-2xl font-bold">{currentPeriod.occupancyRate}%</p>
                      <p className="text-sm text-success">+{Math.round(currentPeriod.occupancyRate - previousPeriod.occupancyRate)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-6">Revenue Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bed className="w-5 h-5 text-blue-500" />
                        <span className="text-sm">Room Revenue</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">N$ {currentPeriod.roomRevenue.toLocaleString()}</p>
                        <p className="text-xs text-base-content/70">68.2%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Utensils className="w-5 h-5 text-green-500" />
                        <span className="text-sm">Restaurant Revenue</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">N$ {currentPeriod.restaurantRevenue.toLocaleString()}</p>
                        <p className="text-xs text-base-content/70">19.5%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Car className="w-5 h-5 text-purple-500" />
                        <span className="text-sm">Tour Revenue</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">N$ {currentPeriod.tourRevenue.toLocaleString()}</p>
                        <p className="text-xs text-base-content/70">9.8%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Activity className="w-5 h-5 text-orange-500" />
                        <span className="text-sm">Other Services</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">N$ {currentPeriod.otherRevenue.toLocaleString()}</p>
                        <p className="text-xs text-base-content/70">2.4%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-6">Monthly Trends</h3>
                  <div className="space-y-4">
                    {revenueData.map((data, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{data.period}</span>
                          <span className="font-semibold">N$ {data.totalRevenue.toLocaleString()}</span>
                        </div>
                        <progress 
                          className="progress progress-primary w-full" 
                          value={(data.totalRevenue / Math.max(...revenueData.map(d => d.totalRevenue))) * 100} 
                          max="100"
                        ></progress>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {propertyRevenue.map((property, index) => (
                <div key={index} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="card-title text-lg">{property.property}</h3>
                        <p className="text-sm text-base-content/70">{property.bookings} bookings</p>
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
                        <span className="text-sm">Avg Value</span>
                        <span className="font-semibold">N$ {property.averageValue}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Occupancy</span>
                        <span className="font-semibold">{property.occupancy}%</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-base-content/70 mb-1">Revenue Share</p>
                      <progress 
                        className="progress progress-primary w-full" 
                        value={property.percentage} 
                        max="100"
                      ></progress>
                      <p className="text-xs text-base-content/70 mt-1">{property.percentage}% of total</p>
                    </div>

                    <div className="card-actions justify-end">
                      <button className="btn btn-ghost btn-sm">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {serviceRevenue.map((service, index) => {
                const ServiceIcon = service.icon;
                return (
                  <div key={index} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${service.color} text-white`}>
                            <ServiceIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="card-title text-lg">{service.service}</h3>
                            <p className="text-sm text-base-content/70">{service.transactions} transactions</p>
                          </div>
                        </div>
                        <div className={`badge ${service.growth > 0 ? 'badge-success' : 'badge-error'}`}>
                          {service.growth > 0 ? '+' : ''}{service.growth}%
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Revenue</span>
                          <span className="font-semibold">N$ {service.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Avg Value</span>
                          <span className="font-semibold">N$ {service.averageValue}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Share</span>
                          <span className="font-semibold">{service.percentage}%</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-1">Revenue Share</p>
                        <progress 
                          className="progress progress-primary w-full" 
                          value={service.percentage} 
                          max="100"
                        ></progress>
                      </div>

                      <div className="card-actions justify-end">
                        <button className="btn btn-ghost btn-sm">
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {paymentMethodRevenue.map((method, index) => {
                const MethodIcon = method.icon;
                return (
                  <div key={index} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${method.color} text-white`}>
                            <MethodIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="card-title text-lg">{method.method}</h3>
                            <p className="text-sm text-base-content/70">{method.transactions} transactions</p>
                          </div>
                        </div>
                        <div className="badge badge-outline">
                          {method.percentage}%
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Revenue</span>
                          <span className="font-semibold">N$ {method.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Avg Value</span>
                          <span className="font-semibold">N$ {method.averageValue}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Share</span>
                          <span className="font-semibold">{method.percentage}%</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-1">Revenue Share</p>
                        <progress 
                          className="progress progress-primary w-full" 
                          value={method.percentage} 
                          max="100"
                        ></progress>
                      </div>

                      <div className="card-actions justify-end">
                        <button className="btn btn-ghost btn-sm">
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Revenue</p>
                  <p className="text-2xl font-bold">N$ {currentPeriod.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-green-500 text-white">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Growth Rate</p>
                  <p className="text-2xl font-bold">+{currentPeriod.revenueGrowth}%</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Bookings</p>
                  <p className="text-2xl font-bold">{currentPeriod.bookings}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Avg Booking Value</p>
                  <p className="text-2xl font-bold">N$ {currentPeriod.averageBookingValue}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}