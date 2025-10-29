'use client';

import React, { useState } from 'react';
import {
  Navigation,
  HeroSection,
  AIConciergeShowcase,
  HotelTypes,
  RestaurantTypes,
  PlatformOverview,
  PricingSection,
  Footer,
  SmartWaitlist,
  BottomCTA
} from '@/components/landing';

/**
 * Main Landing Page
 * 
 * Refactored from page.tsx.backup into modular components
 * Location: app/page.tsx
 * Features: Complete hospitality platform landing page
 */

export default function HomePage() {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  const handleViewDemo = () => {
    // For now, just open the waitlist modal
    // In the future, this could open a demo video or interactive demo
    setShowWaitlistModal(true);
  };

  return (
    <div className="bg-nude-50 text-nude-900 font-primary min-h-screen">
      <Navigation onStartTrial={() => setShowWaitlistModal(true)} />
      
        <main>
          <HeroSection 
            onStartTrial={() => setShowWaitlistModal(true)} 
            onViewDemo={handleViewDemo}
          />
          <AIConciergeShowcase />
          <HotelTypes />
          <RestaurantTypes />
          <PlatformOverview />
          <PricingSection onStartTrial={() => setShowWaitlistModal(true)} />
        </main>

      <BottomCTA onJoinWaitlist={() => setShowWaitlistModal(true)} />
      <Footer />
      
      <SmartWaitlist
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </div>
  );
}