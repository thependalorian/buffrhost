/**
 * ErrorBoundary Component Tests
 *
 * Comprehensive test suite for the ErrorBoundary component to ensure
 * proper error handling, fallback UI rendering, and user recovery flows.
 *
 * Location: components/ui/__tests__/ErrorBoundary.test.tsx
 * Purpose: Validate error boundary functionality and error recovery
 * Coverage: Error catching, fallback rendering, recovery mechanisms
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../ErrorBoundary';
import { BuffrIcon } from '../../icons/BuffrIcons';

// Mock BuffrIcon component
jest.mock('../../icons/BuffrIcons', () => ({
  BuffrIcon: ({ name, className }: { name: string; className?: string }) => (
    <span data-testid={`buffr-icon-${name}`} className={className}>
      Icon: {name}
    </span>
  ),
}));

// Component that throws an error for testing
const ErrorThrowingComponent = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Safe component</div>;
};

// Component that throws an error in useEffect
const AsyncErrorComponent = () => {
  React.useEffect(() => {
    throw new Error('Async error');
  }, []);
  return <div>Async component</div>;
};

describe('ErrorBoundary', () => {
  const originalError = console.error;
  let mockOnError: jest.Mock;

  beforeEach(() => {
    // Mock console.error to avoid test output pollution
    console.error = jest.fn();
    mockOnError = jest.fn();
  });

  afterEach(() => {
    console.error = originalError;
    jest.clearAllMocks();
  });

  describe('Error Catching', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should catch and display fallback UI when child component throws', () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('We apologize for the inconvenience. An unexpected error has occurred.')).toBeInTheDocument();
    });

    it('should call onError callback when error occurs', () => {
      const mockError = new Error('Test error');
      const mockErrorInfo = { componentStack: 'Test stack' };

      render(
        <ErrorBoundary onError={mockOnError}>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );

      expect(mockOnError).toHaveBeenCalledWith(mockError, mockErrorInfo);
    });

    it('should log error to console', () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );

      expect(console.error).toHaveBeenCalledWith(
        '[BuffrIcon name="alert"] ErrorBoundary caught an error:',
        expect.any(Error)
      );
    });
  });

  describe('Fallback UI', () => {
    it('should render custom fallback when provided', () => {
      const customFallback = <div>Custom error message</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });

    it('should display error details in development mode', () => {
      // Mock process.env.NODE_ENV
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary showDetails={true}>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Error Details \(Development\)/)).toBeInTheDocument();

      // Restore original env
      process.env.NODE_ENV = originalEnv;
    });

    it('should render BuffrIcon in error UI', () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('buffr-icon-alert')).toBeInTheDocument();
    });
  });

  describe('Recovery Mechanisms', () => {
    it('should allow retry when Try Again button is clicked', async () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Initially shows error
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Click retry button
      fireEvent.click(screen.getByRole('button', { name: /try again/i }));

      // Rerender with component that doesn't throw
      rerender(
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      // Should now show safe component
      await waitFor(() => {
        expect(screen.getByText('Safe component')).toBeInTheDocument();
      });
    });

    it('should provide reload functionality', () => {
      // Mock window.location.reload
      const mockReload = jest.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload },
        writable: true,
      });

      render(
        <ErrorBoundary>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByRole('button', { name: /reload page/i }));
      expect(mockReload).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on interactive elements', () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );

      expect(screen.getByRole('button', { name: /try again/i })).toHaveAttribute('aria-label', 'Try again');
      expect(screen.getByRole('button', { name: /reload page/i })).toHaveAttribute('aria-label', 'Reload page');
    });

    it('should have accessible error message', () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );

      const errorHeading = screen.getByRole('heading', { name: /something went wrong/i });
      expect(errorHeading).toBeInTheDocument();
    });
  });

  describe('Error Information', () => {
    it('should display generic error message by default', () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText(/we apologize for the inconvenience/i)).toBeInTheDocument();
    });

    it('should show support contact information', () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      );

      const supportLink = screen.getByRole('link', { name: /contact support/i });
      expect(supportLink).toHaveAttribute('href', 'mailto:support@buffrhost.com');
    });
  });

  describe('Async Errors', () => {
    it('should handle errors thrown in useEffect', () => {
      render(
        <ErrorBoundary>
          <AsyncErrorComponent />
        </ErrorBoundary>
      );

      // Error should be caught and displayed
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });
});
