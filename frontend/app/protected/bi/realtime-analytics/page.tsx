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
 * Real-time Analytics BI Dashboard
 * Displays real-time analytics and streaming data insights
 */

import React, { useState, useEffect } from 'react';
import { MLDashboardLayout } from '@/components/features/bi/MLDashboardLayout';
import { ModelMetricsCard } from '@/components/features/bi/ModelMetricsCard';
import { biService, BIMetrics } from '@/lib/services/bi-service';
export default function RealtimeAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<BIMetrics | null>(null);
  const [stream, setStream] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
    // Set up real-time updates
    const interval = setInterval(loadDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsData, streamData, qualityData] = await Promise.all([
        biService.getRealtimeAnalyticsMetrics(),
        biService.getRealtimeAnalyticsStream(),
        biService.getDataQualityMetrics(),
      ]);

      setMetrics(metricsData);
      setStream(streamData);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error(
        'Failed to load real-time analytics dashboard data:',
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
    biService.exportData('realtime-analytics', 'excel');
  };

  const handleConfigure = () => {
    console.log('Configure real-time analytics');
  };

  const getStatus = () => {
    if (!metrics) return 'error';
    if (metrics.accuracy < 0.8) return 'warning';
    return 'healthy';
  };

  const modelMetrics = metrics
    ? [
        {
          name: 'Processing Speed',
          value: metrics.accuracy * 100,
          target: 95,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.accuracy >= 0.95 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Data Freshness',
          value: metrics.precision * 100,
          target: 90,
          unit: '%',
          trend: 'up' as const,
          status:
            metrics.precision >= 0.9 ? ('good' as const) : ('warning' as const),
        },
        {
          name: 'Stream Reliability',
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
      title="Real-time Analytics Dashboard"
      description="Monitor real-time analytics and streaming data insights"
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
              Live Events
            </BuffrCardTitle>
            <BuffrIcon
              name="activity"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">2,456</div>
            <p className="text-xs text-muted-foreground">Events per minute</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Processing Latency
            </BuffrCardTitle>
            <BuffrIcon name="zap" className="h-4 w-4 text-muted-foreground" />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">45ms</div>
            <p className="text-xs text-muted-foreground">Average latency</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Data Throughput
            </BuffrCardTitle>
            <BuffrIcon
              name="trending-up"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">1.2GB/s</div>
            <p className="text-xs text-muted-foreground">Processing rate</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Uptime
            </BuffrCardTitle>
            <BuffrIcon name="clock" className="h-4 w-4 text-muted-foreground" />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">System availability</p>
          </BuffrCardContent>
        </BuffrCard>
      </div>

      {/* Model Performance */}
      <ModelMetricsCard
        title="Real-time Analytics Performance"
        metrics={modelMetrics}
        modelVersion="v2.8.1"
        lastTrained="1 hour ago"
      />

      {/* Live Data Stream */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Live Data Stream</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {stream.slice(0, 20).map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-semantic-success rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium">{event.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <BuffrBadge variant="outline">{event.severity}</BuffrBadge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </BuffrCardContent>
      </BuffrCard>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>System Performance</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="space-y-4">
              {[
                { metric: 'CPU Usage', value: '45%', status: 'normal' },
                { metric: 'Memory Usage', value: '67%', status: 'normal' },
                { metric: 'Network I/O', value: '234 MB/s', status: 'normal' },
                { metric: 'Disk I/O', value: '89 MB/s', status: 'normal' },
                { metric: 'Queue Depth', value: '1,234', status: 'normal' },
              ].map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{metric.metric}</p>
                    <p className="text-sm text-muted-foreground">
                      Current value
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{metric.value}</div>
                    <BuffrBadge
                      variant={
                        metric.status === 'normal' ? 'default' : 'destructive'
                      }
                    >
                      {metric.status}
                    </BuffrBadge>
                  </div>
                </div>
              ))}
            </div>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Data Sources</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="space-y-4">
              {[
                {
                  source: 'User Interactions',
                  events: 1234,
                  latency: '23ms',
                  status: 'active',
                },
                {
                  source: 'Transaction Logs',
                  events: 856,
                  latency: '34ms',
                  status: 'active',
                },
                {
                  source: 'System Metrics',
                  events: 2341,
                  latency: '12ms',
                  status: 'active',
                },
                {
                  source: 'External APIs',
                  events: 567,
                  latency: '89ms',
                  status: 'active',
                },
                {
                  source: 'Database Changes',
                  events: 432,
                  latency: '45ms',
                  status: 'active',
                },
              ].map((source, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{source.source}</p>
                    <p className="text-sm text-muted-foreground">
                      {source.events} events/min
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {source.latency}
                    </div>
                    <BuffrBadge variant="outline">{source.status}</BuffrBadge>
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
