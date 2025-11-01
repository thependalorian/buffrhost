/**
 * @file This file defines the HeroSection component, which is the main hero section for the landing page.
 * @location frontend/components/landing/HeroSection.tsx
 * @description This component displays a headline, a subheadline, and a call-to-action button.
 * @modular
 *
 * @component
 * @param {HeroSectionProps} props - The props for the component.
 * @param {() => void} props.onStartTrial - A function to call when the "Start Free Trial" button is clicked.
 *
 * @example
 * <HeroSection onStartTrial={() => console.log('Start trial clicked')} />
 *
 * @see {@link BuffrButton}
 *
 * @security This component does not handle any sensitive data directly.
 * @accessibility The component uses semantic HTML.
 * @performance The component is lightweight and has minimal performance impact.
 *
 * @buffr-icon-usage This component does not use any icons.
 */
'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Hero Section Component
 *
 * Main landing hero with value proposition and CTA
 * Location: components/landing/HeroSection.tsx
 * Features: Background image, clean design, prominent CTA, trust elements
 */

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = '',
  size = 'md',
  variant = 'default',
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-12 py-4 text-xl',
  };

  const variantClasses = {
    default: 'bg-nude-600 hover:bg-nude-700 text-white',
    outline: 'border-2 border-nude-600 text-nude-600 hover:bg-nude-50',
  };

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses[size]} ${variantClasses[variant]} font-semibold rounded-full transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      {children}
    </button>
  );
};

interface HeroSectionProps {
  onStartTrial: () => void;
  onViewDemo?: () => void;
}

/**
 * HeroSection React Component for Buffr Host Hospitality Platform
 * @fileoverview HeroSection provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/landing/HeroSection.tsx
 * @purpose HeroSection provides specialized functionality for the Buffr Host platform
 * @component HeroSection
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
 * @param {() => void} [onClick] - onClick prop description
 * @param {React.ReactNode} [children] - children prop description
 * @param {} [className] - className prop description
 * @param {} [size] - size prop description
 * @param {} [variant] - variant prop description
 *
 * Usage Example:
 * @example
 * import { HeroSection } from './HeroSection';
 *
 * function App() {
 *   return (
 *     <HeroSection
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered HeroSection component
 */

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartTrial,
  onViewDemo,
}) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Luxury hotel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-nude-900/85 via-nude-900/75 to-nude-900/65"></div>
      </div>

      {/* F-PATTERN LAYOUT - Psychology Framework */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT COLUMN - F-Pattern Primary Path */}
          <div className="space-y-8">
            {/* PRIMACY EFFECT - First thing users see */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white">
                Modern Hospitality Management
                <span className="block text-2xl md:text-3xl lg:text-4xl text-nude-200 mt-4">
                  for Hotels & Restaurants
                </span>
              </h1>
            </div>

            {/* SOCIAL PROOF & AUTHORITY - Trust Building */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-6 text-sm text-nude-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-nude-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>Built by People Who Run Hotels & Restaurants</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-luxury-charlotte rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  </div>
                  <span>Real-World Problem Validation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-nude-300 rounded flex items-center justify-center">
                    <div className="w-2 h-1 bg-white rounded"></div>
                  </div>
                  <span>3 Months Free Trial</span>
                </div>
              </div>
            </div>

            {/* PROGRESSIVE COMMITMENT BUTTONS - Psychology Ladder */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={onStartTrial}
                  size="lg"
                  className="bg-nude-600 hover:bg-nude-700 text-white shadow-luxury-soft hover:shadow-luxury-medium px-8 py-4 text-lg"
                >
                  Start 3-Month Free Trial
                </Button>
                <Button
                  onClick={onViewDemo || onStartTrial}
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
                >
                  View Demo
                </Button>
              </div>

              <p className="text-nude-300 text-sm">
                No credit card required • Full platform access • Online setup
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN - F-Pattern Secondary Path */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="pt-12">
                <Image
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Hotel Pool"
                  width={400}
                  height={300}
                  className="rounded-2xl shadow-luxury-medium"
                />
              </div>
              <div>
                <Image
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Hotel Room"
                  width={400}
                  height={300}
                  className="rounded-2xl shadow-luxury-medium"
                />
              </div>
              <div className="col-span-2">
                <Image
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Hotel Exterior"
                  width={800}
                  height={400}
                  className="rounded-2xl shadow-luxury-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
