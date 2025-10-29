'use client';

import React, { useState } from 'react';
import { Navigation, Footer, BottomCTA, PageHero, PricingSection, SmartWaitlist } from '@/components/landing';

/**
 * Pricing Page
 * 
 * Dedicated pricing page with detailed plans and features
 * Location: app/pricing/page.tsx
 * Features: Pricing plans, feature comparison, trial offer
 */

export default function PricingPage() {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  return (
    <div className="bg-nude-50 text-nude-900 font-primary min-h-screen flex flex-col">
      <Navigation onStartTrial={() => setShowWaitlistModal(true)} />
      <main className="flex-grow">
        <PageHero
          title="Simple, Transparent Pricing"
          subtitle="Choose Your Plan"
          description="Start with our 3-month free trial. No credit card required. Full platform access from day one."
        />

        <div className="container mx-auto px-6 py-16">
          <PricingSection onStartTrial={() => setShowWaitlistModal(true)} />
        </div>

        <BottomCTA onJoinWaitlist={() => setShowWaitlistModal(true)} />
      </main>
      <Footer />
      
      <SmartWaitlist
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </div>
  );
}
