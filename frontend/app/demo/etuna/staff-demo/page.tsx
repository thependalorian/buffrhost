import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  Award, 
  BarChart3, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  SparklesIcon,
  Monitor,
  Zap,
  Heart,
  Target,
  TrendingUp,
  UserCheck,
  FileText,
  CreditCard,
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
  Car
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Staff Management Demo - Buffr Host Platform',
  description: 'See how our comprehensive HR and staff management system streamlines scheduling, payroll, performance tracking, and team coordination.',
};

export default function StaffManagementDemoPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            🎯 <strong>Staff Management Demo</strong> - Complete HR solution for hospitality
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="mb-8">
              <Users className="w-24 h-24 mx-auto mb-4 opacity-90" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Staff Excellence</h1>
            <p className="text-xl md:text-2xl mb-6">Complete HR management for hospitality teams</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-accent btn-lg">
                <Calendar className="w-5 h-5 mr-2" />
                View Staff Schedule
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
        {/* Staff Management Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Comprehensive Staff Management</h2>
              <p className="text-lg text-base-content/80 mb-6">
                See how our integrated HR system manages everything from scheduling and payroll 
                to performance tracking and team coordination across all Etuna departments.
              </p>
              
              {/* Demo Staff Dashboard */}
              <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-xl mb-6">
                <h3 className="text-lg font-bold mb-4">Staff Overview</h3>
                <div className="space-y-4">
                  {/* Staff Status Indicators */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">A</span>
                      </div>
                      <div>
                        <p className="font-medium">Anna Smith</p>
                        <p className="text-sm text-gray-500">Restaurant Manager</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">On Duty</p>
                      <p className="text-xs text-gray-500">8:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">J</span>
                      </div>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-gray-500">Front Desk</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-600">Scheduled</p>
                      <p className="text-xs text-gray-500">2:00 PM - 10:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">M</span>
                      </div>
                      <div>
                        <p className="font-medium">Maria Garcia</p>
                        <p className="text-sm text-gray-500">Housekeeping</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-yellow-600">On Break</p>
                      <p className="text-xs text-gray-500">Back at 3:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Automated scheduling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Payroll management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Performance tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Team communication</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
                alt="Staff Management"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-semibold">Team Efficiency</p>
                    <p className="text-sm text-nude-700">+40% Improvement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Management Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Why Our Staff Management Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Automated Scheduling */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Automated Scheduling</h3>
                <p className="text-sm text-nude-700">AI-powered scheduling that considers availability, skills, and business needs.</p>
              </div>
            </div>
            
            {/* Payroll Management */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Payroll Management</h3>
                <p className="text-sm text-nude-700">Automated payroll processing with time tracking, overtime, and benefits.</p>
              </div>
            </div>
            
            {/* Performance Tracking */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-purple-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Performance Tracking</h3>
                <p className="text-sm text-nude-700">Track KPIs, goals, and performance metrics for continuous improvement.</p>
              </div>
            </div>
            
            {/* Team Communication */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-orange-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Team Communication</h3>
                <p className="text-sm text-nude-700">Built-in messaging, announcements, and shift change notifications.</p>
              </div>
            </div>
            
            {/* Training Management */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Training Management</h3>
                <p className="text-sm text-nude-700">Track certifications, training progress, and compliance requirements.</p>
              </div>
            </div>
            
            {/* Multi-department */}
            <div className="nude-card hover:shadow-nude transition-shadow">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-red-700" />
                </div>
                <h3 className="font-semibold mb-2 text-nude-800">Multi-department</h3>
                <p className="text-sm text-nude-700">Manage staff across restaurant, hotel, spa, tours, and all services.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Department Overview */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Department Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Restaurant Staff */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-orange-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Restaurant</h3>
                    <p className="text-sm text-nude-700">12 staff members</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Chefs</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Servers</span>
                    <span className="font-semibold">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hosts</span>
                    <span className="font-semibold">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Managers</span>
                    <span className="font-semibold">2</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hotel Staff */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bed className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Hotel</h3>
                    <p className="text-sm text-nude-700">8 staff members</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Front Desk</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Housekeeping</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maintenance</span>
                    <span className="font-semibold">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Concierge</span>
                    <span className="font-semibold">1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tours & Activities */}
            <div className="nude-card">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Tours & Activities</h3>
                    <p className="text-sm text-nude-700">5 staff members</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tour Guides</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Drivers</span>
                    <span className="font-semibold">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Activity Coordinators</span>
                    <span className="font-semibold">1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-nude-800">Key Staff Management Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Scheduling */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-nude-700">AI-powered scheduling that optimizes coverage, reduces overtime, and respects preferences.</p>
            </div>

            {/* Time Tracking */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary text-secondary-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Time Tracking</h3>
              <p className="text-nude-700">Accurate time tracking with clock-in/out, break management, and overtime calculations.</p>
            </div>

            {/* Performance */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-accent-content rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Management</h3>
              <p className="text-nude-700">Track goals, reviews, recognition, and career development for each team member.</p>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Experience Complete Staff Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Staff Experience */}
              <div className="card bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Users className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Staff Experience</h3>
                      <p className="text-white/80">See how our system empowers your team</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6">
                    Experience how our staff management system improves team coordination, 
                    simplifies scheduling, and provides clear communication channels. 
                    See how staff can access schedules, request time off, and track performance.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Mobile schedule access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Shift swapping</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Time off requests</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Performance tracking</span>
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
                      <h3 className="text-2xl font-bold">Management Dashboard</h3>
                      <p className="text-nude-700">See how HR management drives efficiency</p>
                    </div>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    Explore our comprehensive staff management dashboard. 
                    Schedule shifts, track performance, manage payroll, 
                    and coordinate teams across all departments.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Automated scheduling optimization</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Payroll automation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Performance analytics</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Team communication tools</span>
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
                <h3 className="font-bold text-lg mb-2">Ready to Streamline?</h3>
                <p className="text-primary-content/80">Contact us to implement comprehensive staff management that improves efficiency.</p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Schedule a Demo</h3>
                <p className="text-primary-content/80">Book a personalized demonstration of our staff management system.</p>
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