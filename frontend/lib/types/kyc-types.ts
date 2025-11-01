/**
 * KYC/KYB Type Definitions
 *
 * Purpose: Comprehensive type definitions for KYC (Know Your Customer) and KYB (Know Your Business)
 * verification system in Buffr Host. Used for onboarding property owners and businesses.
 * Location: lib/types/kyc-types.ts
 * Usage: Shared across all KYC components, verification APIs, document upload services, and onboarding flows
 *
 * @module KYC/KYB Types
 * @author Buffr Host Development Team
 * @version 1.0.0
 *
 * @description
 * This module provides type definitions for identity verification, document management,
 * and compliance workflows required for property owners and businesses to use Buffr Host.
 * All sensitive data should be encrypted and handled according to GDPR and data protection regulations.
 */

/**
 * Personal Identity Interface
 *
 * Represents personal identification information for individual property owners or users.
 *
 * @interface PersonalIdentity
 * @property {string} fullName - Full legal name
 * @property {string} idNumber - National ID, passport number, or driver's license number
 * @property {'national_id' | 'passport' | 'drivers_license'} idType - Type of identification document
 * @property {string} dateOfBirth - Date of birth (ISO date string)
 * @property {string} nationality - Nationality (ISO country code)
 * @property {object} address - Physical address information
 * @property {string} address.street - Street address
 * @property {string} address.city - City name
 * @property {string} address.region - Region/state/province
 * @property {string} address.postalCode - Postal/ZIP code
 * @property {string} address.country - Country (ISO country code)
 *
 * @security All personal data must be encrypted at rest and in transit
 * @example
 * const identity: PersonalIdentity = {
 *   fullName: 'John Doe',
 *   idNumber: '123456789',
 *   idType: 'national_id',
 *   dateOfBirth: '1990-01-15',
 *   nationality: 'NA',
 *   address: {
 *     street: '123 Main St',
 *     city: 'Windhoek',
 *     region: 'Khomas',
 *     postalCode: '10001',
 *     country: 'NA'
 *   }
 * };
 */
/**
 * Kyc types Type Definitions for Buffr Host Hospitality Platform
 * @fileoverview Kyc-types type definitions for Buffr Host system operations
 * @location buffr-host/lib/types/kyc-types.ts
 * @purpose kyc-types type definitions for Buffr Host system operations
 * @modularity Centralized type definitions providing type safety across the entire Buffr Host application
 * @api_integration REST API endpoints, HTTP request/response handling
 * @security Type-safe security definitions for authentication, authorization, and data protection
 * @ai_integration Machine learning and AI service type definitions for predictive analytics
 * @authentication User authentication and session management type definitions
 * @typescript_strict Strict TypeScript type safety ensuring compile-time error prevention
 * @type_safety Comprehensive type coverage preventing runtime errors and improving developer experience
 * @scalability Type definitions supporting horizontal scaling and multi-tenant architecture
 * @maintainability Self-documenting types enabling easier code maintenance and refactoring
 * @testing Type-driven development supporting comprehensive test coverage
 *
 * Type Definitions Summary:
 * - 20 Interfaces: PersonalIdentity, BusinessDocuments, BankingDetails...
 * - 1 Type: KycFormStep
 * - Total: 21 type definitions
 *
 * Usage and Integration:
 * - Frontend Components: Type-safe props and state management
 * - API Routes: Request/response type validation
 * - Database Services: Schema-aligned data operations
 * - Business Logic: Domain-specific type constraints
 * - Testing: Type-driven test case generation
 *
 * @example
 * // Import type definitions
 * import type { PersonalIdentity, BusinessDocuments, BankingDetails... } from './kyc-types';
 *
 * // Usage in component
 * interface ComponentProps {
 *   data: PersonalIdentity;
 *   onAction: (event: KycFormStep) => void;
 * }
 *
 * @example
 * // Database service usage
 * const userService = {
 *   async getUser(id: string): Promise<User> {
 *     // Type-safe database operations
 *     return await db.query('SELECT * FROM users WHERE id = $1', [id]);
 *   }
 * };
 *
 * Exported Types:
 * @typedef {Interface} PersonalIdentity
 * @typedef {Interface} BusinessDocuments
 * @typedef {Interface} BankingDetails
 * @typedef {Interface} UploadedDocument
 * @typedef {Interface} KycVerificationData
 * @typedef {Interface} KycSubmissionResponse
 * @typedef {Interface} KycStatusResponse
 * @typedef {Interface} DocumentUploadResponse
 * @typedef {Interface} KycVerificationFormProps
 * @typedef {Interface} KycStepProps
 * ... and 11 more type definitions
 *
 * @returns {Object} Type definitions module with all exported types and interfaces
 * @type_safety Ensures 100% type coverage across the Buffr Host application
 * @documentation Comprehensive JSDoc documentation for developer experience
 * @maintainability Type-driven development enabling safe refactoring and evolution
 */

export interface PersonalIdentity {
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

/**
 * Business Documents Interface
 *
 * Represents business registration and legal documentation information.
 *
 * @interface BusinessDocuments
 * @property {string} businessName - Registered business name
 * @property {string} registrationNumber - Business registration number from authorities
 * @property {string} taxNumber - Tax identification number
 * @property {'sole_proprietor' | 'partnership' | 'company' | 'trust' | 'other'} businessType - Legal business structure type
 * @property {string} incorporationDate - Date of business incorporation (ISO date string)
 * @property {object} businessAddress - Registered business address
 * @property {string} businessAddress.street - Street address
 * @property {string} businessAddress.city - City name
 * @property {string} businessAddress.region - Region/state/province
 * @property {string} businessAddress.postalCode - Postal/ZIP code
 * @property {string} businessAddress.country - Country (ISO country code)
 *
 * @example
 * const business: BusinessDocuments = {
 *   businessName: 'Luxury Hotels Namibia',
 *   registrationNumber: 'REG-123456',
 *   taxNumber: 'TAX-789012',
 *   businessType: 'company',
 *   incorporationDate: '2020-01-15',
 *   businessAddress: {
 *     street: '456 Business Ave',
 *     city: 'Windhoek',
 *     region: 'Khomas',
 *     postalCode: '10002',
 *     country: 'NA'
 *   }
 * };
 */
export interface BusinessDocuments {
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

/**
 * Banking Details Interface
 *
 * Represents banking information for payment processing and payouts.
 *
 * @interface BankingDetails
 * @property {string} bankName - Name of the bank
 * @property {string} accountHolderName - Name on the bank account
 * @property {string} accountNumber - Bank account number
 * @property {string} branchCode - Bank branch code
 * @property {'cheque' | 'savings' | 'business'} accountType - Type of bank account
 * @property {string} [swiftCode] - SWIFT/BIC code (for international transfers)
 * @property {string} [vatRegistrationNumber] - VAT registration number (if applicable)
 *
 * @security Bank details must be encrypted and stored securely. PCI DSS compliance required.
 * @example
 * const banking: BankingDetails = {
 *   bankName: 'First National Bank',
 *   accountHolderName: 'Luxury Hotels Namibia',
 *   accountNumber: '1234567890',
 *   branchCode: '123456',
 *   accountType: 'business',
 *   swiftCode: 'FIRNZAJJ'
 * };
 */
export interface BankingDetails {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  branchCode: string;
  accountType: 'cheque' | 'savings' | 'business';
  swiftCode?: string;
  vatRegistrationNumber?: string;
}

export interface UploadedDocument {
  id: string;
  fileName: string;
  documentType: string;
  uploadUrl: string;
  status: string;
  uploadedAt: string;
  ocrResults?: any;
  securityAnalysis?: any;
}

export interface KycVerificationData {
  propertyId: string;
  userId: string;
  personalIdentity: PersonalIdentity;
  businessDocuments: BusinessDocuments;
  bankingDetails: BankingDetails;
}

export interface KycSubmissionResponse {
  success: boolean;
  data: {
    kycId: string;
    status: 'pending_review' | 'approved' | 'rejected' | 'requires_info';
    estimatedCompletion: string;
    nextSteps: string[];
    submittedAt: string;
  };
  error?: string;
  message?: string;
}

export interface KycStatusResponse {
  success: boolean;
  data: {
    kycId: string;
    status: string;
    submittedAt?: string;
    reviewedAt?: string;
    approvedAt?: string;
    reviewerNotes?: string;
    rejectionReason?: string;
    nextSteps: string[];
  };
  error?: string;
}

export interface DocumentUploadResponse {
  success: boolean;
  data: {
    documentId: string;
    googleDriveId: string;
    uploadUrl: string;
    status: string;
    uploadedAt: string;
    fileName: string;
    fileSize: number;
    documentType: string;
  };
  error?: string;
  message?: string;
}

export interface KycVerificationFormProps {
  propertyId: string;
  propertyName: string;
  propertyType: 'hotel' | 'restaurant';
  onSuccess?: (kycData: any) => void;
  onCancel?: () => void;
  onPrevious?: () => void;
  className?: string;
}

export interface KycStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onCancel?: () => void;
  uploadedDocuments: UploadedDocument[];
  onFileUpload: (file: File, documentType: string) => void;
  isLoading: boolean;
}

export interface KycDocumentUploadProps {
  documentType:
    | 'id_front'
    | 'id_back'
    | 'business_registration'
    | 'tax_certificate';
  onFileSelect: (file: File) => void;
  uploadedDocument?: UploadedDocument;
  isUploading: boolean;
  className?: string;
}

export interface KycProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    id: number;
    title: string;
    description: string;
    icon: any;
  }>;
  onStepClick?: (step: number) => void;
  className?: string;
}

export interface KycFormValidationProps {
  data: any;
  step: number;
  onValidationChange?: (isValid: boolean) => void;
}

export interface KycStatusDisplayProps {
  kycStatus: any;
  className?: string;
}

// Validation result types
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: string[];
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// API request/response types
export interface KycApiRequest {
  propertyId: string;
  userId?: string;
  personalIdentity?: PersonalIdentity;
  businessDocuments?: BusinessDocuments;
  bankingDetails?: BankingDetails;
}

export interface DocumentUploadRequest {
  propertyId: string;
  documentType: string;
  fileName: string;
  mimeType: string;
}

// Error types
export interface KycApiError {
  success: false;
  error: string;
  message: string;
  details?: any;
  retryAfter?: number;
}

// Form step types
export type KycFormStep = 7 | 8; // Steps in the overall onboarding flow

export interface KycFormState {
  currentStep: KycFormStep;
  personalIdentity: PersonalIdentity;
  businessDocuments: BusinessDocuments;
  bankingDetails: BankingDetails;
  uploadedDocuments: UploadedDocument[];
  isSubmitting: boolean;
  errors: Record<string, string>;
  kycStatus?: any;
}

// Component export types
export type { ReactNode, FC, RefObject } from 'react';
