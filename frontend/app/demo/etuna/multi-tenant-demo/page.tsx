import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  Settings, 
  Shield, 
  Database, 
  Globe, 
  Lock, 
  Key, 
  Server, 
  Network, 
  Layers, 
  Zap, 
  Monitor, 
  BarChart3, 
  TrendingUp, 
  Target, 
  Calendar, 
  Clock, 
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  SparklesIcon,
  Heart,
  MessageCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  Bell,
  BookOpen,
  GraduationCap,
  Briefcase,
  Home,
  Coffee,
  Utensils,
  Bed,
  Car,
  Eye,
  EyeOff,
  Smartphone,
  QrCode,
  Wallet,
  Receipt,
  Banknote,
  Coins,
  ArrowRight,
  CheckCircle,
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
  Calendar as CalendarIcon,
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
  Building2 as Building2Icon,
  Users as UsersIcon2,
  Settings as SettingsIcon2,
  Shield as ShieldIcon2,
  Database as DatabaseIcon,
  Globe as GlobeIcon2,
  Lock as LockIcon2,
  Key as KeyIcon,
  Server as ServerIcon,
  Network as NetworkIcon,
  Layers as LayersIcon
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Multi-Tenant Architecture Demo - Buffr Host Platform',
  description: 'Experience our enterprise multi-tenant architecture that enables scalable management of multiple properties and brands.',
};

export default function MultiTenantDemoPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            🎯 <strong>Multi-Tenant Architecture Demo</strong> - Enterprise scalability and management
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-slate-600 to-blue-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <Building2 className="w-24 h-24 mx-auto mb-4 opacity-90" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Multi-Tenant Excellence</h1>
            <p className="text-xl md:text-2xl mb-6">Enterprise architecture for unlimited scalability</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-accent btn-lg">
                <Server className="w-5 h-5 mr-2" />
                Explore Architecture
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
        {/* Multi-Tenant Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Enterprise Multi-Tenant Architecture</h2>
              <p className="text-lg text-base-content/80 mb-6">
                See how our multi-tenant architecture enables seamless management of multiple properties, 
                brands, and business units with complete data isolation and scalable infrastructure.
              </p>
              
              {/* Demo Tenant Dashboard */}
              <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-xl mb-6">
                <h3 className="text-lg font-bold mb-4">Tenant Management</h3>
                <div className="space-y-4">
                  {/* Tenant Examples */}
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Etuna Guesthouse</p>
                        <p className="text-sm text-gray-500">Primary tenant</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">Active</p>
                      <p className="text-xs text-gray-500">5 properties</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Namibian Safari Lodge</p>
                        <p className="text-sm text-gray-500">Partner tenant</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">Active</p>
                      <p className="text-xs text-gray-500">12 properties</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Coastal Resort Group</p>
                        <p className="text-sm text-gray-500">Enterprise tenant</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">Active</p>
                      <p className="text-xs text-gray-500">25 properties</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Complete data isolation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Scalable infrastructure</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Centralized management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Brand customization</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
                alt="Multi-Tenant Architecture"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Server className="w-6 h-6 text-slate-500" />
                  <div>
                    <p className="font-semibold">Enterprise Scale</p>
                    <p className="text-sm text-nude-700">Unlimited Tenants</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Tenant Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Why Our Multi-Tenant Architecture Excels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Data Isolation */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-slate-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Complete Data Isolation</h3>
                <p className="text-sm text-nude-700">Each tenant's data is completely isolated with enterprise-grade security.</p>
              </div>
            </div>
            
            {/* Scalable Infrastructure */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Server className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Scalable Infrastructure</h3>
                <p className="text-sm text-nude-700">Auto-scaling infrastructure that grows with your business needs.</p>
              </div>
            </div>
            
            {/* Centralized Management */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Centralized Management</h3>
                <p className="text-sm text-nude-700">Manage all tenants from a single, powerful admin interface.</p>
              </div>
            </div>
            
            {/* Brand Customization */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Brand Customization</h3>
                <p className="text-sm text-nude-700">Each tenant can customize branding, themes, and user experience.</p>
              </div>
            </div>
            
            {/* Resource Optimization */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-orange-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Resource Optimization</h3>
                <p className="text-sm text-nude-700">Intelligent resource allocation and cost optimization across tenants.</p>
              </div>
            </div>
            
            {/* Global Deployment */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Global Deployment</h3>
                <p className="text-sm text-nude-700">Deploy tenants across multiple regions for optimal performance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Types */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Tenant Types & Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Single Property */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Home className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Single Property</h3>
                    <p className="text-sm text-nude-700">Individual hotels, restaurants, B&Bs</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Properties</span>
                    <span className="font-semibold">1-5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Users</span>
                    <span className="font-semibold">Up to 50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage</span>
                    <span className="font-semibold">100GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Support</span>
                    <span className="font-semibold">Standard</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Multi-Property */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Multi-Property</h3>
                    <p className="text-sm text-nude-700">Hotel chains, restaurant groups</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Properties</span>
                    <span className="font-semibold">6-50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Users</span>
                    <span className="font-semibold">Up to 500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage</span>
                    <span className="font-semibold">1TB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Support</span>
                    <span className="font-semibold">Priority</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Network className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Enterprise</h3>
                    <p className="text-sm text-nude-700">Large hospitality groups</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Properties</span>
                    <span className="font-semibold">Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Users</span>
                    <span className="font-semibold">Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage</span>
                    <span className="font-semibold">Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Support</span>
                    <span className="font-semibold">24/7 Dedicated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Architecture Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Advanced Architecture Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Microservices Architecture */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Microservices Architecture</h3>
              <p className="text-nude-700">Scalable, independent services that can be deployed and scaled individually.</p>
            </div>

            {/* Container Orchestration */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary text-secondary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Server className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Container Orchestration</h3>
              <p className="text-nude-700">Kubernetes-based orchestration for automatic scaling and high availability.</p>
            </div>

            {/* Database Sharding */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-accent-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Database Sharding</h3>
              <p className="text-nude-700">Horizontal database partitioning for optimal performance and scalability.</p>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Experience Multi-Tenant Architecture</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tenant Management */}
              <div className="card bg-gradient-to-br from-slate-500 to-blue-500 text-white shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Building2 className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Tenant Management</h3>
                      <p className="text-white/80">See how multi-tenant architecture works</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6">
                    Experience our multi-tenant architecture in action. 
                    Manage multiple properties, brands, and business units 
                    with complete data isolation and scalable infrastructure.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete data isolation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Scalable infrastructure</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Centralized management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Brand customization</span>
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
                      <div className="w-16 h-16 rounded-full bg-slate-500 text-white flex items-center justify-center">
                        <Monitor className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Management Dashboard</h3>
                      <p className="text-nude-700">See how multi-tenant drives enterprise success</p>
                    </div>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    Explore our multi-tenant management dashboard. 
                    Monitor all tenants, manage resources, configure 
                    settings, and optimize performance across your entire portfolio.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Tenant monitoring and analytics</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Resource allocation management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Centralized configuration</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Performance optimization</span>
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
                <h3 className="font-bold text-lg mb-2">Ready to Scale?</h3>
                <p className="text-primary-content/80">Contact us to implement multi-tenant architecture.</p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Schedule a Demo</h3>
                <p className="text-primary-content/80">Book a personalized demonstration of our multi-tenant system.</p>
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