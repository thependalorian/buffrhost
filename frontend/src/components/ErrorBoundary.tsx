/**
 * Error Boundary Component for The Shandi Platform
 * 
 * Provides error handling and fallback UI for React components
 * Includes dashboard-specific error fallback for admin interfaces
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  ArrowLeft,
  Bug,
  Shield,
  MessageCircle
} from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you might want to log to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <DefaultErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

// Default Error Fallback Component
interface DefaultErrorFallbackProps {
  error?: Error;
  onRetry: () => void;
}

export function DefaultErrorFallback({ error, onRetry }: DefaultErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="w-16 h-16 bg-error text-error-content rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h2 className="card-title justify-center text-xl mb-2">
              Something went wrong
            </h2>
            
            <p className="text-base-content/70 mb-6">
              We encountered an unexpected error. Please try again or contact support if the problem persists.
            </p>

            {process.env.NODE_ENV === 'development' && error && (
              <div className="alert alert-warning mb-4">
                <Bug className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-semibold">Development Error:</div>
                  <div className="text-sm font-mono">{error.message}</div>
                </div>
              </div>
            )}

            <div className="card-actions justify-center space-x-2">
              <button 
                onClick={onRetry}
                className="btn btn-primary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="btn btn-outline"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard-specific Error Fallback
export function DashboardErrorFallback({ error, onRetry }: DefaultErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="w-20 h-20 bg-warning text-warning-content rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10" />
            </div>
            
            <h2 className="card-title justify-center text-2xl mb-4">
              Dashboard Error
            </h2>
            
            <p className="text-base-content/70 mb-6">
              There was an issue loading the dashboard. This might be due to a temporary service interruption or data loading problem.
            </p>

            <div className="alert alert-info mb-6">
              <MessageCircle className="w-4 h-4" />
              <div className="text-left">
                <div className="font-semibold">What you can do:</div>
                <ul className="text-sm mt-1 space-y-1">
                  <li>• Check your internet connection</li>
                  <li>• Try refreshing the page</li>
                  <li>• Contact support if the issue persists</li>
                </ul>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && error && (
              <div className="alert alert-warning mb-6">
                <Bug className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-semibold">Development Error:</div>
                  <div className="text-sm font-mono break-all">{error.message}</div>
                </div>
              </div>
            )}

            <div className="card-actions justify-center space-x-3">
              <button 
                onClick={onRetry}
                className="btn btn-primary btn-lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Reload Dashboard
              </button>
              
              <button 
                onClick={() => window.location.href = '/admin'}
                className="btn btn-outline btn-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// API Error Fallback
export function APIErrorFallback({ error, onRetry }: DefaultErrorFallbackProps) {
  return (
    <div className="alert alert-error">
      <AlertTriangle className="w-4 h-4" />
      <div className="flex-1">
        <div className="font-semibold">API Error</div>
        <div className="text-sm">
          {error?.message || 'Failed to load data from server'}
        </div>
      </div>
      <button 
        onClick={onRetry}
        className="btn btn-sm btn-outline"
      >
        <RefreshCw className="w-3 h-3 mr-1" />
        Retry
      </button>
    </div>
  );
}

// Network Error Fallback
export function NetworkErrorFallback({ error, onRetry }: DefaultErrorFallbackProps) {
  return (
    <div className="alert alert-warning">
      <AlertTriangle className="w-4 h-4" />
      <div className="flex-1">
        <div className="font-semibold">Network Error</div>
        <div className="text-sm">
          Please check your internet connection and try again
        </div>
      </div>
      <button 
        onClick={onRetry}
        className="btn btn-sm btn-outline"
      >
        <RefreshCw className="w-3 h-3 mr-1" />
        Retry
      </button>
    </div>
  );
}

// Loading Error Fallback
export function LoadingErrorFallback({ error, onRetry }: DefaultErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-12 h-12 bg-error text-error-content rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="font-semibold mb-2">Failed to Load</h3>
        <p className="text-sm text-base-content/70 mb-4">
          {error?.message || 'Unable to load data'}
        </p>
        <button 
          onClick={onRetry}
          className="btn btn-sm btn-primary"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Try Again
        </button>
      </div>
    </div>
  );
}

// Export all error fallback components
export {
  DefaultErrorFallback,
  DashboardErrorFallback,
  APIErrorFallback,
  NetworkErrorFallback,
  LoadingErrorFallback,
};

// Higher-order component for error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Hook for error handling
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  React.useEffect(() => {
    if (error) {
      // Log error to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error caught by useErrorHandler:', error);
      }
    }
  }, [error]);

  return { error, handleError, clearError };
}

export default ErrorBoundary;