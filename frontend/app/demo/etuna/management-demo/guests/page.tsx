'use client';

import { useState } from 'react';
import {
  Users,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  DollarSign,
  Bed,
  Car,
  Utensils,
  Coffee,
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
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
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
  Wifi
} from 'lucide-react';
import Link from 'next/link';

export default function GuestsManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for guests
  const guests = [
    {
      id: 'GUEST001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+264 81 123 4567',
      nationality: 'Namibian',
      idNumber: '1234567890123',
      passport: 'N1234567',
      address: '123 Main Street, Windhoek, Namibia',
      checkIn: '2024-01-15',
      checkOut: '2024-01-17',
      room: 'Executive Room 201',
      status: 'checked-in',
      loyaltyPoints: 1250,
      totalStays: 5,
      totalSpent: 8500,
      preferences: ['Vegetarian', 'Late check-in', 'High floor'],
      specialRequests: 'Late check-in requested',
      emergencyContact: 'Jane Smith (+264 81 987 6543)',
      created: '2024-01-10',
      lastVisit: '2024-01-15'
    },
    {
      id: 'GUEST002',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+264 81 234 5678',
      nationality: 'Spanish',
      idNumber: '',
      passport: 'E9876543',
      address: '456 Oak Avenue, Madrid, Spain',
      checkIn: '2024-01-16',
      checkOut: '2024-01-19',
      room: 'Family Suite 301',
      status: 'pending',
      loyaltyPoints: 0,
      totalStays: 1,
      totalSpent: 0,
      preferences: ['Family friendly', 'Ground floor'],
      specialRequests: 'Extra bed for children',
      emergencyContact: 'Carlos Garcia (+34 91 123 4567)',
      created: '2024-01-11',
      lastVisit: '2024-01-16'
    },
    {
      id: 'GUEST003',
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@email.com',
      phone: '+264 81 345 6789',
      nationality: 'Egyptian',
      idNumber: '',
      passport: 'EG1234567',
      address: '789 Palm Street, Cairo, Egypt',
      checkIn: '2024-01-14',
      checkOut: '2024-01-16',
      room: 'Standard Room 101',
      status: 'checked-out',
      loyaltyPoints: 500,
      totalStays: 2,
      totalSpent: 3000,
      preferences: ['Halal meals', 'Prayer mat'],
      specialRequests: 'Vegetarian meals',
      emergencyContact: 'Fatima Hassan (+20 2 1234 5678)',
      created: '2024-01-13',
      lastVisit: '2024-01-14'
    },
    {
      id: 'GUEST004',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+264 81 456 7890',
      nationality: 'American',
      idNumber: '',
      passport: 'US9876543',
      address: '321 Pine Road, New York, USA',
      checkIn: '2024-01-18',
      checkOut: '2024-01-20',
      room: 'Luxury Room 401',
      status: 'confirmed',
      loyaltyPoints: 2000,
      totalStays: 8,
      totalSpent: 12000,
      preferences: ['Ocean view', 'Spa access', 'Wine tasting'],
      specialRequests: 'Anniversary celebration',
      emergencyContact: 'Michael Johnson (+1 555 123 4567)',
      created: '2024-01-12',
      lastVisit: '2024-01-18'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'checked-out':
        return 'badge-neutral';
      case 'confirmed':
        return 'badge-info';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || guest.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Guest Management</h1>
              <p className="text-primary-content/80">
                Manage guest profiles, check-ins, and preferences for Etuna Guesthouse
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
                New Guest
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Filters and Search */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search guests by name, email, or ID..."
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
                  <option value="checked-in">Checked-in</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked-out">Checked-out</option>
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

        {/* Guests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuests.map((guest) => (
            <div key={guest.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-12">
                        <span className="text-lg font-bold">
                          {guest.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{guest.name}</h3>
                      <p className="text-sm text-base-content/60">{guest.nationality}</p>
                    </div>
                  </div>
                  <span className={`badge ${getStatusColor(guest.status)}`}>
                    {guest.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{guest.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{guest.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bed className="w-4 h-4 text-primary" />
                    <span>{guest.room}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{guest.checkIn} - {guest.checkOut}</span>
                  </div>
                </div>

                <div className="divider my-4"></div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-base-content/60">Loyalty Points</p>
                    <p className="font-semibold text-primary">{guest.loyaltyPoints.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-base-content/60">Total Stays</p>
                    <p className="font-semibold">{guest.totalStays}</p>
                  </div>
                  <div>
                    <p className="text-base-content/60">Total Spent</p>
                    <p className="font-semibold">N$ {guest.totalSpent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-base-content/60">Last Visit</p>
                    <p className="font-semibold">{guest.lastVisit}</p>
                  </div>
                </div>

                {guest.preferences.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-base-content/60 mb-2">Preferences:</p>
                    <div className="flex flex-wrap gap-1">
                      {guest.preferences.map((pref, index) => (
                        <span key={index} className="badge badge-outline badge-sm">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="card-actions justify-end mt-4">
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Guests</div>
              <div className="stat-value text-primary">{guests.length}</div>
              <div className="stat-desc">All time</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Checked-in</div>
              <div className="stat-value text-secondary">
                {guests.filter(g => g.status === 'checked-in').length}
              </div>
              <div className="stat-desc">Currently staying</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <Star className="w-8 h-8" />
              </div>
              <div className="stat-title">Loyalty Points</div>
              <div className="stat-value text-accent">
                {guests.reduce((sum, g) => sum + g.loyaltyPoints, 0).toLocaleString()}
              </div>
              <div className="stat-desc">Total points issued</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value text-info">
                N$ {guests.reduce((sum, g) => sum + g.totalSpent, 0).toLocaleString()}
              </div>
              <div className="stat-desc">From all guests</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
