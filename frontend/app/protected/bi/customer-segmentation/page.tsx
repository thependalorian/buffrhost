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
 * Customer Segmentation BI Dashboard
 * Displays customer segmentation model performance and clusters
 */

import React, { useState, useEffect } from 'react';
import { MLDashboardLayout } from '@/components/features/bi/MLDashboardLayout';
import { ModelMetricsCard } from '@/components/features/bi/ModelMetricsCard';
import { biService, BIMetrics } from '@/lib/services/bi-service';
export default function CustomerSegmentationDashboard() {
  const [metrics, setMetrics] = useState<BIMetrics | null>(null);
  const [clusters, setClusters] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, clustersData] = await Promise.all([
        biService.getCustomerSegmentationMetrics(),
        biService.getSegmentationClusters(),
      ]);

      setMetrics(metricsData);
      setClusters(clustersData);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error(
        'Failed to load customer segmentation dashboard data:',
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
    biService.exportData('customer-segmentation', 'excel');
  };

  const handleConfigure = () => {
    console.log('Configure customer segmentation model');
  };

  const getStatus = () => {
    if (!metrics) return 'error';
    if (metrics.accuracy < 0.8) return 'warning';
    return 'healthy';
  };

  const modelMetrics = metrics
    ? [
        {
          name: 'Silhouette Score',
          value: metrics.accuracy * 100,
          target: 70,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.accuracy >= 0.7 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Cluster Purity',
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
          name: 'Separation Quality',
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
      title="Customer Segmentation Dashboard"
      description="Monitor customer segmentation model performance and cluster insights"
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
              Total Segments
            </BuffrCardTitle>
            <BuffrIcon name="users" className="h-4 w-4 text-muted-foreground" />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">{clusters.length}</div>
            <p className="text-xs text-muted-foreground">
              Active customer segments
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Segmentation Quality
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
            <p className="text-xs text-muted-foreground">Silhouette score</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Customers Segmented
            </BuffrCardTitle>
            <BuffrIcon
              name="trending-up"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">45,678</div>
            <p className="text-xs text-muted-foreground">
              +2.3% from last month
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Avg. Cluster Size
            </BuffrCardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">7,613</div>
            <p className="text-xs text-muted-foreground">
              Customers per segment
            </p>
          </BuffrCardContent>
        </BuffrCard>
      </div>

      {/* Model Performance */}
      <ModelMetricsCard
        title="Segmentation Model Performance"
        metrics={modelMetrics}
        modelVersion="v2.3.1"
        lastTrained="6 hours ago"
      />

      {/* Customer Segments */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Customer Segments</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clusters.map((cluster, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{cluster.name}</h3>
                  <BuffrBadge variant="outline">
                    {cluster.size} customers
                  </BuffrBadge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {cluster.description}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Avg. Value:</span>
                    <span>${cluster.avgValue}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Engagement:</span>
                    <span>{cluster.engagement}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Growth:</span>
                    <span
                      className={
                        cluster.growth > 0
                          ? 'text-semantic-success'
                          : 'text-semantic-error'
                      }
                    >
                      {cluster.growth > 0 ? '+' : ''}
                      {cluster.growth}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BuffrCardContent>
      </BuffrCard>

      {/* Segmentation Trends */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Segmentation Trends</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <PieChart className="h-12 w-12 mx-auto mb-2" />
              <p>Segmentation trend visualization</p>
              <p className="text-sm">
                Chart component would be implemented here
              </p>
            </div>
          </div>
        </BuffrCardContent>
      </BuffrCard>
    </MLDashboardLayout>
  );
}
