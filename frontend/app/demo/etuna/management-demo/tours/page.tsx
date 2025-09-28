'use client';

import { useState } from 'react';
import {
  Car,
  MapPin,
  Calendar,
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
  Bed
} from 'lucide-react';
import Link from 'next/link';

export default function ToursManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Mock data for tours
  const tours = [
    {
      id: 'TOUR001',
      name: 'Etosha National Park Safari',
      type: 'Wildlife Safari',
      duration: 'Full Day',
      price: 1200,
      maxParticipants: 12,
      currentBookings: 8,
      status: 'active',
      date: '2024-01-20',
      time: '06:00',
      guide: 'John Safari',
      vehicle: 'Safari Truck #1',
      description: 'Full day safari through Etosha National Park with wildlife viewing and photography opportunities.',
      highlights: ['Wildlife Viewing', 'Photography', 'Lunch Included', 'Professional Guide'],
      includes: ['Transportation', 'Lunch', 'Guide', 'Park Fees', 'Water'],
      requirements: ['Comfortable Shoes', 'Camera', 'Sunscreen', 'Hat'],
      meetingPoint: 'Etuna Guesthouse Reception',
      difficulty: 'Easy',
      ageRestriction: 'All Ages',
      weatherDependent: true,
      cancellationPolicy: '24 hours notice required'
    },
    {
      id: 'TOUR002',
      name: 'Sossusvlei Dune Tour',
      type: 'Desert Adventure',
      duration: 'Full Day',
      price: 1500,
      maxParticipants: 8,
      currentBookings: 6,
      status: 'active',
      date: '2024-01-22',
      time: '05:30',
      guide: 'Maria Desert',
      vehicle: '4x4 Vehicle #2',
      description: 'Explore the famous red dunes of Sossusvlei and Deadvlei with guided hiking and photography.',
      highlights: ['Red Dunes', 'Deadvlei', 'Hiking', 'Photography', 'Sunrise Viewing'],
      includes: ['Transportation', 'Breakfast', 'Lunch', 'Guide', 'Park Fees', 'Water'],
      requirements: ['Hiking Boots', 'Camera', 'Sunscreen', 'Hat', 'Water Bottle'],
      meetingPoint: 'Etuna Guesthouse Reception',
      difficulty: 'Moderate',
      ageRestriction: '12+',
      weatherDependent: false,
      cancellationPolicy: '48 hours notice required'
    },
    {
      id: 'TOUR003',
      name: 'Windhoek City Tour',
      type: 'Cultural Tour',
      duration: 'Half Day',
      price: 450,
      maxParticipants: 15,
      currentBookings: 12,
      status: 'active',
      date: '2024-01-18',
      time: '09:00',
      guide: 'Peter City',
      vehicle: 'Minibus #3',
      description: 'Explore Windhoek city with visits to historical sites, markets, and cultural landmarks.',
      highlights: ['Historical Sites', 'Local Markets', 'Cultural Landmarks', 'City Center'],
      includes: ['Transportation', 'Guide', 'Entrance Fees', 'Water'],
      requirements: ['Comfortable Walking Shoes', 'Camera'],
      meetingPoint: 'Etuna Guesthouse Reception',
      difficulty: 'Easy',
      ageRestriction: 'All Ages',
      weatherDependent: false,
      cancellationPolicy: '24 hours notice required'
    },
    {
      id: 'TOUR004',
      name: 'Swakopmund Coastal Tour',
      type: 'Coastal Adventure',
      duration: 'Full Day',
      price: 800,
      maxParticipants: 10,
      currentBookings: 0,
      status: 'cancelled',
      date: '2024-01-25',
      time: '07:00',
      guide: 'Sarah Coastal',
      vehicle: 'Minibus #4',
      description: 'Coastal tour to Swakopmund with beach activities, seafood lunch, and local attractions.',
      highlights: ['Beach Activities', 'Seafood Lunch', 'Local Attractions', 'Coastal Views'],
      includes: ['Transportation', 'Lunch', 'Guide', 'Activities'],
      requirements: ['Swimwear', 'Sunscreen', 'Hat', 'Towel'],
      meetingPoint: 'Etuna Guesthouse Reception',
      difficulty: 'Easy',
      ageRestriction: 'All Ages',
      weatherDependent: true,
      cancellationPolicy: '24 hours notice required'
    }
  ];

  const bookings = [
    {
      id: 'BOOK001',
      tourId: 'TOUR001',
      tourName: 'Etosha National Park Safari',
      guest: 'John Smith',
      room: '201',
      participants: 2,
      totalPrice: 2400,
      status: 'confirmed',
      bookingDate: '2024-01-15',
      tourDate: '2024-01-20',
      specialRequests: 'Vegetarian lunch',
      emergencyContact: '+264 81 123 4567',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'BOOK002',
      tourId: 'TOUR002',
      tourName: 'Sossusvlei Dune Tour',
      guest: 'Maria Garcia',
      room: '301',
      participants: 4,
      totalPrice: 6000,
      status: 'confirmed',
      bookingDate: '2024-01-16',
      tourDate: '2024-01-22',
      specialRequests: 'Family with children',
      emergencyContact: '+264 81 234 5678',
      paymentStatus: 'paid',
      paymentMethod: 'Room Charge'
    },
    {
      id: 'BOOK003',
      tourId: 'TOUR003',
      tourName: 'Windhoek City Tour',
      guest: 'Ahmed Hassan',
      room: '101',
      participants: 1,
      totalPrice: 450,
      status: 'pending',
      bookingDate: '2024-01-17',
      tourDate: '2024-01-18',
      specialRequests: 'English speaking guide',
      emergencyContact: '+264 81 345 6789',
      paymentStatus: 'pending',
      paymentMethod: 'Cash'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'cancelled':
        return 'badge-error';
      case 'completed':
        return 'badge-neutral';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-neutral';
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-error';
      case 'completed':
        return 'badge-neutral';
      default:
        return 'badge-neutral';
    }
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.guide.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tour.status === filterStatus;
    const matchesType = filterType === 'all' || tour.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tours & Activities Management</h1>
              <p className="text-primary-content/80">
                Manage guided tours, activities, and bookings for Etuna Guesthouse
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
                New Tour
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button className="tab tab-active">Tours</button>
          <button className="tab">Bookings</button>
          <button className="tab">Guides</button>
          <button className="tab">Vehicles</button>
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
                    placeholder="Search tours by name, type, or guide..."
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
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  className="select select-bordered"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="Wildlife Safari">Wildlife Safari</option>
                  <option value="Desert Adventure">Desert Adventure</option>
                  <option value="Cultural Tour">Cultural Tour</option>
                  <option value="Coastal Adventure">Coastal Adventure</option>
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

        {/* Tours Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredTours.map((tour) => (
            <div key={tour.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{tour.name}</h3>
                    <p className="text-sm text-base-content/60">{tour.type} • {tour.duration}</p>
                    <p className="text-xs text-base-content/60">Guide: {tour.guide}</p>
                  </div>
                  <span className={`badge ${getStatusColor(tour.status)}`}>
                    {tour.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Date:</span>
                    <span className="font-semibold">{tour.date} at {tour.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Price:</span>
                    <span className="font-semibold text-primary">N$ {tour.price}/person</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Participants:</span>
                    <span className="font-semibold">{tour.currentBookings}/{tour.maxParticipants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Vehicle:</span>
                    <span className="font-semibold">{tour.vehicle}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-base-content/60 mb-2">Description:</p>
                  <p className="text-sm">{tour.description}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-base-content/60 mb-2">Highlights:</p>
                  <div className="flex flex-wrap gap-1">
                    {tour.highlights.map((highlight, index) => (
                      <span key={index} className="badge badge-outline badge-sm">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-base-content/60">Difficulty:</span>
                    <span className="font-semibold ml-2">{tour.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-base-content/60">Age Restriction:</span>
                    <span className="font-semibold ml-2">{tour.ageRestriction}</span>
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

        {/* Recent Bookings */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Tour</th>
                    <th>Guest</th>
                    <th>Participants</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="font-mono text-sm">{booking.id}</td>
                      <td>
                        <div className="font-semibold">{booking.tourName}</div>
                        <div className="text-sm text-base-content/60">Room {booking.room}</div>
                      </td>
                      <td>{booking.guest}</td>
                      <td>{booking.participants}</td>
                      <td>{booking.tourDate}</td>
                      <td>N$ {booking.totalPrice}</td>
                      <td>
                        <span className={`badge ${getBookingStatusColor(booking.status)}`}>
                          {booking.status}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Car className="w-8 h-8" />
              </div>
              <div className="stat-title">Active Tours</div>
              <div className="stat-value text-primary">
                {tours.filter(t => t.status === 'active').length}
              </div>
              <div className="stat-desc">Available for booking</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Bookings</div>
              <div className="stat-value text-secondary">{bookings.length}</div>
              <div className="stat-desc">This month</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Tour Revenue</div>
              <div className="stat-value text-accent">
                N$ {bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}
              </div>
              <div className="stat-desc">From bookings</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <Star className="w-8 h-8" />
              </div>
              <div className="stat-title">Avg Rating</div>
              <div className="stat-value text-info">4.8</div>
              <div className="stat-desc">Customer satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
