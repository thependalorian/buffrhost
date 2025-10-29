"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Home, Calendar, Settings } from "lucide-react";

export default function RoomDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="min-h-screen bg-nude-50">
      {/* Header */}
      <div className="bg-white border-b border-nude-200">
        <div className="container-warm py-4">
          <div className="flex items-center space-x-4">
            <BuffrButton variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </BuffrButton>
            <div>
              <h1 className="heading-card">Room Details</h1>
              <p className="body-small text-nude-600">Room ID: {id}</p>
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
              <h2 className="heading-card mb-4">Room Details Management</h2>
              <p className="body-regular text-nude-700 mb-4">
                This is a dynamic route for room details with ID: {id}
              </p>
              <div className="flex flex-wrap gap-3">
                <BuffrButton variant="primary" size="md">
                  View Details
                </BuffrButton>
                <BuffrButton variant="secondary" size="md">
                  Edit
                </BuffrButton>
                <BuffrButton variant="ghost" size="md">
                  Book
                </BuffrButton>
              </div>
            </div>

            {/* Additional Content Based on Route Type */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-default">
                <h3 className="heading-card mb-3">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                    <Home className="h-5 w-5 inline mr-2" />
                    View Room
                  </button>
                  <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                    <Calendar className="h-5 w-5 inline mr-2" />
                    Check Availability
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
                    <span className="body-small text-nude-600">Room cleaned</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-nude-400 rounded-full"></div>
                    <span className="body-small text-nude-600">Maintenance completed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-semantic-success rounded-full"></div>
                    <span className="body-small text-nude-600">Ready for booking</span>
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
                  <span className="body-small font-medium text-nude-800">Room ID:</span>
                  <span className="body-small text-nude-600 ml-2">{id}</span>
                </div>
                <div>
                  <span className="body-small font-medium text-nude-800">Status:</span>
                  <span className="body-small text-semantic-success ml-2">Available</span>
                </div>
                <div>
                  <span className="body-small font-medium text-nude-800">Type:</span>
                  <span className="body-small text-nude-600 ml-2">Deluxe Suite</span>
                </div>
              </div>
            </div>

            <div className="card-default">
              <h3 className="heading-card mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="body-small text-nude-600">Capacity</span>
                  <span className="body-small font-medium text-nude-800">4 guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-small text-nude-600">Price</span>
                  <span className="body-small font-medium text-nude-800">$500/night</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-small text-nude-600">Rating</span>
                  <span className="body-small font-medium text-semantic-success">4.8/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}