'use client';

import React from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { Users, UserPlus, Calendar, DollarSign, FileText, Settings } from 'lucide-react';
import Link from 'next/link';

export default function HRDashboardPage() {
  const quickActions = [
    {
      title: 'Employee Management',
      description: 'Manage employee records and information',
      href: '/protected/hr/employees',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Payroll Management',
      description: 'Handle payroll processing and records',
      href: '/protected/hr/payroll',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Benefits Administration',
      description: 'Manage employee benefits and packages',
      href: '/protected/hr/benefits',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      title: 'Tax Management',
      description: 'Handle tax calculations and reporting',
      href: '/protected/hr/tax',
      icon: Settings,
      color: 'bg-orange-500'
    }
  ];

  const stats = [
    { label: 'Total Employees', value: '47', change: '+3 this month', positive: true },
    { label: 'Active Payroll', value: 'N$ 89,500', change: '+5.2%', positive: true },
    { label: 'Pending Approvals', value: '12', change: '-2', positive: true },
    { label: 'Benefits Coverage', value: '94%', change: '+2%', positive: true }
  ];

  const recentActivities = [
    {
      type: 'New Employee',
      name: 'Sarah Johnson',
      position: 'Front Desk Manager',
      time: '2 hours ago',
      icon: UserPlus,
      color: 'bg-success'
    },
    {
      type: 'Payroll Processed',
      name: 'Monthly Payroll',
      position: 'All employees',
      time: '1 day ago',
      icon: DollarSign,
      color: 'bg-info'
    },
    {
      type: 'Benefits Updated',
      name: 'Health Insurance',
      position: 'Coverage increased',
      time: '3 days ago',
      icon: FileText,
      color: 'bg-warning'
    }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="HR Dashboard"
        description="Manage your human resources, payroll, and employee administration."
        icon={<Users className="h-4 w-4" />}
        actions={
          <ActionButton
            onClick={() => window.location.href = '/protected/hr/employees'}
            variant="primary"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </ActionButton>
        }
      />

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-base-content/70">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`text-sm ${stat.positive ? 'text-success' : 'text-error'}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                  <div className="card-body text-center">
                    <div className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-base-content/70">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">Recent HR Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                    <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center`}>
                      <activity.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{activity.name}</p>
                      <p className="text-sm text-base-content/70">{activity.position}</p>
                      <p className="text-xs text-base-content/50">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card bg-base-100 shadow-xl mt-8">
          <div className="card-body">
            <h3 className="card-title mb-4">Upcoming HR Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-base-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Payroll Processing</p>
                    <p className="text-sm text-base-content/70">Due: March 15, 2024</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-base-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Performance Reviews</p>
                    <p className="text-sm text-base-content/70">Due: March 20, 2024</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-base-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Benefits Enrollment</p>
                    <p className="text-sm text-base-content/70">Due: March 25, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
