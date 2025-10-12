"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Utensils, Users, Calendar, Settings, TrendingUp } from "lucide-react";

export default function RestaurantBusinessPage() {
  const params = useParams();
  const businessId = params?.businessId as string;

  return (
    <div className="min-h-screen bg-nude-50">
      {/* Header */}
      <div className="bg-white border-b border-nude-200">
        <div className="container-warm py-4">
          <div className="flex items-center space-x-4">
            <button className="btn-emotional-ghost p-2">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Utensils className="h-8 w-8 text-luxury-charlotte" />
            <div>
              <h1 className="heading-card">Restaurant Management</h1>
              <p className="body-small text-nude-600">Business ID: {businessId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-warm py-8">
        {/* Business Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card-default">
            <h3 className="heading-card mb-2">Menu Items</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">127</div>
            <div className="text-sm text-nude-600">Total Items</div>
          </div>
          
          <div className="card-default">
            <h3 className="heading-card mb-2">Orders</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">89</div>
            <div className="text-sm text-nude-600">Today</div>
          </div>
          
          <div className="card-default">
            <h3 className="heading-card mb-2">Reservations</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">34</div>
            <div className="text-sm text-nude-600">Tonight</div>
          </div>
          
          <div className="card-default">
            <h3 className="heading-card mb-2">Revenue</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">$8.2k</div>
            <div className="text-sm text-nude-600">This Week</div>
          </div>
        </div>

        {/* Business Services */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-default card-interactive">
            <Utensils className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Menu Management</h3>
            <p className="body-regular text-nude-600 mb-4">Manage menu items and pricing</p>
            <button className="btn-emotional-primary w-full">Manage Menu</button>
          </div>
          
          <div className="card-default card-interactive">
            <Users className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Order Management</h3>
            <p className="body-regular text-nude-600 mb-4">Process and track orders</p>
            <button className="btn-emotional-primary w-full">View Orders</button>
          </div>
          
          <div className="card-default card-interactive">
            <Calendar className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Reservations</h3>
            <p className="body-regular text-nude-600 mb-4">Table reservation system</p>
            <button className="btn-emotional-primary w-full">Manage Reservations</button>
          </div>
        </div>
      </div>
    </div>
  );
}
