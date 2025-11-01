'use client';

import React from 'react';
import { useParams } from 'next/navigation';
export default function RestaurantDashboardPage() {
  const params = useParams();
  const restaurantId = params?.id as string;

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
              <h1 className="heading-card">Restaurant Dashboard</h1>
              <p className="body-small text-nude-600">
                Restaurant ID: {restaurantId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-warm py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card-default">
            <h3 className="heading-card mb-3">Menu Items</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">127</div>
            <div className="text-sm text-nude-600">Total Items</div>
          </div>

          <div className="card-default">
            <h3 className="heading-card mb-3">Orders</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">89</div>
            <div className="text-sm text-nude-600">Today</div>
          </div>

          <div className="card-default">
            <h3 className="heading-card mb-3">Reservations</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">34</div>
            <div className="text-sm text-nude-600">Tonight</div>
          </div>

          <div className="card-default">
            <h3 className="heading-card mb-3">Revenue</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">$8.2k</div>
            <div className="text-sm text-nude-600">This Week</div>
          </div>
        </div>

        {/* Main Navigation - Restaurant Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card-default card-interactive">
            <Utensils className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Menu Management</h3>
            <p className="body-regular text-nude-600 mb-4">
              Manage menu items, categories, and pricing
            </p>
            <button className="btn-emotional-primary w-full">
              Manage Menu
            </button>
          </div>

          <div className="card-default card-interactive">
            <Calendar className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Reservations</h3>
            <p className="body-regular text-nude-600 mb-4">
              Manage table reservations and seating
            </p>
            <button className="btn-emotional-primary w-full">
              View Reservations
            </button>
          </div>

          <div className="card-default card-interactive">
            <Clock className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Orders</h3>
            <p className="body-regular text-nude-600 mb-4">
              Manage dine-in and takeout orders
            </p>
            <button className="btn-emotional-primary w-full">
              View Orders
            </button>
          </div>
        </div>

        {/* Staff & Operations */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card-default card-interactive">
            <Users className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Staff Management</h3>
            <p className="body-regular text-nude-600 mb-4">
              Manage staff schedules and performance
            </p>
            <button className="btn-emotional-secondary w-full">
              Manage Staff
            </button>
          </div>

          <div className="card-default card-interactive">
            <Star className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Customer Reviews</h3>
            <p className="body-regular text-nude-600 mb-4">
              View and respond to customer feedback
            </p>
            <button className="btn-emotional-secondary w-full">
              View Reviews
            </button>
          </div>

          <div className="card-default card-interactive">
            <Settings className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Restaurant Settings</h3>
            <p className="body-regular text-nude-600 mb-4">
              Configure restaurant preferences
            </p>
            <button className="btn-emotional-secondary w-full">Settings</button>
          </div>
        </div>

        {/* Management Tools */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-default">
            <h3 className="heading-card mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                <Utensils className="h-5 w-5 inline mr-2" />
                Add Menu Item
              </button>
              <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                <Calendar className="h-5 w-5 inline mr-2" />
                New Reservation
              </button>
              <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                <Users className="h-5 w-5 inline mr-2" />
                Staff Schedule
              </button>
            </div>
          </div>

          <div className="card-default">
            <h3 className="heading-card mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-luxury-charlotte rounded-full"></div>
                <span className="body-small text-nude-600">
                  New order received
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-nude-400 rounded-full"></div>
                <span className="body-small text-nude-600">
                  Reservation confirmed
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-semantic-success rounded-full"></div>
                <span className="body-small text-nude-600">
                  Order completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
