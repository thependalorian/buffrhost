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
import BuffrSignUpForm from '@/components/auth/BuffrSignUpForm';
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
      <div className="min-h-screen bg-nude-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-nude-900">
              Join Buffr
            </h1>
            <p className="mt-2 text-sm text-nude-600">
              Create your account and access the entire Buffr ecosystem
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
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

          {/* Registration Form */}
          <BuffrSignUpForm onSuccess={handleSuccess} onError={handleError} />

          {/* Additional Information */}
          <div className="mt-8 text-center">
            <p className="text-sm text-nude-600">
              Already have an account?{' '}
              <a
                href="/auth/login"
                className="font-medium text-nude-600 hover:text-nude-500"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-nude-500">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="text-nude-600 hover:text-nude-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </BuffrAuthProvider>
  );
}
