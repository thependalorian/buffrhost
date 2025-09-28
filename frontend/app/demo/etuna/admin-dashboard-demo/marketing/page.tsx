"use client";

import Link from "next/link";
import {
  Mail,
  Send,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Phone,
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
  Archive,
  Trash2,
  Copy,
  Share,
  ExternalLink,
  Users,
  UserPlus,
  Megaphone,
} from "lucide-react";
import { useState } from "react";
import {
  ModalForm,
  FormField,
  FormSelect,
  FormTextarea,
  ActionButton,
  DataTable,
  Alert,
} from "@/src/components/ui";

export default function EtunaMarketingPage() {
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Mock marketing campaigns
  const campaigns = [
    {
      id: "CAMP001",
      name: "Summer Getaway Special",
      type: "Email Campaign",
      status: "active",
      audience: "Past Guests",
      sent: 1250,
      opened: 487,
      clicked: 89,
      converted: 23,
      revenue: 45600,
      openRate: 38.96,
      clickRate: 7.12,
      conversionRate: 1.84,
      startDate: "2024-01-10",
      endDate: "2024-02-10",
      budget: 5000,
      spent: 3200,
      roi: 1325.0,
    },
    {
      id: "CAMP002",
      name: "Corporate Retreat Package",
      type: "Email Campaign",
      status: "active",
      audience: "Corporate Contacts",
      sent: 850,
      opened: 312,
      clicked: 67,
      converted: 12,
      revenue: 78000,
      openRate: 36.71,
      clickRate: 7.88,
      conversionRate: 1.41,
      startDate: "2024-01-05",
      endDate: "2024-03-05",
      budget: 8000,
      spent: 5200,
      roi: 1400.0,
    },
    {
      id: "CAMP003",
      name: "Wedding Venue Promotion",
      type: "Social Media",
      status: "paused",
      audience: "Engaged Couples",
      sent: 2100,
      opened: 945,
      clicked: 156,
      converted: 8,
      revenue: 32000,
      openRate: 45.0,
      clickRate: 7.43,
      conversionRate: 0.38,
      startDate: "2024-01-01",
      endDate: "2024-04-01",
      budget: 3000,
      spent: 1800,
      roi: 1677.78,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="badge badge-success">Active</span>;
      case "paused":
        return <span className="badge badge-warning">Paused</span>;
      case "completed":
        return <span className="badge badge-neutral">Completed</span>;
      case "draft":
        return <span className="badge badge-ghost">Draft</span>;
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "paused":
        return <Pause className="w-4 h-4 text-warning" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-neutral" />;
      case "draft":
        return <FileText className="w-4 h-4 text-ghost" />;
      default:
        return <AlertCircle className="w-4 h-4 text-ghost" />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content py-4 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/demo/etuna/admin-dashboard-demo/dashboard"
                className="btn btn-ghost text-primary-content hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <Megaphone className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Marketing Automation</h1>
                  <p className="text-primary-content/80">
                    Lead generation and conversion optimization
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ActionButton
                onClick={() => setShowExportModal(true)}
                variant="secondary"
                icon={<Download className="w-4 h-4" />}
                iconPosition="left"
              >
                Export
              </ActionButton>
              <ActionButton
                onClick={() => setShowCreateCampaign(true)}
                icon={<Plus className="w-4 h-4" />}
                iconPosition="left"
              >
                New Campaign
              </ActionButton>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Marketing Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Mail className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Campaigns</div>
              <div className="stat-value text-primary">{campaigns.length}</div>
              <div className="stat-desc">Active marketing</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value text-success">
                N${" "}
                {campaigns
                  .reduce((sum, camp) => sum + camp.revenue, 0)
                  .toLocaleString()}
              </div>
              <div className="stat-desc">Generated</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-warning">
                <Target className="w-8 h-8" />
              </div>
              <div className="stat-title">Avg Conversion</div>
              <div className="stat-value text-warning">
                {Math.round(
                  (campaigns.reduce(
                    (sum, camp) => sum + camp.conversionRate,
                    0,
                  ) /
                    campaigns.length) *
                    100,
                ) / 100}
                %
              </div>
              <div className="stat-desc">Rate</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Avg ROI</div>
              <div className="stat-value text-info">
                {Math.round(
                  campaigns.reduce((sum, camp) => sum + camp.roi, 0) /
                    campaigns.length,
                )}
                %
              </div>
              <div className="stat-desc">Return on investment</div>
            </div>
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h3 className="card-title mb-6">
              <BarChart3 className="w-6 h-6 text-primary" />
              Campaign Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Sent</th>
                    <th>Open Rate</th>
                    <th>Click Rate</th>
                    <th>Conversion</th>
                    <th>Revenue</th>
                    <th>ROI</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td>
                        <div className="font-semibold">{campaign.name}</div>
                        <div className="text-sm text-base-content/70">
                          {campaign.audience}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-outline">
                          {campaign.type}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(campaign.status)}
                          {getStatusBadge(campaign.status)}
                        </div>
                      </td>
                      <td>{campaign.sent.toLocaleString()}</td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-base-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${campaign.openRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{campaign.openRate}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-base-200 rounded-full h-2">
                            <div
                              className="bg-secondary h-2 rounded-full"
                              style={{ width: `${campaign.clickRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{campaign.clickRate}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-base-200 rounded-full h-2">
                            <div
                              className="bg-accent h-2 rounded-full"
                              style={{ width: `${campaign.conversionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">
                            {campaign.conversionRate}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="font-semibold text-success">
                          N$ {campaign.revenue.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span className="font-semibold text-info">
                          {campaign.roi}%
                        </span>
                      </td>
                      <td>
                        <div className="flex space-x-1">
                          <button
                            className="btn btn-ghost btn-sm"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="btn btn-ghost btn-sm" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            title="Analytics"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Lead Nurturing Workflows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">
                <Zap className="w-5 h-5 text-primary" />
                Automated Lead Nurturing
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Welcome Series</span>
                  <span className="badge badge-success">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Abandoned Cart Recovery</span>
                  <span className="badge badge-success">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Post-Stay Follow-up</span>
                  <span className="badge badge-success">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Birthday Campaigns</span>
                  <span className="badge badge-warning">Paused</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Seasonal Promotions</span>
                  <span className="badge badge-success">Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">
                <Target className="w-5 h-5 text-secondary" />
                Lead Scoring & Segmentation
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">High-Value Prospects</span>
                  <span className="font-semibold text-success">47 leads</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Warm Leads</span>
                  <span className="font-semibold text-warning">23 leads</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cold Prospects</span>
                  <span className="font-semibold text-neutral">156 leads</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">VIP Customers</span>
                  <span className="font-semibold text-primary">12 leads</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">At-Risk Customers</span>
                  <span className="font-semibold text-error">8 leads</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buffr Host Marketing Features */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-6">
              <Brain className="w-6 h-6 text-primary" />
              Buffr Host Marketing Automation Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">AI-Powered Segmentation</div>
                  <div className="text-sm text-base-content/70">
                    Machine learning algorithms automatically segment customers
                    based on behavior and preferences
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Predictive Analytics</div>
                  <div className="text-sm text-base-content/70">
                    Forecast customer behavior and optimize campaign timing for
                    maximum conversion
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Database className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Dynamic Content</div>
                  <div className="text-sm text-base-content/70">
                    Personalized content that adapts based on customer data and
                    interaction history
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Network className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">
                    Multi-Channel Orchestration
                  </div>
                  <div className="text-sm text-base-content/70">
                    Coordinate campaigns across email, SMS, social media, and
                    web channels
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">Compliance Management</div>
                  <div className="text-sm text-base-content/70">
                    Automated GDPR compliance, unsubscribe management, and data
                    protection
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-primary mt-1" />
                <div>
                  <div className="font-semibold">ROI Optimization</div>
                  <div className="text-sm text-base-content/70">
                    Continuous optimization of campaigns based on performance
                    data and ROI metrics
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Campaign Modal */}
      <ModalForm
        open={showCreateCampaign}
        onOpenChange={setShowCreateCampaign}
        title="Create New Campaign"
        description="Set up a new marketing campaign to reach your target audience"
        size="lg"
        onSubmit={async (data) => {
          alert("Campaign created successfully!");
          setShowCreateCampaign(false);
        }}
        submitText="Create Campaign"
        cancelText="Cancel"
      >
        <FormField
          label="Campaign Name"
          name="name"
          placeholder="Enter campaign name"
          required
        />

        <FormSelect
          label="Campaign Type"
          name="type"
          placeholder="Select campaign type"
          required
          options={[
            { value: "email", label: "Email Campaign" },
            { value: "social", label: "Social Media" },
            { value: "display", label: "Display Advertising" },
            { value: "search", label: "Search Marketing" },
          ]}
        />

        <FormSelect
          label="Target Audience"
          name="audience"
          placeholder="Select audience"
          required
          options={[
            { value: "past-guests", label: "Past Guests" },
            { value: "corporate", label: "Corporate Contacts" },
            { value: "couples", label: "Engaged Couples" },
            { value: "families", label: "Families" },
          ]}
        />

        <FormField
          label="Budget (NAD)"
          name="budget"
          type="number"
          min={0}
          placeholder="Enter budget"
        />

        <FormField label="Start Date" name="startDate" type="date" />

        <FormField label="End Date" name="endDate" type="date" />

        <FormTextarea
          label="Campaign Description"
          name="description"
          placeholder="Describe your campaign goals and strategy"
          rows={3}
        />
      </ModalForm>

      {/* Export Modal */}
      <ModalForm
        open={showExportModal}
        onOpenChange={setShowExportModal}
        title="Export Campaign Data"
        description="Export your marketing campaign data in various formats"
        size="md"
        onSubmit={async (data) => {
          alert("Campaign data exported successfully!");
          setShowExportModal(false);
        }}
        submitText="Export Data"
        cancelText="Cancel"
      >
        <FormSelect
          label="Export Format"
          name="format"
          placeholder="Select format"
          required
          options={[
            { value: "csv", label: "CSV" },
            { value: "excel", label: "Excel" },
            { value: "pdf", label: "PDF Report" },
          ]}
        />

        <FormSelect
          label="Date Range"
          name="dateRange"
          placeholder="Select range"
          required
          options={[
            { value: "last-7-days", label: "Last 7 Days" },
            { value: "last-30-days", label: "Last 30 Days" },
            { value: "last-3-months", label: "Last 3 Months" },
            { value: "custom", label: "Custom Range" },
          ]}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Include Data</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="performance"
                defaultChecked
                className="checkbox mr-2"
              />
              <label className="text-sm">Campaign Performance</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="analytics"
                defaultChecked
                className="checkbox mr-2"
              />
              <label className="text-sm">Audience Analytics</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="revenue"
                defaultChecked
                className="checkbox mr-2"
              />
              <label className="text-sm">Revenue Data</label>
            </div>
          </div>
        </div>
      </ModalForm>
    </div>
  );
}

// Metadata moved to layout or removed for client component
