/**
 * Etuna CRM & Lead Management - Professional Demo
 * 
 * Comprehensive CRM showcasing Buffr Host's sales optimization capabilities
 * Features lead management, sales funnel, conversion tracking, and automation
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowLeft,
  Home,
  Calendar,
  DollarSign,
  TrendingUp,
  Target,
  Activity,
  Star,
  Briefcase,
  MessageSquare,
  PhoneCall,
  Mail as MailIcon,
  Calendar as CalendarIcon,
  BarChart3,
  PieChart,
  TrendingDown,
  UserCheck,
  UserX,
  Clock3,
  Zap,
  Brain,
  Database,
  Network,
  Shield,
  Settings,
  Plus,
  MoreHorizontal,
  Award,
  Crown,
  Rocket,
  Globe,
  Heart,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Play,
  Pause,
  Square,
  RotateCcw,
  Lightbulb,
  BookOpen,
  FileText,
  CreditCard,
  ShoppingCart,
  Tag,
  Flag,
  Bell,
  Send,
  Archive,
  Trash2,
  Copy,
  Share,
  ExternalLink
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Etuna Guesthouse - CRM & Lead Management',
  description: 'Comprehensive CRM and lead optimization for Etuna Guesthouse',
};

export default function EtunaCRMPage() {
  // Mock CRM data
  const leads = [
    {
      id: 'LEAD001',
      name: 'Corporate Retreat Group',
      company: 'Namibia Mining Corp',
      email: 'bookings@namibiamining.com',
      phone: '+264 61 234 5678',
      source: 'Website',
      status: 'hot',
      value: 45000,
      probability: 85,
      lastContact: '2024-01-15',
      nextAction: 'Send proposal',
      assignedTo: 'Maria Garcia',
      notes: 'Interested in 3-day corporate retreat for 25 people. Budget confirmed.',
      tags: ['Corporate', 'High Value', 'Urgent'],
      stage: 'Proposal',
      expectedClose: '2024-01-25',
      activities: [
        { type: 'call', date: '2024-01-15', description: 'Initial consultation call' },
        { type: 'email', date: '2024-01-14', description: 'Sent property information' },
        { type: 'meeting', date: '2024-01-12', description: 'Site visit scheduled' }
      ]
    },
    {
      id: 'LEAD002',
      name: 'Wedding Party',
      company: 'Private',
      email: 'sarah.wedding@gmail.com',
      phone: '+264 81 345 6789',
      source: 'Social Media',
      status: 'warm',
      value: 25000,
      probability: 65,
      lastContact: '2024-01-14',
      nextAction: 'Follow up call',
      assignedTo: 'Ahmed Hassan',
      notes: 'Wedding reception for 80 guests. Considering our conference facilities.',
      tags: ['Wedding', 'Social Event', 'Medium Value'],
      stage: 'Qualification',
      expectedClose: '2024-02-15',
      activities: [
        { type: 'email', date: '2024-01-14', description: 'Sent wedding package details' },
        { type: 'call', date: '2024-01-13', description: 'Initial inquiry call' }
      ]
    },
    {
      id: 'LEAD003',
      name: 'Tour Group',
      company: 'Adventure Tours Namibia',
      email: 'groups@adventuretours.na',
      phone: '+264 64 456 7890',
      source: 'Referral',
      status: 'cold',
      value: 15000,
      probability: 40,
      lastContact: '2024-01-10',
      nextAction: 'Send tour information',
      assignedTo: 'Fatima Al-Zahra',
      notes: 'Regular tour group looking for accommodation for 15 people.',
      tags: ['Tour Group', 'Repeat Business', 'Low Value'],
      stage: 'Lead',
      expectedClose: '2024-03-01',
      activities: [
        { type: 'email', date: '2024-01-10', description: 'Initial contact' }
      ]
    },
    {
      id: 'LEAD004',
      name: 'Conference Organizer',
      company: 'Tech Conference Namibia',
      email: 'events@techconf.na',
      phone: '+264 61 567 8901',
      source: 'Website',
      status: 'hot',
      value: 80000,
      probability: 90,
      lastContact: '2024-01-16',
      nextAction: 'Contract review',
      assignedTo: 'Maria Garcia',
      notes: 'Annual tech conference for 200 delegates. Very interested in our facilities.',
      tags: ['Conference', 'High Value', 'Annual Event'],
      stage: 'Negotiation',
      expectedClose: '2024-01-30',
      activities: [
        { type: 'meeting', date: '2024-01-16', description: 'Facility tour completed' },
        { type: 'call', date: '2024-01-15', description: 'Requirements discussion' },
        { type: 'email', date: '2024-01-14', description: 'Proposal sent' }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hot':
        return <span className="badge badge-error">Hot Lead</span>;
      case 'warm':
        return <span className="badge badge-warning">Warm Lead</span>;
      case 'cold':
        return <span className="badge badge-neutral">Cold Lead</span>;
      case 'converted':
        return <span className="badge badge-success">Converted</span>;
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hot':
        return <AlertCircle className="w-4 h-4 text-error" />;
      case 'warm':
        return <Star className="w-4 h-4 text-warning" />;
      case 'cold':
        return <Clock className="w-4 h-4 text-neutral" />;
      case 'converted':
        return <CheckCircle className="w-4 h-4 text-success" />;
      default:
        return <AlertCircle className="w-4 h-4 text-ghost" />;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Lead':
        return 'text-info';
      case 'Qualification':
        return 'text-warning';
      case 'Proposal':
        return 'text-primary';
      case 'Negotiation':
        return 'text-secondary';
      case 'Closed Won':
        return 'text-success';
      case 'Closed Lost':
        return 'text-error';
      default:
        return 'text-base-content';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <PhoneCall className="w-4 h-4 text-primary" />;
      case 'email':
        return <MailIcon className="w-4 h-4 text-secondary" />;
      case 'meeting':
        return <CalendarIcon className="w-4 h-4 text-accent" />;
      case 'task':
        return <CheckCircle className="w-4 h-4 text-info" />;
      default:
        return <Activity className="w-4 h-4 text-base-content" />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content py-4 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/protected/etuna/dashboard" className="btn btn-ghost text-primary-content hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">CRM & Lead Management</h1>
                  <p className="text-primary-content/80">Sales optimization and customer relationship management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="btn btn-primary">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Lead
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Sales Funnel Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Leads</div>
              <div className="stat-value text-primary">{leads.length}</div>
              <div className="stat-desc">Active prospects</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="stat-title">Hot Leads</div>
              <div className="stat-value text-success">
                {leads.filter(l => l.status === 'hot').length}
              </div>
              <div className="stat-desc">High probability</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-warning">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Pipeline Value</div>
              <div className="stat-value text-warning">
                N$ {leads.reduce((sum, lead) => sum + lead.value, 0).toLocaleString()}
              </div>
              <div className="stat-desc">Total potential</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <Target className="w-8 h-8" />
              </div>
              <div className="stat-title">Conversion Rate</div>
              <div className="stat-value text-info">68%</div>
              <div className="stat-desc">This quarter</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search leads..." 
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select className="select select-bordered">
                  <option>All Status</option>
                  <option>Hot Leads</option>
                  <option>Warm Leads</option>
                  <option>Cold Leads</option>
                  <option>Converted</option>
                </select>
                <select className="select select-bordered">
                  <option>All Stages</option>
                  <option>Lead</option>
                  <option>Qualification</option>
                  <option>Proposal</option>
                  <option>Negotiation</option>
                </select>
                <button className="btn btn-outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {leads.map((lead) => (
            <div key={lead.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="card-title text-lg">{lead.name}</h3>
                    <p className="text-sm text-base-content/70">{lead.company}</p>
                    <p className="text-xs text-base-content/50">Source: {lead.source}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(lead.status)}
                    {getStatusBadge(lead.status)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm">{lead.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-sm">{lead.phone}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Value:</span>
                    <span className="font-bold text-primary">N$ {lead.value.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Probability:</span>
                    <span className="font-semibold">{lead.probability}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Stage:</span>
                    <span className={`font-semibold ${getStageColor(lead.stage)}`}>{lead.stage}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Assigned to:</span>
                    <span className="text-sm">{lead.assignedTo}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Expected Close:</span>
                    <span className="text-sm">{lead.expectedClose}</span>
                  </div>
                </div>

                <div className="divider my-4"></div>

                <div className="space-y-2">
                  <div className="font-semibold text-sm text-base-content/70">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {lead.tags.map((tag, index) => (
                      <span key={index} className="badge badge-outline badge-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <div className="font-semibold text-sm text-base-content/70">Recent Activities</div>
                  <div className="space-y-1">
                    {lead.activities.slice(0, 2).map((activity, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        {getActivityIcon(activity.type)}
                        <span>{activity.description}</span>
                        <span className="text-base-content/50">({activity.date})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-ghost btn-sm" title="View Details">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Call">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Email">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sales Pipeline Visualization */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="card-title mb-6">
              <BarChart3 className="w-6 h-6 text-primary" />
              Sales Pipeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {['Lead', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'].map((stage, index) => (
                <div key={stage} className="text-center">
                  <div className="font-semibold text-sm mb-2">{stage}</div>
                  <div className="w-full bg-base-200 rounded-full h-4 mb-2">
                    <div 
                      className="bg-primary h-4 rounded-full" 
                      style={{ width: `${(index + 1) * 20}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-base-content/70">
                    {leads.filter(l => l.stage === stage).length} leads
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buffr Host CRM Features */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-6">
              <Brain className="w-6 h-6 text-primary" />
              Buffr Host CRM Automation Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Lead Scoring</div>
                  <div className="text-sm text-base-content/70">
                    AI-powered lead scoring based on behavior, engagement, and fit
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Sales Automation</div>
                  <div className="text-sm text-base-content/70">
                    Automated follow-ups, email sequences, and task assignments
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Database className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">360° Customer View</div>
                  <div className="text-sm text-base-content/70">
                    Complete customer journey tracking and interaction history
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Network className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Integration Hub</div>
                  <div className="text-sm text-base-content/70">
                    Seamless integration with booking systems, email, and calendar
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Data Security</div>
                  <div className="text-sm text-base-content/70">
                    Enterprise-grade security with GDPR compliance
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Analytics & Insights</div>
                  <div className="text-sm text-base-content/70">
                    Advanced analytics for sales optimization and forecasting
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
