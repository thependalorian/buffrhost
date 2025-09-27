import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  TrendingDown, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  DollarSign,
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
  Zap,
  Heart,
  Target,
  ShoppingBag,
  Calendar,
  MessageCircle,
  ArrowRight,
  Plus,
  Minus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Inventory Management Demo - Buffr Host Platform',
  description: 'See how our AI-powered inventory management system reduces waste, prevents stockouts, and optimizes costs across all hospitality services.',
};

export default function InventoryDemoPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            🎯 <strong>Inventory Management Demo</strong> - AI-powered stock optimization
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-green-600 to-blue-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <Package className="w-24 h-24 mx-auto mb-4 opacity-90" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Smart Inventory</h1>
            <p className="text-xl md:text-2xl mb-6">AI-powered stock management that saves money</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-accent btn-lg">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Live Dashboard
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
        {/* Inventory Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Real-Time Inventory Control</h2>
              <p className="text-lg text-base-content/80 mb-6">
                See how our AI-powered inventory management system automatically tracks stock levels, 
                predicts demand, and prevents costly stockouts across all Etuna services.
              </p>
              
              {/* Demo Inventory Dashboard */}
              <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-xl mb-6">
                <h3 className="text-lg font-bold mb-4">Live Inventory Status</h3>
                <div className="space-y-4">
                  {/* Stock Level Indicators */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium">Chicken Breast</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">In Stock</p>
                      <p className="text-xs text-gray-500">45 units</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium">Rice</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-yellow-600">Low Stock</p>
                      <p className="text-xs text-gray-500">8 units</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span className="font-medium">Tomatoes</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-600">Out of Stock</p>
                      <p className="text-xs text-gray-500">0 units</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Real-time stock tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>AI demand forecasting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Automated reorder alerts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Waste reduction analytics</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
                alt="Inventory Management"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-semibold">Cost Savings</p>
                    <p className="text-sm text-nude-700">25% Reduction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Why Smart Inventory Management Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cost Reduction */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Cost Reduction</h3>
                <p className="text-sm text-nude-700">Reduce waste by up to 30% with AI-powered demand forecasting and optimal ordering.</p>
              </div>
            </div>
            
            {/* Prevent Stockouts */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Prevent Stockouts</h3>
                <p className="text-sm text-nude-700">Never run out of popular items with intelligent reorder alerts and safety stock management.</p>
              </div>
            </div>
            
            {/* Real-time Tracking */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Real-time Tracking</h3>
                <p className="text-sm text-nude-700">Monitor stock levels across all locations in real-time with automatic updates.</p>
              </div>
            </div>
            
            {/* Multi-location */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Multi-location</h3>
                <p className="text-sm text-nude-700">Manage inventory across restaurant, hotel, spa, and all hospitality services.</p>
              </div>
            </div>
            
            {/* Analytics */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-orange-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Advanced Analytics</h3>
                <p className="text-sm text-nude-700">Get insights on usage patterns, seasonal trends, and optimization opportunities.</p>
              </div>
            </div>
            
            {/* Automation */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Automation</h3>
                <p className="text-sm text-nude-700">Automated reordering, supplier integration, and workflow optimization.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Categories */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Comprehensive Inventory Management</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Restaurant Inventory */}
            <div className="nude-card">
              <div className="card-body">
                <h3 className="card-title text-xl mb-4">Restaurant Inventory</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-primary" />
                      <span className="font-medium">Food Ingredients</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">245 items</p>
                      <p className="text-xs text-gray-500">95% in stock</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-secondary" />
                      <span className="font-medium">Beverages</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">89 items</p>
                      <p className="text-xs text-gray-500">100% in stock</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-accent" />
                      <span className="font-medium">Supplies</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-yellow-600">156 items</p>
                      <p className="text-xs text-gray-500">87% in stock</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hotel Inventory */}
            <div className="nude-card">
              <div className="card-body">
                <h3 className="card-title text-xl mb-4">Hotel Inventory</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-primary" />
                      <span className="font-medium">Room Amenities</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">78 items</p>
                      <p className="text-xs text-gray-500">92% in stock</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-secondary" />
                      <span className="font-medium">Cleaning Supplies</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">45 items</p>
                      <p className="text-xs text-gray-500">88% in stock</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-accent" />
                      <span className="font-medium">Maintenance</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-yellow-600">67 items</p>
                      <p className="text-xs text-gray-500">76% in stock</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">AI-Powered Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Demand Forecasting */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Demand Forecasting</h3>
              <p className="text-nude-700">AI predicts future demand based on historical data, seasonality, and trends.</p>
            </div>

            {/* Smart Reordering */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary text-secondary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Reordering</h3>
              <p className="text-nude-700">Automatically generate purchase orders when stock levels reach optimal reorder points.</p>
            </div>

            {/* Waste Reduction */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-accent-content rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Waste Reduction</h3>
              <p className="text-nude-700">Identify slow-moving items and suggest promotions to reduce waste and costs.</p>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Experience Smart Inventory Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Experience */}
              <div className="card bg-gradient-to-br from-green-500 to-blue-500 text-white shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Package className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Operational Efficiency</h3>
                      <p className="text-white/80">See how inventory optimization improves operations</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6">
                    Experience how our inventory management system streamlines operations, 
                    reduces costs, and ensures you never run out of essential items. 
                    See real-time tracking and AI-powered insights in action.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Real-time stock monitoring</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Automated reorder alerts</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Cost optimization insights</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Waste reduction analytics</span>
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
                        <BarChart3 className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Management Dashboard</h3>
                      <p className="text-nude-700">See how inventory drives business success</p>
                    </div>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    Explore our comprehensive inventory management dashboard. 
                    Track stock levels, analyze usage patterns, optimize ordering, 
                    and reduce costs with AI-powered insights.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Multi-location inventory tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>AI demand forecasting</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Automated supplier integration</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Cost optimization analytics</span>
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
                <p className="text-primary-content/80">Contact us to implement smart inventory management that reduces costs.</p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Schedule a Demo</h3>
                <p className="text-primary-content/80">Book a personalized demonstration of our inventory management system.</p>
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