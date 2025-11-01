/**
 * KYC/KYB Verification Form Component (Refactored)
 *
 * Purpose: Orchestrate complete identity and business verification for property owners
 * Location: /components/forms/property-kyc-verification/KycVerificationForm.tsx
 * Integration: Steps 7-8 of property onboarding flow
 *
 * Follows Rules:
 * - DaisyUI for consistent styling
 * - Modular component design
 * - TypeScript for type safety
 * - Clean orchestration of sub-components
 * - Progress tracking and state management
 */

'use client';

import React, { useState, useEffect } from 'react';
/**
 *  React Component for Buffr Host Hospitality Platform
 * @fileoverview  handles form input and validation for user data collection
 * @location buffr-host/components/forms/property-kyc-verification/KycVerificationFormNew.tsx
 * @purpose  handles form input and validation for user data collection
 * @component 
 * @category Forms
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @database_connections Reads from relevant tables based on component functionality
 * @api_integration RESTful API endpoints for data fetching and mutations
 * @authentication JWT-based authentication for user-specific functionality
 * @state_management Local component state for UI interactions and data management
 * @hooks_utilization useState, useEffect for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Interactive state management for dynamic user experiences
 * - Real-time data integration with backend services
 * - API-driven functionality with error handling and loading states
 * - Secure authentication integration for user-specific features
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * State:
 * @state {any} null - Component state for null management
 * @state {any} null - Component state for null management
 * @state {any} {
    fullName: '' - Component state for {
    fullname: '' management
 * @state {any} {
      businessName: '' - Component state for {
      businessname: '' management
 * @state {any} {
    bankName: '' - Component state for {
    bankname: '' management
 * @state {any} [] - Component state for [] management
 *
 * Methods:
 * @method handleNext - handleNext method for component functionality
 * @method handlePrevious - handlePrevious method for component functionality
 *
 * Usage Example:
 * @example
 * import  from './';
 *
 * function App() {
 *   return (
 *     <
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered  component
 */

import { AlertCircle, Shield, Building2, CreditCard } from 'lucide-react';
import type {
  KycVerificationFormProps,
  PersonalIdentity,
  BusinessDocuments,
  BankingDetails,
  UploadedDocument,
} from '@/lib/types/kyc-types';

// Import modular components
import KycProgressIndicator from './KycProgressIndicator';
import KycStatusDisplay from './KycStatusDisplay';
import KycPersonalIdentityStep from './KycPersonalIdentityStep';
import KycBusinessBankingStep from './KycBusinessBankingStep';

// Import API utilities
import {
  submitKycVerification,
  getKycStatus,
  uploadKycDocument,
} from '@/lib/api/kyc-api';

const KycVerificationForm: React.FC<KycVerificationFormProps> = ({
  propertyId,
  propertyName,
  propertyType,
  onSuccess,
  onCancel,
  onPrevious,
  className = '',
}) => {
  // Form state
  const [currentStep, setCurrentStep] = useState(7); // Start at step 7 (KYC)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<any>(null);

  // Form data
  const [personalIdentity, setPersonalIdentity] = useState<PersonalIdentity>({
    fullName: '',
    idNumber: '',
    idType: 'national_id',
    dateOfBirth: '',
    nationality: '',
    address: {
      street: '',
      city: '',
      region: '',
      postalCode: '',
      country: '',
    },
  });

  const [businessDocuments, setBusinessDocuments] = useState<BusinessDocuments>(
    {
      businessName: '',
      registrationNumber: '',
      taxNumber: '',
      businessType: 'sole_proprietor',
      incorporationDate: '',
      businessAddress: {
        street: '',
        city: '',
        region: '',
        postalCode: '',
        country: '',
      },
    }
  );

  const [bankingDetails, setBankingDetails] = useState<BankingDetails>({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    branchCode: '',
    accountType: 'business',
    swiftCode: '',
    vatRegistrationNumber: '',
  });

  const [uploadedDocuments, setUploadedDocuments] = useState<
    UploadedDocument[]
  >([]);

  // Progress steps configuration
  const progressSteps = [
    {
      id: 7,
      title: 'Personal KYC',
      description: 'Identity verification',
      icon: Shield,
    },
    {
      id: 8,
      title: 'Business & Banking',
      description: 'KYB & payment setup',
      icon: Building2,
    },
  ];

  // Load existing KYC status on mount
  useEffect(() => {
    loadKycStatus();
  }, [propertyId]);

  const loadKycStatus = async () => {
    try {
      const response = await getKycStatus(propertyId);
      if (response.success) {
        setKycStatus(response.data);
      }
    } catch (error) {
      console.error('Failed to load KYC status:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 7) {
      setCurrentStep(currentStep - 1);
    } else {
      onPrevious?.();
    }
  };

  const handleFileUpload = async (file: File, documentType: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await uploadKycDocument(propertyId, documentType, file);
      if (response.success) {
        setUploadedDocuments((prev) => [
          ...prev,
          {
            id: response.data.documentId,
            fileName: response.data.fileName,
            documentType,
            uploadUrl: response.data.uploadUrl,
            status: response.data.status,
            uploadedAt: response.data.uploadedAt,
          },
        ]);
      } else {
        setError(response.message || 'Failed to upload document');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const kycData = {
        propertyId,
        userId: 'current-user-id', // This should come from auth context
        personalIdentity,
        businessDocuments: {
          ...businessDocuments,
          bankingDetails, // Include banking in business documents for API
        },
      };

      const response = await submitKycVerification(kycData);
      if (response.success) {
        setKycStatus(response.data);
        onSuccess?.(response.data);
      } else {
        setError(response.message || 'Failed to submit KYC verification');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit KYC verification');
    } finally {
      setIsLoading(false);
    }
  };

  // If KYC is already completed, show status
  if (kycStatus?.status === 'approved') {
    return (
      <div className={`space-y-6 ${className}`}>
        <KycProgressIndicator
          currentStep={8}
          totalSteps={8}
          steps={progressSteps}
        />
        <KycStatusDisplay kycStatus={kycStatus} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Indicator */}
      <KycProgressIndicator
        currentStep={currentStep}
        totalSteps={8}
        steps={progressSteps}
        onStepClick={setCurrentStep}
      />

      {/* Error Display */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Steps */}
      {currentStep === 7 && (
        <KycPersonalIdentityStep
          data={personalIdentity}
          onUpdate={setPersonalIdentity}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onCancel={onCancel}
          uploadedDocuments={uploadedDocuments}
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
        />
      )}

      {currentStep === 8 && (
        <KycBusinessBankingStep
          data={{
            businessDocuments,
            bankingDetails,
          }}
          onUpdate={(data: any) => {
            if (data.businessDocuments)
              setBusinessDocuments(data.businessDocuments);
            if (data.bankingDetails) setBankingDetails(data.bankingDetails);
          }}
          onSubmit={handleSubmit}
          onPrevious={handlePrevious}
          onCancel={onCancel}
          uploadedDocuments={uploadedDocuments}
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
        />
      )}

      {/* KYC Status Display for in-progress submissions */}
      {kycStatus && kycStatus.status !== 'approved' && (
        <KycStatusDisplay kycStatus={kycStatus} />
      )}
    </div>
  );
};

export default KycVerificationForm;
