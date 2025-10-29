'use client';
/**
 * User Login Page
 *
 * Complete login page with cross-project authentication support
 * Features: Multiple login methods, project selection, Buffr ID integration
 * Location: app/auth/login/page.tsx
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BuffrLoginForm from '@/components/auth/BuffrLoginForm';
import { BuffrAuthProvider } from '@/components/auth/BuffrAuthProvider';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSuccess = (identifier: string) => {
    setSuccessMessage(`Welcome back! Logged in as ${identifier}`);
    setErrorMessage('');

    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push('/property-dashboard');
    }, 2000);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setSuccessMessage('');
  };

  const handleSwitchToSignUp = () => {
    setShowSignUp(true);
    router.push('/auth/register');
  };

  return (
    <BuffrAuthProvider>
      <div className="min-h-screen bg-nude-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-nude-900">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-nude-600">
              Sign in to your Buffr account
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Success!
                  </h3>
                  <p className="mt-1 text-sm text-green-700">
                    {successMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <BuffrLoginForm
            onSuccess={handleSuccess}
            onError={handleError}
            onSwitchToSignUp={handleSwitchToSignUp}
          />

          {/* Additional Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-nude-600">
              <a
                href="/auth/forgot-password"
                className="font-medium text-nude-600 hover:text-nude-500"
              >
                Forgot your password?
              </a>
            </p>
            <p className="text-sm text-nude-600">
              Need help?{' '}
              <a
                href="/support"
                className="font-medium text-nude-600 hover:text-nude-500"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-nude-500">
            Secure login powered by Buffr ID system
          </p>
        </div>
      </div>
    </BuffrAuthProvider>
  );
}
