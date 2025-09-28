'use client';

import { useState } from 'react';
import {
  FileText,
  Receipt,
  DollarSign,
  Calendar,
  Clock,
  Users,
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

export default function InvoicesManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Mock data for invoices
  const invoices = [
    {
      id: 'INV001',
      invoiceNumber: 'ETU-2024-001',
      customer: 'John Smith',
      customerEmail: 'john.smith@email.com',
      customerPhone: '+264 81 123 4567',
      type: 'Accommodation',
      status: 'paid',
      amount: 2000,
      tax: 300,
      total: 2300,
      issueDate: '2024-01-15',
      dueDate: '2024-01-22',
      paidDate: '2024-01-18',
      paymentMethod: 'Credit Card',
      items: [
        { description: 'Executive Room - 2 nights', quantity: 2, rate: 1000, amount: 2000 }
      ],
      notes: 'Thank you for your stay at Etuna Guesthouse',
      createdBy: 'John Manager'
    },
    {
      id: 'INV002',
      invoiceNumber: 'ETU-2024-002',
      customer: 'Maria Garcia',
      customerEmail: 'maria.garcia@email.com',
      customerPhone: '+264 81 234 5678',
      type: 'Tour Package',
      status: 'pending',
      amount: 4500,
      tax: 675,
      total: 5175,
      issueDate: '2024-01-16',
      dueDate: '2024-01-23',
      paidDate: null,
      paymentMethod: 'Bank Transfer',
      items: [
        { description: 'Etosha Safari Tour - 4 people', quantity: 4, rate: 1125, amount: 4500 }
      ],
      notes: 'Etosha National Park safari package for family',
      createdBy: 'Maria Sales'
    },
    {
      id: 'INV003',
      invoiceNumber: 'ETU-2024-003',
      customer: 'Ahmed Hassan',
      customerEmail: 'ahmed.hassan@email.com',
      customerPhone: '+264 81 345 6789',
      type: 'Restaurant',
      status: 'overdue',
      amount: 530,
      tax: 80,
      total: 610,
      issueDate: '2024-01-14',
      dueDate: '2024-01-21',
      paidDate: null,
      paymentMethod: 'Cash',
      items: [
        { description: 'Restaurant Order - Table 5', quantity: 1, rate: 530, amount: 530 }
      ],
      notes: 'Restaurant order for room service',
      createdBy: 'Peter Waiter'
    },
    {
      id: 'INV004',
      invoiceNumber: 'ETU-2024-004',
      customer: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@email.com',
      customerPhone: '+264 81 456 7890',
      type: 'Accommodation',
      status: 'draft',
      amount: 1660,
      tax: 249,
      total: 1909,
      issueDate: '2024-01-18',
      dueDate: '2024-01-25',
      paidDate: null,
      paymentMethod: 'Credit Card',
      items: [
        { description: 'Luxury Room - 2 nights', quantity: 2, rate: 830, amount: 1660 }
      ],
      notes: 'Luxury room booking for anniversary',
      createdBy: 'John Manager'
    }
  ];

  const invoiceTemplates = [
    {
      id: 'TEMP001',
      name: 'Standard Invoice',
      type: 'Accommodation',
      description: 'Standard invoice template for room bookings',
      usage: 25,
      lastUsed: '2024-01-15',
      fields: ['customer_info', 'room_details', 'dates', 'rates', 'payment_terms']
    },
    {
      id: 'TEMP002',
      name: 'Tour Package Invoice',
      type: 'Tour Package',
      description: 'Invoice template for tour and activity bookings',
      usage: 12,
      lastUsed: '2024-01-16',
      fields: ['customer_info', 'tour_details', 'participants', 'dates', 'rates']
    },
    {
      id: 'TEMP003',
      name: 'Restaurant Invoice',
      type: 'Restaurant',
      description: 'Invoice template for restaurant orders and dining',
      usage: 18,
      lastUsed: '2024-01-14',
      fields: ['customer_info', 'order_details', 'items', 'quantities', 'rates']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'overdue':
        return 'badge-error';
      case 'draft':
        return 'badge-info';
      case 'cancelled':
        return 'badge-neutral';
      default:
        return 'badge-neutral';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Accommodation':
        return 'badge-primary';
      case 'Tour Package':
        return 'badge-secondary';
      case 'Restaurant':
        return 'badge-accent';
      case 'Service':
        return 'badge-info';
      default:
        return 'badge-neutral';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    const matchesType = filterType === 'all' || invoice.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Invoice Management</h1>
              <p className="text-primary-content/80">
                Manage invoices, billing, and payment tracking for Etuna Guesthouse
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
                New Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button className="tab tab-active">Invoices</button>
          <button className="tab">Templates</button>
          <button className="tab">Payments</button>
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
                    placeholder="Search invoices by number, customer, or email..."
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
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="draft">Draft</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  className="select select-bordered"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="Accommodation">Accommodation</option>
                  <option value="Tour Package">Tour Package</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Service">Service</option>
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

        {/* Invoices List */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>
                        <div className="font-mono text-sm">{invoice.invoiceNumber}</div>
                        <div className="text-xs text-base-content/60">Created by {invoice.createdBy}</div>
                      </td>
                      <td>
                        <div className="font-medium">{invoice.customer}</div>
                        <div className="text-sm text-base-content/60">{invoice.customerEmail}</div>
                        <div className="text-xs text-base-content/60">{invoice.customerPhone}</div>
                      </td>
                      <td>
                        <span className={`badge ${getTypeColor(invoice.type)}`}>
                          {invoice.type}
                        </span>
                      </td>
                      <td>
                        <div className="font-semibold">N$ {invoice.total.toLocaleString()}</div>
                        <div className="text-sm text-base-content/60">
                          Subtotal: N$ {invoice.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-base-content/60">
                          Tax: N$ {invoice.tax.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                        {invoice.paidDate && (
                          <div className="text-xs text-base-content/60 mt-1">
                            Paid: {invoice.paidDate}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="font-medium">{invoice.issueDate}</div>
                      </td>
                      <td>
                        <div className="font-medium">{invoice.dueDate}</div>
                        {invoice.status === 'overdue' && (
                          <div className="text-xs text-error mt-1">Overdue</div>
                        )}
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-ghost btn-xs">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-xs">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-xs">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-xs">
                            <Mail className="w-4 h-4" />
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

        {/* Invoice Templates */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="text-2xl font-bold mb-4">Invoice Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {invoiceTemplates.map((template) => (
                <div key={template.id} className="card bg-base-200 shadow-sm">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{template.name}</h4>
                      <span className={`badge ${getTypeColor(template.type)}`}>
                        {template.type}
                      </span>
                    </div>
                    <p className="text-sm text-base-content/60 mb-3">{template.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-base-content/60">Usage</p>
                        <p className="font-semibold">{template.usage} times</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Last Used</p>
                        <p className="font-semibold">{template.lastUsed}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-base-content/60 mb-2">Fields:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.fields.map((field, index) => (
                          <span key={index} className="badge badge-ghost badge-sm">
                            {field}
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
                      <button className="btn btn-ghost btn-sm">
                        <Copy className="w-4 h-4" />
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
                <Receipt className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Invoices</div>
              <div className="stat-value text-primary">{invoices.length}</div>
              <div className="stat-desc">All invoices</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Paid</div>
              <div className="stat-value text-secondary">
                {invoices.filter(i => i.status === 'paid').length}
              </div>
              <div className="stat-desc">Successfully paid</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value text-accent">
                N$ {invoices.reduce((sum, i) => sum + i.total, 0).toLocaleString()}
              </div>
              <div className="stat-desc">From all invoices</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Overdue</div>
              <div className="stat-value text-info">
                {invoices.filter(i => i.status === 'overdue').length}
              </div>
              <div className="stat-desc">Need attention</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
