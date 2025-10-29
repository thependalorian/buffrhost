'use client';

import React from 'react';
import { Navigation, Footer } from '@/components/landing';

/**
 * Property Hero Layout Component
 * 
 * Psychology-driven layout for property hero sections with conversion focus
 * Location: components/layout/PropertyHeroLayout.tsx
 * 
 * Design Psychology Principles Applied:
 * - Visual Hierarchy: Hero content creates immediate impact
 * - Color Psychology: Warm, inviting colors for hospitality
 * - Social Proof: Reviews and ratings prominently displayed
 * - Call-to-Action Psychology: Multiple conversion points
 * - Trust Building: Professional imagery and clear information
 * - Scarcity Principle: Availability and booking urgency
 * - Reciprocity: Value-first content before asking for action
 */

interface PropertyHeroLayoutProps {
  children: React.ReactNode;
  backgroundImage?: string;
  className?: string;
}

export const PropertyHeroLayout: React.FC<PropertyHeroLayoutProps> = ({
  children,
  backgroundImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  className = ''
}) => {
  return (
    <div className={`min-h-screen ${className}`}>
      {/* Fixed Navigation - Brand consistency and trust */}
      <Navigation />
      
      {/* Hero Section with Psychological Impact */}
      <section 
        className="relative py-20 px-4 text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '70vh'
        }}
      >
        <div className="relative max-w-6xl mx-auto">
          {/* Hero Content with Conversion Focus */}
          <div className="space-y-8">
            {children}
          </div>
        </div>
      </section>
      
      {/* Main Content with Trust-Building Elements */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Content flows naturally from hero */}
            {children}
          </div>
        </div>
      </div>
      
      {/* Footer - Completes the trust-building experience */}
      <Footer />
    </div>
  );
};