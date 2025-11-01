'use client';
/**
 * User Registration Page
 *
 * Complete registration page with Buffr ID integration
 * Features: Multi-step form, project selection, cross-project setup
 * Location: app/auth/register/page.tsx
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BuffrSignUpForm } from '@/components/auth/BuffrSignUpForm';
import { BuffrAuthProvider } from '@/components/auth/BuffrAuthProvider';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSuccess = (buffrId: string) => {
    setSuccessMessage(`Registration successful! Your Buffr ID is: ${buffrId}`);
    setErrorMessage('');

    // Redirect to dashboard after 3 seconds
    setTimeout(() => {
      router.push('/property-dashboard');
    }, 3000);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setSuccessMessage('');
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
              Join Buffr
            </h1>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-nude-600 break-words px-2">
              Create your account and access the entire Buffr ecosystem
            </p>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
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

          {/* Registration Form Card - Mobile Optimized */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 overflow-hidden">
            <BuffrSignUpForm onSuccess={handleSuccess} onError={handleError} />
          </div>

          {/* Additional Information - Responsive */}
          <div className="mt-6 sm:mt-8 text-center px-2">
            <p className="text-xs sm:text-sm text-nude-600 break-words">
              Already have an account?{' '}
              <a
                href="/auth/login"
                className="font-medium text-nude-600 hover:text-nude-500 underline"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>

        {/* Footer - Responsive */}
        <div className="mt-6 sm:mt-8 text-center px-4">
          <p className="text-xs text-nude-500 break-words leading-relaxed">
            By creating an account, you agree to our{' '}
            <a
              href="/terms"
              className="text-nude-600 hover:text-nude-500 underline"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              className="text-indigo-600 hover:text-indigo-500 underline"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </BuffrAuthProvider>
  );
}
