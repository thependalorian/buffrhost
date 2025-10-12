"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar, CreditCard, Settings } from "lucide-react";

export default function BookingDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="min-h-screen bg-nude-50">
      {/* Header */}
      <div className="bg-white border-b border-nude-200">
        <div className="container-warm py-4">
          <div className="flex items-center space-x-4">
            <button className="btn-emotional-ghost p-2">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="heading-card">Booking Details</h1>
              <p className="body-small text-nude-600">Booking ID: {id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-warm py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="card-default mb-6">
              <h2 className="heading-card mb-4">Booking Details Management</h2>
              <p className="body-regular text-nude-700 mb-4">
                This is a dynamic route for booking details with ID: {id}
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="btn-emotional-primary">
                  View Details
                </button>
                <button className="btn-emotional-secondary">
                  Modify
                </button>
                <button className="btn-emotional-ghost">
                  Cancel
                </button>
              </div>
            </div>

            {/* Additional Content Based on Route Type */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-default">
                <h3 className="heading-card mb-3">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                    <Calendar className="h-5 w-5 inline mr-2" />
                    View Schedule
                  </button>
                  <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                    <CreditCard className="h-5 w-5 inline mr-2" />
                    Payment
                  </button>
                  <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                    <Settings className="h-5 w-5 inline mr-2" />
                    Settings
                  </button>
                </div>
              </div>

              <div className="card-default">
                <h3 className="heading-card mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-luxury-charlotte rounded-full"></div>
                    <span className="body-small text-nude-600">Booking confirmed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-nude-400 rounded-full"></div>
                    <span className="body-small text-nude-600">Payment processed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-semantic-success rounded-full"></div>
                    <span className="body-small text-nude-600">Check-in ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card-default">
              <h3 className="heading-card mb-4">Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="body-small font-medium text-nude-800">Booking ID:</span>
                  <span className="body-small text-nude-600 ml-2">{id}</span>
                </div>
                <div>
                  <span className="body-small font-medium text-nude-800">Status:</span>
                  <span className="body-small text-semantic-success ml-2">Confirmed</span>
                </div>
                <div>
                  <span className="body-small font-medium text-nude-800">Created:</span>
                  <span className="body-small text-nude-600 ml-2">Today</span>
                </div>
              </div>
            </div>

            <div className="card-default">
              <h3 className="heading-card mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="body-small text-nude-600">Total Items</span>
                  <span className="body-small font-medium text-nude-800">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-small text-nude-600">This Month</span>
                  <span className="body-small font-medium text-nude-800">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-small text-nude-600">Success Rate</span>
                  <span className="body-small font-medium text-semantic-success">95%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}