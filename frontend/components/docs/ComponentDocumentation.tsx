import React, { useState } from 'react';
import { PrimaryCTA, SecondaryCTA, TertiaryCTA } from '../ui/cta/PrimaryCTA';
import { PsychologyCard } from '../ui/cards/PsychologyCard';
import { PsychologyHeading } from '../ui/typography/PsychologyTypography';
import { ABTestProvider, ABTestCTA } from '../../ab-testing/ABTestCTA';
import {
  ColorBlindProvider,
  ColorBlindToggle,
} from '../accessibility/ColorBlindSupport';

interface CodeBlockProps {
  children: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  language = 'tsx',
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="bg-nude-900 text-nude-100 p-4 rounded-lg overflow-x-auto">
        <code className={`language-${language}`}>{children}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 bg-nude-700 hover:bg-nude-600 text-white px-2 py-1 rounded text-xs transition-colors"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

interface ComponentExampleProps {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
}

const ComponentExample: React.FC<ComponentExampleProps> = ({
  title,
  description,
  code,
  children,
}) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="bg-white border border-nude-200 rounded-lg p-6 mb-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-nude-900">{title}</h3>
          <p className="text-nude-700 mt-1">{description}</p>
        </div>
        <button
          onClick={() => setShowCode(!showCode)}
          className="bg-nude-100 hover:bg-nude-200 text-nude-700 px-3 py-1 rounded text-sm transition-colors"
        >
          {showCode ? 'Hide Code' : 'Show Code'}
        </button>
      </div>

      <div className="mb-4">{children}</div>

      {showCode && <CodeBlock>{code}</CodeBlock>}
    </div>
  );
};

export const ComponentDocumentation: React.FC = () => {
  return (
    <ColorBlindProvider>
      <div className="min-h-screen bg-nude-50">
        <div className="max-w-6xl mx-auto p-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-nude-900 mb-4">
              Buffr Host Component Library
            </h1>
            <p className="text-lg text-nude-700">
              Psychology-driven, accessibility-first components for maximum
              conversion and user experience.
            </p>
          </div>

          {/* CTA Buttons Documentation */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-nude-900 mb-8">
              Call-to-Action Buttons
            </h2>

            <ComponentExample
              title="Primary CTA"
              description="High-converting gold button for primary actions. Psychology-optimized for maximum click-through rates."
              code={`import { PrimaryCTA } from '@/components/ui/cta/PrimaryCTA';

<PrimaryCTA onClick={() => console.log('Clicked!')}>
  Book Now
</PrimaryCTA>`}
            >
              <div className="flex gap-4">
                <PrimaryCTA onClick={() => console.log('Primary clicked!')}>
                  Book Now
                </PrimaryCTA>
                <PrimaryCTA disabled>Disabled</PrimaryCTA>
              </div>
            </ComponentExample>

            <ComponentExample
              title="Secondary CTA"
              description="Mahogany button for secondary actions. Maintains visual hierarchy while being less prominent."
              code={`import { SecondaryCTA } from '@/components/ui/cta/PrimaryCTA';

<SecondaryCTA onClick={() => console.log('Secondary clicked!')}>
  Learn More
</SecondaryCTA>`}
            >
              <div className="flex gap-4">
                <SecondaryCTA onClick={() => console.log('Secondary clicked!')}>
                  Learn More
                </SecondaryCTA>
                <SecondaryCTA disabled>Disabled</SecondaryCTA>
              </div>
            </ComponentExample>

            <ComponentExample
              title="Tertiary CTA"
              description="Bronze button for tertiary actions. Subtle guidance without overwhelming the user."
              code={`import { TertiaryCTA } from '@/components/ui/cta/PrimaryCTA';

<TertiaryCTA onClick={() => console.log('Tertiary clicked!')}>
  Cancel
</TertiaryCTA>`}
            >
              <div className="flex gap-4">
                <TertiaryCTA onClick={() => console.log('Tertiary clicked!')}>
                  Cancel
                </TertiaryCTA>
                <TertiaryCTA disabled>Disabled</TertiaryCTA>
              </div>
            </ComponentExample>
          </section>

          {/* Psychology Cards Documentation */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-nude-900 mb-8">
              Psychology Cards
            </h2>

            <ComponentExample
              title="Prime Zone Card"
              description="High-conversion placement for important content. Uses prime zone psychology principles."
              code={`import { PsychologyCard } from '@/components/ui/cards/PsychologyCard';

<PsychologyCard variant="prime">
  <h3>Premium Feature</h3>
  <p>This is placed in the prime zone for maximum visibility.</p>
</PsychologyCard>`}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <PsychologyCard variant="prime">
                  <h3 className="text-lg font-semibold text-nude-800 mb-2">
                    Prime Zone Card
                  </h3>
                  <p className="text-nude-700">
                    High-conversion placement for important content.
                  </p>
                </PsychologyCard>
                <PsychologyCard
                  variant="prime"
                  onClick={() => console.log('Prime card clicked!')}
                >
                  <h3 className="text-lg font-semibold text-nude-800 mb-2">
                    Interactive Prime
                  </h3>
                  <p className="text-nude-700">Clickable prime zone card.</p>
                </PsychologyCard>
              </div>
            </ComponentExample>

            <ComponentExample
              title="Luxury Card"
              description="Premium styling for luxury features. Uses Charlotte Pillow Talk collection colors."
              code={`import { PsychologyCard } from '@/components/ui/cards/PsychologyCard';

<PsychologyCard variant="luxury">
  <h3>Luxury Feature</h3>
  <p>Premium styling for high-value content.</p>
</PsychologyCard>`}
            >
              <PsychologyCard variant="luxury">
                <h3 className="text-lg font-semibold text-nude-800 mb-2">
                  Luxury Card
                </h3>
                <p className="text-nude-700">
                  Premium styling with luxury color palette.
                </p>
              </PsychologyCard>
            </ComponentExample>

            <ComponentExample
              title="Interactive Card"
              description="Clickable card with hover effects. Optimized for user engagement."
              code={`import { PsychologyCard } from '@/components/ui/cards/PsychologyCard';

<PsychologyCard variant="interactive" onClick={() => console.log('Card clicked!')}>
  <h3>Interactive Content</h3>
  <p>Clickable card with engagement optimization.</p>
</PsychologyCard>`}
            >
              <PsychologyCard
                variant="interactive"
                onClick={() => console.log('Interactive card clicked!')}
              >
                <h3 className="text-lg font-semibold text-nude-800 mb-2">
                  Interactive Card
                </h3>
                <p className="text-nude-700">
                  Clickable with hover effects and focus states.
                </p>
              </PsychologyCard>
            </ComponentExample>
          </section>

          {/* Typography Documentation */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-nude-900 mb-8">
              Psychology Typography
            </h2>

            <ComponentExample
              title="Psychology Headings"
              description="Typography system optimized for visual hierarchy and user attention."
              code={`import { PsychologyHeading } from '@/components/ui/typography/PsychologyTypography';

<PsychologyHeading level={1}>Hero Heading</PsychologyHeading>
<PsychologyHeading level={2}>Section Heading</PsychologyHeading>
<PsychologyHeading level={3}>Card Heading</PsychologyHeading>`}
            >
              <div className="space-y-6">
                <PsychologyHeading level={1}>Hero Heading</PsychologyHeading>
                <PsychologyHeading level={2}>Section Heading</PsychologyHeading>
                <PsychologyHeading level={3}>Card Heading</PsychologyHeading>
                <PsychologyHeading level={4}>
                  Subsection Heading
                </PsychologyHeading>
              </div>
            </ComponentExample>
          </section>

          {/* A/B Testing Documentation */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-nude-900 mb-8">
              A/B Testing Framework
            </h2>

            <ComponentExample
              title="A/B Test CTA"
              description="Button that automatically tests different color variants for conversion optimization."
              code={`import { ABTestProvider, ABTestCTA } from '@/components/ab-testing/ABTestCTA';

<ABTestProvider>
  <ABTestCTA 
    trackEvent={(variant) => console.log(\`Clicked variant: \${variant}\`)}
  >
    A/B Test Button
  </ABTestCTA>
</ABTestProvider>`}
            >
              <ABTestProvider>
                <div className="space-y-4">
                  <ABTestCTA
                    trackEvent={(variant) =>
                      console.log(`A/B Test clicked: ${variant}`)
                    }
                  >
                    A/B Test Button
                  </ABTestCTA>
                  <p className="text-sm text-nude-600">
                    This button randomly shows different color variants (Gold,
                    Mahogany, Bronze) for conversion testing.
                  </p>
                </div>
              </ABTestProvider>
            </ComponentExample>
          </section>

          {/* Accessibility Features */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-nude-900 mb-8">
              Accessibility Features
            </h2>

            <div className="bg-white border border-nude-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-nude-900 mb-4">
                WCAG 2.1 AA Compliance
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-nude-800 mb-3">
                    Built-in Features
                  </h4>
                  <ul className="space-y-2 text-nude-700">
                    <li>✅ 4.5:1 minimum color contrast ratio</li>
                    <li>✅ Proper focus states for all interactive elements</li>
                    <li>✅ ARIA labels and roles for screen readers</li>
                    <li>✅ Keyboard navigation support</li>
                    <li>✅ Motion reduction support</li>
                    <li>✅ High contrast mode support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-nude-800 mb-3">
                    Color Blind Support
                  </h4>
                  <p className="text-nude-700 mb-3">
                    Toggle color blind mode for enhanced accessibility:
                  </p>
                  <ColorBlindToggle />
                </div>
              </div>
            </div>
          </section>

          {/* Performance Features */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-nude-900 mb-8">
              Performance Optimizations
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-nude-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-nude-900 mb-3">
                  CSS Optimizations
                </h3>
                <ul className="space-y-2 text-nude-700">
                  <li>✅ Critical CSS loaded first</li>
                  <li>✅ Font preloading for faster rendering</li>
                  <li>✅ CSS purging with safelist protection</li>
                  <li>✅ Component-based architecture</li>
                </ul>
              </div>

              <div className="bg-white border border-nude-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-nude-900 mb-3">
                  Monitoring & Analytics
                </h3>
                <ul className="space-y-2 text-nude-700">
                  <li>✅ Core Web Vitals tracking</li>
                  <li>✅ Conversion event monitoring</li>
                  <li>✅ A/B test performance analytics</li>
                  <li>✅ Color psychology effectiveness tracking</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Usage Guidelines */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-nude-900 mb-8">
              Usage Guidelines
            </h2>

            <div className="bg-nude-50 border border-nude-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-nude-900 mb-4">
                Best Practices
              </h3>
              <div className="space-y-4 text-nude-700">
                <div>
                  <h4 className="font-medium text-nude-800">Color Hierarchy</h4>
                  <p>
                    Use gold for primary actions, mahogany for secondary, and
                    bronze for tertiary. This psychology-driven hierarchy
                    maximizes conversion rates.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-nude-800">Card Placement</h4>
                  <p>
                    Place important content in prime zone cards, luxury features
                    in luxury cards, and interactive content in interactive
                    cards.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-nude-800">A/B Testing</h4>
                  <p>
                    Use A/B test components to validate color choices and
                    optimize conversion rates based on real user data.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-nude-800">Accessibility</h4>
                  <p>
                    Always test with color blind mode and ensure proper focus
                    states for keyboard navigation.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ColorBlindProvider>
  );
};
