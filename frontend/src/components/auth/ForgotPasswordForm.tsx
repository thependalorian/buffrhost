/**
 * Forgot Password Form Component for BuffrHost
 * 
 * This component handles password reset requests with email verification.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/contexts/auth-context';
import { Loader2, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onBackToLogin?: () => void;
  className?: string;
}

export function ForgotPasswordForm({ 
  onSuccess, 
  onError, 
  onBackToLogin,
  className = ""
}: ForgotPasswordFormProps) {
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate email
      if (!email.trim()) {
        setError('Email is required');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Attempt password reset
      const result = await resetPassword(email);
      
      if (result.error) {
        const errorMessage = typeof result.error === 'string' ? result.error : 'Password reset failed';
        setError(errorMessage);
        onError?.(errorMessage);
      } else {
        setIsSubmitted(true);
        onSuccess?.();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    onBackToLogin?.();
  };

  if (isSubmitted) {
    return (
      <Card className={`w-full max-w-sm mx-auto sm:max-w-md ${className}`}>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-xl font-bold text-center sm:text-2xl">Check Your Email</CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            We've sent a password reset link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-600">
            <p>Please check your email and click the link to reset your password.</p>
            <p className="mt-2">If you don't see the email, check your spam folder.</p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setIsSubmitted(false);
              setEmail('');
            }}
          >
            Try Different Email
          </Button>
          
          {onBackToLogin && (
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={handleBackToLogin}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-sm mx-auto sm:max-w-md ${className}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold text-center sm:text-2xl">Forgot Password?</CardTitle>
        <CardDescription className="text-center text-sm sm:text-base">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Error Display */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {/* Reset Password Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>

          {/* Back to Login */}
          {onBackToLogin && (
            <Button 
              type="button"
              variant="ghost" 
              className="w-full"
              onClick={handleBackToLogin}
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}