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
 * A/B Testing Framework BI Dashboard
 * Displays A/B testing results and experiment performance
 */

import React, { useState, useEffect } from 'react';
import { MLDashboardLayout } from '@/components/features/bi/MLDashboardLayout';
import { ModelMetricsCard } from '@/components/features/bi/ModelMetricsCard';
import { biService, BIMetrics } from '@/lib/services/bi-service';
export default function ABTestingDashboard() {
  const [metrics, setMetrics] = useState<BIMetrics | null>(null);
  const [results, setResults] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, resultsData] = await Promise.all([
        biService.getABTestingMetrics(),
        biService.getABTestResults(),
      ]);

      setMetrics(metricsData);
      setResults(resultsData);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to load A/B testing dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleExport = () => {
    biService.exportData('ab-testing', 'excel');
  };

  const handleConfigure = () => {
    console.log('Configure A/B testing framework');
  };

  const getStatus = () => {
    if (!metrics) return 'error';
    if (metrics.accuracy < 0.8) return 'warning';
    return 'healthy';
  };

  const modelMetrics = metrics
    ? [
        {
          name: 'Statistical Significance',
          value: metrics.accuracy * 100,
          target: 95,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.accuracy >= 0.95 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Conversion Rate Lift',
          value: metrics.precision * 100,
          target: 10,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.precision >= 0.1 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Test Completion Rate',
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
      title="A/B Testing Framework Dashboard"
      description="Monitor A/B testing experiments and statistical significance"
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
              Active Tests
            </BuffrCardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Running experiments</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Completed Tests
            </BuffrCardTitle>
            <BuffrIcon
              name="target"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Avg. Lift
            </BuffrCardTitle>
            <BuffrIcon
              name="trending-up"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">+8.3%</div>
            <p className="text-xs text-muted-foreground">
              Conversion improvement
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Success Rate
            </BuffrCardTitle>
            <BuffrIcon
              name="bar-chart-3"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground">Winning experiments</p>
          </BuffrCardContent>
        </BuffrCard>
      </div>

      {/* Model Performance */}
      <ModelMetricsCard
        title="A/B Testing Framework Performance"
        metrics={modelMetrics}
        modelVersion="v1.9.2"
        lastTrained="3 days ago"
      />

      {/* Active Experiments */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Active Experiments</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-4">
            {results
              .filter((r) => r.status === 'active')
              .map((experiment, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{experiment.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {experiment.description}
                      </p>
                    </div>
                    <BuffrBadge variant="outline">
                      {experiment.status}
                    </BuffrBadge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {experiment.participants}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Participants
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {experiment.duration} days
                      </div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {experiment.conversionA}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Control (A)
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {experiment.conversionB}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Variant (B)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </BuffrCardContent>
      </BuffrCard>

      {/* Recent Results */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Recent Test Results</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-4">
            {results
              .filter((r) => r.status === 'completed')
              .slice(0, 5)
              .map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">{result.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Completed {result.completedDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <BuffrBadge
                      variant={result.winner === 'B' ? 'default' : 'secondary'}
                    >
                      {result.winner === 'B' ? 'Winner: B' : 'No Winner'}
                    </BuffrBadge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.lift > 0 ? '+' : ''}
                      {result.lift}% lift
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
