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
 * MLOps Infrastructure BI Dashboard
 * Monitors MLOps pipeline performance and infrastructure health
 */

import React, { useState, useEffect } from 'react';
import { MLDashboardLayout } from '@/components/features/bi/MLDashboardLayout';
import { ModelMetricsCard } from '@/components/features/bi/ModelMetricsCard';
import { biService, BIMetrics } from '@/lib/services/bi-service';
export default function MLOpsDashboard() {
  const [metrics, setMetrics] = useState<BIMetrics | null>(null);
  const [pipelineStatus, setPipelineStatus] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, pipelineData, qualityData] = await Promise.all([
        biService.getMLOpsMetrics(),
        biService.getMLOpsPipelineStatus(),
        biService.getDataQualityMetrics(),
      ]);

      setMetrics(metricsData);
      setPipelineStatus(pipelineData);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to load MLOps dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleExport = () => {
    biService.exportData('mlops', 'excel');
  };

  const handleConfigure = () => {
    console.log('Configure MLOps infrastructure');
  };

  const getStatus = () => {
    if (!metrics) return 'error';
    if (metrics.accuracy < 0.8) return 'warning';
    return 'healthy';
  };

  const modelMetrics = metrics
    ? [
        {
          name: 'Pipeline Success Rate',
          value: metrics.accuracy * 100,
          target: 95,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.accuracy >= 0.95 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Deployment Success',
          value: metrics.precision * 100,
          target: 90,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.precision >= 0.9 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Model Performance',
          value: metrics.recall * 100,
          target: 85,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.recall >= 0.85 ? ('good' as const) : ('warning' as const),
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
      title="MLOps Infrastructure Dashboard"
      description="Monitor MLOps pipeline performance and infrastructure health"
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
              Active Pipelines
            </BuffrCardTitle>
            <BuffrIcon
              name="settings"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">{pipelineStatus.length}</div>
            <p className="text-xs text-muted-foreground">Running pipelines</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Success Rate
            </BuffrCardTitle>
            <BuffrIcon
              name="check-circle"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">
              {metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">Pipeline success</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Deployments
            </BuffrCardTitle>
            <BuffrIcon
              name="activity"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Alerts
            </BuffrCardTitle>
            <BuffrIcon
              name="alert-triangle"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active alerts</p>
          </BuffrCardContent>
        </BuffrCard>
      </div>

      {/* Model Performance */}
      <ModelMetricsCard
        title="MLOps Infrastructure Performance"
        metrics={modelMetrics}
        modelVersion="v4.1.2"
        lastTrained="2 hours ago"
      />

      {/* Pipeline Status */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Pipeline Status</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-4">
            {pipelineStatus.slice(0, 8).map((pipeline, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{pipeline.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {pipeline.description}
                    </p>
                  </div>
                  <BuffrBadge
                    variant={
                      pipeline.status === 'running' ? 'default' : 'secondary'
                    }
                  >
                    {pipeline.status}
                  </BuffrBadge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-semibold">{pipeline.duration}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Success Rate</p>
                    <p className="font-semibold">{pipeline.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Run</p>
                    <p className="font-semibold">{pipeline.lastRun}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Run</p>
                    <p className="font-semibold">{pipeline.nextRun}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BuffrCardContent>
      </BuffrCard>

      {/* Infrastructure Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Infrastructure Health</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="space-y-4">
              {[
                {
                  component: 'Training Cluster',
                  status: 'healthy',
                  cpu: 45,
                  memory: 67,
                },
                {
                  component: 'Inference Server',
                  status: 'healthy',
                  cpu: 32,
                  memory: 54,
                },
                {
                  component: 'Data Pipeline',
                  status: 'warning',
                  cpu: 78,
                  memory: 89,
                },
                {
                  component: 'Model Registry',
                  status: 'healthy',
                  cpu: 23,
                  memory: 34,
                },
                {
                  component: 'Monitoring System',
                  status: 'healthy',
                  cpu: 12,
                  memory: 28,
                },
              ].map((component, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{component.component}</p>
                    <p className="text-sm text-muted-foreground">
                      CPU: {component.cpu}% • Memory: {component.memory}%
                    </p>
                  </div>
                  <BuffrBadge
                    variant={
                      component.status === 'healthy' ? 'default' : 'destructive'
                    }
                  >
                    {component.status}
                  </BuffrBadge>
                </div>
              ))}
            </div>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Deployment History</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="space-y-3">
              {[
                {
                  model: 'Fraud Detection v1.8',
                  status: 'deployed',
                  date: '1 day ago',
                  environment: 'production',
                },
                {
                  model: 'Recommendations v3.2',
                  status: 'deploying',
                  date: '3 hours ago',
                  environment: 'staging',
                },
                {
                  model: 'Churn Prediction v1.5',
                  status: 'failed',
                  date: '2 days ago',
                  environment: 'staging',
                },
                {
                  model: 'Dynamic Pricing v2.0',
                  status: 'deployed',
                  date: '3 days ago',
                  environment: 'production',
                },
              ].map((deployment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{deployment.model}</p>
                    <p className="text-sm text-muted-foreground">
                      {deployment.environment} • {deployment.date}
                    </p>
                  </div>
                  <BuffrBadge
                    variant={
                      deployment.status === 'deployed'
                        ? 'default'
                        : deployment.status === 'deploying'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {deployment.status}
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
