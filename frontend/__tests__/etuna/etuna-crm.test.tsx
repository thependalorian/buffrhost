/**
 * Etuna CRM Tests
 * 
 * Comprehensive tests for the CRM and lead management functionality
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import EtunaCRMPage from '@/app/protected/etuna/crm/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/protected/etuna/crm',
}));

// Mock Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

describe('Etuna CRM & Lead Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders CRM title and description', () => {
    render(<EtunaCRMPage />);
    
    expect(screen.getByText('CRM & Lead Management')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive CRM and lead management for Etuna Guesthouse')).toBeInTheDocument();
  });

  it('displays CRM overview metrics', () => {
    render(<EtunaCRMPage />);
    
    expect(screen.getByText('Total Leads')).toBeInTheDocument();
    expect(screen.getByText('Hot Leads')).toBeInTheDocument();
    expect(screen.getByText('Warm Leads')).toBeInTheDocument();
    expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
  });

  it('shows lead information correctly', () => {
    render(<EtunaCRMPage />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('TravelCo')).toBeInTheDocument();
    expect(screen.getByText('john.doe@travelco.com')).toBeInTheDocument();
    expect(screen.getByText('+1234567890')).toBeInTheDocument();
  });

  it('displays lead status badges', () => {
    render(<EtunaCRMPage />);
    
    expect(screen.getByText('Hot')).toBeInTheDocument();
    expect(screen.getByText('Warm')).toBeInTheDocument();
    expect(screen.getByText('Cold')).toBeInTheDocument();
    expect(screen.getByText('Converted')).toBeInTheDocument();
  });

  it('shows lead stages', () => {
    render(<EtunaCRMPage />);
    
    expect(screen.getByText('Lead')).toBeInTheDocument();
    expect(screen.getByText('Contacted')).toBeInTheDocument();
    expect(screen.getByText('Qualified')).toBeInTheDocument();
    expect(screen.getByText('Proposal')).toBeInTheDocument();
    expect(screen.getByText('Negotiation')).toBeInTheDocument();
    expect(screen.getByText('Closed Won')).toBeInTheDocument();
    expect(screen.getByText('Closed Lost')).toBeInTheDocument();
  });

  it('displays lead sources', () => {
    render(<EtunaCRMPage />);
    
    expect(screen.getByText('Website')).toBeInTheDocument();
    expect(screen.getByText('Referral')).toBeInTheDocument();
    expect(screen.getByText('Social Media')).toBeInTheDocument();
  });

  it('shows lead values', () => {
    render(<EtunaCRMPage />);
    
    expect(screen.getByText('N$ 5,000')).toBeInTheDocument();
    expect(screen.getByText('N$ 3,500')).toBeInTheDocument();
    expect(screen.getByText('N$ 8,000')).toBeInTheDocument();
  });

  it('displays last contact dates', () => {
    render(<EtunaCRMPage />);
    
    expect(screen.getByText('2024-07-18')).toBeInTheDocument();
    expect(screen.getByText('2024-07-15')).toBeInTheDocument();
    expect(screen.getByText('2024-07-20')).toBeInTheDocument();
  });

  it('shows next actions', () => {
    render(<EtunaCRMPage />);
    
    expect(screen.getByText('Follow up on proposal')).toBeInTheDocument();
    expect(screen.getByText('Send pricing information')).toBeInTheDocument();
    expect(screen.getByText('Schedule demo call')).toBeInTheDocument();
  });

  it('renders CRM features section', () => {
    render(<EtunaCRMPage />);
    
    expect(screen.getByText('CRM Features')).toBeInTheDocument();
    expect(screen.getByText('Lead Scoring')).toBeInTheDocument();
    expect(screen.getByText('Pipeline Management')).toBeInTheDocument();
    expect(screen.getByText('Email Automation')).toBeInTheDocument();
    expect(screen.getByText('Analytics & Reporting')).toBeInTheDocument();
  });

  it('displays sales funnel visualization', () => {
    render(<EtunaCRMPage />);
    
    expect(screen.getByText('Sales Funnel')).toBeInTheDocument();
    expect(screen.getByText('Leads')).toBeInTheDocument();
    expect(screen.getByText('Contacted')).toBeInTheDocument();
    expect(screen.getByText('Qualified')).toBeInTheDocument();
    expect(screen.getByText('Proposal')).toBeInTheDocument();
    expect(screen.getByText('Closed Won')).toBeInTheDocument();
  });

  it('shows action buttons', () => {
    render(<EtunaCRMPage />);
    
    expect(screen.getByText('Add Lead')).toBeInTheDocument();
    expect(screen.getByText('Export Data')).toBeInTheDocument();
  });
});
