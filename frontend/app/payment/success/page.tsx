'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const transactionId = searchParams?.get('transaction_id');
        const orderId = searchParams?.get('order_id');
        
        if (transactionId) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/status/${transactionId}`);
          if (response.ok) {
            const data = await response.json();
            setPaymentData(data);
          }
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand-50 dark:bg-sand-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-sand-900/20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircleIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your payment has been processed successfully.
          </p>
        </div>

        {paymentData && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Payment Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {paymentData.transaction_id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  N${paymentData.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="badge badge-success">Completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(paymentData.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="btn btn-primary w-full"
          >
            Go to Dashboard
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="btn btn-outline w-full"
          >
            Return to Home
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
}
