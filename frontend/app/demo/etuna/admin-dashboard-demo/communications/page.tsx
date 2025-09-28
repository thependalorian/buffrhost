'use client';

import Link from 'next/link';
import { ModalForm, FormField, FormSelect, FormTextarea, ActionButton, DataTable, Alert } from '@/src/components/ui';
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
import { useState } from 'react';

export default function EtunaCommunicationsPage() {
  const [showNewEmailModal, setShowNewEmailModal] = useState(false);
  const [showSendBroadcastModal, setShowSendBroadcastModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

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
              <Link href="/demo/etuna/admin-dashboard-demo/dashboard" className="btn btn-ghost text-primary-content hover:bg-white/20 btn-sm sm:btn-md">
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
              <ActionButton
                onClick={() => setShowNewEmailModal(true)}
                variant="default"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-primary-content"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">New Email</span>
                <span className="sm:hidden">New</span>
              </ActionButton>
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
        </div>
      </div>
    </div>
  );
}