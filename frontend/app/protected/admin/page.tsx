'use client';

import React from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { Shield, Users, Settings, Mail, BarChart3, Database, Bell, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const quickActions = [
    {
      title: 'Email Management',
      description: 'Configure email settings and templates',
      href: '/protected/admin/email',
      icon: Mail,
      color: 'bg-blue-500'
    },
    {
      title: 'User Management',
      description: 'Manage system users and permissions',
      href: '/protected/auth/users',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'System Settings',
      description: 'Configure system-wide settings',
      href: '/protected/auth/settings',
      icon: Settings,
      color: 'bg-purple-500'
    },
    {
      title: 'Analytics',
      description: 'View system analytics and reports',
      href: '/protected/analytics',
      icon: BarChart3,
      color: 'bg-orange-500'
    }
  ];

  const systemStats = [
    { label: 'Active Users', value: '1,247', change: '+23 this week', positive: true },
    { label: 'System Uptime', value: '99.8%', change: '+0.2%', positive: true },
    { label: 'Email Queue', value: '156', change: '-12', positive: true },
    { label: 'Database Size', value: '2.4 GB', change: '+0.3 GB', positive: false }
  ];

  const systemHealth = [
    {
      service: 'API Gateway',
      status: 'healthy',
      responseTime: '45ms',
      uptime: '99.9%',
      color: 'bg-success'
    },
    {
      service: 'Database',
      status: 'healthy',
      responseTime: '12ms',
      uptime: '99.8%',
      color: 'bg-success'
    },
    {
      service: 'Email Service',
      status: 'warning',
      responseTime: '234ms',
      uptime: '98.5%',
      color: 'bg-warning'
    },
    {
      service: 'Payment Gateway',
      status: 'healthy',
      responseTime: '67ms',
      uptime: '99.7%',
      color: 'bg-success'
    }
  ];

  const recentActivities = [
    {
      type: 'User Registration',
      description: 'New user registered: john.doe@example.com',
      time: '2 hours ago',
      icon: Users,
      color: 'bg-info'
    },
    {
      type: 'System Update',
      description: 'Email templates updated successfully',
      time: '4 hours ago',
      icon: Mail,
      color: 'bg-success'
    },
    {
      type: 'Security Alert',
      description: 'Failed login attempt detected',
      time: '6 hours ago',
      icon: Shield,
      color: 'bg-warning'
    }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Admin Dashboard"
        description="System administration, monitoring, and configuration management."
        icon={<Shield className="h-4 w-4" />}
        actions={
          <ActionButton
            onClick={() => window.location.href = '/protected/admin/email'}
            variant="primary"
          >
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </ActionButton>
        }
      />

      <div className="container mx-auto px-4 py-8">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat, index) => (
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

          {/* Recent Activities */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                    <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center`}>
                      <activity.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{activity.type}</p>
                      <p className="text-xs text-base-content/70">{activity.description}</p>
                      <p className="text-xs text-base-content/50">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="card bg-base-100 shadow-xl mt-8">
          <div className="card-body">
            <h3 className="card-title mb-6">System Health Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemHealth.map((service, index) => (
                <div key={index} className="p-4 bg-base-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{service.service}</h4>
                    <div className={`w-3 h-3 ${service.color} rounded-full`}></div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-base-content/70">Response: {service.responseTime}</p>
                    <p className="text-base-content/70">Uptime: {service.uptime}</p>
                    <p className={`font-medium ${
                      service.status === 'healthy' ? 'text-success' : 
                      service.status === 'warning' ? 'text-warning' : 'text-error'
                    }`}>
                      {service.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <Database className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="card-title">Database Status</h3>
              <p className="text-3xl font-bold text-success">Healthy</p>
              <p className="text-sm text-base-content/70">All connections active</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="card-title">API Status</h3>
              <p className="text-3xl font-bold text-success">Online</p>
              <p className="text-sm text-base-content/70">All endpoints responding</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <Bell className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="card-title">Notifications</h3>
              <p className="text-3xl font-bold text-info">3</p>
              <p className="text-sm text-base-content/70">Pending alerts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
