/**
 * Email Notification List Component
 *
 * Displays a list of email notifications for users
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
  Filter,
  Search,
} from "lucide-react";

interface EmailNotification {
  id: string;
  subject: string;
  sender: string;
  timestamp: string;
  status: "read" | "unread" | "sent" | "failed";
  priority: "low" | "medium" | "high";
  type: "booking" | "payment" | "system" | "marketing";
}

interface EmailNotificationListProps {
  notifications?: EmailNotification[];
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onFilter?: (type: string) => void;
}

export default function EmailNotificationList({
  notifications = [],
  onMarkAsRead,
  onDelete,
  onFilter,
}: EmailNotificationListProps) {
  const mockNotifications: EmailNotification[] = [
    {
      id: "1",
      subject: "New Booking Confirmation",
      sender: "system@buffrhost.com",
      timestamp: "2024-01-15 10:30",
      status: "unread",
      priority: "high",
      type: "booking",
    },
    {
      id: "2",
      subject: "Payment Received",
      sender: "payments@buffrhost.com",
      timestamp: "2024-01-15 09:15",
      status: "read",
      priority: "medium",
      type: "payment",
    },
    {
      id: "3",
      subject: "System Maintenance Notice",
      sender: "admin@buffrhost.com",
      timestamp: "2024-01-14 16:45",
      status: "read",
      priority: "low",
      type: "system",
    },
  ];

  const displayNotifications =
    notifications.length > 0 ? notifications : mockNotifications;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "read":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "unread":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "sent":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Mail className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "booking":
        return "bg-blue-100 text-blue-800";
      case "payment":
        return "bg-green-100 text-green-800";
      case "system":
        return "bg-purple-100 text-purple-800";
      case "marketing":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Email Notifications</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {displayNotifications.map((notification) => (
          <Card
            key={notification.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getStatusIcon(notification.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-sm truncate">
                        {notification.subject}
                      </h3>
                      <Badge
                        className={getPriorityColor(notification.priority)}
                      >
                        {notification.priority}
                      </Badge>
                      <Badge className={getTypeColor(notification.type)}>
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      From: {notification.sender}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{notification.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {notification.status === "unread" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMarkAsRead?.(notification.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete?.(notification.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayNotifications.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No notifications
            </h3>
            <p className="text-gray-500">
              You don&apos;t have any email notifications at the moment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
