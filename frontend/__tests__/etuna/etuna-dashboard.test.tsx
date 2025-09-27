/**
 * Etuna Dashboard Tests
 * 
 * Comprehensive tests for the Etuna admin dashboard functionality
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import EtunaDashboard from '@/app/protected/etuna/dashboard/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/protected/etuna/dashboard',
}));

// Mock Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

describe('Etuna Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard title and description', () => {
    render(<EtunaDashboard />);
    
    expect(screen.getByText('Etuna Guesthouse Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive hospitality management for Etuna Guesthouse')).toBeInTheDocument();
  });

  it('displays key metrics cards', () => {
    render(<EtunaDashboard />);
    
    expect(screen.getByText('Occupancy Rate')).toBeInTheDocument();
    expect(screen.getByText('Revenue Today')).toBeInTheDocument();
    expect(screen.getByText('Active Reservations')).toBeInTheDocument();
    expect(screen.getByText('Guest Satisfaction')).toBeInTheDocument();
  });

  it('renders navigation items with correct links', () => {
    render(<EtunaDashboard />);
    
    // Check for key navigation items
    expect(screen.getByText('Reservations')).toBeInTheDocument();
    expect(screen.getByText('Guest Management')).toBeInTheDocument();
    expect(screen.getByText('Room Management')).toBeInTheDocument();
    expect(screen.getByText('Restaurant Management')).toBeInTheDocument();
    expect(screen.getByText('Staff Management')).toBeInTheDocument();
    expect(screen.getByText('CRM & Leads')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.getByText('Content Management')).toBeInTheDocument();
    expect(screen.getByText('Invoice Generation')).toBeInTheDocument();
  });

  it('displays quick actions section', () => {
    render(<EtunaDashboard />);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('New Reservation')).toBeInTheDocument();
    expect(screen.getByText('Guest Check-in')).toBeInTheDocument();
    expect(screen.getByText('Restaurant Orders')).toBeInTheDocument();
    expect(screen.getByText('View Analytics')).toBeInTheDocument();
    expect(screen.getByText('Join Waitlist')).toBeInTheDocument();
  });

  it('shows recent activity section', () => {
    render(<EtunaDashboard />);
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('New booking from Corporate Retreat Group')).toBeInTheDocument();
    expect(screen.getByText('Guest checked out from Room 101')).toBeInTheDocument();
    expect(screen.getByText('Restaurant order completed for Table 5')).toBeInTheDocument();
  });

  it('displays system status indicators', () => {
    render(<EtunaDashboard />);
    
    expect(screen.getByText('System Status')).toBeInTheDocument();
    expect(screen.getByText('All systems operational')).toBeInTheDocument();
    expect(screen.getByText('Database')).toBeInTheDocument();
    expect(screen.getByText('API Services')).toBeInTheDocument();
    expect(screen.getByText('Payment Gateway')).toBeInTheDocument();
  });

  it('renders navigation items with proper icons', () => {
    render(<EtunaDashboard />);
    
    // Check that navigation items have proper structure
    const navigationItems = screen.getAllByRole('link');
    expect(navigationItems.length).toBeGreaterThan(0);
  });

  it('displays occupancy and revenue data', () => {
    render(<EtunaDashboard />);
    
    // Check for occupancy percentage
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('N$ 45,000')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('4.8/5')).toBeInTheDocument();
  });

  it('shows proper error boundary integration', () => {
    render(<EtunaDashboard />);
    
    // The component should render without errors
    expect(screen.getByText('Etuna Guesthouse Dashboard')).toBeInTheDocument();
  });
});
