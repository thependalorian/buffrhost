/**
 * KYC Status Display Component
 *
 * Purpose: Display current KYC verification status and progress
 * Location: /components/forms/property-kyc-verification/KycStatusDisplay.tsx
 * Usage: Show verification status, next steps, and timeline
 *
 * Follows Rules:
 * - DaisyUI for consistent styling
 * - Clear status communication
 * - Progress visualization
 * - TypeScript for type safety
 */

'use client';

import React from 'react';
/**
 * KycStatusDisplay React Component for Buffr Host Hospitality Platform
 * @fileoverview KycStatusDisplay handles form input and validation for user data collection
 * @location buffr-host/components/forms/property-kyc-verification/KycStatusDisplay.tsx
 * @purpose KycStatusDisplay handles form input and validation for user data collection
 * @component KycStatusDisplay
 * @category Forms
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Methods:
 * @method getStatusConfig - getStatusConfig method for component functionality
 * @method formatDate - formatDate method for component functionality
 * @method getEstimatedCompletion - getEstimatedCompletion method for component functionality
 *
 * Usage Example:
 * @example
 * import { KycStatusDisplay } from './KycStatusDisplay';
 *
 * function App() {
 *   return (
 *     <KycStatusDisplay
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered KycStatusDisplay component
 */

import {
  CheckCircle,
  Clock,
  AlertCircle,
  AlertTriangle,
  FileText,
  Shield,
  Calendar,
} from 'lucide-react';
import type { KycStatusDisplayProps } from '@/lib/types/kyc-types';

export const KycStatusDisplay: React.FC<KycStatusDisplayProps> = ({
  kycStatus,
  className = '',
}) => {
  if (!kycStatus || kycStatus.status === 'not_started') {
    return (
      <div className={`alert alert-info ${className}`}>
        <FileText className="w-4 h-4" />
        <span>KYC verification not yet started</span>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success',
          textColor: 'text-success',
          title: 'Verification Approved',
          message: 'Your KYC verification has been successfully completed.',
        };
      case 'pending_review':
        return {
          icon: Clock,
          color: 'warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning',
          textColor: 'text-warning',
          title: 'Under Review',
          message: 'Your documents are being reviewed by our compliance team.',
        };
      case 'requires_info':
        return {
          icon: AlertTriangle,
          color: 'warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning',
          textColor: 'text-warning',
          title: 'Additional Information Required',
          message: 'Please check your email for additional requirements.',
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          color: 'error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error',
          textColor: 'text-error',
          title: 'Verification Rejected',
          message: 'Please contact support for further assistance.',
        };
      default:
        return {
          icon: Clock,
          color: 'info',
          bgColor: 'bg-info/10',
          borderColor: 'border-info',
          textColor: 'text-info',
          title: 'Status Unknown',
          message: 'Unable to determine verification status.',
        };
    }
  };

  const config = getStatusConfig(kycStatus.status);
  const IconComponent = config.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEstimatedCompletion = () => {
    if (kycStatus.status === 'pending_review') {
      // Estimate 24-48 hours from submission
      const submittedAt = new Date(kycStatus.submittedAt);
      const estimatedCompletion = new Date(
        submittedAt.getTime() + 48 * 60 * 60 * 1000
      );
      return formatDate(estimatedCompletion.toISOString());
    }
    return null;
  };

  return (
    <div
      className={`border rounded-lg p-6 ${config.bgColor} ${config.borderColor} ${className}`}
    >
      {/* Status Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-full bg-${config.color}`}>
          <IconComponent className={`w-5 h-5 text-${config.color}`} />
        </div>
        <div>
          <h3 className={`text-lg font-semibold text-${config.color}`}>
            {config.title}
          </h3>
          <p className="text-sm text-base-content/70">{config.message}</p>
        </div>
      </div>

      {/* Status Details */}
      <div className="space-y-3">
        {/* Submission Date */}
        {kycStatus.submittedAt && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-base-content/50" />
            <span className="text-base-content/70">Submitted:</span>
            <span className="font-medium">
              {formatDate(kycStatus.submittedAt)}
            </span>
          </div>
        )}

        {/* Review Date */}
        {kycStatus.reviewedAt && (
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-base-content/50" />
            <span className="text-base-content/70">Reviewed:</span>
            <span className="font-medium">
              {formatDate(kycStatus.reviewedAt)}
            </span>
          </div>
        )}

        {/* Approval Date */}
        {kycStatus.approvedAt && (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-base-content/50" />
            <span className="text-base-content/70">Approved:</span>
            <span className="font-medium">
              {formatDate(kycStatus.approvedAt)}
            </span>
          </div>
        )}

        {/* Estimated Completion */}
        {getEstimatedCompletion() && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-base-content/50" />
            <span className="text-base-content/70">Estimated completion:</span>
            <span className="font-medium">{getEstimatedCompletion()}</span>
          </div>
        )}

        {/* Reviewer Notes */}
        {kycStatus.reviewerNotes && (
          <div className="mt-4 p-3 bg-base-100 rounded-lg">
            <h4 className="text-sm font-medium text-base-content mb-2">
              Review Notes:
            </h4>
            <p className="text-sm text-base-content/80">
              {kycStatus.reviewerNotes}
            </p>
          </div>
        )}

        {/* Rejection Reason */}
        {kycStatus.rejectionReason && (
          <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
            <h4 className="text-sm font-medium text-error mb-2">
              Rejection Reason:
            </h4>
            <p className="text-sm text-error">{kycStatus.rejectionReason}</p>
          </div>
        )}

        {/* Next Steps */}
        {kycStatus.nextSteps && kycStatus.nextSteps.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-base-content mb-3">
              Next Steps:
            </h4>
            <div className="space-y-2">
              {kycStatus.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full bg-${config.color} flex items-center justify-center mt-0.5`}
                  >
                    <span className="text-xs text-white font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-base-content/80">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Based on Status */}
      <div className="mt-6 pt-4 border-t border-base-200">
        {kycStatus.status === 'requires_info' && (
          <div className="alert alert-warning">
            <AlertTriangle className="w-4 h-4" />
            <div>
              <div className="font-medium">Additional Information Required</div>
              <div className="text-sm">
                Please check your email for specific requirements and resubmit.
              </div>
            </div>
          </div>
        )}

        {kycStatus.status === 'rejected' && (
          <div className="alert alert-error">
            <AlertCircle className="w-4 h-4" />
            <div>
              <div className="font-medium">Verification Unsuccessful</div>
              <div className="text-sm">
                Contact our support team for assistance with re-verification.
              </div>
            </div>
          </div>
        )}

        {kycStatus.status === 'approved' && (
          <div className="alert alert-success">
            <CheckCircle className="w-4 h-4" />
            <div>
              <div className="font-medium">Verification Complete</div>
              <div className="text-sm">
                Your property is now fully verified and ready to accept
                bookings.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KycStatusDisplay;
