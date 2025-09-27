/**
 * Login Page for The Shandi Frontend
 * 
 * Authentication page with login form and social authentication options.
 */

'use client';

import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
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

  const handleLoginSuccess = () => {
    router.push('/dashboard');
  };

  const handleLoginError = (error: string) => {
    console.error('Login error:', error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-6 sm:max-w-md sm:space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Welcome to BuffrHost</h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Sign in to your account to manage your hospitality business
          </p>
        </div>

        <LoginForm
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
          showSocialAuth={true}
          showWhatsApp={true}
        />

        <div className="text-center space-y-2">
          <p className="text-xs text-gray-600 sm:text-sm">
            Don't have an account?{' '}
            <a
              href="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign up here
            </a>
          </p>
          <p>
            <a
              href="/forgot-password"
              className="text-xs text-gray-600 hover:text-gray-500 sm:text-sm"
            >
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}