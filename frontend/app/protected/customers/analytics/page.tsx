'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Star, 
  Calendar,
  DollarSign,
  Award,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

export default function CustomerAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  const analytics = {
    overview: {
      totalCustomers: 1247,
      activeCustomers: 892,
      newCustomers: 45,
      churnedCustomers: 12,
      avgLifetimeValue: 18500,
      avgBookingFrequency: 3.2,
      customerSatisfaction: 4.7,
      retentionRate: 87.5
    },
    revenue: {
      total: 2310000,
      monthly: 185000,
      growth: 12.5,
      byTier: {
        platinum: 45,
        gold: 35,
        silver: 20
      }
    },
    demographics: {
      ageGroups: [
        { range: '18-25', percentage: 15, count: 187 },
        { range: '26-35', percentage: 28, count: 349 },
        { range: '36-45', percentage: 32, count: 399 },
        { range: '46-55', percentage: 18, count: 224 },
        { range: '55+', percentage: 7, count: 88 }
      ],
      locations: [
        { country: 'Namibia', percentage: 45, count: 561 },
        { country: 'South Africa', percentage: 30, count: 374 },
        { country: 'Botswana', percentage: 15, count: 187 },
        { country: 'Zambia', percentage: 10, count: 125 }
      ]
    },
    behavior: {
      bookingPatterns: [
        { day: 'Monday', bookings: 45 },
        { day: 'Tuesday', bookings: 52 },
        { day: 'Wednesday', bookings: 48 },
        { day: 'Thursday', bookings: 61 },
        { day: 'Friday', bookings: 78 },
        { day: 'Saturday', bookings: 89 },
        { day: 'Sunday', bookings: 67 }
      ],
      peakHours: [
        { hour: '09:00', bookings: 12 },
        { hour: '10:00', bookings: 18 },
        { hour: '11:00', bookings: 25 },
        { hour: '12:00', bookings: 32 },
        { hour: '13:00', bookings: 28 },
        { hour: '14:00', bookings: 35 },
        { hour: '15:00', bookings: 42 },
        { hour: '16:00', bookings: 38 },
        { hour: '17:00', bookings: 29 },
        { hour: '18:00', bookings: 22 }
      ]
    },
    loyalty: {
      tierDistribution: [
        { tier: 'Platinum', count: 124, percentage: 10 },
        { tier: 'Gold', count: 374, percentage: 30 },
        { tier: 'Silver', count: 561, percentage: 45 },
        { tier: 'Bronze', count: 188, percentage: 15 }
      ],
      pointsEarned: 45600,
      pointsRedeemed: 23400,
      avgPointsPerCustomer: 36.5
    }
  }

  const topCustomers = [
    { name: 'Maria Garcia', tier: 'Platinum', bookings: 15, spent: 45000, points: 4500 },
    { name: 'John Smith', tier: 'Gold', bookings: 12, spent: 32000, points: 3200 },
    { name: 'Sarah Wilson', tier: 'Gold', bookings: 10, spent: 28000, points: 2800 },
    { name: 'David Johnson', tier: 'Silver', bookings: 8, spent: 18000, points: 1800 },
    { name: 'Lisa Brown', tier: 'Silver', bookings: 7, spent: 15000, points: 1500 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-nude-900">Customer Analytics</h1>
          <p className="text-nude-600">Comprehensive insights into customer behavior and preferences</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-input-emotional"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dashboard-card-emotional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nude-600">Total Customers</p>
                <p className="text-2xl font-bold text-nude-900">{analytics.overview.totalCustomers.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-semantic-success mr-1" />
                  <span className="text-sm text-semantic-success">+5.2%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-nude-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-nude-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card-emotional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nude-600">Active Customers</p>
                <p className="text-2xl font-bold text-nude-900">{analytics.overview.activeCustomers.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-semantic-success mr-1" />
                  <span className="text-sm text-semantic-success">+3.1%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-semantic-success/20 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-semantic-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card-emotional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nude-600">Avg Lifetime Value</p>
                <p className="text-2xl font-bold text-nude-900">N$ {analytics.overview.avgLifetimeValue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-semantic-success mr-1" />
                  <span className="text-sm text-semantic-success">+8.7%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-luxury-charlotte/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-luxury-charlotte" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card-emotional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nude-600">Satisfaction Score</p>
                <p className="text-2xl font-bold text-nude-900">{analytics.overview.customerSatisfaction}/5.0</p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-semantic-warning mr-1 fill-current" />
                  <span className="text-sm text-semantic-warning">Excellent</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-semantic-warning/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-semantic-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Analytics */}
        <Card className="dashboard-card-emotional">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Revenue Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-nude-900">N$ {analytics.revenue.total.toLocaleString()}</div>
                <div className="text-sm text-nude-600">Total Revenue</div>
                <div className="flex items-center justify-center mt-2">
                  <TrendingUp className="w-4 h-4 text-semantic-success mr-1" />
                  <span className="text-sm text-semantic-success">+{analytics.revenue.growth}%</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-nude-600">Platinum Members</span>
                  <span className="font-semibold text-nude-900">{analytics.revenue.byTier.platinum}%</span>
                </div>
                <div className="w-full bg-nude-100 rounded-full h-2">
                  <div className="bg-luxury-charlotte h-2 rounded-full" style={{ width: `${analytics.revenue.byTier.platinum}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-nude-600">Gold Members</span>
                  <span className="font-semibold text-nude-900">{analytics.revenue.byTier.gold}%</span>
                </div>
                <div className="w-full bg-nude-100 rounded-full h-2">
                  <div className="bg-nude-600 h-2 rounded-full" style={{ width: `${analytics.revenue.byTier.gold}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-nude-600">Silver Members</span>
                  <span className="font-semibold text-nude-900">{analytics.revenue.byTier.silver}%</span>
                </div>
                <div className="w-full bg-nude-100 rounded-full h-2">
                  <div className="bg-nude-400 h-2 rounded-full" style={{ width: `${analytics.revenue.byTier.silver}%` }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Demographics */}
        <Card className="dashboard-card-emotional">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Customer Demographics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-nude-900 mb-3">Age Groups</h4>
                <div className="space-y-2">
                  {analytics.demographics.ageGroups.map((group, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-nude-600">{group.range}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-nude-100 rounded-full h-2">
                          <div 
                            className="bg-nude-600 h-2 rounded-full" 
                            style={{ width: `${group.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-nude-900">{group.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-nude-900 mb-3">Geographic Distribution</h4>
                <div className="space-y-2">
                  {analytics.demographics.locations.map((location, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-nude-600">{location.country}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-nude-100 rounded-full h-2">
                          <div 
                            className="bg-luxury-charlotte h-2 rounded-full" 
                            style={{ width: `${location.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-nude-900">{location.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card className="dashboard-card-emotional">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Top Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-nude-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-nude-400 to-nude-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-nude-900">{customer.name}</div>
                    <div className="text-sm text-nude-600">{customer.tier} Member</div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm text-nude-600">Bookings</div>
                    <div className="font-semibold text-nude-900">{customer.bookings}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-nude-600">Spent</div>
                    <div className="font-semibold text-nude-900">N$ {customer.spent.toLocaleString()}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-nude-600">Points</div>
                    <div className="font-semibold text-nude-900">{customer.points.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dashboard-card-emotional">
          <CardHeader>
            <CardTitle>Weekly Booking Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.behavior.bookingPatterns.map((pattern, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-nude-600 w-20">{pattern.day}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-nude-100 rounded-full h-2">
                      <div 
                        className="bg-nude-600 h-2 rounded-full" 
                        style={{ width: `${(pattern.bookings / 89) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-nude-900 w-12 text-right">{pattern.bookings}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card-emotional">
          <CardHeader>
            <CardTitle>Peak Booking Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.behavior.peakHours.map((hour, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-nude-600 w-16">{hour.hour}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-nude-100 rounded-full h-2">
                      <div 
                        className="bg-luxury-charlotte h-2 rounded-full" 
                        style={{ width: `${(hour.bookings / 42) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-nude-900 w-12 text-right">{hour.bookings}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}