"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  FolderOpen, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Utensils,
  Clock,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  Settings,
  Image,
  DollarSign,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export default function MenuCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('categories');

  // Sample categories data
  const categories = [
    {
      id: 'CAT001',
      name: 'Appetizers',
      description: 'Start your meal with our delicious appetizers',
      status: 'active',
      sortOrder: 1,
      itemCount: 12,
      imageUrl: '/images/categories/appetizers.jpg',
      color: '#FF6B6B',
      icon: '🥗',
      isVisible: true,
      lastUpdated: '2024-01-20',
      totalOrders: 245,
      revenue: 12500,
      averageRating: 4.6
    },
    {
      id: 'CAT002',
      name: 'Main Courses',
      description: 'Hearty main dishes for every palate',
      status: 'active',
      sortOrder: 2,
      itemCount: 18,
      imageUrl: '/images/categories/main-courses.jpg',
      color: '#4ECDC4',
      icon: '🍽️',
      isVisible: true,
      lastUpdated: '2024-01-20',
      totalOrders: 456,
      revenue: 28750,
      averageRating: 4.8
    },
    {
      id: 'CAT003',
      name: 'Desserts',
      description: 'Sweet treats to end your meal perfectly',
      status: 'active',
      sortOrder: 3,
      itemCount: 8,
      imageUrl: '/images/categories/desserts.jpg',
      color: '#45B7D1',
      icon: '🍰',
      isVisible: true,
      lastUpdated: '2024-01-19',
      totalOrders: 189,
      revenue: 8900,
      averageRating: 4.7
    },
    {
      id: 'CAT004',
      name: 'Beverages',
      description: 'Refreshing drinks and specialty beverages',
      status: 'active',
      sortOrder: 4,
      itemCount: 15,
      imageUrl: '/images/categories/beverages.jpg',
      color: '#96CEB4',
      icon: '🥤',
      isVisible: true,
      lastUpdated: '2024-01-19',
      totalOrders: 567,
      revenue: 15600,
      averageRating: 4.5
    },
    {
      id: 'CAT005',
      name: 'Specials',
      description: 'Chef\'s special dishes and seasonal offerings',
      status: 'active',
      sortOrder: 5,
      itemCount: 6,
      imageUrl: '/images/categories/specials.jpg',
      color: '#FFEAA7',
      icon: '⭐',
      isVisible: true,
      lastUpdated: '2024-01-18',
      totalOrders: 123,
      revenue: 9800,
      averageRating: 4.9
    },
    {
      id: 'CAT006',
      name: 'Kids Menu',
      description: 'Kid-friendly meals and portions',
      status: 'inactive',
      sortOrder: 6,
      itemCount: 5,
      imageUrl: '/images/categories/kids-menu.jpg',
      color: '#DDA0DD',
      icon: '🧒',
      isVisible: false,
      lastUpdated: '2024-01-15',
      totalOrders: 67,
      revenue: 3200,
      averageRating: 4.3
    }
  ];

  const categoryStats = {
    totalCategories: categories.length,
    activeCategories: categories.filter(c => c.status === 'active').length,
    totalItems: categories.reduce((sum, c) => sum + c.itemCount, 0),
    totalOrders: categories.reduce((sum, c) => sum + c.totalOrders, 0),
    totalRevenue: categories.reduce((sum, c) => sum + c.revenue, 0),
    averageRating: categories.reduce((sum, c) => sum + c.averageRating, 0) / categories.length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
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
      case 'inactive':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'categories', label: 'Categories', icon: FolderOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Menu Categories"
        description="Manage menu categories, organize items, and track performance for your restaurant"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Menu', href: '/menu' },
          { label: 'Categories', href: '/menu/categories' }
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
                  Add Category
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search categories..."
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
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredCategories.map((category) => {
                const StatusIcon = getStatusIcon(category.status);
                return (
                  <div key={category.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl"
                            style={{ backgroundColor: category.color }}
                          >
                            {category.icon}
                          </div>
                          <div>
                            <h3 className="card-title text-lg">{category.name}</h3>
                            <p className="text-sm text-base-content/70">Sort Order: {category.sortOrder}</p>
                          </div>
                        </div>
                        <div className={`badge ${getStatusColor(category.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm bg-base-200 p-2 rounded">{category.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Items</p>
                          <p className="font-semibold">{category.itemCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Orders</p>
                          <p className="font-semibold">{category.totalOrders}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Revenue</p>
                          <p className="font-semibold">N$ {category.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Rating</p>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-warning" />
                            <span className="font-semibold">{category.averageRating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${category.isVisible ? 'bg-success' : 'bg-error'}`}></div>
                          <span className="text-sm text-base-content/70">
                            {category.isVisible ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                        <div className="text-sm text-base-content/70">
                          Updated: {category.lastUpdated}
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Category Performance</h3>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{category.icon}</span>
                          <span className="font-semibold">{category.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-warning" />
                          <span className="font-semibold">{category.averageRating}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-base-content/70">Orders</p>
                          <p className="font-semibold">{category.totalOrders}</p>
                        </div>
                        <div>
                          <p className="text-base-content/70">Revenue</p>
                          <p className="font-semibold">N$ {category.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-base-content/70">Items</p>
                          <p className="font-semibold">{category.itemCount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Revenue by Category</h3>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{category.name}</span>
                        <span className="font-semibold">N$ {category.revenue.toLocaleString()}</span>
                      </div>
                      <progress 
                        className="progress progress-primary w-full" 
                        value={(category.revenue / categoryStats.totalRevenue) * 100} 
                        max="100"
                      ></progress>
                      <p className="text-sm text-base-content/70 mt-1">
                        {((category.revenue / categoryStats.totalRevenue) * 100).toFixed(1)}% of total revenue
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Category Settings</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Default Category Color</span>
                    </label>
                    <input type="color" className="input input-bordered w-full h-12" defaultValue="#3b82f6" />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Default Sort Order</span>
                    </label>
                    <input type="number" className="input input-bordered" defaultValue="1" />
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Auto-generate sort order</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Show item count in category</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Display Settings</h3>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Categories per row</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="2">2 columns</option>
                      <option value="3" selected>3 columns</option>
                      <option value="4">4 columns</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Default image size</span>
                    </label>
                    <select className="select select-bordered">
                      <option value="small">Small</option>
                      <option value="medium" selected>Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Show category descriptions</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Show performance metrics</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
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
                  <FolderOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Categories</p>
                  <p className="text-2xl font-bold">{categoryStats.totalCategories}</p>
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
                  <p className="text-sm text-base-content/70">Active Categories</p>
                  <p className="text-2xl font-bold">{categoryStats.activeCategories}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Items</p>
                  <p className="text-2xl font-bold">{categoryStats.totalItems}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-orange-500 text-white">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Revenue</p>
                  <p className="text-2xl font-bold">N$ {categoryStats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}