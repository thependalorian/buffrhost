'use client';

import React from 'react';
import { BuffrCard, BuffrCardContent, BuffrCardHeader, BuffrCardTitle } from '@/components/ui/cards/BuffrCard';
import { BuffrIcon, BuffrIconName } from '@/components/ui/icons/BuffrIcons';
import { BuffrBadge } from '@/components/ui/feedback/BuffrBadge';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';

/**
 * Recent Activity Component
 * 
 * Displays recent activities with timeline and status indicators
 * Location: components/dashboard/RecentActivity.tsx
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
  className = ''
}) => {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <BuffrCard className={className}>
      <BuffrCardHeader>
        <div className="flex items-center justify-between">
          <BuffrCardTitle className="flex items-center gap-2">
            <BuffrIcon name="activity" className="h-5 w-5" />
            Recent Activity
          </BuffrCardTitle>
          {showViewAll && (
            <BuffrButton variant="ghost" size="sm">
              View All
            </BuffrButton>
          )}
        </div>
      </BuffrCardHeader>
      <BuffrCardContent>
        <div className="space-y-4">
          {displayActivities.length > 0 ? (
            displayActivities.map((activity, index) => (
              <ActivityItem key={activity.id} activity={activity} isLast={index === displayActivities.length - 1} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BuffrIcon name="inbox" className="h-12 w-12 mx-auto mb-2 text-gray-300" />
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

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
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
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className={`p-2 rounded-full ${getStatusColor(activity.status)} bg-opacity-10`}>
          <BuffrIcon 
            name={getActivityIcon(activity.type)} 
            className={`h-4 w-4 ${getStatusColor(activity.status)}`}
          />
        </div>
        {!isLast && (
          <div className="w-px h-8 bg-gray-200 mt-2" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {activity.title}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {activity.description}
            </p>
            {activity.user && (
              <p className="text-xs text-gray-500 mt-1">
                by {activity.user}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 ml-2">
            <BuffrBadge 
              variant={getStatusVariant(activity.status)}
              size="sm"
            >
              {activity.status}
            </BuffrBadge>
            <span className="text-xs text-gray-500">
              {formatTimestamp(activity.timestamp)}
            </span>
            {activity.amount && (
              <span className="text-sm font-medium text-gray-900">
                ${activity.amount.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};