import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  PrimaryCTA,
  SecondaryCTA,
  TertiaryCTA,
} from '../components/ui/cta/PrimaryCTA';
import { PsychologyCard } from '../components/ui/cards/PsychologyCard';
import { PsychologyHeading } from '../components/ui/typography/PsychologyTypography';

expect.extend(toHaveNoViolations);

describe('CTA Button Accessibility', () => {
  test('PrimaryCTA should not have accessibility violations', async () => {
    const { container } = render(<PrimaryCTA>Test Button</PrimaryCTA>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('SecondaryCTA should not have accessibility violations', async () => {
    const { container } = render(<SecondaryCTA>Test Button</SecondaryCTA>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('TertiaryCTA should not have accessibility violations', async () => {
    const { container } = render(<TertiaryCTA>Test Button</TertiaryCTA>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Card Component Accessibility', () => {
  test('PsychologyCard should not have accessibility violations', async () => {
    const { container } = render(
      <PsychologyCard variant="prime">
        <h3>Test Card</h3>
        <p>Test content</p>
      </PsychologyCard>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('PsychologyCard interactive should not have accessibility violations', async () => {
    const { container } = render(
      <PsychologyCard variant="interactive" onClick={() => {}}>
        <h3>Interactive Card</h3>
        <p>Clickable content</p>
      </PsychologyCard>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Typography Accessibility', () => {
  test('PsychologyHeading should not have accessibility violations', async () => {
    const { container } = render(
      <PsychologyHeading level={1}>Test Heading</PsychologyHeading>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('PsychologyHeading level 2 should not have accessibility violations', async () => {
    const { container } = render(
      <PsychologyHeading level={2}>Test Heading</PsychologyHeading>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
