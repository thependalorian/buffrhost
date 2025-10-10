"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  QrCode,
  ArrowRight,
  Menu,
  X,
  CheckCircle,
  Building2,
  Store,
  Home,
  DollarSign,
  Clock,
  Cpu,
  Zap,
  TrendingUp,
  Shield,
  Users,
  BarChart3,
  Star,
  Heart,
  Utensils,
  Users2,
  Calendar,
  Smartphone,
  ChefHat,
  Receipt,
  Target,
  Award,
  Globe,
  Settings
} from "lucide-react";

import SmartWaitlist from "@/src/components/landing/SmartWaitlist";
import PersonaAwareSection from "@/src/components/landing/PersonaAwareSection";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui";

// --- Multi-Persona Hero Components ---

const PersonaHero = ({ persona, isActive, onClick }) => {
  const personaConfig = {
    hotel: {
      title: "Your Entire Hotel, Finally in One Place",
      subtitle: "Unified operations dashboard for hotel general managers",
      icon: Building2,
      color: "nude-600",
      pain: "Overbookings, staff chaos, revenue leakage",
      solution: "Complete hotel management platform"
    },
    restaurant: {
      title: "Every Table, Every Order, Every Dollar",
      subtitle: "Streamlined F&B operations for restaurant owners",
      icon: Utensils,
      color: "nude-500",
      pain: "Table turnover, kitchen inefficiency, wasted inventory",
      solution: "End-to-end restaurant management"
    },
    "multi-venue": {
      title: "All Your Properties, One Command Center",
      subtitle: "Centralized management for multi-venue operators",
      icon: Users2,
      color: "nude-700",
      pain: "Siloed data, inconsistent guest experience",
      solution: "Unified multi-property platform"
    },
    boutique: {
      title: "Luxury Service, Streamlined Operations",
      subtitle: "Premium experience management for boutique properties",
      icon: Star,
      color: "luxury-champagne",
      pain: "Competing with chains, manual processes",
      solution: "Luxury hospitality management suite"
    }
  };

  const config = personaConfig[persona];
  const IconComponent = config.icon;

  return (
    <div 
      className={`text-center space-y-6 cursor-pointer transition-all duration-500 ${
        isActive ? "opacity-100 scale-100" : "opacity-60 scale-95"
      }`}
      onClick={onClick}
    >
      <div className={`w-20 h-20 bg-${config.color} rounded-2xl flex items-center justify-center mx-auto shadow-luxury-soft hover:shadow-luxury-medium transition-all duration-300`}>
        <IconComponent className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-2xl md:text-3xl font-display font-bold text-nude-900">
        {config.title}
      </h2>
      <p className="text-lg text-nude-600 max-w-md mx-auto">
        {config.subtitle}
      </p>
      <div className="bg-nude-50 rounded-xl p-4 max-w-sm mx-auto">
        <p className="text-sm text-nude-700 font-medium mb-1">Challenge:</p>
        <p className="text-sm text-nude-600">{config.pain}</p>
      </div>
    </div>
  );
};

const NavLink = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="text-nude-700 hover:text-nude-600 transition-colors duration-300 font-medium"
  >
    {children}
  </a>
);

const FeatureShowcase = ({ title, description, features, icon: Icon, color }) => (
  <Card className="group hover:shadow-luxury-medium transition-all duration-300 hover:-translate-y-1">
    <CardHeader>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <CardTitle className="text-xl text-nude-900">{title}</CardTitle>
          <p className="text-nude-600">{description}</p>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-semantic-success" />
            <span className="text-sm text-nude-700">{feature}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [activePersona, setActivePersona] = useState("hotel");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const personas = ["hotel", "restaurant", "multi-venue", "boutique"];

  return (
    <div className="bg-nude-50 text-nude-900 font-primary min-h-screen">
      {/* --- Multi-Persona Navigation --- */}
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
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-2xl font-display font-bold text-nude-900">
                Buffr Host
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-10">
              <NavLink href="#solutions">Solutions</NavLink>
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
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-nude-700 hover:text-nude-600"
              >
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden mt-4 bg-white rounded-2xl shadow-luxury-soft p-6 border border-nude-100">
              <NavLink href="#solutions" onClick={() => setIsMenuOpen(false)} className="block py-3 text-lg">
                Solutions
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
        {/* --- SECTION 1: MULTI-PERSONA HERO --- */}
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-nude-50 via-nude-100 to-luxury-champagne pt-20">
          <div className="absolute inset-0 bg-gradient-to-br from-nude-50/80 to-nude-100/80"></div>
          <div className="relative z-10 text-center px-6 space-y-12 max-w-7xl mx-auto">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-nude-900">
                The Future of Hospitality, Today.
              </h1>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-nude-700 leading-relaxed">
                Unified platform for hospitality excellence - from boutique properties to multi-venue complexes
              </p>
            </div>

            {/* Persona Selector */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {personas.map((persona) => (
                  <PersonaHero
                    key={persona}
                    persona={persona}
                    isActive={activePersona === persona}
                    onClick={() => setActivePersona(persona)}
                  />
                ))}
              </div>

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
                  No credit card required • Personalized setup included
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: PERSONA-AWARE SOLUTIONS --- */}
        <PersonaAwareSection />

        {/* --- SECTION 3: PLATFORM CAPABILITIES --- */}
        <section id="features" className="py-24 md:py-32 bg-nude-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-nude-900">
                Complete Hospitality Platform
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-nude-700 leading-relaxed">
                Everything you need to manage your hospitality business, all in one place
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureShowcase
                title="Property Management"
                description="Complete hotel and property management system"
                features={[
                  "Room booking & availability",
                  "Guest check-in/check-out",
                  "Housekeeping coordination",
                  "Revenue management"
                ]}
                icon={Building2}
                color="nude-600"
              />
              <FeatureShowcase
                title="F&B Operations"
                description="Restaurant and food service management"
                features={[
                  "Table management",
                  "Order processing",
                  "Kitchen display system",
                  "Inventory control"
                ]}
                icon={Utensils}
                color="nude-500"
              />
              <FeatureShowcase
                title="Guest Services"
                description="Enhanced guest experience management"
                features={[
                  "Guest profiles & preferences",
                  "Concierge services",
                  "Loyalty programs",
                  "Communication hub"
                ]}
                icon={Users}
                color="nude-400"
              />
              <FeatureShowcase
                title="Spa & Wellness"
                description="Spa and wellness service management"
                features={[
                  "Appointment booking",
                  "Treatment management",
                  "Wellness tracking",
                  "Staff scheduling"
                ]}
                icon={Heart}
                color="nude-300"
              />
              <FeatureShowcase
                title="Analytics & Reporting"
                description="Comprehensive business intelligence"
                features={[
                  "Revenue analytics",
                  "Performance metrics",
                  "Predictive forecasting",
                  "Custom reports"
                ]}
                icon={BarChart3}
                color="nude-700"
              />
              <FeatureShowcase
                title="Staff Management"
                description="Human resources and workforce management"
                features={[
                  "Staff scheduling",
                  "Performance tracking",
                  "Payroll management",
                  "Training programs"
                ]}
                icon={Users2}
                color="nude-800"
              />
            </div>
          </div>
        </section>

        {/* --- SECTION 4: INTEGRATION ECOSYSTEM --- */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-nude-900">
                Seamless Integrations
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-nude-700 leading-relaxed">
                Connect with your existing tools and payment processors
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-8">
                <div className="w-16 h-16 bg-nude-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-nude-900 mb-4">Payment Processors</h3>
                <p className="text-nude-600 mb-6">
                  Integrate with Stripe, PayPal, and local payment gateways
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-nude-700">
                    <CheckCircle className="w-4 h-4 text-semantic-success" />
                    Instant settlements
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-nude-700">
                    <CheckCircle className="w-4 h-4 text-semantic-success" />
                    Multi-currency support
                  </div>
                </div>
              </Card>

              <Card className="text-center p-8">
                <div className="w-16 h-16 bg-nude-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-nude-900 mb-4">Channel Managers</h3>
                <p className="text-nude-600 mb-6">
                  Connect with Booking.com, Expedia, and other OTA platforms
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-nude-700">
                    <CheckCircle className="w-4 h-4 text-semantic-success" />
                    Real-time sync
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-nude-700">
                    <CheckCircle className="w-4 h-4 text-semantic-success" />
                    Rate management
                  </div>
                </div>
              </Card>

              <Card className="text-center p-8">
                <div className="w-16 h-16 bg-nude-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-nude-900 mb-4">Business Tools</h3>
                <p className="text-nude-600 mb-6">
                  Integrate with accounting, CRM, and marketing tools
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-nude-700">
                    <CheckCircle className="w-4 h-4 text-semantic-success" />
                    API access
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-nude-700">
                    <CheckCircle className="w-4 h-4 text-semantic-success" />
                    Custom integrations
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* --- SECTION 5: PRICING & TRIAL --- */}
        <section id="pricing" className="py-24 md:py-32 bg-gradient-to-br from-nude-600 to-nude-700 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Flexible Pricing for Every Business
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-nude-100 mb-12 leading-relaxed">
              Choose the plan that fits your business size and needs. All plans include our 3-month free trial.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-xl">3-Month Trial</CardTitle>
                  <div className="text-3xl font-bold text-white">Free</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-nude-100">
                    <li>Full platform access</li>
                    <li>Personalized setup</li>
                    <li>Email support</li>
                    <li>Basic analytics</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/20 backdrop-blur-sm border-white/30 scale-105">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Monthly</CardTitle>
                  <div className="text-3xl font-bold text-white">N$ 2,500<span className="text-lg">/mo</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-nude-100">
                    <li>Everything in trial</li>
                    <li>Advanced analytics</li>
                    <li>Priority support</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Annual</CardTitle>
                  <div className="text-3xl font-bold text-white">N$ 25,000<span className="text-lg">/yr</span></div>
                  <div className="text-sm text-nude-200">Save 17%</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-nude-100">
                    <li>Everything in monthly</li>
                    <li>Dedicated account manager</li>
                    <li>Custom training</li>
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

      {/* --- Footer --- */}
      <footer className="bg-nude-900 text-nude-100 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-nude-600 to-nude-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-xl font-display font-bold">Buffr Host</span>
              </div>
              <p className="text-nude-300 text-sm">
                The future of hospitality management, today.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-nude-300">
                <li><a href="#" className="hover:text-white transition-colors">Hotels</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Restaurants</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Multi-Venue</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Boutique Properties</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-nude-300">
                <li><a href="#" className="hover:text-white transition-colors">Property Management</a></li>
                <li><a href="#" className="hover:text-white transition-colors">F&B Operations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
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

      {/* --- Smart Waitlist Modal --- */}
      <SmartWaitlist
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </div>
  );
}