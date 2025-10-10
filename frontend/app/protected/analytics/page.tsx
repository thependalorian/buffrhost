'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { KPICard } from '@/src/components/ui/kpi-card'
import { StatusBadge } from '@/src/components/ui/status-badge'
import { useAnalytics, useRevenueAnalytics, useOccupancyAnalytics, useRealTimeMetrics } from '../../../hooks/use-analytics'
import { useProperties } from '../../../hooks/use-properties'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Bed, 
  DollarSign,
  Calendar,
  Star,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Award,
  Target,
  Loader2
} from 'lucide-react'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedProperty, setSelectedProperty] = useState('default-property-id')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  // API calls
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = 
    useAnalytics(selectedProperty)
  
  const { data: revenueData, isLoading: revenueLoading } = 
    useRevenueAnalytics({ propertyId: selectedProperty, timeRange })
  
  const { data: occupancyData, isLoading: occupancyLoading } = 
    useOccupancyAnalytics({ propertyId: selectedProperty, timeRange })

  const { data: realTimeData, isLoading: realTimeLoading } = 
    useRealTimeMetrics(selectedProperty)

  const { data: propertiesData } = useProperties()

  // Calculate date range based on selection
  const dateRange = useMemo(() => {
    const now = new Date()
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
    return {
      startDate: new Date(now.getTime() - days * 24 * 60 * 60 * 1000),
      endDate: now
    }
  }, [timeRange])

  // Loading state
  if (dashboardLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <div className="text-lg">Loading analytics data...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (dashboardError) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Error loading analytics data</div>
          <div className="text-gray-600">Please try again later</div>
        </div>
      </div>
    )
  }

  // Use real data or fallback to empty structure
  const analytics = dashboardData?.data || {
    overview: {
      totalRevenue: 0,
      revenueGrowth: 0,
      totalBookings: 0,
      bookingsGrowth: 0,
      avgOccupancy: 0,
      occupancyGrowth: 0,
      customerSatisfaction: 0,
      satisfactionGrowth: 0
    },
    revenue: {
      daily: [
        { date: '2024-01-15', revenue: 45000, bookings: 23 },
        { date: '2024-01-16', revenue: 52000, bookings: 28 },
        { date: '2024-01-17', revenue: 48000, bookings: 25 },
        { date: '2024-01-18', revenue: 61000, bookings: 32 },
        { date: '2024-01-19', revenue: 55000, bookings: 29 },
        { date: '2024-01-20', revenue: 67000, bookings: 35 },
        { date: '2024-01-21', revenue: 58000, bookings: 31 }
      ],
      byProperty: [
        { name: 'Etuna Guesthouse', revenue: 125000, percentage: 45 },
        { name: 'Safari Lodge Retreat', revenue: 89000, percentage: 32 },
        { name: 'Business Hotel', revenue: 156000, percentage: 56 },
        { name: 'Coastal Resort', revenue: 0, percentage: 0 }
      ],
      bySource: [
        { source: 'Direct Bookings', revenue: 1155000, percentage: 50 },
        { source: 'Online Travel Agents', revenue: 693000, percentage: 30 },
        { source: 'Corporate', revenue: 462000, percentage: 20 }
      ]
    },
    occupancy: {
      byProperty: [
        { name: 'Etuna Guesthouse', occupancy: 64, rooms: 50, occupied: 32 },
        { name: 'Safari Lodge Retreat', occupancy: 72, rooms: 25, occupied: 18 },
        { name: 'Business Hotel', occupancy: 79, rooms: 120, occupied: 95 },
        { name: 'Coastal Resort', occupancy: 0, rooms: 80, occupied: 0 }
      ],
      trends: [
        { month: 'Jan', occupancy: 68 },
        { month: 'Feb', occupancy: 72 },
        { month: 'Mar', occupancy: 75 },
        { month: 'Apr', occupancy: 70 },
        { month: 'May', occupancy: 65 },
        { month: 'Jun', occupancy: 78 }
      ]
    },
    customers: {
      demographics: {
        ageGroups: [
          { range: '18-25', count: 187, percentage: 15 },
          { range: '26-35', count: 349, percentage: 28 },
          { range: '36-45', count: 399, percentage: 32 },
          { range: '46-55', count: 224, percentage: 18 },
          { range: '55+', count: 88, percentage: 7 }
        ],
        locations: [
          { country: 'Namibia', count: 561, percentage: 45 },
          { country: 'South Africa', count: 374, percentage: 30 },
          { country: 'Botswana', count: 187, percentage: 15 },
          { country: 'Zambia', count: 125, percentage: 10 }
        ]
      },
      loyalty: {
        tierDistribution: [
          { tier: 'Platinum', count: 124, percentage: 10 },
          { tier: 'Gold', count: 374, percentage: 30 },
          { tier: 'Silver', count: 561, percentage: 45 },
          { tier: 'Bronze', count: 188, percentage: 15 }
        ],
        retentionRate: 87.5,
        avgLifetimeValue: 18500
      }
    },
    performance: {
      topPerforming: [
        { property: 'Business Hotel', revenue: 156000, occupancy: 79, satisfaction: 4.6 },
        { property: 'Etuna Guesthouse', revenue: 125000, occupancy: 64, satisfaction: 4.8 },
        { property: 'Safari Lodge Retreat', revenue: 89000, occupancy: 72, satisfaction: 4.7 }
      ],
      metrics: {
        avgBookingValue: 1850,
        avgLengthOfStay: 2.3,
        repeatGuestRate: 45.2,
        directBookingRate: 50.0
      }
    }
  }

  const topCustomers = [
    { name: 'Maria Garcia', tier: 'Platinum', bookings: 15, spent: 45000, satisfaction: 4.9 },
    { name: 'John Smith', tier: 'Gold', bookings: 12, spent: 32000, satisfaction: 4.7 },
    { name: 'Sarah Wilson', tier: 'Gold', bookings: 10, spent: 28000, satisfaction: 4.8 },
    { name: 'David Johnson', tier: 'Silver', bookings: 8, spent: 18000, satisfaction: 4.5 },
    { name: 'Lisa Brown', tier: 'Silver', bookings: 7, spent: 15000, satisfaction: 4.6 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-nude-900">Analytics Dashboard</h1>
          <p className="text-nude-600">Comprehensive insights into your hospitality business performance</p>
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
        <KPICard
          title="Total Revenue"
          value={`N$ ${analytics.overview.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6 text-nude-600" />}
          trend={{ value: analytics.overview.revenueGrowth, label: "vs last month", positive: true }}
          emotional={true}
        />
        <KPICard
          title="Total Bookings"
          value={analytics.overview.totalBookings.toLocaleString()}
          icon={<Calendar className="w-6 h-6 text-nude-600" />}
          trend={{ value: analytics.overview.bookingsGrowth, label: "vs last month", positive: true }}
          emotional={true}
        />
        <KPICard
          title="Avg Occupancy"
          value={`${analytics.overview.avgOccupancy}%`}
          icon={<Bed className="w-6 h-6 text-nude-600" />}
          trend={{ value: analytics.overview.occupancyGrowth, label: "vs last month", positive: true }}
          emotional={true}
        />
        <KPICard
          title="Customer Satisfaction"
          value={`${analytics.overview.customerSatisfaction}/5.0`}
          icon={<Star className="w-6 h-6 text-nude-600" />}
          trend={{ value: analytics.overview.satisfactionGrowth, label: "vs last month", positive: true }}
          emotional={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Analytics */}
        <Card className="dashboard-card-emotional">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Revenue by Property
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.revenue.byProperty.map((property, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-nude-900">{property.name}</span>
                    <span className="text-sm text-nude-600">N$ {property.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-nude-100 rounded-full h-2">
                    <div 
                      className="bg-nude-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${property.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Occupancy Analytics */}
        <Card className="dashboard-card-emotional">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Occupancy by Property
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.occupancy.byProperty.map((property, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-nude-900">{property.name}</span>
                    <span className="text-sm text-nude-600">{property.occupancy}%</span>
                  </div>
                  <div className="w-full bg-nude-100 rounded-full h-2">
                    <div 
                      className="bg-luxury-charlotte h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${property.occupancy}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-nude-500">
                    {property.occupied} of {property.rooms} rooms occupied
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dashboard-card-emotional">
          <CardHeader>
            <CardTitle>Customer Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.customers.demographics.ageGroups.map((group, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-nude-600">{group.range}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-nude-100 rounded-full h-2">
                      <div 
                        className="bg-nude-600 h-2 rounded-full" 
                        style={{ width: `${group.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-nude-900 w-12 text-right">
                      {group.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card-emotional">
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.customers.demographics.locations.map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-nude-600">{location.country}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-nude-100 rounded-full h-2">
                      <div 
                        className="bg-luxury-charlotte h-2 rounded-full" 
                        style={{ width: `${location.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-nude-900 w-12 text-right">
                      {location.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="dashboard-card-emotional">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-nude-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-nude-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-nude-900">N$ {analytics.performance.metrics.avgBookingValue.toLocaleString()}</div>
              <div className="text-sm text-nude-600">Avg Booking Value</div>
            </div>
            <div className="text-center p-4 bg-nude-50 rounded-lg">
              <Clock className="w-8 h-8 text-nude-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-nude-900">{analytics.performance.metrics.avgLengthOfStay}</div>
              <div className="text-sm text-nude-600">Avg Length of Stay</div>
            </div>
            <div className="text-center p-4 bg-nude-50 rounded-lg">
              <Users className="w-8 h-8 text-nude-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-nude-900">{analytics.performance.metrics.repeatGuestRate}%</div>
              <div className="text-sm text-nude-600">Repeat Guest Rate</div>
            </div>
            <div className="text-center p-4 bg-nude-50 rounded-lg">
              <Activity className="w-8 h-8 text-nude-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-nude-900">{analytics.performance.metrics.directBookingRate}%</div>
              <div className="text-sm text-nude-600">Direct Booking Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card className="dashboard-card-emotional">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Top Performing Customers
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
                    <div className="text-sm text-nude-600">Satisfaction</div>
                    <div className="font-semibold text-nude-900 flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                      {customer.satisfaction}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}