"use client";

import React from "react";
import { ArrowRight, Home, Utensils, Sparkles, Calendar, User } from "lucide-react";

export default function GuestExperiencePage() {
  return (
    <div className="min-h-screen bg-nude-50">
      {/* Hero Section */}
      <section className="section-warm">
        <div className="container-warm">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="heading-hero mb-6">
              Welcome to Your{" "}
              <span className="luxury-accent">Hospitality Experience</span>
            </h1>
            <p className="body-large mb-8 text-nude-700">
              Whether you're staying at a hotel or dining at a restaurant, 
              we're here to make your experience exceptional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-emotional-primary">
                Start Your Experience
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="btn-emotional-ghost">
                View Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Types */}
      <section className="section-warm bg-white">
        <div className="container-warm">
          <div className="text-center mb-16">
            <h2 className="heading-section mb-4">
              Choose Your Experience
            </h2>
            <p className="body-large text-nude-700">
              Select the type of service you're looking for
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Hotel Experience */}
            <div className="card-default card-interactive">
              <Home className="h-12 w-12 text-luxury-charlotte mb-6" />
              <h3 className="heading-card mb-4">Hotel & Accommodation</h3>
              <p className="body-regular text-nude-700 mb-6">
                Book rooms, access hotel services, order room service, 
                and enjoy all the amenities of your stay.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-nude-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="body-small">Room Bookings</span>
                </div>
                <div className="flex items-center text-nude-600">
                  <Utensils className="h-4 w-4 mr-2" />
                  <span className="body-small">Room Service</span>
                </div>
                <div className="flex items-center text-nude-600">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span className="body-small">Spa & Wellness</span>
                </div>
              </div>
              <button className="btn-emotional-primary w-full">
                Access Hotel Services
              </button>
            </div>

            {/* Restaurant Experience */}
            <div className="card-default card-interactive">
              <Utensils className="h-12 w-12 text-luxury-charlotte mb-6" />
              <h3 className="heading-card mb-4">Restaurant & Dining</h3>
              <p className="body-regular text-nude-700 mb-6">
                Browse menus, make reservations, place orders, 
                and enjoy exceptional dining experiences.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-nude-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="body-small">Table Reservations</span>
                </div>
                <div className="flex items-center text-nude-600">
                  <Utensils className="h-4 w-4 mr-2" />
                  <span className="body-small">Menu & Ordering</span>
                </div>
                <div className="flex items-center text-nude-600">
                  <User className="h-4 w-4 mr-2" />
                  <span className="body-small">Customer Service</span>
                </div>
              </div>
              <button className="btn-emotional-primary w-full">
                Access Restaurant Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-warm">
        <div className="container-warm">
          <div className="text-center mb-16">
            <h2 className="heading-section mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="body-large text-nude-700">
              Experience hospitality technology that truly cares
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-luxury-charlotte rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="heading-card mb-3">AI-Powered Service</h3>
              <p className="body-regular text-nude-600">
                Our AI concierge understands your needs and provides personalized recommendations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-nude-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="heading-card mb-3">Personalized Experience</h3>
              <p className="body-regular text-nude-600">
                Every interaction is tailored to your preferences and past experiences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-luxury-charlotte rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="heading-card mb-3">Seamless Booking</h3>
              <p className="body-regular text-nude-600">
                Book rooms, tables, and services with just a few taps.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
