"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Home, Calendar, Users, Utensils, Sparkles, Settings } from "lucide-react";

export default function HotelDashboardPage() {
  const params = useParams();
  const hotelId = params?.id as string;

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
              <h1 className="heading-card">Hotel Dashboard</h1>
              <p className="body-small text-nude-600">Hotel ID: {hotelId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-warm py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card-default">
            <h3 className="heading-card mb-3">Rooms</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">45</div>
            <div className="text-sm text-nude-600">Total Rooms</div>
          </div>
          
          <div className="card-default">
            <h3 className="heading-card mb-3">Bookings</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">23</div>
            <div className="text-sm text-nude-600">Today</div>
          </div>
          
          <div className="card-default">
            <h3 className="heading-card mb-3">Guests</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">67</div>
            <div className="text-sm text-nude-600">Checked In</div>
          </div>
          
          <div className="card-default">
            <h3 className="heading-card mb-3">Revenue</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">$12.5k</div>
            <div className="text-sm text-nude-600">This Month</div>
          </div>
        </div>

        {/* Main Navigation - Hotel Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card-default card-interactive">
            <Home className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Rooms & Accommodation</h3>
            <p className="body-regular text-nude-600 mb-4">Manage room inventory, availability, and maintenance</p>
            <button className="btn-emotional-primary w-full">Manage Rooms</button>
          </div>
          
          <div className="card-default card-interactive">
            <Calendar className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Bookings & Reservations</h3>
            <p className="body-regular text-nude-600 mb-4">View and manage guest reservations</p>
            <button className="btn-emotional-primary w-full">View Bookings</button>
          </div>
          
          <div className="card-default card-interactive">
            <Users className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Guests</h3>
            <p className="body-regular text-nude-600 mb-4">Guest profiles and preferences</p>
            <button className="btn-emotional-primary w-full">Manage Guests</button>
          </div>
        </div>

        {/* Restaurant & Services Section */}
        <div className="mb-8">
          <h2 className="heading-section mb-6">Restaurants & Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-default card-interactive">
              <Utensils className="h-8 w-8 text-luxury-charlotte mb-4" />
              <h3 className="heading-card mb-2">Main Restaurant</h3>
              <p className="body-regular text-nude-600 mb-4">Fine dining restaurant</p>
              <button className="btn-emotional-secondary w-full">Manage Restaurant</button>
            </div>
            
            <div className="card-default card-interactive">
              <Utensils className="h-8 w-8 text-luxury-charlotte mb-4" />
              <h3 className="heading-card mb-2">Pool Bar & Grill</h3>
              <p className="body-regular text-nude-600 mb-4">Casual dining by the pool</p>
              <button className="btn-emotional-secondary w-full">Manage Restaurant</button>
            </div>
            
            <div className="card-default card-interactive">
              <Sparkles className="h-8 w-8 text-luxury-charlotte mb-4" />
              <h3 className="heading-card mb-2">Spa & Wellness</h3>
              <p className="body-regular text-nude-600 mb-4">Spa services and treatments</p>
              <button className="btn-emotional-secondary w-full">Manage Spa</button>
            </div>
          </div>
        </div>

        {/* Management Tools */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-default">
            <h3 className="heading-card mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                <Calendar className="h-5 w-5 inline mr-2" />
                Check-in Guest
              </button>
              <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                <Users className="h-5 w-5 inline mr-2" />
                Guest Services
              </button>
              <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                <Settings className="h-5 w-5 inline mr-2" />
                Hotel Settings
              </button>
            </div>
          </div>

          <div className="card-default">
            <h3 className="heading-card mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-luxury-charlotte rounded-full"></div>
                <span className="body-small text-nude-600">New booking received</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-nude-400 rounded-full"></div>
                <span className="body-small text-nude-600">Room service order</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-semantic-success rounded-full"></div>
                <span className="body-small text-nude-600">Guest checked in</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
