/**
 * Etuna Waitlist Tests
 * 
 * Comprehensive tests for the waitlist conversion functionality
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import EtunaWaitlistPage from '@/app/protected/etuna/waitlist/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/protected/etuna/waitlist',
}));

// Mock Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

describe('Etuna Waitlist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders waitlist title and description', () => {
    render(<EtunaWaitlistPage />);
    
    expect(screen.getByText('Join Buffr Host Waitlist')).toBeInTheDocument();
    expect(screen.getByText('Join the waitlist for Buffr Host - The complete hospitality management platform')).toBeInTheDocument();
  });

  it('displays compelling headline', () => {
    render(<EtunaWaitlistPage />);
    
    expect(screen.getByText('Transform Your Hospitality Business')).toBeInTheDocument();
    expect(screen.getByText('Join 500+ businesses already on the waitlist')).toBeInTheDocument();
  });

  it('shows value proposition features', () => {
    render(<EtunaWaitlistPage />);
    
    expect(screen.getByText('AI-Powered Automation')).toBeInTheDocument();
    expect(screen.getByText('Unified Management')).toBeInTheDocument();
    expect(screen.getByText('Advanced Analytics')).toBeInTheDocument();
    expect(screen.getByText('Seamless Integration')).toBeInTheDocument();
  });

  it('displays social proof statistics', () => {
    render(<EtunaWaitlistPage />);
    
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('Businesses on Waitlist')).toBeInTheDocument();
    expect(screen.getByText('N$2M+')).toBeInTheDocument();
    expect(screen.getByText('Revenue Generated')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('Efficiency Increase')).toBeInTheDocument();
  });

  it('shows platform capabilities', () => {
    render(<EtunaWaitlistPage />);
    
    expect(screen.getByText('Staff Management & HR')).toBeInTheDocument();
    expect(screen.getByText('Real CRM & Lead Funnel')).toBeInTheDocument();
    expect(screen.getByText('AI Receptionist & Booking Agent')).toBeInTheDocument();
    expect(screen.getByText('Marketing & Communications')).toBeInTheDocument();
    expect(screen.getByText('Automations & Workflows')).toBeInTheDocument();
  });

  it('displays waitlist form', () => {
    render(<EtunaWaitlistPage />);
    
    expect(screen.getByText('Join the Waitlist')).toBeInTheDocument();
    expect(screen.getByText('Business Name')).toBeInTheDocument();
    expect(screen.getByText('Contact Email')).toBeInTheDocument();
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Property Type')).toBeInTheDocument();
    expect(screen.getByText('Expected Launch Date')).toBeInTheDocument();
  });

  it('shows form submission button', () => {
    render(<EtunaWaitlistPage />);
    
    expect(screen.getByText('Join Waitlist')).toBeInTheDocument();
  });

  it('displays benefits section', () => {
    render(<EtunaWaitlistPage />);
    
    expect(screen.getByText('Why Join the Waitlist?')).toBeInTheDocument();
    expect(screen.getByText('Early Access')).toBeInTheDocument();
    expect(screen.getByText('Exclusive Pricing')).toBeInTheDocument();
    expect(screen.getByText('Priority Support')).toBeInTheDocument();
    expect(screen.getByText('Custom Onboarding')).toBeInTheDocument();
  });

  it('shows urgency messaging', () => {
    render(<EtunaWaitlistPage />);
    
    expect(screen.getByText('Limited Early Access')).toBeInTheDocument();
    expect(screen.getByText('Only 100 spots remaining for early access')).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(<EtunaWaitlistPage />);
    
    expect(screen.getByText('Questions? Contact us:')).toBeInTheDocument();
    expect(screen.getByText('hello@buffrhost.com')).toBeInTheDocument();
    expect(screen.getByText('+264 81 123 4567')).toBeInTheDocument();
  });

  it('shows platform features grid', () => {
    render(<EtunaWaitlistPage />);
    
    expect(screen.getByText('Complete Hospitality Ecosystem')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Seamless Integration')).toBeInTheDocument();
    expect(screen.getByText('Advanced Analytics')).toBeInTheDocument();
  });
});
