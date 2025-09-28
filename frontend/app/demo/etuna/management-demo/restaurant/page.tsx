'use client';

import { useState } from 'react';
import {
  Utensils,
  Coffee,
  Wine,
  ChefHat,
  Clock,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Bell,
  MessageSquare,
  FileText,
  CreditCard,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  Smartphone,
  Monitor,
  Tablet,
  Eye as EyeIcon,
  Share2,
  X,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Globe,
  Building,
  Home,
  Key,
  Lock,
  Unlock,
  Check,
  X as XIcon,
  AlertTriangle,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MoreVertical,
  Grid,
  List,
  Target,
  Award,
  Crown,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  Sad,
  Surprised,
  Confused,
  Wink,
  Kiss,
  Tongue,
  RollingEyes,
  Shush,
  Thinking,
  Sleeping,
  Dizzy,
  Sick,
  Mask,
  Sunglasses,
  Glasses,
  Headphones,
  Microphone,
  Camera,
  Video,
  Image,
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  Move,
  Copy,
  Scissors,
  Clipboard,
  Bookmark,
  Tag,
  Flag,
  Pin,
  Map,
  Compass,
  Navigation,
  Route,
  Truck,
  Plane,
  Train,
  Bus,
  Ship,
  Bike,
  Scooter,
  Motorcycle,
  Car as CarIcon,
  Parking,
  Gas,
  Battery,
  Plug,
  Wrench,
  Hammer,
  Screwdriver,
  Drill,
  Saw,
  Axe,
  Pickaxe,
  Shovel,
  Rake,
  Hoe,
  Scythe,
  Pitchfork,
  Fork,
  Knife,
  Spoon,
  Cup,
  Mug,
  Glass,
  Bottle,
  Jar,
  Can,
  Box,
  Bag,
  Basket,
  Bucket,
  Pot,
  Pan,
  Plate,
  Bowl,
  Tray,
  Dish,
  Saucer,
  Napkin,
  Tablecloth,
  Candle,
  Lamp,
  Lightbulb,
  Flashlight,
  Torch,
  Fire,
  Flame,
  Spark,
  Explosion,
  Bomb,
  Grenade,
  Sword,
  Shield,
  Armor,
  Helmet,
  Crown as CrownIcon,
  Scepter,
  Orb,
  Gem,
  Diamond,
  Ruby,
  Emerald,
  Sapphire,
  Pearl,
  Gold,
  Silver,
  Bronze,
  Copper,
  Iron,
  Steel,
  Aluminum,
  Titanium,
  Platinum,
  Palladium,
  Rhodium,
  Iridium,
  Osmium,
  Ruthenium,
  Rhenium,
  Tungsten,
  Molybdenum,
  Chromium,
  Vanadium,
  Niobium,
  Tantalum,
  Hafnium,
  Zirconium,
  Yttrium,
  Lanthanum,
  Cerium,
  Praseodymium,
  Neodymium,
  Promethium,
  Samarium,
  Europium,
  Gadolinium,
  Terbium,
  Dysprosium,
  Holmium,
  Erbium,
  Thulium,
  Ytterbium,
  Lutetium,
  Actinium,
  Thorium,
  Protactinium,
  Uranium,
  Neptunium,
  Plutonium,
  Americium,
  Curium,
  Berkelium,
  Californium,
  Einsteinium,
  Fermium,
  Mendelevium,
  Nobelium,
  Lawrencium,
  Rutherfordium,
  Dubnium,
  Seaborgium,
  Bohrium,
  Hassium,
  Meitnerium,
  Darmstadtium,
  Roentgenium,
  Copernicium,
  Nihonium,
  Flerovium,
  Moscovium,
  Livermorium,
  Tennessine,
  Oganesson,
  User,
  Bed
} from 'lucide-react';
import Link from 'next/link';

export default function RestaurantManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock data for restaurant orders
  const orders = [
    {
      id: 'ORD001',
      table: 'Table 5',
      guest: 'John Smith',
      room: '201',
      items: [
        { name: 'Grilled Fish', quantity: 2, price: 180, total: 360 },
        { name: 'Vegetable Curry', quantity: 1, price: 120, total: 120 },
        { name: 'Coca Cola', quantity: 2, price: 25, total: 50 }
      ],
      total: 530,
      status: 'preparing',
      orderTime: '2024-01-15 19:30',
      estimatedTime: '20:00',
      specialRequests: 'No spice for curry',
      paymentMethod: 'Room Charge',
      staff: 'Maria Chef'
    },
    {
      id: 'ORD002',
      table: 'Table 3',
      guest: 'Ahmed Hassan',
      room: '101',
      items: [
        { name: 'Chicken Biryani', quantity: 1, price: 150, total: 150 },
        { name: 'Mango Lassi', quantity: 1, price: 35, total: 35 }
      ],
      total: 185,
      status: 'ready',
      orderTime: '2024-01-15 19:15',
      estimatedTime: '19:45',
      specialRequests: 'Extra spicy',
      paymentMethod: 'Cash',
      staff: 'John Chef'
    },
    {
      id: 'ORD003',
      table: 'Room Service',
      guest: 'Sarah Johnson',
      room: '401',
      items: [
        { name: 'Caesar Salad', quantity: 1, price: 95, total: 95 },
        { name: 'Grilled Chicken', quantity: 1, price: 160, total: 160 },
        { name: 'Red Wine', quantity: 1, price: 120, total: 120 }
      ],
      total: 375,
      status: 'delivered',
      orderTime: '2024-01-15 18:45',
      estimatedTime: '19:15',
      specialRequests: 'Dressing on the side',
      paymentMethod: 'Room Charge',
      staff: 'Peter Waiter'
    },
    {
      id: 'ORD004',
      table: 'Table 8',
      guest: 'Maria Garcia',
      room: '301',
      items: [
        { name: 'Pasta Carbonara', quantity: 2, price: 140, total: 280 },
        { name: 'Garlic Bread', quantity: 1, price: 45, total: 45 },
        { name: 'White Wine', quantity: 1, price: 110, total: 110 }
      ],
      total: 435,
      status: 'pending',
      orderTime: '2024-01-15 20:00',
      estimatedTime: '20:30',
      specialRequests: 'Extra cheese',
      paymentMethod: 'Credit Card',
      staff: 'Anna Chef'
    }
  ];

  const menuItems = [
    {
      id: 'MENU001',
      name: 'Grilled Fish',
      category: 'Main Course',
      price: 180,
      description: 'Fresh fish grilled with herbs and lemon',
      availability: 'available',
      prepTime: 25,
      ingredients: ['Fish', 'Herbs', 'Lemon', 'Olive Oil'],
      allergens: ['Fish'],
      calories: 320,
      image: '/images/grilled-fish.jpg'
    },
    {
      id: 'MENU002',
      name: 'Vegetable Curry',
      category: 'Vegetarian',
      price: 120,
      description: 'Mixed vegetables in coconut curry sauce',
      availability: 'available',
      prepTime: 20,
      ingredients: ['Mixed Vegetables', 'Coconut Milk', 'Curry Spices'],
      allergens: ['Coconut'],
      calories: 280,
      image: '/images/vegetable-curry.jpg'
    },
    {
      id: 'MENU003',
      name: 'Chicken Biryani',
      category: 'Main Course',
      price: 150,
      description: 'Fragrant basmati rice with spiced chicken',
      availability: 'available',
      prepTime: 30,
      ingredients: ['Basmati Rice', 'Chicken', 'Spices', 'Saffron'],
      allergens: [],
      calories: 450,
      image: '/images/chicken-biryani.jpg'
    },
    {
      id: 'MENU004',
      name: 'Caesar Salad',
      category: 'Salad',
      price: 95,
      description: 'Fresh romaine lettuce with caesar dressing',
      availability: 'available',
      prepTime: 10,
      ingredients: ['Romaine Lettuce', 'Parmesan', 'Croutons', 'Caesar Dressing'],
      allergens: ['Dairy', 'Gluten'],
      calories: 180,
      image: '/images/caesar-salad.jpg'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'preparing':
        return 'badge-info';
      case 'ready':
        return 'badge-success';
      case 'delivered':
        return 'badge-neutral';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.table.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Restaurant Management</h1>
              <p className="text-primary-content/80">
                Manage restaurant orders, menu, and kitchen operations for Etuna Guesthouse
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/demo/etuna/management-demo"
                className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Management
              </Link>
              <button className="btn btn-accent btn-sm">
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button className="tab tab-active">Active Orders</button>
          <button className="tab">Menu Management</button>
          <button className="tab">Kitchen Display</button>
          <button className="tab">Reports</button>
        </div>

        {/* Filters and Search */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search orders by ID, guest, or table..."
                    className="input input-bordered w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  className="select select-bordered"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="btn btn-outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </button>
                <button className="btn btn-outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Order {order.id}</h3>
                    <p className="text-sm text-base-content/60">{order.table} • {order.guest}</p>
                    <p className="text-xs text-base-content/60">Room {order.room}</p>
                  </div>
                  <span className={`badge ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-base-content/60 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold">N$ {item.total}</span>
                    </div>
                  ))}
                </div>

                <div className="divider my-4"></div>

                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-lg">Total: N$ {order.total}</span>
                  <div className="text-sm text-base-content/60">
                    <div>Ordered: {order.orderTime}</div>
                    <div>Est. Ready: {order.estimatedTime}</div>
                  </div>
                </div>

                {order.specialRequests && (
                  <div className="bg-base-200 p-3 rounded-lg mb-4">
                    <p className="text-sm">
                      <span className="font-semibold">Special Requests:</span> {order.specialRequests}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-base-content/60 mb-4">
                  <div>
                    <span className="font-semibold">Staff:</span> {order.staff}
                  </div>
                  <div>
                    <span className="font-semibold">Payment:</span> {order.paymentMethod}
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

        {/* Menu Items */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Menu Items</h2>
              <button className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Menu Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems.map((item) => (
                <div key={item.id} className="card bg-base-200 shadow-sm">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">{item.name}</h3>
                      <span className="badge badge-outline">{item.category}</span>
                    </div>
                    <p className="text-sm text-base-content/60 mb-2">{item.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-primary">N$ {item.price}</span>
                      <span className="text-sm text-base-content/60">{item.prepTime} min</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.ingredients.slice(0, 3).map((ingredient, index) => (
                        <span key={index} className="badge badge-ghost badge-sm">
                          {ingredient}
                        </span>
                      ))}
                      {item.ingredients.length > 3 && (
                        <span className="badge badge-ghost badge-sm">
                          +{item.ingredients.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="card-actions justify-end">
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
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="stat-figure text-secondary">
                <Clock className="w-8 h-8" />
              </div>
              <div className="stat-title">Avg Prep Time</div>
              <div className="stat-value text-secondary">22 min</div>
              <div className="stat-desc">Today&apos;s average</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Today&apos;s Revenue</div>
              <div className="stat-value text-accent">
                N$ {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
              </div>
              <div className="stat-desc">From all orders</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <Star className="w-8 h-8" />
              </div>
              <div className="stat-title">Menu Items</div>
              <div className="stat-value text-info">{menuItems.length}</div>
              <div className="stat-desc">Available dishes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
