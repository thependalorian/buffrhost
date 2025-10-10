'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface EtunaMetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export default function EtunaMetricCard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'bg-blue-500',
  trend = 'neutral',
  className = ''
}: EtunaMetricCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      default:
        return 'text-base-content/70';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return null;
    }
  };

  const TrendIcon = getTrendIcon();

  return (
    <div className={`card bg-base-100 shadow-xl ${className}`}>
      <div className="card-body">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${iconColor} text-white`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-base-content/70">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {(change !== undefined || changeLabel) && (
              <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
                {TrendIcon && <TrendIcon className="w-3 h-3" />}
                <span>
                  {changeLabel || (change !== undefined ? `${change > 0 ? '+' : ''}${change}%` : '')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}