import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Palette, 
  Brush, 
  Layers, 
  Settings, 
  Eye, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
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
  Target,
  TrendingUp,
  BarChart3,
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
  Clock,
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
  AlertCircle,
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
  Database,
  Globe as GlobeIcon2,
  Lock as LockIcon2,
  Key,
  Server,
  Network,
  Layers as LayersIcon,
  Palette as PaletteIcon,
  Brush as BrushIcon,
  Settings as SettingsIcon2,
  Eye as EyeIcon3,
  Download as DownloadIcon3,
  Upload as UploadIcon4,
  RefreshCw as RefreshCwIcon2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'White-Label Solutions Demo - Buffr Host Platform',
  description: 'Experience our comprehensive white-label solutions that enable complete brand customization and rebranding.',
};

export default function WhiteLabelDemoPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            🎯 <strong>White-Label Solutions Demo</strong> - Complete brand customization and rebranding
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-pink-600 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <Palette className="w-24 h-24 mx-auto mb-4 opacity-90" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">White-Label Excellence</h1>
            <p className="text-xl md:text-2xl mb-6">Complete brand customization and rebranding</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-accent btn-lg">
                <Brush className="w-5 h-5 mr-2" />
                Customize Brand
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
        {/* White-Label Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Complete White-Label Solutions</h2>
              <p className="text-lg text-base-content/80 mb-6">
                See how our white-label solutions enable complete brand customization, 
                allowing you to rebrand the entire platform with your own identity, 
                colors, logos, and domain while maintaining all functionality.
              </p>
              
              {/* Demo Brand Customization */}
              <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-xl mb-6">
                <h3 className="text-lg font-bold mb-4">Brand Customization</h3>
                <div className="space-y-4">
                  {/* Brand Examples */}
                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                        <Palette className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Etuna Brand</p>
                        <p className="text-sm text-gray-500">Original branding</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">Active</p>
                      <p className="text-xs text-gray-500">Default theme</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Brush className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Safari Lodge Brand</p>
                        <p className="text-sm text-gray-500">Custom branding</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-600">Custom</p>
                      <p className="text-xs text-gray-500">Custom theme</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Layers className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Resort Group Brand</p>
                        <p className="text-sm text-gray-500">Enterprise branding</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">Enterprise</p>
                      <p className="text-xs text-gray-500">Full customization</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Complete brand customization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Custom domain support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>White-label mobile apps</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>API rebranding</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
                alt="White-Label Solutions"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Palette className="w-6 h-6 text-pink-500" />
                  <div>
                    <p className="font-semibold">Brand Control</p>
                    <p className="text-sm text-nude-700">100% Customizable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* White-Label Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Why Our White-Label Solutions Excel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Complete Customization */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-pink-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Complete Customization</h3>
                <p className="text-sm text-nude-700">Customize colors, fonts, logos, and entire user interface to match your brand.</p>
              </div>
            </div>
            
            {/* Custom Domain */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Custom Domain</h3>
                <p className="text-sm text-nude-700">Use your own domain name and SSL certificates for complete brand ownership.</p>
              </div>
            </div>
            
            {/* Mobile Apps */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">White-Label Apps</h3>
                <p className="text-sm text-nude-700">Custom branded mobile apps for iOS and Android with your branding.</p>
              </div>
            </div>
            
            {/* API Rebranding */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">API Rebranding</h3>
                <p className="text-sm text-nude-700">Custom API endpoints and documentation with your brand identity.</p>
              </div>
            </div>
            
            {/* Content Management */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-orange-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Content Management</h3>
                <p className="text-sm text-nude-700">Customize all content, terms, privacy policies, and legal documents.</p>
              </div>
            </div>
            
            {/* Support Branding */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Support Branding</h3>
                <p className="text-sm text-nude-700">Custom support channels, email templates, and help documentation.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customization Levels */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Customization Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Customization */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Brush className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Basic Customization</h3>
                    <p className="text-sm text-nude-700">Essential branding</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Logo & Colors</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custom Domain</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Basic Themes</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email Templates</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Customization */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Layers className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Advanced Customization</h3>
                    <p className="text-sm text-nude-700">Complete branding</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Full UI Customization</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile Apps</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custom Content</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>API Branding</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Customization */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Enterprise Customization</h3>
                    <p className="text-sm text-nude-700">Full white-label</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Complete Rebranding</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custom Development</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dedicated Support</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SLA Guarantee</span>
                    <span className="font-semibold text-green-600">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Advanced White-Label Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Theme Engine */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Theme Engine</h3>
              <p className="text-nude-700">Powerful theme customization with live preview and instant deployment.</p>
            </div>

            {/* Brand Asset Management */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary text-secondary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Brand Asset Management</h3>
              <p className="text-nude-700">Centralized management of logos, images, and brand assets across all platforms.</p>
            </div>

            {/* Custom Domain Management */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-accent-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Domain Management</h3>
              <p className="text-nude-700">Easy domain setup with automatic SSL certificates and DNS management.</p>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Experience White-Label Solutions</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Brand Customization */}
              <div className="card bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Palette className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Brand Customization</h3>
                      <p className="text-white/80">See how white-label solutions work</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6">
                    Experience our white-label customization tools. 
                    Change colors, upload logos, customize themes, 
                    and see how easy it is to create your own branded platform.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Live theme customization</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Brand asset management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Custom domain setup</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Mobile app branding</span>
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
                      <div className="w-16 h-16 rounded-full bg-pink-500 text-white flex items-center justify-center">
                        <Monitor className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Management Dashboard</h3>
                      <p className="text-nude-700">See how white-label drives brand success</p>
                    </div>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    Explore our white-label management dashboard. 
                    Configure branding, manage domains, customize 
                    themes, and deploy your branded platform with ease.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Theme configuration and preview</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Domain and SSL management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Brand asset library</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Deployment and versioning</span>
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
                <h3 className="font-bold text-lg mb-2">Ready to Brand?</h3>
                <p className="text-primary-content/80">Contact us to implement white-label solutions.</p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Schedule a Demo</h3>
                <p className="text-primary-content/80">Book a personalized demonstration of our white-label system.</p>
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