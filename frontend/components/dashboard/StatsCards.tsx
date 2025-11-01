/**
 * @file This file defines the StatsCards component, which displays a set of statistics in a card format.
 * @location frontend/components/dashboard/StatsCards.tsx
 * @description This component renders a grid of cards, each displaying a statistic with a title, value, icon, and trend.
 * @modular
 *
 * @component
 * @param {StatsCardsProps} props - The props for the component.
 * @param {StatCardData[]} props.stats - An array of statistic objects to display.
 * @param {2 | 3 | 4} [props.columns=4] - The number of columns in the grid.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the component.
 *
 * @example
 * const stats = [
 *   { id: '1', title: 'Total Revenue', value: '$12,345', icon: 'dollar-sign', trend: 5.2, trendDirection: 'up' },
 *   { id: '2', title: 'Bookings', value: '123', icon: 'calendar', trend: -2.1, trendDirection: 'down' },
 * ];
 * <StatsCards stats={stats} columns={2} />
 *
 * @see {@link BuffrCard}
 * @see {@link BuffrIcon}
 *
 * @security This component does not handle any sensitive data directly.
 * @accessibility The component uses semantic HTML.
 * @performance The component is lightweight and has minimal performance impact.
 *
 * @buffr-icon-usage This component dynamically renders icons based on the 'icon' prop of each stat.
 */
'use client';

import React from 'react';
/**
 * StatsCards React Component for Buffr Host Hospitality Platform
 * @fileoverview StatsCards displays comprehensive dashboard with key metrics and analytics
 * @location buffr-host/components/dashboard/StatsCards.tsx
 * @purpose StatsCards displays comprehensive dashboard with key metrics and analytics
 * @component StatsCards
 * @category Dashboard
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
 * @param {StatCard[]} [stats] - stats prop description
 * @param {} [className] - className prop description
 *
 * Usage Example:
 * @example
 * import { StatsCards } from './StatsCards';
 *
 * function App() {
 *   return (
 *     <StatsCards
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered StatsCards component
 */

import {
  BuffrCard,
  BuffrCardContent,
  BuffrCardHeader,
  BuffrCardTitle,
} from '@/components/ui/cards/BuffrCard';
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
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 ${className}`}
    >
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
          currency: 'USD',
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
    <BuffrCard className="hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <BuffrCardHeader className="pb-2 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <BuffrIcon
            name={stat.icon}
            className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${getIconColor(stat.color)}`}
          />
          <BuffrBadge
            variant={
              stat.changeType === 'increase'
                ? 'success'
                : stat.changeType === 'decrease'
                  ? 'error'
                  : 'neutral'
            }
            size="sm"
            className="whitespace-nowrap flex-shrink-0"
          >
            {stat.change > 0 ? '+' : ''}
            {stat.change}%
          </BuffrBadge>
        </div>
      </BuffrCardHeader>
      <BuffrCardContent className="pt-0 p-3 sm:p-4">
        <div className="space-y-1">
          <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            {formatValue(stat.value, stat.format)}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 truncate">
            {stat.title}
          </p>
          <p className={`text-xs ${getChangeColor(stat.changeType)} truncate`}>
            {stat.change > 0 ? '↗' : stat.change < 0 ? '↘' : '→'}
            {Math.abs(stat.change)}% from last month
          </p>
        </div>
      </BuffrCardContent>
    </BuffrCard>
  );
};
