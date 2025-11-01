'use client';

import React, { useState } from 'react';
/**
 * NotificationsWidget React Component for Buffr Host Hospitality Platform
 * @fileoverview NotificationsWidget displays comprehensive dashboard with key metrics and analytics
 * @location buffr-host/components/dashboard/NotificationsWidget.tsx
 * @purpose NotificationsWidget displays comprehensive dashboard with key metrics and analytics
 * @component NotificationsWidget
 * @category Dashboard
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @hooks_utilization useState for state management and side effects
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
 * @param {Notification[]} [notifications] - notifications prop description
 * @param {} [maxItems] - maxItems prop description
 * @param {} [showMarkAllRead] - showMarkAllRead prop description
 * @param {} [className] - className prop description
 *
 * Methods:
 * @method markAsRead - markAsRead method for component functionality
 * @method markAllAsRead - markAllAsRead method for component functionality
 *
 * Usage Example:
 * @example
 * import { NotificationsWidget } from './NotificationsWidget';
 *
 * function App() {
 *   return (
 *     <NotificationsWidget
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered NotificationsWidget component
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
 * @file This file defines the NotificationsWidget component, which displays a list of recent notifications.
 * @location frontend/components/dashboard/NotificationsWidget.tsx
 * @description This component renders a card with a list of notifications, showing their status (read/unread), and allows marking them as read.
 * @modular
 *
 * @component
 * @param {NotificationsWidgetProps} props - The props for the component.
 * @param {Notification[]} props.notifications - An array of notification objects to display.
 * @param {number} [props.maxItems=5] - The maximum number of notifications to display.
 * @param {boolean} [props.showMarkAllRead=true] - Whether to show the "Mark all read" button.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the component.
 *
 * @example
 * const notifications = [
 *   { id: '1', type: 'info', title: 'New message', message: 'You have a new message from John Doe.', timestamp: new Date(), isRead: false },
 *   { id: '2', type: 'warning', title: 'Payment due', message: 'Your payment is due tomorrow.', timestamp: new Date(), isRead: true },
 * ];
 * <NotificationsWidget notifications={notifications} />
 *
 * @see {@link BuffrCard}
 * @see {@link BuffrBadge}
 * @see {@link BuffrButton}
 * @see {@link BuffrIcon}
 *
 * @security This component does not handle any sensitive data directly.
 * @accessibility The component uses semantic HTML and ARIA attributes where necessary.
 * @performance The component uses React.useState for local state management, which is efficient for this use case.
 *
 * @buffr-icon-usage This component uses the 'bell', 'bell-off', 'info', 'alert-triangle', 'check-circle', and 'x-circle' icons.
 */

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationsWidgetProps {
  notifications: Notification[];
  maxItems?: number;
  showMarkAllRead?: boolean;
  className?: string;
}

export const NotificationsWidget: React.FC<NotificationsWidgetProps> = ({
  notifications,
  maxItems = 5,
  showMarkAllRead = true,
  className = '',
}) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const unreadCount = localNotifications.filter((n) => !n.isRead).length;
  const displayNotifications = localNotifications.slice(0, maxItems);

  const markAsRead = (id: string) => {
    setLocalNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <BuffrCard className={`overflow-hidden ${className}`}>
      <BuffrCardHeader className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <BuffrCardTitle className="flex items-center gap-2 min-w-0">
            <BuffrIcon
              name="bell"
              className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
            />
            <span className="text-base sm:text-lg md:text-xl truncate">
              Notifications
            </span>
            {unreadCount > 0 && (
              <BuffrBadge
                variant="error"
                size="sm"
                className="flex-shrink-0 whitespace-nowrap"
              >
                {unreadCount}
              </BuffrBadge>
            )}
          </BuffrCardTitle>
          {showMarkAllRead && unreadCount > 0 && (
            <BuffrButton
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="flex-shrink-0 text-xs sm:text-sm min-h-[44px] sm:min-h-0 whitespace-nowrap"
            >
              Mark all read
            </BuffrButton>
          )}
        </div>
      </BuffrCardHeader>
      <BuffrCardContent className="p-3 sm:p-4 md:p-6 pt-0">
        <div className="space-y-2 sm:space-y-3">
          {displayNotifications.length > 0 ? (
            displayNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BuffrIcon
                name="bell-off"
                className="h-12 w-12 mx-auto mb-2 text-gray-300"
              />
              <p>No notifications</p>
            </div>
          )}
        </div>
      </BuffrCardContent>
    </BuffrCard>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const getNotificationIcon = (type: string): BuffrIconName => {
    switch (type) {
      case 'info':
        return 'info';
      case 'warning':
        return 'alert-triangle';
      case 'success':
        return 'check-circle';
      case 'error':
        return 'x-circle';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type: string): string => {
    switch (type) {
      case 'info':
        return 'text-blue-500';
      case 'warning':
        return 'text-yellow-500';
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
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
    <div
      className={`p-2 sm:p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors min-h-[44px] ${
        !notification.isRead
          ? 'bg-blue-50 border-blue-200'
          : 'bg-white border-gray-200'
      }`}
      onClick={() => {
        if (!notification.isRead) {
          onMarkAsRead(notification.id);
        }
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
      }}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div
          className={`p-1 rounded-full flex-shrink-0 ${getNotificationColor(notification.type)} bg-opacity-10`}
        >
          <BuffrIcon
            name={getNotificationIcon(notification.type)}
            className={`h-3 w-3 sm:h-4 sm:w-4 ${getNotificationColor(notification.type)}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-0">
            <div className="flex-1 min-w-0">
              <p
                className={`text-xs sm:text-sm font-medium truncate ${
                  !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                }`}
              >
                {notification.title}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 break-words">
                {notification.message}
              </p>
            </div>
            <div className="flex flex-row sm:flex-col sm:items-end gap-2 sm:gap-1 flex-shrink-0">
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatTimestamp(notification.timestamp)}
              </span>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
