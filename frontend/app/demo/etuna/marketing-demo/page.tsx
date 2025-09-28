'use client';

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader, StatCard, ActionButton, ModalForm, FormField, FormSelect, Alert } from '@/src/components/ui';
import { useState } from 'react';
import { 
  Megaphone, 
  Mail, 
  Target, 
  BarChart3, 
  Users, 
  Calendar, 
  Clock, 
  DollarSign,
  Star,
  MapPin,
  Phone,
  Globe,
  Award,
  SparklesIcon,
  Monitor,
  Shield,
  Zap,
  Heart,
  TrendingUp,
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
  Receipt,
  Banknote,
  Coins,
  ArrowRight,
  CheckCircle,
  Send,
  Eye as EyeIcon,
  MousePointer,
  UserPlus,
  Gift,
  Percent,
  Activity,
  PieChart,
  LineChart,
  Rocket
} from 'lucide-react';

export default function MarketingAutomationDemoPage() {
  const [showLaunchModal, setShowLaunchModal] = useState(false);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            🎯 <strong>Marketing Automation Demo</strong> - AI-powered customer engagement
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-pink-600 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <Megaphone className="w-24 h-24 mx-auto mb-4 opacity-90" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Marketing Revolution</h1>
            <p className="text-xl md:text-2xl mb-6">AI-powered campaigns that drive results</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowLaunchModal(true)}
                className="btn btn-accent btn-lg"
              >
                <Target className="w-5 h-5 mr-2" />
                Launch Campaign
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
        {/* Marketing Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Intelligent Marketing Automation</h2>
              <p className="text-lg text-base-content/80 mb-6">
                See how our AI-powered marketing system creates personalized campaigns, 
                automates customer communications, and drives revenue growth across all Etuna services.
              </p>
              
              {/* Demo Campaign Dashboard */}
              <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-xl mb-6">
                <h3 className="text-lg font-bold mb-4">Active Campaigns</h3>
                <div className="space-y-4">
                  {/* Campaign Examples */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Welcome Series</p>
                        <p className="text-sm text-gray-500">New guest onboarding</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">Active</p>
                      <p className="text-xs text-gray-500">85% open rate</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Gift className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Birthday Offers</p>
                        <p className="text-sm text-gray-500">Personalized rewards</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-600">Active</p>
                      <p className="text-xs text-gray-500">92% engagement</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Re-engagement</p>
                        <p className="text-sm text-gray-500">Win-back campaign</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-purple-600">Active</p>
                      <p className="text-xs text-gray-500">67% response rate</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>AI-powered campaign creation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Personalized messaging</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Automated workflows</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Performance optimization</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
                alt="Marketing Automation"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-semibold">Revenue Growth</p>
                    <p className="text-sm text-nude-700">+45% Increase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Why Our Marketing Automation Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI-Powered Campaigns */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SparklesIcon className="w-8 h-8 text-pink-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">AI-Powered Campaigns</h3>
                <p className="text-sm text-nude-700">Automatically create and optimize campaigns based on customer behavior and preferences.</p>
              </div>
            </div>
            
            {/* Personalized Messaging */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Personalized Messaging</h3>
                <p className="text-sm text-nude-700">Send targeted messages based on individual customer preferences and behavior patterns.</p>
              </div>
            </div>
            
            {/* Automated Workflows */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Automated Workflows</h3>
                <p className="text-sm text-nude-700">Set up complex marketing workflows that trigger based on customer actions and events.</p>
              </div>
            </div>
            
            {/* Multi-Channel */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Megaphone className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Multi-Channel</h3>
                <p className="text-sm text-nude-700">Reach customers through email, SMS, push notifications, and social media.</p>
              </div>
            </div>
            
            {/* Performance Analytics */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-orange-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Performance Analytics</h3>
                <p className="text-sm text-nude-700">Track campaign performance, ROI, and customer engagement metrics.</p>
              </div>
            </div>
            
            {/* Customer Segmentation */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Customer Segmentation</h3>
                <p className="text-sm text-nude-700">Automatically segment customers based on behavior, preferences, and value.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Types */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Campaign Types & Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Welcome Series */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Welcome Series</h3>
                    <p className="text-sm text-nude-700">New customer onboarding</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Open Rate</span>
                    <span className="font-semibold text-green-600">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Click Rate</span>
                    <span className="font-semibold text-green-600">42%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion</span>
                    <span className="font-semibold text-green-600">28%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Birthday Campaigns */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Gift className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Birthday Offers</h3>
                    <p className="text-sm text-nude-700">Personalized rewards</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Open Rate</span>
                    <span className="font-semibold text-purple-600">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Click Rate</span>
                    <span className="font-semibold text-purple-600">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Redemption</span>
                    <span className="font-semibold text-purple-600">89%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Re-engagement */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Re-engagement</h3>
                    <p className="text-sm text-nude-700">Win-back campaigns</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Open Rate</span>
                    <span className="font-semibold text-orange-600">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Click Rate</span>
                    <span className="font-semibold text-orange-600">34%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Return Rate</span>
                    <span className="font-semibold text-orange-600">23%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">AI-Powered Marketing Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Smart Segmentation */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Segmentation</h3>
              <p className="text-nude-700">AI automatically segments customers based on behavior, preferences, and value to create targeted campaigns.</p>
            </div>

            {/* Content Generation */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary text-secondary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Content Generation</h3>
              <p className="text-nude-700">AI generates personalized email content, subject lines, and offers based on customer data and preferences.</p>
            </div>

            {/* Optimal Timing */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-accent-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Optimal Timing</h3>
              <p className="text-nude-700">AI determines the best time to send messages to each customer for maximum engagement and response.</p>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Experience Marketing Automation</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Experience */}
              <div className="card bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Mail className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Customer Experience</h3>
                      <p className="text-white/80">See how personalized marketing improves engagement</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6">
                    Experience how our marketing automation creates personalized, 
                    timely communications that customers actually want to receive. 
                    From welcome emails to birthday offers, see the difference personalization makes.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Personalized email campaigns</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Timely birthday offers</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Behavior-based triggers</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Multi-channel messaging</span>
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
                        <BarChart3 className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Management Dashboard</h3>
                      <p className="text-nude-700">See how marketing drives business growth</p>
                    </div>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    Explore our comprehensive marketing management dashboard. 
                    Create campaigns, track performance, analyze customer behavior, 
                    and optimize your marketing ROI with AI-powered insights.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Campaign creation and management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Performance analytics and ROI tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Customer segmentation tools</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Automated workflow builder</span>
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
                <p className="text-primary-content/80">Contact us to implement marketing automation that drives growth.</p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Schedule a Demo</h3>
                <p className="text-primary-content/80">Book a personalized demonstration of our marketing automation system.</p>
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

      {/* Launch Campaign Modal */}
      {showLaunchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold mb-4">Launch Marketing Campaign</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Campaign launched successfully! Your marketing automation is now active.');
              setShowLaunchModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Campaign Name</label>
                  <input type="text" required className="input input-bordered w-full" placeholder="Enter campaign name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Campaign Objective</label>
                  <select className="select select-bordered w-full" required>
                    <option value="">Select objective</option>
                    <option value="awareness">Brand Awareness</option>
                    <option value="engagement">Customer Engagement</option>
                    <option value="conversion">Lead Conversion</option>
                    <option value="retention">Customer Retention</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Target Audience</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="checkbox mr-2" defaultChecked />
                      Past Guests
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="checkbox mr-2" />
                      Corporate Contacts
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="checkbox mr-2" />
                      Engaged Couples
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="checkbox mr-2" />
                      Families
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Campaign Channels</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="checkbox mr-2" defaultChecked />
                      Email Marketing
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="checkbox mr-2" />
                      Social Media
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="checkbox mr-2" />
                      SMS Marketing
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="checkbox mr-2" />
                      Push Notifications
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Budget (NAD)</label>
                  <input type="number" min="0" className="input input-bordered w-full" placeholder="Enter campaign budget" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Campaign Duration</label>
                  <select className="select select-bordered w-full" required>
                    <option value="">Select duration</option>
                    <option value="1-week">1 Week</option>
                    <option value="2-weeks">2 Weeks</option>
                    <option value="1-month">1 Month</option>
                    <option value="3-months">3 Months</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn btn-accent flex-1">
                  <Rocket className="w-4 h-4 mr-2" />
                  Launch Campaign
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowLaunchModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
