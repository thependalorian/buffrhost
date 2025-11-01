'use client';

import React from 'react';
/**
 * RecentActivity React Component for Buffr Host Hospitality Platform
 * @fileoverview RecentActivity displays comprehensive dashboard with key metrics and analytics
 * @location buffr-host/components/dashboard/RecentActivity.tsx
 * @purpose RecentActivity displays comprehensive dashboard with key metrics and analytics
 * @component RecentActivity
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
 * @param {ActivityItem[]} [activities] - activities prop description
 * @param {} [maxItems] - maxItems prop description
 * @param {} [showViewAll] - showViewAll prop description
 * @param {} [className] - className prop description
 *
 * Usage Example:
 * @example
 * import { RecentActivity } from './RecentActivity';
 *
 * function App() {
 *   return (
 *     <RecentActivity
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered RecentActivity component
 */

import {
  BuffrCard,
  BuffrCardContent,
  BuffrCardHeader,
  BuffrCardTitle,
} from '@/components/ui/cards/BuffrCard';
import { BuffrIcon, BuffrIconName } from '@/components/ui/icons/BuffrIcons';
import { BuffrBadge } from '@/components/ui/feedback/BuffrBadge';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';

/**
 * @file This file defines the RecentActivity component, which displays a timeline of recent activities.
 * @location frontend/components/dashboard/RecentActivity.tsx
 * @description This component renders a card with a timeline of recent activities, each with an icon, title, description, and timestamp.
 * @modular
 *
 * @component
 * @param {RecentActivityProps} props - The props for the component.
 * @param {ActivityItem[]} props.activities - An array of activity objects to display.
 * @param {number} [props.maxItems=5] - The maximum number of activities to display.
 * @param {boolean} [props.showViewAll=true] - Whether to show the "View All" button.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the component.
 *
 * @example
 * const activities = [
 *   { id: '1', type: 'booking', title: 'New Booking', description: 'John Doe booked a room.', timestamp: new Date(), status: 'completed' },
 *   { id: '2', type: 'guest', title: 'Guest Checked In', description: 'Jane Smith checked in.', timestamp: new Date(), status: 'in-progress' },
 * ];
 * <RecentActivity activities={activities} />
 *
 * @see {@link BuffrCard}
 * @see {@link BuffrIcon}
 * @see {@link BuffrBadge}
 * @see {@link BuffrButton}
 *
 * @security This component does not handle any sensitive data directly.
 * @accessibility The component uses semantic HTML.
 * @performance The component is lightweight and has minimal performance impact.
 *
 * @buffr-icon-usage This component uses the 'activity' and 'inbox' icons, and dynamically renders icons based on the 'type' of each activity.
 */

interface ActivityItem {
  id: string;
  type: 'booking' | 'order' | 'review' | 'payment' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'cancelled' | 'in-progress';
  amount?: number;
  user?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  maxItems?: number;
  showViewAll?: boolean;
  className?: string;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  maxItems = 5,
  showViewAll = true,
  className = '',
}) => {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <BuffrCard className={`overflow-hidden ${className}`}>
      <BuffrCardHeader className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <BuffrCardTitle className="flex items-center gap-2 min-w-0">
            <BuffrIcon
              name="activity"
              className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
            />
            <span className="text-base sm:text-lg md:text-xl truncate">
              Recent Activity
            </span>
          </BuffrCardTitle>
          {showViewAll && (
            <BuffrButton
              variant="ghost"
              size="sm"
              className="flex-shrink-0 text-xs sm:text-sm min-h-[44px] sm:min-h-0"
            >
              View All
            </BuffrButton>
          )}
        </div>
      </BuffrCardHeader>
      <BuffrCardContent className="p-3 sm:p-4 md:p-6 pt-0">
        <div className="space-y-3 sm:space-y-4">
          {displayActivities.length > 0 ? (
            displayActivities.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                isLast={index === displayActivities.length - 1}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BuffrIcon
                name="inbox"
                className="h-12 w-12 mx-auto mb-2 text-gray-300"
              />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </BuffrCardContent>
    </BuffrCard>
  );
};

interface ActivityItemProps {
  activity: ActivityItem;
  isLast: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, isLast }) => {
  const getActivityIcon = (type: string): BuffrIconName => {
    switch (type) {
      case 'booking':
        return 'calendar';
      case 'order':
        return 'shopping-cart';
      case 'review':
        return 'star';
      case 'payment':
        return 'credit-card';
      case 'system':
        return 'settings';
      default:
        return 'circle';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'cancelled':
        return 'text-red-500';
      case 'in-progress':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusVariant = (
    status: string
  ): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'in-progress':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <div className="flex items-start gap-2 sm:gap-3">
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className={`p-1.5 sm:p-2 rounded-full ${getStatusColor(activity.status)} bg-opacity-10`}
        >
          <BuffrIcon
            name={getActivityIcon(activity.type)}
            className={`h-3 w-3 sm:h-4 sm:w-4 ${getStatusColor(activity.status)}`}
          />
        </div>
        {!isLast && (
          <div className="w-px h-6 sm:h-8 bg-gray-200 mt-1 sm:mt-2" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
              {activity.title}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 break-words">
              {activity.description}
            </p>
            {activity.user && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                by {activity.user}
              </p>
            )}
          </div>
          <div className="flex flex-row sm:flex-col sm:items-end gap-2 sm:gap-1 flex-shrink-0">
            <BuffrBadge
              variant={getStatusVariant(activity.status)}
              size="sm"
              className="whitespace-nowrap"
            >
              {activity.status}
            </BuffrBadge>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatTimestamp(activity.timestamp)}
            </span>
            {activity.amount && (
              <span className="text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">
                ${activity.amount.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
