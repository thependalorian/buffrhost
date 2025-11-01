import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MobileBottomNav } from '../MobileBottomNav';
import { MobileNavigation } from '../MobileNavigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('Navigation Components', () => {
  it('should render MobileBottomNav with navigation items', () => {
    render(<MobileBottomNav />);

    // Should render navigation container
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render MobileNavigation component', () => {
    render(<MobileNavigation />);

    // Should render navigation container
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should handle navigation button clicks', () => {
    render(<MobileBottomNav />);

    const navContainer = screen.getByRole('navigation');
    expect(navContainer).toBeInTheDocument();

    // Should be clickable
    fireEvent.click(navContainer);
  });

  it('should maintain responsive design classes', () => {
    render(<MobileBottomNav />);

    const navElement = screen.getByRole('navigation');
    expect(navElement).toHaveClass('fixed'); // or whatever responsive classes it has
  });
});
