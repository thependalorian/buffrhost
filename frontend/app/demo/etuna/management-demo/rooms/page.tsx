'use client';

import { useState } from 'react';
import {
  Bed,
  Home,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Utensils,
  Smartphone,
  Monitor,
  Tablet,
  Eye,
  Share2,
  X,
  Phone,
  Mail,
  Globe,
  Building,
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
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye as EyeIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Star,
  DollarSign,
  Calendar,
  Clock,
  Users,
  User,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function RoomsManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Mock data for rooms
  const rooms = [
    {
      id: 'ROOM001',
      number: '101',
      type: 'Standard',
      floor: 1,
      status: 'occupied',
      guest: 'Ahmed Hassan',
      checkIn: '2024-01-14',
      checkOut: '2024-01-16',
      amenities: ['WiFi', 'TV', 'Air Conditioning', 'Private Bathroom'],
      capacity: 2,
      price: 750,
      maintenance: 'none',
      housekeeping: 'clean',
      lastCleaned: '2024-01-14',
      nextCleaning: '2024-01-16',
      issues: [],
      notes: 'Guest requested late check-out'
    },
    {
      id: 'ROOM002',
      number: '201',
      type: 'Executive',
      floor: 2,
      status: 'occupied',
      guest: 'John Smith',
      checkIn: '2024-01-15',
      checkOut: '2024-01-17',
      amenities: ['WiFi', 'TV', 'Air Conditioning', 'Private Bathroom', 'Mini Bar', 'Balcony'],
      capacity: 2,
      price: 1000,
      maintenance: 'none',
      housekeeping: 'clean',
      lastCleaned: '2024-01-15',
      nextCleaning: '2024-01-17',
      issues: [],
      notes: 'Anniversary stay'
    },
    {
      id: 'ROOM003',
      number: '301',
      type: 'Family Suite',
      floor: 3,
      status: 'reserved',
      guest: 'Maria Garcia',
      checkIn: '2024-01-16',
      checkOut: '2024-01-19',
      amenities: ['WiFi', 'TV', 'Air Conditioning', 'Private Bathroom', 'Kitchenette', 'Living Area', 'Extra Bed'],
      capacity: 4,
      price: 1500,
      maintenance: 'none',
      housekeeping: 'clean',
      lastCleaned: '2024-01-13',
      nextCleaning: '2024-01-16',
      issues: [],
      notes: 'Family with children'
    },
    {
      id: 'ROOM004',
      number: '401',
      type: 'Luxury',
      floor: 4,
      status: 'reserved',
      guest: 'Sarah Johnson',
      checkIn: '2024-01-18',
      checkOut: '2024-01-20',
      amenities: ['WiFi', 'TV', 'Air Conditioning', 'Private Bathroom', 'Mini Bar', 'Balcony', 'Ocean View', 'Spa Access'],
      capacity: 2,
      price: 2000,
      maintenance: 'none',
      housekeeping: 'clean',
      lastCleaned: '2024-01-12',
      nextCleaning: '2024-01-18',
      issues: [],
      notes: 'Anniversary celebration'
    },
    {
      id: 'ROOM005',
      number: '102',
      type: 'Standard',
      floor: 1,
      status: 'available',
      guest: null,
      checkIn: null,
      checkOut: null,
      amenities: ['WiFi', 'TV', 'Air Conditioning', 'Private Bathroom'],
      capacity: 2,
      price: 750,
      maintenance: 'none',
      housekeeping: 'clean',
      lastCleaned: '2024-01-15',
      nextCleaning: '2024-01-17',
      issues: [],
      notes: 'Ready for check-in'
    },
    {
      id: 'ROOM006',
      number: '202',
      type: 'Executive',
      floor: 2,
      status: 'maintenance',
      guest: null,
      checkIn: null,
      checkOut: null,
      amenities: ['WiFi', 'TV', 'Air Conditioning', 'Private Bathroom', 'Mini Bar', 'Balcony'],
      capacity: 2,
      price: 1000,
      maintenance: 'air_conditioning',
      housekeeping: 'dirty',
      lastCleaned: '2024-01-10',
      nextCleaning: '2024-01-18',
      issues: ['Air conditioning not working'],
      notes: 'AC unit needs repair'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'badge-success';
      case 'occupied':
        return 'badge-info';
      case 'reserved':
        return 'badge-warning';
      case 'maintenance':
        return 'badge-error';
      case 'cleaning':
        return 'badge-neutral';
      default:
        return 'badge-neutral';
    }
  };

  const getMaintenanceColor = (maintenance: string) => {
    switch (maintenance) {
      case 'none':
        return 'text-success';
      case 'air_conditioning':
        return 'text-error';
      case 'plumbing':
        return 'text-error';
      case 'electrical':
        return 'text-error';
      default:
        return 'text-warning';
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (room.guest && room.guest.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    const matchesType = filterType === 'all' || room.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Room Management</h1>
              <p className="text-primary-content/80">
                Manage room inventory, status, and maintenance for Etuna Guesthouse
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
                Add Room
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
                    placeholder="Search rooms by number, type, or guest..."
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
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="cleaning">Cleaning</option>
                </select>
                <select
                  className="select select-bordered"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="Standard">Standard</option>
                  <option value="Executive">Executive</option>
                  <option value="Family Suite">Family Suite</option>
                  <option value="Luxury">Luxury</option>
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

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div key={room.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-12">
                        <span className="text-lg font-bold">{room.number}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Room {room.number}</h3>
                      <p className="text-sm text-base-content/60">{room.type} • Floor {room.floor}</p>
                    </div>
                  </div>
                  <span className={`badge ${getStatusColor(room.status)}`}>
                    {room.status}
                  </span>
                </div>

                {room.guest && (
                  <div className="bg-base-200 p-3 rounded-lg mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{room.guest}</span>
                    </div>
                    <div className="text-sm text-base-content/60">
                      <div>Check-in: {room.checkIn}</div>
                      <div>Check-out: {room.checkOut}</div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/60">Capacity:</span>
                    <span className="font-semibold">{room.capacity} guests</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/60">Price:</span>
                    <span className="font-semibold">N$ {room.price}/night</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/60">Maintenance:</span>
                    <span className={`font-semibold ${getMaintenanceColor(room.maintenance)}`}>
                      {room.maintenance === 'none' ? 'None' : room.maintenance}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/60">Housekeeping:</span>
                    <span className="font-semibold capitalize">{room.housekeeping}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-base-content/60 mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.map((amenity, index) => (
                      <span key={index} className="badge badge-outline badge-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {room.issues.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-base-content/60 mb-2">Issues:</p>
                    <div className="flex flex-wrap gap-1">
                      {room.issues.map((issue, index) => (
                        <span key={index} className="badge badge-error badge-sm">
                          {issue}
                        </span>
                      ))}
                    </div>
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
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Bed className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Rooms</div>
              <div className="stat-value text-primary">{rooms.length}</div>
              <div className="stat-desc">All rooms</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Available</div>
              <div className="stat-value text-secondary">
                {rooms.filter(r => r.status === 'available').length}
              </div>
              <div className="stat-desc">Ready for guests</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Occupied</div>
              <div className="stat-value text-accent">
                {rooms.filter(r => r.status === 'occupied').length}
              </div>
              <div className="stat-desc">Currently occupied</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="stat-title">Maintenance</div>
              <div className="stat-value text-info">
                {rooms.filter(r => r.status === 'maintenance').length}
              </div>
              <div className="stat-desc">Need attention</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
