'use client';

import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Clock,
  Users,
  Star,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
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
  Dumbbell,
  Waves,
  Utensils,
  Coffee,
  Smartphone,
  Monitor,
  Tablet,
  Eye as EyeIcon,
  Share2,
  X,
  Phone as PhoneIcon,
  Mail as MailIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Bed,
  Car,
  Utensils as UtensilsIcon
} from 'lucide-react';
import Link from 'next/link';

export default function FinanceManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('this_month');

  // Mock data for financial transactions
  const transactions = [
    {
      id: 'TXN001',
      type: 'revenue',
      category: 'Room Revenue',
      description: 'Room booking - John Smith (Room 201)',
      amount: 2000,
      date: '2024-01-15',
      status: 'completed',
      paymentMethod: 'Credit Card',
      reference: 'RES001',
      guest: 'John Smith',
      room: '201'
    },
    {
      id: 'TXN002',
      type: 'revenue',
      category: 'Restaurant',
      description: 'Restaurant order - Ahmed Hassan',
      amount: 530,
      date: '2024-01-15',
      status: 'completed',
      paymentMethod: 'Room Charge',
      reference: 'ORD001',
      guest: 'Ahmed Hassan',
      room: '101'
    },
    {
      id: 'TXN003',
      type: 'revenue',
      category: 'Tour Revenue',
      description: 'Etosha Safari Tour - Maria Garcia',
      amount: 2400,
      date: '2024-01-15',
      status: 'completed',
      paymentMethod: 'Room Charge',
      reference: 'BOOK001',
      guest: 'Maria Garcia',
      room: '301'
    },
    {
      id: 'TXN004',
      type: 'expense',
      category: 'Staff Salaries',
      description: 'Monthly staff salaries',
      amount: -15000,
      date: '2024-01-14',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      reference: 'PAY001',
      guest: null,
      room: null
    },
    {
      id: 'TXN005',
      type: 'expense',
      category: 'Utilities',
      description: 'Electricity bill - December 2023',
      amount: -2500,
      date: '2024-01-13',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      reference: 'UTIL001',
      guest: null,
      room: null
    },
    {
      id: 'TXN006',
      type: 'revenue',
      category: 'Room Revenue',
      description: 'Room booking - Sarah Johnson (Room 401)',
      amount: 1660,
      date: '2024-01-12',
      status: 'pending',
      paymentMethod: 'Credit Card',
      reference: 'RES004',
      guest: 'Sarah Johnson',
      room: '401'
    }
  ];

  const financialSummary = {
    totalRevenue: 6590,
    totalExpenses: 17500,
    netProfit: -10910,
    occupancyRate: 75,
    averageRoomRate: 915,
    revenueGrowth: 12.5,
    expenseGrowth: 8.3
  };

  const revenueBreakdown = [
    { category: 'Room Revenue', amount: 3660, percentage: 55.5 },
    { category: 'Restaurant', amount: 530, percentage: 8.0 },
    { category: 'Tour Revenue', amount: 2400, percentage: 36.4 }
  ];

  const expenseBreakdown = [
    { category: 'Staff Salaries', amount: 15000, percentage: 85.7 },
    { category: 'Utilities', amount: 2500, percentage: 14.3 }
  ];

  const getTransactionTypeColor = (type: string) => {
    return type === 'revenue' ? 'text-success' : 'text-error';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Financial Management</h1>
              <p className="text-primary-content/80">
                Manage revenue, expenses, and financial reports for Etuna Guesthouse
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
                New Transaction
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value text-success">
                N$ {financialSummary.totalRevenue.toLocaleString()}
              </div>
              <div className="stat-desc">
                +{financialSummary.revenueGrowth}% from last month
              </div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-error">
                <TrendingDown className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Expenses</div>
              <div className="stat-value text-error">
                N$ {Math.abs(financialSummary.totalExpenses).toLocaleString()}
              </div>
              <div className="stat-desc">
                +{financialSummary.expenseGrowth}% from last month
              </div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Net Profit</div>
              <div className={`stat-value ${financialSummary.netProfit >= 0 ? 'text-success' : 'text-error'}`}>
                N$ {financialSummary.netProfit.toLocaleString()}
              </div>
              <div className="stat-desc">This month</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Occupancy Rate</div>
              <div className="stat-value text-info">{financialSummary.occupancyRate}%</div>
              <div className="stat-desc">Current occupancy</div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Breakdown */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">Revenue Breakdown</h3>
              <div className="space-y-4">
                {revenueBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-primary rounded"></div>
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">N$ {item.amount.toLocaleString()}</div>
                      <div className="text-sm text-base-content/60">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">Expense Breakdown</h3>
              <div className="space-y-4">
                {expenseBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-error rounded"></div>
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">N$ {item.amount.toLocaleString()}</div>
                      <div className="text-sm text-base-content/60">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                    placeholder="Search transactions by description, category, or ID..."
                    className="input input-bordered w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  className="select select-bordered"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="revenue">Revenue</option>
                  <option value="expense">Expense</option>
                </select>
                <select
                  className="select select-bordered"
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                >
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="this_quarter">This Quarter</option>
                  <option value="this_year">This Year</option>
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

        {/* Transactions Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="font-mono text-sm">{transaction.id}</td>
                      <td>
                        <span className={`badge ${transaction.type === 'revenue' ? 'badge-success' : 'badge-error'}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td>{transaction.category}</td>
                      <td>
                        <div className="font-medium">{transaction.description}</div>
                        {transaction.guest && (
                          <div className="text-sm text-base-content/60">
                            {transaction.guest} • Room {transaction.room}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`font-semibold ${getTransactionTypeColor(transaction.type)}`}>
                          {transaction.type === 'expense' ? '-' : '+'}N$ {Math.abs(transaction.amount).toLocaleString()}
                        </span>
                      </td>
                      <td>{transaction.date}</td>
                      <td>
                        <span className={`badge ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-ghost btn-xs">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-xs">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-xs text-error">
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
      </div>
    </div>
  );
}
