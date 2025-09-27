import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Zap, 
  Gauge, 
  Clock, 
  Database, 
  Server, 
  Network, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Target, 
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  SparklesIcon,
  Monitor,
  Heart,
  MessageCircle,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Bell,
  BookOpen,
  GraduationCap,
  Briefcase,
  Home,
  Coffee,
  Utensils,
  Bed,
  Car,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  QrCode,
  Wallet,
  Receipt,
  Banknote,
  Coins,
  ArrowRight,
  Send,
  MousePointer,
  UserPlus,
  Gift,
  Percent,
  FileText,
  Image as ImageIcon,
  Video,
  Upload as UploadIcon,
  Folder,
  FolderOpen,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  Copy,
  Move,
  Share,
  Link as LinkIcon,
  ExternalLink,
  Save,
  X,
  Check,
  MoreHorizontal,
  Grid,
  List,
  Layout,
  Palette,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List as ListIcon,
  Quote,
  Code,
  Table,
  Columns,
  Rows,
  Megaphone,
  File as FileIcon,
  Folder as FolderIcon,
  Image as ImageIcon2,
  Video as VideoIcon,
  Upload as UploadIcon2,
  Edit as EditIcon,
  Trash2 as TrashIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Download as DownloadIcon,
  Plus as PlusIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Lock as LockIcon,
  Unlock,
  Calendar,
  Clock as ClockIcon,
  Users,
  Star as StarIcon,
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Globe as GlobeIcon,
  Award as AwardIcon,
  SparklesIcon as SparklesIcon2,
  Monitor as MonitorIcon,
  Shield as ShieldIcon,
  Zap as ZapIcon,
  Heart as HeartIcon,
  Target as TargetIcon,
  TrendingUp as TrendingUpIcon,
  BarChart3 as BarChart3Icon,
  MessageCircle as MessageCircleIcon,
  Settings as SettingsIcon,
  RefreshCw as RefreshCwIcon,
  AlertCircle as AlertCircleIcon,
  Bell as BellIcon,
  BookOpen as BookOpenIcon,
  GraduationCap as GraduationCapIcon,
  Briefcase as BriefcaseIcon,
  Home as HomeIcon,
  Coffee as CoffeeIcon,
  Utensils as UtensilsIcon,
  Bed as BedIcon,
  Car as CarIcon,
  Smartphone as SmartphoneIcon,
  QrCode as QrCodeIcon,
  Wallet as WalletIcon,
  Receipt as ReceiptIcon,
  Banknote as BanknoteIcon,
  Coins as CoinsIcon,
  Calculator,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  TrendingDown,
  DollarSign,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Headphones,
  Speaker,
  MessageCircle as MessageCircleIcon2,
  Bot,
  Brain,
  FileText as FileTextIcon,
  Upload as UploadIcon3,
  Download as DownloadIcon2,
  Eye as EyeIcon2,
  Edit as EditIcon2,
  Trash2 as TrashIcon2,
  Search as SearchIcon2,
  Filter as FilterIcon2,
  DollarSign as DollarSignIcon,
  Building2,
  Users as UsersIcon,
  Shield as ShieldIcon2,
  Database as DatabaseIcon,
  Globe as GlobeIcon2,
  Lock as LockIcon2,
  Key,
  Server as ServerIcon,
  Network as NetworkIcon,
  Layers,
  Palette as PaletteIcon,
  Brush,
  Settings as SettingsIcon2,
  Eye as EyeIcon3,
  Download as DownloadIcon3,
  Upload as UploadIcon4,
  RefreshCw as RefreshCwIcon2,
  Shield as ShieldIcon3,
  Lock as LockIcon3,
  Key as KeyIcon,
  Eye as EyeIcon4,
  EyeOff as EyeOffIcon,
  AlertTriangle,
  CheckCircle as CheckCircleIcon,
  Server as ServerIcon2,
  Database as DatabaseIcon2,
  Network as NetworkIcon2,
  FileText as FileTextIcon2,
  Code as CodeIcon,
  Terminal,
  Key as KeyIcon2,
  Settings as SettingsIcon3,
  BarChart3 as BarChart3Icon2,
  Users as UsersIcon2,
  Shield as ShieldIcon4,
  Zap as ZapIcon2,
  Globe as GlobeIcon3,
  Download as DownloadIcon4,
  Upload as UploadIcon5,
  RefreshCw as RefreshCwIcon3,
  BarChart3 as BarChart3Icon3,
  PieChart as PieChartIcon2,
  LineChart as LineChartIcon2,
  TrendingUp as TrendingUpIcon2,
  TrendingDown as TrendingDownIcon2,
  Target as TargetIcon2,
  Users as UsersIcon3,
  DollarSign as DollarSignIcon2,
  Plug,
  Link as LinkIcon,
  Zap as ZapIcon3,
  Gauge as GaugeIcon,
  Clock as ClockIcon2,
  Database as DatabaseIcon3,
  Server as ServerIcon3,
  Network as NetworkIcon3,
  Shield as ShieldIcon5,
  CheckCircle as CheckCircleIcon2,
  AlertCircle as AlertCircleIcon2,
  TrendingUp as TrendingUpIcon3,
  TrendingDown as TrendingDownIcon2,
  Activity as ActivityIcon
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Performance Optimization Demo - Buffr Host Platform',
  description: 'Experience our advanced performance optimization with caching, CDN, and real-time monitoring.',
};

export default function PerformanceOptimizationDemoPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            🎯 <strong>Performance Optimization Demo</strong> - Advanced caching, CDN, and real-time monitoring
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-yellow-600 to-orange-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <Zap className="w-24 h-24 mx-auto mb-4 opacity-90" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Performance Excellence</h1>
            <p className="text-xl md:text-2xl mb-6">Lightning-fast optimization and monitoring</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-accent btn-lg">
                <Gauge className="w-5 h-5 mr-2" />
                View Performance
              </button>
              <Link href="/demo/etuna/management" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-gray-900">
                <Monitor className="w-5 h-5 mr-2" />
                View Management Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Performance Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Advanced Performance Optimization</h2>
              <p className="text-lg text-base-content/80 mb-6">
                See how our performance optimization delivers lightning-fast response times, 
                intelligent caching, CDN distribution, and real-time monitoring across all 
                Etuna operations and user interactions.
              </p>
              
              {/* Demo Performance Dashboard */}
              <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-xl mb-6">
                <h3 className="text-lg font-bold mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  {/* Performance Examples */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Page Load Time</p>
                        <p className="text-sm text-gray-500">Average response time</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600 font-bold">0.8s</p>
                      <p className="text-xs text-gray-500">-60% vs baseline</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Cache Hit Rate</p>
                        <p className="text-sm text-gray-500">CDN performance</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-600 font-bold">98.5%</p>
                      <p className="text-xs text-gray-500">+15% improvement</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Database Performance</p>
                        <p className="text-sm text-gray-500">Query optimization</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-purple-600 font-bold">99.9%</p>
                      <p className="text-xs text-gray-500">Uptime SLA</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Intelligent caching strategies</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Global CDN distribution</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Real-time performance monitoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Automatic optimization</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
                alt="Performance Optimization"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <div>
                    <p className="font-semibold">Performance Score</p>
                    <p className="text-sm text-nude-700">98/100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Why Our Performance Optimization Excels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Intelligent Caching */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-yellow-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Intelligent Caching</h3>
                <p className="text-sm text-nude-700">Multi-layer caching with Redis, CDN, and browser optimization.</p>
              </div>
            </div>
            
            {/* Global CDN */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Network className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Global CDN</h3>
                <p className="text-sm text-nude-700">Worldwide content delivery network for optimal performance.</p>
              </div>
            </div>
            
            {/* Real-time Monitoring */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Real-time Monitoring</h3>
                <p className="text-sm text-nude-700">Continuous performance monitoring with instant alerts.</p>
              </div>
            </div>
            
            {/* Database Optimization */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Server className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Database Optimization</h3>
                <p className="text-sm text-nude-700">Query optimization, indexing, and connection pooling.</p>
              </div>
            </div>
            
            {/* Auto-scaling */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Auto-scaling</h3>
                <p className="text-sm text-nude-700">Automatic resource scaling based on demand and performance.</p>
              </div>
            </div>
            
            {/* Performance Analytics */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Performance Analytics</h3>
                <p className="text-sm text-nude-700">Detailed performance insights and optimization recommendations.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Categories */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Performance Optimization Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Frontend Optimization */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-yellow-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Frontend Optimization</h3>
                    <p className="text-sm text-nude-700">Client-side performance</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Code Splitting</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lazy Loading</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Image Optimization</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bundle Optimization</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Backend Optimization */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Server className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Backend Optimization</h3>
                    <p className="text-sm text-nude-700">Server-side performance</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>API Caching</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database Indexing</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connection Pooling</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Query Optimization</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Infrastructure Optimization */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Network className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Infrastructure Optimization</h3>
                    <p className="text-sm text-nude-700">Network and hosting</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>CDN Distribution</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Load Balancing</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto-scaling</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Edge Computing</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Advanced Performance Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Machine Learning Optimization */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">ML-Powered Optimization</h3>
              <p className="text-nude-700">Machine learning algorithms for predictive performance optimization.</p>
            </div>

            {/* Real-time Analytics */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary text-secondary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-nude-700">Live performance monitoring with instant optimization recommendations.</p>
            </div>

            {/* Predictive Scaling */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-accent-content rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Predictive Scaling</h3>
              <p className="text-nude-700">Anticipate demand and scale resources before performance issues occur.</p>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Experience Performance Optimization</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance Dashboard */}
              <div className="card bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Zap className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Performance Dashboard</h3>
                      <p className="text-white/80">See how performance optimization works</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6">
                    Experience our performance optimization platform. 
                    Monitor metrics, analyze bottlenecks, 
                    configure caching, and see how 
                    lightning-fast performance drives success.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Real-time performance monitoring</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Intelligent caching strategies</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Global CDN optimization</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Automatic performance tuning</span>
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-6">
                    <Link href="/demo/etuna" className="btn btn-accent">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Try Guest Experience
                    </Link>
                  </div>
                </div>
              </div>

              {/* Management Demo */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-yellow-500 text-white flex items-center justify-center">
                        <Monitor className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Performance Management</h3>
                      <p className="text-nude-700">See how optimization drives platform success</p>
                    </div>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    Explore our performance management dashboard. 
                    Configure optimization settings, monitor 
                    performance metrics, analyze bottlenecks, 
                    and optimize for maximum efficiency.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Performance configuration</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Cache management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>CDN optimization</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Performance analytics</span>
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-6">
                    <Link href="/demo/etuna/management" className="btn btn-primary">
                      <Monitor className="w-4 h-4 mr-2" />
                      View Management Demo
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="card bg-primary text-primary-content shadow-xl">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Phone className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Ready to Optimize?</h3>
                <p className="text-primary-content/80">Contact us to implement performance optimization.</p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Schedule a Demo</h3>
                <p className="text-primary-content/80">Book a personalized demonstration of our performance system.</p>
              </div>
              <div className="text-center">
                <Globe className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Learn More</h3>
                <p className="text-primary-content/80">Visit our main website for more information about Buffr Host.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}