import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Code, 
  Terminal, 
  Key, 
  Settings, 
  BarChart3, 
  Users, 
  Shield, 
  Zap, 
  Globe, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  SparklesIcon,
  Monitor,
  Heart,
  Target,
  TrendingUp,
  MessageCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
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
  Activity,
  PieChart,
  LineChart,
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
  Code as CodeIcon,
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
  Users as UsersIcon,
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
  Users as UsersIcon2,
  Shield as ShieldIcon2,
  Database,
  Globe as GlobeIcon2,
  Lock as LockIcon2,
  Key,
  Server,
  Network,
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
  Server as ServerIcon,
  Database as DatabaseIcon,
  Network as NetworkIcon,
  FileText as FileTextIcon2,
  Code as CodeIcon2,
  Terminal as TerminalIcon,
  Key as KeyIcon2,
  Settings as SettingsIcon3,
  BarChart3 as BarChart3Icon2,
  Users as UsersIcon3,
  Shield as ShieldIcon4,
  Zap as ZapIcon2,
  Globe as GlobeIcon3,
  Download as DownloadIcon4,
  Upload as UploadIcon5,
  RefreshCw as RefreshCwIcon3
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'API Management Demo - Buffr Host Platform',
  description: 'Experience our comprehensive API management platform with developer tools, documentation, and analytics.',
};

export default function APIManagementDemoPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            🎯 <strong>API Management Demo</strong> - Developer tools and comprehensive API platform
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <Code className="w-24 h-24 mx-auto mb-4 opacity-90" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">API Excellence</h1>
            <p className="text-xl md:text-2xl mb-6">Comprehensive API management and developer tools</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-accent btn-lg">
                <Terminal className="w-5 h-5 mr-2" />
                Explore APIs
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
        {/* API Management Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Comprehensive API Management</h2>
              <p className="text-lg text-base-content/80 mb-6">
                See how our API management platform provides comprehensive tools for developers, 
                including documentation, testing, analytics, and security features for all Etuna APIs.
              </p>
              
              {/* Demo API Dashboard */}
              <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-xl mb-6">
                <h3 className="text-lg font-bold mb-4">API Status</h3>
                <div className="space-y-4">
                  {/* API Examples */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Property Management API</p>
                        <p className="text-sm text-gray-500">v2.1.0 - Active</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">99.9% uptime</p>
                      <p className="text-xs text-gray-500">1.2s avg response</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Booking API</p>
                        <p className="text-sm text-gray-500">v1.8.0 - Active</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">99.8% uptime</p>
                      <p className="text-xs text-gray-500">0.8s avg response</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Payment API</p>
                        <p className="text-sm text-gray-500">v3.0.0 - Active</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">99.95% uptime</p>
                      <p className="text-xs text-gray-500">0.6s avg response</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Comprehensive API documentation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Interactive testing tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Advanced analytics and monitoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Developer SDKs and tools</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
                alt="API Management"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Code className="w-6 h-6 text-indigo-500" />
                  <div>
                    <p className="font-semibold">API Platform</p>
                    <p className="text-sm text-nude-700">Developer Ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Management Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Why Our API Management Excels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Developer Tools */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Terminal className="w-8 h-8 text-indigo-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Developer Tools</h3>
                <p className="text-sm text-nude-700">Comprehensive SDKs, testing tools, and interactive documentation.</p>
              </div>
            </div>
            
            {/* API Documentation */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">API Documentation</h3>
                <p className="text-sm text-nude-700">Interactive documentation with live examples and code samples.</p>
              </div>
            </div>
            
            {/* Analytics & Monitoring */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Analytics & Monitoring</h3>
                <p className="text-sm text-nude-700">Real-time API analytics, performance monitoring, and usage insights.</p>
              </div>
            </div>
            
            {/* Security & Access Control */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Security & Access</h3>
                <p className="text-sm text-nude-700">API key management, rate limiting, and advanced security features.</p>
              </div>
            </div>
            
            {/* Version Management */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-orange-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Version Management</h3>
                <p className="text-sm text-nude-700">Seamless API versioning with backward compatibility and migration tools.</p>
              </div>
            </div>
            
            {/* Developer Portal */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Developer Portal</h3>
                <p className="text-sm text-nude-700">Self-service developer portal with registration and key management.</p>
              </div>
            </div>
          </div>
        </div>

        {/* API Categories */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">API Categories & Endpoints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Core APIs */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Server className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Core APIs</h3>
                    <p className="text-sm text-nude-700">Essential platform APIs</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Property Management</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Management</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Authentication</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Management</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Business APIs */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Business APIs</h3>
                    <p className="text-sm text-nude-700">Hospitality business logic</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Booking Management</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Processing</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inventory Management</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staff Management</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics APIs */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Analytics APIs</h3>
                    <p className="text-sm text-nude-700">Data and insights</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Revenue Analytics</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Insights</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Performance Metrics</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Predictive Analytics</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Advanced API Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Interactive Documentation */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Documentation</h3>
              <p className="text-nude-700">Live API documentation with interactive testing and code examples.</p>
            </div>

            {/* SDK Generation */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary text-secondary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">SDK Generation</h3>
              <p className="text-nude-700">Automatically generated SDKs for multiple programming languages.</p>
            </div>

            {/* API Gateway */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-accent-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Network className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">API Gateway</h3>
              <p className="text-nude-700">High-performance API gateway with load balancing and caching.</p>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Experience API Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Developer Experience */}
              <div className="card bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Code className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Developer Experience</h3>
                      <p className="text-white/80">See how API management works</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6">
                    Experience our API management platform. 
                    Explore documentation, test endpoints, 
                    generate SDKs, and see how easy it is 
                    to integrate with our APIs.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Interactive API documentation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Live endpoint testing</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>SDK generation and downloads</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Code examples and samples</span>
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
                      <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                        <Monitor className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">API Management Dashboard</h3>
                      <p className="text-nude-700">See how APIs drive platform success</p>
                    </div>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    Explore our API management dashboard. 
                    Monitor usage, analyze performance, 
                    manage keys, and configure policies 
                    for optimal API operations.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Real-time API monitoring</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Usage analytics and insights</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>API key management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Rate limiting and policies</span>
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
                <h3 className="font-bold text-lg mb-2">Ready to Integrate?</h3>
                <p className="text-primary-content/80">Contact us to implement comprehensive API management.</p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Schedule a Demo</h3>
                <p className="text-primary-content/80">Book a personalized demonstration of our API platform.</p>
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