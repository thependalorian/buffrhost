"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Building2, Users, Calendar, Settings, TrendingUp } from "lucide-react";

export default function HotelBusinessPage() {
  const params = useParams();
  const businessId = params?.businessId as string;

  return (
    <div className="min-h-screen bg-nude-50">
      {/* Header */}
      <div className="bg-white border-b border-nude-200">
        <div className="container-warm py-4">
          <div className="flex items-center space-x-4">
            <BuffrButton variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Building2 className="h-8 w-8 text-luxury-charlotte" />
            <div>
              <h1 className="heading-card">Hotel Management</h1>
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
            <h3 className="heading-card mb-2">Rooms</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">45</div>
            <div className="text-sm text-nude-600">Total Available</div>
          </div>
          
          <div className="card-default">
            <h3 className="heading-card mb-2">Bookings</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">23</div>
            <div className="text-sm text-nude-600">Today</div>
          </div>
          
          <div className="card-default">
            <h3 className="heading-card mb-2">Guests</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">67</div>
            <div className="text-sm text-nude-600">Checked In</div>
          </div>
          
          <div className="card-default">
            <h3 className="heading-card mb-2">Revenue</h3>
            <div className="text-3xl font-bold text-nude-800 mb-2">$12.5k</div>
            <div className="text-sm text-nude-600">This Month</div>
          </div>
        </div>

        {/* Business Services */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-default card-interactive">
            <Building2 className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Rooms & Accommodation</h3>
            <p className="body-regular text-nude-600 mb-4">Manage room inventory and bookings</p>
            <BuffrButton variant="primary" size="lg" className="w-full">Manage Rooms</BuffrButton>
          </div>
          
          <div className="card-default card-interactive">
            <Users className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Guest Services</h3>
            <p className="body-regular text-nude-600 mb-4">Guest management and services</p>
            <BuffrButton variant="primary" size="lg" className="w-full">Manage Guests</BuffrButton>
          </div>
          
          <div className="card-default card-interactive">
            <Calendar className="h-8 w-8 text-luxury-charlotte mb-4" />
            <h3 className="heading-card mb-2">Bookings & Reservations</h3>
            <p className="body-regular text-nude-600 mb-4">Reservation management system</p>
            <BuffrButton variant="primary" size="lg" className="w-full">View Bookings</BuffrButton>
          </div>
        </div>
      </div>
    </div>
  );
}
div>
        </div>
      </div>
    </div>
  );
}
