"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Utensils, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  DollarSign,
  Star,
  Coffee,
  Wine,
  ChefHat,
  Receipt,
  Calendar
} from 'lucide-react';

export default function EtunaRestaurantPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('orders');

  // Sample order data
  const orders = [
    {
      id: 'ORD001',
      roomNumber: '101',
      guestName: 'John Smith',
      items: [
        { name: 'Grilled Springbok', quantity: 1, price: 280 },
        { name: 'Namibian Lager', quantity: 2, price: 45 },
        { name: 'Chocolate Mousse', quantity: 1, price: 85 }
      ],
      totalAmount: 455,
      status: 'preparing',
      orderTime: '2024-01-20 19:30',
      estimatedTime: '20:15',
      specialRequests: 'Medium rare, extra sauce'
    },
    {
      id: 'ORD002',
      roomNumber: '205',
      guestName: 'Maria Garcia',
      items: [
        { name: 'Vegetarian Curry', quantity: 1, price: 195 },
        { name: 'Fresh Juice', quantity: 1, price: 35 }
      ],
      totalAmount: 230,
      status: 'ready',
      orderTime: '2024-01-20 19:45',
      estimatedTime: '20:00',
      specialRequests: 'No dairy, mild spice'
    },
    {
      id: 'ORD003',
      roomNumber: '102',
      guestName: 'David Johnson',
      items: [
        { name: 'Fish and Chips', quantity: 1, price: 220 },
        { name: 'Craft Beer', quantity: 1, price: 55 },
        { name: 'Ice Cream', quantity: 2, price: 60 }
      ],
      totalAmount: 335,
      status: 'delivered',
      orderTime: '2024-01-20 18:15',
      estimatedTime: '19:00',
      specialRequests: 'Extra crispy chips'
    },
    {
      id: 'ORD004',
      roomNumber: '301',
      guestName: 'Sarah Wilson',
      items: [
        { name: 'Romantic Dinner Set', quantity: 1, price: 450 },
        { name: 'Wine Selection', quantity: 1, price: 180 }
      ],
      totalAmount: 630,
      status: 'preparing',
      orderTime: '2024-01-20 20:00',
      estimatedTime: '20:45',
      specialRequests: 'Anniversary celebration setup'
    }
  ];

  // Sample menu data
  const menuItems = [
    {
      id: 'MENU001',
      name: 'Grilled Springbok',
      category: 'Main Course',
      price: 280,
      description: 'Tender springbok fillet grilled to perfection',
      ingredients: ['Springbok', 'Herbs', 'Olive Oil'],
      allergens: ['None'],
      isAvailable: true,
      prepTime: 25,
      rating: 4.8
    },
    {
      id: 'MENU002',
      name: 'Vegetarian Curry',
      category: 'Main Course',
      price: 195,
      description: 'Spiced vegetable curry with coconut milk',
      ingredients: ['Mixed Vegetables', 'Coconut Milk', 'Curry Spices'],
      allergens: ['Coconut'],
      isAvailable: true,
      prepTime: 20,
      rating: 4.6
    },
    {
      id: 'MENU003',
      name: 'Fish and Chips',
      category: 'Main Course',
      price: 220,
      description: 'Fresh fish with crispy chips',
      ingredients: ['Fresh Fish', 'Potatoes', 'Batter'],
      allergens: ['Fish', 'Gluten'],
      isAvailable: true,
      prepTime: 15,
      rating: 4.5
    },
    {
      id: 'MENU004',
      name: 'Chocolate Mousse',
      category: 'Dessert',
      price: 85,
      description: 'Rich chocolate mousse with berries',
      ingredients: ['Dark Chocolate', 'Cream', 'Berries'],
      allergens: ['Dairy', 'Eggs'],
      isAvailable: true,
      prepTime: 10,
      rating: 4.9
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'text-success bg-success/10';
      case 'preparing':
        return 'text-warning bg-warning/10';
      case 'delivered':
        return 'text-info bg-info/10';
      case 'cancelled':
        return 'text-error bg-error/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return CheckCircle;
      case 'preparing':
        return Clock;
      case 'delivered':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      default:
        return Utensils;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.roomNumber.includes(searchTerm) ||
                         order.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: 'orders', label: 'Orders', icon: Receipt },
    { id: 'menu', label: 'Menu', icon: Utensils },
    { id: 'analytics', label: 'Analytics', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Restaurant Management"
        description="Manage restaurant orders, menu, and dining services for Etuna Guesthouse"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Etuna Management', href: '/protected/etuna' },
          { label: 'Restaurant', href: '/protected/etuna/restaurant' }
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
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
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            {/* Action Bar */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="form-control">
                      <div className="input-group">
                        <input
                          type="text"
                          placeholder="Search orders..."
                          className="input input-bordered w-full md:w-80"
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
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <ActionButton variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </ActionButton>
                    <ActionButton>
                      <Plus className="w-4 h-4 mr-2" />
                      New Order
                    </ActionButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <div key={order.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="card-title text-lg">Order {order.id}</h3>
                          <p className="text-sm text-base-content/70">Room {order.roomNumber}</p>
                          <p className="text-sm font-semibold">{order.guestName}</p>
                        </div>
                        <div className={`badge ${getStatusColor(order.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="badge badge-outline badge-sm">{item.quantity}x</span>
                              <span className="text-sm">{item.name}</span>
                            </div>
                            <span className="text-sm font-semibold">N$ {item.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="divider my-4"></div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold">Total Amount</span>
                        <span className="text-lg font-bold text-success">N$ {order.totalAmount}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-base-content/70">Order Time</p>
                          <p className="font-semibold">{order.orderTime}</p>
                        </div>
                        <div>
                          <p className="text-base-content/70">Estimated Ready</p>
                          <p className="font-semibold">{order.estimatedTime}</p>
                        </div>
                      </div>

                      {order.specialRequests && (
                        <div className="mb-4">
                          <p className="text-xs text-base-content/70 mb-1">Special Requests</p>
                          <p className="text-sm bg-base-200 p-2 rounded">
                            {order.specialRequests}
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

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {menuItems.map((item) => (
              <div key={item.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="card-title text-lg">{item.name}</h3>
                      <p className="text-sm text-base-content/70">{item.category}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-warning" />
                      <span className="text-sm font-semibold">{item.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm mb-4">{item.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-base-content/70">Price</p>
                      <p className="font-semibold">N$ {item.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-base-content/70">Prep Time</p>
                      <p className="font-semibold">{item.prepTime} min</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-base-content/70 mb-2">Ingredients</p>
                    <div className="flex flex-wrap gap-1">
                      {item.ingredients.map((ingredient, index) => (
                        <span key={index} className="badge badge-outline badge-sm">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-base-content/70 mb-2">Allergens</p>
                    <div className="flex flex-wrap gap-1">
                      {item.allergens.map((allergen, index) => (
                        <span key={index} className="badge badge-warning badge-sm">
                          {allergen}
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
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-blue-500 text-white">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/70">Orders Today</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-green-500 text-white">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/70">Revenue Today</p>
                    <p className="text-2xl font-bold">N$ 8,450</p>
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
                    <p className="text-sm text-base-content/70">Avg Prep Time</p>
                    <p className="text-2xl font-bold">18 min</p>
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
                    <p className="text-sm text-base-content/70">Avg Rating</p>
                    <p className="text-2xl font-bold">4.7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}