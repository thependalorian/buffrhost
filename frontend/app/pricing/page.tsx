"use client";

import { useState } from "react";
import {
  CheckIcon,
  XMarkIcon,
  ArrowRightIcon,
  StarIcon,
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  HomeIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="text-gray-600 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-400 transition-colors duration-300 font-medium"
  >
    {children}
  </a>
);

const CTAButton = ({ children, primary = false, className = "", onClick }) => (
  <button
    onClick={onClick}
    className={`btn btn-lg rounded-full shadow-lg transition-transform duration-300 hover:scale-105 ${
      primary
        ? "btn-primary text-white"
        : "bg-white/90 text-gray-900 backdrop-blur-md border-white/30 hover:bg-white"
    } ${className}`}
  >
    {children}
  </button>
);

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for small restaurants and cafes",
    price: "N$299",
    period: "per month",
    icon: BuildingStorefrontIcon,
    features: [
      "QR Code Menu & Ordering",
      "Basic Inventory Management",
      "Customer Database (up to 500)",
      "Basic Analytics",
      "Email Support",
      "Mobile App Access",
    ],
    limitations: [
      "Limited to 1 location",
      "Basic reporting only",
      "Standard business hours support",
    ],
    popular: false,
    cta: "Start Free Trial",
  },
  {
    name: "Professional",
    description: "Ideal for hotels and multi-location restaurants",
    price: "N$799",
    period: "per month",
    icon: BuildingOffice2Icon,
    features: [
      "Everything in Starter",
      "Multi-location Management",
      "Advanced Analytics & Reporting",
      "AI Receptionist (Basic)",
      "Loyalty Program",
      "Priority Support",
      "Custom Branding",
      "API Access",
      "Staff Management (up to 20 users)",
    ],
    limitations: ["Up to 5 locations", "Standard AI features"],
    popular: true,
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    description: "For large hospitality chains and resorts",
    price: "N$1,999",
    period: "per month",
    icon: StarIcon,
    features: [
      "Everything in Professional",
      "Unlimited Locations",
      "Advanced AI Receptionist",
      "Custom Integrations",
      "White-label Solutions",
      "Dedicated Account Manager",
      "24/7 Priority Support",
      "Advanced Security Features",
      "Custom Analytics Dashboard",
      "Multi-language Support",
      "Advanced Staff Management",
    ],
    limitations: [],
    popular: false,
    cta: "Contact Sales",
  },
];

const addOns = [
  {
    name: "AI Receptionist Pro",
    description: "Advanced AI assistant with voice capabilities",
    price: "N$199",
    period: "per month",
    features: [
      "Voice recognition",
      "Multi-language support",
      "Advanced booking management",
    ],
  },
  {
    name: "Advanced Analytics",
    description: "Deep insights and predictive analytics",
    price: "N$99",
    period: "per month",
    features: ["Predictive analytics", "Custom reports", "Data export"],
  },
  {
    name: "White-label Mobile App",
    description: "Custom branded mobile application",
    price: "N$499",
    period: "one-time setup",
    features: ["Custom branding", "App store deployment", "Push notifications"],
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const handleRequestDemo = () => {
    setShowDemoModal(true);
  };

  return (
    <div className="bg-white dark:bg-black text-gray-800 dark:text-gray-200 font-sans min-h-screen">
      {/* Navigation */}
      <header className="bg-white dark:bg-black shadow-sm">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-sand-800 to-black rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                Buffr Host
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-10">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/#features">Features</NavLink>
              <NavLink href="/#solutions">Solutions</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button className="btn btn-ghost">Sign In</button>
              <button
                className="btn btn-primary rounded-full"
                onClick={handleRequestDemo}
              >
                Request a Demo
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-sand-50 dark:bg-sand-900/20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400 mb-8">
              Choose the perfect plan for your hospitality business. All plans
              include a 14-day free trial with no credit card required.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span
                className={`text-lg ${
                  !isAnnual
                    ? "font-semibold text-gray-900 dark:text-white"
                    : "text-gray-500"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-lg ${
                  isAnnual
                    ? "font-semibold text-gray-900 dark:text-white"
                    : "text-gray-500"
                }`}
              >
                Annual
              </span>
              {isAnnual && (
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  Save 20%
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {pricingPlans.map((plan, index) => {
                const Icon = plan.icon;
                const basePrice = parseInt(plan.price.replace("N$", ""));
                const displayPrice = isAnnual
                  ? `N$${Math.round(basePrice * 0.8)}`
                  : plan.price;

                return (
                  <div
                    key={plan.name}
                    className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 ${
                      plan.popular ? "ring-2 ring-primary scale-105" : ""
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-sand-100 dark:bg-sand-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-sand-600 dark:text-sand-300" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {plan.description}
                      </p>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">
                          {displayPrice}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          /{isAnnual ? "per year" : plan.period}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="flex items-start">
                          <XMarkIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-500 dark:text-gray-400">
                            {limitation}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <CTAButton
                      primary={plan.popular}
                      className="w-full"
                      onClick={handleRequestDemo}
                    >
                      {plan.cta}
                      <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </CTAButton>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Add-ons Section */}
        <section className="py-20 bg-sand-50 dark:bg-sand-900/20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Add-ons & Extensions
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Enhance your plan with powerful add-ons
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {addOns.map((addon, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold mb-2">{addon.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {addon.description}
                  </p>
                  <div className="mb-4">
                    <span className="text-2xl font-bold">{addon.price}</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      /{addon.period}
                    </span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {addon.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckIcon className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-outline w-full">
                    Add to Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-3">
                  What&apos;s included in the free trial?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  The 14-day free trial includes full access to all features of
                  your chosen plan. No credit card required, and you can cancel
                  anytime.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-3">
                  Can I change plans later?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes! You can upgrade or downgrade your plan at any time.
                  Changes take effect immediately, and we&apos;ll prorate any
                  billing differences.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-3">
                  Do you offer custom pricing for large enterprises?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Absolutely! Contact our sales team for custom pricing,
                  dedicated support, and tailored solutions for large
                  hospitality chains.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We accept all major credit cards, bank transfers, and
                  integrate with Adumo Online for secure payment processing in
                  Namibia.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Hospitality Business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of hospitality businesses already using Buffr Host
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton primary onClick={handleRequestDemo}>
                Start Your Free Trial
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </CTAButton>
              <CTAButton onClick={() => (window.location.href = "/contact")}>
                Contact Sales
              </CTAButton>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-sand-100 dark:bg-sand-900/20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-sand-800 to-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold">Buffr Host</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                The future of hospitality management, today.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/#features"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/demo"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                  >
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/about"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/help"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/docs"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="/status"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-sand-200 dark:border-sand-800 text-center text-gray-500 dark:text-gray-400">
            <p>&copy; 2024 Buffr Host. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
