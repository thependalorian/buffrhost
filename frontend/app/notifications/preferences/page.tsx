"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Bell, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  Shield,
  Globe,
  Smartphone,
  
  Volume2,
  VolumeX,
  Calendar,
  Star,
  Heart,
  Zap,
  Monitor
} from 'lucide-react';

export default function NotificationPreferencesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('preferences');

  // Sample notification preferences data
  const preferences = [
    {
      id: 'PREF001',
      name: 'Booking Confirmation',
      category: 'Booking',
      description: 'Send confirmation email when a booking is made',
      channels: ['email', 'sms'],
      triggers: ['booking_created', 'booking_confirmed'],
      recipients: ['guest', 'admin', 'staff'],
      templates: ['booking_confirmation_email', 'booking_confirmation_sms'],
      status: 'enabled',
      priority: 'high',
      frequency: 'immediate',
      conditions: {
        bookingAmount: { min: 0, max: null },
        guestType: ['new', 'returning'],
        propertyType: ['all']
      },
      schedule: {
        enabled: false,
        startTime: '09:00',
        endTime: '18:00',
        timezone: 'Africa/Windhoek',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      },
      statistics: {
        sent: 1234,
        delivered: 1200,
        opened: 890,
        clicked: 234,
        deliveryRate: 97.2,
        openRate: 74.2,
        clickRate: 19.5
      }
    },
    {
      id: 'PREF002',
      name: 'Payment Reminder',
      category: 'Payment',
      description: 'Remind guests about pending payments',
      channels: ['email'],
      triggers: ['payment_due', 'payment_overdue'],
      recipients: ['guest'],
      templates: ['payment_reminder_email'],
      status: 'enabled',
      priority: 'medium',
      frequency: 'daily',
      conditions: {
        bookingAmount: { min: 1000, max: null },
        guestType: ['all'],
        propertyType: ['all']
      },
      schedule: {
        enabled: true,
        startTime: '10:00',
        endTime: '16:00',
        timezone: 'Africa/Windhoek',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      },
      statistics: {
        sent: 567,
        delivered: 550,
        opened: 345,
        clicked: 89,
        deliveryRate: 97.0,
        openRate: 62.7,
        clickRate: 16.2
      }
    },
    {
      id: 'PREF003',
      name: 'Check-in Reminder',
      category: 'Guest Experience',
      description: 'Remind guests about upcoming check-ins',
      channels: ['email', 'sms', 'push'],
      triggers: ['checkin_24h', 'checkin_2h'],
      recipients: ['guest'],
      templates: ['checkin_reminder_email', 'checkin_reminder_sms', 'checkin_reminder_push'],
      status: 'enabled',
      priority: 'high',
      frequency: 'immediate',
      conditions: {
        bookingAmount: { min: 0, max: null },
        guestType: ['all'],
        propertyType: ['all']
      },
      schedule: {
        enabled: false,
        startTime: '08:00',
        endTime: '20:00',
        timezone: 'Africa/Windhoek',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      statistics: {
        sent: 2341,
        delivered: 2289,
        opened: 1876,
        clicked: 456,
        deliveryRate: 97.8,
        openRate: 81.9,
        clickRate: 19.9
      }
    },
    {
      id: 'PREF004',
      name: 'Review Request',
      category: 'Feedback',
      description: 'Request reviews from guests after checkout',
      channels: ['email'],
      triggers: ['checkout_completed'],
      recipients: ['guest'],
      templates: ['review_request_email'],
      status: 'enabled',
      priority: 'medium',
      frequency: 'once',
      conditions: {
        bookingAmount: { min: 500, max: null },
        guestType: ['all'],
        propertyType: ['all']
      },
      schedule: {
        enabled: true,
        startTime: '10:00',
        endTime: '18:00',
        timezone: 'Africa/Windhoek',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      },
      statistics: {
        sent: 1890,
        delivered: 1834,
        opened: 1234,
        clicked: 567,
        deliveryRate: 97.0,
        openRate: 67.3,
        clickRate: 30.9
      }
    },
    {
      id: 'PREF005',
      name: 'Staff Alert',
      category: 'Internal',
      description: 'Alert staff about new bookings and issues',
      channels: ['email', 'push'],
      triggers: ['booking_created', 'issue_reported', 'maintenance_required'],
      recipients: ['staff', 'admin'],
      templates: ['staff_alert_email', 'staff_alert_push'],
      status: 'enabled',
      priority: 'high',
      frequency: 'immediate',
      conditions: {
        bookingAmount: { min: 0, max: null },
        guestType: ['all'],
        propertyType: ['all']
      },
      schedule: {
        enabled: false,
        startTime: '00:00',
        endTime: '23:59',
        timezone: 'Africa/Windhoek',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      statistics: {
        sent: 456,
        delivered: 445,
        opened: 389,
        clicked: 123,
        deliveryRate: 97.6,
        openRate: 87.4,
        clickRate: 27.6
      }
    }
  ];

  const categories = [
    { name: 'Booking', count: 1, color: 'bg-blue-500' },
    { name: 'Payment', count: 1, color: 'bg-green-500' },
    { name: 'Guest Experience', count: 1, color: 'bg-purple-500' },
    { name: 'Feedback', count: 1, color: 'bg-orange-500' },
    { name: 'Internal', count: 1, color: 'bg-red-500' }
  ];

  const channels = [
    { name: 'Email', count: 5, color: 'bg-blue-500', icon: Mail },
    { name: 'SMS', count: 2, color: 'bg-green-500', icon: Phone },
    { name: 'Push', count: 2, color: 'bg-purple-500', icon: Smartphone },
    { name: 'In-App', count: 0, color: 'bg-orange-500', icon: Monitor } // Using Monitor as substitute for Desktop
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enabled':
        return 'text-success bg-success/10';
      case 'disabled':
        return 'text-error bg-error/10';
      case 'scheduled':
        return 'text-warning bg-warning/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enabled':
        return CheckCircle;
      case 'disabled':
        return AlertCircle;
      case 'scheduled':
        return Clock;
      default:
        return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-error bg-error/10';
      case 'medium':
        return 'text-warning bg-warning/10';
      case 'low':
        return 'text-info bg-info/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return Mail;
      case 'sms':
        return Phone;
      case 'push':
        return Smartphone;
      case 'in-app':
        return Monitor; // Using Monitor as substitute for Desktop
      default:
        return Bell;
    }
  };

  const filteredPreferences = preferences.filter(pref =>
    pref.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pref.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pref.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'categories', label: 'Categories', icon: Settings },
    { id: 'channels', label: 'Channels', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Notification Preferences"
        description="Manage notification preferences, channels, categories, and delivery analytics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Notifications', href: '/notifications' },
          { label: 'Preferences', href: '/notifications/preferences' }
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
                  New Preference
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search preferences..."
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
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="Booking">Booking</option>
                    <option value="Payment">Payment</option>
                    <option value="Guest Experience">Guest Experience</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Internal">Internal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preferences Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredPreferences.map((pref) => {
                const StatusIcon = getStatusIcon(pref.status);
                return (
                  <div key={pref.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="card-title text-lg">{pref.name}</h3>
                          <p className="text-sm text-base-content/70">{pref.category}</p>
                          <p className="text-sm font-semibold">{pref.frequency}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(pref.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {pref.status.charAt(0).toUpperCase() + pref.status.slice(1)}
                          </div>
                          <div className={`badge ${getPriorityColor(pref.priority)}`}>
                            {pref.priority.charAt(0).toUpperCase() + pref.priority.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm bg-base-200 p-2 rounded">{pref.description}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Channels</p>
                        <div className="flex flex-wrap gap-1">
                          {pref.channels.map((channel, index) => {
                            const ChannelIcon = getChannelIcon(channel);
                            return (
                              <span key={index} className="badge badge-outline badge-sm">
                                <ChannelIcon className="w-3 h-3 mr-1" />
                                {channel.charAt(0).toUpperCase() + channel.slice(1)}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Triggers</p>
                        <div className="flex flex-wrap gap-1">
                          {pref.triggers.map((trigger, index) => (
                            <span key={index} className="badge badge-secondary badge-sm">
                              {trigger.charAt(0).toUpperCase() + trigger.slice(1)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Recipients</p>
                        <div className="flex flex-wrap gap-1">
                          {pref.recipients.map((recipient, index) => (
                            <span key={index} className="badge badge-primary badge-sm">
                              {recipient.charAt(0).toUpperCase() + recipient.slice(1)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Sent</p>
                          <p className="font-semibold">{pref.statistics.sent.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Delivered</p>
                          <p className="font-semibold text-success">{pref.statistics.deliveryRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Opened</p>
                          <p className="font-semibold text-info">{pref.statistics.openRate}%</p>
                        </div>
                      </div>

                      {pref.schedule.enabled && (
                        <div className="mb-4">
                          <p className="text-xs text-base-content/70 mb-1">Schedule</p>
                          <p className="text-sm bg-warning/10 p-2 rounded">
                            {pref.schedule.startTime} - {pref.schedule.endTime} ({pref.schedule.timezone})
                          </p>
                        </div>
                      )}

                      <div className="card-actions justify-end">
                        <button className="btn btn-ghost btn-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {categories.map((category, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-lg ${category.color} text-white`}>
                      <Bell className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="card-title text-lg">{category.name}</h3>
                      <p className="text-sm text-base-content/70">{category.count} preferences</p>
                    </div>
                  </div>
                  <div className="card-actions justify-end">
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Channels Tab */}
        {activeTab === 'channels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {channels.map((channel, index) => {
              const ChannelIcon = channel.icon;
              return (
                <div key={index} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-3 rounded-lg ${channel.color} text-white`}>
                        <ChannelIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="card-title text-lg">{channel.name}</h3>
                        <p className="text-sm text-base-content/70">{channel.count} preferences</p>
                      </div>
                    </div>
                    <div className="card-actions justify-end">
                      <button className="btn btn-ghost btn-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Preference Performance</h3>
                <div className="space-y-4">
                  {preferences.map((pref) => (
                    <div key={pref.id} className="p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{pref.name}</span>
                        <span className="font-semibold text-success">{pref.statistics.deliveryRate}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{pref.statistics.sent.toLocaleString()} sent</span>
                        <span>{pref.statistics.openRate}% opened</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Channel Analytics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Preferences</span>
                    <span className="font-semibold">{preferences.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enabled Preferences</span>
                    <span className="font-semibold text-success">
                      {preferences.filter(p => p.status === 'enabled').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Sent</span>
                    <span className="font-semibold">
                      {preferences.reduce((sum, p) => sum + p.statistics.sent, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Delivery Rate</span>
                    <span className="font-semibold">
                      {(preferences.reduce((sum, p) => sum + p.statistics.deliveryRate, 0) / preferences.length).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Open Rate</span>
                    <span className="font-semibold">
                      {(preferences.reduce((sum, p) => sum + p.statistics.openRate, 0) / preferences.length).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-blue-500 text-white">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Preferences</p>
                  <p className="text-2xl font-bold">{preferences.length}</p>
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
                  <p className="text-sm text-base-content/70">Enabled</p>
                  <p className="text-2xl font-bold">
                    {preferences.filter(p => p.status === 'enabled').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Sent</p>
                  <p className="text-2xl font-bold">
                    {preferences.reduce((sum, p) => sum + p.statistics.sent, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Avg Open Rate</p>
                  <p className="text-2xl font-bold">
                    {(preferences.reduce((sum, p) => sum + p.statistics.openRate, 0) / preferences.length).toFixed(1)}%
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