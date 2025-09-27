import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Calculator, 
  Receipt, 
  CreditCard, 
  Banknote, 
  Coins, 
  Target, 
  Users, 
  Calendar, 
  Clock, 
  Star,
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
  Settings,
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
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  QrCode,
  Wallet,
  ArrowRight,
  CheckCircle,
  Send,
  MousePointer,
  UserPlus,
  Gift,
  Percent,
  Activity,
  FileText,
  Image,
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
  Image as ImageIcon,
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
  Calculator as CalculatorIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  TrendingDown as TrendingDownIcon,
  DollarSign as DollarSignIcon
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Financial Analytics Demo - Buffr Host Platform',
  description: 'Experience our comprehensive financial analytics system that provides deep insights into revenue, costs, profitability, and business performance.',
};

export default function FinancialAnalyticsDemoPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            🎯 <strong>Financial Analytics Demo</strong> - Deep business insights and forecasting
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-green-600 to-blue-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <DollarSign className="w-24 h-24 mx-auto mb-4 opacity-90" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Financial Intelligence</h1>
            <p className="text-xl md:text-2xl mb-6">Advanced analytics that drive profitability</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-accent btn-lg">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
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
        {/* Financial Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Comprehensive Financial Analytics</h2>
              <p className="text-lg text-base-content/80 mb-6">
                See how our advanced financial analytics system provides deep insights into revenue, 
                costs, profitability, and business performance across all Etuna services.
              </p>
              
              {/* Demo Financial Dashboard */}
              <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-xl mb-6">
                <h3 className="text-lg font-bold mb-4">Financial Overview</h3>
                <div className="space-y-4">
                  {/* Financial Metrics */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Monthly Revenue</p>
                        <p className="text-sm text-gray-500">January 2024</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600 font-bold">N$125,000</p>
                      <p className="text-xs text-gray-500">+12% vs last month</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Calculator className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Gross Profit</p>
                        <p className="text-sm text-gray-500">After costs</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-600 font-bold">N$78,500</p>
                      <p className="text-xs text-gray-500">62.8% margin</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Net Profit</p>
                        <p className="text-sm text-gray-500">Final profit</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-purple-600 font-bold">N$45,200</p>
                      <p className="text-xs text-gray-500">36.2% margin</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Real-time financial tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Advanced forecasting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Cost optimization insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Profitability analysis</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
                alt="Financial Analytics"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-semibold">Profit Growth</p>
                    <p className="text-sm text-nude-700">+28% YoY</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Why Our Financial Analytics Excel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Real-time Tracking */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Real-time Tracking</h3>
                <p className="text-sm text-nude-700">Monitor revenue, costs, and profitability in real-time across all services.</p>
              </div>
            </div>
            
            {/* Advanced Forecasting */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Advanced Forecasting</h3>
                <p className="text-sm text-nude-700">AI-powered predictions for revenue, costs, and seasonal trends.</p>
              </div>
            </div>
            
            {/* Cost Optimization */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Cost Optimization</h3>
                <p className="text-sm text-nude-700">Identify cost-saving opportunities and optimize spending across departments.</p>
              </div>
            </div>
            
            {/* Profitability Analysis */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PieChart className="w-8 h-8 text-orange-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Profitability Analysis</h3>
                <p className="text-sm text-nude-700">Deep dive into profit margins, revenue streams, and service profitability.</p>
              </div>
            </div>
            
            {/* Multi-service Analytics */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Multi-service Analytics</h3>
                <p className="text-sm text-nude-700">Compare performance across restaurant, hotel, spa, and tour services.</p>
              </div>
            </div>
            
            {/* Custom Reporting */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-red-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Custom Reporting</h3>
                <p className="text-sm text-nude-700">Create custom reports and dashboards tailored to your business needs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Key Financial Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Revenue Metrics */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Revenue</h3>
                    <p className="text-sm text-nude-700">Total income</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monthly</span>
                    <span className="font-semibold text-green-600">N$125K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Avg</span>
                    <span className="font-semibold text-green-600">N$4,032</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Growth</span>
                    <span className="font-semibold text-green-600">+12%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Metrics */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Costs</h3>
                    <p className="text-sm text-nude-700">Total expenses</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monthly</span>
                    <span className="font-semibold text-red-600">N$79.8K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Avg</span>
                    <span className="font-semibold text-red-600">N$2,574</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Growth</span>
                    <span className="font-semibold text-red-600">+8%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profit Metrics */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Profit</h3>
                    <p className="text-sm text-nude-700">Net profit</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monthly</span>
                    <span className="font-semibold text-blue-600">N$45.2K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Avg</span>
                    <span className="font-semibold text-blue-600">N$1,458</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margin</span>
                    <span className="font-semibold text-blue-600">36.2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Metrics */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">ROI</h3>
                    <p className="text-sm text-nude-700">Return on investment</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monthly</span>
                    <span className="font-semibold text-purple-600">18.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual</span>
                    <span className="font-semibold text-purple-600">222%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trend</span>
                    <span className="font-semibold text-green-600">↗ +5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Advanced Financial Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Predictive Analytics */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Predictive Analytics</h3>
              <p className="text-nude-700">AI-powered forecasting for revenue, costs, and seasonal trends with 95% accuracy.</p>
            </div>

            {/* Cost Center Analysis */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary text-secondary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cost Center Analysis</h3>
              <p className="text-nude-700">Detailed breakdown of costs by department, service, and expense category.</p>
            </div>

            {/* Budget Management */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-accent-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Budget Management</h3>
              <p className="text-nude-700">Set budgets, track performance, and receive alerts for budget variances.</p>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Experience Financial Intelligence</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Financial Insights */}
              <div className="card bg-gradient-to-br from-green-500 to-blue-500 text-white shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <BarChart3 className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Financial Insights</h3>
                      <p className="text-white/80">See how data drives business decisions</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6">
                    Experience how our financial analytics provide actionable insights 
                    that drive profitability. From real-time tracking to predictive 
                    forecasting, see how data transforms business performance.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Real-time financial tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Predictive forecasting</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Cost optimization insights</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Profitability analysis</span>
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
                      <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center">
                        <Monitor className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Management Dashboard</h3>
                      <p className="text-nude-700">See how analytics drive profitability</p>
                    </div>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    Explore our comprehensive financial management dashboard. 
                    Track revenue, analyze costs, forecast trends, and optimize 
                    profitability with powerful analytics and reporting tools.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Comprehensive financial dashboards</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Advanced forecasting models</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Cost optimization recommendations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Custom reporting and analytics</span>
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
                <h3 className="font-bold text-lg mb-2">Ready to Analyze?</h3>
                <p className="text-primary-content/80">Contact us to implement comprehensive financial analytics.</p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Schedule a Demo</h3>
                <p className="text-primary-content/80">Book a personalized demonstration of our financial analytics system.</p>
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