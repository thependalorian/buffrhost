'use client';

import React from 'react';
import { BuffrCard, BuffrCardContent, BuffrCardHeader, BuffrCardTitle } from '@/components/ui/cards/BuffrCard';
import { BuffrIcon, BuffrIconName } from '@/components/ui/icons/BuffrIcons';

/**
 * Property Analytics Component
 * 
 * Displays key performance metrics and analytics for the property
 * Location: components/property/PropertyAnalytics.tsx
 */

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: BuffrIconName;
  format?: 'currency' | 'percentage' | 'number';
}

interface PropertyAnalyticsProps {
  metrics: MetricCard[];
  timeRange: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void;
  className?: string;
}

export const PropertyAnalytics: React.FC<PropertyAnalyticsProps> = ({
  metrics,
  timeRange,
  onTimeRangeChange,
  className = ''
}) => {
  const formatValue = (value: string | number, format?: string): string => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'NAD'
        }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'number':
        return new Intl.NumberFormat('en-US').format(value);
      default:
        return value.toString();
    }
  };

  const getChangeColor = (changeType: string): string => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = (changeType: string): BuffrIconName => {
    switch (changeType) {
      case 'increase':
        return 'trending-up';
      case 'decrease':
        return 'trending-down';
      default:
        return 'minus';
    }
  };

  return (
    <BuffrCard className={className}>
      <BuffrCardHeader>
        <div className="flex items-center justify-between">
          <BuffrCardTitle className="flex items-center gap-2">
            <BuffrIcon name="bar-chart" className="h-5 w-5" />
            Property Analytics
          </BuffrCardTitle>
          {onTimeRangeChange && (
            <div className="flex items-center gap-2">
              {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => onTimeRangeChange(range)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </BuffrCardHeader>
      <BuffrCardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>
      </BuffrCardContent>
    </BuffrCard>
  );
};

interface MetricCardProps {
  metric: MetricCard;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const formatValue = (value: string | number, format?: string): string => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'NAD'
        }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'number':
        return new Intl.NumberFormat('en-US').format(value);
      default:
        return value.toString();
    }
  };

  const getChangeColor = (changeType: string): string => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = (changeType: string): BuffrIconName => {
    switch (changeType) {
      case 'increase':
        return 'trending-up';
      case 'decrease':
        return 'trending-down';
      default:
        return 'minus';
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <BuffrIcon name={metric.icon} className="h-5 w-5 text-gray-500" />
        <div className="flex items-center gap-1">
          <BuffrIcon 
            name={getChangeIcon(metric.changeType)} 
            className={`h-4 w-4 ${getChangeColor(metric.changeType)}`}
          />
          <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
            {metric.change > 0 ? '+' : ''}{metric.change}%
          </span>
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">
          {formatValue(metric.value, metric.format)}
        </p>
        <p className="text-sm text-gray-600">
          {metric.title}
        </p>
      </div>
    </div>
  );
};