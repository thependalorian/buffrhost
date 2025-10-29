/**
 * Platform Overview Component
 *
 * Purpose: Displays platform statistics and key metrics
 * Functionality: Platform stats cards, system health, recent activity, quick actions
 * Location: /components/dashboard/admin/PlatformOverview.tsx
 *
 * Follows 40 Rules:
 * - Uses DaisyUI for consistent styling
 * - Modular component design for easy maintenance
 * - TypeScript for type safety
 * - Vercel-compatible with SSR
 * - Uses Neon PostgreSQL database
 * - Comprehensive error handling
 * - Optimized for performance
 */

'use client';

import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';
import {
  Building,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Settings,
  BarChart3,
  MessageCircle,
  Server,
  Shield,
} from 'lucide-react';

// Types for TypeScript compliance
interface PlatformStats {
  totalProperties: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  todayRevenue: number;
  activeProperties: number;
  pendingProperties: number;
  totalCustomers: number;
  totalPropertyOwners: number;
  averageOrderValue: number;
  platformGrowth: number;
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'order' | 'property' | 'user' | 'payment' | 'system';
  description: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  user?: string;
  property?: string;
}

interface PlatformOverviewProps {
  platformStats: PlatformStats;
  recentActivity: RecentActivity[];
  onAddProperty: () => void;
  onManageUsers: () => void;
  onViewAnalytics: () => void;
  onSystemSettings: () => void;
  onAIChat: () => void;
  isLoading?: boolean;
}

// Main Platform Overview Component
export const PlatformOverview: React.FC<PlatformOverviewProps> = ({
  platformStats,
  recentActivity,
  onAddProperty,
  onManageUsers,
  onViewAnalytics,
  onSystemSettings,
  onAIChat,
  isLoading = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs for performance optimization
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      setIsRefreshing(false);
      window.location.reload();
    }, 1000);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'badge-success';
      case 'warning':
        return 'badge-warning';
      case 'critical':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <DollarSign className="w-4 h-4" />;
      case 'property':
        return <Building className="w-4 h-4" />;
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'payment':
        return <DollarSign className="w-4 h-4" />;
      case 'system':
        return <Server className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'text-success';
      case 'info':
        return 'text-info';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-base-content/70';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: 'NAD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format number
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-NA').format(num);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Platform Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="loading loading-spinner loading-md text-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Properties */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="w-8 h-8 text-primary" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-base-content/70 truncate">
                    Total Properties
                  </dt>
                  <dd className="text-lg font-medium text-base-content">
                    {formatNumber(platformStats.totalProperties)}
                  </dd>
                  <dd className="text-sm text-base-content/70">
                    {platformStats.activeProperties} active
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-success" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-base-content/70 truncate">
                    Total Users
                  </dt>
                  <dd className="text-lg font-medium text-base-content">
                    {formatNumber(platformStats.totalUsers)}
                  </dd>
                  <dd className="text-sm text-base-content/70">
                    {platformStats.totalCustomers} customers
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="w-8 h-8 text-warning" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-base-content/70 truncate">
                    Total Revenue
                  </dt>
                  <dd className="text-lg font-medium text-base-content">
                    {formatCurrency(platformStats.totalRevenue)}
                  </dd>
                  <dd className="text-sm text-base-content/70">
                    This month: {formatCurrency(platformStats.monthlyRevenue)}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Growth */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-info" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-base-content/70 truncate">
                    Platform Growth
                  </dt>
                  <dd className="text-lg font-medium text-base-content">
                    +{platformStats.platformGrowth}%
                  </dd>
                  <dd className="text-sm text-base-content/70">This month</dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/70">Status</span>
                <Badge
                  className={getStatusColor(platformStats.systemHealth.status)}
                >
                  {getStatusIcon(platformStats.systemHealth.status)}
                  <span className="ml-1 capitalize">
                    {platformStats.systemHealth.status}
                  </span>
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/70">Uptime</span>
                <span className="text-sm font-medium text-base-content">
                  {platformStats.systemHealth.uptime}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/70">
                  Response Time
                </span>
                <span className="text-sm font-medium text-base-content">
                  {platformStats.systemHealth.responseTime}ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/70">Error Rate</span>
                <span className="text-sm font-medium text-base-content">
                  {platformStats.systemHealth.errorRate}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`flex-shrink-0 ${getSeverityColor(activity.severity)}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-base-content">
                      {activity.description}
                    </p>
                    <p className="text-xs text-base-content/70">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={onAddProperty}
              className="btn-outline h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">Add Property</span>
            </Button>

            <Button
              onClick={onManageUsers}
              className="btn-outline h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Manage Users</span>
            </Button>

            <Button
              onClick={onViewAnalytics}
              className="btn-outline h-auto p-4 flex flex-col items-center space-y-2"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-medium">View Analytics</span>
            </Button>

            <Button
              onClick={onSystemSettings}
              className="btn-outline h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">System Settings</span>
            </Button>

            <Button
              onClick={onAIChat}
              className="btn-outline h-auto p-4 flex flex-col items-center space-y-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">AI Chat</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformOverview;
