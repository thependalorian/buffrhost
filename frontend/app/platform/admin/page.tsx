"use client";

import React from "react";
import { Building2, Users, TrendingUp, Settings, Shield, BarChart3 } from "lucide-react";

export default function PlatformAdminPage() {
  return (
    <div className="min-h-screen bg-nude-50">
      {/* Header */}
      <div className="bg-white border-b border-nude-200">
        <div className="container-warm py-4">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-luxury-charlotte" />
            <div>
              <h1 className="heading-card">Platform Administration</h1>
              <p className="body-small text-nude-600">Manage all businesses and users across the platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-warm py-8">
        {/* Platform Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card-default">
            <Building2 className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Total Businesses</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">247</div>
            <div className="text-sm text-nude-600">Hotels: 156 | Restaurants: 91</div>
          </div>
          
          <div className="card-default">
            <Users className="h-8 w-8 text-nude-600 mb-4" />
            <h3 className="heading-card mb-2">Active Users</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">12,847</div>
            <div className="text-sm text-nude-600">Guests: 11,203 | Staff: 1,644</div>
          </div>
          
          <div className="card-default">
            <TrendingUp className="h-8 w-8 text-semantic-success mb-4" />
            <h3 className="heading-card mb-2">Platform Revenue</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">$2.4M</div>
            <div className="text-sm text-nude-600">This month (+12%)</div>
          </div>
          
          <div className="card-default">
            <BarChart3 className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Bookings</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">8,923</div>
            <div className="text-sm text-nude-600">This month</div>
          </div>
        </div>

        {/* Business Management */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-default">
            <h3 className="heading-card mb-4">Business Management</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                <Building2 className="h-5 w-5 inline mr-2" />
                Manage Hotels
              </button>
              <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                <Building2 className="h-5 w-5 inline mr-2" />
                Manage Restaurants
              </button>
              <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                <Users className="h-5 w-5 inline mr-2" />
                User Management
              </button>
              <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                <Settings className="h-5 w-5 inline mr-2" />
                Platform Settings
              </button>
            </div>
          </div>

          <div className="card-default">
            <h3 className="heading-card mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-luxury-charlotte rounded-full"></div>
                <span className="body-small text-nude-600">New hotel registered: Grand Plaza</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-nude-400 rounded-full"></div>
                <span className="body-small text-nude-600">Restaurant updated menu: Seaside Bistro</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-semantic-success rounded-full"></div>
                <span className="body-small text-nude-600">Payment processed: $2,450</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
