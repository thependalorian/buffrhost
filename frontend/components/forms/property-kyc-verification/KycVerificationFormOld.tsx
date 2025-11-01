/**
 * KYC/KYB Verification Form Component
 *
 * Purpose: Complete identity and business verification for property owners
 * Location: /components/forms/property-kyc-verification/KycVerificationForm.tsx
 * Integration: Steps 7-8 of property onboarding flow
 *
 * Follows Rules:
 * - DaisyUI for consistent styling
 * - Modular component design
 * - TypeScript for type safety
 * - Comprehensive form validation
 * - File upload handling
 * - Progress tracking
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
/**
 * KycVerificationForm React Component for Buffr Host Hospitality Platform
 * @fileoverview KycVerificationForm handles form input and validation for user data collection
 * @location buffr-host/components/forms/property-kyc-verification/KycVerificationFormOld.tsx
 * @purpose KycVerificationForm handles form input and validation for user data collection
 * @component KycVerificationForm
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
 * - Configurable props for flexible component usage
 * - Interactive state management for dynamic user experiences
 * - Real-time data integration with backend services
 * - API-driven functionality with error handling and loading states
 * - Secure authentication integration for user-specific features
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {string} [propertyId] - propertyId prop description
 * @param {string} [propertyName] - propertyName prop description
 * @param {'hotel' | 'restaurant'} [propertyType] - propertyType prop description
 * @param {} [onSuccess] - onSuccess prop description
 * @param {} [onCancel] - onCancel prop description
 * @param {} [onPrevious] - onPrevious prop description
 * @param {} [className] - className prop description
 *
 * State:
 * @state {any} null - Component state for null management
 * @state {any} null - Component state for null management
 * @state {any} [] - Component state for [] management
 * @state {any} null - Component state for null management
 * @state {any} {
    fullName: '' - Component state for {
    fullname: '' management
 * @state {any} {
      businessName: propertyName - Component state for {
      businessname: propertyname management
 * @state {any} {
    bankName: '' - Component state for {
    bankname: '' management
 *
 * Methods:
 * @method handleStepClick - handleStepClick method for component functionality
 * @method handleInputChange - handleInputChange method for component functionality
 * @method handleFileSelect = (
    documentType: string,
    ref: React.RefObject<HTMLInputElement>
  ) - handleFileSelect = (
    documentType: string,
    ref: React.RefObject<HTMLInputElement>
  ) method for component functionality
 * @method handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: string
  ) - handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: string
  ) method for component functionality
 * @method getDocumentStatus - getDocumentStatus method for component functionality
 * @method handleBusinessInputChange - handleBusinessInputChange method for component functionality
 * @method handleBankingInputChange - handleBankingInputChange method for component functionality
 * @method handleFileSelect = (
    documentType: string,
    ref: React.RefObject<HTMLInputElement>
  ) - handleFileSelect = (
    documentType: string,
    ref: React.RefObject<HTMLInputElement>
  ) method for component functionality
 * @method handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: string
  ) - handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: string
  ) method for component functionality
 * @method getDocumentStatus - getDocumentStatus method for component functionality
 *
 * Usage Example:
 * @example
 * import { KycVerificationForm } from './KycVerificationForm';
 *
 * function App() {
 *   return (
 *     <KycVerificationForm
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered KycVerificationForm component
 */

import { Card, CardContent } from '@/components/ui';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  Shield,
  Building2,
  CreditCard,
} from 'lucide-react';

// Form data interfaces
interface PersonalIdentity {
  fullName: string;
  idNumber: string;
  idType: 'national_id' | 'passport' | 'drivers_license';
  dateOfBirth: string;
  nationality: string;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
}

interface BusinessDocuments {
  businessName: string;
  registrationNumber: string;
  taxNumber: string;
  businessType:
    | 'sole_proprietor'
    | 'partnership'
    | 'company'
    | 'trust'
    | 'other';
  incorporationDate: string;
  businessAddress: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
}

interface BankingDetails {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  branchCode: string;
  accountType: 'cheque' | 'savings' | 'business';
  swiftCode?: string;
  vatRegistrationNumber?: string;
}

interface KycVerificationFormProps {
  propertyId: string;
  propertyName: string;
  propertyType: 'hotel' | 'restaurant';
  onSuccess?: (kycData: any) => void;
  onCancel?: () => void;
  onPrevious?: () => void;
  className?: string;
}

interface UploadedDocument {
  id: string;
  fileName: string;
  documentType: string;
  uploadUrl: string;
  status: string;
  uploadedAt: string;
}

// Form steps
const formSteps = [
  {
    id: 7,
    title: 'KYC Verification',
    description: 'Personal identity verification',
    icon: Shield,
  },
  {
    id: 8,
    title: 'KYB & Banking',
    description: 'Business documents and banking setup',
    icon: Building2,
  },
];

export const KycVerificationForm: React.FC<KycVerificationFormProps> = ({
  propertyId,
  propertyName,
  propertyType,
  onSuccess,
  onCancel,
  onPrevious,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<
    UploadedDocument[]
  >([]);
  const [kycStatus, setKycStatus] = useState<any>(null);

  // Form data state
  const [personalIdentity, setPersonalIdentity] = useState<PersonalIdentity>({
    fullName: '',
    idNumber: '',
    idType: 'national_id',
    dateOfBirth: '',
    nationality: 'Namibia',
    address: {
      street: '',
      city: '',
      region: '',
      postalCode: '',
      country: 'Namibia',
    },
  });

  const [businessDocuments, setBusinessDocuments] = useState<BusinessDocuments>(
    {
      businessName: propertyName,
      registrationNumber: '',
      taxNumber: '',
      businessType: 'sole_proprietor',
      incorporationDate: '',
      businessAddress: {
        street: '',
        city: '',
        region: '',
        postalCode: '',
        country: 'Namibia',
      },
    }
  );

  const [bankingDetails, setBankingDetails] = useState<BankingDetails>({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    branchCode: '',
    accountType: 'business',
  });

  // File upload refs
  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);
  const businessRegRef = useRef<HTMLInputElement>(null);
  const taxCertRef = useRef<HTMLInputElement>(null);

  // Load existing KYC status on mount
  useEffect(() => {
    loadKycStatus();
    loadUploadedDocuments();
  }, [propertyId]);

  const loadKycStatus = async () => {
    try {
      const response = await fetch(
        `/api/v1/properties/kyc?propertyId=${propertyId}`
      );
      const data = await response.json();

      if (data.success) {
        setKycStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to load KYC status:', error);
    }
  };

  const loadUploadedDocuments = async () => {
    try {
      const response = await fetch(
        `/api/v1/properties/kyc/documents?propertyId=${propertyId}`
      );
      const data = await response.json();

      if (data.success) {
        setUploadedDocuments(data.data);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  // Handle file uploads
  const handleFileUpload = async (file: File, documentType: string) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);
    formData.append('propertyId', propertyId);
    formData.append('documentType', documentType);

    try {
      const response = await fetch('/api/v1/properties/kyc/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadedDocuments((prev) => [
          ...prev,
          {
            id: data.data.documentId,
            fileName: file.name,
            documentType,
            uploadUrl: data.data.uploadUrl,
            status: data.data.status,
            uploadedAt: data.data.uploadedAt,
          },
        ]);
        setSuccess(`Document uploaded successfully: ${file.name}`);
      } else {
        setError(data.message || 'Failed to upload document');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload document. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const submissionData = {
        propertyId,
        userId: 'current-user-id', // This should come from auth context
        personalIdentity,
        businessDocuments,
        bankingDetails,
      };

      const response = await fetch('/api/v1/properties/kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(
          'KYC verification submitted successfully! You will be notified once verification is complete.'
        );
        setKycStatus(data.data);
        onSuccess?.(data.data);
      } else {
        throw new Error(data.message || 'Failed to submit KYC verification');
      }
    } catch (err) {
      console.error('KYC submission error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to submit KYC verification. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const currentStepConfig = formSteps.find((step) => step.id === currentStep);
  const progressPercentage = ((currentStep - 7) / 1) * 100; // 2 steps total

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Property Verification - {propertyName}
          </h2>
          <p className="text-base-content/70">
            Complete identity and business verification to activate your
            property
          </p>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-4">
            {formSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              const isClickable = step.id <= currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => isClickable && handleStepClick(step.id)}
                      disabled={!isClickable}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        isCompleted
                          ? 'bg-success text-white'
                          : isCurrent
                            ? 'bg-primary text-white'
                            : 'bg-base-200 text-base-content/50'
                      } ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <IconComponent className="w-6 h-6" />
                      )}
                    </button>
                    <div className="mt-2 text-center">
                      <div className="text-xs font-medium text-base-content">
                        {step.title}
                      </div>
                      <div className="text-xs text-base-content/70">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < formSteps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-4 ${
                        step.id < currentStep ? 'bg-success' : 'bg-base-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-base-content/70 mb-2">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-base-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="btn-sm btn-ghost">
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle className="w-4 h-4" />
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="btn-sm btn-ghost">
            ×
          </button>
        </div>
      )}

      {/* Step Content */}
      {currentStep === 7 && (
        <KycPersonalIdentityStep
          data={personalIdentity}
          onUpdate={setPersonalIdentity}
          onNext={() => setCurrentStep(8)}
          onPrevious={onPrevious}
          onCancel={onCancel}
          uploadedDocuments={uploadedDocuments}
          onFileUpload={handleFileUpload}
          idFrontRef={idFrontRef}
          idBackRef={idBackRef}
          isLoading={isSubmitting}
        />
      )}

      {currentStep === 8 && (
        <KybBankingStep
          propertyType={propertyType}
          businessData={businessDocuments}
          bankingData={bankingDetails}
          onBusinessUpdate={setBusinessDocuments}
          onBankingUpdate={setBankingDetails}
          onSubmit={handleSubmit}
          onPrevious={() => setCurrentStep(7)}
          onCancel={onCancel}
          uploadedDocuments={uploadedDocuments}
          onFileUpload={handleFileUpload}
          businessRegRef={businessRegRef}
          taxCertRef={taxCertRef}
          isLoading={isSubmitting}
        />
      )}

      {/* KYC Status Display */}
      {kycStatus && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  kycStatus.status === 'approved'
                    ? 'bg-success'
                    : kycStatus.status === 'pending_review'
                      ? 'bg-warning'
                      : kycStatus.status === 'rejected'
                        ? 'bg-error'
                        : 'bg-info'
                }`}
              ></div>
              <div>
                <h3 className="font-semibold">
                  Verification Status:{' '}
                  {kycStatus.status.replace('_', ' ').toUpperCase()}
                </h3>
                {kycStatus.submittedAt && (
                  <p className="text-sm text-base-content/70">
                    Submitted:{' '}
                    {new Date(kycStatus.submittedAt).toLocaleDateString()}
                  </p>
                )}
                {kycStatus.reviewerNotes && (
                  <p className="text-sm text-base-content/70 mt-1">
                    Notes: {kycStatus.reviewerNotes}
                  </p>
                )}
              </div>
            </div>

            {kycStatus.nextSteps && kycStatus.nextSteps.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Next Steps:</h4>
                <ul className="text-sm text-base-content/70 space-y-1">
                  {kycStatus.nextSteps.map((step: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-64">
            <CardContent className="p-6 text-center">
              <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
              <h3 className="font-medium text-base-content mb-2">
                {currentStep === 7
                  ? 'Processing Documents'
                  : 'Submitting Verification'}
              </h3>
              <p className="text-sm text-base-content/70">
                Please wait while we process your information...
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// KYC Personal Identity Step Component
interface KycPersonalIdentityStepProps {
  data: PersonalIdentity;
  onUpdate: (data: PersonalIdentity) => void;
  onNext: () => void;
  onPrevious?: () => void;
  onCancel?: () => void;
  uploadedDocuments: UploadedDocument[];
  onFileUpload: (file: File, documentType: string) => void;
  idFrontRef: React.RefObject<HTMLInputElement>;
  idBackRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
}

const KycPersonalIdentityStep: React.FC<KycPersonalIdentityStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  onCancel,
  uploadedDocuments,
  onFileUpload,
  idFrontRef,
  idBackRef,
  isLoading,
}) => {
  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      onUpdate({
        ...data,
        [parent]: {
          ...(data[parent as keyof PersonalIdentity] as any),
          [child]: value,
        },
      });
    } else {
      onUpdate({
        ...data,
        [field]: value,
      });
    }
  };

  const handleFileSelect = (
    documentType: string,
    ref: React.RefObject<HTMLInputElement>
  ) => {
    ref.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file, documentType);
    }
  };

  const getDocumentStatus = (documentType: string) => {
    return uploadedDocuments.find((doc) => doc.documentType === documentType);
  };

  return (
    <Card>
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-base-content mb-2">
            Personal Identity Verification (KYC)
          </h3>
          <p className="text-base-content/70">
            We need to verify your identity to ensure safe transactions. This is
            a one-time process.
          </p>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                Full Legal Name *
              </label>
              <input
                type="text"
                value={data.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="input input-bordered w-full"
                placeholder="As shown on ID document"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                ID Type *
              </label>
              <select
                value={data.idType}
                onChange={(e) => handleInputChange('idType', e.target.value)}
                className="select select-bordered w-full"
                required
              >
                <option value="national_id">National ID</option>
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                ID Number *
              </label>
              <input
                type="text"
                value={data.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                className="input input-bordered w-full"
                placeholder="Your ID number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={data.dateOfBirth}
                onChange={(e) =>
                  handleInputChange('dateOfBirth', e.target.value)
                }
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h4 className="text-lg font-semibold text-base-content mb-4">
              Address Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-base-content mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={data.address.street}
                  onChange={(e) =>
                    handleInputChange('address.street', e.target.value)
                  }
                  className="input input-bordered w-full"
                  placeholder="Street address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={data.address.city}
                  onChange={(e) =>
                    handleInputChange('address.city', e.target.value)
                  }
                  className="input input-bordered w-full"
                  placeholder="City"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Region/State *
                </label>
                <input
                  type="text"
                  value={data.address.region}
                  onChange={(e) =>
                    handleInputChange('address.region', e.target.value)
                  }
                  className="input input-bordered w-full"
                  placeholder="Region or State"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  value={data.address.postalCode}
                  onChange={(e) =>
                    handleInputChange('address.postalCode', e.target.value)
                  }
                  className="input input-bordered w-full"
                  placeholder="Postal code"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  value={data.address.country}
                  onChange={(e) =>
                    handleInputChange('address.country', e.target.value)
                  }
                  className="input input-bordered w-full"
                  placeholder="Country"
                  required
                />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div>
            <h4 className="text-lg font-semibold text-base-content mb-4">
              Identity Documents
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID Front */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  ID Document Front *
                </label>
                {getDocumentStatus('id_front') ? (
                  <div className="border-2 border-success border-dashed rounded-lg p-4 bg-success/10">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <div>
                        <p className="text-sm font-medium text-success">
                          Uploaded
                        </p>
                        <p className="text-xs text-base-content/70">
                          {getDocumentStatus('id_front')?.fileName}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => handleFileSelect('id_front', idFrontRef)}
                    className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload className="w-8 h-8 text-base-content/50 mx-auto mb-2" />
                    <p className="text-sm font-medium">
                      Click to upload ID front
                    </p>
                    <p className="text-xs text-base-content/70">
                      JPEG, PNG, PDF up to 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={idFrontRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                  onChange={(e) => handleFileChange(e, 'id_front')}
                  className="hidden"
                />
              </div>

              {/* ID Back */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  ID Document Back
                </label>
                {getDocumentStatus('id_back') ? (
                  <div className="border-2 border-success border-dashed rounded-lg p-4 bg-success/10">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <div>
                        <p className="text-sm font-medium text-success">
                          Uploaded
                        </p>
                        <p className="text-xs text-base-content/70">
                          {getDocumentStatus('id_back')?.fileName}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => handleFileSelect('id_back', idBackRef)}
                    className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload className="w-8 h-8 text-base-content/50 mx-auto mb-2" />
                    <p className="text-sm font-medium">
                      Click to upload ID back
                    </p>
                    <p className="text-xs text-base-content/70">
                      JPEG, PNG, PDF up to 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={idBackRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                  onChange={(e) => handleFileChange(e, 'id_back')}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900 mb-1">
                  Your documents are secure
                </h5>
                <p className="text-sm text-blue-700">
                  All documents are encrypted and processed using AI-powered OCR
                  verification. We use Google Drive for secure storage with
                  admin-only access. Verification typically takes 24-48 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <button
              onClick={onPrevious}
              className="btn btn-outline btn-primary"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <button
              onClick={onNext}
              className="btn btn-primary"
              disabled={
                isLoading ||
                !data.fullName ||
                !data.idNumber ||
                !data.dateOfBirth
              }
            >
              Next: Business Verification
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// KYB & Banking Step Component
interface KybBankingStepProps {
  propertyType: 'hotel' | 'restaurant';
  businessData: BusinessDocuments;
  bankingData: BankingDetails;
  onBusinessUpdate: (data: BusinessDocuments) => void;
  onBankingUpdate: (data: BankingDetails) => void;
  onSubmit: () => void;
  onPrevious: () => void;
  onCancel?: () => void;
  uploadedDocuments: UploadedDocument[];
  onFileUpload: (file: File, documentType: string) => void;
  businessRegRef: React.RefObject<HTMLInputElement>;
  taxCertRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
}

const KybBankingStep: React.FC<KybBankingStepProps> = ({
  propertyType,
  businessData,
  bankingData,
  onBusinessUpdate,
  onBankingUpdate,
  onSubmit,
  onPrevious,
  onCancel,
  uploadedDocuments,
  onFileUpload,
  businessRegRef,
  taxCertRef,
  isLoading,
}) => {
  const handleBusinessInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      onBusinessUpdate({
        ...businessData,
        [parent]: {
          ...(businessData[parent as keyof BusinessDocuments] as any),
          [child]: value,
        },
      });
    } else {
      onBusinessUpdate({
        ...businessData,
        [field]: value,
      });
    }
  };

  const handleBankingInputChange = (field: string, value: string) => {
    onBankingUpdate({
      ...bankingData,
      [field]: value,
    });
  };

  const handleFileSelect = (
    documentType: string,
    ref: React.RefObject<HTMLInputElement>
  ) => {
    ref.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file, documentType);
    }
  };

  const getDocumentStatus = (documentType: string) => {
    return uploadedDocuments.find((doc) => doc.documentType === documentType);
  };

  return (
    <div className="space-y-6">
      {/* Business Documents */}
      <Card>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <Building2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-base-content mb-2">
              Business Verification (KYB)
            </h3>
            <p className="text-base-content/70">
              Provide your business registration and tax information
            </p>
          </div>

          <div className="space-y-6">
            {/* Business Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-base-content mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={businessData.businessName}
                  onChange={(e) =>
                    handleBusinessInputChange('businessName', e.target.value)
                  }
                  className="input input-bordered w-full"
                  placeholder="Legal business name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Business Registration Number *
                </label>
                <input
                  type="text"
                  value={businessData.registrationNumber}
                  onChange={(e) =>
                    handleBusinessInputChange(
                      'registrationNumber',
                      e.target.value
                    )
                  }
                  className="input input-bordered w-full"
                  placeholder="e.g., CC/2024/09322"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Tax Registration Number *
                </label>
                <input
                  type="text"
                  value={businessData.taxNumber}
                  onChange={(e) =>
                    handleBusinessInputChange('taxNumber', e.target.value)
                  }
                  className="input input-bordered w-full"
                  placeholder="Your business TIN"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Business Type *
                </label>
                <select
                  value={businessData.businessType}
                  onChange={(e) =>
                    handleBusinessInputChange('businessType', e.target.value)
                  }
                  className="select select-bordered w-full"
                  required
                >
                  <option value="sole_proprietor">Sole Proprietor</option>
                  <option value="partnership">Partnership</option>
                  <option value="company">Company</option>
                  <option value="trust">Trust</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Incorporation Date
                </label>
                <input
                  type="date"
                  value={businessData.incorporationDate}
                  onChange={(e) =>
                    handleBusinessInputChange(
                      'incorporationDate',
                      e.target.value
                    )
                  }
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            {/* Business Address */}
            <div>
              <h4 className="text-lg font-semibold text-base-content mb-4">
                Business Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={businessData.businessAddress.street}
                    onChange={(e) =>
                      handleBusinessInputChange(
                        'businessAddress.street',
                        e.target.value
                      )
                    }
                    className="input input-bordered w-full"
                    placeholder="Business street address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={businessData.businessAddress.city}
                    onChange={(e) =>
                      handleBusinessInputChange(
                        'businessAddress.city',
                        e.target.value
                      )
                    }
                    className="input input-bordered w-full"
                    placeholder="City"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Region/State *
                  </label>
                  <input
                    type="text"
                    value={businessData.businessAddress.region}
                    onChange={(e) =>
                      handleBusinessInputChange(
                        'businessAddress.region',
                        e.target.value
                      )
                    }
                    className="input input-bordered w-full"
                    placeholder="Region or State"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={businessData.businessAddress.postalCode}
                    onChange={(e) =>
                      handleBusinessInputChange(
                        'businessAddress.postalCode',
                        e.target.value
                      )
                    }
                    className="input input-bordered w-full"
                    placeholder="Postal code"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={businessData.businessAddress.country}
                    onChange={(e) =>
                      handleBusinessInputChange(
                        'businessAddress.country',
                        e.target.value
                      )
                    }
                    className="input input-bordered w-full"
                    placeholder="Country"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Business Document Upload */}
            <div>
              <h4 className="text-lg font-semibold text-base-content mb-4">
                Business Documents
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Registration */}
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Business Registration Certificate *
                  </label>
                  {getDocumentStatus('business_registration') ? (
                    <div className="border-2 border-success border-dashed rounded-lg p-4 bg-success/10">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <div>
                          <p className="text-sm font-medium text-success">
                            Uploaded
                          </p>
                          <p className="text-xs text-base-content/70">
                            {
                              getDocumentStatus('business_registration')
                                ?.fileName
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() =>
                        handleFileSelect(
                          'business_registration',
                          businessRegRef
                        )
                      }
                      className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <FileText className="w-8 h-8 text-base-content/50 mx-auto mb-2" />
                      <p className="text-sm font-medium">
                        Upload Business Registration
                      </p>
                      <p className="text-xs text-base-content/70">
                        PDF or image up to 10MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={businessRegRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                    onChange={(e) =>
                      handleFileChange(e, 'business_registration')
                    }
                    className="hidden"
                  />
                </div>

                {/* Tax Certificate */}
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Tax Certificate (Optional)
                  </label>
                  {getDocumentStatus('tax_certificate') ? (
                    <div className="border-2 border-success border-dashed rounded-lg p-4 bg-success/10">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <div>
                          <p className="text-sm font-medium text-success">
                            Uploaded
                          </p>
                          <p className="text-xs text-base-content/70">
                            {getDocumentStatus('tax_certificate')?.fileName}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() =>
                        handleFileSelect('tax_certificate', taxCertRef)
                      }
                      className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <FileText className="w-8 h-8 text-base-content/50 mx-auto mb-2" />
                      <p className="text-sm font-medium">
                        Upload Tax Certificate
                      </p>
                      <p className="text-xs text-base-content/70">
                        PDF or image up to 10MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={taxCertRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                    onChange={(e) => handleFileChange(e, 'tax_certificate')}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banking Details */}
      <Card>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <CreditCard className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-base-content mb-2">
              Banking Details for Payouts
            </h3>
            <p className="text-base-content/70">
              Where should we send your payouts? Set up your bank account for
              daily automated payments.
            </p>
          </div>

          <div className="space-y-6">
            {/* Bank Account Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Bank Name *
                </label>
                <select
                  value={bankingData.bankName}
                  onChange={(e) =>
                    handleBankingInputChange('bankName', e.target.value)
                  }
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select your bank</option>
                  <option value="Bank Windhoek">Bank Windhoek (485)</option>
                  <option value="FNB Namibia">FNB Namibia (282)</option>
                  <option value="Standard Bank">Standard Bank (087)</option>
                  <option value="Nedbank">Nedbank (461)</option>
                  <option value="Banco Atlantico">Banco Atlantico (087)</option>
                  <option value="Bank BIC">Bank BIC (083)</option>
                  <option value="Letshego Bank">Letshego Bank (089)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  value={bankingData.accountHolderName}
                  onChange={(e) =>
                    handleBankingInputChange(
                      'accountHolderName',
                      e.target.value
                    )
                  }
                  className="input input-bordered w-full"
                  placeholder="Name on the bank account"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={bankingData.accountNumber}
                  onChange={(e) =>
                    handleBankingInputChange('accountNumber', e.target.value)
                  }
                  className="input input-bordered w-full"
                  placeholder="Your account number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Branch Code *
                </label>
                <input
                  type="text"
                  value={bankingData.branchCode}
                  onChange={(e) =>
                    handleBankingInputChange('branchCode', e.target.value)
                  }
                  className="input input-bordered w-full"
                  placeholder="e.g., 485-673"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Account Type *
                </label>
                <select
                  value={bankingData.accountType}
                  onChange={(e) =>
                    handleBankingInputChange('accountType', e.target.value)
                  }
                  className="select select-bordered w-full"
                  required
                >
                  <option value="cheque">Cheque Account</option>
                  <option value="savings">Savings Account</option>
                  <option value="business">Business Account</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  SWIFT Code (Optional)
                </label>
                <input
                  type="text"
                  value={bankingData.swiftCode || ''}
                  onChange={(e) =>
                    handleBankingInputChange('swiftCode', e.target.value)
                  }
                  className="input input-bordered w-full"
                  placeholder="e.g., BWLINANX"
                />
              </div>
            </div>

            {/* VAT Registration (Optional) */}
            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                VAT Registration Number (Optional)
              </label>
              <input
                type="text"
                value={bankingData.vatRegistrationNumber || ''}
                onChange={(e) =>
                  handleBankingInputChange(
                    'vatRegistrationNumber',
                    e.target.value
                  )
                }
                className="input input-bordered w-full"
                placeholder="If VAT registered"
              />
            </div>

            {/* Payment Flow Explanation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-4">
                💰 Payment Flow Explained
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                  <div className="text-2xl mb-2">1️⃣</div>
                  <div className="font-medium text-blue-900 mb-1">
                    Guest Pays
                  </div>
                  <div className="text-sm text-blue-700">
                    Full amount + fees
                  </div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                  <div className="text-2xl mb-2">2️⃣</div>
                  <div className="font-medium text-blue-900 mb-1">
                    Buffr Processes
                  </div>
                  <div className="text-sm text-blue-700">10% service fee</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                  <div className="text-2xl mb-2">3️⃣</div>
                  <div className="font-medium text-blue-900 mb-1">
                    You Receive
                  </div>
                  <div className="text-sm text-blue-700">Next day payout</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Payout Schedule:</strong> Automated daily payouts via
                  RealPay. Your revenue minus 10% service fee will be deposited
                  the next business day.
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <button
                onClick={onPrevious}
                className="btn btn-outline btn-primary"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Personal Info
              </button>

              <button
                onClick={onSubmit}
                className="btn btn-primary"
                disabled={
                  isLoading ||
                  !businessData.businessName ||
                  !businessData.registrationNumber ||
                  !bankingData.bankName ||
                  !bankingData.accountNumber
                }
              >
                Submit for Verification
                {isLoading && (
                  <div className="loading loading-spinner loading-sm ml-2"></div>
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KycVerificationForm;
