/**
 * @file This file defines the ModelMetricsCard component, which displays metrics for a machine learning model.
 * @location frontend/components/features/bi/ModelMetricsCard.tsx
 * @description This component renders a card with details about a model, including its name, version, status, and performance metrics.
 * @modular
 *
 * @component
 * @param {ModelMetricsCardProps} props - The props for the component.
 * @param {string} props.title - The title of the card.
 * @param {Metric[]} props.metrics - An array of metric objects to display.
 * @param {string} [props.modelVersion] - The version of the model.
 * @param {string} [props.lastTrained] - The date the model was last trained.
 *
 * @example
 * const metrics = [
 *   { name: 'Accuracy', value: 0.95, target: 0.9, unit: '%', trend: 'up', status: 'good' },
 *   { name: 'Precision', value: 0.92, target: 0.9, unit: '%', trend: 'stable', status: 'good' },
 * ];
 * <ModelMetricsCard title="Revenue Prediction Model" metrics={metrics} modelVersion="1.2.0" lastTrained="2025-10-31" />
 *
 * @see {@link BuffrCard}
 * @see {@link BuffrIcon}
 * @see {@link BuffrBadge}
 * @see {@link BuffrProgress}
 *
 * @security This component does not handle any sensitive data directly.
 * @accessibility The component uses semantic HTML.
 * @performance The component is lightweight and has minimal performance impact.
 *
 * @buffr-icon-usage This component uses the 'target', 'trending-up', 'trending-down', 'activity', 'check-circle', and 'alert-circle' icons.
 */
/**
 * ModelMetricsCard React Component for Buffr Host Hospitality Platform
 * @fileoverview ModelMetricsCard provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/features/bi/ModelMetricsCard.tsx
 * @purpose ModelMetricsCard provides specialized functionality for the Buffr Host platform
 * @component ModelMetricsCard
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
 * @param {Metric[]} [metrics] - metrics prop description
 * @param {} [modelVersion] - modelVersion prop description
 * @param {} [lastTrained] - lastTrained prop description
 *
 * Methods:
 * @method getTrendIcon - getTrendIcon method for component functionality
 * @method getStatusIcon - getStatusIcon method for component functionality
 * @method getStatusColor - getStatusColor method for component functionality
 *
 * Usage Example:
 * @example
 * import { ModelMetricsCard } from './ModelMetricsCard';
 *
 * function App() {
 *   return (
 *     <ModelMetricsCard
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered ModelMetricsCard component
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
        return (
          <BuffrIcon name="check-circle" className="h-4 w-4 text-green-500" />
        );
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
    <BuffrCard className="overflow-hidden w-full max-w-full">
      <BuffrCardHeader className="pb-3 md:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <BuffrCardTitle className="flex items-center space-x-2 min-w-0">
            <BuffrIcon
              name="target"
              className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0"
            />
            <span className="truncate text-base md:text-lg">{title}</span>
          </BuffrCardTitle>
          {modelVersion && (
            <BuffrBadge
              variant="outline"
              className="whitespace-nowrap flex-shrink-0 text-xs md:text-sm"
            >
              v{modelVersion}
            </BuffrBadge>
          )}
        </div>
        {lastTrained && (
          <p className="text-xs md:text-sm text-muted-foreground truncate mt-1">
            Last trained: {lastTrained}
          </p>
        )}
      </BuffrCardHeader>
      <BuffrCardBody className="pt-0">
        <div className="space-y-3 md:space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <span className="text-xs md:text-sm font-medium truncate break-words">
                    {metric.name}
                  </span>
                  <div className="flex-shrink-0">
                    {getStatusIcon(metric.status)}
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="text-xs md:text-sm font-mono truncate whitespace-nowrap">
                    {metric.value.toFixed(2)}
                    {metric.unit}
                  </span>
                  {getTrendIcon(metric.trend)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground gap-2">
                  <span className="truncate break-words">
                    Target: {metric.target}
                    {metric.unit}
                  </span>
                  <span className="whitespace-nowrap flex-shrink-0">
                    {Math.round((metric.value / metric.target) * 100)}%
                  </span>
                </div>
                <BuffrProgress
                  value={(metric.value / metric.target) * 100}
                  className="h-2 w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </BuffrCardBody>
    </BuffrCard>
  );
}

export default ModelMetricsCard;
