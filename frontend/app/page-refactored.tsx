'use client';

import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  CheckCircle,
  Sparkles,
  Home,
  Building2,
  Bed,
  Users2,
  Star,
  Utensils,
  Car,
  Dumbbell,
  Wine,
  Settings,
  Cpu,
  DollarSign,
  Globe,
  Clock,
  Zap,
  BarChart3,
  Smartphone,
  ArrowRight
} from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle, SmartWaitlist } from "@/components/ui";

const NavLink = ({ href, children, onClick = () => {}, className = "" }) => (
  <a
    href={href}
    onClick={onClick}
    className={`text-nude-700 hover:text-nude-600 transition-colors duration-300 font-medium ${className}`}
  >
    {children}
  </a>
);

const FeatureCard = ({ title, description, features, icon: Icon, color }) => {
  const colorMap = {
    "nude-600": "bg-nude-600",
    "nude-500": "bg-nude-500",
    "nude-700": "bg-nude-700",
  };

  return (
    <Card className="group hover:shadow-luxury-medium transition-all duration-300 hover:-translate-y-1 h-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${colorMap[color] || "bg-nude-600"} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl text-nude-900">{title}</CardTitle>
            <p className="text-nude-800 text-sm">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-semantic-success flex-shrink-0" />
              <span className="text-sm text-nude-700">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const HotelTypeCard = ({ title, description, icon: Icon, services }) => (
  <Card className="text-center p-6 hover:shadow-luxury-medium transition-all duration-300 hover:-translate-y-1 h-full">
    <div className="w-16 h-16 bg-nude-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <Icon className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-nude-900 mb-2">{title}</h3>
    <p className="text-nude-600 text-sm mb-4">{description}</p>
    <div className="bg-nude-50 rounded-lg p-3">
      <p className="text-xs text-nude-700 font-medium mb-2">Common Services:</p>
      <div className="flex flex-wrap gap-1 justify-center">
        {services.map((service, index) => (
          <span key={index} className="text-xs bg-white px-2 py-1 rounded-full text-nude-600 border border-nude-200">
            {service}
          </span>
        ))}
      </div>
    </div>
  </Card>
);

const HotelServiceCard = ({ title, description, icon: Icon, category }) => (
  <Card className="p-6 hover:shadow-luxury-medium transition-all duration-300 hover:-translate-y-1">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-nude-500 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-nude-100 text-nude-700 px-2 py-1 rounded-full">{category}</span>
        </div>
        <h3 className="text-lg font-semibold text-nude-900 mb-2">{title}</h3>
        <p className="text-nude-600 text-sm">{description}</p>
      </div>
    </div>
  </Card>
);

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hotel as umbrella term - all accommodation types
  const hotelTypes = [
    {
      title: "Boutique Hotels",
      description: "Luxury properties with personalized service",
      icon: Sparkles,
      services: ["Spa", "Fine Dining", "Concierge", "Luxury Rooms"]
    },
    {
      title: "Vacation Rentals",
      description: "Airbnb, holiday homes, and short-term rentals", 
      icon: Home,
      services: ["Self Check-in", "Cleaning", "Guest Communication", "Pricing"]
    },
    {
      title: "Resorts & Lodges",
      description: "Large properties with multiple amenities",
      icon: Building2,
      services: ["Multiple Restaurants", "Activities", "Spa", "Tours"]
    },
    {
      title: "Guest Houses",
      description: "Smaller properties with intimate service",
      icon: Bed,
      services: ["Breakfast", "Housekeeping", "Local Tours", "Personal Service"]
    },
    {
      title: "Hotel Chains",
      description: "Multi-location hotel groups",
      icon: Users2,
      services: ["Central Management", "Brand Standards", "Reporting", "Multi-property"]
    },
    {
      title: "Specialty Accommodation", 
      description: "Camping, glamping, and unique stays",
      icon: Star,
      services: ["Activity Booking", "Equipment Rental", "Experience Packages", "Unique Services"]
    }
  ];

  const hotelServices = [
    {
      title: "Room Management",
      description: "Check-in/out, housekeeping, maintenance, and room service",
      icon: Bed,
      category: "Accommodation"
    },
    {
      title: "F&B Operations", 
      description: "Restaurants, bars, room service, and banquet management",
      icon: Utensils,
      category: "Food & Beverage"
    },
    {
      title: "Spa & Wellness",
      description: "Treatment bookings, therapist scheduling, and product sales",
      icon: Sparkles,
      category: "Wellness"
    },
    {
      title: "Activity Center",
      description: "Tours, excursions, equipment rental, and experience booking",
      icon: Car,
      category: "Experiences"
    },
    {
      title: "Conference Facilities",
      description: "Meeting rooms, event spaces, catering, and AV equipment",
      icon: Users2,
      category: "Business"
    },
    {
      title: "Fitness Center",
      description: "Gym access, personal training, and class scheduling",
      icon: Dumbbell,
      category: "Wellness"
    },
    {
      title: "Transport Services",
      description: "Airport shuttle, car rental, and local transportation",
      icon: Car,
      category: "Transport"
    },
    {
      title: "Retail & Gift Shop",
      description: "Souvenirs, essentials, and local products",
      icon: Wine,
      category: "Retail"
    }
  ];

  const coreFeatures = [
    {
      title: "Unified Hotel Management",
      description: "One platform for all your accommodation and services",
      features: [
        "Manage all room types and rates",
        "Coordinate housekeeping and maintenance",
        "Handle guest services and requests",
        "Track all revenue streams"
      ],
      icon: Building2,
      color: "nude-600"
    },
    {
      title: "Complete F&B System",
      description: "Full restaurant and bar management included",
      features: [
        "Menu management and pricing",
        "Table reservations and waitlist",
        "Kitchen display system",
        "Inventory and ordering"
      ],
      icon: Utensils,
      color: "nude-500"
    },
    {
      title: "Service Integration",
      description: "Manage all hotel services in one place",
      features: [
        "Spa and treatment bookings",
        "Activity and tour management",
        "Conference and event spaces",
        "Transport and shuttle services"
      ],
      icon: Settings,
      color: "nude-700"
    },
    {
      title: "AI Concierge",
      description: "24/7 virtual assistant for your guests",
      features: [
        "Answer guest questions anytime",
        "Handle bookings and reservations",
        "Provide local recommendations",
        "Multi-language support"
      ],
      icon: Cpu,
      color: "nude-600"
    },
    {
      title: "Smart Revenue Management",
      description: "Optimize pricing across all services",
      features: [
        "Dynamic room pricing",
        "Restaurant table optimization",
        "Service package bundling",
        "Occupancy forecasting"
      ],
      icon: DollarSign,
      color: "nude-500"
    },
    {
      title: "Multi-Property Control", 
      description: "Manage multiple locations effortlessly",
      features: [
        "Centralized reporting",
        "Cross-property guest history",
        "Unified branding",
        "Shared inventory and staff"
      ],
      icon: Globe,
      color: "nude-700"
    }
  ];

  const restaurantFeatures = [
    {
      title: "Standalone Restaurants",
      description: "Complete F&B system for restaurants without accommodation",
      icon: Utensils,
      features: ["Menu Management", "Table Booking", "Kitchen Display", "Inventory Control"]
    },
    {
      title: "Bars & Lounges",
      description: "Specialized for beverage-focused establishments", 
      icon: Wine,
      features: ["Bar Management", "Bottle Service", "Inventory Tracking", "Staff Scheduling"]
    },
    {
      title: "Catering Services",
      description: "For off-site events and catering businesses",
      icon: Users2,
      features: ["Event Management", "Mobile Ordering", "Delivery Tracking", "Client Billing"]
    },
    {
      title: "Food Trucks",
      description: "Mobile food service management",
      icon: Car,
      features: ["Location Management", "Mobile POS", "Inventory Tracking", "Route Optimization"]
    }
  ];

  return (
    <div className="bg-nude-50 text-nude-900 font-primary min-h-screen">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-lg shadow-luxury-soft"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-nude-600 to-nude-700 rounded-xl flex items-center justify-center shadow-luxury-soft">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-2xl font-display font-bold text-nude-900">
                Buffr Host
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-10">
              <NavLink href="#hotels">Hotels</NavLink>
              <NavLink href="#restaurants">Restaurants</NavLink>
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button
                onClick={() => setShowWaitlistModal(true)}
                className="bg-nude-600 hover:bg-nude-700 text-white px-6 py-2 rounded-full shadow-luxury-soft hover:shadow-luxury-medium transition-all duration-300"
              >
                Start Free Trial
              </Button>
            </div>
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-nude-700 hover:text-nude-600"
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden mt-4 bg-white rounded-2xl shadow-luxury-soft p-6 border border-nude-100">
              <NavLink href="#hotels" onClick={() => setIsMenuOpen(false)} className="block py-3 text-lg">
                Hotels
              </NavLink>
              <NavLink href="#restaurants" onClick={() => setIsMenuOpen(false)} className="block py-3 text-lg">
                Restaurants
              </NavLink>
              <NavLink href="#features" onClick={() => setIsMenuOpen(false)} className="block py-3 text-lg">
                Features
              </NavLink>
              <NavLink href="#pricing" onClick={() => setIsMenuOpen(false)} className="block py-3 text-lg">
                Pricing
              </NavLink>
              <div className="pt-4 mt-4 border-t border-nude-200">
                <Button
                  onClick={() => {
                    setShowWaitlistModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-nude-600 hover:bg-nude-700 text-white rounded-full"
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main>
        {/* Hero Section - Clean & Elegant */}
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-nude-50 via-white to-luxury-champagne pt-20">
          <div className="absolute inset-0 bg-gradient-to-br from-nude-50/80 to-nude-100/80"></div>
          <div className="relative z-10 text-center px-6 space-y-12 max-w-7xl mx-auto">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-nude-900">
                The Future of Hospitality, Today.
              </h1>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-nude-700 leading-relaxed">
                One platform for every hospitality business - from hotels to standalone restaurants
              </p>
            </div>

            <div className="space-y-8">
              <div className="pt-8">
                <Button
                  onClick={() => setShowWaitlistModal(true)}
                  size="lg"
                  className="bg-nude-600 hover:bg-nude-700 text-white px-12 py-4 text-xl font-semibold rounded-full shadow-luxury-soft hover:shadow-luxury-medium transition-all duration-300 hover:-translate-y-1"
                >
                  Start 3-Month Free Trial
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
                <p className="text-nude-500 text-sm mt-4">
                  No credit card required • Personalized for your business
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Hotel Types Section */}
        <section id="hotels" className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-nude-900">
                Every Accommodation Type, One Platform
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-nude-700 leading-relaxed">
                Configure your specific services during setup.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotelTypes.map((hotel, index) => (
                <HotelTypeCard key={index} {...hotel} />
              ))}
            </div>
          </div>
        </section>

        {/* Hotel Services Section */}
        <section className="py-24 md:py-32 bg-nude-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-nude-900">
                Manage Every Hotel Service
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-nude-700 leading-relaxed">
                Everything your hotel offers, managed in one place
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotelServices.map((service, index) => (
                <HotelServiceCard key={index} {...service} />
              ))}
            </div>
          </div>
        </section>

        {/* Restaurant Section */}
        <section id="restaurants" className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-nude-900">
                Complete F&B Management
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-nude-700 leading-relaxed">
                For hotels with restaurants AND standalone F&B businesses
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {restaurantFeatures.map((feature, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-luxury-medium transition-all duration-300 hover:-translate-y-1">
                  <div className="w-16 h-16 bg-nude-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-nude-900 mb-2">{feature.title}</h3>
                  <p className="text-nude-600 text-sm mb-4">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-center gap-2 text-sm text-nude-700">
                        <CheckCircle className="w-4 h-4 text-semantic-success" />
                        {item}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section id="features" className="py-24 md:py-32 bg-nude-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-nude-900">
                One Platform, Every Hospitality Need
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-nude-700 leading-relaxed">
                Everything you need to run your hospitality business efficiently and profitably
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreFeatures.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 md:py-32 bg-gradient-to-br from-nude-600 to-nude-700 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Simple Pricing for Every Business
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-nude-100 mb-12 leading-relaxed">
              Start free for 3 months, then choose a plan that fits your business size and needs
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-xl">3-Month Trial</CardTitle>
                  <div className="text-3xl font-bold text-white">Free</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-nude-100">
                    <li>All features included</li>
                    <li>Personalized setup</li>
                    <li>Training and support</li>
                    <li>No credit card needed</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/20 backdrop-blur-sm border-white/30 scale-105">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Monthly</CardTitle>
                  <div className="text-3xl font-bold text-white">Custom Pricing</div>
                  <div className="text-sm text-nude-200">Based on business size</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-nude-100">
                    <li>Everything in trial</li>
                    <li>Priority support</li>
                    <li>Advanced features</li>
                    <li>Custom integrations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Annual</CardTitle>
                  <div className="text-3xl font-bold text-white">Save up to 20%</div>
                  <div className="text-sm text-nude-200">Best value</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-nude-100">
                    <li>All monthly features</li>
                    <li>Dedicated account manager</li>
                    <li>Custom training</li>
                    <li>White-label options</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={() => setShowWaitlistModal(true)}
              size="lg"
              className="bg-white text-nude-700 hover:bg-nude-50 px-12 py-4 text-xl font-semibold rounded-full shadow-luxury-strong hover:shadow-luxury-medium transition-all duration-300 hover:-translate-y-1"
            >
              Start Your Free Trial Today
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            <p className="text-nude-200 text-sm mt-4">
              No credit card required • Cancel anytime
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-nude-900 text-nude-100 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-nude-600 to-nude-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="text-xl font-display font-bold">Buffr Host</span>
              </div>
              <p className="text-nude-300 text-sm">
                One platform for every hospitality business
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Hotels</h4>
              <ul className="space-y-2 text-sm text-nude-300">
                <li><a href="#" className="hover:text-white transition-colors">Boutique Hotels</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Vacation Rentals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resorts</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guest Houses</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Restaurants</h4>
              <ul className="space-y-2 text-sm text-nude-300">
                <li><a href="#" className="hover:text-white transition-colors">Standalone Restaurants</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bars & Lounges</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Catering</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Food Trucks</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-nude-300">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-nude-800 mt-8 pt-8 text-center">
            <p className="text-nude-300 text-sm">
              © 2024 Buffr Host. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Smart Waitlist Modal */}
      <SmartWaitlist
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </div>
  );
}