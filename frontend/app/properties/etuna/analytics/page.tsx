"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Bed,
  DollarSign,
  Star,
  Calendar,
  Filter,
  Download,
  Eye,
  Target,
  Activity,
  PieChart,
  LineChart,
  Clock,
  MapPin
} from 'lucide-react';

export default function EtunaAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');

  // Sample analytics data
  const keyMetrics = {
    totalGuests: 1247,
    occupancyRate: 78.5,
    averageRating: 4.8,
    revenue: 125430,
    repeatGuests: 312,
    newGuests: 935,
    averageStay: 2.3,
    revenuePerGuest: 100.6
  };

  const occupancyData = [
    { month: 'Oct 2023', occupancy: 72, revenue: 112000 },
    { month: 'Nov 2023', occupancy: 75, revenue: 118500 },
    { month: 'Dec 2023', occupancy: 85, revenue: 135200 },
    { month: 'Jan 2024', occupancy: 78, revenue: 125430 }
  ];

  const guestDemographics = [
    { country: 'South Africa', percentage: 35, guests: 436 },
    { country: 'Germany', percentage: 22, guests: 274 },
    { country: 'United Kingdom', percentage: 18, guests: 224 },
    { country: 'United States', percentage: 12, guests: 150 },
    { country: 'Other', percentage: 13, guests: 163 }
  ];

  const roomPerformance = [
    { room: '101 - Deluxe Double', occupancy: 85, revenue: 12750, rating: 4.9 },
    { room: '102 - Family Suite', occupancy: 92, revenue: 16560, rating: 4.8 },
    { room: '205 - Standard Single', occupancy: 78, revenue: 7020, rating: 4.7 },
    { room: '301 - Deluxe Double', occupancy: 65, revenue: 9750, rating: 4.6 },
    { room: '302 - Executive Suite', occupancy: 45, revenue: 14400, rating: 4.9 }
  ];

  const serviceRatings = [
    { service: 'Room Service', rating: 4.8, reviews: 156 },
    { service: 'Restaurant', rating: 4.7, reviews: 234 },
    { service: 'Tours & Activities', rating: 4.9, reviews: 189 },
    { service: 'Staff Service', rating: 4.8, reviews: 312 },
    { service: 'Check-in Process', rating: 4.6, reviews: 298 }
  ];

  const revenueSources = [
    { source: 'Room Revenue', amount: 85600, percentage: 68.2, growth: 12.5 },
    { source: 'Restaurant Revenue', amount: 24500, percentage: 19.5, growth: 8.3 },
    { source: 'Tour Revenue', amount: 12300, percentage: 9.8, growth: 15.7 },
    { source: 'Other Services', amount: 3030, percentage: 2.4, growth: 5.2 }
  ];

  const seasonalTrends = [
    { season: 'Summer (Dec-Feb)', occupancy: 85, revenue: 135200, guests: 456 },
    { season: 'Autumn (Mar-May)', occupancy: 72, revenue: 108000, guests: 312 },
    { season: 'Winter (Jun-Aug)', occupancy: 68, revenue: 102000, guests: 289 },
    { season: 'Spring (Sep-Nov)', occupancy: 75, revenue: 112500, guests: 334 }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'occupancy', label: 'Occupancy', icon: Bed },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'satisfaction', label: 'Satisfaction', icon: Star },
    { id: 'seasonal', label: 'Seasonal', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Analytics Dashboard"
        description="Performance metrics and insights for Etuna Guesthouse"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Etuna Management', href: '/protected/etuna' },
          { label: 'Analytics', href: '/protected/etuna/analytics' }
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
                    <div className="p-3 rounded-lg bg-blue-500 text-white">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Total Guests</p>
                      <p className="text-2xl font-bold">{keyMetrics.totalGuests}</p>
                      <p className="text-sm text-success">+15% vs last month</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-green-500 text-white">
                      <Bed className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Occupancy Rate</p>
                      <p className="text-2xl font-bold">{keyMetrics.occupancyRate}%</p>
                      <p className="text-sm text-success">+3% vs last month</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-yellow-500 text-white">
                      <Star className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Average Rating</p>
                      <p className="text-2xl font-bold">{keyMetrics.averageRating}</p>
                      <p className="text-sm text-success">+0.2 vs last month</p>
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
                      <p className="text-sm text-base-content/70">Monthly Revenue</p>
                      <p className="text-2xl font-bold">N$ {keyMetrics.revenue.toLocaleString()}</p>
                      <p className="text-sm text-success">+12% vs last month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
                          className="progress progress-primary w-full" 
                          value={demo.percentage} 
                          max="100"
                        ></progress>
                        <p className="text-sm text-base-content/70 mt-1">{demo.percentage}% of total guests</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-6">Guest Insights</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Repeat Guests</span>
                      <span className="font-semibold">{keyMetrics.repeatGuests} ({((keyMetrics.repeatGuests / keyMetrics.totalGuests) * 100).toFixed(1)}%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New Guests</span>
                      <span className="font-semibold">{keyMetrics.newGuests} ({((keyMetrics.newGuests / keyMetrics.totalGuests) * 100).toFixed(1)}%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Stay Duration</span>
                      <span className="font-semibold">{keyMetrics.averageStay} nights</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Revenue per Guest</span>
                      <span className="font-semibold">N$ {keyMetrics.revenuePerGuest}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Sources */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Revenue Sources Performance</h3>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Revenue Source</th>
                        <th>Amount</th>
                        <th>Percentage</th>
                        <th>Growth</th>
                        <th>Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueSources.map((source, index) => (
                        <tr key={index}>
                          <td className="font-semibold">{source.source}</td>
                          <td className="font-semibold">N$ {source.amount.toLocaleString()}</td>
                          <td>{source.percentage}%</td>
                          <td className={source.growth > 0 ? 'text-success' : 'text-error'}>
                            {source.growth > 0 ? '+' : ''}{source.growth}%
                          </td>
                          <td>
                            {source.growth > 0 ? (
                              <TrendingUp className="w-4 h-4 text-success" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-error" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Occupancy Tab */}
        {activeTab === 'occupancy' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-6">Monthly Occupancy Trends</h3>
                  <div className="space-y-4">
                    {occupancyData.map((data, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{data.month}</span>
                          <span className="font-semibold">{data.occupancy}%</span>
                        </div>
                        <progress 
                          className="progress progress-info w-full" 
                          value={data.occupancy} 
                          max="100"
                        ></progress>
                        <p className="text-sm text-base-content/70 mt-1">Revenue: N$ {data.revenue.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-6">Room Performance</h3>
                  <div className="space-y-4">
                    {roomPerformance.map((room, index) => (
                      <div key={index} className="p-4 bg-base-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{room.room}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-warning" />
                            <span className="text-sm">{room.rating}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-base-content/70">Occupancy</p>
                            <p className="font-semibold">{room.occupancy}%</p>
                          </div>
                          <div>
                            <p className="text-base-content/70">Revenue</p>
                            <p className="font-semibold">N$ {room.revenue.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Guests Tab */}
        {activeTab === 'guests' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                        className="progress progress-primary w-full" 
                        value={demo.percentage} 
                        max="100"
                      ></progress>
                      <p className="text-sm text-base-content/70 mt-1">{demo.percentage}% of total guests</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Guest Behavior Analysis</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Booking Lead Time</span>
                    <span className="font-semibold">14 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Direct Bookings</span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">OTA Bookings</span>
                    <span className="font-semibold">32%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Repeat Guest Rate</span>
                    <span className="font-semibold">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Group Size</span>
                    <span className="font-semibold">2.3 guests</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Satisfaction Tab */}
        {activeTab === 'satisfaction' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Service Ratings</h3>
                <div className="space-y-4">
                  {serviceRatings.map((service, index) => (
                    <div key={index} className="p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{service.service}</span>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-warning" />
                          <span className="font-semibold">{service.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-base-content/70">{service.reviews} reviews</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Guest Feedback Summary</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Satisfaction</span>
                    <span className="font-semibold text-success">4.8/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Would Recommend</span>
                    <span className="font-semibold text-success">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Likely to Return</span>
                    <span className="font-semibold text-success">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Value for Money</span>
                    <span className="font-semibold text-success">4.6/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Staff Friendliness</span>
                    <span className="font-semibold text-success">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Seasonal Tab */}
        {activeTab === 'seasonal' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Seasonal Performance</h3>
                <div className="space-y-4">
                  {seasonalTrends.map((season, index) => (
                    <div key={index} className="p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{season.season}</span>
                        <span className="font-semibold">{season.occupancy}%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-base-content/70">Revenue</p>
                          <p className="font-semibold">N$ {season.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-base-content/70">Guests</p>
                          <p className="font-semibold">{season.guests}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Seasonal Insights</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Peak Season</span>
                    <span className="font-semibold">Summer (Dec-Feb)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Low Season</span>
                    <span className="font-semibold">Winter (Jun-Aug)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Peak Occupancy</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Low Occupancy</span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Peak Season Premium</span>
                    <span className="font-semibold">+25%</span>
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