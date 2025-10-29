import {
  BuffrIcon,
  BuffrCard,
  BuffrCardBody,
  BuffrCardHeader,
  BuffrCardTitle,
  BuffrBadge,
  BuffrProgress,
} from '@/components/ui';
/**
 * Model Metrics Card Component
 * Displays performance metrics for ML models
 */

import React from 'react';
interface Metric {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

interface ModelMetricsCardProps {
  title: string;
  metrics: Metric[];
  modelVersion?: string;
  lastTrained?: string;
}

export function ModelMetricsCard({
  title,
  metrics,
  modelVersion,
  lastTrained,
}: ModelMetricsCardProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return (
          <BuffrIcon name="trending-up" className="h-4 w-4 text-green-500" />
        );
      case 'down':
        return (
          <BuffrIcon name="trending-down" className="h-4 w-4 text-red-500" />
        );
      default:
        return <BuffrIcon name="activity" className="h-4 w-4 text-nude-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return (
          <BuffrIcon name="alert-circle" className="h-4 w-4 text-yellow-500" />
        );
      case 'critical':
        return (
          <BuffrIcon name="alert-circle" className="h-4 w-4 text-red-500" />
        );
      default:
        return (
          <BuffrIcon name="alert-circle" className="h-4 w-4 text-nude-500" />
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-success';
      case 'warning':
        return 'bg-yellow-100 text-warning';
      case 'critical':
        return 'bg-red-100 text-error';
      default:
        return 'bg-nude-100 text-nude-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BuffrIcon name="target" className="h-5 w-5" />
            <span>{title}</span>
          </CardTitle>
          {modelVersion && <Badge variant="outline">v{modelVersion}</Badge>}
        </div>
        {lastTrained && (
          <p className="text-sm text-muted-foreground">
            Last trained: {lastTrained}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{metric.name}</span>
                  {getStatusIcon(metric.status)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono">
                    {metric.value.toFixed(2)}
                    {metric.unit}
                  </span>
                  {getTrendIcon(metric.trend)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Target: {metric.target}
                    {metric.unit}
                  </span>
                  <span>
                    {Math.round((metric.value / metric.target) * 100)}%
                  </span>
                </div>
                <Progress
                  value={(metric.value / metric.target) * 100}
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ModelMetricsCard;
