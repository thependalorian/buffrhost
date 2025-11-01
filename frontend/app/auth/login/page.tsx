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
import { BuffrLoginForm } from '@/components/auth/BuffrLoginForm';
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
      <div className="min-h-screen bg-nude-50 flex flex-col justify-center py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
        {/* Logo Section - Mobile Optimized */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 sm:mb-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img
              className="h-10 w-auto sm:h-12 md:h-16"
              src="/logo.svg"
              alt="Buffr Logo"
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-nude-900 truncate">
              Welcome Back
            </h1>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-nude-600 break-words px-2">
              Sign in to your Buffr account
            </p>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {/* Success Message - Responsive */}
          {successMessage && (
            <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 overflow-hidden">
              <div className="flex gap-2 sm:gap-3">
                <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm md:text-base font-medium text-green-800 truncate">
                    Success!
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-green-700 break-words">
                    {successMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message - Responsive */}
          {errorMessage && (
            <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 overflow-hidden">
              <div className="flex gap-2 sm:gap-3">
                <ExclamationTriangleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm md:text-base font-medium text-red-800 truncate">
                    Error
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-red-700 break-words">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form Card - Mobile Optimized */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 overflow-hidden">
            <BuffrLoginForm
              onSuccess={handleSuccess}
              onError={handleError}
              onSwitchToSignUp={handleSwitchToSignUp}
            />
          </div>

          {/* Additional Links - Responsive */}
          <div className="mt-4 sm:mt-6 text-center space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm text-nude-600 break-words px-2">
              <a
                href="/auth/forgot-password"
                className="font-medium text-nude-600 hover:text-nude-500 underline"
              >
                Forgot your password?
              </a>
            </p>
            <p className="text-xs sm:text-sm text-nude-600 break-words px-2">
              Need help?{' '}
              <a
                href="/support"
                className="font-medium text-nude-600 hover:text-nude-500 underline"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>

        {/* Footer - Responsive */}
        <div className="mt-6 sm:mt-8 text-center px-4">
          <p className="text-xs text-nude-500 break-words">
            Secure login powered by Buffr ID system
          </p>
        </div>
      </div>
    </BuffrAuthProvider>
  );
}
