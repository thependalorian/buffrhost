'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { EmotionalInput } from '@/src/components/ui/emotional-input'
import { EmotionalDataTable } from '@/src/components/ui/emotional-data-table'
import { StatusBadge } from '@/src/components/ui/status-badge'
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Star, 
  Users, 
  Bed, 
  Calendar,
  Eye,
  Edit,
  Settings,
  MoreHorizontal,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])

  const properties = [
    {
      id: '1',
      name: 'Etuna Guesthouse',
      type: 'Hotel',
      location: 'Windhoek, Namibia',
      status: 'active',
      starRating: 5,
      totalRooms: 50,
      occupiedRooms: 32,
      occupancyRate: 64,
      revenue: 125000,
      revenueGrowth: 12.5,
      lastUpdated: '2024-01-20',
      amenities: ['Spa', 'Restaurant', 'Pool', 'Gym', 'WiFi'],
      description: 'Luxury boutique hotel in the heart of Windhoek'
    },
    {
      id: '2',
      name: 'Safari Lodge Retreat',
      type: 'Lodge',
      location: 'Etosha National Park, Namibia',
      status: 'active',
      starRating: 4,
      totalRooms: 25,
      occupiedRooms: 18,
      occupancyRate: 72,
      revenue: 89000,
      revenueGrowth: 8.3,
      lastUpdated: '2024-01-18',
      amenities: ['Safari Tours', 'Restaurant', 'Bar', 'WiFi'],
      description: 'Wildlife-focused lodge with guided safari experiences'
    },
    {
      id: '3',
      name: 'Coastal Resort',
      type: 'Resort',
      location: 'Swakopmund, Namibia',
      status: 'maintenance',
      starRating: 4,
      totalRooms: 80,
      occupiedRooms: 0,
      occupancyRate: 0,
      revenue: 0,
      revenueGrowth: -15.2,
      lastUpdated: '2024-01-15',
      amenities: ['Beach Access', 'Spa', 'Restaurant', 'Pool', 'Kids Club'],
      description: 'Beachfront resort undergoing renovation'
    },
    {
      id: '4',
      name: 'Business Hotel',
      type: 'Hotel',
      location: 'Cape Town, South Africa',
      status: 'active',
      starRating: 3,
      totalRooms: 120,
      occupiedRooms: 95,
      occupancyRate: 79,
      revenue: 156000,
      revenueGrowth: 5.7,
      lastUpdated: '2024-01-22',
      amenities: ['Business Center', 'Restaurant', 'Gym', 'WiFi', 'Parking'],
      description: 'Modern business hotel in downtown Cape Town'
    }
  ]

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      key: 'name',
      label: 'Property',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-nude-400 to-nude-600 rounded-lg flex items-center justify-center text-white font-semibold">
            {value.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-semibold text-nude-900">{value}</div>
            <div className="text-sm text-nude-600 flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {row.location}
            </div>
            <div className="flex items-center mt-1">
              {[...Array(row.starRating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => (
        <StatusBadge status="info">
          {value}
        </StatusBadge>
      )
    },
    {
      key: 'occupancyRate',
      label: 'Occupancy',
      render: (value: number, row: any) => (
        <div className="text-center">
          <div className="font-semibold text-nude-900">{value}%</div>
          <div className="text-xs text-nude-500">{row.occupiedRooms}/{row.totalRooms} rooms</div>
        </div>
      )
    },
    {
      key: 'revenue',
      label: 'Revenue',
      render: (value: number, row: any) => (
        <div className="text-right">
          <div className="font-semibold text-nude-900">N$ {value.toLocaleString()}</div>
          <div className={`text-xs flex items-center justify-end ${
            row.revenueGrowth > 0 ? 'text-semantic-success' : 'text-semantic-error'
          }`}>
            {row.revenueGrowth > 0 ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {Math.abs(row.revenueGrowth)}%
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <StatusBadge 
          status={value === 'active' ? 'success' : value === 'maintenance' ? 'warning' : 'error'}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </StatusBadge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    totalRooms: properties.reduce((sum, p) => sum + p.totalRooms, 0),
    occupiedRooms: properties.reduce((sum, p) => sum + p.occupiedRooms, 0),
    totalRevenue: properties.reduce((sum, p) => sum + p.revenue, 0),
    avgOccupancy: properties.reduce((sum, p) => sum + p.occupancyRate, 0) / properties.length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-nude-900">Property Management</h1>
          <p className="text-nude-600">Manage your hospitality properties and monitor performance</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dashboard-card-emotional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nude-600">Total Properties</p>
                <p className="text-2xl font-bold text-nude-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-nude-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-nude-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card-emotional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nude-600">Active Properties</p>
                <p className="text-2xl font-bold text-nude-900">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-semantic-success/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-semantic-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card-emotional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nude-600">Total Rooms</p>
                <p className="text-2xl font-bold text-nude-900">{stats.totalRooms}</p>
                <div className="text-xs text-nude-500 mt-1">
                  {stats.occupiedRooms} occupied
                </div>
              </div>
              <div className="w-12 h-12 bg-luxury-charlotte/20 rounded-full flex items-center justify-center">
                <Bed className="w-6 h-6 text-luxury-charlotte" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card-emotional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nude-600">Total Revenue</p>
                <p className="text-2xl font-bold text-nude-900">N$ {stats.totalRevenue.toLocaleString()}</p>
                <div className="text-xs text-nude-500 mt-1">
                  {stats.avgOccupancy.toFixed(1)}% avg occupancy
                </div>
              </div>
              <div className="w-12 h-12 bg-semantic-success/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-semantic-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="dashboard-card-emotional">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-nude-400 w-4 h-4" />
                <EmotionalInput
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input-emotional"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card className="dashboard-card-emotional">
        <CardHeader>
          <CardTitle>Properties Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <EmotionalDataTable
            data={filteredProperties}
            columns={columns}
            emotional={true}
            variant="default"
            pageSize={10}
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="dashboard-card-emotional">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col">
              <Calendar className="w-6 h-6 mb-2" />
              <span>View Calendar</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Users className="w-6 h-6 mb-2" />
              <span>Manage Staff</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Settings className="w-6 h-6 mb-2" />
              <span>Property Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}