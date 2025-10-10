"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  Target,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Activity,
  BarChart3
} from 'lucide-react';

export default function EtunaCRMPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('leads');

  // Sample CRM data
  const leads = [
    {
      id: 'LEAD001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+264 81 123 4567',
      company: 'Smith Enterprises',
      source: 'Website',
      status: 'new',
      priority: 'high',
      value: 15000,
      assignedTo: 'Sarah van der Merwe',
      lastContact: '2024-01-20',
      nextFollowUp: '2024-01-22',
      notes: 'Interested in corporate retreat package',
      tags: ['Corporate', 'High Value', 'Repeat Customer']
    },
    {
      id: 'LEAD002',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+264 81 234 5678',
      company: 'Garcia Travel',
      source: 'Referral',
      status: 'qualified',
      priority: 'medium',
      value: 8500,
      assignedTo: 'Peter Mwangi',
      lastContact: '2024-01-19',
      nextFollowUp: '2024-01-25',
      notes: 'Looking for family vacation package',
      tags: ['Family', 'Referral', 'Tour Interest']
    },
    {
      id: 'LEAD003',
      name: 'David Johnson',
      email: 'david.johnson@email.com',
      phone: '+264 81 345 6789',
      company: 'Johnson Corp',
      source: 'Social Media',
      status: 'proposal',
      priority: 'high',
      value: 25000,
      assignedTo: 'Michael Brown',
      lastContact: '2024-01-18',
      nextFollowUp: '2024-01-21',
      notes: 'Corporate team building event',
      tags: ['Corporate', 'Team Building', 'High Value']
    },
    {
      id: 'LEAD004',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+264 81 456 7890',
      company: 'Wilson Group',
      source: 'Email Campaign',
      status: 'negotiation',
      priority: 'medium',
      value: 12000,
      assignedTo: 'Anna Schmidt',
      lastContact: '2024-01-17',
      nextFollowUp: '2024-01-23',
      notes: 'Wedding anniversary celebration',
      tags: ['Romantic', 'Special Occasion', 'Restaurant']
    }
  ];

  const customers = [
    {
      id: 'CUST001',
      name: 'Robert Brown',
      email: 'robert.brown@email.com',
      phone: '+264 81 567 8901',
      company: 'Brown Industries',
      status: 'active',
      totalSpent: 45000,
      lastVisit: '2024-01-15',
      visits: 8,
      loyaltyPoints: 1250,
      preferences: ['Wildlife Tours', 'Fine Dining', 'Spa Services'],
      notes: 'VIP customer, prefers suite accommodations'
    },
    {
      id: 'CUST002',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      phone: '+264 81 678 9012',
      company: 'Anderson Travel',
      status: 'active',
      totalSpent: 32000,
      lastVisit: '2024-01-10',
      visits: 5,
      loyaltyPoints: 890,
      preferences: ['Photography Tours', 'Local Cuisine', 'Cultural Experiences'],
      notes: 'Photography enthusiast, books private tours'
    }
  ];

  const activities = [
    {
      id: 'ACT001',
      type: 'call',
      subject: 'Follow-up call with John Smith',
      contact: 'John Smith',
      date: '2024-01-20 14:30',
      duration: '15 minutes',
      outcome: 'Interested in corporate package',
      nextAction: 'Send proposal',
      assignedTo: 'Sarah van der Merwe'
    },
    {
      id: 'ACT002',
      type: 'email',
      subject: 'Proposal sent to David Johnson',
      contact: 'David Johnson',
      date: '2024-01-20 10:15',
      duration: '5 minutes',
      outcome: 'Proposal delivered',
      nextAction: 'Follow up in 2 days',
      assignedTo: 'Michael Brown'
    },
    {
      id: 'ACT003',
      type: 'meeting',
      subject: 'Site visit with Maria Garcia',
      contact: 'Maria Garcia',
      date: '2024-01-19 16:00',
      duration: '45 minutes',
      outcome: 'Very interested, needs family package',
      nextAction: 'Prepare custom proposal',
      assignedTo: 'Peter Mwangi'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'text-info bg-info/10';
      case 'qualified':
        return 'text-primary bg-primary/10';
      case 'proposal':
        return 'text-warning bg-warning/10';
      case 'negotiation':
        return 'text-orange-500 bg-orange-500/10';
      case 'closed-won':
        return 'text-success bg-success/10';
      case 'closed-lost':
        return 'text-error bg-error/10';
      case 'active':
        return 'text-success bg-success/10';
      case 'inactive':
        return 'text-base-content bg-base-300';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return UserPlus;
      case 'qualified':
        return CheckCircle;
      case 'proposal':
        return Target;
      case 'negotiation':
        return Activity;
      case 'closed-won':
        return CheckCircle;
      case 'closed-lost':
        return AlertCircle;
      case 'active':
        return CheckCircle;
      case 'inactive':
        return Clock;
      default:
        return Users;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'badge-error';
      case 'medium':
        return 'badge-warning';
      case 'low':
        return 'badge-success';
      default:
        return 'badge-neutral';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return Phone;
      case 'email':
        return Mail;
      case 'meeting':
        return Calendar;
      default:
        return Activity;
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: 'leads', label: 'Leads', icon: Target },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="CRM Management"
        description="Manage leads, customers, and sales activities for Etuna Guesthouse"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Etuna Management', href: '/protected/etuna' },
          { label: 'CRM', href: '/protected/etuna/crm' }
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
                  Add Lead
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search leads..."
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
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="closed-won">Closed Won</option>
                    <option value="closed-lost">Closed Lost</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Leads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredLeads.map((lead) => {
                const StatusIcon = getStatusIcon(lead.status);
                return (
                  <div key={lead.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="card-title text-lg">{lead.name}</h3>
                          <p className="text-sm text-base-content/70">{lead.company}</p>
                          <p className="text-sm font-semibold">{lead.source}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(lead.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </div>
                          <span className={`badge ${getPriorityColor(lead.priority)}`}>
                            {lead.priority}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="text-sm">{lead.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="text-sm">{lead.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm">Last: {lead.lastContact}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Value</p>
                          <p className="font-semibold">N$ {lead.value.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Assigned To</p>
                          <p className="font-semibold text-sm">{lead.assignedTo}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Tags</p>
                        <div className="flex flex-wrap gap-1">
                          {lead.tags.map((tag, index) => (
                            <span key={index} className="badge badge-outline badge-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-1">Notes</p>
                        <p className="text-sm bg-base-200 p-2 rounded">{lead.notes}</p>
                      </div>

                      <div className="card-actions justify-end">
                        <button className="btn btn-ghost btn-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {customers.map((customer) => {
              const StatusIcon = getStatusIcon(customer.status);
              return (
                <div key={customer.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="card-title text-lg">{customer.name}</h3>
                        <p className="text-sm text-base-content/70">{customer.company}</p>
                        <p className="text-sm font-semibold">Customer since 2023</p>
                      </div>
                      <div className={`badge ${getStatusColor(customer.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm">Last visit: {customer.lastVisit}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-base-content/70">Total Spent</p>
                        <p className="font-semibold">N$ {customer.totalSpent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Visits</p>
                        <p className="font-semibold">{customer.visits}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-base-content/70 mb-2">Loyalty Points</p>
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-error" />
                        <span className="font-semibold">{customer.loyaltyPoints}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-base-content/70 mb-2">Preferences</p>
                      <div className="flex flex-wrap gap-1">
                        {customer.preferences.map((pref, index) => (
                          <span key={index} className="badge badge-primary badge-sm">
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-base-content/70 mb-1">Notes</p>
                      <p className="text-sm bg-base-200 p-2 rounded">{customer.notes}</p>
                    </div>

                    <div className="card-actions justify-end">
                      <button className="btn btn-ghost btn-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="space-y-4 mb-8">
            {activities.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <ActivityIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{activity.subject}</h3>
                          <p className="text-sm text-base-content/70">Contact: {activity.contact}</p>
                          <p className="text-sm font-medium">Assigned to: {activity.assignedTo}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{activity.date}</p>
                        <p className="text-sm text-base-content/70">{activity.duration}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm bg-base-200 p-3 rounded-lg">
                        <strong>Outcome:</strong> {activity.outcome}
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm bg-info/10 p-3 rounded-lg border-l-4 border-info">
                        <strong>Next Action:</strong> {activity.nextAction}
                      </p>
                    </div>

                    <div className="card-actions justify-end">
                      <button className="btn btn-ghost btn-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Calendar className="w-4 h-4" />
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
                <h3 className="card-title mb-6">Lead Conversion Funnel</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New Leads</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Qualified</span>
                    <span className="font-semibold">18 (75%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Proposals Sent</span>
                    <span className="font-semibold">12 (67%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Negotiations</span>
                    <span className="font-semibold">8 (67%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Closed Won</span>
                    <span className="font-semibold">6 (75%)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Revenue by Source</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Website</span>
                    <span className="font-semibold">N$ 45,000 (40%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Referrals</span>
                    <span className="font-semibold">N$ 32,000 (28%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Social Media</span>
                    <span className="font-semibold">N$ 25,000 (22%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Campaigns</span>
                    <span className="font-semibold">N$ 12,000 (10%)</span>
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
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Leads</p>
                  <p className="text-2xl font-bold">{leads.length}</p>
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
                  <p className="text-sm text-base-content/70">Qualified Leads</p>
                  <p className="text-2xl font-bold">
                    {leads.filter(l => l.status === 'qualified' || l.status === 'proposal' || l.status === 'negotiation').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Active Customers</p>
                  <p className="text-2xl font-bold">
                    {customers.filter(c => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Pipeline Value</p>
                  <p className="text-2xl font-bold">
                    N$ {leads.reduce((sum, lead) => sum + lead.value, 0).toLocaleString()}
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