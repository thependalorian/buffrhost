'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ErrorDetails {
  error_code: string;
  error_message: string;
  bank_error_code: string;
  bank_error_message: string;
  merchant_reference: string;
}

export default function PaymentFailedPage() {
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get error details from URL params
    const errorCode = searchParams.get('error_code');
    const errorMessage = searchParams.get('error_message');
    const merchantRef = searchParams.get('merchant_reference');
    
    if (errorCode || errorMessage || merchantRef) {
      setErrorDetails({
        error_code: errorCode || '',
        error_message: errorMessage || 'Payment failed',
        bank_error_code: searchParams.get('bank_error_code') || '',
        bank_error_message: searchParams.get('bank_error_message') || '',
        merchant_reference: merchantRef || ''
      });
    }
    
    setLoading(false);
  }, [searchParams]);

  const handleRetryPayment = () => {
    // Redirect back to payment page
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading error details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        {/* Error Icon */}
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
          <p className="text-gray-600 mt-2">We were unable to process your payment.</p>
        </div>

        {/* Error Details */}
        {errorDetails && (
          <div className="error-details bg-red-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-900 mb-3">Error Details</h3>
            <div className="space-y-2 text-sm">
              {errorDetails.merchant_reference && (
                <div className="flex justify-between">
                  <span className="text-red-600">Order Reference:</span>
                  <span className="font-medium">{errorDetails.merchant_reference}</span>
                </div>
              )}
              {errorDetails.error_code && (
                <div className="flex justify-between">
                  <span className="text-red-600">Error Code:</span>
                  <span className="font-mono text-xs">{errorDetails.error_code}</span>
                </div>
              )}
              {errorDetails.error_message && (
                <div className="flex justify-between">
                  <span className="text-red-600">Error Message:</span>
                  <span className="font-medium text-right">{errorDetails.error_message}</span>
                </div>
              )}
              {errorDetails.bank_error_code && (
                <div className="flex justify-between">
                  <span className="text-red-600">Bank Error Code:</span>
                  <span className="font-mono text-xs">{errorDetails.bank_error_code}</span>
                </div>
              )}
              {errorDetails.bank_error_message && (
                <div className="flex justify-between">
                  <span className="text-red-600">Bank Error:</span>
                  <span className="font-medium text-right">{errorDetails.bank_error_message}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Common Solutions */}
        <div className="solutions bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">Common Solutions</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Check that your card details are correct</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Ensure you have sufficient funds available</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Try using a different payment method</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Contact your bank if the issue persists</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleRetryPayment}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
          
          <Link
            href="/contact"
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Support
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            If you continue to experience issues, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}