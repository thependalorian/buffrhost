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
 * Predictive Analytics BI Dashboard
 * Displays predictive analytics forecasts and trends
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
export default function PredictiveAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<BIMetrics | null>(null);
  const [forecasts, setForecasts] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, forecastsData, qualityData] = await Promise.all([
        biService.getPredictiveAnalyticsMetrics(),
        biService.getPredictiveAnalyticsForecasts(),
        biService.getDataQualityMetrics(),
      ]);

      setMetrics(metricsData);
      setForecasts(forecastsData);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error(
        'Failed to load predictive analytics dashboard data:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleExport = () => {
    biService.exportData('predictive-analytics', 'excel');
  };

  const handleConfigure = () => {
    console.log('Configure predictive analytics');
  };

  const getStatus = () => {
    if (!metrics) return 'error';
    if (metrics.accuracy < 0.8) return 'warning';
    return 'healthy';
  };

  const modelMetrics = metrics
    ? [
        {
          name: 'Forecast Accuracy',
          value: metrics.accuracy * 100,
          target: 85,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.accuracy >= 0.85 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Prediction Confidence',
          value: metrics.precision * 100,
          target: 80,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.precision >= 0.8 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Model Reliability',
          value: metrics.recall * 100,
          target: 75,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.recall >= 0.75 ? ('good' as const) : ('warning' as const),
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
      title="Predictive Analytics Dashboard"
      description="Monitor predictive analytics forecasts and model performance"
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
              Active Forecasts
            </BuffrCardTitle>
            <BuffrIcon
              name="trending-up"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Running predictions</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Forecast Accuracy
            </BuffrCardTitle>
            <BuffrIcon
              name="target"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">
              {metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">Average accuracy</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Predictions Today
            </BuffrCardTitle>
            <BuffrIcon
              name="bar-chart-3"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">1,456</div>
            <p className="text-xs text-muted-foreground">
              +8.3% from yesterday
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Forecast Horizon
            </BuffrCardTitle>
            <BuffrIcon
              name="calendar"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">30 days</div>
            <p className="text-xs text-muted-foreground">Average horizon</p>
          </BuffrCardContent>
        </BuffrCard>
      </div>

      {/* Model Performance */}
      <ModelMetricsCard
        title="Predictive Analytics Performance"
        metrics={modelMetrics}
        modelVersion="v3.4.2"
        lastTrained="2 days ago"
      />

      {/* Forecast Trends */}
      <PredictionChart
        title="Revenue Forecast Trends"
        data={forecasts}
        type="line"
        showConfidence={true}
        showActual={true}
        height={400}
      />

      {/* Active Forecasts */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Active Forecasts</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-4">
            {[
              {
                name: 'Revenue Forecast',
                horizon: '30 days',
                accuracy: 89,
                confidence: 92,
                status: 'active',
              },
              {
                name: 'Customer Growth',
                horizon: '90 days',
                accuracy: 85,
                confidence: 88,
                status: 'active',
              },
              {
                name: 'Demand Prediction',
                horizon: '14 days',
                accuracy: 91,
                confidence: 94,
                status: 'active',
              },
              {
                name: 'Churn Risk',
                horizon: '7 days',
                accuracy: 87,
                confidence: 90,
                status: 'active',
              },
              {
                name: 'Price Optimization',
                horizon: '21 days',
                accuracy: 83,
                confidence: 86,
                status: 'active',
              },
            ].map((forecast, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{forecast.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {forecast.horizon} forecast horizon
                    </p>
                  </div>
                  <BuffrBadge variant="outline">{forecast.status}</BuffrBadge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Accuracy</p>
                    <p className="font-semibold">{forecast.accuracy}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Confidence</p>
                    <p className="font-semibold">{forecast.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Horizon</p>
                    <p className="font-semibold">{forecast.horizon}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <BuffrBadge variant="outline">{forecast.status}</BuffrBadge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BuffrCardContent>
      </BuffrCard>

      {/* Forecast Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Forecast Categories</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="space-y-3">
              {[
                {
                  category: 'Financial',
                  forecasts: 8,
                  accuracy: 89,
                  impact: 'high',
                },
                {
                  category: 'Operational',
                  forecasts: 6,
                  accuracy: 85,
                  impact: 'medium',
                },
                {
                  category: 'Customer',
                  forecasts: 5,
                  accuracy: 91,
                  impact: 'high',
                },
                {
                  category: 'Market',
                  forecasts: 3,
                  accuracy: 87,
                  impact: 'medium',
                },
                {
                  category: 'Risk',
                  forecasts: 2,
                  accuracy: 83,
                  impact: 'high',
                },
              ].map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{category.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.forecasts} forecasts
                    </p>
                  </div>
                  <div className="text-right">
                    <BuffrBadge variant="outline">
                      {category.accuracy}% accuracy
                    </BuffrBadge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.impact} impact
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Prediction Insights</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="space-y-3">
              {[
                {
                  insight: 'Revenue will increase by 12%',
                  confidence: 89,
                  timeframe: 'Next 30 days',
                },
                {
                  insight: 'Customer acquisition will peak',
                  confidence: 85,
                  timeframe: 'Next 14 days',
                },
                {
                  insight: 'Churn risk is decreasing',
                  confidence: 92,
                  timeframe: 'Next 7 days',
                },
                {
                  insight: 'Demand will surge',
                  confidence: 87,
                  timeframe: 'Next 21 days',
                },
              ].map((insight, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <p className="font-medium mb-1">{insight.insight}</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{insight.timeframe}</span>
                    <span>{insight.confidence}% confidence</span>
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
