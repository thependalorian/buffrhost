'use client';

import React from 'react';

interface EtunaProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function EtunaProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'primary',
  size = 'md',
  className = ''
}: EtunaProgressBarProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'lg':
        return 'h-4';
      default:
        return 'h-3';
    }
  };

  const percentage = Math.round((value / max) * 100);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{label}</span>
          {showPercentage && (
            <span className="text-sm font-semibold">{percentage}%</span>
          )}
        </div>
      )}
      <progress
        className={`progress progress-${color} w-full ${getSizeClasses()}`}
        value={value}
        max={max}
      ></progress>
    </div>
  );
}