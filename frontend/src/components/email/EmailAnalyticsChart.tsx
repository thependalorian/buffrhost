/**
 * Email Analytics Chart Component
 *
 * Displays email performance analytics and charts
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Eye,
  MousePointer,
} from "lucide-react";

interface EmailAnalyticsData {
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

interface EmailAnalyticsChartProps {
  data?: EmailAnalyticsData;
  timeRange?: "7d" | "30d" | "90d";
}

export default function EmailAnalyticsChart({
  data,
  timeRange = "30d",
}: EmailAnalyticsChartProps) {
  const mockData: EmailAnalyticsData = {
    totalSent: 1250,
    delivered: 1187,
    opened: 892,
    clicked: 267,
    bounced: 63,
    unsubscribed: 12,
    deliveryRate: 95.0,
    openRate: 75.1,
    clickRate: 30.0,
    bounceRate: 5.0,
  };

  const analyticsData = data || mockData;

  const metrics = [
    {
      label: "Total Sent",
      value: analyticsData.totalSent.toLocaleString(),
      icon: Send,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Delivered",
      value: analyticsData.delivered.toLocaleString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Opened",
      value: analyticsData.opened.toLocaleString(),
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Clicked",
      value: analyticsData.clicked.toLocaleString(),
      icon: MousePointer,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      label: "Bounced",
      value: analyticsData.bounced.toLocaleString(),
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const rates = [
    {
      label: "Delivery Rate",
      value: `${analyticsData.deliveryRate}%`,
      trend: "up",
      change: "+2.1%",
    },
    {
      label: "Open Rate",
      value: `${analyticsData.openRate}%`,
      trend: "up",
      change: "+5.3%",
    },
    {
      label: "Click Rate",
      value: `${analyticsData.clickRate}%`,
      trend: "down",
      change: "-1.2%",
    },
    {
      label: "Bounce Rate",
      value: `${analyticsData.bounceRate}%`,
      trend: "down",
      change: "-0.8%",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Analytics</h1>
          <p className="text-gray-600">
            Email performance metrics and insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${metric.bgColor}`}>
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Rates */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {rates.map((rate, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{rate.label}</p>
                  <p className="text-2xl font-bold">{rate.value}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {rate.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      rate.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {rate.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Volume Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">
                  Chart visualization would go here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Performance by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">
                  Pie chart visualization would go here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Engagement Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Unique Opens</span>
                  <span className="font-medium">892</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Opens</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Unique Clicks</span>
                  <span className="font-medium">267</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Clicks</span>
                  <span className="font-medium">389</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Quality Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Unsubscribes</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Spam Complaints</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">List Growth</span>
                  <span className="font-medium text-green-600">+45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">List Churn</span>
                  <span className="font-medium text-red-600">-12</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
