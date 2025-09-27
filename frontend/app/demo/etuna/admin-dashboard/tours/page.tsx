/**
 * Etuna Tours & Activities Management
 * 
 * Comprehensive tour booking and activity scheduling for Etuna Guesthouse
 * Features tour packages, booking management, and activity coordination
 */

import { Metadata } from 'next';
import Link from 'next/link';
import {
  Car,
  MapPin,
  Clock,
  Users,
  Star,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  ArrowLeft,
  Plus,
  Edit,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
  Camera,
  Compass,
  Mountain,
  TreePine,
  Sun,
  Moon,
  Heart,
  Award,
  Target,
  Zap,
  Globe,
  Navigation,
  BarChart,
  Settings
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Etuna Guesthouse - Tours & Activities',
  description: 'Tour booking and activity management for Etuna Guesthouse',
};

interface Tour {
  id: string;
  name: string;
  type: 'safari' | 'cultural' | 'adventure' | 'nature' | 'heritage';
  duration: string;
  price: number;
  maxParticipants: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Active' | 'Inactive' | 'Seasonal';
  description: string;
  highlights: string[];
  includes: string[];
  requirements: string[];
  bestTime: string;
  image: string;
}

interface TourBooking {
  id: string;
  tourName: string;
  guestName: string;
  date: string;
  participants: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  totalAmount: number;
  specialRequests: string;
}

const mockTours: Tour[] = [
  {
    id: 'T001',
    name: 'Etosha National Park Safari',
    type: 'safari',
    duration: 'Full Day (8-10 hours)',
    price: 1200,
    maxParticipants: 8,
    difficulty: 'Medium',
    status: 'Active',
    description: 'Experience the world-renowned Etosha National Park with our professional guides. Spot the Big Five and other incredible wildlife in their natural habitat.',
    highlights: ['Big Five wildlife viewing', 'Professional guide', 'Park entry fees included', 'Lunch and refreshments'],
    includes: ['Transportation', 'Professional guide', 'Park fees', 'Lunch', 'Bottled water'],
    requirements: ['Comfortable walking shoes', 'Camera', 'Sunscreen', 'Hat'],
    bestTime: 'May - October (Dry season)',
    image: '/images/etosha-safari.jpg'
  },
  {
    id: 'T002',
    name: 'Himba Tribes Experience',
    type: 'cultural',
    duration: 'Full Day',
    price: 1500,
    maxParticipants: 6,
    difficulty: 'Easy',
    status: 'Active',
    description: 'Immerse yourself in the rich cultural heritage of the Himba people. Learn about their traditions, customs, and way of life.',
    highlights: ['Cultural immersion', 'Traditional village visit', 'Local guide', 'Cultural exchange'],
    includes: ['Transportation', 'Cultural guide', 'Village fees', 'Traditional meal'],
    requirements: ['Respectful attitude', 'Camera (with permission)', 'Open mind'],
    bestTime: 'Year-round',
    image: '/images/himba-experience.jpg'
  },
  {
    id: 'T003',
    name: 'Ruacana Falls Tour',
    type: 'nature',
    duration: 'Half Day (4-5 hours)',
    price: 800,
    maxParticipants: 6,
    difficulty: 'Easy',
    status: 'Seasonal',
    description: 'Discover the spectacular Ruacana Falls, one of Namibia\'s most impressive natural wonders. Best viewed after the rainy season.',
    highlights: ['Spectacular waterfall', 'Natural beauty', 'Photography opportunities', 'Scenic drive'],
    includes: ['Transportation', 'Guide', 'Park fees', 'Light refreshments'],
    requirements: ['Comfortable shoes', 'Camera', 'Water bottle'],
    bestTime: 'March - May (After rains)',
    image: '/images/ruacana-falls.jpg'
  },
  {
    id: 'T004',
    name: 'Omhedi Palace Tour',
    type: 'heritage',
    duration: 'Half Day',
    price: 600,
    maxParticipants: 10,
    difficulty: 'Easy',
    status: 'Active',
    description: 'Explore the historical Omhedi Palace and learn about the rich cultural heritage of the region.',
    highlights: ['Historical significance', 'Cultural heritage', 'Local history', 'Architectural beauty'],
    includes: ['Transportation', 'Historical guide', 'Entrance fees', 'Cultural insights'],
    requirements: ['Comfortable walking', 'Interest in history'],
    bestTime: 'Year-round',
    image: '/images/omhedi-palace.jpg'
  },
  {
    id: 'T005',
    name: 'Baobab Tree Heritage Tour',
    type: 'nature',
    duration: 'Half Day',
    price: 400,
    maxParticipants: 8,
    difficulty: 'Easy',
    status: 'Active',
    description: 'Visit ancient Baobab trees and learn about their cultural and ecological significance in local folklore.',
    highlights: ['Ancient trees', 'Local folklore', 'Natural heritage', 'Photography'],
    includes: ['Transportation', 'Nature guide', 'Cultural stories', 'Light refreshments'],
    requirements: ['Comfortable walking', 'Camera'],
    bestTime: 'Year-round',
    image: '/images/baobab-trees.jpg'
  },
  {
    id: 'T006',
    name: 'Sossusvlei Dunes Tour',
    type: 'adventure',
    duration: '2 Days, 1 Night',
    price: 1800,
    maxParticipants: 6,
    difficulty: 'Hard',
    status: 'Active',
    description: 'Experience the world-famous red sand dunes of Sossusvlei. A once-in-a-lifetime adventure in the Namib Desert.',
    highlights: ['Red sand dunes', 'Desert adventure', 'Sunrise/sunset views', 'Photography paradise'],
    includes: ['Transportation', 'Accommodation', 'Meals', 'Professional guide', 'Park fees'],
    requirements: ['Good fitness level', 'Camera', 'Warm clothing', 'Adventure spirit'],
    bestTime: 'April - September',
    image: '/images/sossusvlei-dunes.jpg'
  }
];

const mockBookings: TourBooking[] = [
  {
    id: 'TB001',
    tourName: 'Etosha National Park Safari',
    guestName: 'John Smith',
    date: '2024-01-20',
    participants: 2,
    status: 'Confirmed',
    totalAmount: 2400,
    specialRequests: 'Vegetarian lunch required'
  },
  {
    id: 'TB002',
    tourName: 'Himba Tribes Experience',
    guestName: 'Maria Garcia',
    date: '2024-01-22',
    participants: 4,
    status: 'Pending',
    totalAmount: 6000,
    specialRequests: 'English speaking guide preferred'
  },
  {
    id: 'TB003',
    tourName: 'Ruacana Falls Tour',
    guestName: 'Ahmed Hassan',
    date: '2024-01-25',
    participants: 3,
    status: 'Completed',
    totalAmount: 2400,
    specialRequests: 'Early morning departure'
  }
];

export default function EtunaToursPage() {
  const getTourTypeIcon = (type: string) => {
    switch (type) {
      case 'safari': return Car;
      case 'cultural': return Heart;
      case 'adventure': return Mountain;
      case 'nature': return TreePine;
      case 'heritage': return Award;
      default: return Compass;
    }
  };

  const getTourTypeColor = (type: string) => {
    switch (type) {
      case 'safari': return 'bg-orange-100 text-orange-800';
      case 'cultural': return 'bg-purple-100 text-purple-800';
      case 'adventure': return 'bg-red-100 text-red-800';
      case 'nature': return 'bg-green-100 text-green-800';
      case 'heritage': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header - Mobile Responsive */}
      <div className="bg-primary text-primary-content py-3 sm:py-4">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href="/protected/etuna/dashboard" className="btn btn-ghost text-primary-content hover:nude-card/20 btn-sm sm:btn-md">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <div className="flex items-center space-x-3">
                <Car className="w-6 h-6 sm:w-8 sm:h-8" />
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold">Tours & Activities</h1>
                  <p className="text-primary-content/80 text-xs sm:text-sm">Manage tour bookings and activities</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="btn btn-sm sm:btn-md nude-card/20 hover:nude-card/30 text-primary-content">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add New Tour</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Responsive */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Stats Cards - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-nude-700">Active Tours</p>
                <p className="text-xl sm:text-2xl font-bold text-nude-800">6</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Car className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-green-600 font-medium">+2 this month</span>
            </div>
          </div>

          <div className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-nude-700">Bookings Today</p>
                <p className="text-xl sm:text-2xl font-bold text-nude-800">3</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-gray-500">2 confirmed, 1 pending</span>
            </div>
          </div>

          <div className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-nude-700">Revenue This Month</p>
                <p className="text-xl sm:text-2xl font-bold text-nude-800">N$18,400</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-green-600 font-medium">+15% from last month</span>
            </div>
          </div>

          <div className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-nude-700">Guest Satisfaction</p>
                <p className="text-xl sm:text-2xl font-bold text-nude-800">4.9/5</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-green-600 font-medium">Excellent reviews</span>
            </div>
          </div>
        </div>

        {/* Tour Packages - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-nude-800 mb-2 sm:mb-0">Tour Packages</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tours..."
                  className="input input-bordered input-sm w-full sm:w-64"
                />
              </div>
              <select className="select select-bordered select-sm">
                <option>All Types</option>
                <option>Safari</option>
                <option>Cultural</option>
                <option>Adventure</option>
                <option>Nature</option>
                <option>Heritage</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {mockTours.map((tour) => {
              const IconComponent = getTourTypeIcon(tour.type);
              return (
                <div key={tour.id} className="nude-card rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <IconComponent className="h-16 w-16 text-white" />
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-nude-800 mb-1">
                          {tour.name}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTourTypeColor(tour.type)}`}>
                            {tour.type.charAt(0).toUpperCase() + tour.type.slice(1)}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            tour.status === 'Active' ? 'bg-green-100 text-green-800' : 
                            tour.status === 'Seasonal' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {tour.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-nude-700 mb-4 line-clamp-2">
                      {tour.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Max {tour.maxParticipants} participants</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>N${tour.price.toLocaleString()} per person</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button className="btn btn-sm btn-outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button className="btn btn-sm btn-outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-nude-800">N${tour.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Bookings - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-nude-800 mb-4">Recent Bookings</h2>
          <div className="nude-card rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Tour
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="nude-card divide-y divide-gray-200">
                  {mockBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm font-medium text-nude-800">
                        {booking.tourName}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {booking.guestName}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {booking.date}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {booking.participants}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-nude-800">
                        N${booking.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link href="/protected/etuna/tours" className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-nude-800 group-hover:text-blue-600">
                  Add New Tour
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Create a new tour package
                </p>
              </div>
            </div>
          </Link>

          <Link href="/protected/etuna/tours" className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-nude-800 group-hover:text-green-600">
                  Manage Bookings
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  View and manage tour bookings
                </p>
              </div>
            </div>
          </Link>

          <Link href="/protected/etuna/tours" className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-nude-800 group-hover:text-purple-600">
                  Tour Analytics
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  View tour performance metrics
                </p>
              </div>
            </div>
          </Link>

          <Link href="/protected/etuna/tours" className="nude-card rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-nude-800 group-hover:text-orange-600">
                  Tour Settings
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Configure tour options
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
