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
 * Spending Analysis NLP BI Dashboard
 * Displays NLP-based spending analysis insights
 */

import React, { useState, useEffect } from 'react';
import { MLDashboardLayout } from '@/components/features/bi/MLDashboardLayout';
import { ModelMetricsCard } from '@/components/features/bi/ModelMetricsCard';
import { biService, BIMetrics } from '@/lib/services/bi-service';
export default function SpendingAnalysisDashboard() {
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
      const [metricsData, insightsData, qualityData] = await Promise.all([
        biService.getSpendingAnalysisMetrics(),
        biService.getSpendingInsights(),
        biService.getDataQualityMetrics(),
      ]);

      setMetrics(metricsData);
      setInsights(insightsData);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to load spending analysis dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleExport = () => {
    biService.exportData('spending-analysis', 'excel');
  };

  const handleConfigure = () => {
    console.log('Configure spending analysis NLP model');
  };

  const getStatus = () => {
    if (!metrics) return 'error';
    if (metrics.accuracy < 0.8) return 'warning';
    return 'healthy';
  };

  const modelMetrics = metrics
    ? [
        {
          name: 'Sentiment Accuracy',
          value: metrics.accuracy * 100,
          target: 85,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.accuracy >= 0.85 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Category Classification',
          value: metrics.precision * 100,
          target: 90,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.precision >= 0.9 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Intent Recognition',
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
      title="Spending Analysis NLP Dashboard"
      description="Monitor NLP-based spending analysis and customer insights"
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
              Avg. Spending
            </BuffrCardTitle>
            <BuffrIcon
              name="dollar-sign"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">$1,234</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Transactions Analyzed
            </BuffrCardTitle>
            <BuffrIcon
              name="bar-chart-3"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">12,456</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Sentiment Score
            </BuffrCardTitle>
            <BuffrIcon
              name="message-square"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">7.8</div>
            <p className="text-xs text-muted-foreground">Positive sentiment</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Categories Identified
            </BuffrCardTitle>
            <BuffrIcon
              name="trending-up"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Spending categories</p>
          </BuffrCardContent>
        </BuffrCard>
      </div>

      {/* Model Performance */}
      <ModelMetricsCard
        title="NLP Model Performance"
        metrics={modelMetrics}
        modelVersion="v1.8.2"
        lastTrained="12 hours ago"
      />

      {/* Spending Insights */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Key Spending Insights</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-4">
            {insights.slice(0, 8).map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
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
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {insight.impact > 0 ? '+' : ''}
                      {insight.impact}%
                    </div>
                    <p className="text-xs text-muted-foreground">Impact</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BuffrCardContent>
      </BuffrCard>

      {/* Spending Categories */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Top Spending Categories</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-3">
            {[
              {
                category: 'Dining & Restaurants',
                amount: 45678,
                percentage: 32.4,
                trend: '+5.2%',
              },
              {
                category: 'Accommodation',
                amount: 34567,
                percentage: 24.6,
                trend: '+2.1%',
              },
              {
                category: 'Entertainment',
                amount: 23456,
                percentage: 16.7,
                trend: '+8.3%',
              },
              {
                category: 'Transportation',
                amount: 12345,
                percentage: 8.8,
                trend: '-1.2%',
              },
              {
                category: 'Shopping',
                amount: 9876,
                percentage: 7.0,
                trend: '+3.4%',
              },
            ].map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{category.category}</p>
                  <p className="text-sm text-muted-foreground">
                    {category.percentage}% of total spending
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    ${category.amount.toLocaleString()}
                  </div>
                  <p
                    className={`text-sm ${category.trend.startsWith('+') ? 'text-semantic-success' : 'text-semantic-error'}`}
                  >
                    {category.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </BuffrCardContent>
      </BuffrCard>
    </MLDashboardLayout>
  );
}
