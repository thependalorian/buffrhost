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
 * Churn Prediction BI Dashboard
 * Monitors customer churn prediction model performance
 */

import React, { useState, useEffect } from 'react';
import { MLDashboardLayout } from '@/components/features/bi/MLDashboardLayout';
import { ModelMetricsCard } from '@/components/features/bi/ModelMetricsCard';
import { biService, BIMetrics } from '@/lib/services/bi-service';
export default function ChurnPredictionDashboard() {
  const [metrics, setMetrics] = useState<BIMetrics | null>(null);
  const [riskCustomers, setRiskCustomers] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, riskData] = await Promise.all([
        biService.getChurnPredictionMetrics(),
        biService.getChurnRiskCustomers(),
      ]);

      setMetrics(metricsData);
      setRiskCustomers(riskData);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to load churn prediction dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleExport = () => {
    biService.exportData('churn-prediction', 'excel');
  };

  const handleConfigure = () => {
    console.log('Configure churn prediction model');
  };

  const getStatus = () => {
    if (!metrics) return 'error';
    if (metrics.accuracy < 0.8) return 'warning';
    return 'healthy';
  };

  const modelMetrics = metrics
    ? [
        {
          name: 'Prediction Accuracy',
          value: metrics.accuracy * 100,
          target: 85,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.accuracy >= 0.85 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'False Positive Rate',
          value: (1 - metrics.precision) * 100,
          target: 10,
          unit: '%',
          trend: 'down' as const,
          status:
            1 - metrics.precision <= 0.1
              ? ('good' as const)
              : ('warning' as const),
        },
        {
          name: 'Recall Rate',
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
      title="Churn Prediction Dashboard"
      description="Monitor customer churn prediction model and at-risk customers"
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
              Churn Rate
            </BuffrCardTitle>
            <BuffrIcon
              name="trending-down"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">12.3%</div>
            <p className="text-xs text-muted-foreground">
              -2.1% from last month
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              At-Risk Customers
            </BuffrCardTitle>
            <BuffrIcon
              name="alert-triangle"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">{riskCustomers.length}</div>
            <p className="text-xs text-muted-foreground">
              High risk identified
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Retention Rate
            </BuffrCardTitle>
            <BuffrIcon
              name="target"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">87.7%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% from last month
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Total Customers
            </BuffrCardTitle>
            <BuffrIcon name="users" className="h-4 w-4 text-muted-foreground" />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">45,678</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </BuffrCardContent>
        </BuffrCard>
      </div>

      {/* Model Performance */}
      <ModelMetricsCard
        title="Churn Prediction Model Performance"
        metrics={modelMetrics}
        modelVersion="v2.4.1"
        lastTrained="8 hours ago"
      />

      {/* At-Risk Customers */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>High-Risk Customers</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-4">
            {riskCustomers.slice(0, 10).map((customer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-nude-200 flex items-center justify-center">
                    <BuffrIcon name="users" className="h-5 w-5 text-nude-500" />
                  </div>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.email} • Last activity: {customer.lastActivity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <BuffrBadge
                    variant={
                      customer.riskLevel === 'high'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {customer.riskLevel} risk
                  </BuffrBadge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {customer.churnProbability}% probability
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
