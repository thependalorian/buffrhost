'use client';

import React, { useState } from 'react';
import {
  Navigation,
  Footer,
  PageHero,
  SmartWaitlist,
  BottomCTA,
} from '@/components/landing';

/**
 * About Page - Universal Story
 *
 * Human-centered story based on real experiences, applicable globally
 * Location: app/about/page.tsx
 * Features: Authentic narrative, problem-focused, relatable worldwide
 */

export default function AboutPage() {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  return (
    <div className="bg-nude-50 text-nude-900 font-primary min-h-screen flex flex-col">
      <Navigation onStartTrial={() => setShowWaitlistModal(true)} />
      <main className="flex-grow">
        <PageHero
          title="About Buffr Host"
          subtitle="Built by People Who Run Hotels & Restaurants"
          description="We understand because we've lived it—and we're solving it."
        />

        {/* The Story Section */}
        <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-2xl shadow-luxury-soft p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-nude-900 mb-4 sm:mb-6 md:mb-8 truncate">
                Where It Started
              </h2>

              <div className="prose prose-sm sm:prose-base md:prose-lg text-nude-700 space-y-4 sm:space-y-6 max-w-none">
                <p className="text-sm sm:text-base md:text-lg break-words">
                  This is about real people solving real problems they face
                  every day.
                </p>

                <p className="text-sm sm:text-base md:text-lg break-words">
                  We experienced it firsthand. Small teams stretched across
                  multiple roles—front desk, restaurant service, housekeeping,
                  bar operations. During busy periods, calls went unanswered.
                  Email inquiries piled up. Revenue opportunities disappeared.
                </p>

                <p className="text-sm sm:text-base md:text-lg break-words">
                  Servers managing multiple tables led to longer wait times,
                  order errors, and frustrated guests. Every evening, staff
                  manually counted bar inventory against sales records. The same
                  time-consuming process repeated in the kitchen.
                </p>

                <p className="text-sm sm:text-base md:text-lg break-words">
                  We observed how popular restaurants attracted orders through
                  social media, only to struggle with simultaneous phone
                  inquiries. Kitchen staff couldn't answer calls while preparing
                  meals. Orders moved through fragmented channels without clear
                  tracking.
                </p>

                <p className="text-sm sm:text-base md:text-lg break-words">
                  Payment methods were equally disconnected—mobile money, cash
                  payments.
                </p>

                <p className="text-sm sm:text-base md:text-lg break-words">
                  Guest information sat in physical ledgers. Valuable customer
                  data remained trapped on paper, making it impossible to track
                  preferences or build the relationships that keep guests coming
                  back.
                </p>

                <p className="font-semibold text-sm sm:text-base md:text-lg text-nude-900 break-words">
                  There had to be an easier way.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-nude-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-nude-900 mb-6 sm:mb-8 md:mb-12 text-center truncate">
              The Real Problem
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-luxury-soft overflow-hidden">
                <h3 className="text-lg sm:text-xl font-bold text-nude-900 mb-2 sm:mb-3 truncate">
                  Staff Stretched Thin
                </h3>
                <p className="text-sm sm:text-base text-nude-700 break-words">
                  Teams juggling multiple responsibilities—front desk
                  operations, F&B services, housekeeping. When the phone rings
                  during busy periods, someone has to choose what gets
                  neglected.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-luxury-soft overflow-hidden">
                <h3 className="text-lg sm:text-xl font-bold text-nude-900 mb-2 sm:mb-3 truncate">
                  Lost Opportunities
                </h3>
                <p className="text-sm sm:text-base text-nude-700 break-words">
                  Missed calls mean missed bookings. Slow email responses mean
                  guests book elsewhere. Every unanswered inquiry is revenue
                  walking out your door.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-luxury-soft overflow-hidden">
                <h3 className="text-lg sm:text-xl font-bold text-nude-900 mb-2 sm:mb-3 truncate">
                  Manual Everything
                </h3>
                <p className="text-sm sm:text-base text-nude-700 break-words">
                  Counting inventory by hand. Recording sales manually. Relaying
                  orders to kitchen. Low stock blocking orders. Hours wasted on
                  tasks that could be automated.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-luxury-soft overflow-hidden">
                <h3 className="text-lg sm:text-xl font-bold text-nude-900 mb-2 sm:mb-3 truncate">
                  Underutilized Guest Data
                </h3>
                <p className="text-sm sm:text-base text-nude-700 break-words">
                  Writing bookings in a physical book means data exists, but
                  can't be used effectively. No way to remember preferences,
                  track patterns, or personalize service to build loyalty.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Solution Section */}
        <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-nude-900 mb-6 sm:mb-8 md:mb-12 text-center truncate">
              What We Built
            </h2>

            <div className="space-y-6 sm:space-y-8">
              {/* Sofia */}
              <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-luxury-soft overflow-hidden">
                <h3 className="text-xl sm:text-2xl font-bold text-nude-900 mb-3 sm:mb-4 truncate">
                  Sofia: Your Digital Front Desk
                </h3>
                <p className="text-sm sm:text-base text-nude-700 mb-4 sm:mb-6 break-words">
                  While your staff focuses on customer experience—Sofia handles
                  every call, WhatsApp message, and email. She takes bookings,
                  answers questions, and ensures nothing falls through the
                  cracks.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-orange-500 text-base sm:text-xl font-bold flex-shrink-0">
                      •
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-nude-900 truncate">
                        Voice Capabilities
                      </p>
                      <p className="text-xs sm:text-sm text-nude-600 break-words">
                        Coming soon - answers phone calls automatically
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-orange-500 text-base sm:text-xl font-bold flex-shrink-0">
                      •
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-nude-900 truncate">
                        WhatsApp Integration
                      </p>
                      <p className="text-xs sm:text-sm text-nude-600 break-words">
                        Coming soon - takes orders and bookings directly
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 text-base sm:text-xl font-bold flex-shrink-0">
                      ✓
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-nude-900 truncate">
                        24/7 Availability
                      </p>
                      <p className="text-xs sm:text-sm text-nude-600 break-words">
                        Never miss a booking opportunity
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 text-base sm:text-xl font-bold flex-shrink-0">
                      ✓
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-nude-900 truncate">
                        Email Management
                      </p>
                      <p className="text-xs sm:text-sm text-nude-600 break-words">
                        Handles all email inquiries and bookings
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Smart Operations */}
              <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-luxury-soft overflow-hidden">
                <h3 className="text-xl sm:text-2xl font-bold text-nude-900 mb-3 sm:mb-4 truncate">
                  Smart Operations Management
                </h3>
                <p className="text-sm sm:text-base text-nude-700 mb-4 sm:mb-6 break-words">
                  One system tracks everything automatically. When sales happen
                  on our platform, inventory levels update in real-time and
                  notify you when it's time to replenish stock.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 text-base sm:text-xl flex-shrink-0">
                      ✓
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-nude-900 truncate">
                        Automatic Inventory
                      </p>
                      <p className="text-xs sm:text-sm text-nude-600 break-words">
                        Sales automatically deduct from inventory levels
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 text-base sm:text-xl flex-shrink-0">
                      ✓
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-nude-900 truncate">
                        Content Management System
                      </p>
                      <p className="text-xs sm:text-sm text-nude-600 break-words">
                        Manage your menu and content easily
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 text-base sm:text-xl flex-shrink-0">
                      ✓
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-nude-900 truncate">
                        Payment Processing
                      </p>
                      <p className="text-xs sm:text-sm text-nude-600 break-words">
                        Secure payments through our platform
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 text-base sm:text-xl flex-shrink-0">
                      ✓
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-nude-900 truncate">
                        Stock Alerts
                      </p>
                      <p className="text-xs sm:text-sm text-nude-600 break-words">
                        Notifications when minimum threshold is reached
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Relationships */}
              <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-luxury-soft overflow-hidden">
                <h3 className="text-xl sm:text-2xl font-bold text-nude-900 mb-3 sm:mb-4 truncate">
                  Build Real Guest Relationships
                </h3>
                <p className="text-sm sm:text-base text-nude-700 mb-4 sm:mb-6 break-words">
                  Replace that physical booking book with a system that captures
                  every detail, remembers preferences, and brings guests back.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 text-base sm:text-xl flex-shrink-0">
                      ✓
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-nude-900 truncate">
                        Complete Guest Profiles
                      </p>
                      <p className="text-xs sm:text-sm text-nude-600 break-words">
                        Preferences, history, everything
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 text-base sm:text-xl flex-shrink-0">
                      ✓
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-nude-900 truncate">
                        Personalized Service
                      </p>
                      <p className="text-xs sm:text-sm text-nude-600 break-words">
                        Remember what matters to them
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 text-base sm:text-xl flex-shrink-0">
                      ✓
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-nude-900 truncate">
                        Loyalty Rewards
                      </p>
                      <p className="text-xs sm:text-sm text-nude-600 break-words">
                        Incentivize repeat visits
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 text-base sm:text-xl flex-shrink-0">
                      ✓
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-nude-900 truncate">
                        Feedback Loops
                      </p>
                      <p className="text-xs sm:text-sm text-nude-600 break-words">
                        Improve ratings and visibility
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-nude-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-nude-900 mb-6 sm:mb-8 text-center truncate">
              Built for Independent Properties
            </h2>

            <div className="bg-white rounded-2xl shadow-luxury-soft p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden">
              <div className="prose prose-sm sm:prose-base md:prose-lg text-nude-700 space-y-4 sm:space-y-6 max-w-none">
                <p className="text-sm sm:text-base md:text-lg break-words">
                  Whether you're running a family guesthouse, an intimate
                  restaurant, or a rental property— these challenges are
                  universal. Staff juggling roles. Missed opportunities. Manual
                  processes eating time.
                </p>

                <p className="text-sm sm:text-base md:text-lg break-words">
                  We're not trying to sell you expensive hardware that breaks
                  and costs thousands to replace. We built something that works
                  with your team, fits your budget, and solves your actual daily
                  problems.
                </p>

                <p className="text-sm sm:text-base md:text-lg break-words">
                  Because we're not just building software. We're solving
                  problems we face ourselves, at properties just like yours.
                </p>
              </div>
            </div>
          </div>
        </section>
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
