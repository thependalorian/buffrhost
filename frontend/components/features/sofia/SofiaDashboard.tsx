/**
 * Sofia Dashboard Component - Modular Implementation
 *
 * Purpose: Comprehensive Sofia AI dashboard with modular architecture
 * Functionality: Overview, recommendations, analytics, notifications management
 * Location: /components/features/sofia/SofiaDashboardModular.tsx
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

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import {
  Brain,
  BarChart3,
  Bell,
  Lightbulb,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Settings,
} from 'lucide-react';

// Import modular components
import SofiaOverview from './SofiaOverview';
import SofiaRecommendations from './SofiaRecommendations';
import SofiaAnalytics from './SofiaAnalytics';
import SofiaNotifications from './SofiaNotifications';

// Types for TypeScript compliance
interface SofiaStats {
  totalRecommendations: number;
  highConfidenceRecommendations: number;
  unreadNotifications: number;
  totalInsights: number;
  averageConfidence: number;
  acceptanceRate: number;
}

interface SofiaRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'accepted' | 'rejected' | 'implemented';
  createdAt: string;
  expiresAt?: string;
  impact: {
    revenue: number;
    efficiency: number;
    customerSatisfaction: number;
  };
  tags: string[];
  source: string;
}

interface SofiaAnalyticsData {
  period: string;
  performance: {
    accuracy: number;
    confidence: number;
    responseTime: number;
    learningRate: number;
  };
  trends: {
    accuracy: { current: number; previous: number; change: number }[];
    confidence: { current: number; previous: number; change: number }[];
    recommendations: { current: number; previous: number; change: number }[];
    acceptance: { current: number; previous: number; change: number }[];
  };
  learning: {
    totalSessions: number;
    completedSessions: number;
    averageSessionTime: number;
    skillsLearned: number;
    nextMilestone: string;
  };
  insights: {
    topPerformingCategory: string;
    improvementArea: string;
    bestTimeOfDay: string;
    mostEffectiveFeature: string;
  };
  hourlyData: {
    hour: string;
    accuracy: number;
    confidence: number;
    recommendations: number;
  }[];
  dailyData: {
    date: string;
    accuracy: number;
    confidence: number;
    recommendations: number;
    acceptance: number;
  }[];
}

interface SofiaNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'recommendation';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'archived';
  category: string;
  createdAt: string;
  expiresAt?: string;
  source: string;
  actionRequired: boolean;
  actionUrl?: string;
  metadata?: {
    confidence?: number;
    impact?: string;
    relatedId?: string;
  };
}

interface SofiaDashboardProps {
  propertyId: string;
  guestId?: string;
  className?: string;
}

// Main Sofia Dashboard Component
export const SofiaDashboardModular: React.FC<SofiaDashboardProps> = ({
  propertyId,
  guestId,
  className = '',
}) => {
  const [stats, setStats] = useState<SofiaStats | null>(null);
  const [recommendations, setRecommendations] = useState<SofiaRecommendation[]>(
    []
  );
  const [analytics, setAnalytics] = useState<SofiaAnalyticsData | null>(null);
  const [notifications, setNotifications] = useState<SofiaNotification[]>([]);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'recommendations' | 'analytics' | 'notifications'
  >('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Refs for performance optimization
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load Sofia data
  useEffect(() => {
    const loadSofiaData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load Sofia stats
        const statsRes = await fetch(`/api/secure/sofia/${propertyId}/stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.data);
        }

        // Load recommendations
        const recommendationsRes = await fetch(
          `/api/secure/sofia/${propertyId}/recommendations`
        );
        if (recommendationsRes.ok) {
          const recommendationsData = await recommendationsRes.json();
          setRecommendations(recommendationsData.data);
        }

        // Load analytics
        const analyticsRes = await fetch(
          `/api/secure/sofia/${propertyId}/analytics`
        );
        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setAnalytics(analyticsData.data);
        }

        // Load notifications
        const notificationsRes = await fetch(
          `/api/secure/sofia/${propertyId}/notifications`
        );
        if (notificationsRes.ok) {
          const notificationsData = await notificationsRes.json();
          setNotifications(notificationsData.data);
        }
      } catch (err) {
        console.error('Error loading Sofia data:', err);
        setError('Failed to load Sofia AI data');

        // Fallback mock data
        setStats({
          totalRecommendations: 24,
          highConfidenceRecommendations: 18,
          unreadNotifications: 3,
          totalInsights: 156,
          averageConfidence: 87.5,
          acceptanceRate: 78.2,
        });

        setRecommendations([
          {
            id: '1',
            title: 'Optimize Peak Hour Staffing',
            description:
              'Increase staff during 6-8 PM to reduce wait times by 25%',
            category: 'Operations',
            confidence: 92,
            priority: 'high',
            status: 'pending',
            createdAt: new Date().toISOString(),
            impact: { revenue: 5000, efficiency: 25, customerSatisfaction: 15 },
            tags: ['staffing', 'peak-hours', 'efficiency'],
            source: 'Historical Data Analysis',
          },
        ]);

        setAnalytics({
          period: '7d',
          performance: {
            accuracy: 89.2,
            confidence: 87.5,
            responseTime: 1.2,
            learningRate: 6.8,
          },
          trends: {
            accuracy: [{ current: 89.2, previous: 85.1, change: 4.1 }],
            confidence: [{ current: 87.5, previous: 82.3, change: 5.2 }],
            recommendations: [{ current: 24, previous: 18, change: 33.3 }],
            acceptance: [{ current: 78.2, previous: 72.1, change: 6.1 }],
          },
          learning: {
            totalSessions: 45,
            completedSessions: 42,
            averageSessionTime: 18.5,
            skillsLearned: 12,
            nextMilestone: 'Advanced Pattern Recognition',
          },
          insights: {
            topPerformingCategory: 'Customer Service',
            improvementArea: 'Inventory Management',
            bestTimeOfDay: '2:00 PM - 4:00 PM',
            mostEffectiveFeature: 'Predictive Analytics',
          },
          hourlyData: [],
          dailyData: [],
        });

        setNotifications([
          {
            id: '1',
            title: 'New Learning Session Available',
            message:
              'Sofia has completed a new learning session and is ready for advanced training.',
            type: 'info',
            priority: 'medium',
            status: 'unread',
            category: 'Learning',
            createdAt: new Date().toISOString(),
            source: 'Sofia AI',
            actionRequired: false,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      loadSofiaData();
    }
  }, [propertyId, guestId]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as unknown);
  };

  // Handle refresh
  const handleRefresh = () => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  // Handle recommendation actions
  const handleAcceptRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, status: 'accepted' as const } : rec
      )
    );
    setSuccess('Recommendation accepted successfully');
  };

  const handleRejectRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, status: 'rejected' as const } : rec
      )
    );
    setSuccess('Recommendation rejected');
  };

  const handleViewRecommendation = (id: string) => {
    console.log('View recommendation:', id);
    // This would typically open a detailed view modal
  };

  // Handle notification actions
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, status: 'read' as const } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, status: 'read' as const }))
    );
    setSuccess('All notifications marked as read');
  };

  const handleArchiveNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, status: 'archived' as const } : notif
      )
    );
  };

  const handleViewNotification = (id: string) => {
    console.log('View notification:', id);
    // This would typically open a detailed view modal
  };

  // Handle analytics period change
  const handleAnalyticsPeriodChange = async (period: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/secure/sofia/${propertyId}/analytics?period=${period}`
      );
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle analytics export
  const handleAnalyticsExport = () => {
    try {
      const data = {
        propertyId,
        stats,
        analytics,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sofia-analytics-${propertyId}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting analytics:', error);
    }
  };

  // Handle configuration
  const handleConfigure = () => {
    console.log('Configure Sofia AI');
    // This would typically open a configuration modal
  };

  // Handle start learning
  const handleStartLearning = () => {
    console.log('Start Sofia learning session');
    // This would typically start a learning session
  };

  if (isLoading && !stats) {
    return (
      <div className={`min-h-screen bg-base-100 p-6 ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-base-100 p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Sofia AI Concierge Dashboard
            </h1>
            <p className="text-base-content/70">
              Intelligent hospitality assistant for property management
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
            <Button
              onClick={handleRefresh}
              className="btn-outline btn-sm"
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="alert alert-error mb-6">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
            <Button onClick={() => setError(null)} className="btn-sm btn-ghost">
              ×
            </Button>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-6">
            <CheckCircle className="w-4 h-4" />
            <span>{success}</span>
            <Button
              onClick={() => setSuccess(null)}
              className="btn-sm btn-ghost"
            >
              ×
            </Button>
          </div>
        )}

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className="flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {stats && (
              <SofiaOverview
                stats={stats}
                onRefresh={handleRefresh}
                onConfigure={handleConfigure}
                onStartLearning={handleStartLearning}
                isLoading={isLoading}
              />
            )}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations">
            <SofiaRecommendations
              recommendations={recommendations}
              onAccept={handleAcceptRecommendation}
              onReject={handleRejectRecommendation}
              onView={handleViewRecommendation}
              onRefresh={handleRefresh}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            {analytics && (
              <SofiaAnalytics
                analytics={analytics}
                onPeriodChange={handleAnalyticsPeriodChange}
                onExportData={handleAnalyticsExport}
                onRefresh={handleRefresh}
                isLoading={isLoading}
              />
            )}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <SofiaNotifications
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onArchive={handleArchiveNotification}
              onView={handleViewNotification}
              onRefresh={handleRefresh}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SofiaDashboardModular;
