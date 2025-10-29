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
 * Data Quality Indicator Component
 * Shows data quality metrics and health status
 */

import React from 'react';
interface QualityMetric {
  name: string;
  value: number;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

interface DataQualityIndicatorProps {
  title: string;
  metrics: QualityMetric[];
  overallScore: number;
  lastChecked: string;
  onRefresh?: () => void;
}

export function DataQualityIndicator({
  title,
  metrics,
  overallScore,
  lastChecked,
  onRefresh,
}: DataQualityIndicatorProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return (
          <BuffrIcon
            name="alert-triangle"
            className="h-4 w-4 text-yellow-500"
          />
        );
      case 'critical':
        return <BuffrIcon name="x-circle" className="h-4 w-4 text-red-500" />;
      default:
        return (
          <BuffrIcon name="alert-triangle" className="h-4 w-4 text-nude-500" />
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

  const getOverallStatus = (score: number) => {
    if (score >= 90)
      return { status: 'good', color: 'bg-green-100 text-success' };
    if (score >= 70)
      return { status: 'warning', color: 'bg-yellow-100 text-warning' };
    return { status: 'critical', color: 'bg-red-100 text-error' };
  };

  const overallStatus = getOverallStatus(overallScore);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BuffrIcon name="database" className="h-5 w-5" />
            <span>{title}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={overallStatus.color}>
              {overallScore}% Quality Score
            </Badge>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-1 hover:bg-nude-100 rounded"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Last checked: {lastChecked}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Quality Score</span>
              <span className="font-mono">{overallScore}%</span>
            </div>
            <Progress value={overallScore} className="h-2" />
          </div>

          {/* Individual Metrics */}
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(metric.status)}
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono">
                      {metric.value.toFixed(1)}%
                    </span>
                    <Badge
                      variant="outline"
                      className={getStatusColor(metric.status)}
                    >
                      {metric.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Threshold: {metric.threshold}%</span>
                    <span>{metric.description}</span>
                  </div>
                  <Progress value={metric.value} className="h-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DataQualityIndicator;
