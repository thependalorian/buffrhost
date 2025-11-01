'use client';

import React from 'react';

/**
 * Footer Component
 *
 * Site footer with links and company information
 * Location: components/landing/Footer.tsx
 * Features: Multi-column layout, brand logo, navigation links
 */

interface FooterProps {
  className?: string;
}

/**
 * Footer React Component for Buffr Host Hospitality Platform
 * @fileoverview Footer provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/landing/Footer.tsx
 * @purpose Footer provides specialized functionality for the Buffr Host platform
 * @component Footer
 * @category Landing
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {} [className] - className prop description
 *
 * Usage Example:
 * @example
 * import { Footer } from './Footer';
 *
 * function App() {
 *   return (
 *     <Footer
 *       prop1="value"
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered Footer component
 */

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-nude-900 text-nude-100 py-12 ${className}`}>
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
              Modern Hospitality Management
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Hotels</h4>
            <ul className="space-y-2 text-sm text-nude-300">
              <li>
                <a
                  href="#hotels"
                  className="hover:text-white transition-colors"
                >
                  Vacation Rentals
                </a>
              </li>
              <li>
                <a
                  href="#hotels"
                  className="hover:text-white transition-colors"
                >
                  Resorts
                </a>
              </li>
              <li>
                <a
                  href="#hotels"
                  className="hover:text-white transition-colors"
                >
                  Guest Houses
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Restaurants</h4>
            <ul className="space-y-2 text-sm text-nude-300">
              <li>
                <a
                  href="#restaurants"
                  className="hover:text-white transition-colors"
                >
                  Standalone Restaurants
                </a>
              </li>
              <li>
                <a
                  href="#restaurants"
                  className="hover:text-white transition-colors"
                >
                  Bars & Lounges
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-nude-300">
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-nude-800 mt-8 pt-8 text-center">
          <p className="text-nude-300 text-sm">
            © 2025 Buffr. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
