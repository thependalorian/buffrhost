"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAnalytics, useRealTimeMetrics } from "../../../hooks/use-analytics";
import { 
  Building2, 
  Users, 
  Calendar, 
  BarChart3, 
  Bed, 
  Utensils, 
  Heart, 
  Users2,
  TrendingUp,
  Clock,
  Star,
  DollarSign,
  Home
} from "lucide-react";

interface DashboardPreviewProps {
  type: "hotel" | "restaurant" | "multi-venue" | "boutique" | "airbnb";
  features: string[];
  className?: string;
}

const personaConfig = {
  hotel: {
    title: "Hotel Operations Dashboard",
    color: "nude-600",
    bgClass: "bg-nude-600",
    icon: Building2,
    metrics: [
      { label: "Occupancy Rate", value: "87%", trend: "+5.2%" },
      { label: "Revenue Today", value: "N$ 45,200", trend: "+12.3%" },
      { label: "Check-ins", value: "23", trend: "+8.1%" },
      { label: "Guest Rating", value: "4.8/5", trend: "+0.3" }
    ],
    modules: [
      { name: "Room Management", icon: Bed, status: "active" },
      { name: "Guest Services", icon: Users, status: "active" },
      { name: "Revenue Analytics", icon: BarChart3, status: "active" },
      { name: "Staff Scheduling", icon: Calendar, status: "active" }
    ]
  },
  restaurant: {
    title: "Restaurant Operations Center",
    color: "nude-500",
    bgClass: "bg-nude-500",
    icon: Utensils,
    metrics: [
      { label: "Covers Today", value: "156", trend: "+18.2%" },
      { label: "Revenue", value: "N$ 12,400", trend: "+15.7%" },
      { label: "Avg Order Value", value: "N$ 79.50", trend: "+8.3%" },
      { label: "Table Turnover", value: "2.3x", trend: "+0.4x" }
    ],
    modules: [
      { name: "Table Management", icon: Users2, status: "active" },
      { name: "Order Processing", icon: Utensils, status: "active" },
      { name: "Kitchen Display", icon: Clock, status: "active" },
      { name: "Inventory Control", icon: BarChart3, status: "active" }
    ]
  },
  "multi-venue": {
    title: "Multi-Venue Command Center",
    color: "nude-700",
    bgClass: "bg-nude-700",
    icon: Building2,
    metrics: [
      { label: "Total Revenue", value: "N$ 89,500", trend: "+22.1%" },
      { label: "Active Properties", value: "4", trend: "+1" },
      { label: "Cross-bookings", value: "47", trend: "+35.2%" },
      { label: "Unified Rating", value: "4.7/5", trend: "+0.2" }
    ],
    modules: [
      { name: "Property Overview", icon: Building2, status: "active" },
      { name: "Cross-Venue Analytics", icon: BarChart3, status: "active" },
      { name: "Unified Guest Profiles", icon: Users, status: "active" },
      { name: "Centralized Reporting", icon: TrendingUp, status: "active" }
    ]
  },
  boutique: {
    title: "Boutique Property Suite",
    color: "nude-700",
    bgClass: "bg-nude-700",
    icon: Star,
    metrics: [
      { label: "Guest Satisfaction", value: "4.9/5", trend: "+0.1" },
      { label: "Revenue per Guest", value: "N$ 1,250", trend: "+18.5%" },
      { label: "Repeat Bookings", value: "73%", trend: "+12.3%" },
      { label: "Premium Services", value: "8 Active", trend: "+2" }
    ],
    modules: [
      { name: "Luxury Guest Experience", icon: Star, status: "active" },
      { name: "Spa & Wellness", icon: Heart, status: "active" },
      { name: "Personalized Service", icon: Users, status: "active" },
      { name: "Revenue Optimization", icon: DollarSign, status: "active" }
    ]
  },
  airbnb: {
    title: "Airbnb Host Dashboard",
    color: "nude-500",
    bgClass: "bg-nude-500",
    icon: Home,
    metrics: [
      { label: "Occupancy Rate", value: "92%", trend: "+8.4%" },
      { label: "Revenue This Month", value: "N$ 15,600", trend: "+24.1%" },
      { label: "Active Listings", value: "3", trend: "+1" },
      { label: "Guest Rating", value: "4.9/5", trend: "+0.2" }
    ],
    modules: [
      { name: "Guest Communication", icon: Users, status: "active" },
      { name: "Dynamic Pricing", icon: DollarSign, status: "active" },
      { name: "Cleaning Schedule", icon: Calendar, status: "active" },
      { name: "Multi-Platform Sync", icon: BarChart3, status: "active" }
    ]
  }
};

export default function DashboardPreview({ type, features, className = "" }: DashboardPreviewProps) {
  const config = personaConfig[type];
  const IconComponent = config.icon;
  
  // Use real analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalytics("demo-property");
  const { data: realTimeData, isLoading: realTimeLoading } = useRealTimeMetrics("demo-property");

  // Get real metrics or fallback to config defaults
  const getMetrics = () => {
    if (analyticsLoading || realTimeLoading) {
      return config.metrics.map(metric => ({ ...metric, value: "Loading..." }));
    }
    
    if (analyticsData && realTimeData) {
      return [
        { 
          label: "Occupancy Rate", 
          value: `${analyticsData.occupancyRate || 0}%`, 
          trend: `+${analyticsData.occupancyTrend || 0}%` 
        },
        { 
          label: "Revenue Today", 
          value: `N$ ${(analyticsData.todayRevenue || 0).toLocaleString()}`, 
          trend: `+${analyticsData.revenueTrend || 0}%` 
        },
        { 
          label: realTimeData.activeBookings ? "Active Bookings" : "Check-ins", 
          value: realTimeData.activeBookings || analyticsData.checkIns || 0, 
          trend: `+${realTimeData.bookingTrend || 0}%` 
        },
        { 
          label: "Guest Rating", 
          value: `${analyticsData.guestRating || 0}/5`, 
          trend: `+${analyticsData.ratingTrend || 0}` 
        }
      ];
    }
    
    return config.metrics;
  };

  const metrics = getMetrics();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className={`w-16 h-16 ${config.bgClass} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-luxury-soft`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-display font-bold text-nude-900 mb-2">
          {config.title}
        </h3>
        <p className="text-nude-800">
          Everything you need to manage your {type === "multi-venue" ? "properties" : type} in one place
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="text-center p-4">
            <CardContent className="p-0">
              <div className="text-2xl font-bold text-nude-900 mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-nude-600 mb-1">
                {metric.label}
              </div>
              <div className="text-xs text-semantic-success flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {metric.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Modules */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {config.modules.map((module, index) => (
          <Card key={index} className="group hover:shadow-luxury-medium transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 bg-nude-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <module.icon className={`w-6 h-6 text-nude-600`} />
              </div>
              <h4 className="font-semibold text-nude-900 mb-1">
                {module.name}
              </h4>
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-semantic-success rounded-full"></div>
                <span className="text-xs text-semantic-success">
                  {module.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features List */}
      <div className="bg-nude-50 rounded-2xl p-6">
        <h4 className="font-semibold text-nude-900 mb-4">
          Key Features for {type === "multi-venue" ? "Multi-Venue" : type.charAt(0).toUpperCase() + type.slice(1)} Operations:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-2 h-2 bg-nude-600 rounded-full`}></div>
              <span className="text-sm text-nude-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}