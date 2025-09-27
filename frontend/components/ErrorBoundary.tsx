'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

/**
 * Error Boundary Component for Etuna Dashboard
 * 
 * This component catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * Location: /components/ErrorBoundary.tsx
 * Usage: Wrap any component that might throw errors
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // In production, you might want to send this to an error reporting service
    // Example: errorReportingService.captureException(error, { extra: errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
          <div className="card bg-base-100 shadow-xl max-w-md w-full">
            <div className="card-body text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="w-16 h-16 text-error" />
              </div>
              
              <h2 className="card-title justify-center text-xl mb-2">
                Something went wrong
              </h2>
              
              <p className="text-base-content/70 mb-6">
                We encountered an unexpected error while loading the dashboard.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="alert alert-error mb-4">
                  <div className="text-left">
                    <div className="font-bold">Error Details:</div>
                    <div className="text-sm font-mono break-all">
                      {this.state.error.message}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="card-actions justify-center">
                <button 
                  onClick={this.resetError}
                  className="btn btn-primary"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
                
                <button 
                  onClick={() => window.location.href = '/guest/etuna'}
                  className="btn btn-outline"
                >
                  Back to Etuna
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Custom Error Fallback Component for Dashboard
 * 
 * Provides a more specific error UI for dashboard-related errors
 */
export function DashboardErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl max-w-lg w-full">
        <div className="card-body text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-20 h-20 text-warning" />
          </div>
          
          <h2 className="card-title justify-center text-2xl mb-4">
            Dashboard Error
          </h2>
          
          <p className="text-base-content/70 mb-6">
            We&apos;re having trouble loading your dashboard. This might be due to a temporary issue with our servers.
          </p>
          
          <div className="space-y-4">
            <div className="alert alert-info">
              <div className="text-left">
                <div className="font-bold">What you can try:</div>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Refresh the page</li>
                  <li>• Check your internet connection</li>
                  <li>• Try again in a few minutes</li>
                </ul>
              </div>
            </div>
            
            {process.env.NODE_ENV === 'development' && error && (
              <div className="alert alert-error">
                <div className="text-left">
                  <div className="font-bold">Development Error:</div>
                  <div className="text-sm font-mono break-all mt-1">
                    {error.message}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="card-actions justify-center mt-6">
            <button 
              onClick={resetError}
              className="btn btn-primary btn-lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Reload Dashboard
            </button>
            
            <button 
              onClick={() => window.location.href = '/guest/etuna'}
              className="btn btn-outline btn-lg"
            >
              Back to Etuna Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
