/**
 * Admin Email Controls Dashboard Component
 *
 * Administrative dashboard for email system management
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Settings,
  Users,
  BarChart3,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Pause,
  Play,
  RefreshCw,
} from "lucide-react";
import EmailAnalyticsChart from "./EmailAnalyticsChart";

interface EmailSystemStatus {
  status: "active" | "paused" | "maintenance";
  queueSize: number;
  processingRate: number;
  lastProcessed: string;
  errors: number;
}

interface AdminEmailControlsDashboardProps {
  systemStatus?: EmailSystemStatus;
}

export default function AdminEmailControlsDashboard({
  systemStatus,
}: AdminEmailControlsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const mockSystemStatus: EmailSystemStatus = {
    status: "active",
    queueSize: 1247,
    processingRate: 150,
    lastProcessed: "2024-01-15 10:30:00",
    errors: 3,
  };

  const currentStatus = systemStatus || mockSystemStatus;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "paused":
        return "text-yellow-600 bg-yellow-100";
      case "maintenance":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="w-4 h-4" />;
      case "paused":
        return <Pause className="w-4 h-4" />;
      case "maintenance":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleSystemControl = (action: string) => {
    console.log(`System control action: ${action}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email System Controls</h1>
          <p className="text-gray-600">
            Administrative controls for email system management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div
                className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(
                  currentStatus.status,
                )}`}
              >
                {getStatusIcon(currentStatus.status)}
                <span className="font-medium capitalize">
                  {currentStatus.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">System Status</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentStatus.queueSize.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Queue Size</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {currentStatus.processingRate}/min
              </div>
              <p className="text-sm text-gray-600">Processing Rate</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {currentStatus.errors}
              </div>
              <p className="text-sm text-gray-600">Errors</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Processed</p>
                <p className="font-medium">{currentStatus.lastProcessed}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSystemControl("pause")}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSystemControl("resume")}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSystemControl("maintenance")}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Maintenance
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="queue" className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>Queue</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <EmailAnalyticsChart />
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Queue Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Pending Emails</h3>
                    <p className="text-sm text-gray-600">
                      1,247 emails waiting to be sent
                    </p>
                  </div>
                  <Button variant="outline">
                    <Send className="w-4 h-4 mr-2" />
                    Process Queue
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          892
                        </div>
                        <p className="text-sm text-gray-600">High Priority</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          312
                        </div>
                        <p className="text-sm text-gray-600">Normal Priority</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          43
                        </div>
                        <p className="text-sm text-gray-600">Low Priority</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                User Management
              </h3>
              <p className="text-gray-500">
                Manage email users and permissions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                System Settings
              </h3>
              <p className="text-gray-500">
                Configure email system settings and preferences.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
