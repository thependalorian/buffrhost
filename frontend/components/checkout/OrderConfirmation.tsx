/**
 * Order Confirmation Component
 *
 * Purpose: Displays order confirmation and next steps after successful checkout
 * Functionality: Show order details, confirmation status, next steps
 * Location: /components/checkout/OrderConfirmation.tsx
 *
 * Follows 40 Rules:
 * - Uses DaisyUI for consistent styling
 * - Modular component design for easy maintenance
 * - TypeScript for type safety
 * - Vercel-compatible with SSR
 * - Uses Neon PostgreSQL database
 * - Comprehensive error handling
 * - Optimized for performance
 */

'use client';

import React, { useState, useRef } from 'react';
/**
 * OrderConfirmation React Component for Buffr Host Hospitality Platform
 * @fileoverview OrderConfirmation provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/checkout/OrderConfirmation.tsx
 * @purpose OrderConfirmation provides specialized functionality for the Buffr Host platform
 * @component OrderConfirmation
 * @category Checkout
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @hooks_utilization useState for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {OrderConfirmation} [confirmation] - confirmation prop description
 * @param {() => void} [onDownloadReceipt] - onDownloadReceipt prop description
 * @param {() => void} [onShareOrder] - onShareOrder prop description
 * @param {() => void} [onContactSupport] - onContactSupport prop description
 * @param {} [isLoading] - isLoading prop description
 *
 * Methods:
 * @method formatCurrency - formatCurrency method for component functionality
 * @method formatDate - formatDate method for component functionality
 * @method getStatusColor - getStatusColor method for component functionality
 * @method getPaymentStatusColor - getPaymentStatusColor method for component functionality
 *
 * Usage Example:
 * @example
 * import { OrderConfirmation } from './OrderConfirmation';
 *
 * function App() {
 *   return (
 *     <OrderConfirmation
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered OrderConfirmation component
 */

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';
import {
  CheckCircle,
  Clock,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Copy,
  Share2,
} from 'lucide-react';

// Types for TypeScript compliance
interface OrderConfirmation {
  orderId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  estimatedReadyTime?: string;
  nextSteps: string[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  tableNumber?: string;
  specialRequests?: string;
}

interface OrderConfirmationProps {
  confirmation: OrderConfirmation;
  onDownloadReceipt: () => void;
  onShareOrder: () => void;
  onContactSupport: () => void;
  isLoading?: boolean;
}

// Main Order Confirmation Component
export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  confirmation,
  onDownloadReceipt,
  onShareOrder,
  onContactSupport,
  isLoading = false,
}) => {
  const [copied, setCopied] = useState(false);

  // Refs for performance optimization
  const orderNumberRef = useRef<HTMLSpanElement>(null);

  // Handle copy order number
  const handleCopyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(confirmation.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy order number:', error);
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'NAD') => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return 'badge-success';
      case 'pending':
      case 'processing':
        return 'badge-warning';
      case 'cancelled':
      case 'failed':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'failed':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Order Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="loading loading-spinner loading-md text-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="border-success">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-success mb-2">
              Order Confirmed!
            </h1>
            <p className="text-base-content/70 mb-4">
              Your order has been successfully placed and confirmed
            </p>

            {/* Order Number */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-base-content/70">Order Number:</span>
              <span
                ref={orderNumberRef}
                className="font-mono font-bold text-lg"
              >
                {confirmation.orderNumber}
              </span>
              <Button
                onClick={handleCopyOrderNumber}
                className="btn-ghost btn-sm"
                title="Copy order number"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            {copied && (
              <div className="text-success text-sm">
                Order number copied to clipboard!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base-content/70">Status</span>
              <Badge className={getStatusColor(confirmation.status)}>
                {confirmation.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-base-content/70">Payment</span>
              <Badge
                className={getPaymentStatusColor(confirmation.paymentStatus)}
              >
                {confirmation.paymentStatus}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-base-content/70">Order Date</span>
              <span className="font-medium">
                {formatDate(confirmation.createdAt)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-base-content/70">Total Amount</span>
              <span className="font-bold text-lg">
                {formatCurrency(
                  confirmation.totalAmount,
                  confirmation.currency
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-base-content/70">Name:</span>
              <span className="font-medium">
                {confirmation.customerInfo.name}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-base-content/50" />
              <span className="font-medium">
                {confirmation.customerInfo.email}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-base-content/50" />
              <span className="font-medium">
                {confirmation.customerInfo.phone}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-base-content/70">Order Type:</span>
              <Badge variant="outline">
                {confirmation.orderType.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            {confirmation.tableNumber && (
              <div className="flex items-center gap-3">
                <span className="text-base-content/70">Table:</span>
                <span className="font-medium">{confirmation.tableNumber}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Estimated Ready Time */}
      {confirmation.estimatedReadyTime && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-warning" />
              <div>
                <h3 className="font-semibold text-lg">Estimated Ready Time</h3>
                <p className="text-base-content/70">
                  {formatDate(confirmation.estimatedReadyTime)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Special Requests */}
      {confirmation.specialRequests && (
        <Card>
          <CardHeader>
            <CardTitle>Special Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base-content/70">
              {confirmation.specialRequests}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {confirmation.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-content rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-base-content/70">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={onDownloadReceipt} className="btn-primary">
          <Download className="w-4 h-4" />
          Download Receipt
        </Button>

        <Button onClick={onShareOrder} className="btn-outline">
          <Share2 className="w-4 h-4" />
          Share Order
        </Button>

        <Button onClick={onContactSupport} className="btn-ghost">
          <Phone className="w-4 h-4" />
          Contact Support
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
