'use client';

import React from 'react';
import { Navigation, Footer } from '@/components/landing';

/**
 * Property Search Layout Component
 * 
 * Psychology-driven layout for property search and listing pages
 * Location: components/layout/PropertySearchLayout.tsx
 * 
 * Design Psychology Principles Applied:
 * - F-Pattern Reading: Search and filters on left, results on right
 * - Visual Hierarchy: Clear search-to-results flow
 * - Proximity Principle: Related search elements grouped
 * - Contrast & Emphasis: Search bar prominently featured
 * - White Space: Clean, uncluttered design for focus
 * - Color Psychology: Calming background for decision-making
 * - Cognitive Load Reduction: Progressive disclosure of information
 */

interface PropertySearchLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PropertySearchLayout: React.FC<PropertySearchLayoutProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100/30 ${className}`}>
      {/* Fixed Navigation - Consistent brand presence */}
      <Navigation />
      
      {/* Main Search Interface - F-pattern optimized */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {children}
      </div>
      
      {/* Footer - Completes the experience */}
      <Footer />
    </div>
  );
};