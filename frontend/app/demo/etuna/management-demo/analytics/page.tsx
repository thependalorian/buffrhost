'use client';

import { useState } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  DollarSign,
  Star,
  Calendar,
  Clock,
  Eye,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
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

export default function AnalyticsManagementPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock analytics data
  const analyticsData = {
    occupancy: {
      current: 75,
      target: 80,
      trend: 5.2,
      monthly: [
        { month: 'Jan', occupancy: 65 },
        { month: 'Feb', occupancy: 70 },
        { month: 'Mar', occupancy: 72 },
        { month: 'Apr', occupancy: 68 },
        { month: 'May', occupancy: 75 },
        { month: 'Jun', occupancy: 78 },
        { month: 'Jul', occupancy: 82 },
        { month: 'Aug', occupancy: 85 },
        { month: 'Sep', occupancy: 80 },
        { month: 'Oct', occupancy: 75 },
        { month: 'Nov', occupancy: 70 },
        { month: 'Dec', occupancy: 75 }
      ]
    },
    revenue: {
      current: 125000,
      target: 150000,
      trend: 8.5,
      monthly: [
        { month: 'Jan', revenue: 95000 },
        { month: 'Feb', revenue: 105000 },
        { month: 'Mar', revenue: 110000 },
        { month: 'Apr', revenue: 100000 },
        { month: 'May', revenue: 115000 },
        { month: 'Jun', revenue: 120000 },
        { month: 'Jul', revenue: 130000 },
        { month: 'Aug', revenue: 135000 },
        { month: 'Sep', revenue: 125000 },
        { month: 'Oct', revenue: 120000 },
        { month: 'Nov', revenue: 115000 },
        { month: 'Dec', revenue: 125000 }
      ]
    },
    customerSatisfaction: {
      current: 4.8,
      target: 4.5,
      trend: 0.3,
      breakdown: [
        { category: 'Service', rating: 4.9, reviews: 45 },
        { category: 'Cleanliness', rating: 4.8, reviews: 42 },
        { category: 'Location', rating: 4.7, reviews: 38 },
        { category: 'Value', rating: 4.6, reviews: 35 },
        { category: 'Amenities', rating: 4.8, reviews: 40 }
      ]
    },
    topRevenueSources: [
      { source: 'Room Revenue', amount: 85000, percentage: 68 },
      { source: 'Restaurant', amount: 25000, percentage: 20 },
      { source: 'Tours', amount: 15000, percentage: 12 }
    ],
    guestDemographics: [
      { segment: 'Business Travelers', percentage: 35, count: 125 },
      { segment: 'Leisure Travelers', percentage: 45, count: 160 },
      { segment: 'Families', percentage: 20, count: 70 }
    ],
    seasonalTrends: [
      { season: 'Summer', occupancy: 85, revenue: 140000 },
      { season: 'Autumn', occupancy: 70, revenue: 110000 },
      { season: 'Winter', occupancy: 60, revenue: 90000 },
      { season: 'Spring', occupancy: 75, revenue: 120000 }
    ]
  };

  const topPerformers = [
    {
      metric: 'Highest Occupancy',
      value: 'Room 201',
      details: 'Executive Room - 95% occupancy',
      trend: '+12%'
    },
    {
      metric: 'Best Revenue',
      value: 'Restaurant',
      details: 'N$ 25,000 this month',
      trend: '+8%'
    },
    {
      metric: 'Top Rating',
      value: 'Service Quality',
      details: '4.9/5.0 average rating',
      trend: '+0.2'
    },
    {
      metric: 'Most Popular',
      value: 'Etosha Safari',
      details: '45 bookings this month',
      trend: '+15%'
    }
  ];

  const insights = [
    {
      type: 'opportunity',
      title: 'Weekend Revenue Boost',
      description: 'Weekend occupancy is 15% below weekday average. Consider weekend packages or promotions.',
      impact: 'High',
      action: 'Create weekend special offers'
    },
    {
      type: 'warning',
      title: 'Restaurant Utilization',
      description: 'Restaurant revenue is 20% below target. Consider menu updates or marketing campaigns.',
      impact: 'Medium',
      action: 'Review restaurant strategy'
    },
    {
      type: 'success',
      title: 'Customer Satisfaction',
      description: 'Customer satisfaction has improved by 0.3 points this month.',
      impact: 'High',
      action: 'Maintain current service standards'
    },
    {
      type: 'info',
      title: 'Seasonal Planning',
      description: 'Winter season shows 25% lower occupancy. Plan winter promotions early.',
      impact: 'Medium',
      action: 'Develop winter marketing strategy'
    }
  ];

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'alert-info';
      case 'warning':
        return 'alert-warning';
      case 'success':
        return 'alert-success';
      case 'info':
        return 'alert-info';
      default:
        return 'alert-neutral';
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Analytics & Insights</h1>
              <p className="text-primary-content/80">
                Performance metrics, trends, and business intelligence for Etuna Guesthouse
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
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Period and Metric Selectors */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="label">
                  <span className="label-text">Time Period</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="this_quarter">This Quarter</option>
                  <option value="this_year">This Year</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="label">
                  <span className="label-text">Primary Metric</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                >
                  <option value="revenue">Revenue</option>
                  <option value="occupancy">Occupancy</option>
                  <option value="satisfaction">Customer Satisfaction</option>
                  <option value="bookings">Bookings</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Occupancy Rate</div>
              <div className="stat-value text-primary">{analyticsData.occupancy.current}%</div>
              <div className="stat-desc">
                Target: {analyticsData.occupancy.target}% • +{analyticsData.occupancy.trend}% vs last month
              </div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Monthly Revenue</div>
              <div className="stat-value text-secondary">
                N$ {analyticsData.revenue.current.toLocaleString()}
              </div>
              <div className="stat-desc">
                Target: N$ {analyticsData.revenue.target.toLocaleString()} • +{analyticsData.revenue.trend}% vs last month
              </div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <Star className="w-8 h-8" />
              </div>
              <div className="stat-title">Customer Rating</div>
              <div className="stat-value text-accent">{analyticsData.customerSatisfaction.current}</div>
              <div className="stat-desc">
                Target: {analyticsData.customerSatisfaction.target} • +{analyticsData.customerSatisfaction.trend} vs last month
              </div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <Activity className="w-8 h-8" />
              </div>
              <div className="stat-title">Growth Rate</div>
              <div className="stat-value text-info">+12.5%</div>
              <div className="stat-desc">Overall business growth</div>
            </div>
          </div>
        </div>

        {/* Charts and Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Sources */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">Revenue Sources</h3>
              <div className="space-y-4">
                {analyticsData.topRevenueSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-primary rounded"></div>
                      <span className="font-medium">{source.source}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">N$ {source.amount.toLocaleString()}</div>
                      <div className="text-sm text-base-content/60">{source.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Guest Demographics */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">Guest Demographics</h3>
              <div className="space-y-4">
                {analyticsData.guestDemographics.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-secondary rounded"></div>
                      <span className="font-medium">{segment.segment}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{segment.count} guests</div>
                      <div className="text-sm text-base-content/60">{segment.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="card-title mb-4">Top Performers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="card bg-base-200 shadow-sm">
                  <div className="card-body">
                    <h4 className="font-bold text-lg">{performer.value}</h4>
                    <p className="text-sm text-base-content/60 mb-2">{performer.details}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-base-content/60">{performer.metric}</span>
                      <span className="badge badge-success badge-sm">{performer.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights and Recommendations */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="card-title mb-4">Insights & Recommendations</h3>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className={`alert ${getInsightColor(insight.type)}`}>
                  <div>
                    <h4 className="font-bold">{insight.title}</h4>
                    <p className="text-sm">{insight.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs">Impact: {insight.impact}</span>
                      <button className="btn btn-sm btn-outline">
                        {insight.action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Satisfaction Breakdown */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">Customer Satisfaction Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Rating</th>
                    <th>Reviews</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.customerSatisfaction.breakdown.map((category, index) => (
                    <tr key={index}>
                      <td className="font-medium">{category.category}</td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{category.rating}</span>
                          <div className="rating rating-sm">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <input
                                key={star}
                                type="radio"
                                className="mask mask-star-2 bg-orange-400"
                                checked={star <= Math.floor(category.rating)}
                                readOnly
                              />
                            ))}
                          </div>
                        </div>
                      </td>
                      <td>{category.reviews}</td>
                      <td>
                        <span className="badge badge-success badge-sm">+0.2</span>
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
