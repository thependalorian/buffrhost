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
 * Data Quality Monitoring BI Dashboard
 * Monitors data quality metrics and issues
 */

import React, { useState, useEffect } from 'react';
import { MLDashboardLayout } from '@/components/features/bi/MLDashboardLayout';
import { biService } from '@/lib/services/bi-service';
export default function DataQualityDashboard() {
  const [issues, setIssues] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [issuesData] = await Promise.all([
        biService.getDataQualityIssues(),
      ]);

      setIssues(issuesData);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to load data quality dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleExport = () => {
    biService.exportData('data-quality', 'excel');
  };

  const handleConfigure = () => {
    console.log('Configure data quality monitoring');
  };

  const getStatus = (): 'healthy' | 'warning' | 'error' => {
    return 'healthy';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nude-900"></div>
      </div>
    );
  }

  return (
    <MLDashboardLayout
      title="Data Quality Monitoring Dashboard"
      description="Monitor data quality metrics and identify issues"
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
              Overall Quality
            </BuffrCardTitle>
            <BuffrIcon
              name="database"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">{'--'}%</div>
            <p className="text-xs text-muted-foreground">Quality score</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Issues Found
            </BuffrCardTitle>
            <BuffrIcon
              name="alert-triangle"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">{issues.length}</div>
            <p className="text-xs text-muted-foreground">Active issues</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Data Sources
            </BuffrCardTitle>
            <BuffrIcon
              name="check-circle"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Monitored sources</p>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <BuffrCardTitle className="text-sm font-medium">
              Improvement
            </BuffrCardTitle>
            <BuffrIcon
              name="trending-up"
              className="h-4 w-4 text-muted-foreground"
            />
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="text-2xl font-bold">+5.2%</div>
            <p className="text-xs text-muted-foreground">From last month</p>
          </BuffrCardContent>
        </BuffrCard>
      </div>

      {/* Data Quality Metrics */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Data Quality Metrics</BuffrCardTitle>
          <p className="text-sm text-muted-foreground">
            Overall data quality score: 0%
          </p>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No quality metrics available
            </p>
          </div>
        </BuffrCardContent>
      </BuffrCard>

      {/* Data Quality Issues */}
      <BuffrCard>
        <BuffrCardHeader>
          <BuffrCardTitle>Data Quality Issues</BuffrCardTitle>
        </BuffrCardHeader>
        <BuffrCardContent>
          <div className="space-y-4">
            {issues.slice(0, 8).map((issue, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{issue.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {issue.description}
                    </p>
                  </div>
                  <BuffrBadge
                    variant={
                      issue.severity === 'high' ? 'destructive' : 'secondary'
                    }
                  >
                    {issue.severity}
                  </BuffrBadge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Source</p>
                    <p className="font-semibold">{issue.source}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Records Affected</p>
                    <p className="font-semibold">{issue.affectedRecords}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Detected</p>
                    <p className="font-semibold">{issue.detectedDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <BuffrBadge variant="outline">{issue.status}</BuffrBadge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BuffrCardContent>
      </BuffrCard>

      {/* Quality Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Quality Trends</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BuffrIcon
                  name="trending-up"
                  className="h-12 w-12 mx-auto mb-2"
                />
                <p>Quality trend chart</p>
                <p className="text-sm">
                  Chart component would be implemented here
                </p>
              </div>
            </div>
          </BuffrCardContent>
        </BuffrCard>

        <BuffrCard>
          <BuffrCardHeader>
            <BuffrCardTitle>Source Quality</BuffrCardTitle>
          </BuffrCardHeader>
          <BuffrCardContent>
            <div className="space-y-3">
              {[
                { source: 'Customer Database', quality: 94, issues: 2 },
                { source: 'Transaction Logs', quality: 89, issues: 5 },
                { source: 'User Analytics', quality: 92, issues: 3 },
                { source: 'Payment Records', quality: 96, issues: 1 },
                { source: 'Booking System', quality: 87, issues: 7 },
              ].map((source, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{source.source}</p>
                    <p className="text-sm text-muted-foreground">
                      {source.issues} issues
                    </p>
                  </div>
                  <div className="text-right">
                    <BuffrBadge
                      variant={source.quality >= 90 ? 'default' : 'secondary'}
                    >
                      {source.quality}%
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
