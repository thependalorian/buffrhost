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
 * Fraud Detection BI Dashboard
 * Monitors fraud detection model performance and alerts
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

export default function FraudDetectionDashboard() {
  const [metrics, setMetrics] = useState<BIMetrics | null>(null);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [alerts, setAlerts] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, predictionsData, alertsData, qualityData] =
        await Promise.all([
          biService.getFraudDetectionMetrics(),
          biService.getFraudDetectionAlerts(),
          biService.getFraudDetectionAlerts(),
          biService.getDataQualityMetrics(),
        ]);

      setMetrics(metricsData);
      setPredictions(predictionsData);
      setAlerts(alertsData);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to load fraud detection dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleExport = () => {
    biService.exportData('fraud-detection', 'excel');
  };

  const handleConfigure = () => {
    console.log('Configure fraud detection model');
  };

  const getStatus = () => {
    if (!metrics) return 'error';
    if (metrics.accuracy < 0.9) return 'warning';
    return 'healthy';
  };

  const modelMetrics = metrics
    ? [
        {
          name: 'Detection Rate',
          value: metrics.accuracy * 100,
          target: 95,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.accuracy >= 0.95 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'False Positive Rate',
          value: (1 - metrics.precision) * 100,
          target: 5,
          unit: '%',
          trend: 'down' as const,
          status:
            1 - metrics.precision <= 0.05
              ? ('good' as const)
              : ('warning' as const),
        },
        {
          name: 'Response Time',
          value: 45,
          target: 30,
          unit: 'ms',
          trend: 'down' as const,
          status: 'warning' as const,
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
      title="Fraud Detection Dashboard"
      description="Monitor fraud detection model performance and security alerts"
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
              Detection Rate
            </BuffrCardTitle>
            <BuffrIcon
              name="shield"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">
              {metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              +0.3% from last week
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Active Alerts
            </BuffrCardTitle>
            <BuffrIcon
              name="alert-triangle"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {alerts.filter((a) => a.severity === 'high').length} high priority
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Transactions Monitored
            </BuffrCardTitle>
            <BuffrIcon
              name="trending-up"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">45,678</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from yesterday
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              False Positives
            </BuffrCardTitle>
            <BuffrIcon name="eye" className="h-4 w-4 text-muted-foreground" />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">2.1%</div>
            <p className="text-xs text-muted-foreground">
              -0.5% from last month
            </p>
          </BuffrCardContent>
        </BuffrCard>
      </div>

      {/* Model Performance */}
      <ModelMetricsCard
        title="Fraud Detection Model Performance"
        metrics={modelMetrics}
        modelVersion="v3.2.1"
        lastTrained="1 hour ago"
      />

      {/* Recent Alerts */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Recent Fraud Alerts</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-4">
            {alerts.slice(0, 5).map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <BuffrBadge
                    variant={
                      alert.severity === 'high' ? 'destructive' : 'secondary'
                    }
                  >
                    {alert.severity}
                  </BuffrBadge>
                  <div>
                    <p className="font-medium">{alert.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.description}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {alert.timestamp}
                </div>
              </div>
            ))}
          </div>
        </BuffrCardContent>
      </BuffrCard>

      {/* Detection Trends */}
      <PredictionChart
        title="Fraud Detection Trends"
        data={predictions}
        type="line"
        showConfidence={true}
        showActual={true}
        height={400}
      />
    </MLDashboardLayout>
  );
}
