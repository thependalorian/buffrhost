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
  Users, 
  Clock, 
  Award,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  MoreHorizontal,
  UserCheck,
  UserX,
  Star,
  TrendingUp
} from 'lucide-react'

export default function StaffManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const staff = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Front Desk Manager',
      department: 'Front Office',
      status: 'active',
      email: 'sarah.johnson@etunahotel.com',
      phone: '+264 81 123 4567',
      hireDate: '2023-01-15',
      salary: 25000,
      performance: 4.8,
      shifts: 'Morning',
      location: 'Windhoek, Namibia',
      skills: ['Customer Service', 'Reservations', 'Leadership'],
      certifications: ['Hospitality Management', 'First Aid']
    },
    {
      id: '2',
      name: 'Michael Brown',
      role: 'Housekeeping Supervisor',
      department: 'Housekeeping',
      status: 'active',
      email: 'michael.brown@etunahotel.com',
      phone: '+264 81 234 5678',
      hireDate: '2022-08-20',
      salary: 18000,
      performance: 4.6,
      shifts: 'Evening',
      location: 'Windhoek, Namibia',
      skills: ['Housekeeping', 'Team Management', 'Quality Control'],
      certifications: ['Housekeeping Excellence', 'Safety Training']
    },
    {
      id: '3',
      name: 'Lisa Davis',
      role: 'Chef',
      department: 'Food & Beverage',
      status: 'active',
      email: 'lisa.davis@etunahotel.com',
      phone: '+264 81 345 6789',
      hireDate: '2023-03-10',
      salary: 32000,
      performance: 4.9,
      shifts: 'Day',
      location: 'Windhoek, Namibia',
      skills: ['Culinary Arts', 'Menu Planning', 'Kitchen Management'],
      certifications: ['Culinary Arts Diploma', 'Food Safety']
    },
    {
      id: '4',
      name: 'David Wilson',
      role: 'Maintenance Technician',
      department: 'Maintenance',
      status: 'on_leave',
      email: 'david.wilson@etunahotel.com',
      phone: '+264 81 456 7890',
      hireDate: '2021-11-05',
      salary: 15000,
      performance: 4.4,
      shifts: 'Flexible',
      location: 'Windhoek, Namibia',
      skills: ['Electrical', 'Plumbing', 'HVAC'],
      certifications: ['Electrical License', 'HVAC Certification']
    },
    {
      id: '5',
      name: 'Emma Thompson',
      role: 'Spa Therapist',
      department: 'Spa & Wellness',
      status: 'active',
      email: 'emma.thompson@etunahotel.com',
      phone: '+264 81 567 8901',
      hireDate: '2023-06-01',
      salary: 20000,
      performance: 4.7,
      shifts: 'Day',
      location: 'Windhoek, Namibia',
      skills: ['Massage Therapy', 'Aromatherapy', 'Customer Service'],
      certifications: ['Massage Therapy License', 'Aromatherapy Certification']
    }
  ]

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const columns = [
    {
      key: 'name',
      label: 'Staff Member',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-nude-400 to-nude-600 rounded-full flex items-center justify-center text-white font-semibold">
            {value.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-semibold text-nude-900">{value}</div>
            <div className="text-sm text-nude-600">{row.role}</div>
            <div className="text-xs text-nude-500">{row.department}</div>
          </div>
        </div>
      )
    },
    {
      key: 'department',
      label: 'Department',
      render: (value: string) => (
        <StatusBadge status="info">
          {value}
        </StatusBadge>
      )
    },
    {
      key: 'performance',
      label: 'Performance',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${
                  i < Math.floor(value) ? 'text-yellow-500 fill-current' : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-nude-900">{value}</span>
        </div>
      )
    },
    {
      key: 'salary',
      label: 'Salary',
      render: (value: number) => (
        <div className="text-right">
          <div className="font-semibold text-nude-900">N$ {value.toLocaleString()}</div>
          <div className="text-xs text-nude-500">monthly</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <StatusBadge 
          status={value === 'active' ? 'success' : value === 'on_leave' ? 'warning' : 'error'}
        >
          {value === 'on_leave' ? 'On Leave' : value.charAt(0).toUpperCase() + value.slice(1)}
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
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    onLeave: staff.filter(s => s.status === 'on_leave').length,
    avgPerformance: staff.reduce((sum, s) => sum + s.performance, 0) / staff.length,
    totalSalary: staff.reduce((sum, s) => sum + s.salary, 0),
    departments: [...new Set(staff.map(s => s.department))].length
  }

  const departments = [...new Set(staff.map(s => s.department))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-nude-900">Staff Management</h1>
          <p className="text-nude-600">Manage your team members, schedules, and performance</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dashboard-card-emotional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nude-600">Total Staff</p>
                <p className="text-2xl font-bold text-nude-900">{stats.total}</p>
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
                <p className="text-sm font-medium text-nude-600">Active Staff</p>
                <p className="text-2xl font-bold text-nude-900">{stats.active}</p>
                <div className="text-xs text-nude-500 mt-1">
                  {stats.onLeave} on leave
                </div>
              </div>
              <div className="w-12 h-12 bg-semantic-success/20 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-semantic-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card-emotional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nude-600">Avg Performance</p>
                <p className="text-2xl font-bold text-nude-900">{stats.avgPerformance.toFixed(1)}/5.0</p>
                <div className="flex items-center mt-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                  <span className="text-xs text-nude-500">Excellent</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-semantic-warning/20 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-semantic-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card-emotional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nude-600">Departments</p>
                <p className="text-2xl font-bold text-nude-900">{stats.departments}</p>
                <div className="text-xs text-nude-500 mt-1">
                  N$ {stats.totalSalary.toLocaleString()} total salary
                </div>
              </div>
              <div className="w-12 h-12 bg-luxury-charlotte/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-luxury-charlotte" />
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
                  placeholder="Search staff members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="form-input-emotional"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input-emotional"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
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

      {/* Staff Table */}
      <Card className="dashboard-card-emotional">
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <EmotionalDataTable
            data={filteredStaff}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col">
              <Calendar className="w-6 h-6 mb-2" />
              <span>Schedule Shifts</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Award className="w-6 h-6 mb-2" />
              <span>Performance Reviews</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Users className="w-6 h-6 mb-2" />
              <span>Team Meetings</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Clock className="w-6 h-6 mb-2" />
              <span>Time Tracking</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}