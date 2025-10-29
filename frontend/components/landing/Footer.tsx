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
              <li><a href="#hotels" className="hover:text-white transition-colors">Vacation Rentals</a></li>
              <li><a href="#hotels" className="hover:text-white transition-colors">Resorts</a></li>
              <li><a href="#hotels" className="hover:text-white transition-colors">Guest Houses</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Restaurants</h4>
            <ul className="space-y-2 text-sm text-nude-300">
              <li><a href="#restaurants" className="hover:text-white transition-colors">Standalone Restaurants</a></li>
              <li><a href="#restaurants" className="hover:text-white transition-colors">Bars & Lounges</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-nude-300">
              <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
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
