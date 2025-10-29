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
 * Data Visualization BI Dashboard
 * Displays data visualization metrics and chart performance
 */

import React, { useState, useEffect } from 'react';
import { MLDashboardLayout } from '@/components/features/bi/MLDashboardLayout';
import { ModelMetricsCard } from '@/components/features/bi/ModelMetricsCard';
import { biService, BIMetrics } from '@/lib/services/bi-service';

export default function DataVisualizationDashboard() {
  const [metrics, setMetrics] = useState<BIMetrics | null>(null);
  const [charts, setCharts] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, chartsData] = await Promise.all([
        biService.getDataVisualizationMetrics(),
        biService.getDataVisualizationCharts(),
      ]);

      setMetrics(metricsData);
      setCharts(chartsData);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to load data visualization dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleExport = () => {
    biService.exportData('data-visualization', 'excel');
  };

  const handleConfigure = () => {
    console.log('Configure data visualization');
  };

  const getStatus = () => {
    if (!metrics) return 'error';
    if (metrics.accuracy < 0.8) return 'warning';
    return 'healthy';
  };

  const modelMetrics = metrics
    ? [
        {
          name: 'Rendering Performance',
          value: metrics.accuracy * 100,
          target: 90,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.accuracy >= 0.9 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Chart Accuracy',
          value: metrics.precision * 100,
          target: 95,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.precision >= 0.95
              ? ('good' as const)
              : ('warning' as const),
        },
        {
          name: 'User Engagement',
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
      title="Data Visualization Dashboard"
      description="Monitor data visualization performance and chart metrics"
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
              Active Charts
            </BuffrCardTitle>
            <BuffrIcon
              name="bar-chart-3"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">{charts.length}</div>
            <p className="text-xs text-muted-foreground">Visualizations</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Views Today
            </BuffrCardTitle>
            <BuffrIcon name="eye" className="h-4 w-4 text-muted-foreground" />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">12,456</div>
            <p className="text-xs text-muted-foreground">+15% from yesterday</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Avg. Load Time
            </BuffrCardTitle>
            <BuffrIcon
              name="trending-up"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">Chart rendering</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Chart Types
            </BuffrCardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Different types</p>
          </BuffrCardContent>
        </BuffrCard>
      </div>

      {/* Model Performance */}
      <ModelMetricsCard
        title="Data Visualization Performance"
        metrics={modelMetrics}
        modelVersion="v1.7.3"
        lastTrained="4 hours ago"
      />

      {/* Popular Charts */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Popular Visualizations</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-4">
            {charts.slice(0, 6).map((chart, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{chart.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {chart.description}
                    </p>
                  </div>
                  <BuffrBadge variant="outline">{chart.type}</BuffrBadge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <p className="font-semibold">{chart.views}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Load Time</p>
                    <p className="font-semibold">{chart.loadTime}ms</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data Points</p>
                    <p className="font-semibold">{chart.dataPoints}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <BuffrBadge variant="outline">{chart.status}</BuffrBadge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BuffrCardContent>
      </BuffrCard>

      {/* Chart Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Chart Performance</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="space-y-4">
              {[
                {
                  type: 'Line Charts',
                  performance: 95,
                  usage: 34,
                  avgLoad: 1.2,
                },
                {
                  type: 'Bar Charts',
                  performance: 92,
                  usage: 28,
                  avgLoad: 0.8,
                },
                {
                  type: 'Pie Charts',
                  performance: 89,
                  usage: 18,
                  avgLoad: 0.6,
                },
                {
                  type: 'Scatter Plots',
                  performance: 87,
                  usage: 12,
                  avgLoad: 1.5,
                },
                { type: 'Heat Maps', performance: 85, usage: 8, avgLoad: 2.1 },
              ].map((chart, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{chart.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {chart.usage}% usage
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {chart.performance}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {chart.avgLoad}s avg load
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Visualization Insights</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="space-y-4">
              {[
                {
                  insight: 'Interactive charts increase engagement by 40%',
                  metric: 'User Engagement',
                  impact: '+40%',
                },
                {
                  insight: 'Real-time updates improve decision making',
                  metric: 'Decision Speed',
                  impact: '+25%',
                },
                {
                  insight: 'Color-coded data enhances comprehension',
                  metric: 'Data Understanding',
                  impact: '+35%',
                },
                {
                  insight: 'Mobile-optimized charts increase accessibility',
                  metric: 'Mobile Usage',
                  impact: '+60%',
                },
              ].map((insight, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <p className="font-medium mb-2">{insight.insight}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {insight.metric}
                    </span>
                    <span className="font-semibold text-semantic-success">
                      {insight.impact}
                    </span>
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
