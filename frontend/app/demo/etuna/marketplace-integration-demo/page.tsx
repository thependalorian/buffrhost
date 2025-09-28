import { Metadata } from "next";
import Image from "next/image";
import {
  PageHeader,
  StatCard,
  ActionButton,
  ModalForm,
  FormField,
  FormSelect,
  Alert,
} from "@/src/components/ui";
import {
  Store,
  Package,
  Download,
  Star,
  Users,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  SparklesIcon,
  Monitor,
  Shield,
  Zap,
  Heart,
  MessageCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
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
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
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
  TrendingUp,
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
  AlertTriangle,
  CheckCircle as CheckCircleIcon,
  Server as ServerIcon,
  Database as DatabaseIcon,
  Network as NetworkIcon,
  FileText as FileTextIcon2,
  Code as CodeIcon,
  Terminal,
  Key as KeyIcon2,
  Settings as SettingsIcon3,
  BarChart3 as BarChart3Icon2,
  Users as UsersIcon3,
  Shield as ShieldIcon4,
  Zap as ZapIcon2,
  Globe as GlobeIcon3,
  Download as DownloadIcon4,
  Upload as UploadIcon5,
  RefreshCw as RefreshCwIcon3,
  BarChart3 as BarChart3Icon3,
  PieChart as PieChartIcon2,
  LineChart as LineChartIcon2,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Target as TargetIcon2,
  Users as UsersIcon4,
  DollarSign as DollarSignIcon2,
  Plug,
  Link as LinkIcon2,
  Zap as ZapIcon3,
  Gauge,
  Clock as ClockIcon2,
  Database as DatabaseIcon3,
  Server as ServerIcon2,
  Network as NetworkIcon2,
  Shield as ShieldIcon5,
  CheckCircle as CheckCircleIcon2,
  AlertCircle as AlertCircleIcon2,
  TrendingUp as TrendingUpIcon2,
  TrendingDown as TrendingDownIcon2,
  Smartphone as SmartphoneIcon2,
  Download as DownloadIcon5,
  QrCode as QrCodeIcon2,
  Camera,
  Bell as BellIcon2,
  Star as StarIcon2,
  Heart as HeartIcon2,
  MessageCircle as MessageCircleIcon3,
  Workflow,
  Settings as SettingsIcon4,
  Zap as ZapIcon4,
  Users as UsersIcon5,
  MessageCircle as MessageCircleIcon4,
  Video as VideoIcon2,
  Phone as PhoneIcon2,
  Share as ShareIcon,
  Edit as EditIcon3,
  FileText as FileTextIcon3,
  BarChart3 as BarChart3Icon4,
  PieChart as PieChartIcon3,
  LineChart as LineChartIcon3,
  TrendingUp as TrendingUpIcon3,
  Download as DownloadIcon6,
  Share as ShareIcon2,
  Edit as EditIcon4,
  Settings as SettingsIcon5,
  Store as StoreIcon,
  Package as PackageIcon,
  Download as DownloadIcon7,
  Star as StarIcon3,
  Users as UsersIcon6,
  Settings as SettingsIcon6,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Marketplace Integration Demo - Buffr Host Platform",
  description:
    "Experience our third-party app marketplace with integrations, extensions, and custom solutions.",
};

export default function MarketplaceIntegrationDemoPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            🎯 <strong>Marketplace Integration Demo</strong> - Third-party app
            marketplace and extensions
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-amber-600 to-orange-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <Store className="w-24 h-24 mx-auto mb-4 opacity-90" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Marketplace Excellence
            </h1>
            <p className="text-xl md:text-2xl mb-6">
              Third-party app marketplace and integrations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-accent btn-lg">
                <Package className="w-5 h-5 mr-2" />
                Browse Marketplace
              </button>
              <Link
                href="/demo/etuna/management-demo"
                className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-gray-900"
              >
                <Monitor className="w-5 h-5 mr-2" />
                View Management Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Marketplace Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Third-Party App Marketplace
              </h2>
              <p className="text-lg text-base-content/80 mb-6">
                See how our marketplace platform provides access to third-party
                applications, extensions, and custom solutions that extend Buffr
                Host capabilities across all Etuna operations and business
                needs.
              </p>

              {/* Demo Marketplace Dashboard */}
              <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-xl mb-6">
                <h3 className="text-lg font-bold mb-4">Featured Apps</h3>
                <div className="space-y-4">
                  {/* App Examples */}
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Advanced Analytics Pro</p>
                        <p className="text-sm text-gray-500">
                          Business intelligence
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-amber-600">4.9★</p>
                      <p className="text-xs text-gray-500">$29/month</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Social Media Manager</p>
                        <p className="text-sm text-gray-500">
                          Marketing automation
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-600">4.8★</p>
                      <p className="text-xs text-gray-500">$19/month</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Inventory Optimizer</p>
                        <p className="text-sm text-gray-500">
                          Supply chain management
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">4.7★</p>
                      <p className="text-xs text-gray-500">$39/month</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Third-party app marketplace</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Seamless integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Custom extensions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Developer ecosystem</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
                alt="Marketplace Integration"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Store className="w-6 h-6 text-amber-500" />
                  <div>
                    <p className="font-semibold">App Marketplace</p>
                    <p className="text-sm text-nude-700">500+ Apps</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marketplace Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">
            Why Our Marketplace Integration Excels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* App Discovery */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-amber-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  App Discovery
                </h3>
                <p className="text-sm text-nude-700">
                  Discover and browse hundreds of third-party applications and
                  extensions.
                </p>
              </div>
            </div>

            {/* Seamless Integration */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  Seamless Integration
                </h3>
                <p className="text-sm text-nude-700">
                  One-click installation and automatic integration with platform
                  features.
                </p>
              </div>
            </div>

            {/* Developer Tools */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  Developer Tools
                </h3>
                <p className="text-sm text-nude-700">
                  Comprehensive SDK and tools for building custom applications.
                </p>
              </div>
            </div>

            {/* App Management */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  App Management
                </h3>
                <p className="text-sm text-nude-700">
                  Centralized management of installed apps with updates and
                  permissions.
                </p>
              </div>
            </div>

            {/* Security & Compliance */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-orange-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  Security & Compliance
                </h3>
                <p className="text-sm text-nude-700">
                  Vetted applications with security reviews and compliance
                  certifications.
                </p>
              </div>
            </div>

            {/* Custom Solutions */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  Custom Solutions
                </h3>
                <p className="text-sm text-nude-700">
                  Custom app development and integration services for unique
                  requirements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* App Categories */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">
            App Categories & Solutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Business Intelligence */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Business Intelligence</h3>
                    <p className="text-sm text-nude-700">
                      Analytics and reporting
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Advanced Analytics</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custom Dashboards</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Visualization</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Predictive Models</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Marketing Tools */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Marketing Tools</h3>
                    <p className="text-sm text-nude-700">Campaign management</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Social Media</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email Marketing</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SEO Tools</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Content Management</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Operations */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Operations</h3>
                    <p className="text-sm text-nude-700">
                      Operational efficiency
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Inventory Management</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supply Chain</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Control</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Process Automation</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">
            Advanced Marketplace Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI-Powered Recommendations */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                AI-Powered Recommendations
              </h3>
              <p className="text-nude-700">
                Machine learning suggests relevant apps based on your business
                needs.
              </p>
            </div>

            {/* Developer Ecosystem */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary text-secondary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Developer Ecosystem
              </h3>
              <p className="text-nude-700">
                Thriving community of developers creating innovative solutions.
              </p>
            </div>

            {/* Enterprise Support */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-accent-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Support</h3>
              <p className="text-nude-700">
                Dedicated support and SLA guarantees for enterprise
                applications.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Experience Marketplace Integration
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Marketplace Browser */}
              <div className="card bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Store className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        Marketplace Browser
                      </h3>
                      <p className="text-white/80">
                        See how marketplace integration works
                      </p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6">
                    Experience our marketplace platform. Browse apps, install
                    extensions, configure integrations, and see how third-party
                    solutions extend capabilities.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>App discovery and browsing</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>One-click installation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Seamless integration</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Custom app development</span>
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
                      <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center">
                        <Monitor className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        Marketplace Management
                      </h3>
                      <p className="text-nude-700">
                        See how marketplace drives platform success
                      </p>
                    </div>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    Explore our marketplace management dashboard. Manage
                    installed apps, configure permissions, monitor usage
                    analytics, and optimize marketplace performance.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>App management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Permission configuration</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Usage analytics</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Performance optimization</span>
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-6">
                    <Link
                      href="/demo/etuna/management-demo"
                      className="btn btn-primary"
                    >
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
                <p className="text-primary-content/80">
                  Contact us to implement marketplace integration.
                </p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Schedule a Demo</h3>
                <p className="text-primary-content/80">
                  Book a personalized demonstration of our marketplace system.
                </p>
              </div>
              <div className="text-center">
                <Globe className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Learn More</h3>
                <p className="text-primary-content/80">
                  Visit our main website for more information about Buffr Host.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
