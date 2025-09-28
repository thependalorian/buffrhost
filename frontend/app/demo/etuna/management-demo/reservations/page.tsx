'use client';

import { Metadata } from 'next';
import { useState } from 'react';
import {
  Calendar,
  Users,
  Bed,
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
  Phone,
  Mail,
  MapPin,
  Star,
  DollarSign,
  User,
  Calendar as CalendarIcon,
  ArrowLeft,
  ArrowRight,
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
  Oganesson
} from 'lucide-react';
import Link from 'next/link';

export default function ReservationsManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  // Mock data for reservations
  const reservations = [
    {
      id: 'RES001',
      guest: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+264 81 123 4567',
      room: 'Executive Room 201',
      roomType: 'Executive',
      checkIn: '2024-01-15',
      checkOut: '2024-01-17',
      nights: 2,
      guests: 2,
      adults: 2,
      children: 0,
      status: 'confirmed',
      total: 2000,
      deposit: 500,
      balance: 1500,
      source: 'Website',
      specialRequests: 'Late check-in requested',
      created: '2024-01-10',
      modified: '2024-01-12'
    },
    {
      id: 'RES002',
      guest: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+264 81 234 5678',
      room: 'Family Suite 301',
      roomType: 'Family Suite',
      checkIn: '2024-01-16',
      checkOut: '2024-01-19',
      nights: 3,
      guests: 4,
      adults: 2,
      children: 2,
      status: 'pending',
      total: 4500,
      deposit: 1000,
      balance: 3500,
      source: 'Phone',
      specialRequests: 'Extra bed for children',
      created: '2024-01-11',
      modified: '2024-01-13'
    },
    {
      id: 'RES003',
      guest: 'Ahmed Hassan',
      email: 'ahmed.hassan@email.com',
      phone: '+264 81 345 6789',
      room: 'Standard Room 101',
      roomType: 'Standard',
      checkIn: '2024-01-14',
      checkOut: '2024-01-16',
      nights: 2,
      guests: 1,
      adults: 1,
      children: 0,
      status: 'checked-in',
      total: 1500,
      deposit: 300,
      balance: 0,
      source: 'Walk-in',
      specialRequests: 'Vegetarian meals',
      created: '2024-01-13',
      modified: '2024-01-14'
    },
    {
      id: 'RES004',
      guest: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+264 81 456 7890',
      room: 'Luxury Room 401',
      roomType: 'Luxury',
      checkIn: '2024-01-18',
      checkOut: '2024-01-20',
      nights: 2,
      guests: 2,
      adults: 2,
      children: 0,
      status: 'confirmed',
      total: 1660,
      deposit: 400,
      balance: 1260,
      source: 'Booking.com',
      specialRequests: 'Anniversary celebration',
      created: '2024-01-12',
      modified: '2024-01-14'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'checked-in':
        return 'badge-info';
      case 'checked-out':
        return 'badge-neutral';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reservations Management</h1>
              <p className="text-primary-content/80">
                Manage room reservations and bookings for Etuna Guesthouse
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
                New Reservation
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
                    placeholder="Search reservations by guest name, email, or ID..."
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
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="checked-in">Checked-in</option>
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

        {/* Reservations Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Reservation ID</th>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Nights</th>
                    <th>Guests</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>
                        <div className="font-mono text-sm">{reservation.id}</div>
                        <div className="text-xs text-base-content/60">{reservation.source}</div>
                      </td>
                      <td>
                        <div className="font-semibold">{reservation.guest}</div>
                        <div className="text-sm text-base-content/60">{reservation.email}</div>
                        <div className="text-xs text-base-content/60">{reservation.phone}</div>
                      </td>
                      <td>
                        <div className="font-semibold">{reservation.room}</div>
                        <div className="text-sm text-base-content/60">{reservation.roomType}</div>
                      </td>
                      <td>
                        <div className="font-semibold">{reservation.checkIn}</div>
                        <div className="text-sm text-base-content/60">Check-in</div>
                      </td>
                      <td>
                        <div className="font-semibold">{reservation.checkOut}</div>
                        <div className="text-sm text-base-content/60">Check-out</div>
                      </td>
                      <td>
                        <div className="font-semibold">{reservation.nights}</div>
                        <div className="text-sm text-base-content/60">nights</div>
                      </td>
                      <td>
                        <div className="font-semibold">{reservation.guests}</div>
                        <div className="text-sm text-base-content/60">
                          {reservation.adults}A, {reservation.children}C
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold">N$ {reservation.total}</div>
                        <div className="text-sm text-base-content/60">
                          Balance: N$ {reservation.balance}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Reservations</div>
              <div className="stat-value text-primary">{reservations.length}</div>
              <div className="stat-desc">All time</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Confirmed</div>
              <div className="stat-value text-secondary">
                {reservations.filter(r => r.status === 'confirmed').length}
              </div>
              <div className="stat-desc">Ready for check-in</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <Clock className="w-8 h-8" />
              </div>
              <div className="stat-title">Pending</div>
              <div className="stat-value text-accent">
                {reservations.filter(r => r.status === 'pending').length}
              </div>
              <div className="stat-desc">Awaiting confirmation</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value text-info">
                N$ {reservations.reduce((sum, r) => sum + r.total, 0).toLocaleString()}
              </div>
              <div className="stat-desc">From all reservations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
