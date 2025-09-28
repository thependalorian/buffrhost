"use client";

import { useEffect, useState } from "react";
import {
  XCircleIcon,
  ArrowRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const transactionId = searchParams?.get("transaction_id");
        const orderId = searchParams?.get("order_id");

        if (transactionId) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/payments/status/${transactionId}`,
          );
          if (response.ok) {
            const data = await response.json();
            setPaymentData(data);
          }
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Checking payment status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-sand-900/20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/20">
            <XCircleIcon className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Payment Failed
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We were unable to process your payment. Please try again.
          </p>
        </div>

        {paymentData && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Payment Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Transaction ID:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {paymentData.transaction_id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Amount:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  N${paymentData.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <span className="badge badge-error">Failed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Error:</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  {paymentData.error_message || "Payment declined"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Common reasons for payment failure:
          </h4>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• Insufficient funds</li>
            <li>• Incorrect card details</li>
            <li>• Card expired or blocked</li>
            <li>• Network connectivity issues</li>
          </ul>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => (window.location.href = "/dashboard/orders")}
            className="btn btn-primary w-full"
          >
            Try Again
            <ArrowPathIcon className="w-5 h-5 ml-2" />
          </button>

          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="btn btn-outline w-full"
          >
            Go to Dashboard
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@mail.buffr.ai"
              className="text-primary hover:underline"
            >
              support@mail.buffr.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
