'use client';

import React from 'react';
import { BuffrButton } from '@/components/ui/buttons/BuffrButton';

/**
 * Bottom CTA Component
 * 
 * Reusable call-to-action section for bottom of pages
 * Location: components/landing/BottomCTA.tsx
 * Features: Consistent messaging, waitlist signup, reusable across pages
 */

interface BottomCTAProps {
  className?: string;
  onJoinWaitlist?: () => void;
}

export const BottomCTA: React.FC<BottomCTAProps> = ({ className = '', onJoinWaitlist }) => {
  return (
    <section className={`bg-gradient-to-r from-nude-600 to-nude-700 text-white py-16 ${className}`}>
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Be among the first to experience the future of hospitality management. 
          Join our waitlist for early access and exclusive launch benefits.
        </p>
        <BuffrButton
          onClick={onJoinWaitlist}
          variant="primary"
          size="lg"
        >
          Join the Waitlist
        </BuffrButton>
      </div>
    </section>
  );
};