/**
 * Email History Component
 *
 * Displays email communication history
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
  Download,
  Filter,
  Search,
  Calendar,
} from "lucide-react";

interface EmailHistoryItem {
  id: string;
  subject: string;
  recipient: string;
  sender: string;
  timestamp: string;
  status: "delivered" | "failed" | "pending" | "bounced";
  type: "booking" | "payment" | "system" | "marketing";
  template: string;
}

interface EmailHistoryProps {
  emails?: EmailHistoryItem[];
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onFilter?: (type: string) => void;
}

export default function EmailHistory({
  emails = [],
  onView,
  onDownload,
  onFilter,
}: EmailHistoryProps) {
  const mockEmails: EmailHistoryItem[] = [
    {
      id: "1",
      subject: "Booking Confirmation - Room E-201",
      recipient: "john.smith@email.com",
      sender: "bookings@etunaguesthouse.com",
      timestamp: "2024-01-15 10:30:00",
      status: "delivered",
      type: "booking",
      template: "booking_confirmation",
    },
    {
      id: "2",
      subject: "Payment Receipt - Transaction #12345",
      recipient: "maria.garcia@company.com",
      sender: "payments@etunaguesthouse.com",
      timestamp: "2024-01-15 09:15:00",
      status: "delivered",
      type: "payment",
      template: "payment_receipt",
    },
    {
      id: "3",
      subject: "Welcome to Etuna Guesthouse",
      recipient: "new.guest@email.com",
      sender: "welcome@etunaguesthouse.com",
      timestamp: "2024-01-14 16:45:00",
      status: "failed",
      type: "marketing",
      template: "welcome_email",
    },
    {
      id: "4",
      subject: "System Maintenance Notice",
      recipient: "admin@etunaguesthouse.com",
      sender: "system@buffrhost.com",
      timestamp: "2024-01-14 14:20:00",
      status: "delivered",
      type: "system",
      template: "maintenance_notice",
    },
  ];

  const displayEmails = emails.length > 0 ? emails : mockEmails;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "bounced":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Mail className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "bounced":
        return "bg-orange-100 text-orange-800";
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
        <h2 className="text-2xl font-bold">Email History</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
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

      {/* Email History List */}
      <div className="space-y-3">
        {displayEmails.map((email) => (
          <Card key={email.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getStatusIcon(email.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-sm truncate">
                        {email.subject}
                      </h3>
                      <Badge className={getStatusColor(email.status)}>
                        {email.status}
                      </Badge>
                      <Badge className={getTypeColor(email.type)}>
                        {email.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">To:</span> {email.recipient}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">From:</span> {email.sender}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Template:</span>{" "}
                      {email.template}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{email.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView?.(email.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload?.(email.id)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayEmails.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No email history
            </h3>
            <p className="text-gray-500">No emails have been sent yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
