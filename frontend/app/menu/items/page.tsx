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
  Clock,
  AlertCircle,
  DollarSign,
  Star,
  Users,
  Calendar,
  Image,
  Tag,
  Settings,
  BarChart3,
  Heart,
  Flame,
  Leaf,
  Coffee,
  Wine,
  Cake
} from 'lucide-react';

export default function MenuItemsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('items');

  // Sample menu items data
  const menuItems = [
    {
      id: 'ITEM001',
      name: 'Grilled Springbok Steak',
      category: 'Main Course',
      subcategory: 'Meat',
      description: 'Tender springbok steak grilled to perfection, served with seasonal vegetables and red wine reduction',
      price: 450,
      cost: 180,
      profit: 270,
      profitMargin: 60,
      status: 'available',
      dietary: ['gluten-free'],
      allergens: [],
      preparationTime: 25,
      calories: 520,
      servingSize: '1 portion',
      image: '/images/springbok-steak.jpg',
      rating: 4.8,
      reviews: 156,
      orders: 234,
      revenue: 105300,
      popularity: 'high',
      chefSpecial: true,
      seasonal: false,
      ingredients: ['springbok steak', 'seasonal vegetables', 'red wine', 'herbs', 'olive oil'],
      nutrition: {
        protein: 45,
        carbs: 12,
        fat: 28,
        fiber: 3
      }
    },
    {
      id: 'ITEM002',
      name: 'Namibian Fish Curry',
      category: 'Main Course',
      subcategory: 'Seafood',
      description: 'Fresh Namibian fish in aromatic curry sauce with coconut milk, served with basmati rice',
      price: 380,
      cost: 120,
      profit: 260,
      profitMargin: 68.4,
      status: 'available',
      dietary: ['dairy-free'],
      allergens: ['fish'],
      preparationTime: 20,
      calories: 420,
      servingSize: '1 portion',
      image: '/images/fish-curry.jpg',
      rating: 4.6,
      reviews: 89,
      orders: 178,
      revenue: 67640,
      popularity: 'medium',
      chefSpecial: false,
      seasonal: true,
      ingredients: ['fresh fish', 'coconut milk', 'curry spices', 'basmati rice', 'onions'],
      nutrition: {
        protein: 38,
        carbs: 25,
        fat: 18,
        fiber: 4
      }
    },
    {
      id: 'ITEM003',
      name: 'Vegetarian Quinoa Bowl',
      category: 'Main Course',
      subcategory: 'Vegetarian',
      description: 'Nutritious quinoa bowl with roasted vegetables, avocado, and tahini dressing',
      price: 280,
      cost: 85,
      profit: 195,
      profitMargin: 69.6,
      status: 'available',
      dietary: ['vegan', 'gluten-free'],
      allergens: ['sesame'],
      preparationTime: 15,
      calories: 380,
      servingSize: '1 bowl',
      image: '/images/quinoa-bowl.jpg',
      rating: 4.7,
      reviews: 67,
      orders: 145,
      revenue: 40600,
      popularity: 'medium',
      chefSpecial: false,
      seasonal: false,
      ingredients: ['quinoa', 'roasted vegetables', 'avocado', 'tahini', 'lemon'],
      nutrition: {
        protein: 15,
        carbs: 45,
        fat: 22,
        fiber: 8
      }
    },
    {
      id: 'ITEM004',
      name: 'Traditional Oshifima',
      category: 'Side Dish',
      subcategory: 'Traditional',
      description: 'Traditional Namibian maize meal porridge, served with meat stew',
      price: 120,
      cost: 25,
      profit: 95,
      profitMargin: 79.2,
      status: 'available',
      dietary: ['gluten-free'],
      allergens: [],
      preparationTime: 30,
      calories: 280,
      servingSize: '1 portion',
      image: '/images/oshifima.jpg',
      rating: 4.5,
      reviews: 45,
      orders: 89,
      revenue: 10680,
      popularity: 'low',
      chefSpecial: false,
      seasonal: false,
      ingredients: ['maize meal', 'water', 'salt'],
      nutrition: {
        protein: 6,
        carbs: 58,
        fat: 2,
        fiber: 3
      }
    },
    {
      id: 'ITEM005',
      name: 'Chocolate Lava Cake',
      category: 'Dessert',
      subcategory: 'Cakes',
      description: 'Warm chocolate lava cake with vanilla ice cream and berry compote',
      price: 180,
      cost: 45,
      profit: 135,
      profitMargin: 75,
      status: 'out-of-stock',
      dietary: ['vegetarian'],
      allergens: ['eggs', 'dairy', 'gluten'],
      preparationTime: 12,
      calories: 480,
      servingSize: '1 cake',
      image: '/images/lava-cake.jpg',
      rating: 4.9,
      reviews: 123,
      orders: 198,
      revenue: 35640,
      popularity: 'high',
      chefSpecial: true,
      seasonal: false,
      ingredients: ['dark chocolate', 'butter', 'eggs', 'sugar', 'flour', 'vanilla ice cream'],
      nutrition: {
        protein: 8,
        carbs: 52,
        fat: 28,
        fiber: 2
      }
    }
  ];

  const categories = [
    { name: 'Main Course', count: 3, color: 'bg-blue-500' },
    { name: 'Side Dish', count: 1, color: 'bg-green-500' },
    { name: 'Dessert', count: 1, color: 'bg-purple-500' },
    { name: 'Appetizer', count: 0, color: 'bg-yellow-500' },
    { name: 'Beverage', count: 0, color: 'bg-orange-500' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-success bg-success/10';
      case 'out-of-stock':
        return 'text-error bg-error/10';
      case 'discontinued':
        return 'text-base-content bg-base-300';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return CheckCircle;
      case 'out-of-stock':
        return AlertCircle;
      case 'discontinued':
        return Clock;
      default:
        return Utensils;
    }
  };

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case 'high':
        return 'text-success bg-success/10';
      case 'medium':
        return 'text-warning bg-warning/10';
      case 'low':
        return 'text-error bg-error/10';
      default:
        return 'text-base-content bg-base-300';
    }
  };

  const getPopularityIcon = (popularity: string) => {
    switch (popularity) {
      case 'high':
        return Flame;
      case 'medium':
        return Star;
      case 'low':
        return Clock;
      default:
        return Utensils;
    }
  };

  const getDietaryIcon = (dietary: string) => {
    switch (dietary) {
      case 'vegan':
        return Leaf;
      case 'vegetarian':
        return Leaf;
      case 'gluten-free':
        return CheckCircle; // Using CheckCircle as substitute for Shield
      case 'dairy-free':
        return Coffee;
      default:
        return Tag;
    }
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'items', label: 'Menu Items', icon: Utensils },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'nutrition', label: 'Nutrition', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <PageHeader
        title="Menu Items Management"
        description="Manage menu items, categories, nutrition information, and item analytics"
        breadcrumbs={[
          { label: 'Dashboard', href: '/protected' },
          { label: 'Menu', href: '/menu' },
          { label: 'Items', href: '/menu/items' }
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
                  Add Item
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Items Tab */}
        {activeTab === 'items' && (
          <>
            {/* Search and Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="form-control flex-1">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Search menu items..."
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
                    <option value="Main Course">Main Course</option>
                    <option value="Side Dish">Side Dish</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredItems.map((item) => {
                const StatusIcon = getStatusIcon(item.status);
                const PopularityIcon = getPopularityIcon(item.popularity);
                return (
                  <div key={item.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-16 h-16 bg-base-200 rounded-lg flex items-center justify-center">
                            <Image className="w-8 h-8 text-base-content/50" />
                          </div>
                          <div>
                            <h3 className="card-title text-lg">{item.name}</h3>
                            <p className="text-sm text-base-content/70">{item.category}</p>
                            <p className="text-sm font-semibold">{item.subcategory}</p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className={`badge ${getStatusColor(item.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </div>
                          <div className={`badge ${getPopularityColor(item.popularity)}`}>
                            <PopularityIcon className="w-3 h-3 mr-1" />
                            {item.popularity.charAt(0).toUpperCase() + item.popularity.slice(1)}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm bg-base-200 p-2 rounded">{item.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Price</p>
                          <p className="font-semibold">N$ {item.price}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Cost</p>
                          <p className="font-semibold">N$ {item.cost}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Profit</p>
                          <p className="font-semibold text-success">N$ {item.profit}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Margin</p>
                          <p className="font-semibold text-success">{item.profitMargin}%</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Dietary Info</p>
                        <div className="flex flex-wrap gap-1">
                          {item.dietary.map((diet, index) => {
                            const DietaryIcon = getDietaryIcon(diet);
                            return (
                              <span key={index} className="badge badge-outline badge-sm">
                                <DietaryIcon className="w-3 h-3 mr-1" />
                                {diet.charAt(0).toUpperCase() + diet.slice(1)}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-base-content/70 mb-2">Allergens</p>
                        <div className="flex flex-wrap gap-1">
                          {item.allergens.length > 0 ? (
                            item.allergens.map((allergen, index) => (
                              <span key={index} className="badge badge-error badge-sm">
                                {allergen.charAt(0).toUpperCase() + allergen.slice(1)}
                              </span>
                            ))
                          ) : (
                            <span className="badge badge-success badge-sm">No allergens</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-base-content/70">Prep Time</p>
                          <p className="font-semibold">{item.preparationTime}min</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Calories</p>
                          <p className="font-semibold">{item.calories}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Orders</p>
                          <p className="font-semibold">{item.orders}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-warning" />
                          <span className="font-semibold">{item.rating}</span>
                          <span className="text-sm">({item.reviews})</span>
                        </div>
                        <div className="text-sm text-base-content/70">
                          Revenue: N$ {item.revenue.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-2">
                          {item.chefSpecial && (
                            <span className="badge badge-primary badge-sm">Chef Special</span>
                          )}
                          {item.seasonal && (
                            <span className="badge badge-secondary badge-sm">Seasonal</span>
                          )}
                        </div>
                        <div className="text-sm text-base-content/70">
                          {item.servingSize}
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
                      <Utensils className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="card-title text-lg">{category.name}</h3>
                      <p className="text-sm text-base-content/70">{category.count} items</p>
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Item Performance</h3>
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <div key={item.id} className="p-4 bg-base-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{item.name}</span>
                        <span className="font-semibold">N$ {item.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.orders} orders</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-warning" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-6">Category Analytics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Items</span>
                    <span className="font-semibold">{menuItems.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Available Items</span>
                    <span className="font-semibold text-success">
                      {menuItems.filter(i => i.status === 'available').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Out of Stock</span>
                    <span className="font-semibold text-error">
                      {menuItems.filter(i => i.status === 'out-of-stock').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Revenue</span>
                    <span className="font-semibold">
                      N$ {menuItems.reduce((sum, i) => sum + i.revenue, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Rating</span>
                    <span className="font-semibold">
                      {(menuItems.reduce((sum, i) => sum + i.rating, 0) / menuItems.length).toFixed(1)}
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
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Items</p>
                  <p className="text-2xl font-bold">{menuItems.length}</p>
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
                  <p className="text-sm text-base-content/70">Available</p>
                  <p className="text-2xl font-bold">
                    {menuItems.filter(i => i.status === 'available').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-purple-500 text-white">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    N$ {menuItems.reduce((sum, i) => sum + i.revenue, 0).toLocaleString()}
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
                  <p className="text-sm text-base-content/70">Avg Rating</p>
                  <p className="text-2xl font-bold">
                    {(menuItems.reduce((sum, i) => sum + i.rating, 0) / menuItems.length).toFixed(1)}
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