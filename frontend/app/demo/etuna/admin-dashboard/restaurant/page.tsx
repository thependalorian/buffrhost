import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Utensils, 
  Plus, 
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowLeft,
  Home,
  Users,
  DollarSign,
  Star,
  ChefHat,
  Coffee,
  Wine
} from 'lucide-react';
import { etunaUnifiedData } from '@/lib/data/etuna-property-unified';

export const metadata: Metadata = {
  title: 'Etuna Guesthouse - Restaurant Management',
  description: 'Manage restaurant menu, orders, and dining operations for Etuna Guesthouse',
};

export default function EtunaRestaurantPage() {
  const property = etunaUnifiedData.property;

  // Sample restaurant data
  const orders = [
    {
      id: 'ORD001',
      tableNumber: 'T-05',
      guestName: 'John Smith',
      roomNumber: 'E-201',
      orderTime: '2024-01-15 19:30',
      status: 'preparing',
      totalAmount: 285,
      items: [
        { name: 'Traditional Oshiwambo Meal', quantity: 1, price: 120 },
        { name: 'Grilled Fish', quantity: 1, price: 95 },
        { name: 'Coca Cola', quantity: 2, price: 35 }
      ],
      specialRequests: 'No spicy food',
      estimatedTime: '25 minutes',
      assignedChef: 'Chef Maria'
    },
    {
      id: 'ORD002',
      tableNumber: 'T-12',
      guestName: 'Maria Garcia',
      roomNumber: 'FS-301',
      orderTime: '2024-01-15 20:15',
      status: 'ready',
      totalAmount: 150,
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 85 },
        { name: 'Fresh Juice', quantity: 1, price: 25 },
        { name: 'Ice Cream', quantity: 1, price: 40 }
      ],
      specialRequests: 'Extra cheese on pizza',
      estimatedTime: 'Ready',
      assignedChef: 'Chef Ahmed'
    },
    {
      id: 'ORD003',
      tableNumber: 'Room Service',
      guestName: 'Ahmed Hassan',
      roomNumber: 'S-101',
      orderTime: '2024-01-15 21:00',
      status: 'delivered',
      totalAmount: 95,
      items: [
        { name: 'Grilled Fish', quantity: 1, price: 95 }
      ],
      specialRequests: 'Vegetarian meals only',
      estimatedTime: 'Delivered',
      assignedChef: 'Chef Maria'
    }
  ];

  const menuItems = [
    {
      id: 'MENU001',
      name: 'Traditional Oshiwambo Meal',
      category: 'Traditional Cuisine',
      price: 120,
      description: 'Authentic Namibian traditional cuisine with meat and vegetables',
      preparationTime: 30,
      isAvailable: true,
      isPopular: true,
      calories: 450,
      dietaryTags: ['Traditional'],
      image: '/images/menu/oshwambo-meal.jpg'
    },
    {
      id: 'MENU002',
      name: 'Grilled Fish',
      category: 'Main Course',
      price: 95,
      description: 'Fresh local fish grilled to perfection',
      preparationTime: 25,
      isAvailable: true,
      isPopular: false,
      calories: 300,
      dietaryTags: ['Seafood'],
      image: '/images/menu/grilled-fish.jpg'
    },
    {
      id: 'MENU003',
      name: 'Margherita Pizza',
      category: 'Pizza',
      price: 85,
      description: 'Classic pizza with tomato, mozzarella, and basil',
      preparationTime: 20,
      isAvailable: true,
      isPopular: true,
      calories: 400,
      dietaryTags: ['Vegetarian'],
      image: '/images/menu/margherita-pizza.jpg'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'preparing':
        return <span className="badge badge-info">Preparing</span>;
      case 'ready':
        return <span className="badge badge-success">Ready</span>;
      case 'delivered':
        return <span className="badge badge-neutral">Delivered</span>;
      case 'cancelled':
        return <span className="badge badge-error">Cancelled</span>;
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'preparing':
        return <ChefHat className="w-4 h-4 text-info" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-neutral" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return <AlertCircle className="w-4 h-4 text-ghost" />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/protected/etuna/dashboard" className="btn btn-ghost text-primary-content hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <Utensils className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Restaurant Management</h1>
                  <p className="text-primary-content/80">Manage menu, orders, and dining operations</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="tabs tabs-bordered mb-6">
          <a className="tab tab-active">Active Orders</a>
          <a className="tab">Menu Management</a>
          <a className="tab">Kitchen Display</a>
          <a className="tab">Reports</a>
        </div>

        {/* Active Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {orders.map((order) => (
            <div key={order.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="card-title text-lg">Order {order.id}</h3>
                    <p className="text-sm text-base-content/70">
                      Table {order.tableNumber} • {order.guestName}
                    </p>
                    <p className="text-xs text-base-content/50">
                      Room {order.roomNumber} • {order.orderTime}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="font-semibold text-sm">Order Items:</div>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>N$ {item.price}</span>
                    </div>
                  ))}
                  
                  <div className="divider my-2"></div>
                  
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-primary">N$ {order.totalAmount}</span>
                  </div>

                  {order.specialRequests && (
                    <div className="alert alert-info">
                      <AlertCircle className="w-4 h-4" />
                      <div className="text-sm">{order.specialRequests}</div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span>Chef: {order.assignedChef}</span>
                    <span className="font-semibold">{order.estimatedTime}</span>
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-ghost btn-sm" title="View Details">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Edit Order">
                    <Edit className="w-4 h-4" />
                  </button>
                  {order.status === 'ready' && (
                    <button className="btn btn-primary btn-sm">
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Menu Items */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h3 className="card-title">Popular Menu Items</h3>
              <button className="btn btn-outline btn-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div key={item.id} className="card bg-base-200">
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{item.name}</h4>
                      {item.isPopular && (
                        <span className="badge badge-warning">Popular</span>
                      )}
                    </div>
                    
                    <p className="text-sm text-base-content/70 mb-2">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-bold text-primary">N$ {item.price}</span>
                      <span className="text-base-content/70">
                        {item.preparationTime} min
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.dietaryTags.map((tag, index) => (
                        <span key={index} className="badge badge-outline badge-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-base-content/50">
                        {item.calories} calories
                      </span>
                      <div className="flex space-x-1">
                        <button className="btn btn-ghost btn-xs">
                          <Edit className="w-3 h-3" />
                        </button>
                        <button className="btn btn-ghost btn-xs">
                          <Eye className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Utensils className="w-8 h-8" />
              </div>
              <div className="stat-title">Active Orders</div>
              <div className="stat-value text-primary">
                {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
              </div>
              <div className="stat-desc">In progress</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Ready Orders</div>
              <div className="stat-value text-success">
                {orders.filter(o => o.status === 'ready').length}
              </div>
              <div className="stat-desc">Awaiting delivery</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <ChefHat className="w-8 h-8" />
              </div>
              <div className="stat-title">Preparing</div>
              <div className="stat-value text-info">
                {orders.filter(o => o.status === 'preparing').length}
              </div>
              <div className="stat-desc">In kitchen</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Today&apos;s Revenue</div>
              <div className="stat-value text-secondary">
                N$ {orders.reduce((sum, order) => sum + order.totalAmount, 0)}
              </div>
              <div className="stat-desc">Restaurant sales</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
