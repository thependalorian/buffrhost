import { Metadata } from "next";
import Image from "next/image";
import {
  Utensils,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  DollarSign,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
  Tag,
  Settings,
} from "lucide-react";
/**
 * Etuna Menu Management Page - Showcase Demo
 *
 * Demonstrates the menu management capabilities of Buffr Host platform
 * with realistic demo data for Etuna Guesthouse & Tours
 */

export const metadata: Metadata = {
  title: "Etuna Menu Management - Buffr Host Demo",
  description:
    "Menu management dashboard showcasing Buffr Host platform capabilities for Etuna Guesthouse",
};

export default function EtunaMenuPage() {
  // Demo menu data
  const menuItems = [
    {
      id: "MENU-001",
      name: "Traditional Half Chicken",
      category: "Traditional Cuisine",
      description: "Traditional chicken served with mahangu or maize",
      price: 150,
      currency: "NAD",
      status: "active",
      availability: "available",
      preparationTime: "25-30 min",
      image: "/images/menu/traditional-chicken.jpg",
      ingredients: ["Chicken", "Mahangu", "Traditional spices"],
      allergens: ["None"],
      popularity: 4.8,
      orders: 45,
      revenue: 6750,
      lastModified: "2024-02-10",
    },
    {
      id: "MENU-002",
      name: "Oxtail Stew",
      category: "Traditional Cuisine",
      description: "Ox tail stew served with a bed rice, maize or mahangu",
      price: 150,
      currency: "NAD",
      status: "active",
      availability: "available",
      preparationTime: "35-40 min",
      image: "/images/menu/oxtail-stew.jpg",
      ingredients: ["Oxtail", "Rice", "Traditional vegetables"],
      allergens: ["None"],
      popularity: 4.7,
      orders: 38,
      revenue: 5700,
      lastModified: "2024-02-08",
    },
    {
      id: "MENU-003",
      name: "Rump Steak",
      category: "Main Course",
      description: "Rump steak served with parsley potatoes",
      price: 150,
      currency: "NAD",
      status: "active",
      availability: "available",
      preparationTime: "20-25 min",
      image: "/images/menu/rump-steak.jpg",
      ingredients: ["Beef rump", "Potatoes", "Parsley"],
      allergens: ["Dairy"],
      popularity: 4.6,
      orders: 32,
      revenue: 4800,
      lastModified: "2024-02-12",
    },
    {
      id: "MENU-004",
      name: "King Klip",
      category: "Main Course",
      description: "King Klip served with parsley potatoes or French fries",
      price: 150,
      currency: "NAD",
      status: "active",
      availability: "available",
      preparationTime: "15-20 min",
      image: "/images/menu/king-klip.jpg",
      ingredients: ["King Klip fish", "Potatoes", "Lemon"],
      allergens: ["Fish"],
      popularity: 4.5,
      orders: 28,
      revenue: 4200,
      lastModified: "2024-02-05",
    },
    {
      id: "MENU-005",
      name: "Haden Hawaiian Pizza",
      category: "Pizza",
      description: "Ham and pineapple pizza",
      price: 100,
      currency: "NAD",
      status: "active",
      availability: "available",
      preparationTime: "15-20 min",
      image: "/images/menu/hawaiian-pizza.jpg",
      ingredients: ["Pizza dough", "Ham", "Pineapple", "Cheese"],
      allergens: ["Gluten", "Dairy", "Pork"],
      popularity: 4.4,
      orders: 25,
      revenue: 2500,
      lastModified: "2024-02-01",
    },
    {
      id: "MENU-006",
      name: "Omaungu",
      category: "Traditional Cuisine",
      description:
        "Mopane worms fried over low heat served with mahangu or maize",
      price: 80,
      currency: "NAD",
      status: "active",
      availability: "limited",
      preparationTime: "30-35 min",
      image: "/images/menu/omaungu.jpg",
      ingredients: ["Mopane worms", "Mahangu", "Traditional spices"],
      allergens: ["None"],
      popularity: 4.2,
      orders: 15,
      revenue: 1200,
      lastModified: "2024-01-28",
    },
    {
      id: "MENU-007",
      name: "Chicken Wings",
      category: "Light Meals",
      description: "Four chicken wings",
      price: 50,
      currency: "NAD",
      status: "active",
      availability: "available",
      preparationTime: "20-25 min",
      image: "/images/menu/chicken-wings.jpg",
      ingredients: ["Chicken wings", "Spices", "Oil"],
      allergens: ["None"],
      popularity: 4.3,
      orders: 42,
      revenue: 2100,
      lastModified: "2024-02-03",
    },
    {
      id: "MENU-008",
      name: "Malva Pudding",
      category: "Desserts",
      description: "Traditional South African dessert with custard",
      price: 60,
      currency: "NAD",
      status: "active",
      availability: "available",
      preparationTime: "10-15 min",
      image: "/images/menu/malva-pudding.jpg",
      ingredients: ["Flour", "Sugar", "Milk", "Custard"],
      allergens: ["Gluten", "Dairy", "Eggs"],
      popularity: 4.7,
      orders: 35,
      revenue: 2100,
      lastModified: "2024-02-07",
    },
  ];

  const categories = [
    { name: "All", count: menuItems.length },
    {
      name: "Traditional Cuisine",
      count: menuItems.filter((item) => item.category === "Traditional Cuisine")
        .length,
    },
    {
      name: "Main Course",
      count: menuItems.filter((item) => item.category === "Main Course").length,
    },
    {
      name: "Pizza",
      count: menuItems.filter((item) => item.category === "Pizza").length,
    },
    {
      name: "Light Meals",
      count: menuItems.filter((item) => item.category === "Light Meals").length,
    },
    {
      name: "Desserts",
      count: menuItems.filter((item) => item.category === "Desserts").length,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "badge-success";
      case "inactive":
        return "badge-error";
      case "draft":
        return "badge-warning";
      default:
        return "badge-neutral";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "badge-success";
      case "limited":
        return "badge-warning";
      case "unavailable":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  const stats = {
    totalItems: menuItems.length,
    activeItems: menuItems.filter((item) => item.status === "active").length,
    totalRevenue: menuItems.reduce((sum, item) => sum + item.revenue, 0),
    totalOrders: menuItems.reduce((sum, item) => sum + item.orders, 0),
    averagePrice: Math.round(
      menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length,
    ),
    topSelling: menuItems.sort((a, b) => b.orders - a.orders)[0],
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-base-content">
              Menu Management
            </h1>
            <p className="text-base-content/70 mt-2">
              Manage restaurant menu items and pricing
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn btn-outline">
              <Settings className="w-4 h-4 mr-2" />
              Menu Settings
            </button>
            <button className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Total Items</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
              <Utensils className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Active Items</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeItems}
                </p>
              </div>
              <Star className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Total Revenue</p>
                <p className="text-2xl font-bold">
                  NAD {stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`btn btn-sm ${
                  category.name === "All" ? "btn-primary" : "btn-outline"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="select select-bordered">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Draft</option>
              </select>
              <select className="select select-bordered">
                <option>All Availability</option>
                <option>Available</option>
                <option>Limited</option>
                <option>Unavailable</option>
              </select>
              <button className="btn btn-outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="card bg-base-100 shadow-xl">
            <figure className="h-48 bg-gray-200">
              <Image 
                src="/placeholder-food.jpg" 
                alt={item.name}
                width={400}
                height={192}
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body">
              <div className="flex items-start justify-between mb-2">
                <h3 className="card-title text-lg">{item.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">
                    {item.popularity}
                  </span>
                </div>
              </div>

              <p className="text-sm text-base-content/70 mb-3">
                {item.description}
              </p>

              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl font-bold text-primary">
                  {item.currency} {item.price}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`badge ${getStatusColor(item.status)}`}>
                    {item.status}
                  </div>
                  <div
                    className={`badge ${getAvailabilityColor(
                      item.availability,
                    )}`}
                  >
                    {item.availability}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-base-content/50" />
                  <span>{item.preparationTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4 text-base-content/50" />
                  <span>{item.category}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-base-content/50" />
                  <span>{item.orders} orders</span>
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

      {/* Top Selling Items */}
      <div className="card bg-base-100 shadow-xl mt-8">
        <div className="card-body">
          <h3 className="card-title mb-4">Top Selling Items</h3>
          <div className="space-y-4">
            {menuItems
              .sort((a, b) => b.orders - a.orders)
              .slice(0, 5)
              .map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-content rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-base-content/70">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{item.orders} orders</div>
                    <div className="text-sm text-base-content/70">
                      NAD {item.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="mt-6 text-center">
        <p className="text-sm text-base-content/70">
          This is a demo showcase. In the full Buffr Host platform, you would
          have:
        </p>
        <ul className="text-sm text-base-content/70 mt-2 space-y-1">
          <li>• Real-time menu updates</li>
          <li>• Dynamic pricing management</li>
          <li>• Ingredient tracking and costs</li>
          <li>• Nutritional information management</li>
          <li>• Menu analytics and insights</li>
          <li>• Multi-language menu support</li>
        </ul>
      </div>
    </div>
  );
}
