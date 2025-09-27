/**
 * Etuna Staff Management Tests
 * 
 * Comprehensive tests for the staff management functionality
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import EtunaStaffPage from '@/app/protected/etuna/staff/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/protected/etuna/staff',
}));

// Mock Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

describe('Etuna Staff Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders staff management title and description', () => {
    render(<EtunaStaffPage />);
    
    expect(screen.getByText('Staff Management')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive staff and HR management for Etuna Guesthouse')).toBeInTheDocument();
  });

  it('displays staff overview metrics', () => {
    render(<EtunaStaffPage />);
    
    expect(screen.getByText('Total Staff')).toBeInTheDocument();
    expect(screen.getByText('Active Employees')).toBeInTheDocument();
    expect(screen.getByText('On Leave')).toBeInTheDocument();
    expect(screen.getByText('Average Rating')).toBeInTheDocument();
  });

  it('shows staff members with correct information', () => {
    render(<EtunaStaffPage />);
    
    expect(screen.getByText('Maria Nangolo')).toBeInTheDocument();
    expect(screen.getByText('General Manager')).toBeInTheDocument();
    expect(screen.getByText('Management')).toBeInTheDocument();
    expect(screen.getByText('maria.nangolo@etuna.com')).toBeInTheDocument();
  });

  it('displays staff status badges correctly', () => {
    render(<EtunaStaffPage />);
    
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('On Leave')).toBeInTheDocument();
  });

  it('shows department information', () => {
    render(<EtunaStaffPage />);
    
    expect(screen.getByText('Management')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Housekeeping')).toBeInTheDocument();
    expect(screen.getByText('Front Desk')).toBeInTheDocument();
  });

  it('displays performance ratings', () => {
    render(<EtunaStaffPage />);
    
    // Check for performance rating displays
    expect(screen.getByText('5')).toBeInTheDocument(); // Maria's rating
    expect(screen.getByText('4')).toBeInTheDocument(); // David's rating
  });

  it('shows staff contact information', () => {
    render(<EtunaStaffPage />);
    
    expect(screen.getByText('+264 81 123 4567')).toBeInTheDocument();
    expect(screen.getByText('+264 81 234 5678')).toBeInTheDocument();
  });

  it('displays hire dates', () => {
    render(<EtunaStaffPage />);
    
    expect(screen.getByText('2020-01-15')).toBeInTheDocument();
    expect(screen.getByText('2021-03-01')).toBeInTheDocument();
  });

  it('shows salary information', () => {
    render(<EtunaStaffPage />);
    
    expect(screen.getByText('N$ 35,000')).toBeInTheDocument();
    expect(screen.getByText('N$ 28,000')).toBeInTheDocument();
  });

  it('renders action buttons for staff management', () => {
    render(<EtunaStaffPage />);
    
    expect(screen.getByText('Add Employee')).toBeInTheDocument();
    expect(screen.getByText('Export Data')).toBeInTheDocument();
  });

  it('displays HR features section', () => {
    render(<EtunaStaffPage />);
    
    expect(screen.getByText('HR Features')).toBeInTheDocument();
    expect(screen.getByText('Employee Onboarding')).toBeInTheDocument();
    expect(screen.getByText('Performance Tracking')).toBeInTheDocument();
    expect(screen.getByText('Payroll Management')).toBeInTheDocument();
    expect(screen.getByText('Leave Management')).toBeInTheDocument();
  });
});
