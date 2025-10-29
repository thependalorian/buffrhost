'use client';
import {
  BuffrIcon,
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrBadge,
} from '@/components/ui';
/**
 * Recommendation Engine BI Dashboard
 * Displays recommendation model performance and insights
 */

import React, { useState, useEffect } from 'react';
import { MLDashboardLayout } from '@/components/features/bi/MLDashboardLayout';
import { ModelMetricsCard } from '@/components/features/bi/ModelMetricsCard';
import {
  biService,
  BIMetrics,
  PredictionData,
} from '@/lib/services/bi-service';
import { PredictionChart } from '@/components/features/bi/PredictionChart';

export default function RecommendationsDashboard() {
  const [metrics, setMetrics] = useState<BIMetrics | null>(null);
  const [performance, setPerformance] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, performanceData, qualityData] = await Promise.all([
        biService.getRecommendationMetrics(),
        biService.getRecommendationPerformance(),
        biService.getDataQualityMetrics(),
      ]);

      setMetrics(metricsData);
      setPerformance(performanceData);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to load recommendations dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleExport = () => {
    biService.exportData('recommendations', 'excel');
  };

  const handleConfigure = () => {
    console.log('Configure recommendation engine');
  };

  const getStatus = () => {
    if (!metrics) return 'error';
    if (metrics.accuracy < 0.7) return 'warning';
    return 'healthy';
  };

  const modelMetrics = metrics
    ? [
        {
          name: 'Click-Through Rate',
          value: metrics.accuracy * 100,
          target: 15,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.accuracy >= 0.15 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Conversion Rate',
          value: metrics.precision * 100,
          target: 8,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.precision >= 0.08
              ? ('good' as const)
              : ('warning' as const),
        },
        {
          name: 'User Engagement',
          value: metrics.recall * 100,
          target: 25,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.recall >= 0.25 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Recommendation Quality',
          value: metrics.f1Score * 100,
          target: 20,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.f1Score >= 0.2 ? ('good' as const) : ('warning' as const),
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nude-900"></div>
      </div>
    );
  }

  return (
    <MLDashboardLayout
      title="Recommendation Engine Dashboard"
      description="Monitor recommendation model performance and user engagement"
      status={getStatus()}
      lastUpdated={lastUpdated}
      onRefresh={handleRefresh}
      onExport={handleExport}
      onConfigure={handleConfigure}
    >
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Click-Through Rate
            </BuffrCardTitle>
            <BuffrIcon
              name="lightbulb"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">
              {metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              +1.2% from last week
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Recommendations Sent
            </BuffrCardTitle>
            <BuffrIcon
              name="trending-up"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">12,456</div>
            <p className="text-xs text-muted-foreground">+15% from yesterday</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Active Users
            </BuffrCardTitle>
            <BuffrIcon name="users" className="h-4 w-4 text-muted-foreground" />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">8,234</div>
            <p className="text-xs text-muted-foreground">
              +3.1% from last month
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Avg. Rating
            </BuffrCardTitle>
            <BuffrIcon name="star" className="h-4 w-4 text-muted-foreground" />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-muted-foreground">+0.1 from last week</p>
          </BuffrCardContent>
        </BuffrCard>
      </div>

      {/* Model Performance */}
      <ModelMetricsCard
        title="Recommendation Model Performance"
        metrics={modelMetrics}
        modelVersion="v4.1.2"
        lastTrained="3 hours ago"
      />

      {/* Performance Trends */}
      <PredictionChart
        title="Recommendation Performance Trends"
        data={performance}
        type="line"
        showConfidence={true}
        showActual={true}
        height={400}
      />

      {/* Top Recommendations */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Top Performing Recommendations</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-4">
            {[
              { item: 'Premium Room Upgrade', ctr: 23.4, conversions: 156 },
              { item: 'Spa Package Deal', ctr: 18.7, conversions: 89 },
              { item: 'Restaurant Reservation', ctr: 15.2, conversions: 234 },
              { item: 'Concierge Service', ctr: 12.8, conversions: 67 },
              { item: 'Local Experience', ctr: 11.3, conversions: 45 },
            ].map((rec, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{rec.item}</p>
                  <p className="text-sm text-muted-foreground">
                    {rec.conversions} conversions
                  </p>
                </div>
                <div className="text-right">
                  <BuffrBadge variant="outline">{rec.ctr}% CTR</BuffrBadge>
                </div>
              </div>
            ))}
          </div>
        </BuffrCardContent>
      </BuffrCard>
    </MLDashboardLayout>
  );
}
