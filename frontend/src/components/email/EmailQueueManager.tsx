/**
 * Email Queue Manager Component
 *
 * Manages the email queue and processing
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  Trash2,
  Eye,
  Send,
  Filter,
  Search,
} from "lucide-react";

interface EmailQueueItem {
  id: string;
  recipient: string;
  subject: string;
  status: "pending" | "processing" | "sent" | "failed" | "retry";
  priority: "low" | "normal" | "high";
  scheduledTime: string;
  attempts: number;
  maxAttempts: number;
  errorMessage?: string;
  template: string;
}

interface EmailQueueManagerProps {
  queueItems?: EmailQueueItem[];
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
  onView?: (id: string) => void;
  onProcessQueue?: () => void;
  onPauseQueue?: () => void;
}

export default function EmailQueueManager({
  queueItems,
  onRetry,
  onCancel,
  onView,
  onProcessQueue,
  onPauseQueue,
}: EmailQueueManagerProps) {
  const [queueStatus, setQueueStatus] = useState<
    "running" | "paused" | "stopped"
  >("running");

  const mockQueueItems: EmailQueueItem[] = [
    {
      id: "1",
      recipient: "john.smith@email.com",
      subject: "Booking Confirmation - Room E-201",
      status: "pending",
      priority: "high",
      scheduledTime: "2024-01-15 10:30:00",
      attempts: 0,
      maxAttempts: 3,
      template: "booking_confirmation",
    },
    {
      id: "2",
      recipient: "maria.garcia@company.com",
      subject: "Payment Receipt - Transaction #12345",
      status: "processing",
      priority: "normal",
      scheduledTime: "2024-01-15 10:25:00",
      attempts: 1,
      maxAttempts: 3,
      template: "payment_receipt",
    },
    {
      id: "3",
      recipient: "failed@email.com",
      subject: "Welcome to Etuna Guesthouse",
      status: "failed",
      priority: "low",
      scheduledTime: "2024-01-15 10:20:00",
      attempts: 3,
      maxAttempts: 3,
      errorMessage: "Invalid email address",
      template: "welcome_email",
    },
    {
      id: "4",
      recipient: "retry@email.com",
      subject: "System Maintenance Notice",
      status: "retry",
      priority: "normal",
      scheduledTime: "2024-01-15 10:15:00",
      attempts: 2,
      maxAttempts: 3,
      errorMessage: "Connection timeout",
      template: "maintenance_notice",
    },
  ];

  const displayQueueItems = queueItems || mockQueueItems;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "processing":
        return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />;
      case "sent":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "retry":
        return <RefreshCw className="w-4 h-4 text-orange-500" />;
      default:
        return <Mail className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "sent":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "retry":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "normal":
        return "bg-green-100 text-green-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const queueStats = {
    total: displayQueueItems.length,
    pending: displayQueueItems.filter((item) => item.status === "pending")
      .length,
    processing: displayQueueItems.filter((item) => item.status === "processing")
      .length,
    failed: displayQueueItems.filter((item) => item.status === "failed").length,
    sent: displayQueueItems.filter((item) => item.status === "sent").length,
  };

  const handleQueueControl = (action: string) => {
    switch (action) {
      case "start":
        setQueueStatus("running");
        onProcessQueue?.();
        break;
      case "pause":
        setQueueStatus("paused");
        onPauseQueue?.();
        break;
      case "stop":
        setQueueStatus("stopped");
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Queue Manager</h1>
          <p className="text-gray-600">
            Monitor and manage email queue processing
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Queue Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Queue Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {queueStats.total}
              </div>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {queueStats.pending}
              </div>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {queueStats.processing}
              </div>
              <p className="text-sm text-gray-600">Processing</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {queueStats.sent}
              </div>
              <p className="text-sm text-gray-600">Sent</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {queueStats.failed}
              </div>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Queue Status:</span>
              <Badge
                className={
                  queueStatus === "running"
                    ? "bg-green-100 text-green-800"
                    : queueStatus === "paused"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }
              >
                {queueStatus}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQueueControl("start")}
                disabled={queueStatus === "running"}
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQueueControl("pause")}
                disabled={queueStatus === "paused"}
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQueueControl("stop")}
                disabled={queueStatus === "stopped"}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queue Items */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayQueueItems.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getStatusIcon(item.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">
                          {item.subject}
                        </h3>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">To:</span>{" "}
                        {item.recipient}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Template:</span>{" "}
                        {item.template}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Attempts:</span>{" "}
                        {item.attempts}/{item.maxAttempts}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Scheduled:</span>{" "}
                        {item.scheduledTime}
                      </div>
                      {item.errorMessage && (
                        <div className="text-sm text-red-600 mb-1">
                          <span className="font-medium">Error:</span>{" "}
                          {item.errorMessage}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView?.(item.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {item.status === "failed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRetry?.(item.id)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCancel?.(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayQueueItems.length === 0 && (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Queue is empty
              </h3>
              <p className="text-gray-500">
                No emails are currently in the queue.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
