'use client';

import { useState } from 'react';
import {
  Megaphone,
  Target,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  Star,
  DollarSign,
  Eye,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Phone,
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

export default function MarketingManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for marketing campaigns
  const campaigns = [
    {
      id: 'CAMP001',
      name: 'Summer Wildlife Package',
      type: 'Email',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      budget: 5000,
      spent: 2500,
      targetAudience: 'Wildlife Enthusiasts',
      recipients: 2500,
      opened: 1250,
      clicked: 312,
      conversions: 45,
      revenue: 67500,
      description: 'Promote summer wildlife packages to nature lovers',
      tags: ['wildlife', 'summer', 'packages']
    },
    {
      id: 'CAMP002',
      name: 'Corporate Retreat Offer',
      type: 'Direct Mail',
      status: 'active',
      startDate: '2024-01-10',
      endDate: '2024-02-28',
      budget: 3000,
      spent: 1800,
      targetAudience: 'Corporate Clients',
      recipients: 500,
      opened: 450,
      clicked: 90,
      conversions: 12,
      revenue: 36000,
      description: 'Target corporate clients with retreat packages',
      tags: ['corporate', 'retreat', 'business']
    },
    {
      id: 'CAMP003',
      name: 'Luxury Experience Campaign',
      type: 'Social Media',
      status: 'completed',
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      budget: 2000,
      spent: 2000,
      targetAudience: 'High-end Travelers',
      recipients: 10000,
      opened: 3500,
      clicked: 700,
      conversions: 25,
      revenue: 125000,
      description: 'Luxury experience promotion on social media',
      tags: ['luxury', 'social', 'high-end']
    }
  ];

  const emailTemplates = [
    {
      id: 'TEMP001',
      name: 'Welcome Series',
      subject: 'Welcome to Etuna Guesthouse',
      type: 'Automated',
      usage: 45,
      openRate: 68,
      clickRate: 12,
      lastUsed: '2024-01-15',
      content: 'Welcome to Etuna Guesthouse! We are excited to have you as our guest...'
    },
    {
      id: 'TEMP002',
      name: 'Special Offer',
      subject: 'Exclusive Discount for You',
      type: 'Promotional',
      usage: 23,
      openRate: 72,
      clickRate: 18,
      lastUsed: '2024-01-10',
      content: 'Don\'t miss out on our exclusive offer! Book now and save 20%...'
    },
    {
      id: 'TEMP003',
      name: 'Follow-up',
      subject: 'How was your stay?',
      type: 'Follow-up',
      usage: 67,
      openRate: 55,
      clickRate: 8,
      lastUsed: '2024-01-12',
      content: 'Thank you for choosing Etuna Guesthouse. We hope you enjoyed your stay...'
    }
  ];

  const socialMediaPosts = [
    {
      id: 'POST001',
      platform: 'Facebook',
      content: 'Experience the beauty of Namibia with our wildlife safari packages! 🦁🦒',
      scheduledDate: '2024-01-20 10:00',
      status: 'scheduled',
      engagement: 0,
      reach: 0,
      clicks: 0
    },
    {
      id: 'POST002',
      platform: 'Instagram',
      content: 'Sunset views from Etuna Guesthouse - the perfect end to your day 🌅',
      scheduledDate: '2024-01-18 18:00',
      status: 'published',
      engagement: 156,
      reach: 1250,
      clicks: 45
    },
    {
      id: 'POST003',
      platform: 'Twitter',
      content: 'Book your stay at Etuna Guesthouse and discover the heart of Namibia! #Namibia #Travel',
      scheduledDate: '2024-01-19 14:00',
      status: 'scheduled',
      engagement: 0,
      reach: 0,
      clicks: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'completed':
        return 'badge-neutral';
      case 'paused':
        return 'badge-warning';
      case 'draft':
        return 'badge-info';
      case 'scheduled':
        return 'badge-warning';
      case 'published':
        return 'badge-success';
      default:
        return 'badge-neutral';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Email':
        return 'badge-primary';
      case 'Direct Mail':
        return 'badge-secondary';
      case 'Social Media':
        return 'badge-accent';
      case 'Automated':
        return 'badge-info';
      case 'Promotional':
        return 'badge-warning';
      case 'Follow-up':
        return 'badge-success';
      default:
        return 'badge-neutral';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || campaign.type === filterType;
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Marketing Management</h1>
              <p className="text-primary-content/80">
                Manage marketing campaigns, email templates, and social media for Etuna Guesthouse
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
                New Campaign
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button className="tab tab-active">Campaigns</button>
          <button className="tab">Email Templates</button>
          <button className="tab">Social Media</button>
          <button className="tab">Analytics</button>
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
                    placeholder="Search campaigns, templates, or content..."
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
                  <option value="Email">Email</option>
                  <option value="Direct Mail">Direct Mail</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Automated">Automated</option>
                  <option value="Promotional">Promotional</option>
                </select>
                <select
                  className="select select-bordered"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                  <option value="draft">Draft</option>
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

        {/* Campaigns Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="text-2xl font-bold mb-4">Marketing Campaigns</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <div key={campaign.id} className="card bg-base-200 shadow-sm">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{campaign.name}</h4>
                        <p className="text-sm text-base-content/60">{campaign.description}</p>
                      </div>
                      <span className={`badge ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <Megaphone className="w-4 h-4 text-primary" />
                        <span>Type: {campaign.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span>Target: {campaign.targetAudience}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{campaign.startDate} - {campaign.endDate}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-base-content/60">Budget</p>
                        <p className="font-semibold">N$ {campaign.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Spent</p>
                        <p className="font-semibold">N$ {campaign.spent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Recipients</p>
                        <p className="font-semibold">{campaign.recipients.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Open Rate</p>
                        <p className="font-semibold">{((campaign.opened / campaign.recipients) * 100).toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-base-content/60 mb-2">Performance:</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Opened: {campaign.opened}</span>
                          <span>Clicked: {campaign.clicked}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Conversions: {campaign.conversions}</span>
                          <span>Revenue: N$ {campaign.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {campaign.tags.map((tag, index) => (
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
                        <BarChart3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Email Templates Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="text-2xl font-bold mb-4">Email Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emailTemplates.map((template) => (
                <div key={template.id} className="card bg-base-200 shadow-sm">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{template.name}</h4>
                      <span className={`badge ${getTypeColor(template.type)}`}>
                        {template.type}
                      </span>
                    </div>
                    <p className="text-sm text-base-content/60 mb-2">{template.subject}</p>
                    <div className="text-sm bg-base-100 p-2 rounded mb-3 max-h-20 overflow-y-auto">
                      {template.content}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-base-content/60">Usage</p>
                        <p className="font-semibold">{template.usage} times</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Open Rate</p>
                        <p className="font-semibold">{template.openRate}%</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Click Rate</p>
                        <p className="font-semibold">{template.clickRate}%</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Last Used</p>
                        <p className="font-semibold">{template.lastUsed}</p>
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
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="text-2xl font-bold mb-4">Social Media Posts</h3>
            <div className="space-y-4">
              {socialMediaPosts.map((post) => (
                <div key={post.id} className="card bg-base-200 shadow-sm">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-10">
                            <span className="text-sm font-bold">{post.platform[0]}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold">{post.platform}</h4>
                          <p className="text-sm text-base-content/60">{post.scheduledDate}</p>
                        </div>
                      </div>
                      <span className={`badge ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm bg-base-100 p-3 rounded">{post.content}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-base-content/60">Engagement</p>
                        <p className="font-semibold">{post.engagement}</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Reach</p>
                        <p className="font-semibold">{post.reach}</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Clicks</p>
                        <p className="font-semibold">{post.clicks}</p>
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
                        <Share2 className="w-4 h-4" />
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
                <Megaphone className="w-8 h-8" />
              </div>
              <div className="stat-title">Active Campaigns</div>
              <div className="stat-value text-primary">
                {campaigns.filter(c => c.status === 'active').length}
              </div>
              <div className="stat-desc">Currently running</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Mail className="w-8 h-8" />
              </div>
              <div className="stat-title">Email Templates</div>
              <div className="stat-value text-secondary">{emailTemplates.length}</div>
              <div className="stat-desc">Available templates</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value text-accent">
                N$ {campaigns.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}
              </div>
              <div className="stat-desc">From campaigns</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Reach</div>
              <div className="stat-value text-info">
                {campaigns.reduce((sum, c) => sum + c.recipients, 0).toLocaleString()}
              </div>
              <div className="stat-desc">Campaign recipients</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
