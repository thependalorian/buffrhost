import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader, StatCard } from '@/src/components/ui';
import { 
  MapPin, 
  Star, 
  Wifi, 
  Car, 
  Coffee, 
  Dumbbell, 
  Waves, 
  Utensils,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  Shield,
  Award,
  Heart,
  ArrowRight,
  CheckCircle,
  Monitor,
  MessageCircle,
  MapIcon,
  SparklesIcon,
  QrCode,
  Crown,
  Package,
  CreditCard,
  Zap,
  Smartphone,
  Workflow,
  Store,
  Megaphone,
  FileText,
  DollarSign,
  Mic,
  TrendingUp,
  Building2,
  Palette,
  Code,
  BarChart3,
  Plug
} from 'lucide-react';
import { etunaUnifiedData } from '@/lib/data/etuna-property-unified';
import EtunaMap from '@/components/EtunaMap';
import { useEtunaProperty, useEtunaRooms, useEtunaTransportationServices, useEtunaRecreationServices, useEtunaSpecializedServices } from '@/lib/hooks/useEtunaDemoApi';

export const metadata: Metadata = {
  title: 'Etuna Guesthouse & Tours - Buffr Host Demo',
  description: 'Experience the Buffr Host platform with our Etuna Guesthouse demo. See how our hospitality management system works in action.',
};

export default function EtunaDemoPage() {
  // Use real API data with fallback to static data
  const { data: apiProperty, loading: propertyLoading } = useEtunaProperty();
  const { data: apiRooms, loading: roomsLoading } = useEtunaRooms();
  const { data: apiTransportationServices, loading: transportationLoading } = useEtunaTransportationServices();
  const { data: apiRecreationServices, loading: recreationLoading } = useEtunaRecreationServices();
  const { data: apiSpecializedServices, loading: specializedLoading } = useEtunaSpecializedServices();

  // Use API data if available, otherwise fallback to static data
  const property = apiProperty || etunaUnifiedData.property;
  const businessInfo = etunaUnifiedData.businessInfo;
  const contactInfo = etunaUnifiedData.contactInfo;
  const mediaAssets = etunaUnifiedData.mediaAssets;
  const roomTypes = apiRooms || etunaUnifiedData.roomTypes;
  const transportationServices = apiTransportationServices || etunaUnifiedData.transportationServices;
  const recreationServices = apiRecreationServices || etunaUnifiedData.recreationServices;
  const specializedServices = apiSpecializedServices || etunaUnifiedData.specializedServices;

  // Show loading state if any critical data is still loading
  const isLoading = propertyLoading || roomsLoading;

  // Show loading spinner if data is still loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-lg text-base-content/70">Loading Etuna Demo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            🎯 <strong>Buffr Host Demo</strong> - This is a showcase of our hospitality management platform
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
          alt={property.property_name}
          width={1200}
          height={500}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 nude-gradient-deep opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{property.property_name}</h1>
            <p className="text-xl md:text-2xl mb-6">Buffr Host Platform Demo - {property.property_type} property</p>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="flex items-center">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <span className="ml-2 text-xl font-semibold">4.8</span>
                <span className="ml-2 text-lg">(127 reviews)</span>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5" />
                <span className="ml-2">Ongwediva, Namibia</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/guest/etuna/rooms" className="nude-button btn-lg">
                Explore Rooms
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/demo/etuna/management-demo" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-gray-900">
                View Management Demo
                <Monitor className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* About Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Buffr Host Platform Demo</h2>
              <p className="text-lg text-base-content/80 mb-6">
                This is a live demonstration of the Buffr Host hospitality management platform. 
                See how our system handles property management, bookings, orders, and analytics 
                for the Etuna Guesthouse & Tours.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-nude-700" />
                  <div>
                    <p className="font-semibold">Check-in: {property.check_in_time}</p>
                    <p className="text-sm text-nude-700">Check-out: {property.check_out_time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-nude-700" />
                  <div>
                    <p className="font-semibold">Capacity: {property.total_rooms}</p>
                    <p className="text-sm text-nude-700">rooms</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <Link href="/guest/etuna/rooms" className="btn btn-primary">Explore Rooms</Link>
                <Link href="/guest/etuna/services" className="btn btn-outline">View Services</Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
                alt="Etuna Guesthouse Interior"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-yellow-500" />
                  <div>
                    <p className="font-semibold">Platform Demo</p>
                    <p className="text-sm text-nude-700">Buffr Host Showcase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 1 Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Phase 1 Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* QR Code System */}
            <Link href="/demo/etuna/qr-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <QrCode className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">QR Code System</h3>
                <p className="text-sm text-nude-700">Instant access to menus, services, and loyalty programs</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">New Feature</span>
                </div>
              </div>
            </Link>
            
            {/* Loyalty Program */}
            <Link href="/demo/etuna/loyalty-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Crown className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Loyalty Program</h3>
                <p className="text-sm text-nude-700">Cross-service rewards and tiered benefits</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">New Feature</span>
                </div>
              </div>
            </Link>
            
            {/* Inventory Management */}
            <Link href="/demo/etuna/inventory-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Package className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Inventory Management</h3>
                <p className="text-sm text-nude-700">AI-powered stock optimization and tracking</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">New Feature</span>
                </div>
              </div>
            </Link>
            
            {/* Staff Management */}
            <Link href="/demo/etuna/staff-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                  <Users className="w-8 h-8 text-indigo-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Staff Management</h3>
                <p className="text-sm text-nude-700">HR, scheduling, and performance tracking</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">New Feature</span>
                </div>
              </div>
            </Link>
            
            {/* Payment Processing */}
            <Link href="/demo/etuna/payment-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <CreditCard className="w-8 h-8 text-orange-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Payment Processing</h3>
                <p className="text-sm text-nude-700">Multi-channel secure payment solutions</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">New Feature</span>
                </div>
              </div>
            </Link>
            
            {/* Admin Dashboard */}
            <Link href="/demo/etuna/admin-dashboard-demo/dashboard" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-200 transition-colors">
                  <Monitor className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Admin Dashboard</h3>
                <p className="text-sm text-nude-700">Complete management interface - No authentication required</p>
                <div className="mt-3">
                  <span className="badge badge-secondary badge-sm">Demo</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Final Optimization Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Final Optimization Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Performance Optimization */}
            <Link href="/demo/etuna/performance-optimization-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                  <Zap className="w-8 h-8 text-yellow-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Performance Optimization</h3>
                <p className="text-sm text-nude-700">Advanced caching, CDN, and real-time monitoring</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Optimization</span>
                </div>
              </div>
            </Link>
            
            {/* Mobile App Demo */}
            <Link href="/demo/etuna/mobile-app-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                  <Smartphone className="w-8 h-8 text-indigo-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Mobile App Demo</h3>
                <p className="text-sm text-nude-700">Native iOS and Android applications</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Mobile</span>
                </div>
              </div>
            </Link>
            
            {/* Advanced Workflows */}
            <Link href="/demo/etuna/advanced-workflows-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                  <Workflow className="w-8 h-8 text-emerald-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Advanced Workflows</h3>
                <p className="text-sm text-nude-700">Business process automation and AI optimization</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Automation</span>
                </div>
              </div>
            </Link>
            
            {/* Real-time Collaboration */}
            <Link href="/demo/etuna/realtime-collaboration-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-200 transition-colors">
                  <Users className="w-8 h-8 text-cyan-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Real-time Collaboration</h3>
                <p className="text-sm text-nude-700">Instant messaging, video calls, and shared workspaces</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Collaboration</span>
                </div>
              </div>
            </Link>
            
            {/* Advanced Reporting */}
            <Link href="/demo/etuna/advanced-reporting-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-rose-200 transition-colors">
                  <FileText className="w-8 h-8 text-rose-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Advanced Reporting</h3>
                <p className="text-sm text-nude-700">Custom report builder and automated delivery</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Reporting</span>
                </div>
              </div>
            </Link>
            
            {/* Marketplace Integration */}
            <Link href="/demo/etuna/marketplace-integration-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                  <Store className="w-8 h-8 text-amber-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Marketplace Integration</h3>
                <p className="text-sm text-nude-700">Third-party app marketplace and extensions</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Marketplace</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Phase 3 Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Phase 3 Enterprise Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Multi-Tenant Architecture */}
            <Link href="/demo/etuna/multi-tenant-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-200 transition-colors">
                  <Building2 className="w-8 h-8 text-slate-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Multi-Tenant Architecture</h3>
                <p className="text-sm text-nude-700">Enterprise scalability and management</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Enterprise</span>
                </div>
              </div>
            </Link>
            
            {/* White-Label Solutions */}
            <Link href="/demo/etuna/white-label-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                  <Palette className="w-8 h-8 text-pink-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">White-Label Solutions</h3>
                <p className="text-sm text-nude-700">Complete brand customization and rebranding</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Enterprise</span>
                </div>
              </div>
            </Link>
            
            {/* Enterprise Security */}
            <Link href="/demo/etuna/enterprise-security-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                  <Shield className="w-8 h-8 text-red-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Enterprise Security</h3>
                <p className="text-sm text-nude-700">Military-grade security and compliance</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Enterprise</span>
                </div>
              </div>
            </Link>
            
            {/* API Management */}
            <Link href="/demo/etuna/api-management-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                  <Code className="w-8 h-8 text-indigo-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">API Management</h3>
                <p className="text-sm text-nude-700">Developer tools and comprehensive API platform</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Enterprise</span>
                </div>
              </div>
            </Link>
            
            {/* Business Intelligence */}
            <Link href="/demo/etuna/business-intelligence-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                  <BarChart3 className="w-8 h-8 text-emerald-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Business Intelligence</h3>
                <p className="text-sm text-nude-700">Advanced analytics and data-driven insights</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Enterprise</span>
                </div>
              </div>
            </Link>
            
            {/* Advanced Integrations */}
            <Link href="/demo/etuna/advanced-integrations-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-violet-200 transition-colors">
                  <Plug className="w-8 h-8 text-violet-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Advanced Integrations</h3>
                <p className="text-sm text-nude-700">Third-party systems and enterprise connectors</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Enterprise</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Phase 2 Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Phase 2 Advanced Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Marketing Automation */}
            <Link href="/demo/etuna/marketing-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                  <Megaphone className="w-8 h-8 text-pink-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Marketing Automation</h3>
                <p className="text-sm text-nude-700">AI-powered campaigns and customer engagement</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Advanced</span>
                </div>
              </div>
            </Link>
            
            {/* Content Management */}
            <Link href="/demo/etuna/cms-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                  <FileText className="w-8 h-8 text-indigo-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Content Management</h3>
                <p className="text-sm text-nude-700">Unified CMS for all digital content</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Advanced</span>
                </div>
              </div>
            </Link>
            
            {/* Financial Analytics */}
            <Link href="/demo/etuna/financial-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <DollarSign className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Financial Analytics</h3>
                <p className="text-sm text-nude-700">Advanced financial insights and forecasting</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Advanced</span>
                </div>
              </div>
            </Link>
            
            {/* Voice AI */}
            <Link href="/demo/etuna/voice-ai-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Mic className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Voice AI Assistant</h3>
                <p className="text-sm text-nude-700">Natural language hospitality assistant</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Advanced</span>
                </div>
              </div>
            </Link>
            
            {/* Document Processing */}
            <Link href="/demo/etuna/document-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Document Processing</h3>
                <p className="text-sm text-nude-700">AI-powered document intelligence</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Advanced</span>
                </div>
              </div>
            </Link>
            
            {/* Predictive Analytics */}
            <Link href="/demo/etuna/predictive-demo" className="nude-card hover:shadow-nude transition-shadow group">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                  <TrendingUp className="w-8 h-8 text-emerald-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800 group-hover:text-nude-700">Predictive Analytics</h3>
                <p className="text-sm text-nude-700">AI-powered forecasting and optimization</p>
                <div className="mt-3">
                  <span className="badge badge-primary badge-sm">Advanced</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Platform Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Additional Platform Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Core Features */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Order Management</h3>
                <p className="text-sm text-nude-700">Restaurant & services</p>
              </div>
            </div>
            
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SparklesIcon className="w-8 h-8 text-red-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">AI Assistant</h3>
                <p className="text-sm text-nude-700">Smart concierge</p>
              </div>
            </div>
            
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-indigo-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Communications</h3>
                <p className="text-sm text-nude-700">Email automation</p>
              </div>
            </div>
            
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapIcon className="w-8 h-8 text-pink-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Location Services</h3>
                <p className="text-sm text-nude-700">Interactive maps</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Room Types</h2>
            <Link href="/demo/etuna/rooms" className="btn btn-outline">
              View All Rooms
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomTypes.slice(0, 3).map((room) => (
              <div key={room.room_type_id} className="nude-card">
                <figure className="relative h-48">
                  <Image
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
                    alt={room.type_name}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="badge badge-lg nude-button">
                      NAD {room.base_price_per_night}/night
                    </span>
                  </div>
                </figure>
                <div className="card-body">
                  <h3 className="card-title">{room.type_name}</h3>
                  <p className="text-nude-700 mb-4">{room.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-nude-700" />
                      <span className="text-sm">Capacity: {room.max_occupancy} guests</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="badge badge-outline badge-sm">{room.type_class}</span>
                      <span className="badge badge-outline badge-sm">{room.bed_type}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <Link href="/demo/etuna/rooms" className="btn btn-sm flex-1 nude-button">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Actions Section */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Explore the Platform</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Experience Card */}
              <div className="card bg-gradient-to-br from-primary to-secondary text-nude-700-content shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Users className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Customer Experience</h3>
                      <p className="text-nude-700-content/80">See how guests interact with the platform</p>
                    </div>
                  </div>
                  <p className="text-nude-700-content/90 mb-6">
                    Experience the guest journey from property discovery to booking completion. 
                    See our responsive design, real-time data, and seamless user experience.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Property browsing and room selection</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Service booking and ordering</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>AI assistant integration</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Mobile-responsive design</span>
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-6">
                    <Link href="/demo/etuna/rooms" className="btn btn-accent">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Explore Customer Journey
                    </Link>
                  </div>
                </div>
              </div>

              {/* Management Demo Card */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-primary text-nude-700-content flex items-center justify-center">
                        <Monitor className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Management Dashboard</h3>
                      <p className="text-nude-700">See the admin interface in action</p>
                    </div>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    Explore our comprehensive management interface with real-time data, 
                    analytics, and operational tools. See how property managers can 
                    efficiently run their business.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Real-time occupancy and revenue metrics</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Reservation and guest management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Order tracking and status updates</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Analytics and reporting</span>
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-6">
                    <Link href="/demo/etuna/management-demo" className="btn btn-primary">
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
        <div className="card bg-primary text-nude-700-content shadow-xl">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Phone className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Contact Buffr Host</h3>
                <p className="text-nude-700-content/80">Ready to see how Buffr Host can transform your hospitality business?</p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Schedule a Demo</h3>
                <p className="text-nude-700-content/80">Book a personalized demonstration of our platform</p>
              </div>
              <div className="text-center">
                <Globe className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Learn More</h3>
                <p className="text-nude-700-content/80">Visit our main website for more information</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}