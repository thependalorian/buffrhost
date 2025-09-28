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
  Plug,
  Link as LinkIcon,
  Settings,
  Zap,
  Globe,
  Database,
  Server,
  Network,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  CreditCard,
  SparklesIcon,
  Monitor,
  Shield,
  Heart,
  Target,
  TrendingUp,
  BarChart3,
  MessageCircle,
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
  Plug as PlugIcon,
  Link as LinkIcon2,
  Settings as SettingsIcon4,
  Zap as ZapIcon3,
  Globe as GlobeIcon4,
  Database as DatabaseIcon3,
  Server as ServerIcon3,
  Network as NetworkIcon3,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Advanced Integrations Demo - Buffr Host Platform",
  description:
    "Experience our comprehensive integration platform with third-party systems, APIs, and enterprise connectors.",
};

export default function AdvancedIntegrationsDemoPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            🎯 <strong>Advanced Integrations Demo</strong> - Third-party systems
            and enterprise connectors
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-violet-600 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <Plug className="w-24 h-24 mx-auto mb-4 opacity-90" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Advanced Integrations
            </h1>
            <p className="text-xl md:text-2xl mb-6">
              Seamless third-party system connectivity
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-accent btn-lg">
                <LinkIcon className="w-5 h-5 mr-2" />
                Explore Integrations
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
        {/* Integrations Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Comprehensive Integration Platform
              </h2>
              <p className="text-lg text-base-content/80 mb-6">
                See how our advanced integration platform connects seamlessly
                with third-party systems, payment gateways, booking platforms,
                and enterprise software across all Etuna operations.
              </p>

              {/* Demo Integration Dashboard */}
              <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-xl mb-6">
                <h3 className="text-lg font-bold mb-4">Active Integrations</h3>
                <div className="space-y-4">
                  {/* Integration Examples */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Payment Gateway</p>
                        <p className="text-sm text-gray-500">
                          RealPay integration
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">Connected</p>
                      <p className="text-xs text-gray-500">99.9% uptime</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Booking Platform</p>
                        <p className="text-sm text-gray-500">Booking.com API</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-600">Connected</p>
                      <p className="text-xs text-gray-500">Real-time sync</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Accounting System</p>
                        <p className="text-sm text-gray-500">
                          QuickBooks integration
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-purple-600">Connected</p>
                      <p className="text-xs text-gray-500">Auto-sync enabled</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Payment gateway integrations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Booking platform connectivity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Enterprise software connectors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Real-time data synchronization</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
                alt="Advanced Integrations"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Plug className="w-6 h-6 text-violet-500" />
                  <div>
                    <p className="font-semibold">Integration Hub</p>
                    <p className="text-sm text-nude-700">50+ Connectors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">
            Why Our Advanced Integrations Excel
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Payment Gateways */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  Payment Gateways
                </h3>
                <p className="text-sm text-nude-700">
                  Seamless integration with multiple payment processors and
                  gateways.
                </p>
              </div>
            </div>

            {/* Booking Platforms */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  Booking Platforms
                </h3>
                <p className="text-sm text-nude-700">
                  Connect with major booking platforms and channel managers.
                </p>
              </div>
            </div>

            {/* Enterprise Software */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  Enterprise Software
                </h3>
                <p className="text-sm text-nude-700">
                  Integration with CRM, ERP, and accounting systems.
                </p>
              </div>
            </div>

            {/* Marketing Tools */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Megaphone className="w-8 h-8 text-orange-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  Marketing Tools
                </h3>
                <p className="text-sm text-nude-700">
                  Connect with email marketing, social media, and analytics
                  platforms.
                </p>
              </div>
            </div>

            {/* Communication Systems */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  Communication Systems
                </h3>
                <p className="text-sm text-nude-700">
                  Integration with SMS, email, and messaging platforms.
                </p>
              </div>
            </div>

            {/* Data Analytics */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-red-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  Data Analytics
                </h3>
                <p className="text-sm text-nude-700">
                  Connect with business intelligence and analytics platforms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Categories */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">
            Integration Categories & Connectors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Payment Systems */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Payment Systems</h3>
                    <p className="text-sm text-nude-700">Payment processing</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>RealPay</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adumo</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PayPal</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stripe</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Platforms */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Booking Platforms</h3>
                    <p className="text-sm text-nude-700">Channel management</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Booking.com</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expedia</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Airbnb</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Agoda</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Systems */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Enterprise Systems</h3>
                    <p className="text-sm text-nude-700">Business software</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>QuickBooks</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Salesforce</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HubSpot</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SAP</span>
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
            Advanced Integration Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Real-time Synchronization */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Real-time Synchronization
              </h3>
              <p className="text-nude-700">
                Instant data synchronization across all connected systems and
                platforms.
              </p>
            </div>

            {/* Custom Connectors */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary text-secondary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Connectors</h3>
              <p className="text-nude-700">
                Build custom integrations for unique business requirements and
                systems.
              </p>
            </div>

            {/* Integration Monitoring */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-accent-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Integration Monitoring
              </h3>
              <p className="text-nude-700">
                Comprehensive monitoring and alerting for all integration health
                and performance.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Experience Advanced Integrations
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Integration Hub */}
              <div className="card bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Plug className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Integration Hub</h3>
                      <p className="text-white/80">
                        See how advanced integrations work
                      </p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6">
                    Experience our integration platform. Connect systems,
                    configure data flows, monitor synchronization, and see how
                    seamless connectivity drives efficiency.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Payment gateway connections</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Booking platform sync</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Enterprise software integration</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Real-time data synchronization</span>
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
                      <div className="w-16 h-16 rounded-full bg-violet-500 text-white flex items-center justify-center">
                        <Monitor className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        Integration Management
                      </h3>
                      <p className="text-nude-700">
                        See how integrations drive platform success
                      </p>
                    </div>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    Explore our integration management dashboard. Configure
                    connections, monitor data flows, manage sync schedules, and
                    optimize integration performance.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Integration configuration</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Data flow monitoring</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Sync schedule management</span>
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
                  Contact us to implement advanced integrations.
                </p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Schedule a Demo</h3>
                <p className="text-primary-content/80">
                  Book a personalized demonstration of our integration platform.
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
