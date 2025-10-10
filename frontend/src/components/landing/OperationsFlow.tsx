"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";
import { 
  ArrowRight, 
  Users, 
  Utensils, 
  Clock, 
  CreditCard, 
  CheckCircle,
  Smartphone,
  QrCode,
  ChefHat,
  Receipt
} from "lucide-react";

interface OperationsFlowProps {
  type: "hotel" | "restaurant" | "multi-venue" | "boutique";
  steps: string[];
  className?: string;
}

const flowConfig = {
  hotel: {
    title: "Hotel Guest Journey",
    color: "nude-600",
    steps: [
      {
        icon: Smartphone,
        title: "Digital Check-in",
        description: "Guests check in via mobile app or QR code",
        details: ["Mobile check-in", "Digital key delivery", "Room preferences"]
      },
      {
        icon: Users,
        title: "Guest Services",
        description: "Seamless service requests and concierge",
        details: ["Service requests", "Concierge booking", "Guest preferences"]
      },
      {
        icon: Clock,
        title: "Housekeeping",
        description: "Automated room status and cleaning schedules",
        details: ["Room status tracking", "Cleaning schedules", "Maintenance alerts"]
      },
      {
        icon: CreditCard,
        title: "Checkout & Payment",
        description: "Express checkout with instant payment processing",
        details: ["Express checkout", "Payment processing", "Receipt delivery"]
      }
    ]
  },
  restaurant: {
    title: "Restaurant Service Flow",
    color: "nude-500",
    steps: [
      {
        icon: QrCode,
        title: "QR Menu & Ordering",
        description: "Guests scan QR code to view menu and place orders",
        details: ["QR code scanning", "Digital menu", "Order customization"]
      },
      {
        icon: ChefHat,
        title: "Kitchen Display",
        description: "Orders flow directly to kitchen display system",
        details: ["Order management", "Kitchen display", "Preparation tracking"]
      },
      {
        icon: Utensils,
        title: "Service Delivery",
        description: "Staff delivers orders and manages table service",
        details: ["Order delivery", "Table service", "Guest assistance"]
      },
      {
        icon: Receipt,
        title: "Payment & Feedback",
        description: "Instant payment processing and guest feedback",
        details: ["Payment processing", "Bill splitting", "Feedback collection"]
      }
    ]
  },
  "multi-venue": {
    title: "Multi-Venue Operations",
    color: "nude-700",
    steps: [
      {
        icon: Smartphone,
        title: "Unified Booking",
        description: "Single platform for all venue bookings",
        details: ["Cross-venue booking", "Unified calendar", "Resource sharing"]
      },
      {
        icon: Users,
        title: "Guest Management",
        description: "Centralized guest profiles across all venues",
        details: ["Unified profiles", "Preference tracking", "Loyalty programs"]
      },
      {
        icon: Clock,
        title: "Staff Coordination",
        description: "Coordinated staffing across all properties",
        details: ["Staff scheduling", "Cross-training", "Performance tracking"]
      },
      {
        icon: CreditCard,
        title: "Revenue Consolidation",
        description: "Unified revenue tracking and reporting",
        details: ["Revenue tracking", "Financial reporting", "Profit analysis"]
      }
    ]
  },
  boutique: {
    title: "Boutique Experience Flow",
    color: "luxury-champagne",
    steps: [
      {
        icon: Smartphone,
        title: "Personalized Welcome",
        description: "Customized guest experience from arrival",
        details: ["Personalized welcome", "Custom itineraries", "VIP treatment"]
      },
      {
        icon: Users,
        title: "Concierge Services",
        description: "Dedicated concierge for premium service",
        details: ["Personal concierge", "Custom experiences", "Luxury amenities"]
      },
      {
        icon: Clock,
        title: "Spa & Wellness",
        description: "Integrated wellness and spa services",
        details: ["Spa bookings", "Wellness tracking", "Treatment history"]
      },
      {
        icon: CreditCard,
        title: "Premium Billing",
        description: "Luxury billing with premium service options",
        details: ["Premium billing", "Service packages", "Exclusive offers"]
      }
    ]
  }
};

export default function OperationsFlow({ type, steps, className = "" }: OperationsFlowProps) {
  const config = flowConfig[type];

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="text-center">
        <h3 className="text-2xl font-display font-bold text-nude-900 mb-2">
          {config.title}
        </h3>
        <p className="text-nude-600">
          See how Buffr Host streamlines your {type} operations
        </p>
      </div>

      <div className="relative">
        {/* Flow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="group hover:shadow-luxury-medium transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-${config.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-nude-900 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm text-nude-600 mb-4">
                    {step.description}
                  </p>
                  <div className="space-y-1">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center gap-2 text-xs text-nude-500">
                        <CheckCircle className="w-3 h-3 text-semantic-success" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Arrow between steps */}
              {index < config.steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className={`w-6 h-6 bg-${config.color} rounded-full flex items-center justify-center`}>
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile flow line */}
        <div className="lg:hidden absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-nude-300 to-nude-200 transform -translate-x-1/2"></div>
      </div>

      {/* Benefits Summary */}
      <div className="bg-gradient-to-r from-nude-50 to-luxury-champagne/20 rounded-2xl p-6">
        <h4 className="font-semibold text-nude-900 mb-4 text-center">
          Why {type === "multi-venue" ? "Multi-Venue" : type.charAt(0).toUpperCase() + type.slice(1)} Operators Choose Buffr Host:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-nude-900 mb-1">40%</div>
            <div className="text-sm text-nude-600">Faster Operations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-nude-900 mb-1">25%</div>
            <div className="text-sm text-nude-600">Revenue Increase</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-nude-900 mb-1">4.8/5</div>
            <div className="text-sm text-nude-600">Guest Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
}