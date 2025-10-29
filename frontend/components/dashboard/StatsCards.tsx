'use client';

import React from 'react';
import { BuffrCard, BuffrCardContent, BuffrCardHeader, BuffrCardTitle } from '@/components/ui/cards/BuffrCard';
import { BuffrIcon, BuffrIconName } from '@/components/ui/icons/BuffrIcons';
import { BuffrBadge } from '@/components/ui/feedback/BuffrBadge';

/**
 * Stats Cards Component
 * 
 * Displays key performance metrics in card format
 * Location: components/dashboard/StatsCards.tsx
 */

interface StatCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: BuffrIconName;
  color: 'primary' | 'success' | 'warning' | 'info' | 'error';
  format?: 'currency' | 'percentage' | 'number';
}

interface StatsCardsProps {
  stats: StatCard[];
  className?: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6 ${className}`}>
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
};

interface StatCardProps {
  stat: StatCard;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const formatValue = (value: string | number, format?: string): string => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
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

  const getIconColor = (color: string): string => {
    switch (color) {
      case 'primary':
        return 'text-blue-500';
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <BuffrCard className="hover:shadow-lg transition-shadow duration-200">
      <BuffrCardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <BuffrIcon 
            name={stat.icon} 
            className={`h-5 w-5 ${getIconColor(stat.color)}`}
          />
          <BuffrBadge 
            variant={stat.changeType === 'increase' ? 'success' : stat.changeType === 'decrease' ? 'error' : 'neutral'}
            size="sm"
          >
            {stat.change > 0 ? '+' : ''}{stat.change}%
          </BuffrBadge>
        </div>
      </BuffrCardHeader>
      <BuffrCardContent className="pt-0">
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900">
            {formatValue(stat.value, stat.format)}
          </p>
          <p className="text-sm text-gray-600">
            {stat.title}
          </p>
          <p className={`text-xs ${getChangeColor(stat.changeType)}`}>
            {stat.change > 0 ? '↗' : stat.change < 0 ? '↘' : '→'} 
            {Math.abs(stat.change)}% from last month
          </p>
        </div>
      </BuffrCardContent>
    </BuffrCard>
  );
};