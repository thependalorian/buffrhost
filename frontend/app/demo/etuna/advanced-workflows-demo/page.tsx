import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Workflow, 
  Settings, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  Target, 
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  SparklesIcon,
  Monitor,
  Shield,
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
  EyeOff as EyeOffIcon,
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
  Activity,
  Smartphone as SmartphoneIcon2,
  Download as DownloadIcon5,
  QrCode as QrCodeIcon2,
  Camera,
  Bell as BellIcon2,
  MapPin as MapPinIcon,
  Star as StarIcon2,
  Heart as HeartIcon2,
  Share,
  MessageCircle as MessageCircleIcon3,
  Workflow as WorkflowIcon,
  Settings as SettingsIcon4,
  Zap as ZapIcon4
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Advanced Workflows Demo - Buffr Host Platform',
  description: 'Experience our advanced business process automation with intelligent workflows and AI-powered optimization.',
};

export default function AdvancedWorkflowsDemoPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            🎯 <strong>Advanced Workflows Demo</strong> - Business process automation and AI optimization
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-emerald-600 to-teal-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <Workflow className="w-24 h-24 mx-auto mb-4 opacity-90" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Workflow Excellence</h1>
            <p className="text-xl md:text-2xl mb-6">Intelligent business process automation</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-accent btn-lg">
                <Settings className="w-5 h-5 mr-2" />
                Explore Workflows
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
        {/* Workflow Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Advanced Business Process Automation</h2>
              <p className="text-lg text-base-content/80 mb-6">
                See how our advanced workflow engine automates complex business processes, 
                optimizes operations, and integrates AI-powered decision making across 
                all Etuna operations and management tasks.
              </p>
              
              {/* Demo Workflow Dashboard */}
              <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-xl mb-6">
                <h3 className="text-lg font-bold mb-4">Active Workflows</h3>
                <div className="space-y-4">
                  {/* Workflow Examples */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Guest Check-in</p>
                        <p className="text-sm text-gray-500">Automated process</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">Active</p>
                      <p className="text-xs text-gray-500">95% efficiency</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Inventory Reorder</p>
                        <p className="text-sm text-gray-500">Smart automation</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-600">Active</p>
                      <p className="text-xs text-gray-500">98% accuracy</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Staff Scheduling</p>
                        <p className="text-sm text-gray-500">AI optimization</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-purple-600">Active</p>
                      <p className="text-xs text-gray-500">92% optimization</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Intelligent process automation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>AI-powered decision making</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Real-time workflow monitoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Custom workflow builder</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
                alt="Advanced Workflows"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Workflow className="w-6 h-6 text-emerald-500" />
                  <div>
                    <p className="font-semibold">Workflow Engine</p>
                    <p className="text-sm text-nude-700">AI-Powered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Why Our Advanced Workflows Excel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Process Automation */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-emerald-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Process Automation</h3>
                <p className="text-sm text-nude-700">Automate complex business processes with intelligent decision making.</p>
              </div>
            </div>
            
            {/* AI Optimization */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">AI Optimization</h3>
                <p className="text-sm text-nude-700">Machine learning algorithms optimize workflows for maximum efficiency.</p>
              </div>
            </div>
            
            {/* Real-time Monitoring */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Real-time Monitoring</h3>
                <p className="text-sm text-nude-700">Live workflow monitoring with instant alerts and optimization.</p>
              </div>
            </div>
            
            {/* Custom Builder */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Custom Builder</h3>
                <p className="text-sm text-nude-700">Drag-and-drop workflow builder for custom business processes.</p>
              </div>
            </div>
            
            {/* Integration Hub */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Network className="w-8 h-8 text-orange-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Integration Hub</h3>
                <p className="text-sm text-nude-700">Seamless integration with all platform features and external systems.</p>
              </div>
            </div>
            
            {/* Performance Analytics */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Performance Analytics</h3>
                <p className="text-sm text-nude-700">Detailed workflow analytics and optimization recommendations.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Categories */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Workflow Categories & Automation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Guest Operations */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Guest Operations</h3>
                    <p className="text-sm text-nude-700">Customer service automation</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Check-in/Check-out</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Booking Management</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Requests</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Loyalty Processing</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Management */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Staff Management</h3>
                    <p className="text-sm text-nude-700">Employee workflow automation</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Shift Scheduling</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Task Assignment</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Performance Tracking</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payroll Processing</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Operations */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Business Operations</h3>
                    <p className="text-sm text-nude-700">Management workflow automation</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Financial Reporting</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inventory Management</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marketing Campaigns</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compliance Monitoring</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Advanced Workflow Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Machine Learning Optimization */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">ML-Powered Optimization</h3>
              <p className="text-nude-700">Machine learning algorithms continuously optimize workflow performance.</p>
            </div>

            {/* Predictive Analytics */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary text-secondary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Predictive Analytics</h3>
              <p className="text-nude-700">Anticipate bottlenecks and optimize workflows before issues occur.</p>
            </div>

            {/* Dynamic Adaptation */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-accent-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dynamic Adaptation</h3>
              <p className="text-nude-700">Workflows automatically adapt to changing business conditions and requirements.</p>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Experience Advanced Workflows</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Workflow Builder */}
              <div className="card bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Workflow className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Workflow Builder</h3>
                      <p className="text-white/80">See how advanced workflows work</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6">
                    Experience our advanced workflow engine. 
                    Build custom processes, configure automation, 
                    monitor performance, and see how intelligent 
                    workflows drive operational excellence.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Visual workflow builder</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>AI-powered optimization</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Real-time monitoring</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Custom automation rules</span>
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
                      <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Monitor className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Workflow Management</h3>
                      <p className="text-nude-700">See how workflows drive platform success</p>
                    </div>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    Explore our workflow management dashboard. 
                    Configure automation rules, monitor 
                    workflow performance, analyze bottlenecks, 
                    and optimize for maximum efficiency.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Workflow configuration</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Performance monitoring</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Bottleneck analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Optimization recommendations</span>
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
                <h3 className="font-bold text-lg mb-2">Ready to Automate?</h3>
                <p className="text-primary-content/80">Contact us to implement advanced workflows.</p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Schedule a Demo</h3>
                <p className="text-primary-content/80">Book a personalized demonstration of our workflow system.</p>
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