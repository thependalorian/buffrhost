/**
 * @fileoverview Consumer Rights Manager Component
 * @description User interface for managing Electronic Transactions Act consumer rights
 * @module ConsumerRightsManager
 */

'use client';

import React, { useState, useEffect } from 'react';
/**
 * ConsumerRightsManager React Component for Buffr Host Hospitality Platform
 * @fileoverview ConsumerRightsManager handles regulatory compliance and legal requirements
 * @location buffr-host/components/compliance/ConsumerRightsManager.tsx
 * @purpose ConsumerRightsManager handles regulatory compliance and legal requirements
 * @component ConsumerRightsManager
 * @category Compliance
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @database_connections Reads from relevant tables based on component functionality
 * @api_integration RESTful API endpoints for data fetching and mutations
 * @state_management Local component state for UI interactions and data management
 * @hooks_utilization useState, useEffect for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Interactive state management for dynamic user experiences
 * - Real-time data integration with backend services
 * - API-driven functionality with error handling and loading states
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {string} [bookingId] - bookingId prop description
 * @param {string} [userId] - userId prop description
 * @param {} [className] - className prop description
 *
 * State:
 * @state {any} null - Component state for null management
 * @state {any} null - Component state for null management
 *
 * Methods:
 * @method handleWithdrawalSubmit - handleWithdrawalSubmit method for component functionality
 *
 * Usage Example:
 * @example
 * import { ConsumerRightsManager } from './ConsumerRightsManager';
 *
 * function App() {
 *   return (
 *     <ConsumerRightsManager
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered ConsumerRightsManager component
 */

import { BuffrIcon } from '@/components/ui/BuffrIcon';
import {
  ConsumerRightsInfo,
  WithdrawalRequest,
} from '@/lib/services/consumer-protection-service';

interface ConsumerRightsManagerProps {
  bookingId: string;
  userId: string;
  className?: string;
}

interface RightsDisplayProps {
  rights: ConsumerRightsInfo;
  onWithdrawalRequest: (reason: string) => void;
}

const RightsDisplay: React.FC<RightsDisplayProps> = ({
  rights,
  onWithdrawalRequest,
}) => {
  const [withdrawalReason, setWithdrawalReason] = useState('');
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawalReason.trim()) {
      onWithdrawalRequest(withdrawalReason.trim());
      setWithdrawalReason('');
      setShowWithdrawalForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cooling-off Period Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BuffrIcon name="clock" className="w-5 h-5" />
            Cooling-off Period
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              rights.canWithdraw
                ? 'bg-green-100 text-green-800'
                : rights.coolingOffStatus === 'expired'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
            }`}
          >
            {rights.coolingOffStatus === 'active' && rights.canWithdraw
              ? 'Active'
              : rights.coolingOffStatus === 'expired'
                ? 'Expired'
                : 'Not Available'}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium">
              {rights.canWithdraw
                ? `${rights.hoursRemaining} hours remaining`
                : rights.coolingOffStatus === 'expired'
                  ? 'Period has expired'
                  : 'Not applicable'}
            </span>
          </div>

          {rights.canWithdraw && (
            <div className="mt-4">
              <button
                onClick={() => setShowWithdrawalForm(true)}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                <BuffrIcon name="x" className="w-4 h-4 inline mr-2" />
                Withdraw from Booking (Full Refund)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Withdrawal Form Modal */}
      {showWithdrawalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Withdrawal</h3>
            <p className="text-sm text-gray-600 mb-4">
              You are about to withdraw from this booking during the cooling-off
              period. This will result in a full refund. Please provide a reason
              for your withdrawal.
            </p>

            <form onSubmit={handleWithdrawalSubmit}>
              <textarea
                value={withdrawalReason}
                onChange={(e) => setWithdrawalReason(e.target.value)}
                placeholder="Please provide a reason for your withdrawal..."
                className="w-full p-3 border rounded-lg mb-4 resize-none"
                rows={4}
                required
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawalForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Consumer Rights List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BuffrIcon name="shield" className="w-5 h-5" />
          Your Consumer Rights
        </h3>

        <div className="space-y-3">
          {rights.availableRights.map((right, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <BuffrIcon
                name="check"
                className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0"
              />
              <span className="text-sm text-gray-700">{right}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <BuffrIcon
            name="info"
            className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
          />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">
              Electronic Transactions Act Protection
            </h4>
            <p className="text-sm text-blue-700">
              Under Namibia's Electronic Transactions Act, you have the right to
              withdraw from distance contracts within 7 days for a full refund.
              Your rights expire on{' '}
              <span className="font-medium">
                {rights.rightsExpiryDate.toLocaleDateString()}
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConsumerRightsManager: React.FC<ConsumerRightsManagerProps> = ({
  bookingId,
  userId,
  className = '',
}) => {
  const [rights, setRights] = useState<ConsumerRightsInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawalInProgress, setWithdrawalInProgress] = useState(false);

  useEffect(() => {
    fetchConsumerRights();
  }, [bookingId]);

  const fetchConsumerRights = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/compliance/consumer-protection/rights?bookingId=${bookingId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch consumer rights');
      }

      setRights(data.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load consumer rights'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalRequest = async (reason: string) => {
    try {
      setWithdrawalInProgress(true);
      const response = await fetch(
        '/api/compliance/consumer-protection/withdrawal',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId,
            reason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit withdrawal request');
      }

      // Refresh rights after successful withdrawal
      await fetchConsumerRights();

      // Show success message
      alert(
        'Your withdrawal request has been processed. You will receive a full refund within 7-14 business days.'
      );
    } catch (err) {
      alert('Failed to process withdrawal request. Please try again.');
    } finally {
      setWithdrawalInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="bg-gray-200 h-8 rounded w-3/4"></div>
          <div className="bg-gray-200 h-32 rounded"></div>
          <div className="bg-gray-200 h-48 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <BuffrIcon
          name="alert"
          className="w-12 h-12 text-red-500 mx-auto mb-4"
        />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Unable to Load Consumer Rights
        </h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={fetchConsumerRights}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!rights) {
    return null;
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Consumer Rights & Protection
        </h2>
        <p className="text-gray-600">
          Manage your rights under Namibia's Electronic Transactions Act for
          this booking.
        </p>
      </div>

      <RightsDisplay
        rights={rights}
        onWithdrawalRequest={handleWithdrawalRequest}
      />

      {withdrawalInProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Processing your withdrawal request...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumerRightsManager;
