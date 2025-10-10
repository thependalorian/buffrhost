"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  Building2, 
  Utensils, 
  Heart, 
  Users2, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  Star,
  Clock,
  BarChart3
} from "lucide-react";

interface PropertyGridProps {
  venues: string[];
  metrics: string[];
  className?: string;
}

const venueConfig = {
  "Hotel": {
    icon: Building2,
    color: "nude-600",
    metrics: {
      "Occupancy": "87%",
      "Revenue": "N$ 45,200",
      "Guests": "156",
      "Rating": "4.8/5"
    },
    features: ["Room Management", "Guest Services", "Housekeeping", "Revenue Analytics"]
  },
  "Restaurant": {
    icon: Utensils,
    color: "nude-500",
    metrics: {
      "Covers": "89",
      "Revenue": "N$ 12,400",
      "Orders": "156",
      "Rating": "4.7/5"
    },
    features: ["Table Management", "Order Processing", "Kitchen Display", "Inventory"]
  },
  "Spa": {
    icon: Heart,
    color: "nude-400",
    metrics: {
      "Bookings": "23",
      "Revenue": "N$ 8,900",
      "Treatments": "45",
      "Rating": "4.9/5"
    },
    features: ["Appointment Booking", "Treatment Management", "Wellness Tracking", "Staff Scheduling"]
  },
  "Conference": {
    icon: Users2,
    color: "nude-700",
    metrics: {
      "Events": "3",
      "Revenue": "N$ 15,600",
      "Attendees": "89",
      "Rating": "4.6/5"
    },
    features: ["Event Management", "Room Booking", "Catering", "AV Management"]
  }
};

export default function PropertyGrid({ venues, metrics, className = "" }: PropertyGridProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      <div className="text-center">
        <h3 className="text-2xl font-display font-bold text-nude-900 mb-2">
          Multi-Venue Management
        </h3>
        <p className="text-nude-600">
          Manage all your properties from one unified dashboard
        </p>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {venues.map((venue, index) => {
          const config = venueConfig[venue as keyof typeof venueConfig];
          if (!config) return null;

          const IconComponent = config.icon;

          return (
            <Card key={index} className="group hover:shadow-luxury-medium transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-${config.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-nude-900">
                      {venue}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-semantic-success rounded-full"></div>
                      <span className="text-xs text-semantic-success">Active</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {Object.entries(config.metrics).map(([key, value], metricIndex) => (
                    <div key={metricIndex} className="text-center">
                      <div className="text-lg font-bold text-nude-900">
                        {value}
                      </div>
                      <div className="text-xs text-nude-600">
                        {key}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-1">
                  {config.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-xs text-nude-600">
                      <div className={`w-1.5 h-1.5 bg-${config.color} rounded-full`}></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Unified Analytics */}
      <Card className="bg-gradient-to-r from-nude-50 to-luxury-champagne/20">
        <CardHeader>
          <CardTitle className="text-center text-nude-900">
            Unified Performance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-nude-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-nude-900 mb-1">N$ 82,100</div>
              <div className="text-sm text-nude-600">Total Revenue</div>
              <div className="text-xs text-semantic-success">+18.5% vs last month</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-nude-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-nude-900 mb-1">312</div>
              <div className="text-sm text-nude-600">Total Guests</div>
              <div className="text-xs text-semantic-success">+12.3% vs last month</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-nude-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-nude-900 mb-1">4.7/5</div>
              <div className="text-sm text-nude-600">Avg Rating</div>
              <div className="text-xs text-semantic-success">+0.2 vs last month</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-nude-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-nude-900 mb-1">23%</div>
              <div className="text-sm text-nude-600">Growth Rate</div>
              <div className="text-xs text-semantic-success">+5.2% vs last month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cross-Venue Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-semantic-success/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-6 h-6 text-semantic-success" />
          </div>
          <h4 className="font-semibold text-nude-900 mb-2">Unified Analytics</h4>
          <p className="text-sm text-nude-600">
            Track performance across all venues with consolidated reporting
          </p>
        </Card>
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-semantic-info/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-semantic-info" />
          </div>
          <h4 className="font-semibold text-nude-900 mb-2">Guest Profiles</h4>
          <p className="text-sm text-nude-600">
            Single guest profiles across all your properties and services
          </p>
        </Card>
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-semantic-warning/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-semantic-warning" />
          </div>
          <h4 className="font-semibold text-nude-900 mb-2">Staff Efficiency</h4>
          <p className="text-sm text-nude-600">
            Optimize staffing across venues with intelligent scheduling
          </p>
        </Card>
      </div>
    </div>
  );
}