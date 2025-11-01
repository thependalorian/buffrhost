'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Utensils, Calendar, Settings } from 'lucide-react';

export default function HotelRestaurantPage() {
  const params = useParams();
  const hotelId = params?.id as string;
  const restaurantId = params?.restaurantId as string;

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
              <h1 className="heading-card">Hotel Restaurant</h1>
              <p className="body-small text-nude-600">
                Hotel: {hotelId} | Restaurant: {restaurantId}
              </p>
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
              <h2 className="heading-card mb-4">Restaurant Management</h2>
              <p className="body-regular text-nude-700 mb-4">
                Manage this restaurant within your hotel. Each hotel can have
                multiple restaurants with their own menus and services.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="btn-emotional-primary">Manage Menu</button>
                <button className="btn-emotional-secondary">View Orders</button>
                <button className="btn-emotional-ghost">Settings</button>
              </div>
            </div>

            {/* Restaurant Services */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-default">
                <h3 className="heading-card mb-3">Menu Management</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                    <Utensils className="h-5 w-5 inline mr-2" />
                    View Menu Items
                  </button>
                  <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                    <Calendar className="h-5 w-5 inline mr-2" />
                    Manage Categories
                  </button>
                  <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                    <Settings className="h-5 w-5 inline mr-2" />
                    Pricing & Availability
                  </button>
                </div>
              </div>

              <div className="card-default">
                <h3 className="heading-card mb-3">Orders & Service</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-luxury-charlotte rounded-full"></div>
                    <span className="body-small text-nude-600">
                      12 pending orders
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-nude-400 rounded-full"></div>
                    <span className="body-small text-nude-600">
                      3 room service orders
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-semantic-success rounded-full"></div>
                    <span className="body-small text-nude-600">
                      8 completed today
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card-default">
              <h3 className="heading-card mb-4">Restaurant Info</h3>
              <div className="space-y-3">
                <div>
                  <span className="body-small font-medium text-nude-800">
                    Restaurant ID:
                  </span>
                  <span className="body-small text-nude-600 ml-2">
                    {restaurantId}
                  </span>
                </div>
                <div>
                  <span className="body-small font-medium text-nude-800">
                    Hotel ID:
                  </span>
                  <span className="body-small text-nude-600 ml-2">
                    {hotelId}
                  </span>
                </div>
                <div>
                  <span className="body-small font-medium text-nude-800">
                    Type:
                  </span>
                  <span className="body-small text-nude-600 ml-2">
                    Fine Dining
                  </span>
                </div>
                <div>
                  <span className="body-small font-medium text-nude-800">
                    Status:
                  </span>
                  <span className="body-small text-semantic-success ml-2">
                    Open
                  </span>
                </div>
              </div>
            </div>

            <div className="card-default">
              <h3 className="heading-card mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="body-small text-nude-600">Menu Items</span>
                  <span className="body-small font-medium text-nude-800">
                    45
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="body-small text-nude-600">
                    Today's Orders
                  </span>
                  <span className="body-small font-medium text-nude-800">
                    23
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="body-small text-nude-600">Rating</span>
                  <span className="body-small font-medium text-semantic-success">
                    4.8/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
