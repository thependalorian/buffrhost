'use client';

import { useState } from 'react';
import {
  Mail,
  MessageSquare,
  Phone,
  Bell,
  Send,
  Clock,
  Users,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
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
  User,
  Bed,
  Car,
  Utensils as UtensilsIcon,
  Calendar,
  DollarSign,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function CommunicationsManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for communications
  const communications = [
    {
      id: 'COMM001',
      type: 'email',
      subject: 'Welcome to Etuna Guesthouse',
      recipient: 'john.smith@email.com',
      sender: 'Etuna Guesthouse',
      status: 'sent',
      priority: 'normal',
      date: '2024-01-15 10:30',
      content: 'Welcome to Etuna Guesthouse! We hope you enjoy your stay with us. If you need anything, please don\'t hesitate to contact us.',
      template: 'welcome_email',
      guest: 'John Smith',
      room: '201',
      tags: ['welcome', 'automated']
    },
    {
      id: 'COMM002',
      type: 'sms',
      subject: 'Check-in Reminder',
      recipient: '+264 81 234 5678',
      sender: 'Etuna Guesthouse',
      status: 'delivered',
      priority: 'high',
      date: '2024-01-16 09:15',
      content: 'Hello Maria! Your check-in is tomorrow at 2:00 PM. We look forward to welcoming you to Etuna Guesthouse.',
      template: 'checkin_reminder',
      guest: 'Maria Garcia',
      room: '301',
      tags: ['reminder', 'checkin']
    },
    {
      id: 'COMM003',
      type: 'phone',
      subject: 'Tour Booking Confirmation',
      recipient: '+264 81 345 6789',
      sender: 'Etuna Tours',
      status: 'completed',
      priority: 'normal',
      date: '2024-01-15 14:20',
      content: 'Your Etosha Safari tour has been confirmed for January 20th at 6:00 AM. Please meet at the reception.',
      template: 'tour_confirmation',
      guest: 'Ahmed Hassan',
      room: '101',
      tags: ['tour', 'confirmation']
    },
    {
      id: 'COMM004',
      type: 'email',
      subject: 'Restaurant Order Update',
      recipient: 'sarah.johnson@email.com',
      sender: 'Etuna Restaurant',
      status: 'sent',
      priority: 'normal',
      date: '2024-01-15 19:45',
      content: 'Your restaurant order is being prepared and will be ready in 20 minutes. Thank you for choosing Etuna Restaurant.',
      template: 'order_update',
      guest: 'Sarah Johnson',
      room: '401',
      tags: ['restaurant', 'order']
    },
    {
      id: 'COMM005',
      type: 'notification',
      subject: 'Payment Reminder',
      recipient: 'maria.garcia@email.com',
      sender: 'Etuna Guesthouse',
      status: 'pending',
      priority: 'high',
      date: '2024-01-17 08:00',
      content: 'This is a friendly reminder that your payment is due. Please settle your account at your earliest convenience.',
      template: 'payment_reminder',
      guest: 'Maria Garcia',
      room: '301',
      tags: ['payment', 'reminder']
    }
  ];

  const templates = [
    {
      id: 'TEMP001',
      name: 'Welcome Email',
      type: 'email',
      subject: 'Welcome to Etuna Guesthouse',
      content: 'Dear {{guest_name}},\n\nWelcome to Etuna Guesthouse! We are delighted to have you as our guest.\n\nYour room {{room_number}} is ready for your arrival at {{checkin_time}}.\n\nIf you need any assistance during your stay, please don\'t hesitate to contact us.\n\nBest regards,\nEtuna Guesthouse Team',
      variables: ['guest_name', 'room_number', 'checkin_time'],
      usage: 45,
      lastUsed: '2024-01-15'
    },
    {
      id: 'TEMP002',
      name: 'Check-in Reminder',
      type: 'sms',
      subject: 'Check-in Reminder',
      content: 'Hello {{guest_name}}! Your check-in is tomorrow at {{checkin_time}}. We look forward to welcoming you to Etuna Guesthouse.',
      variables: ['guest_name', 'checkin_time'],
      usage: 32,
      lastUsed: '2024-01-16'
    },
    {
      id: 'TEMP003',
      name: 'Tour Confirmation',
      type: 'email',
      subject: 'Tour Booking Confirmation',
      content: 'Dear {{guest_name}},\n\nYour {{tour_name}} has been confirmed for {{tour_date}} at {{tour_time}}.\n\nPlease meet at the reception 15 minutes before departure.\n\nBest regards,\nEtuna Tours Team',
      variables: ['guest_name', 'tour_name', 'tour_date', 'tour_time'],
      usage: 28,
      lastUsed: '2024-01-15'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'notification':
        return <Bell className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'badge-success';
      case 'delivered':
        return 'badge-success';
      case 'completed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'failed':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'badge-error';
      case 'normal':
        return 'badge-neutral';
      case 'low':
        return 'badge-success';
      default:
        return 'badge-neutral';
    }
  };

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.guest.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || comm.type === filterType;
    const matchesStatus = filterStatus === 'all' || comm.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Communications Management</h1>
              <p className="text-primary-content/80">
                Manage guest communications, notifications, and messaging for Etuna Guesthouse
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
                New Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button className="tab tab-active">Messages</button>
          <button className="tab">Templates</button>
          <button className="tab">Automation</button>
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
                    placeholder="Search communications by subject, recipient, or guest..."
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
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="phone">Phone</option>
                  <option value="notification">Notification</option>
                </select>
                <select
                  className="select select-bordered"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="sent">Sent</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
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

        {/* Communications List */}
        <div className="space-y-4 mb-8">
          {filteredCommunications.map((comm) => (
            <div key={comm.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(comm.type)}
                      <span className="font-semibold">{comm.subject}</span>
                    </div>
                    <span className={`badge ${getStatusColor(comm.status)}`}>
                      {comm.status}
                    </span>
                    <span className={`badge ${getPriorityColor(comm.priority)}`}>
                      {comm.priority}
                    </span>
                  </div>
                  <div className="text-sm text-base-content/60">
                    {comm.date}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-base-content/60">Recipient</p>
                    <p className="font-medium">{comm.recipient}</p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Guest</p>
                    <p className="font-medium">{comm.guest} • Room {comm.room}</p>
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Template</p>
                    <p className="font-medium">{comm.template}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-base-content/60 mb-2">Message Content:</p>
                  <p className="text-sm bg-base-200 p-3 rounded-lg">{comm.content}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {comm.tags.map((tag, index) => (
                      <span key={index} className="badge badge-outline badge-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm">
                      <Send className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm text-error">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Templates Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Message Templates</h3>
              <button className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="card bg-base-200 shadow-sm">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{template.name}</h4>
                      <span className="badge badge-outline">{template.type}</span>
                    </div>
                    <p className="text-sm text-base-content/60 mb-2">{template.subject}</p>
                    <div className="text-sm bg-base-100 p-2 rounded mb-3 max-h-20 overflow-y-auto">
                      {template.content}
                    </div>
                    <div className="flex items-center justify-between text-xs text-base-content/60 mb-3">
                      <span>Used {template.usage} times</span>
                      <span>Last used: {template.lastUsed}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.variables.map((variable, index) => (
                        <span key={index} className="badge badge-ghost badge-sm">
                          {variable}
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
                <Mail className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Messages</div>
              <div className="stat-value text-primary">{communications.length}</div>
              <div className="stat-desc">This month</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Delivered</div>
              <div className="stat-value text-secondary">
                {communications.filter(c => c.status === 'sent' || c.status === 'delivered' || c.status === 'completed').length}
              </div>
              <div className="stat-desc">Successfully sent</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <Clock className="w-8 h-8" />
              </div>
              <div className="stat-title">Pending</div>
              <div className="stat-value text-accent">
                {communications.filter(c => c.status === 'pending').length}
              </div>
              <div className="stat-desc">Awaiting delivery</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <FileText className="w-8 h-8" />
              </div>
              <div className="stat-title">Templates</div>
              <div className="stat-value text-info">{templates.length}</div>
              <div className="stat-desc">Available templates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
