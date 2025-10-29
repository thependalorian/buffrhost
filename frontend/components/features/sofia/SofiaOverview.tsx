/**
 * Sofia Overview Component
 *
 * Purpose: Displays Sofia AI overview with key metrics and status
 * Functionality: Sofia stats, confidence levels, acceptance rates, quick actions
 * Location: /components/features/sofia/SofiaOverview.tsx
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
  Brain,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Bell,
  Lightbulb,
  Target,
  RefreshCw,
  Settings,
  Play,
} from 'lucide-react';

// Types for TypeScript compliance
interface SofiaStats {
  totalRecommendations: number;
  highConfidenceRecommendations: number;
  unreadNotifications: number;
  totalInsights: number;
  averageConfidence: number;
  acceptanceRate: number;
}

interface SofiaOverviewProps {
  stats: SofiaStats;
  onRefresh: () => void;
  onConfigure: () => void;
  onStartLearning: () => void;
  isLoading?: boolean;
}

// Main Sofia Overview Component
export const SofiaOverview: React.FC<SofiaOverviewProps> = ({
  stats,
  onRefresh,
  onConfigure,
  onStartLearning,
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
      onRefresh();
    }, 1000);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Get confidence level color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-success';
    if (confidence >= 60) return 'text-warning';
    return 'text-error';
  };

  // Get confidence level badge
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return 'badge-success';
    if (confidence >= 60) return 'badge-warning';
    return 'badge-error';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Sofia AI Overview
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
      {/* Sofia Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Sofia AI Concierge</CardTitle>
                <p className="text-base-content/70">
                  Your intelligent hospitality assistant
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="badge-success">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </Badge>
                  <Badge
                    className={getConfidenceBadge(stats.averageConfidence)}
                  >
                    {formatPercentage(stats.averageConfidence)} Confidence
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                className="btn-outline btn-sm"
                disabled={isRefreshing}
              >
                <RefreshCw className="w-4 h-4" />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button onClick={onConfigure} className="btn-outline btn-sm">
                <Settings className="w-4 h-4" />
                Configure
              </Button>
              <Button onClick={onStartLearning} className="btn-primary btn-sm">
                <Play className="w-4 h-4" />
                Start Learning
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Recommendations */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {stats.totalRecommendations}
                </div>
                <div className="text-sm text-base-content/70">
                  Total Recommendations
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* High Confidence Recommendations */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-success">
                  {stats.highConfidenceRecommendations}
                </div>
                <div className="text-sm text-base-content/70">
                  High Confidence
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unread Notifications */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">
                  {stats.unreadNotifications}
                </div>
                <div className="text-sm text-base-content/70">
                  Unread Notifications
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Insights */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-info" />
              </div>
              <div>
                <div className="text-2xl font-bold text-info">
                  {stats.totalInsights}
                </div>
                <div className="text-sm text-base-content/70">
                  Total Insights
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confidence Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              AI Confidence Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-base-content/70">Average Confidence</span>
                <span
                  className={`font-bold ${getConfidenceColor(stats.averageConfidence)}`}
                >
                  {formatPercentage(stats.averageConfidence)}
                </span>
              </div>
              <div className="w-full bg-base-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    stats.averageConfidence >= 80
                      ? 'bg-success'
                      : stats.averageConfidence >= 60
                        ? 'bg-warning'
                        : 'bg-error'
                  }`}
                  style={{ width: `${stats.averageConfidence}%` }}
                ></div>
              </div>
              <div className="text-sm text-base-content/70">
                {stats.averageConfidence >= 80
                  ? 'Excellent performance'
                  : stats.averageConfidence >= 60
                    ? 'Good performance'
                    : 'Needs improvement'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acceptance Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Recommendation Acceptance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-base-content/70">Acceptance Rate</span>
                <span className="font-bold text-success">
                  {formatPercentage(stats.acceptanceRate)}
                </span>
              </div>
              <div className="w-full bg-base-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-success"
                  style={{ width: `${stats.acceptanceRate}%` }}
                ></div>
              </div>
              <div className="text-sm text-base-content/70">
                {stats.acceptanceRate >= 70
                  ? 'High acceptance rate'
                  : stats.acceptanceRate >= 50
                    ? 'Moderate acceptance rate'
                    : 'Low acceptance rate'}
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={onStartLearning}
              className="btn-primary btn-outline h-20 flex flex-col gap-2"
            >
              <Play className="w-6 h-6" />
              <span>Start Learning Session</span>
            </Button>

            <Button
              onClick={onConfigure}
              className="btn-secondary btn-outline h-20 flex flex-col gap-2"
            >
              <Settings className="w-6 h-6" />
              <span>Configure AI Settings</span>
            </Button>

            <Button
              onClick={handleRefresh}
              className="btn-accent btn-outline h-20 flex flex-col gap-2"
              disabled={isRefreshing}
            >
              <RefreshCw className="w-6 h-6" />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Alerts */}
      {stats.unreadNotifications > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="alert alert-info">
              <Bell className="w-4 h-4" />
              <span>
                You have {stats.unreadNotifications} unread notifications from
                Sofia AI
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SofiaOverview;
