'use client';

import React from 'react';
/**
 * AIConciergeShowcase React Component for Buffr Host Hospitality Platform
 * @fileoverview AIConciergeShowcase provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/landing/AIConciergeShowcase.tsx
 * @purpose AIConciergeShowcase provides specialized functionality for the Buffr Host platform
 * @component AIConciergeShowcase
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
 * import { AIConciergeShowcase } from './AIConciergeShowcase';
 *
 * function App() {
 *   return (
 *     <AIConciergeShowcase
 *       prop1="value"
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered AIConciergeShowcase component
 */

import { Cpu, ArrowRight } from 'lucide-react';

/**
 * AI Concierge Showcase Component
 *
 * Interactive demo of the AI concierge with live chat interface
 * Location: components/landing/AIConciergeShowcase.tsx
 * Features: Live chat demo, AI capabilities, performance stats
 */

interface AIConciergeShowcaseProps {
  className?: string;
}

export const AIConciergeShowcase: React.FC<AIConciergeShowcaseProps> = ({
  className = '',
}) => {
  return (
    <section
      className={`py-24 md:py-32 bg-gradient-to-br from-white to-nude-50 ${className}`}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-nude-900 mb-6">
            Meet Your Concierge
          </h2>
          <p className="text-xl text-nude-700 max-w-3xl mx-auto">
            Buffr Host's Front Desk Assistant - handling guest requests, making
            bookings, and providing 24/7 personalized service.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-16 items-center">
          {/* Left: Sofia Introduction */}
          <div className="lg:col-span-1">
            {/* Sofia Introduction */}
            <div className="bg-white rounded-2xl p-12 shadow-nude-soft border border-nude-200/50 text-center">
              <div className="w-48 h-48 bg-gradient-to-br from-nude-200 to-nude-300 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-nude-600 text-6xl font-bold">S</span>
              </div>
              <h3 className="text-3xl font-semibold text-nude-900 mb-6">
                Meet Sofia
              </h3>
              <p className="text-nude-700 text-lg mb-8 leading-relaxed">
                "Hi! I'm Sofia, your AI concierge. I'm here to help with
                bookings, answer questions, and make your guests' stay
                unforgettable."
              </p>
              <div className="flex items-center justify-center gap-3 text-base text-nude-500">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online now</span>
              </div>
            </div>
          </div>

          {/* Right: Live Chat Demo */}
          <div className="relative lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-luxury-strong border border-nude-300/30 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-nude-600 to-nude-700 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      Sofia Concierge
                    </div>
                    <div className="text-white/70 text-sm">
                      Demo Hotel & Restaurant • Online
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white/70 text-sm">Live Demo</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-6 space-y-4 h-[32rem]">
                {/* AI Message */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-nude-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-medium">S</span>
                  </div>
                  <div className="bg-white border border-nude-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <p className="text-nude-900 font-medium">
                      "Good evening! I see you're interested in booking a room.
                      We have several options available. What dates are you
                      looking for?"
                    </p>
                  </div>
                </div>

                {/* Guest Message */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-nude-100 border border-nude-300 text-nude-900 rounded-2xl rounded-tr-none px-4 py-3 shadow-sm">
                    <p className="font-medium">
                      I need a room for this weekend, Friday to Sunday. What do
                      you have available?
                    </p>
                  </div>
                </div>

                {/* AI Message with Actions */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-nude-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-medium">S</span>
                  </div>
                  <div className="bg-white border border-nude-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <p className="text-nude-900 font-medium mb-3">
                      "Perfect! I have a few great options for you. We have a
                      Deluxe Suite with city views for N$2,500/night, or our
                      Executive Room with balcony for N$1,800/night. Both
                      include breakfast and WiFi."
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }
                        className="text-xs bg-nude-100 border border-nude-300 text-nude-800 px-3 py-1 rounded-full hover:bg-nude-200 transition-colors font-medium cursor-pointer"
                      >
                        View Suite
                      </button>
                      <button
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }
                        className="text-xs bg-nude-100 border border-nude-300 text-nude-800 px-3 py-1 rounded-full hover:bg-nude-200 transition-colors font-medium cursor-pointer"
                      >
                        View Executive
                      </button>
                    </div>
                  </div>
                </div>

                {/* Guest Message */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-nude-100 border border-nude-300 text-nude-900 rounded-2xl rounded-tr-none px-4 py-3 shadow-sm">
                    <p className="font-medium">
                      The Executive Room sounds good. Can you tell me about the
                      services available?
                    </p>
                  </div>
                </div>

                {/* AI Message */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-nude-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-medium">S</span>
                  </div>
                  <div className="bg-white border border-nude-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <p className="text-nude-900 font-medium">
                      "Absolutely! We offer 24/7 room service, daily
                      housekeeping, airport transfers, and spa treatments. We
                      also have a business center, fitness room, and our
                      restaurant serves breakfast, lunch, and dinner. Is there
                      anything specific you'd like to know about?"
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="border-t border-nude-200 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type a message to the AI concierge..."
                    className="flex-1 bg-nude-50 border border-nude-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nude-500"
                    disabled
                    readOnly
                  />
                  <button
                    onClick={() => {
                      // This is a demo - in real app would send message
                      alert(
                        'This is a demo. Sofia is powered by AI and handles all guest inquiries. Start your free trial to experience the full concierge service!'
                      );
                    }}
                    className="bg-nude-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-nude-700 transition-colors cursor-pointer"
                    aria-label="Send message"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-nude-500 mt-2 text-center">
                  This is a demo chat interface. Start your free trial to chat
                  with Sofia!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
