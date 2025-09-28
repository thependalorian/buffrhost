'use client';

import { useState } from 'react';
import {
  FileText,
  Image,
  Video,
  Music,
  Folder,
  Upload,
  Download,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Plus,
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
  Video as VideoIcon,
  Image as ImageIcon,
  Music as MusicIcon,
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
  Download as DownloadIcon,
  Upload as UploadIcon,
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
  Utensils as UtensilsIcon,
  Calendar,
  Clock,
  Star,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react';
import Link from 'next/link';

export default function CMSManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for CMS content
  const contentItems = [
    {
      id: 'CONT001',
      title: 'Welcome to Etuna Guesthouse',
      type: 'Page',
      status: 'published',
      author: 'John Manager',
      createdDate: '2024-01-10',
      lastModified: '2024-01-15',
      category: 'Homepage',
      tags: ['welcome', 'homepage', 'introduction'],
      content: 'Welcome to Etuna Guesthouse, your home away from home in the heart of Namibia...',
      views: 1250,
      featured: true
    },
    {
      id: 'CONT002',
      title: 'Wildlife Safari Packages',
      type: 'Page',
      status: 'published',
      author: 'Maria Content',
      createdDate: '2024-01-08',
      lastModified: '2024-01-12',
      category: 'Tours',
      tags: ['safari', 'wildlife', 'packages', 'tours'],
      content: 'Discover the incredible wildlife of Namibia with our guided safari packages...',
      views: 890,
      featured: true
    },
    {
      id: 'CONT003',
      title: 'Restaurant Menu - January 2024',
      type: 'Document',
      status: 'published',
      author: 'Peter Chef',
      createdDate: '2024-01-05',
      lastModified: '2024-01-05',
      category: 'Restaurant',
      tags: ['menu', 'restaurant', 'food', 'january'],
      content: 'Our delicious menu featuring local and international cuisine...',
      views: 450,
      featured: false
    },
    {
      id: 'CONT004',
      title: 'Etosha National Park Guide',
      type: 'Article',
      status: 'draft',
      author: 'Sarah Guide',
      createdDate: '2024-01-12',
      lastModified: '2024-01-14',
      category: 'Information',
      tags: ['etosha', 'guide', 'national-park', 'wildlife'],
      content: 'Everything you need to know about visiting Etosha National Park...',
      views: 0,
      featured: false
    },
    {
      id: 'CONT005',
      title: 'Guesthouse Gallery',
      type: 'Gallery',
      status: 'published',
      author: 'Anna Media',
      createdDate: '2024-01-03',
      lastModified: '2024-01-10',
      category: 'Media',
      tags: ['gallery', 'photos', 'guesthouse', 'rooms'],
      content: 'Beautiful photos of our guesthouse, rooms, and facilities...',
      views: 2100,
      featured: true
    }
  ];

  const mediaFiles = [
    {
      id: 'MEDIA001',
      name: 'etuna-exterior.jpg',
      type: 'Image',
      size: '2.5 MB',
      dimensions: '1920x1080',
      uploadedBy: 'Anna Media',
      uploadDate: '2024-01-10',
      category: 'Property Photos',
      tags: ['exterior', 'building', 'guesthouse'],
      url: '/media/etuna-exterior.jpg',
      alt: 'Etuna Guesthouse exterior view'
    },
    {
      id: 'MEDIA002',
      name: 'wildlife-safari-video.mp4',
      type: 'Video',
      size: '45.2 MB',
      dimensions: '1920x1080',
      uploadedBy: 'John Safari',
      uploadDate: '2024-01-08',
      category: 'Tour Videos',
      tags: ['safari', 'wildlife', 'video', 'tours'],
      url: '/media/wildlife-safari-video.mp4',
      alt: 'Wildlife safari tour video'
    },
    {
      id: 'MEDIA003',
      name: 'restaurant-interior.jpg',
      type: 'Image',
      size: '1.8 MB',
      dimensions: '1920x1080',
      uploadedBy: 'Maria Content',
      uploadDate: '2024-01-05',
      category: 'Restaurant Photos',
      tags: ['restaurant', 'interior', 'dining'],
      url: '/media/restaurant-interior.jpg',
      alt: 'Restaurant interior view'
    },
    {
      id: 'MEDIA004',
      name: 'etosha-landscape.jpg',
      type: 'Image',
      size: '3.2 MB',
      dimensions: '1920x1080',
      uploadedBy: 'Sarah Guide',
      uploadDate: '2024-01-12',
      category: 'Landscape Photos',
      tags: ['etosha', 'landscape', 'nature', 'namibia'],
      url: '/media/etosha-landscape.jpg',
      alt: 'Etosha National Park landscape'
    }
  ];

  const templates = [
    {
      id: 'TEMP001',
      name: 'Page Template',
      type: 'Page',
      description: 'Standard page template with header, content, and footer',
      usage: 15,
      lastUsed: '2024-01-15',
      fields: ['title', 'content', 'meta_description', 'tags']
    },
    {
      id: 'TEMP002',
      name: 'Article Template',
      type: 'Article',
      description: 'Template for blog articles and news posts',
      usage: 8,
      lastUsed: '2024-01-12',
      fields: ['title', 'content', 'author', 'publish_date', 'tags']
    },
    {
      id: 'TEMP003',
      name: 'Gallery Template',
      type: 'Gallery',
      description: 'Template for photo galleries and media collections',
      usage: 5,
      lastUsed: '2024-01-10',
      fields: ['title', 'images', 'description', 'category']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'badge-success';
      case 'draft':
        return 'badge-warning';
      case 'archived':
        return 'badge-neutral';
      case 'pending':
        return 'badge-info';
      default:
        return 'badge-neutral';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Page':
        return 'badge-primary';
      case 'Article':
        return 'badge-secondary';
      case 'Document':
        return 'badge-accent';
      case 'Gallery':
        return 'badge-info';
      case 'Image':
        return 'badge-success';
      case 'Video':
        return 'badge-warning';
      default:
        return 'badge-neutral';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'Image':
        return <Image className="w-4 h-4" />;
      case 'Video':
        return <Video className="w-4 h-4" />;
      case 'Document':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredMedia = mediaFiles.filter(media => {
    const matchesSearch = media.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         media.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || media.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Content Management System</h1>
              <p className="text-primary-content/80">
                Manage content, media, and templates for Etuna Guesthouse website
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
                New Content
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button className="tab tab-active">Content</button>
          <button className="tab">Media</button>
          <button className="tab">Templates</button>
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
                    placeholder="Search content, media, or templates..."
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
                  <option value="Page">Page</option>
                  <option value="Article">Article</option>
                  <option value="Document">Document</option>
                  <option value="Gallery">Gallery</option>
                  <option value="Image">Image</option>
                  <option value="Video">Video</option>
                </select>
                <select
                  className="select select-bordered"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                  <option value="pending">Pending</option>
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

        {/* Content Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="text-2xl font-bold mb-4">Content Items</h3>
            <div className="space-y-4">
              {filteredContent.map((item) => (
                <div key={item.id} className="card bg-base-200 shadow-sm">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <h4 className="font-bold text-lg">{item.title}</h4>
                            <p className="text-sm text-base-content/60">{item.category}</p>
                          </div>
                        </div>
                        <span className={`badge ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                        <span className={`badge ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        {item.featured && (
                          <span className="badge badge-warning">Featured</span>
                        )}
                      </div>
                      <div className="text-sm text-base-content/60">
                        {item.views} views
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-base-content/60 mb-2">Content Preview:</p>
                      <p className="text-sm bg-base-100 p-3 rounded max-h-20 overflow-y-auto">
                        {item.content}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-base-content/60">Author</p>
                        <p className="font-semibold">{item.author}</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Created</p>
                        <p className="font-semibold">{item.createdDate}</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Modified</p>
                        <p className="font-semibold">{item.lastModified}</p>
                      </div>
                      <div>
                        <p className="text-base-content/60">Views</p>
                        <p className="font-semibold">{item.views}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.map((tag, index) => (
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
                        <Share2 className="w-4 h-4" />
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

        {/* Media Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="text-2xl font-bold mb-4">Media Library</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMedia.map((media) => (
                <div key={media.id} className="card bg-base-200 shadow-sm">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(media.type)}
                        <div>
                          <h4 className="font-bold text-lg">{media.name}</h4>
                          <p className="text-sm text-base-content/60">{media.category}</p>
                        </div>
                      </div>
                      <span className={`badge ${getTypeColor(media.type)}`}>
                        {media.type}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-base-content/60">Size:</span>
                        <span className="font-semibold">{media.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base-content/60">Dimensions:</span>
                        <span className="font-semibold">{media.dimensions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base-content/60">Uploaded by:</span>
                        <span className="font-semibold">{media.uploadedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base-content/60">Date:</span>
                        <span className="font-semibold">{media.uploadDate}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {media.tags.map((tag, index) => (
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
                        <Download className="w-4 h-4" />
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

        {/* Templates Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="text-2xl font-bold mb-4">Content Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
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
                <FileText className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Content</div>
              <div className="stat-value text-primary">{contentItems.length}</div>
              <div className="stat-desc">Content items</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Image className="w-8 h-8" />
              </div>
              <div className="stat-title">Media Files</div>
              <div className="stat-value text-secondary">{mediaFiles.length}</div>
              <div className="stat-desc">Media items</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <Eye className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Views</div>
              <div className="stat-value text-accent">
                {contentItems.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
              </div>
              <div className="stat-desc">Content views</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Published</div>
              <div className="stat-value text-info">
                {contentItems.filter(item => item.status === 'published').length}
              </div>
              <div className="stat-desc">Published items</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
