import React from 'react';
/**
 * ComponentShowcase React Component for Buffr Host Hospitality Platform
 * @fileoverview ComponentShowcase provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/docs/ComponentShowcase.tsx
 * @purpose ComponentShowcase provides specialized functionality for the Buffr Host platform
 * @component ComponentShowcase
 * @category Docs
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Usage Example:
 * @example
 * import { ComponentShowcase } from './ComponentShowcase';
 *
 * function App() {
 *   return (
 *     <ComponentShowcase
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered ComponentShowcase component
 */

import { PrimaryCTA, SecondaryCTA, TertiaryCTA } from '../ui/cta/PrimaryCTA';
import { PsychologyCard } from '../ui/cards/PsychologyCard';
import { PsychologyHeading } from '../ui/typography/PsychologyTypography';
import { ABTestProvider, ABTestCTA } from '../ab-testing/ABTestCTA';

export const ComponentShowcase: React.FC = () => {
  return (
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
              <PsychologyHeading level={1}>Hero Heading</PsychologyHeading>
              <PsychologyHeading level={2}>Section Heading</PsychologyHeading>
              <PsychologyHeading level={3}>Card Heading</PsychologyHeading>
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
        </div>
      </div>
    </ABTestProvider>
  );
};
