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
  FileText,
  Image as ImageIcon,
  Video,
  Upload,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Calendar,
  Clock,
  Users,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  SparklesIcon,
  Monitor,
  Shield,
  Megaphone,
  Zap,
  Heart,
  Target,
  TrendingUp,
  BarChart3,
  MessageCircle,
  Settings,
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
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Content Management Demo - Buffr Host Platform",
  description:
    "Experience our comprehensive CMS that manages all content types, media assets, and digital experiences across your hospitality business.",
};

export default function CMSDemoPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            🎯 <strong>Content Management Demo</strong> - Complete digital
            content control
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-indigo-600 to-blue-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <FileText className="w-24 h-24 mx-auto mb-4 opacity-90" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Content Control
            </h1>
            <p className="text-xl md:text-2xl mb-6">
              Manage all your digital content in one place
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-accent btn-lg">
                <Edit className="w-5 h-5 mr-2" />
                Create Content
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
        {/* CMS Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Comprehensive Content Management
              </h2>
              <p className="text-lg text-base-content/80 mb-6">
                See how our unified CMS manages all content types - from menus
                and room descriptions to marketing materials and media assets -
                across all Etuna digital touchpoints.
              </p>

              {/* Demo Content Library */}
              <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-xl mb-6">
                <h3 className="text-lg font-bold mb-4">Content Library</h3>
                <div className="space-y-4">
                  {/* Content Examples */}
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Restaurant Menu</p>
                        <p className="text-sm text-gray-500">
                          Updated 2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">Published</p>
                      <p className="text-xs text-gray-500">Live</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Image className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Room Gallery</p>
                        <p className="text-sm text-gray-500">
                          Updated 1 day ago
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">Published</p>
                      <p className="text-xs text-gray-500">Live</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Property Tour Video</p>
                        <p className="text-sm text-gray-500">
                          Updated 3 days ago
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-yellow-600">Draft</p>
                      <p className="text-xs text-gray-500">Pending</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Unified content management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Media asset management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Version control and history</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Multi-channel publishing</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
                alt="Content Management"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-semibold">Content Hub</p>
                    <p className="text-sm text-nude-700">All-in-One CMS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CMS Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">
            Why Our CMS Excels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Unified Management */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Folder className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  Unified Management
                </h3>
                <p className="text-sm text-nude-700">
                  Manage all content types - text, images, videos, documents -
                  from a single interface.
                </p>
              </div>
            </div>

            {/* Media Library */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  Media Library
                </h3>
                <p className="text-sm text-nude-700">
                  Organize and manage all media assets with automatic
                  optimization and CDN delivery.
                </p>
              </div>
            </div>

            {/* Version Control */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Archive className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  Version Control
                </h3>
                <p className="text-sm text-nude-700">
                  Track all changes with complete version history and easy
                  rollback capabilities.
                </p>
              </div>
            </div>

            {/* Multi-Channel */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share className="w-8 h-8 text-orange-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  Multi-Channel Publishing
                </h3>
                <p className="text-sm text-nude-700">
                  Publish content across website, mobile app, social media, and
                  marketing materials.
                </p>
              </div>
            </div>

            {/* Workflow Management */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  Workflow Management
                </h3>
                <p className="text-sm text-nude-700">
                  Set up approval workflows and role-based permissions for
                  content management.
                </p>
              </div>
            </div>

            {/* SEO Optimization */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-red-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">
                  SEO Optimization
                </h3>
                <p className="text-sm text-nude-700">
                  Built-in SEO tools with meta tags, keywords, and content
                  optimization suggestions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Types */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">
            Content Types & Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Text Content */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Type className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Text Content</h3>
                    <p className="text-sm text-nude-700">
                      Pages, articles, descriptions
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Pages</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Articles</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Descriptions</span>
                    <span className="font-semibold">89</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Assets */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Image className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Media Assets</h3>
                    <p className="text-sm text-nude-700">
                      Images, videos, audio
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Images</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Videos</span>
                    <span className="font-semibold">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audio</span>
                    <span className="font-semibold">34</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Marketing Materials */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Marketing Materials</h3>
                    <p className="text-sm text-nude-700">
                      Brochures, flyers, banners
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Brochures</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flyers</span>
                    <span className="font-semibold">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Banners</span>
                    <span className="font-semibold">23</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CMS Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">
            Advanced CMS Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Rich Text Editor */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rich Text Editor</h3>
              <p className="text-nude-700">
                Powerful WYSIWYG editor with formatting, media embedding, and
                content templates.
              </p>
            </div>

            {/* Asset Management */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary text-secondary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Asset Management</h3>
              <p className="text-nude-700">
                Drag-and-drop uploads, automatic optimization, and CDN delivery
                for fast loading.
              </p>
            </div>

            {/* Publishing Workflow */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-accent-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Publishing Workflow
              </h3>
              <p className="text-nude-700">
                Scheduled publishing, approval workflows, and multi-channel
                distribution.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Experience Content Management
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Content Creation */}
              <div className="card bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Edit className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Content Creation</h3>
                      <p className="text-white/80">
                        See how easy content management can be
                      </p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6">
                    Experience our intuitive content management system. Create,
                    edit, and publish content across all your digital channels
                    with powerful tools and seamless workflows.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Rich text editing</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Media asset management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Version control</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Multi-channel publishing</span>
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
                      <h3 className="text-2xl font-bold">
                        Management Dashboard
                      </h3>
                      <p className="text-nude-700">
                        See how CMS drives content efficiency
                      </p>
                    </div>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    Explore our comprehensive content management dashboard.
                    Organize assets, manage workflows, track performance, and
                    optimize your content strategy with powerful analytics.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Content library organization</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Workflow management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Performance analytics</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>SEO optimization tools</span>
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
                <h3 className="font-bold text-lg mb-2">Ready to Manage?</h3>
                <p className="text-primary-content/80">
                  Contact us to implement comprehensive content management.
                </p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Schedule a Demo</h3>
                <p className="text-primary-content/80">
                  Book a personalized demonstration of our CMS system.
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
