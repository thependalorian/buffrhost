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
 * Business Intelligence BI Dashboard
 * Displays comprehensive business intelligence insights
 */

import React, { useState, useEffect } from 'react';
import { MLDashboardLayout } from '@/components/features/bi/MLDashboardLayout';
import { ModelMetricsCard } from '@/components/features/bi/ModelMetricsCard';
import { biService, BIMetrics } from '@/lib/services/bi-service';
export default function BusinessIntelligenceDashboard() {
  const [metrics, setMetrics] = useState<BIMetrics | null>(null);
  const [reports, setReports] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, reportsData] = await Promise.all([
        biService.getBusinessIntelligenceMetrics(),
        biService.getBusinessIntelligenceReports(),
      ]);

      setMetrics(metricsData);
      setReports(reportsData);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error(
        'Failed to load business intelligence dashboard data:',
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
    biService.exportData('business-intelligence', 'excel');
  };

  const handleConfigure = () => {
    console.log('Configure business intelligence');
  };

  const getStatus = () => {
    if (!metrics) return 'error';
    if (metrics.accuracy < 0.8) return 'warning';
    return 'healthy';
  };

  const modelMetrics = metrics
    ? [
        {
          name: 'Insight Accuracy',
          value: metrics.accuracy * 100,
          target: 85,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.accuracy >= 0.85 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Report Quality',
          value: metrics.precision * 100,
          target: 90,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.precision >= 0.9 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Data Coverage',
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
      title="Business Intelligence Dashboard"
      description="Monitor comprehensive business intelligence insights and reports"
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
              Total Revenue
            </BuffrCardTitle>
            <BuffrIcon
              name="dollar-sign"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last month
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Active Reports
            </BuffrCardTitle>
            <BuffrIcon
              name="bar-chart-3"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">
              Generated this month
            </p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              KPI Performance
            </BuffrCardTitle>
            <BuffrIcon
              name="target"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Target achievement</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Growth Rate
            </BuffrCardTitle>
            <BuffrIcon
              name="trending-up"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">+15.2%</div>
            <p className="text-xs text-muted-foreground">Year over year</p>
          </BuffrCardContent>
        </BuffrCard>
      </div>

      {/* Model Performance */}
      <ModelMetricsCard
        title="Business Intelligence Performance"
        metrics={modelMetrics}
        modelVersion="v5.1.3"
        lastTrained="1 day ago"
      />

      {/* Key Reports */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Key Business Reports</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-4">
            {reports.slice(0, 6).map((report, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {report.description}
                    </p>
                  </div>
                  <BuffrBadge variant="outline">{report.category}</BuffrBadge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Generated</p>
                    <p className="font-semibold">{report.generatedDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Frequency</p>
                    <p className="font-semibold">{report.frequency}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <p className="font-semibold">{report.views}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <BuffrBadge variant="outline">{report.status}</BuffrBadge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BuffrCardContent>
      </BuffrCard>

      {/* Business KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Financial KPIs</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="space-y-4">
              {[
                {
                  kpi: 'Revenue Growth',
                  value: '+15.2%',
                  target: '+12%',
                  status: 'exceeded',
                },
                {
                  kpi: 'Profit Margin',
                  value: '23.4%',
                  target: '20%',
                  status: 'exceeded',
                },
                {
                  kpi: 'Customer Acquisition Cost',
                  value: '$45',
                  target: '$50',
                  status: 'exceeded',
                },
                {
                  kpi: 'Lifetime Value',
                  value: '$2,340',
                  target: '$2,000',
                  status: 'exceeded',
                },
                {
                  kpi: 'Churn Rate',
                  value: '8.2%',
                  target: '<10%',
                  status: 'met',
                },
              ].map((kpi, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{kpi.kpi}</p>
                    <p className="text-sm text-muted-foreground">
                      Target: {kpi.target}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{kpi.value}</div>
                    <BuffrBadge
                      variant={
                        kpi.status === 'exceeded' ? 'default' : 'secondary'
                      }
                    >
                      {kpi.status}
                    </BuffrBadge>
                  </div>
                </div>
              ))}
            </div>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Operational KPIs</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="space-y-4">
              {[
                {
                  kpi: 'Customer Satisfaction',
                  value: '4.2/5',
                  target: '>4.0',
                  status: 'exceeded',
                },
                {
                  kpi: 'Response Time',
                  value: '2.3s',
                  target: '<3s',
                  status: 'exceeded',
                },
                {
                  kpi: 'Uptime',
                  value: '99.8%',
                  target: '99.5%',
                  status: 'exceeded',
                },
                {
                  kpi: 'Employee Productivity',
                  value: '+8.3%',
                  target: '+5%',
                  status: 'exceeded',
                },
                {
                  kpi: 'Process Efficiency',
                  value: '87%',
                  target: '85%',
                  status: 'exceeded',
                },
              ].map((kpi, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{kpi.kpi}</p>
                    <p className="text-sm text-muted-foreground">
                      Target: {kpi.target}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{kpi.value}</div>
                    <BuffrBadge
                      variant={
                        kpi.status === 'exceeded' ? 'default' : 'secondary'
                      }
                    >
                      {kpi.status}
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
