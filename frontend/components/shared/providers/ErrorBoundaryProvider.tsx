/**
 * Error Boundary Provider for Buffr Host Hospitality Platform
 *
 * Client-side error boundary wrapper for Next.js App Router compatibility
 * Location: components/providers/ErrorBoundaryProvider.tsx
 * Purpose: Provide global error boundary functionality in Next.js 13+ App Router
 * Modularity: Provider component for consistent error handling across the application
 * Scalability: Centralized error boundary management with provider pattern
 * Performance: Client-side only rendering for optimal performance
 * Monitoring: Integrated error reporting and logging capabilities
 * Security: Safe error handling without exposing sensitive information
 * Multi-tenant: Tenant-aware error context and reporting
 *
 * Error Boundary Provider Capabilities:
 * - Global error catching for React components
 * - Next.js App Router compatibility with client components
 * - Automatic error recovery and retry mechanisms
 * - Development vs production error display modes
 * - Error monitoring service integration
 * - Graceful error degradation
 *
 * Key Features:
 * - Client component wrapper for App Router
 * - Automatic error state management
 * - User-friendly error displays
 * - Error reporting and analytics
 * - Retry and recovery options
 * - Development debugging support
 *
 * @module ErrorBoundaryProvider
 * @author Buffr Host Development Team
 * @version 1.0.0
 * @since 2025-01-01
 */

'use client';

import React, { ReactNode } from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';

/**
 * Error Boundary Provider Props Interface
 *
 * Defines the props accepted by the ErrorBoundaryProvider component
 *
 * @interface ErrorBoundaryProviderProps
 * @property {ReactNode} children - Child components to be wrapped by error boundary
 * @property {ReactNode} [fallback] - Custom fallback UI to display on error
 * @property {(error: Error, errorInfo: React.ErrorInfo) => void} [onError] - Callback for error handling
 * @property {boolean} [showRetry] - Whether to show retry button (default: true)
 * @property {string} [className] - Additional CSS classes for styling
 */
interface ErrorBoundaryProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showRetry?: boolean;
  className?: string;
}

/**
 * Error Boundary Provider Component
 *
 * Provides global error boundary functionality for Next.js App Router applications
 * Wraps the entire application to catch and handle React errors gracefully
 *
 * @component ErrorBoundaryProvider
 * @param {ErrorBoundaryProviderProps} props - Component props
 * @returns {JSX.Element} Error boundary wrapped children
 *
 * @example
 * ```tsx
 * // In layout.tsx or root component
 * <ErrorBoundaryProvider>
 *   <App />
 * </ErrorBoundaryProvider>
 *
 * // With custom error handling
 * <ErrorBoundaryProvider
 *   onError={(error, errorInfo) => {
 *     // Custom error reporting
 *     reportError(error, errorInfo);
 *   }}
 *   fallback={<CustomErrorPage />}
 * >
 *   <App />
 * </ErrorBoundaryProvider>
 * ```
 */
const ErrorBoundaryProvider: React.FC<ErrorBoundaryProviderProps> = ({
  children,
  fallback,
  onError,
  showRetry = true,
  className,
}) => {
  return (
    <ErrorBoundary
      fallback={fallback}
      onError={onError}
      showRetry={showRetry}
      className={className}
    >
      {children}
    </ErrorBoundary>
  );
};

export { ErrorBoundaryProvider };
export type { ErrorBoundaryProviderProps };
