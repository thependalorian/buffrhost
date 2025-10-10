"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Megaphone, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Send,
  Calendar,
  Users,
  TrendingUp,
  Target,
  BarChart3,
  Mail,
  Share2,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle,
  Image,
  Video,
  FileText,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';

export default function EtunaMarketingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('campaigns');

  // Sample marketing data
  const campaigns = [
    {
      id: 'CAMP001',
      name: 'Summer Wildlife Experience',
      type: 'Email',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      budget: 15000,
      spent: 8500,
      targetAudience: 'Wildlife Enthusiasts',
      impressions: 12500,
      clicks: 1250,
      conversions: 45,
      ctr: 10.0,
      conversionRate: 3.6,
      roi: 180
    },
    {
      id: 'CAMP002',
      name: 'Corporate Retreat Package',
      type: 'Social Media',
      status: 'paused',
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      budget: 8000,
      spent: 3200,
      targetAudience: 'Business Executives',
      impressions: 8500,
      clicks: 425,
      conversions: 12,
      ctr: 5.0,
      conversionRate: 2.8,
      roi: 150
    },
    {
      id: 'CAMP003',
      name: 'Romantic Getaway Special',
      type: 'Google Ads',
      status: 'completed',
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      budget: 5000,
      spent: 5000,
      targetAudience: 'Couples',
      impressions: 15000,
      clicks: 900,
      conversions: 28,
      ctr: 6.0,
      conversionRate: 3.1,
      roi: 220
    }
  ];

  const emailTemplates = [
    {
      id: 'TMPL001',
      name: 'Welcome Series - New Guest',
      subject: 'Welcome to Etuna Guesthouse!',
      category: 'Welcome',
      status: 'active',
      openRate: 28.5,
      clickRate: 4.2,
      sent: 1250,
      opens: 356,
      clicks: 52,
      lastUsed: '2024-01-20'
    },
    {
      id: 'TMPL002',
      name: 'Tour Promotion - Etosha Safari',
      subject: 'Experience Etosha National Park',
      category: 'Promotion',
      status: 'active',
      openRate: 32.1,
      clickRate: 6.8,
      sent: 890,
      opens: 286,
      clicks: 61,
      lastUsed: '2024-01-19'
    },
    {
      id: 'TMPL003',
      name: 'Restaurant Special Offer',
      subject: 'Fine Dining Experience Awaits',
      category: 'Restaurant',
      status: 'draft',
      openRate: 0,
      clickRate: 0,
      sent: 0,
      opens: 0,
      clicks: 0,
      lastUsed: null
    }
  ];

  const socialMediaPosts = [
    {
      id: 'POST001',
      platform: 'Instagram',
      content: 'Sunset over Etosha National Park 🌅 #EtunaGuesthouse #Wildlife #Namibia',
      type: 'Image',
      status: 'published',
      publishDate: '2024-01-20 18:00',
      likes: 156,
      comments: 23,
      shares: 12,
      reach: 1250,
      engagement: 15.3
    },
    {
      id: 'POST002',
      platform: 'Facebook',
      content: 'Join us for an unforgettable wildlife experience! Book your Etosha safari tour today.',
      type: 'Video',
      status: 'scheduled',
      publishDate: '2024-01-22 14:00',
      likes: 0,
      comments: 0,
      shares: 0,
      reach: 0,
      engagement: 0
    },
    {
      id: 'POST003',
      platform: 'Twitter',
      content: 'Our guests love the authentic Namibian cuisine at our restaurant. Try our signature dishes!',
      type: 'Text',
      status: 'published',
      publishDate: '2024-01-19 12:30',
      likes: 45,
      comments: 8,
      shares: 5,
      reach: 890,
      engagement: 6.5
    }
  ];

  const analytics = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
    totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
    totalImpressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
    totalClicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
    totalConversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
    averageCtr: campaigns.reduce((sum, c) => sum + c.ctr, 0) / campaigns.length,
    averageConversionRate: campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length,
    averageRoi: campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'paused':
        return 'text-warning bg-warning/10';
      case 'completed':
        return 'text-info bg-info/10';
      case 'draft':
        return 'text-base-content bg-base-300';
      case 'published':
        return 'text-success bg-success/10';
      case 'scheduled':
        return 'text-warning bg-warning/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return Play;
      case 'paused':
        return Pause;
      case 'completed':
        return CheckCircle;
      case 'draft':
        return FileText;
      case 'published':
        return CheckCircle;
      case 'scheduled':
        return Clock;
      default:
        return Megaphone;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Email':
        return Mail;
      case 'Social Media':
        return Share2;
      case 'Google Ads':
        return Target;
      case 'Image':
        return Image;
      case 'Video':
        return Video;
      case 'Text':
        return FileText;
      default:
        return Megaphone;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return Image;
      case 'Facebook':
        return Users;
      case 'Twitter':
        return Share2;
      default:
        return Globe;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.targetAudience.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'email', label: 'Email Marketing', icon: Mail },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Marketing Management"
        description="Manage marketing campaigns, email marketing, and social media for Etuna Guesthouse"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Etuna Management', href: '/protected/etuna' },
          { label: 'Marketing', href: '/protected/etuna/marketing' }
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
                  New Campaign
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search campaigns..."
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
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredCampaigns.map((campaign) => {
                const StatusIcon = getStatusIcon(campaign.status);
                const TypeIcon = getTypeIcon(campaign.type);
                return (
                  <div key={campaign.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="card-title text-lg">{campaign.name}</h3>
                          <p className="text-sm text-base-content/70">{campaign.type}</p>
                          <p className="text-sm font-semibold">{campaign.targetAudience}</p>
                        </div>
                        <div className={`badge ${getStatusColor(campaign.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm">{campaign.startDate} - {campaign.endDate}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <TypeIcon className="w-4 h-4 text-primary" />
                          <span className="text-sm">{campaign.type}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Target className="w-4 h-4 text-primary" />
                          <span className="text-sm">{campaign.targetAudience}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Budget</p>
                          <p className="font-semibold">N$ {campaign.budget.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Spent</p>
                          <p className="font-semibold">N$ {campaign.spent.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-base-content/70">Budget Usage</span>
                          <span className="text-xs font-semibold">
                            {Math.round((campaign.spent / campaign.budget) * 100)}%
                          </span>
                        </div>
                        <progress 
                          className="progress progress-primary w-full" 
                          value={(campaign.spent / campaign.budget) * 100} 
                          max="100"
                        ></progress>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">CTR</p>
                          <p className="font-semibold">{campaign.ctr}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">ROI</p>
                          <p className="font-semibold">{campaign.roi}%</p>
                        </div>
                      </div>

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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Email Marketing Tab */}
        {activeTab === 'email' && (
          <div className="space-y-6 mb-8">
            {emailTemplates.map((template) => {
              const StatusIcon = getStatusIcon(template.status);
              return (
                <div key={template.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="card-title text-lg">{template.name}</h3>
                        <p className="text-sm text-base-content/70">{template.subject}</p>
                        <p className="text-sm font-semibold">{template.category}</p>
                      </div>
                      <div className={`badge ${getStatusColor(template.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-base-content/70">Open Rate</p>
                        <p className="font-semibold">{template.openRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Click Rate</p>
                        <p className="font-semibold">{template.clickRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Sent</p>
                        <p className="font-semibold">{template.sent}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Opens</p>
                        <p className="font-semibold">{template.opens}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-base-content/70">
                        Last used: {template.lastUsed || 'Never'}
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn btn-ghost btn-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6 mb-8">
            {socialMediaPosts.map((post) => {
              const StatusIcon = getStatusIcon(post.status);
              const PlatformIcon = getPlatformIcon(post.platform);
              const TypeIcon = getTypeIcon(post.type);
              return (
                <div key={post.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <PlatformIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{post.platform}</h3>
                          <p className="text-sm text-base-content/70">{post.type} Post</p>
                          <p className="text-sm font-medium">{post.publishDate}</p>
                        </div>
                      </div>
                      <div className={`badge ${getStatusColor(post.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm bg-base-200 p-3 rounded-lg">
                        {post.content}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-base-content/70">Likes</p>
                        <p className="font-semibold">{post.likes}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Comments</p>
                        <p className="font-semibold">{post.comments}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Shares</p>
                        <p className="font-semibold">{post.shares}</p>
                      </div>
                      <div>
                        <p className="text-xs text-base-content/70">Reach</p>
                        <p className="font-semibold">{post.reach}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-base-content/70">
                        Engagement Rate: {post.engagement}%
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn btn-ghost btn-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
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
                <h3 className="card-title mb-6">Campaign Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Impressions</span>
                    <span className="font-semibold">{analytics.totalImpressions.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Clicks</span>
                    <span className="font-semibold">{analytics.totalClicks.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Conversions</span>
                    <span className="font-semibold">{analytics.totalConversions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average CTR</span>
                    <span className="font-semibold">{analytics.averageCtr.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Conversion Rate</span>
                    <span className="font-semibold">{analytics.averageConversionRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Budget & ROI</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Budget</span>
                    <span className="font-semibold">N$ {analytics.totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Spent</span>
                    <span className="font-semibold">N$ {analytics.totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Budget Remaining</span>
                    <span className="font-semibold">N$ {(analytics.totalBudget - analytics.totalSpent).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average ROI</span>
                    <span className="font-semibold text-success">{analytics.averageRoi.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Budget Utilization</span>
                    <span className="font-semibold">
                      {Math.round((analytics.totalSpent / analytics.totalBudget) * 100)}%
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
                  <Megaphone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Campaigns</p>
                  <p className="text-2xl font-bold">{analytics.totalCampaigns}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-green-500 text-white">
                  <Play className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Active Campaigns</p>
                  <p className="text-2xl font-bold">{analytics.activeCampaigns}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Conversions</p>
                  <p className="text-2xl font-bold">{analytics.totalConversions}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Avg ROI</p>
                  <p className="text-2xl font-bold">{analytics.averageRoi.toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}