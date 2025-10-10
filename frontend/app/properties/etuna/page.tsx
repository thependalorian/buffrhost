'use client';

import React from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Bed, 
  Utensils, 
  Car, 
  DollarSign, 
  Mail, 
  UserCheck, 
  Target, 
  Megaphone, 
  FileText, 
  Receipt, 
  Settings,
  TrendingUp,
  Activity,
  Star,
  Clock,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

export default function EtunaDashboardPage() {
  // Navigation items for Etuna management
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/protected/etuna',
      icon: BarChart3,
      current: true,
      description: 'Overview of Etuna operations'
    },
    {
      name: 'Reservations',
      href: '/protected/etuna/reservations',
      icon: Calendar,
      description: 'Manage room reservations and bookings'
    },
    {
      name: 'Guest Management',
      href: '/protected/etuna/guests',
      icon: Users,
      description: 'Guest check-ins, profiles, and history'
    },
    {
      name: 'Room Management',
      href: '/protected/etuna/rooms',
      icon: Bed,
      description: 'Room inventory, status, and maintenance'
    },
    {
      name: 'Restaurant',
      href: '/protected/etuna/restaurant',
      icon: Utensils,
      description: 'Menu management and order tracking'
    },
    {
      name: 'Tours & Activities',
      href: '/protected/etuna/tours',
      icon: Car,
      description: 'Tour bookings and activity scheduling'
    },
    {
      name: 'Financial Reports',
      href: '/protected/etuna/finance',
      icon: DollarSign,
      description: 'Revenue, expenses, and financial analytics'
    },
    {
      name: 'Analytics',
      href: '/protected/etuna/analytics',
      icon: BarChart3,
      description: 'Performance metrics and insights'
    },
    {
      name: 'Communications',
      href: '/protected/etuna/communications',
      icon: Mail,
      description: 'Guest communications and notifications'
    },
    {
      name: 'Staff Management',
      href: '/protected/etuna/staff',
      icon: UserCheck,
      description: 'Staff scheduling and HR management'
    },
    {
      name: 'CRM & Leads',
      href: '/protected/etuna/crm',
      icon: Target,
      description: 'Customer relationship management'
    },
    {
      name: 'Marketing',
      href: '/protected/etuna/marketing',
      icon: Megaphone,
      description: 'Marketing automation and campaigns'
    },
    {
      name: 'Content Management',
      href: '/protected/etuna/cms',
      icon: FileText,
      description: 'CMS for all content types and media'
    },
    {
      name: 'Invoice Generation',
      href: '/protected/etuna/invoices',
      icon: Receipt,
      description: 'Automated invoice generation and management'
    },
    {
      name: 'Property Settings',
      href: '/protected/etuna/settings',
      icon: Settings,
      description: 'Property configuration and preferences'
    }
  ];

  // Quick actions for Etuna management
  const quickActions = [
    {
      name: 'New Reservation',
      href: '/protected/etuna/reservations',
      icon: Calendar,
      description: 'Create a new room booking',
      color: 'bg-blue-500'
    },
    {
      name: 'Guest Check-in',
      href: '/protected/etuna/guests',
      icon: Users,
      description: 'Process guest arrival',
      color: 'bg-green-500'
    },
    {
      name: 'Restaurant Orders',
      href: '/protected/etuna/restaurant',
      icon: Utensils,
      description: 'Manage dining orders',
      color: 'bg-orange-500'
    },
    {
      name: 'View Analytics',
      href: '/protected/etuna/analytics',
      icon: BarChart3,
      description: 'Check performance metrics',
      color: 'bg-purple-500'
    }
  ];

  // Dashboard stats
  const stats = [
    { label: 'Total Reservations', value: '47', change: '+12%', positive: true },
    { label: 'Occupancy Rate', value: '78%', change: '+5%', positive: true },
    { label: 'Revenue Today', value: 'N$ 8,450', change: '+18%', positive: true },
    { label: 'Guest Satisfaction', value: '4.8/5', change: '+0.2', positive: true }
  ];

  // Recent activities
  const recentActivities = [
    {
      type: 'Reservation',
      description: 'New booking for Room 101 - 3 nights',
      time: '2 minutes ago',
      icon: Calendar,
      color: 'text-blue-500'
    },
    {
      type: 'Check-in',
      description: 'Guest checked into Room 205',
      time: '15 minutes ago',
      icon: Users,
      color: 'text-green-500'
    },
    {
      type: 'Restaurant',
      description: 'New order from Room 102',
      time: '25 minutes ago',
      icon: Utensils,
      color: 'text-orange-500'
    },
    {
      type: 'Tour',
      description: 'Etosha National Park tour booked',
      time: '1 hour ago',
      icon: Car,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Etuna Guesthouse Dashboard"
        description="Comprehensive management for Etuna Guesthouse and Tours"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Etuna Management', href: '/protected/etuna' }
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
                <div className="card-body">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${action.color} text-white`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{action.name}</h3>
                      <p className="text-sm text-base-content/70">{action.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

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
          {/* Navigation Menu */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Management Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {navigationItems.map((item, index) => (
                    <Link key={index} href={item.href}>
                      <div className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg cursor-pointer ${
                        item.current ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <item.icon className={`w-5 h-5 ${item.current ? 'text-primary' : 'text-base-content/70'}`} />
                          <div>
                            <h4 className={`font-semibold ${item.current ? 'text-primary' : 'text-base-content'}`}>
                              {item.name}
                            </h4>
                            <p className="text-sm text-base-content/70">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Recent Activities</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <activity.icon className={`w-5 h-5 mt-1 ${activity.color}`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.description}</p>
                        <p className="text-xs text-base-content/70">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href="/protected/etuna/activities">
                    <ActionButton variant="outline" size="sm" className="w-full">
                      View All Activities
                    </ActionButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Information */}
        <div className="mt-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-6">Etuna Guesthouse Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-sm text-base-content/70">Windhoek, Namibia</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Bed className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Rooms</p>
                    <p className="text-sm text-base-content/70">12 Rooms Available</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Rating</p>
                    <p className="text-sm text-base-content/70">4.8/5 Stars</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Check-in</p>
                    <p className="text-sm text-base-content/70">2:00 PM - 10:00 PM</p>
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