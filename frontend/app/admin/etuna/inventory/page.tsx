/**
 * Etuna Inventory Management Page - Showcase Demo
 * 
 * Demonstrates the inventory management capabilities of Buffr Host platform
 * with realistic demo data for Etuna Guesthouse & Tours
 */

import { Metadata } from 'next';
import { 
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Etuna Inventory - Buffr Host Demo',
  description: 'Inventory management dashboard showcasing Buffr Host platform capabilities for Etuna Guesthouse',
};

export default function EtunaInventoryPage() {
  // Demo inventory data
  const inventoryItems = [
    {
      id: 'INV-001',
      name: 'Bed Sheets - King Size',
      category: 'Linen',
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unit: 'pieces',
      costPerUnit: 150,
      totalValue: 6750,
      status: 'in_stock',
      lastRestocked: '2024-02-10',
      supplier: 'Namibia Linen Co.',
      location: 'Linen Room A'
    },
    {
      id: 'INV-002',
      name: 'Towels - Bath',
      category: 'Linen',
      currentStock: 120,
      minStock: 50,
      maxStock: 200,
      unit: 'pieces',
      costPerUnit: 85,
      totalValue: 10200,
      status: 'in_stock',
      lastRestocked: '2024-02-08',
      supplier: 'Namibia Linen Co.',
      location: 'Linen Room A'
    },
    {
      id: 'INV-003',
      name: 'Coffee Beans - Premium',
      category: 'Food & Beverage',
      currentStock: 8,
      minStock: 15,
      maxStock: 50,
      unit: 'kg',
      costPerUnit: 180,
      totalValue: 1440,
      status: 'low_stock',
      lastRestocked: '2024-01-28',
      supplier: 'Namibian Coffee Co.',
      location: 'Kitchen Storage'
    },
    {
      id: 'INV-004',
      name: 'Chicken Breast - Fresh',
      category: 'Food & Beverage',
      currentStock: 0,
      minStock: 10,
      maxStock: 30,
      unit: 'kg',
      costPerUnit: 45,
      totalValue: 0,
      status: 'out_of_stock',
      lastRestocked: '2024-02-12',
      supplier: 'Ongwediva Meat Market',
      location: 'Kitchen Freezer'
    },
    {
      id: 'INV-005',
      name: 'Toilet Paper - Premium',
      category: 'Bathroom Supplies',
      currentStock: 25,
      minStock: 20,
      maxStock: 80,
      unit: 'rolls',
      costPerUnit: 12,
      totalValue: 300,
      status: 'in_stock',
      lastRestocked: '2024-02-05',
      supplier: 'Namibia Supplies Ltd',
      location: 'Storage Room B'
    },
    {
      id: 'INV-006',
      name: 'Wine - Red House Wine',
      category: 'Food & Beverage',
      currentStock: 18,
      minStock: 12,
      maxStock: 60,
      unit: 'bottles',
      costPerUnit: 120,
      totalValue: 2160,
      status: 'in_stock',
      lastRestocked: '2024-02-01',
      supplier: 'Namibian Wine Distributors',
      location: 'Bar Storage'
    },
    {
      id: 'INV-007',
      name: 'Cleaning Solution - Multi-purpose',
      category: 'Cleaning Supplies',
      currentStock: 3,
      minStock: 8,
      maxStock: 25,
      unit: 'bottles',
      costPerUnit: 35,
      totalValue: 105,
      status: 'low_stock',
      lastRestocked: '2024-01-20',
      supplier: 'Clean Solutions Namibia',
      location: 'Housekeeping Storage'
    },
    {
      id: 'INV-008',
      name: 'Rice - Basmati',
      category: 'Food & Beverage',
      currentStock: 22,
      minStock: 15,
      maxStock: 50,
      unit: 'kg',
      costPerUnit: 25,
      totalValue: 550,
      status: 'in_stock',
      lastRestocked: '2024-02-03',
      supplier: 'Namibian Food Distributors',
      location: 'Kitchen Pantry'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'badge-success';
      case 'low_stock':
        return 'badge-warning';
      case 'out_of_stock':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <CheckCircle className="w-4 h-4" />;
      case 'low_stock':
        return <AlertTriangle className="w-4 h-4" />;
      case 'out_of_stock':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const categories = ['All', 'Linen', 'Food & Beverage', 'Bathroom Supplies', 'Cleaning Supplies'];
  
  const stats = {
    totalItems: inventoryItems.length,
    inStock: inventoryItems.filter(item => item.status === 'in_stock').length,
    lowStock: inventoryItems.filter(item => item.status === 'low_stock').length,
    outOfStock: inventoryItems.filter(item => item.status === 'out_of_stock').length,
    totalValue: inventoryItems.reduce((sum, item) => sum + item.totalValue, 0),
    lowStockItems: inventoryItems.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock')
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-base-content">Inventory Management</h1>
            <p className="text-base-content/70 mt-2">Track and manage all inventory items</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="btn btn-outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="btn btn-outline">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>
            <button className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Total Items</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">In Stock</p>
                <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Total Value</p>
                <p className="text-2xl font-bold">NAD {stats.totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockItems.length > 0 && (
        <div className="alert alert-warning mb-6">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <h3 className="font-bold">Low Stock Alert!</h3>
            <div className="text-sm">
              {stats.lowStockItems.length} item(s) need restocking: {stats.lowStockItems.map(item => item.name).join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Search inventory items..."
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="select select-bordered">
                <option>All Categories</option>
                {categories.slice(1).map(category => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              <select className="select select-bordered">
                <option>All Status</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
              <button className="btn btn-outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Stock Level</th>
                  <th>Status</th>
                  <th>Cost/Unit</th>
                  <th>Total Value</th>
                  <th>Supplier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-base-content/70">ID: {item.id}</div>
                      <div className="text-sm text-base-content/70">Location: {item.location}</div>
                    </td>
                    <td>
                      <div className="badge badge-outline">{item.category}</div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{item.currentStock}</span>
                          <span className="text-sm text-base-content/70">{item.unit}</span>
                        </div>
                        <div className="text-xs text-base-content/50">
                          Min: {item.minStock} | Max: {item.maxStock}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              item.currentStock <= item.minStock ? 'bg-red-500' :
                              item.currentStock <= item.minStock * 1.5 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ 
                              width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`badge ${getStatusColor(item.status)} gap-1`}>
                        {getStatusIcon(item.status)}
                        {item.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold">NAD {item.costPerUnit}</div>
                    </td>
                    <td>
                      <div className="font-semibold">NAD {item.totalValue.toLocaleString()}</div>
                    </td>
                    <td>
                      <div className="text-sm">{item.supplier}</div>
                      <div className="text-xs text-base-content/70">Last restocked: {item.lastRestocked}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button className="btn btn-ghost btn-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm text-error">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Quick Restock</h3>
            <p className="text-sm text-base-content/70 mb-4">Restock low inventory items</p>
            <button className="btn btn-primary btn-sm w-full">
              <Plus className="w-4 h-4 mr-2" />
              Restock Items
            </button>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Inventory Report</h3>
            <p className="text-sm text-base-content/70 mb-4">Generate detailed inventory reports</p>
            <button className="btn btn-outline btn-sm w-full">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Supplier Orders</h3>
            <p className="text-sm text-base-content/70 mb-4">Manage supplier orders and deliveries</p>
            <button className="btn btn-outline btn-sm w-full">
              <Package className="w-4 h-4 mr-2" />
              Manage Orders
            </button>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="mt-6 text-center">
        <p className="text-sm text-base-content/70">
          This is a demo showcase. In the full Buffr Host platform, you would have:
        </p>
        <ul className="text-sm text-base-content/70 mt-2 space-y-1">
          <li>• Real-time inventory tracking</li>
          <li>• Automated reorder points</li>
          <li>• Supplier integration</li>
          <li>• Cost analysis and reporting</li>
          <li>• Barcode scanning support</li>
          <li>• Multi-location inventory management</li>
        </ul>
      </div>
    </div>
  );
}
