'use client';

import React from 'react';
import { Navigation, Footer } from '@/components/landing';

/**
 * Property Detail Layout Component
 * 
 * Psychology-driven layout for property detail pages
 * Location: components/layout/PropertyDetailLayout.tsx
 * 
 * Design Psychology Principles Applied:
 * - F-Pattern Reading: Left-aligned content for natural eye movement
 * - Visual Hierarchy: Clear information hierarchy with size and contrast
 * - Proximity Principle: Related elements grouped together
 * - Social Proof Placement: Reviews and ratings strategically positioned
 * - Call-to-Action Psychology: Prominent booking actions
 * - Color Psychology: Warm, trust-building color scheme
 * - White Space: Strategic breathing room for focus
 */

interface PropertyDetailLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PropertyDetailLayout: React.FC<PropertyDetailLayoutProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100/30 ${className}`}>
      {/* Fixed Navigation - Creates sense of stability and trust */}
      <Navigation />
      
      {/* Main Content Area with F-Pattern Layout */}
      <main className="relative">
        {children}
      </main>
      
      {/* Footer - Completes the page structure */}
      <Footer />
    </div>
  );
};