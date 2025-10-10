'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { EmotionalInput } from '@/src/components/ui/emotional-input'
import { EmotionalDataTable } from '@/src/components/ui/emotional-data-table'
import { StatusBadge } from '@/src/components/ui/status-badge'
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '../../../hooks/use-customers'
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Star,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Loader2
} from 'lucide-react'

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])

  // API calls
  const { data: customersData, isLoading: customersLoading, error: customersError } = 
    useCustomers({ search: searchTerm, status: filterStatus === 'all' ? undefined : filterStatus })
  
  const createCustomerMutation = useCreateCustomer()
  const updateCustomerMutation = useUpdateCustomer()
  const deleteCustomerMutation = useDeleteCustomer()

  // Use real data or fallback to empty array
  const customers = customersData?.data || []

  // Loading state
  if (customersLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <div className="text-lg">Loading customers...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (customersError) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Error loading customers</div>
          <div className="text-gray-600">Please try again later</div>
        </div>
      </div>
    )
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-nude-400 to-nude-600 rounded-full flex items-center justify-center text-white font-semibold">
            {value.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-semibold text-nude-900">{value}</div>
            <div className="text-sm text-nude-600">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'tier',
      label: 'Tier',
      render: (value: string) => (
        <StatusBadge 
          status={value === 'platinum' ? 'success' : value === 'gold' ? 'warning' : 'info'}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </StatusBadge>
      )
    },
    {
      key: 'totalBookings',
      label: 'Bookings',
      render: (value: number) => (
        <div className="text-center">
          <div className="font-semibold text-nude-900">{value}</div>
          <div className="text-xs text-nude-500">total</div>
        </div>
      )
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      render: (value: number) => (
        <div className="text-right">
          <div className="font-semibold text-nude-900">N$ {value.toLocaleString()}</div>
          <div className="text-xs text-nude-500">lifetime</div>
        </div>
      )
    },
    {
      key: 'lastVisit',
      label: 'Last Visit',
      render: (value: string) => (
        <div className="text-sm text-nude-600">
          {new Date(value).toLocaleDateString()}
        </div>
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
            <Mail className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    platinum: customers.filter(c => c.tier === 'platinum').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-nude-900">Customer Management</h1>
          <p className="text-nude-600">Manage your customer relationships and loyalty programs</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card-emotional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nude-600">Total Customers</p>
                <p className="text-2xl font-bold text-nude-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-nude-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-nude-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card-emotional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nude-600">Active Customers</p>
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
                <p className="text-sm font-medium text-nude-600">Platinum Members</p>
                <p className="text-2xl font-bold text-nude-900">{stats.platinum}</p>
              </div>
              <div className="w-12 h-12 bg-luxury-charlotte/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-luxury-charlotte" />
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
              </div>
              <div className="w-12 h-12 bg-semantic-success/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-semantic-success" />
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
                  placeholder="Search customers..."
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

      {/* Customer Table */}
      <Card className="dashboard-card-emotional">
        <CardHeader>
          <CardTitle>Customer Database</CardTitle>
        </CardHeader>
        <CardContent>
          <EmotionalDataTable
            data={filteredCustomers}
            columns={columns}
            emotional={true}
            variant="default"
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}