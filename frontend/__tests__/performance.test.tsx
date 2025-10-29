import React from 'react';
import { render } from '@testing-library/react';
import {
  PrimaryCTA,
  SecondaryCTA,
  TertiaryCTA,
} from '../components/ui/cta/PrimaryCTA';
import { PsychologyCard } from '../components/ui/cards/PsychologyCard';
import { PsychologyHeading } from '../components/ui/typography/PsychologyTypography';

describe('Performance Tests', () => {
  test('CTA components render quickly', () => {
    const start = performance.now();

    render(
      <div>
        <PrimaryCTA>Test</PrimaryCTA>
        <SecondaryCTA>Test</SecondaryCTA>
        <TertiaryCTA>Test</TertiaryCTA>
      </div>
    );

    const end = performance.now();
    const renderTime = end - start;

    // Should render in less than 100ms
    expect(renderTime).toBeLessThan(100);
  });

  test('Card components render efficiently', () => {
    const start = performance.now();

    render(
      <div>
        <PsychologyCard variant="prime">Test</PsychologyCard>
        <PsychologyCard variant="luxury">Test</PsychologyCard>
        <PsychologyCard variant="interactive">Test</PsychologyCard>
      </div>
    );

    const end = performance.now();
    const renderTime = end - start;

    // Should render in less than 50ms
    expect(renderTime).toBeLessThan(50);
  });

  test('Typography components are lightweight', () => {
    const start = performance.now();

    render(
      <div>
        <PsychologyHeading level={1}>Test</PsychologyHeading>
        <PsychologyHeading level={2}>Test</PsychologyHeading>
        <PsychologyHeading level={3}>Test</PsychologyHeading>
      </div>
    );

    const end = performance.now();
    const renderTime = end - start;

    // Should render in less than 30ms
    expect(renderTime).toBeLessThan(30);
  });

  test('Multiple components render efficiently together', () => {
    const start = performance.now();

    render(
      <div className="space-y-4">
        <PsychologyHeading level={1}>Performance Test</PsychologyHeading>
        <div className="grid grid-cols-3 gap-4">
          <PsychologyCard variant="prime">
            <PrimaryCTA>Action 1</PrimaryCTA>
          </PsychologyCard>
          <PsychologyCard variant="luxury">
            <SecondaryCTA>Action 2</SecondaryCTA>
          </PsychologyCard>
          <PsychologyCard variant="interactive">
            <TertiaryCTA>Action 3</TertiaryCTA>
          </PsychologyCard>
        </div>
      </div>
    );

    const end = performance.now();
    const renderTime = end - start;

    // Should render complex layout in less than 150ms
    expect(renderTime).toBeLessThan(150);
  });
});
