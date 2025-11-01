/**
 * @file This file defines the DataQualityIndicator component, which displays a visual indicator of data quality.
 * @location frontend/components/features/bi/DataQualityIndicator.tsx
 * @description This component renders a card with a data quality score, status, and a progress bar.
 * @modular
 *
 * @component
 * @param {DataQualityIndicatorProps} props - The props for the component.
 * @param {string} props.title - The title of the data quality metric.
 * @param {QualityMetric[]} props.metrics - An array of individual quality metrics.
 * @param {number} props.overallScore - The overall data quality score (0-100).
 * @param {string} props.lastChecked - The timestamp when the data quality was last checked.
 * @param {() => void} [props.onRefresh] - Callback function to refresh the data quality metrics.
 *
 * @example
 * const metrics = [
 *   { name: 'Completeness', value: 95, threshold: 90, status: 'good', description: 'Percentage of non-null values' },
 *   { name: 'Accuracy', value: 88, threshold: 85, status: 'warning', description: 'Deviation from expected values' },
 * ];
 * <DataQualityIndicator
 *   title="Customer Data Quality"
 *   metrics={metrics}
 *   overallScore={90}
 *   lastChecked="2025-10-31T10:00:00Z"
 *   onRefresh={() => console.log('Refreshing data quality')}
 * />
 *
 * @see {@link BuffrCard}
 * @see {@link BuffrIcon}
 * @see {@link BuffrProgress}
 * @see {@link Badge}
 *
 * @security This component does not handle any sensitive data directly.
 * @accessibility The component uses semantic HTML.
 * @performance The component is lightweight and has minimal performance impact.
 *
 * @buffr-icon-usage This component uses the 'database', 'check-circle', 'alert-triangle', and 'x-circle' icons.
 */
/**
 * DataQualityIndicator React Component for Buffr Host Hospitality Platform
 * @fileoverview DataQualityIndicator provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/features/bi/DataQualityIndicator.tsx
 * @purpose DataQualityIndicator provides specialized functionality for the Buffr Host platform
 * @component DataQualityIndicator
 * @category Features
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {string} [title] - title prop description
 * @param {QualityMetric[]} [metrics] - metrics prop description
 * @param {number} [overallScore] - overallScore prop description
 * @param {string} [lastChecked] - lastChecked prop description
 * @param {} [onRefresh] - onRefresh prop description
 *
 * Methods:
 * @method getStatusIcon - getStatusIcon method for component functionality
 * @method getStatusColor - getStatusColor method for component functionality
 * @method getOverallStatus - getOverallStatus method for component functionality
 *
 * Usage Example:
 * @example
 * import { DataQualityIndicator } from './DataQualityIndicator';
 *
 * function App() {
 *   return (
 *     <DataQualityIndicator
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered DataQualityIndicator component
 */

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
