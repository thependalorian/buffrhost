'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Sparkles, Calendar, Star } from 'lucide-react';

export default function HotelSpaPage() {
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
              <h1 className="heading-card">Hotel Spa & Wellness</h1>
              <p className="body-small text-nude-600">Hotel ID: {hotelId}</p>
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
              <h2 className="heading-card mb-4">Spa & Wellness Management</h2>
              <p className="body-regular text-nude-700 mb-4">
                Manage spa services, treatments, and wellness programs for your
                hotel guests.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="btn-emotional-primary">
                  Manage Services
                </button>
                <button className="btn-emotional-secondary">
                  View Bookings
                </button>
                <button className="btn-emotional-ghost">Staff Schedule</button>
              </div>
            </div>

            {/* Spa Services */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-default">
                <h3 className="heading-card mb-3">Treatment Services</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                    <Sparkles className="h-5 w-5 inline mr-2" />
                    Massage Therapies
                  </button>
                  <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                    <Star className="h-5 w-5 inline mr-2" />
                    Facial Treatments
                  </button>
                  <button className="w-full text-left p-3 hover:bg-nude-100 rounded-full transition-colors">
                    <Calendar className="h-5 w-5 inline mr-2" />
                    Wellness Programs
                  </button>
                </div>
              </div>

              <div className="card-default">
                <h3 className="heading-card mb-3">Today's Schedule</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-luxury-charlotte rounded-full"></div>
                    <span className="body-small text-nude-600">
                      Deep Tissue Massage - 2:00 PM
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-nude-400 rounded-full"></div>
                    <span className="body-small text-nude-600">
                      Facial Treatment - 3:30 PM
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-semantic-success rounded-full"></div>
                    <span className="body-small text-nude-600">
                      Couples Massage - 5:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card-default">
              <h3 className="heading-card mb-4">Spa Information</h3>
              <div className="space-y-3">
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
                    Spa Type:
                  </span>
                  <span className="body-small text-nude-600 ml-2">
                    Luxury Wellness
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
                <div>
                  <span className="body-small font-medium text-nude-800">
                    Operating Hours:
                  </span>
                  <span className="body-small text-nude-600 ml-2">
                    8 AM - 10 PM
                  </span>
                </div>
              </div>
            </div>

            <div className="card-default">
              <h3 className="heading-card mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="body-small text-nude-600">
                    Available Services
                  </span>
                  <span className="body-small font-medium text-nude-800">
                    15
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="body-small text-nude-600">
                    Today's Bookings
                  </span>
                  <span className="body-small font-medium text-nude-800">
                    8
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="body-small text-nude-600">Therapists</span>
                  <span className="body-small font-medium text-nude-800">
                    6
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="body-small text-nude-600">Rating</span>
                  <span className="body-small font-medium text-semantic-success">
                    4.9/5
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
