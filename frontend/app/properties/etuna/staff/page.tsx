"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  DollarSign,
  Star,
  Phone,
  Mail,
  MapPin,
  Shield,
  Award
} from 'lucide-react';

export default function EtunaStaffPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('staff');

  // Sample staff data
  const staff = [
    {
      id: 'STAFF001',
      name: 'Peter Mwangi',
      position: 'General Manager',
      department: 'Management',
      email: 'peter.mwangi@etuna.com',
      phone: '+264 81 123 4567',
      hireDate: '2020-03-15',
      status: 'active',
      salary: 25000,
      performance: 4.8,
      shifts: ['Morning', 'Evening'],
      skills: ['Leadership', 'Customer Service', 'Operations'],
      emergencyContact: '+264 81 234 5678'
    },
    {
      id: 'STAFF002',
      name: 'Sarah van der Merwe',
      position: 'Front Desk Receptionist',
      department: 'Reception',
      email: 'sarah.vandermerwe@etuna.com',
      phone: '+264 81 234 5678',
      hireDate: '2021-06-20',
      status: 'active',
      salary: 12000,
      performance: 4.6,
      shifts: ['Morning', 'Afternoon'],
      skills: ['Customer Service', 'Reservations', 'Multilingual'],
      emergencyContact: '+264 81 345 6789'
    },
    {
      id: 'STAFF003',
      name: 'Michael Brown',
      position: 'Tour Guide',
      department: 'Tours',
      email: 'michael.brown@etuna.com',
      phone: '+264 81 345 6789',
      hireDate: '2022-01-10',
      status: 'active',
      salary: 15000,
      performance: 4.9,
      shifts: ['Full Day'],
      skills: ['Tour Guiding', 'Wildlife Knowledge', 'Photography'],
      emergencyContact: '+264 81 456 7890'
    },
    {
      id: 'STAFF004',
      name: 'Anna Schmidt',
      position: 'Chef',
      department: 'Restaurant',
      email: 'anna.schmidt@etuna.com',
      phone: '+264 81 456 7890',
      hireDate: '2021-09-05',
      status: 'active',
      salary: 18000,
      performance: 4.7,
      shifts: ['Morning', 'Evening'],
      skills: ['Cooking', 'Menu Planning', 'Food Safety'],
      emergencyContact: '+264 81 567 8901'
    },
    {
      id: 'STAFF005',
      name: 'David Johnson',
      position: 'Maintenance Technician',
      department: 'Maintenance',
      email: 'david.johnson@etuna.com',
      phone: '+264 81 567 8901',
      hireDate: '2020-11-12',
      status: 'on-leave',
      salary: 14000,
      performance: 4.5,
      shifts: ['Day'],
      skills: ['Electrical', 'Plumbing', 'HVAC'],
      emergencyContact: '+264 81 678 9012'
    }
  ];

  const departments = [
    { name: 'Management', count: 1, color: 'bg-blue-500' },
    { name: 'Reception', count: 1, color: 'bg-green-500' },
    { name: 'Tours', count: 1, color: 'bg-purple-500' },
    { name: 'Restaurant', count: 1, color: 'bg-orange-500' },
    { name: 'Maintenance', count: 1, color: 'bg-red-500' },
    { name: 'Housekeeping', count: 2, color: 'bg-yellow-500' }
  ];

  const shifts = [
    { name: 'Morning Shift', time: '06:00 - 14:00', staff: 3 },
    { name: 'Afternoon Shift', time: '14:00 - 22:00', staff: 2 },
    { name: 'Evening Shift', time: '22:00 - 06:00', staff: 1 },
    { name: 'Full Day', time: '08:00 - 17:00', staff: 2 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'on-leave':
        return 'text-warning bg-warning/10';
      case 'inactive':
        return 'text-error bg-error/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'on-leave':
        return Clock;
      case 'inactive':
        return Clock;
      default:
        return UserCheck;
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const tabs = [
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'departments', label: 'Departments', icon: Shield },
    { id: 'shifts', label: 'Shifts', icon: Calendar },
    { id: 'performance', label: 'Performance', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Staff Management"
        description="Manage staff, departments, shifts, and performance for Etuna Guesthouse"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Etuna Management', href: '/protected/etuna' },
          { label: 'Staff Management', href: '/protected/etuna/staff' }
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
                <ActionButton variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </ActionButton>
                <ActionButton>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Staff
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search staff..."
                        className="input input-bordered w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn btn-square">
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <select
                    className="select select-bordered w-full md:w-40"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    <option value="Management">Management</option>
                    <option value="Reception">Reception</option>
                    <option value="Tours">Tours</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Housekeeping">Housekeeping</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredStaff.map((member) => {
                const StatusIcon = getStatusIcon(member.status);
                return (
                  <div key={member.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="card-title text-lg">{member.name}</h3>
                          <p className="text-sm text-base-content/70">{member.position}</p>
                          <p className="text-sm font-semibold">{member.department}</p>
                        </div>
                        <div className={`badge ${getStatusColor(member.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="text-sm">{member.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm">{member.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm">Hired: {member.hireDate}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Salary</p>
                          <p className="font-semibold">N$ {member.salary.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Performance</p>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-warning" />
                            <span className="font-semibold">{member.performance}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Shifts</p>
                        <div className="flex flex-wrap gap-1">
                          {member.shifts.map((shift, index) => (
                            <span key={index} className="badge badge-outline badge-sm">
                              {shift}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.map((skill, index) => (
                            <span key={index} className="badge badge-primary badge-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="card-actions justify-end">
                        <button className="btn btn-ghost btn-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm text-error">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Departments Tab */}
        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {departments.map((dept, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-lg ${dept.color} text-white`}>
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="card-title text-lg">{dept.name}</h3>
                      <p className="text-sm text-base-content/70">{dept.count} staff members</p>
                    </div>
                  </div>
                  <div className="card-actions justify-end">
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Shifts Tab */}
        {activeTab === 'shifts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {shifts.map((shift, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 rounded-lg bg-blue-500 text-white">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="card-title text-lg">{shift.name}</h3>
                      <p className="text-sm text-base-content/70">{shift.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Staff Assigned</span>
                    <span className="font-semibold">{shift.staff} members</span>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6 mb-8">
            {staff.map((member) => (
              <div key={member.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="card-title text-lg">{member.name}</h3>
                      <p className="text-sm text-base-content/70">{member.position} - {member.department}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-warning" />
                      <span className="text-lg font-bold">{member.performance}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-base-content/70">Performance Rating</p>
                      <div className="flex items-center space-x-2">
                        <progress className="progress progress-warning w-full" value={member.performance * 20} max="100"></progress>
                        <span className="font-semibold">{member.performance}/5</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Salary</p>
                      <p className="font-semibold">N$ {member.salary.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/70">Status</p>
                      <div className={`badge ${getStatusColor(member.status)}`}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Staff</p>
                  <p className="text-2xl font-bold">{staff.length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-green-500 text-white">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Active Staff</p>
                  <p className="text-2xl font-bold">
                    {staff.filter(s => s.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">On Leave</p>
                  <p className="text-2xl font-bold">
                    {staff.filter(s => s.status === 'on-leave').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Avg Performance</p>
                  <p className="text-2xl font-bold">
                    {(staff.reduce((sum, s) => sum + s.performance, 0) / staff.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}