/**
 * Adumo Virtual Payment Component
 * Complete frontend integration for Adumo payments
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdumoPaymentProps {
  orderId: string;
  amount: number;
  currency?: string;
  customerDetails?: {
    name: string;
    email: string;
    phone?: string;
  };
  orderDetails?: {
    description: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const AdumoPayment: React.FC<AdumoPaymentProps> = ({
  orderId,
  amount,
  currency = 'ZAR',
  customerDetails,
  orderDetails,
  onSuccess,
  onError,
  className = ''
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientIP, setClientIP] = useState<string>('127.0.0.1');
  const router = useRouter();

  useEffect(() => {
    // Get client IP for fraud prevention
    getClientIP();
  }, []);

  const getClientIP = async (): Promise<void> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setClientIP(data.ip);
    } catch (error) {
      console.warn('Failed to get client IP:', error);
      setClientIP('127.0.0.1');
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Initialize payment
      const response = await fetch('/api/v1/payments/adumo/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          merchant_reference: orderId,
          amount: amount,
          currency_code: currency,
          redirect_success_url: `${window.location.origin}/payment/success`,
          redirect_failed_url: `${window.location.origin}/payment/failed`,
          order_details: orderDetails,
          customer_details: customerDetails,
          fraud_prevention: {
            ip_address: clientIP,
            country_code: 'ZA',
            uci: customerDetails?.email || orderId
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to initialize payment');
      }

      const data = await response.json();
      
      if (data.success) {
        // Redirect to Adumo payment page
        const params = new URLSearchParams({
          merchant_reference: orderId,
          amount: amount.toString(),
          currency_code: currency,
          redirect_success_url: `${window.location.origin}/payment/success`,
          redirect_failed_url: `${window.location.origin}/payment/failed`
        });
        
        window.location.href = `/api/v1/payments/adumo/payment-form?${params.toString()}`;
      } else {
        throw new Error(data.message || 'Payment initialization failed');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`adumo-payment bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Payment Summary */}
      <div className="payment-summary mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
        <div className="order-details space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-lg">{currency} {amount.toFixed(2)}</span>
          </div>
          
          {orderDetails && (
            <div className="items mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
              <div className="space-y-1">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{currency} {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Button */}
      <div className="payment-actions mb-6">
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Pay {currency} {amount.toFixed(2)}
            </>
          )}
        </button>
      </div>

      {/* Payment Info */}
      <div className="payment-info text-center">
        <p className="text-sm text-gray-600 mb-3">
          You will be redirected to Adumo's secure payment page.
        </p>
        <div className="security-badges flex justify-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure Payment
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            PCI Compliant
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            3D Secure
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdumoPayment;