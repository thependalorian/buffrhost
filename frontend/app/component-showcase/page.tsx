'use client';

import React from 'react';
import {
  PrimaryCTA,
  SecondaryCTA,
  TertiaryCTA,
} from '@/components/ui/cta/PrimaryCTA';
import { PsychologyCard } from '@/components/ui/cards/PsychologyCard';
import { PsychologyHeading } from '@/components/ui/typography/PsychologyTypography';
import { ABTestProvider, ABTestCTA } from '@/components/ab-testing/ABTestCTA';
import {
  ColorBlindProvider,
  ColorBlindToggle,
} from '@/components/accessibility/ColorBlindSupport';
import MainNavigation from '@/components/layout/MainNavigation';

export default function ComponentShowcase() {
  return (
    <ColorBlindProvider>
      <div className="min-h-screen bg-nude-50">
        <MainNavigation />

        <div className="pt-20">
          <ABTestProvider>
            <div className="max-w-6xl mx-auto p-8 space-y-12">
              <div>
                <h1 className="text-4xl font-bold text-nude-900 mb-8">
                  Buffr Host Component Library
                </h1>

                {/* CTA Buttons Section */}
                <section className="mb-12">
                  <h2 className="text-2xl font-semibold text-nude-800 mb-6">
                    Call-to-Action Buttons
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    <PrimaryCTA>Primary Action</PrimaryCTA>
                    <SecondaryCTA>Secondary Action</SecondaryCTA>
                    <TertiaryCTA>Tertiary Action</TertiaryCTA>
                  </div>
                </section>

                {/* A/B Test CTA Section */}
                <section className="mb-12">
                  <h2 className="text-2xl font-semibold text-nude-800 mb-6">
                    A/B Test CTA (Random Variant)
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    <ABTestCTA
                      trackEvent={(variant) =>
                        console.log(`CTA clicked with variant: ${variant}`)
                      }
                    >
                      A/B Test Button
                    </ABTestCTA>
                  </div>
                </section>

                {/* Cards Section */}
                <section className="mb-12">
                  <h2 className="text-2xl font-semibold text-nude-800 mb-6">
                    Psychology Cards
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <PsychologyCard variant="prime">
                      <h3 className="text-lg font-semibold text-nude-800 mb-2">
                        Prime Zone Card
                      </h3>
                      <p className="text-nude-700">High-conversion placement</p>
                    </PsychologyCard>
                    <PsychologyCard variant="luxury">
                      <h3 className="text-lg font-semibold text-nude-800 mb-2">
                        Luxury Card
                      </h3>
                      <p className="text-nude-700">Premium features</p>
                    </PsychologyCard>
                    <PsychologyCard variant="interactive">
                      <h3 className="text-lg font-semibold text-nude-800 mb-2">
                        Interactive Card
                      </h3>
                      <p className="text-nude-700">Clickable content</p>
                    </PsychologyCard>
                  </div>
                </section>

                {/* Typography Section */}
                <section className="mb-12">
                  <h2 className="text-2xl font-semibold text-nude-800 mb-6">
                    Psychology Typography
                  </h2>
                  <div className="space-y-6">
                    <PsychologyHeading level={1}>
                      Hero Heading
                    </PsychologyHeading>
                    <PsychologyHeading level={2}>
                      Section Heading
                    </PsychologyHeading>
                    <PsychologyHeading level={3}>
                      Card Heading
                    </PsychologyHeading>
                  </div>
                </section>

                {/* Color System Section */}
                <section className="mb-12">
                  <h2 className="text-2xl font-semibold text-nude-800 mb-6">
                    Optimized Color System
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-nude-800">
                        CTA Colors
                      </h3>
                      <div className="space-y-2">
                        <div className="bg-cta-primary text-white p-3 rounded-lg text-center">
                          Primary CTA
                        </div>
                        <div className="bg-cta-secondary text-white p-3 rounded-lg text-center">
                          Secondary CTA
                        </div>
                        <div className="bg-cta-tertiary text-white p-3 rounded-lg text-center">
                          Tertiary CTA
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-nude-800">
                        Nude Foundation
                      </h3>
                      <div className="space-y-2">
                        <div className="bg-nude-600 text-white p-3 rounded-lg text-center">
                          Nude 600
                        </div>
                        <div className="bg-nude-700 text-white p-3 rounded-lg text-center">
                          Nude 700
                        </div>
                        <div className="bg-nude-800 text-white p-3 rounded-lg text-center">
                          Nude 800
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-nude-800">
                        Luxury Collection
                      </h3>
                      <div className="space-y-2">
                        <div className="bg-luxury-gold text-white p-3 rounded-lg text-center">
                          Luxury Gold
                        </div>
                        <div className="bg-luxury-charlotte text-white p-3 rounded-lg text-center">
                          Charlotte
                        </div>
                        <div className="bg-luxury-bronze text-white p-3 rounded-lg text-center">
                          Bronze
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-nude-800">
                        Semantic Colors
                      </h3>
                      <div className="space-y-2">
                        <div className="bg-semantic-success text-white p-3 rounded-lg text-center">
                          Success
                        </div>
                        <div className="bg-semantic-warning text-white p-3 rounded-lg text-center">
                          Warning
                        </div>
                        <div className="bg-semantic-error text-white p-3 rounded-lg text-center">
                          Error
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Accessibility Features */}
                <section className="mb-12">
                  <h2 className="text-2xl font-semibold text-nude-800 mb-6">
                    Accessibility Features
                  </h2>
                  <div className="bg-nude-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-nude-800 mb-4">
                      WCAG 2.1 AA Compliance
                    </h3>
                    <ul className="space-y-2 text-nude-700">
                      <li>✅ All buttons have proper focus states</li>
                      <li>✅ Color contrast meets 4.5:1 minimum ratio</li>
                      <li>✅ Screen reader compatible</li>
                      <li>✅ Keyboard navigation support</li>
                      <li>✅ High contrast mode support</li>
                      <li>✅ Motion reduction support</li>
                      <li>✅ Color blind friendly variants</li>
                    </ul>
                  </div>
                </section>

                {/* Performance Metrics */}
                <section className="mb-12">
                  <h2 className="text-2xl font-semibold text-nude-800 mb-6">
                    Performance Optimizations
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-nude-200">
                      <h3 className="text-lg font-semibold text-nude-800 mb-4">
                        CSS Optimizations
                      </h3>
                      <ul className="space-y-2 text-nude-700">
                        <li>✅ Critical CSS loaded first</li>
                        <li>✅ Font preloading implemented</li>
                        <li>✅ CSS purging enabled</li>
                        <li>✅ Component-based architecture</li>
                      </ul>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-nude-200">
                      <h3 className="text-lg font-semibold text-nude-800 mb-4">
                        Conversion Features
                      </h3>
                      <ul className="space-y-2 text-nude-700">
                        <li>✅ Psychology-driven color hierarchy</li>
                        <li>✅ A/B testing framework</li>
                        <li>✅ Conversion tracking</li>
                        <li>✅ Performance monitoring</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </ABTestProvider>
        </div>

        <ColorBlindToggle />
      </div>
    </ColorBlindProvider>
  );
}
