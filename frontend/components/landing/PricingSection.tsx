'use client';

import React from 'react';

/**
 * Pricing Section Component
 * 
 * Displays pricing plans and trial offer
 * Location: components/landing/PricingSection.tsx
 * Features: Pricing cards, CTA buttons, trial promotion
 */

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-luxury-soft border border-nude-200/50 ${className}`}>
    {children}
  </div>
);

interface CardHeaderProps {
  children: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children }) => (
  <div className="p-6 pb-4">
    {children}
  </div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold ${className}`}>
    {children}
  </h3>
);

interface CardContentProps {
  children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ children }) => (
  <div className="p-6 pt-0">
    {children}
  </div>
);

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-12 py-4 text-xl'
  };

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses[size]} font-semibold rounded-full transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      {children}
    </button>
  );
};

interface PricingSectionProps {
  onStartTrial: () => void;
  className?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onStartTrial, className = '' }) => {
  return (
    <section id="pricing" className={`py-24 md:py-32 bg-gradient-to-br from-nude-600 to-nude-700 text-white ${className}`}>
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
          Start with 3 Months Free
          </h2>
        <p className="max-w-3xl mx-auto text-lg text-nude-100 mb-12 leading-relaxed">
          Experience the full platform for 3 months at no cost, then choose a plan that fits your business size and needs
        </p>

        {/* PRICING PSYCHOLOGY - Anchoring & Decoy Effect */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          
          {/* DECOY OPTION - Makes middle option seem better */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-nude-400 text-nude-900 px-3 py-1 rounded-full text-xs font-medium">
                Basic
              </span>
        </div>
            <CardHeader>
              <CardTitle className="text-white text-xl">3-Month Free Trial</CardTitle>
              <div className="text-4xl font-bold text-white">Free</div>
              <div className="text-sm text-nude-200">Then choose your plan</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-nude-100">
                <li>Limited platform features</li>
                <li>AI concierge included</li>
                <li>Pay-as-you-grow option</li>
                <li>Limited property images</li>
              </ul>
            </CardContent>
          </Card>

          {/* TARGET OPTION - Most Popular (Decoy Effect) */}
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 scale-105 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-nude-900 px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
              </span>
                </div>
            <CardHeader>
              <CardTitle className="text-white text-xl">Standard Plans</CardTitle>
              <div className="text-3xl font-bold text-white">N$1,750</div>
              <div className="text-sm text-nude-200">Monthly Subscription</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-nude-100">
                <li>Complete platform access</li>
                <li>AI concierge included</li>
                <li>Staff management</li>
                <li>F&B management</li>
                <li>Business intelligence</li>
              </ul>
            </CardContent>
          </Card>

          {/* ANCHOR OPTION - High price makes others seem reasonable */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-nude-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                Premium
              </span>
                  </div>
            <CardHeader>
              <CardTitle className="text-white text-xl">Enterprise Solutions</CardTitle>
              <div className="text-3xl font-bold text-white">Custom</div>
              <div className="text-sm text-nude-200">Hotels 60+ rooms</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-nude-100">
                <li>Custom Enterprise solution</li>
                <li>Contact us for a free consultation</li>
                <li>Dedicated account manager</li>
                <li>White-label options</li>
                </ul>
            </CardContent>
          </Card>
        </div>

        {/* CHARM PRICING & SOCIAL PROOF */}
        <div className="space-y-6">
          <Button
            onClick={onStartTrial}
            size="lg"
            className="bg-white text-nude-700 hover:bg-nude-50 shadow-luxury-strong hover:shadow-luxury-medium"
          >
            Start Your 3-Month Free Trial
          </Button>
          
          <p className="text-nude-200 text-sm">
            No credit card required • Full access for 3 months • Cancel anytime
          </p>


        </div>
      </div>
    </section>
  );
};
