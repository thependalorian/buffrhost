"use client";
'use client';

import React, { useState } from 'react';
import { PageHeader, ActionButton } from '@/src/components/ui';
import { 
  Mail, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Shield,
  RefreshCw
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle successful password reset request
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle successful resend
      console.log('Resend email successful');
    } catch (error) {
      console.error('Resend error:', error);
      setError('Failed to resend email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Success State */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-success text-white">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-base-content">Check Your Email</h1>
            <p className="text-base-content/70 mt-2">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <div className="space-y-4">
                <div className="alert alert-info">
                  <Mail className="w-4 h-4" />
                  <span>
                    Please check your email and click the reset link to create a new password.
                  </span>
                </div>

                <div className="text-sm text-base-content/70">
                  <p className="mb-2">Didn&apos;t receive the email?</p>
                  <ul className="text-left space-y-1">
                    <li>• Check your spam/junk folder</li>
                    <li>• Make sure you entered the correct email address</li>
                    <li>• Wait a few minutes for the email to arrive</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <ActionButton
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Resending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend Email
                      </>
                    )}
                  </ActionButton>

                  <ActionButton
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail('');
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Try Different Email
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-base-content/70">
              <Shield className="w-4 h-4" />
              <span>Reset links expire after 24 hours for security</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-warning text-white">
              <Mail className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-base-content">Forgot Password?</h1>
          <p className="text-base-content/70 mt-2">
            No worries! Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {/* Reset Form */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {error && (
              <div className="alert alert-error mb-4">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <div className="input-group">
                  <span className="bg-base-200">
                    <Mail className="w-4 h-4 text-base-content/70" />
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="input input-bordered flex-1"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Sending reset link...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Back to Login */}
            <div className="text-center mt-6">
              <a href="/auth/login" className="link link-primary">
                <ArrowLeft className="w-4 h-4 inline mr-1" />
                Back to Sign In
              </a>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-base-content/70">
            <Shield className="w-4 h-4" />
            <span>We&apos;ll only send reset links to verified email addresses</span>
          </div>
        </div>
      </div>
    </div>
  );
}