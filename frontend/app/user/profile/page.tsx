'use client';

import React from 'react';
import { User, Settings, Bell, Shield, Calendar, Utensils } from 'lucide-react';

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-nude-50">
      {/* Header */}
      <div className="bg-white border-b border-nude-200">
        <div className="container-warm py-4">
          <div className="flex items-center space-x-4">
            <User className="h-8 w-8 text-luxury-charlotte" />
            <div>
              <h1 className="heading-card">My Profile</h1>
              <p className="body-small text-nude-600">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-warm py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="md:col-span-2">
            <div className="card-default mb-6">
              <h2 className="heading-card mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="body-small font-medium text-nude-800">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-nude-300 rounded-lg focus:ring-2 focus:ring-luxury-charlotte focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="body-small font-medium text-nude-800">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 border border-nude-300 rounded-lg focus:ring-2 focus:ring-luxury-charlotte focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="body-small font-medium text-nude-800">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-nude-300 rounded-lg focus:ring-2 focus:ring-luxury-charlotte focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Cross-Tenant Activity */}
            <div className="card-default">
              <h2 className="heading-card mb-4">My Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-nude-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-luxury-charlotte" />
                  <div>
                    <p className="body-small font-medium">Hotel Bookings</p>
                    <p className="body-small text-nude-600">
                      3 upcoming reservations
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-nude-50 rounded-lg">
                  <Utensils className="h-5 w-5 text-luxury-charlotte" />
                  <div>
                    <p className="body-small font-medium">Restaurant Orders</p>
                    <p className="body-small text-nude-600">
                      12 orders this month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card-default">
              <h3 className="heading-card mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                  <Settings className="h-5 w-5 inline mr-2" />
                  Account Settings
                </button>
                <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                  <Bell className="h-5 w-5 inline mr-2" />
                  Notifications
                </button>
                <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                  <Shield className="h-5 w-5 inline mr-2" />
                  Privacy & Security
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
