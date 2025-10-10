"use client";

import React, { useState, useEffect } from "react";
import DashboardPreview from "./DashboardPreview";
import OperationsFlow from "./OperationsFlow";
import PropertyGrid from "./PropertyGrid";

interface PersonaAwareSectionProps {
  className?: string;
}

const personas = {
  hotel: {
    name: "Hotel General Manager",
    pain: "Overbookings, staff scheduling chaos, revenue leakage",
    hook: "Your Entire Hotel, Finally in One Place",
    features: [
      "Room Management & Availability",
      "Guest Check-in/Check-out",
      "Housekeeping Coordination", 
      "Revenue Analytics & Forecasting",
      "Staff Scheduling & Management",
      "Guest Communication Hub"
    ],
    color: "nude-600"
  },
  restaurant: {
    name: "Restaurant Owner",
    pain: "Table turnover, kitchen inefficiency, wasted inventory",
    hook: "Every Table, Every Order, Every Dollar",
    features: [
      "Table Management & Reservations",
      "Order Processing & Kitchen Display",
      "Inventory Management",
      "Staff Performance Tracking",
      "Customer Analytics",
      "Payment Processing"
    ],
    color: "nude-500"
  },
  "multi-venue": {
    name: "Multi-Venue Operator",
    pain: "Siloed data, inconsistent guest experience",
    hook: "All Your Properties, One Command Center",
    features: [
      "Cross-Property Management",
      "Unified Guest Profiles",
      "Centralized Analytics",
      "Resource Sharing",
      "Staff Coordination",
      "Revenue Consolidation"
    ],
    color: "nude-700"
  },
  boutique: {
    name: "Boutique Property Owner",
    pain: "Competing with chains, manual processes",
    hook: "Luxury Service, Streamlined Operations",
    features: [
      "Luxury Guest Experience",
      "Personalized Service Management",
      "Spa & Wellness Integration",
      "Premium Billing & Packages",
      "VIP Guest Tracking",
      "Exclusive Service Delivery"
    ],
    color: "luxury-champagne"
  }
};

export default function PersonaAwareSection({ className = "" }: PersonaAwareSectionProps) {
  const [activePersona, setActivePersona] = useState<keyof typeof personas>("hotel");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("persona-section");
      if (section) {
        const rect = section.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        setIsVisible(isInView);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate personas when section is visible
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActivePersona((prev) => {
        const personaKeys = Object.keys(personas) as Array<keyof typeof personas>;
        const currentIndex = personaKeys.indexOf(prev);
        const nextIndex = (currentIndex + 1) % personaKeys.length;
        return personaKeys[nextIndex];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const currentPersona = personas[activePersona];

  return (
    <section id="persona-section" className={`py-24 md:py-32 bg-white ${className}`}>
      <div className="container mx-auto px-6">
        {/* Persona Selector */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-nude-900">
            Built for Every Hospitality Professional
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-nude-700 leading-relaxed mb-8">
            Discover how Buffr Host transforms operations for different types of hospitality businesses
          </p>
          
          {/* Persona Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(personas).map(([key, persona]) => (
              <button
                key={key}
                onClick={() => setActivePersona(key as keyof typeof personas)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activePersona === key
                    ? `bg-${persona.color} text-white shadow-luxury-soft`
                    : "bg-nude-100 text-nude-700 hover:bg-nude-200"
                }`}
              >
                {persona.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Persona Content */}
        <div className="space-y-16">
          {/* Problem Statement */}
          <div className="text-center">
            <h3 className="text-2xl font-display font-bold text-nude-900 mb-4">
              {currentPersona.hook}
            </h3>
            <p className="text-lg text-nude-600 max-w-2xl mx-auto">
              {currentPersona.pain}
            </p>
          </div>

          {/* Dashboard Preview */}
          <DashboardPreview
            type={activePersona}
            features={currentPersona.features}
            className="animate-fade-in"
          />

          {/* Operations Flow */}
          <OperationsFlow
            type={activePersona}
            steps={currentPersona.features}
            className="animate-fade-in"
          />

          {/* Multi-Venue Special Case */}
          {activePersona === "multi-venue" && (
            <PropertyGrid
              venues={["Hotel", "Restaurant", "Spa", "Conference"]}
              metrics={["Occupancy", "Covers", "Bookings", "Revenue"]}
              className="animate-fade-in"
            />
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-nude-50 to-luxury-champagne/20 rounded-2xl p-8">
            <h3 className="text-2xl font-display font-bold text-nude-900 mb-4">
              Ready to Transform Your {currentPersona.name === "Multi-Venue Operator" ? "Properties" : "Operations"}?
            </h3>
            <p className="text-lg text-nude-600 mb-6 max-w-2xl mx-auto">
              Join thousands of hospitality professionals who have revolutionized their business with Buffr Host
            </p>
            <button className="bg-nude-600 hover:bg-nude-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-luxury-soft hover:shadow-luxury-medium transition-all duration-300 hover:-translate-y-1">
              Start Your 3-Month Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}