/**
 * Etuna Communications & Email Management
 * 
 * Comprehensive communication management for Etuna Guesthouse
 * Features email automation, guest communications, and notification management
 * Based on backend email routes functionality
 */

import { Metadata } from 'next';
import Link from 'next/link';
import {
  Mail,
  MessageSquare,
  Bell,
  Send,
  Inbox,
  Archive,
  Trash2,
  Star,
  Filter,
  Search,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Settings,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowLeft,
  RefreshCw,
  Zap,
  Target,
  Heart,
  Award,
  Globe,
  Shield,
  Lock,
  Database,
  Network,
  Cpu,
  Activity,
  Play,
  Pause,
  Square,
  RotateCcw,
  Phone,
  Mail as MailIcon,
  MessageCircle,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  Video,
  FileText,
  Image,
  Paperclip,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  ThumbsDown,
  Share,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  MoreVertical
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Etuna Guesthouse - Communications',
  description: 'Communication management and email automation for Etuna Guesthouse',
};

interface EmailTemplate {
  id: string;
  name: string;
  type: 'booking_confirmation' | 'check_in_reminder' | 'check_out_reminder' | 'cancellation' | 'marketing' | 'newsletter';
  subject: string;
  status: 'active' | 'inactive' | 'draft';
  lastUsed: string;
  openRate: number;
  clickRate: number;
  recipients: number;
}

interface EmailCampaign {
  id: string;
  name: string;
  type: 'marketing' | 'newsletter' | 'promotional' | 'announcement';
  status: 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  scheduledDate: string;
  subject: string;
}

interface GuestCommunication {
  id: string;
  guestName: string;
  email: string;
  type: 'booking' | 'support' | 'feedback' | 'complaint' | 'inquiry';
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  lastMessage: string;
  timestamp: string;
  assignedTo: string;
}

const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 'T001',
    name: 'Booking Confirmation',
    type: 'booking_confirmation',
    subject: 'Your Etuna Guesthouse Booking Confirmation',
    status: 'active',
    lastUsed: '2024-01-15',
    openRate: 94.2,
    clickRate: 23.1,
    recipients: 1247
  },
  {
    id: 'T002',
    name: 'Check-in Reminder',
    type: 'check_in_reminder',
    subject: 'Your Stay at Etuna Guesthouse Starts Tomorrow',
    status: 'active',
    lastUsed: '2024-01-14',
    openRate: 89.7,
    clickRate: 18.4,
    recipients: 892
  },
  {
    id: 'T003',
    name: 'Check-out Reminder',
    type: 'check_out_reminder',
    subject: 'Thank You for Staying at Etuna Guesthouse',
    status: 'active',
    lastUsed: '2024-01-13',
    openRate: 91.3,
    clickRate: 21.7,
    recipients: 756
  },
  {
    id: 'T004',
    name: 'Cancellation Notice',
    type: 'cancellation',
    subject: 'Your Booking Cancellation - Etuna Guesthouse',
    status: 'active',
    lastUsed: '2024-01-12',
    openRate: 87.5,
    clickRate: 15.2,
    recipients: 234
  },
  {
    id: 'T005',
    name: 'Monthly Newsletter',
    type: 'newsletter',
    subject: 'Etuna Guesthouse Monthly Newsletter',
    status: 'active',
    lastUsed: '2024-01-01',
    openRate: 76.8,
    clickRate: 12.4,
    recipients: 2156
  },
  {
    id: 'T006',
    name: 'Special Promotion',
    type: 'marketing',
    subject: 'Exclusive Offer - 20% Off Your Next Stay',
    status: 'draft',
    lastUsed: 'Never',
    openRate: 0,
    clickRate: 0,
    recipients: 0
  }
];

const mockEmailCampaigns: EmailCampaign[] = [
  {
    id: 'C001',
    name: 'New Year Promotion',
    type: 'promotional',
    status: 'sent',
    recipients: 2156,
    sent: 2156,
    opened: 1654,
    clicked: 387,
    scheduledDate: '2024-01-01',
    subject: 'Start 2024 with Etuna Guesthouse - Special Rates Available'
  },
  {
    id: 'C002',
    name: 'Valentine\'s Day Special',
    type: 'marketing',
    status: 'scheduled',
    recipients: 1890,
    sent: 0,
    opened: 0,
    clicked: 0,
    scheduledDate: '2024-02-10',
    subject: 'Romantic Getaway at Etuna Guesthouse'
  },
  {
    id: 'C003',
    name: 'Easter Newsletter',
    type: 'newsletter',
    status: 'sending',
    recipients: 2156,
    sent: 1234,
    opened: 987,
    clicked: 234,
    scheduledDate: '2024-03-25',
    subject: 'Easter Celebrations at Etuna Guesthouse'
  }
];

const mockGuestCommunications: GuestCommunication[] = [
  {
    id: 'GC001',
    guestName: 'John Smith',
    email: 'john.smith@email.com',
    type: 'booking',
    status: 'resolved',
    priority: 'medium',
    subject: 'Room upgrade request',
    lastMessage: 'Thank you for your request. We have upgraded you to a deluxe room.',
    timestamp: '2024-01-15 14:30',
    assignedTo: 'Sarah Johnson'
  },
  {
    id: 'GC002',
    guestName: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    type: 'support',
    status: 'in_progress',
    priority: 'high',
    subject: 'WiFi connection issues',
    lastMessage: 'We are investigating the WiFi issue in your room.',
    timestamp: '2024-01-15 16:45',
    assignedTo: 'Mike Wilson'
  },
  {
    id: 'GC003',
    guestName: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    type: 'feedback',
    status: 'new',
    priority: 'low',
    subject: 'Excellent service experience',
    lastMessage: 'Thank you for the wonderful feedback!',
    timestamp: '2024-01-15 18:20',
    assignedTo: 'Unassigned'
  },
  {
    id: 'GC004',
    guestName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    type: 'complaint',
    status: 'new',
    priority: 'urgent',
    subject: 'Noise complaint from neighboring room',
    lastMessage: 'We apologize for the inconvenience. We are addressing this immediately.',
    timestamp: '2024-01-15 20:15',
    assignedTo: 'Unassigned'
  }
];

export default function EtunaCommunicationsPage() {
  const getTemplateTypeIcon = (type: string) => {
    switch (type) {
      case 'booking_confirmation': return CheckCircle;
      case 'check_in_reminder': return Calendar;
      case 'check_out_reminder': return Clock;
      case 'cancellation': return AlertCircle;
      case 'marketing': return Target;
      case 'newsletter': return Mail;
      default: return Mail;
    }
  };

  const getTemplateTypeColor = (type: string) => {
    switch (type) {
      case 'booking_confirmation': return 'bg-green-100 text-green-800';
      case 'check_in_reminder': return 'bg-blue-100 text-blue-800';
      case 'check_out_reminder': return 'bg-purple-100 text-purple-800';
      case 'cancellation': return 'bg-red-100 text-red-800';
      case 'marketing': return 'bg-orange-100 text-orange-800';
      case 'newsletter': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sending': return 'bg-orange-100 text-orange-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
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
              <Link href="/protected/etuna/dashboard" className="btn btn-ghost text-primary-content hover:bg-white/20 btn-sm sm:btn-md">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 sm:w-8 sm:h-8" />
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold">Communications</h1>
                  <p className="text-primary-content/80 text-xs sm:text-sm">Email automation and guest communications</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="btn btn-sm sm:btn-md bg-white/20 hover:bg-white/30 text-primary-content">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">New Email</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Responsive */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Stats Cards - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Emails Sent Today</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">247</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Send className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-green-600 font-medium">+12% from yesterday</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Open Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">89.2%</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-green-600 font-medium">+2.1% from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Click Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">23.4%</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-green-600 font-medium">+1.8% from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Messages</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Inbox className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-gray-500">4 urgent, 8 normal</span>
            </div>
          </div>
        </div>

        {/* Email Templates - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-0">Email Templates</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="input input-bordered input-sm w-full sm:w-64"
                />
              </div>
              <select className="select select-bordered select-sm">
                <option>All Types</option>
                <option>Booking</option>
                <option>Marketing</option>
                <option>Newsletter</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {mockEmailTemplates.map((template) => {
              const IconComponent = getTemplateTypeIcon(template.type);
              return (
                <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                        {template.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTemplateTypeColor(template.type)}`}>
                          {template.type.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(template.status)}`}>
                          {template.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {template.subject}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Open Rate</span>
                      <span className="font-medium text-gray-900">{template.openRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Click Rate</span>
                      <span className="font-medium text-gray-900">{template.clickRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Recipients</span>
                      <span className="font-medium text-gray-900">{template.recipients.toLocaleString()}</span>
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
                      <p className="text-xs text-gray-500">Last used: {template.lastUsed}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Email Campaigns - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Email Campaigns</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Open Rate
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Click Rate
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockEmailCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-xs text-gray-500">{campaign.subject}</div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                        {campaign.recipients.toLocaleString()}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                        {campaign.recipients > 0 ? ((campaign.opened / campaign.recipients) * 100).toFixed(1) : 0}%
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                        {campaign.recipients > 0 ? ((campaign.clicked / campaign.recipients) * 100).toFixed(1) : 0}%
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {campaign.scheduledDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Guest Communications - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Guest Communications</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Last Message
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockGuestCommunications.map((communication) => (
                    <tr key={communication.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900">{communication.guestName}</div>
                          <div className="text-xs text-gray-500">{communication.email}</div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {communication.type}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(communication.priority)}`}>
                          {communication.priority}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(communication.status)}`}>
                          {communication.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {communication.assignedTo}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <div className="min-w-0">
                          <div className="text-sm text-gray-900 truncate">{communication.lastMessage}</div>
                          <div className="text-xs text-gray-500">{communication.timestamp}</div>
                        </div>
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
          <Link href="/protected/etuna/communications" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-blue-600">
                  New Email Template
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Create a new email template
                </p>
              </div>
            </div>
          </Link>

          <Link href="/protected/etuna/communications" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Send className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-green-600">
                  Send Campaign
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Launch email campaign
                </p>
              </div>
            </div>
          </Link>

          <Link href="/protected/etuna/communications" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-purple-600">
                  Guest Messages
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Manage guest communications
                </p>
              </div>
            </div>
          </Link>

          <Link href="/protected/etuna/communications" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-orange-600">
                  Email Settings
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Configure email options
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
