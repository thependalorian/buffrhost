/**
 * Register Page for The Shandi Frontend
 * 
 * Registration page with signup form and social authentication options.
 */

'use client';

import React from 'react';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useAuth } from '@/lib/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  const handleSignUpSuccess = () => {
    router.push('/dashboard');
  };

  const handleSignUpError = (error: string) => {
    console.error('Sign up error:', error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Join BuffrHost</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to start managing your hospitality business
          </p>
        </div>

        <SignUpForm
          onSuccess={handleSignUpSuccess}
          onError={handleSignUpError}
          showSocialAuth={true}
        />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}