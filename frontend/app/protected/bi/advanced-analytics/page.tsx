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
 * Advanced Analytics BI Dashboard
 * Displays advanced analytics insights and patterns
 */

import React, { useState, useEffect } from 'react';
import { MLDashboardLayout } from '@/components/features/bi/MLDashboardLayout';
import { ModelMetricsCard } from '@/components/features/bi/ModelMetricsCard';
import { biService, BIMetrics } from '@/lib/services/bi-service';
export default function AdvancedAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<BIMetrics | null>(null);
  const [insights, setInsights] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, insightsData] = await Promise.all([
        biService.getAdvancedAnalyticsMetrics(),
        biService.getAdvancedAnalyticsInsights(),
      ]);

      setMetrics(metricsData);
      setInsights(insightsData);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to load advanced analytics dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleExport = () => {
    biService.exportData('advanced-analytics', 'excel');
  };

  const handleConfigure = () => {
    console.log('Configure advanced analytics');
  };

  const getStatus = () => {
    if (!metrics) return 'error';
    if (metrics.accuracy < 0.8) return 'warning';
    return 'healthy';
  };

  const modelMetrics = metrics
    ? [
        {
          name: 'Pattern Recognition',
          value: metrics.accuracy * 100,
          target: 85,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.accuracy >= 0.85 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Insight Quality',
          value: metrics.precision * 100,
          target: 90,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.precision >= 0.9 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Anomaly Detection',
          value: metrics.recall * 100,
          target: 80,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.recall >= 0.8 ? ('good' as const) : ('warning' as const),
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
      title="Advanced Analytics Dashboard"
      description="Monitor advanced analytics insights and pattern recognition"
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
              Insights Generated
            </BuffrCardTitle>
            <BuffrIcon name="brain" className="h-4 w-4 text-muted-foreground" />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Patterns Detected
            </BuffrCardTitle>
            <BuffrIcon
              name="bar-chart-3"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">
              +23% from last month
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Anomalies Found
            </BuffrCardTitle>
            <BuffrIcon
              name="target"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Critical insights</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Accuracy Rate
            </BuffrCardTitle>
            <BuffrIcon
              name="trending-up"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">
              {metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">Prediction accuracy</p>
          </BuffrCardContent>
        </BuffrCard>
      </div>

      {/* Model Performance */}
      <ModelMetricsCard
        title="Advanced Analytics Performance"
        metrics={modelMetrics}
        modelVersion="v4.2.1"
        lastTrained="6 hours ago"
      />

      {/* Key Insights */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Key Insights</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-4">
            {insights.slice(0, 6).map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {insight.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <BuffrBadge variant="outline">
                        {insight.category}
                      </BuffrBadge>
                      <span className="text-sm text-muted-foreground">
                        Confidence: {insight.confidence}%
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Impact: {insight.impact > 0 ? '+' : ''}
                        {insight.impact}%
                      </span>
                    </div>
                  </div>
                  <BuffrBadge
                    variant={
                      insight.priority === 'high' ? 'destructive' : 'secondary'
                    }
                  >
                    {insight.priority} priority
                  </BuffrBadge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Data Points</p>
                    <p className="font-semibold">{insight.dataPoints}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Trend</p>
                    <p className="font-semibold">{insight.trend}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Timeframe</p>
                    <p className="font-semibold">{insight.timeframe}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Source</p>
                    <p className="font-semibold">{insight.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BuffrCardContent>
      </BuffrCard>

      {/* Analytics Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Analytics Categories</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="space-y-3">
              {[
                { category: 'Customer Behavior', insights: 234, accuracy: 92 },
                { category: 'Revenue Patterns', insights: 189, accuracy: 88 },
                {
                  category: 'Operational Efficiency',
                  insights: 156,
                  accuracy: 85,
                },
                { category: 'Market Trends', insights: 123, accuracy: 90 },
                { category: 'Risk Assessment', insights: 98, accuracy: 87 },
              ].map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{category.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.insights} insights
                    </p>
                  </div>
                  <div className="text-right">
                    <BuffrBadge variant="outline">
                      {category.accuracy}% accuracy
                    </BuffrBadge>
                  </div>
                </div>
              ))}
            </div>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Pattern Recognition</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="space-y-3">
              {[
                { pattern: 'Seasonal Trends', frequency: 78, confidence: 94 },
                {
                  pattern: 'Customer Lifecycle',
                  frequency: 65,
                  confidence: 89,
                },
                { pattern: 'Purchase Patterns', frequency: 82, confidence: 91 },
                { pattern: 'Usage Anomalies', frequency: 45, confidence: 86 },
                {
                  pattern: 'Demand Forecasting',
                  frequency: 71,
                  confidence: 88,
                },
              ].map((pattern, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{pattern.pattern}</p>
                    <p className="text-sm text-muted-foreground">
                      {pattern.frequency}% frequency
                    </p>
                  </div>
                  <div className="text-right">
                    <BuffrBadge variant="outline">
                      {pattern.confidence}% confidence
                    </BuffrBadge>
                  </div>
                </div>
              ))}
            </div>
          </BuffrCardContent>
        </BuffrCard>
      </div>
    </MLDashboardLayout>
  );
}
