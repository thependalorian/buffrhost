/**
 * Buffr Pay Payment Button Component
 *
 * A reusable payment button component that integrates with Buffr Payment Companion
 * Supports multiple payment methods and handles payment processing
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  Smartphone,
  Building,
  Wallet,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { processPayment } from "@/lib/services/buffr-pay";
import { BuffrPayTransaction } from "@/lib/types/hospitality";

// ============================================================================
// PAYMENT STATUS BADGE COMPONENT
// ============================================================================

interface PaymentStatusBadgeProps {
  status: string;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    pending: { color: "badge-warning", icon: Loader2 },
    processing: { color: "badge-info", icon: Loader2 },
    completed: { color: "badge-success", icon: CheckCircle },
    failed: { color: "badge-error", icon: X },
    cancelled: { color: "badge-neutral", icon: X },
    refunded: { color: "badge-secondary", icon: AlertCircle },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const IconComponent = config.icon;

  return (
    <span className={`badge ${config.color} flex items-center gap-1`}>
      <IconComponent className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ============================================================================
// BUFFR PAY BUTTON PROPS
// ============================================================================

interface BuffrPayButtonProps {
  amount: number;
  currency?: string;
  paymentType:
    | "restaurant"
    | "hotel"
    | "spa"
    | "conference"
    | "transportation"
    | "recreation"
    | "corporate";
  propertyId?: number;
  orderId?: string;
  reservationId?: string;
  bookingId?: string;
  corporateBookingId?: string;
  customerId?: string;
  userId?: string;
  onPaymentSuccess?: (transaction: BuffrPayTransaction) => void;
  onPaymentFailure?: (error: Error) => void;
  onPaymentComplete?: (transaction: BuffrPayTransaction) => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

// ============================================================================
// MAIN BUFFR PAY BUTTON COMPONENT
// ============================================================================

export const BuffrPayButton: React.FC<BuffrPayButtonProps> = ({
  amount,
  currency = "NAD",
  paymentType,
  propertyId,
  orderId,
  reservationId,
  bookingId,
  corporateBookingId,
  customerId,
  userId,
  onPaymentSuccess,
  onPaymentFailure,
  onPaymentComplete,
  className = "",
  disabled = false,
  children = "Pay with Buffr Pay",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [transaction, setTransaction] = useState<BuffrPayTransaction | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // PAYMENT PROCESSING
  // ============================================================================

  const handlePayment = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const transactionData: Partial<BuffrPayTransaction> = {
        amount,
        currency_code: currency,
        payment_type: paymentType,
        property_id: propertyId,
        order_id: orderId,
        reservation_id: reservationId,
        booking_id: bookingId,
        corporate_booking_id: corporateBookingId,
        customer_id: customerId,
        user_id: userId,
        payment_method: "card", // Default to card
        status: "pending",
        merchant_reference: `ETUNA-${Date.now()}`,
        metadata: {
          source: "buffr_host",
          property_name: "Etuna Guesthouse & Tours",
        },
      };

      const result = await processPayment(transactionData);
      setTransaction(result);

      if (result.status === "completed") {
        onPaymentSuccess?.(result);
      }

      onPaymentComplete?.(result);
    } catch (err: any) {
      const errorMessage = err.message || "Payment processing failed";
      setError(errorMessage);
      onPaymentFailure?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const formatAmount = () => {
    return new Intl.NumberFormat("en-NA", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Payment Amount Display */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-header">
          <div className="card-title flex items-center justify-between">
            <span>Payment Amount</span>
            <span className="text-2xl font-bold text-green-600">
              {formatAmount()}
            </span>
          </div>
        </div>
        <div className="card-body">
          <div className="text-sm text-base-content/70">
            Payment Type:{" "}
            <span className="badge badge-outline">{paymentType}</span>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <button
        className="btn btn-primary btn-lg w-full"
        onClick={handlePayment}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            {children}
          </>
        )}
      </button>

      {/* Transaction Status */}
      {transaction && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-header">
            <div className="card-title flex items-center justify-between">
              <span>Transaction Status</span>
              <PaymentStatusBadge status={transaction.status} />
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-base-content/70">Reference:</span>
                <span className="font-mono">
                  {transaction.buffr_pay_reference ||
                    transaction.transaction_id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/70">Amount:</span>
                <span className="font-semibold">{formatAmount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/70">Method:</span>
                <span className="capitalize">{transaction.payment_method}</span>
              </div>
              {transaction.completed_at && (
                <div className="flex justify-between">
                  <span className="text-base-content/70">Completed:</span>
                  <span>
                    {new Date(transaction.completed_at).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Payment Information */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Payment Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-base-content/70">Property:</span>
              <span>Etuna Guesthouse & Tours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/70">Payment Type:</span>
              <span className="capitalize">{paymentType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/70">Currency:</span>
              <span>{currency}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuffrPayButton;
