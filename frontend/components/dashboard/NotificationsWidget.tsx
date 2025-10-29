'use client';

import React, { useState } from 'react';
import { BuffrCard, BuffrCardContent, BuffrCardHeader, BuffrCardTitle } from '@/components/ui/cards/BuffrCard';
import { BuffrIcon, BuffrIconName } from '@/components/ui/icons/BuffrIcons';
import { BuffrBadge } from '@/components/ui/feedback/BuffrBadge';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';

/**
 * Notifications Widget Component
 * 
 * Displays recent notifications with read/unread status
 * Location: components/dashboard/NotificationsWidget.tsx
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
  className = ''
}) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const unreadCount = localNotifications.filter(n => !n.isRead).length;
  const displayNotifications = localNotifications.slice(0, maxItems);

  const markAsRead = (id: string) => {
    setLocalNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setLocalNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  return (
    <BuffrCard className={className}>
      <BuffrCardHeader>
        <div className="flex items-center justify-between">
          <BuffrCardTitle className="flex items-center gap-2">
            <BuffrIcon name="bell" className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <BuffrBadge variant="error" size="sm">
                {unreadCount}
              </BuffrBadge>
            )}
          </BuffrCardTitle>
          {showMarkAllRead && unreadCount > 0 && (
            <BuffrButton 
              variant="ghost" 
              size="sm"
              onClick={markAllAsRead}
            >
              Mark all read
            </BuffrButton>
          )}
        </div>
      </BuffrCardHeader>
      <BuffrCardContent>
        <div className="space-y-3">
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
              <BuffrIcon name="bell-off" className="h-12 w-12 mx-auto mb-2 text-gray-300" />
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
  onMarkAsRead 
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
      className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
        !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
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
      <div className="flex items-start gap-3">
        <div className={`p-1 rounded-full ${getNotificationColor(notification.type)} bg-opacity-10`}>
          <BuffrIcon 
            name={getNotificationIcon(notification.type)} 
            className={`h-4 w-4 ${getNotificationColor(notification.type)}`}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {notification.title}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 ml-2">
              <span className="text-xs text-gray-500">
                {formatTimestamp(notification.timestamp)}
              </span>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};