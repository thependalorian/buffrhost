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
 * Model Monitoring BI Dashboard
 * Monitors ML model performance and drift detection
 */

import React, { useState, useEffect } from 'react';
import { MLDashboardLayout } from '@/components/features/bi/MLDashboardLayout';
import { ModelMetricsCard } from '@/components/features/bi/ModelMetricsCard';
import { biService, BIMetrics } from '@/lib/services/bi-service';
export default function ModelMonitoringDashboard() {
  const [metrics, setMetrics] = useState<BIMetrics | null>(null);
  const [drift, setDrift] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, driftData, qualityData] = await Promise.all([
        biService.getModelMonitoringMetrics(),
        biService.getModelDrift(),
        biService.getDataQualityMetrics(),
      ]);

      setMetrics(metricsData);
      setDrift(driftData);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to load model monitoring dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleExport = () => {
    biService.exportData('model-monitoring', 'excel');
  };

  const handleConfigure = () => {
    console.log('Configure model monitoring');
  };

  const getStatus = () => {
    if (!metrics) return 'error';
    if (metrics.accuracy < 0.8) return 'warning';
    return 'healthy';
  };

  const modelMetrics = metrics
    ? [
        {
          name: 'Model Health Score',
          value: metrics.accuracy * 100,
          target: 90,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.accuracy >= 0.9 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Prediction Accuracy',
          value: metrics.precision * 100,
          target: 85,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.precision >= 0.85
              ? ('good' as const)
              : ('warning' as const),
        },
        {
          name: 'Data Drift Score',
          value: (1 - metrics.recall) * 100,
          target: 10,
          unit: '%',
          trend: 'down' as const,
          status:
            1 - metrics.recall <= 0.1
              ? ('good' as const)
              : ('warning' as const),
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
      title="Model Monitoring Dashboard"
      description="Monitor ML model performance, drift, and health metrics"
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
              Monitored Models
            </BuffrCardTitle>
            <BuffrIcon
              name="shield"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Active models</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Drift Alerts
            </BuffrCardTitle>
            <BuffrIcon
              name="alert-triangle"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">{drift.length}</div>
            <p className="text-xs text-muted-foreground">Active alerts</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Avg. Health
            </BuffrCardTitle>
            <BuffrIcon
              name="activity"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">
              {metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">Model health score</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Predictions Today
            </BuffrCardTitle>
            <BuffrIcon
              name="trending-down"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">45,678</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </BuffrCardContent>
        </BuffrCard>
      </div>

      {/* Model Performance */}
      <ModelMetricsCard
        title="Model Monitoring Performance"
        metrics={modelMetrics}
        modelVersion="v3.2.1"
        lastTrained="1 hour ago"
      />

      {/* Drift Detection */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Data Drift Detection</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-4">
            {drift.slice(0, 8).map((driftItem, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{driftItem.modelName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {driftItem.description}
                    </p>
                  </div>
                  <BuffrBadge
                    variant={
                      driftItem.severity === 'high'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {driftItem.severity} drift
                  </BuffrBadge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {driftItem.driftScore}%
                    </div>
                    <p className="text-xs text-muted-foreground">Drift Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {driftItem.threshold}%
                    </div>
                    <p className="text-xs text-muted-foreground">Threshold</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {driftItem.affectedFeatures}
                    </div>
                    <p className="text-xs text-muted-foreground">Features</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {driftItem.detectedDate}
                    </div>
                    <p className="text-xs text-muted-foreground">Detected</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BuffrCardContent>
      </BuffrCard>

      {/* Model Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Model Performance Trends</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BuffrIcon name="activity" className="h-12 w-12 mx-auto mb-2" />
                <p>Performance trend chart</p>
                <p className="text-sm">
                  Chart component would be implemented here
                </p>
              </div>
            </div>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Alert Summary</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="space-y-3">
              {[
                { type: 'Data Drift', count: 3, severity: 'high' },
                {
                  type: 'Performance Degradation',
                  count: 2,
                  severity: 'medium',
                },
                { type: 'Prediction Errors', count: 1, severity: 'low' },
                { type: 'Model Timeout', count: 0, severity: 'low' },
              ].map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{alert.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.count} occurrences
                    </p>
                  </div>
                  <BuffrBadge
                    variant={
                      alert.severity === 'high' ? 'destructive' : 'secondary'
                    }
                  >
                    {alert.severity}
                  </BuffrBadge>
                </div>
              ))}
            </div>
          </BuffrCardContent>
        </BuffrCard>
      </div>
    </MLDashboardLayout>
  );
}
