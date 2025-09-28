'use client';

import { useState } from 'react';
import {
  Users,
  User,
  Target,
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
  Clock,
  Star,
  DollarSign,
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
  Bed,
  Car,
  Utensils as UtensilsIcon
} from 'lucide-react';
import Link from 'next/link';

export default function CRMManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for CRM
  const leads = [
    {
      id: 'LEAD001',
      name: 'Corporate Travel Group',
      company: 'Namibia Business Travel',
      email: 'contact@nbtravel.com',
      phone: '+264 61 123 4567',
      source: 'Website',
      status: 'hot',
      value: 50000,
      probability: 80,
      expectedClose: '2024-02-15',
      lastContact: '2024-01-10',
      notes: 'Interested in corporate retreat packages for 50+ people',
      assignedTo: 'John Manager',
      tags: ['corporate', 'retreat', 'large-group']
    },
    {
      id: 'LEAD002',
      name: 'Adventure Seekers',
      company: 'Wildlife Photography Club',
      email: 'info@wildlifephoto.com',
      phone: '+264 61 234 5678',
      source: 'Referral',
      status: 'warm',
      value: 25000,
      probability: 60,
      expectedClose: '2024-03-01',
      lastContact: '2024-01-08',
      notes: 'Photography tour group, interested in Etosha packages',
      assignedTo: 'Maria Sales',
      tags: ['photography', 'wildlife', 'tours']
    },
    {
      id: 'LEAD003',
      name: 'Luxury Travel Agency',
      company: 'Premium Travel Namibia',
      email: 'bookings@premiumtravel.com',
      phone: '+264 61 345 6789',
      source: 'Trade Show',
      status: 'cold',
      value: 75000,
      probability: 30,
      expectedClose: '2024-04-30',
      lastContact: '2024-01-05',
      notes: 'High-end travel agency, potential for luxury packages',
      assignedTo: 'Peter Sales',
      tags: ['luxury', 'agency', 'high-value']
    }
  ];

  const customers = [
    {
      id: 'CUST001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+264 81 123 4567',
      company: 'Smith Enterprises',
      segment: 'Business',
      status: 'active',
      totalSpent: 15000,
      lastVisit: '2024-01-15',
      nextVisit: '2024-02-15',
      loyaltyPoints: 2500,
      preferences: ['Executive Room', 'Tour Packages', 'Restaurant'],
      notes: 'Regular business traveler, prefers executive rooms',
      assignedTo: 'John Manager'
    },
    {
      id: 'CUST002',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+264 81 234 5678',
      company: 'Garcia Family',
      segment: 'Leisure',
      status: 'active',
      totalSpent: 8500,
      lastVisit: '2024-01-16',
      nextVisit: '2024-06-16',
      loyaltyPoints: 1200,
      preferences: ['Family Suite', 'Child-friendly', 'Tours'],
      notes: 'Family with children, interested in family packages',
      assignedTo: 'Maria Sales'
    },
    {
      id: 'CUST003',
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@email.com',
      phone: '+264 81 345 6789',
      company: 'Hassan Travel',
      segment: 'Business',
      status: 'inactive',
      totalSpent: 5000,
      lastVisit: '2023-12-10',
      nextVisit: null,
      loyaltyPoints: 500,
      preferences: ['Standard Room', 'Halal Meals', 'Prayer Facilities'],
      notes: 'Inactive customer, may need re-engagement',
      assignedTo: 'Peter Sales'
    }
  ];

  const opportunities = [
    {
      id: 'OPP001',
      name: 'Corporate Retreat Package',
      customer: 'Corporate Travel Group',
      value: 50000,
      stage: 'proposal',
      probability: 80,
      expectedClose: '2024-02-15',
      nextAction: 'Send proposal',
      nextActionDate: '2024-01-20',
      notes: '50-person corporate retreat for 3 days',
      assignedTo: 'John Manager'
    },
    {
      id: 'OPP002',
      name: 'Photography Tour Package',
      customer: 'Adventure Seekers',
      value: 25000,
      stage: 'negotiation',
      probability: 60,
      expectedClose: '2024-03-01',
      nextAction: 'Follow up on proposal',
      nextActionDate: '2024-01-25',
      notes: 'Wildlife photography tour for 15 people',
      assignedTo: 'Maria Sales'
    },
    {
      id: 'OPP003',
      name: 'Luxury Travel Partnership',
      customer: 'Premium Travel Namibia',
      value: 75000,
      stage: 'qualification',
      probability: 30,
      expectedClose: '2024-04-30',
      nextAction: 'Initial meeting',
      nextActionDate: '2024-02-01',
      notes: 'Partnership for luxury travel packages',
      assignedTo: 'Peter Sales'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot':
        return 'badge-error';
      case 'warm':
        return 'badge-warning';
      case 'cold':
        return 'badge-neutral';
      case 'active':
        return 'badge-success';
      case 'inactive':
        return 'badge-neutral';
      default:
        return 'badge-neutral';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'qualification':
        return 'badge-neutral';
      case 'proposal':
        return 'badge-warning';
      case 'negotiation':
        return 'badge-info';
      case 'closed-won':
        return 'badge-success';
      case 'closed-lost':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = filterSegment === 'all' || lead.status === filterSegment;
    return matchesSearch && matchesSegment;
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = filterSegment === 'all' || customer.segment === filterSegment;
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesSegment && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">CRM & Lead Management</h1>
              <p className="text-primary-content/80">
                Manage customer relationships, leads, and sales opportunities for Etuna Guesthouse
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
                New Lead
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button className="tab tab-active">Leads</button>
          <button className="tab">Customers</button>
          <button className="tab">Opportunities</button>
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
                    placeholder="Search leads, customers, or opportunities..."
                    className="input input-bordered w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  className="select select-bordered"
                  value={filterSegment}
                  onChange={(e) => setFilterSegment(e.target.value)}
                >
                  <option value="all">All Segments</option>
                  <option value="hot">Hot Leads</option>
                  <option value="warm">Warm Leads</option>
                  <option value="cold">Cold Leads</option>
                  <option value="Business">Business</option>
                  <option value="Leisure">Leisure</option>
                </select>
                <select
                  className="select select-bordered"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
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

        {/* Leads Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="text-2xl font-bold mb-4">Sales Leads</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="card bg-base-200 shadow-sm">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{lead.name}</h4>
                        <p className="text-sm text-base-content/60">{lead.company}</p>
                      </div>
                      <span className={`badge ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span>Source: {lead.source}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-base-content/60">Value</p>
                        <p className="font-semibold text-primary">N$ {lead.value.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Probability</p>
                        <p className="font-semibold">{lead.probability}%</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Expected Close</p>
                        <p className="font-semibold">{lead.expectedClose}</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Assigned To</p>
                        <p className="font-semibold">{lead.assignedTo}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-base-content/60 mb-2">Notes:</p>
                      <p className="text-sm bg-base-100 p-2 rounded">{lead.notes}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {lead.tags.map((tag, index) => (
                        <span key={index} className="badge badge-outline badge-sm">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="card-actions justify-end">
                      <button className="btn btn-ghost btn-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customers Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="text-2xl font-bold mb-4">Customer Database</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Segment</th>
                    <th>Status</th>
                    <th>Total Spent</th>
                    <th>Last Visit</th>
                    <th>Loyalty Points</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-base-content/60">{customer.email}</div>
                        <div className="text-xs text-base-content/60">{customer.company}</div>
                      </td>
                      <td>
                        <span className="badge badge-outline">{customer.segment}</span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td>
                        <div className="font-semibold">N$ {customer.totalSpent.toLocaleString()}</div>
                      </td>
                      <td>
                        <div className="font-medium">{customer.lastVisit}</div>
                        {customer.nextVisit && (
                          <div className="text-sm text-base-content/60">Next: {customer.nextVisit}</div>
                        )}
                      </td>
                      <td>
                        <div className="font-semibold text-primary">{customer.loyaltyPoints.toLocaleString()}</div>
                      </td>
                      <td>{customer.assignedTo}</td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-ghost btn-xs">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-xs">
                            <Edit className="w-4 h-4" />
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

        {/* Opportunities Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="text-2xl font-bold mb-4">Sales Opportunities</h3>
            <div className="space-y-4">
              {opportunities.map((opportunity) => (
                <div key={opportunity.id} className="card bg-base-200 shadow-sm">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{opportunity.name}</h4>
                        <p className="text-sm text-base-content/60">{opportunity.customer}</p>
                      </div>
                      <span className={`badge ${getStageColor(opportunity.stage)}`}>
                        {opportunity.stage}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-base-content/60">Value</p>
                        <p className="font-semibold text-primary">N$ {opportunity.value.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Probability</p>
                        <p className="font-semibold">{opportunity.probability}%</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Expected Close</p>
                        <p className="font-semibold">{opportunity.expectedClose}</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Assigned To</p>
                        <p className="font-semibold">{opportunity.assignedTo}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-base-content/60 mb-2">Next Action:</p>
                      <p className="text-sm bg-base-100 p-2 rounded">
                        {opportunity.nextAction} - {opportunity.nextActionDate}
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-base-content/60 mb-2">Notes:</p>
                      <p className="text-sm bg-base-100 p-2 rounded">{opportunity.notes}</p>
                    </div>

                    <div className="card-actions justify-end">
                      <button className="btn btn-ghost btn-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="btn btn-ghost btn-sm">
                        <Calendar className="w-4 h-4" />
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
                <Target className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Leads</div>
              <div className="stat-value text-primary">{leads.length}</div>
              <div className="stat-desc">Active leads</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Customers</div>
              <div className="stat-value text-secondary">{customers.length}</div>
              <div className="stat-desc">In database</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Pipeline Value</div>
              <div className="stat-value text-accent">
                N$ {opportunities.reduce((sum, opp) => sum + opp.value, 0).toLocaleString()}
              </div>
              <div className="stat-desc">Total opportunities</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="stat-title">Conversion Rate</div>
              <div className="stat-value text-info">25%</div>
              <div className="stat-desc">Leads to customers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
