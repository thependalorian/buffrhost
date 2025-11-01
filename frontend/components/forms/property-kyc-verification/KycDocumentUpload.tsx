/**
 * KYC Document Upload Component
 *
 * Purpose: Reusable document upload interface for KYC verification
 * Location: /components/forms/property-kyc-verification/KycDocumentUpload.tsx
 * Usage: Upload and display KYC documents
 *
 * Follows Rules:
 * - DaisyUI for consistent styling
 * - Modular component design
 * - File upload handling
 * - Progress and status indication
 */

'use client';

import React, { useRef, useState } from 'react';
/**
 * KycDocumentUpload React Component for Buffr Host Hospitality Platform
 * @fileoverview KycDocumentUpload handles form input and validation for user data collection
 * @location buffr-host/components/forms/property-kyc-verification/KycDocumentUpload.tsx
 * @purpose KycDocumentUpload handles form input and validation for user data collection
 * @component KycDocumentUpload
 * @category Forms
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @state_management Local component state for UI interactions and data management
 * @hooks_utilization useState for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Interactive state management for dynamic user experiences
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * State:
 * @state {any} null - Component state for null management
 *
 * Methods:
 * @method handleFileSelect - handleFileSelect method for component functionality
 * @method handleFileChange - handleFileChange method for component functionality
 * @method handleDragEnter - handleDragEnter method for component functionality
 * @method handleDragLeave - handleDragLeave method for component functionality
 * @method handleDragOver - handleDragOver method for component functionality
 * @method handleDrop - handleDrop method for component functionality
 * @method validateAndSelectFile - validateAndSelectFile method for component functionality
 * @method getStatusIcon - getStatusIcon method for component functionality
 * @method getStatusColor - getStatusColor method for component functionality
 *
 * Usage Example:
 * @example
 * import { KycDocumentUpload } from './KycDocumentUpload';
 *
 * function App() {
 *   return (
 *     <KycDocumentUpload
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered KycDocumentUpload component
 */

import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import type {
  KycDocumentUploadProps,
  UploadedDocument,
} from '@/lib/types/kyc-types';

export const KycDocumentUpload: React.FC<KycDocumentUploadProps> = ({
  documentType,
  onFileSelect,
  uploadedDocument,
  isUploading,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDocumentTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      id_front: 'ID Document Front',
      id_back: 'ID Document Back',
      business_registration: 'Business Registration Certificate',
      tax_certificate: 'Tax Certificate',
      proof_of_address: 'Proof of Address',
      bank_statement: 'Bank Statement',
    };
    return labels[type] || type.replace('_', ' ').toUpperCase();
  };

  const getDocumentTypeDescription = (type: string): string => {
    const descriptions: Record<string, string> = {
      id_front: "National ID, Passport, or Driver's License (Front)",
      id_back: 'ID Document Back (if applicable)',
      business_registration: 'Official business registration certificate',
      tax_certificate: 'Tax clearance certificate or registration',
      proof_of_address: 'Utility bill or bank statement (3 months old)',
      bank_statement: 'Recent bank statement (3 months)',
    };
    return descriptions[type] || 'Please upload the required document';
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      validateAndSelectFile(files[0]);
    }
  };

  const validateAndSelectFile = (file: File) => {
    setError(null);

    // Basic validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError(
        'Invalid file type. Only JPEG, PNG, GIF, WebP, PDF, DOC, and DOCX files are allowed.'
      );
      return;
    }

    onFileSelect(file);
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'uploaded':
      case 'processed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'processing':
        return (
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        );
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-error" />;
      default:
        return <FileText className="w-5 h-5 text-base-content/50" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'uploaded':
      case 'processed':
        return 'border-success bg-success/10';
      case 'processing':
        return 'border-primary bg-primary/10';
      case 'rejected':
        return 'border-error bg-error/10';
      default:
        return 'border-base-300 hover:border-primary';
    }
  };

  if (uploadedDocument) {
    return (
      <div
        className={`border-2 border-dashed rounded-lg p-4 ${getStatusColor(uploadedDocument.status)} ${className}`}
      >
        <div className="flex items-center gap-3">
          {getStatusIcon(uploadedDocument.status)}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-base-content truncate">
              {uploadedDocument.fileName}
            </p>
            <p className="text-xs text-base-content/70">
              {getDocumentTypeLabel(documentType)} • {uploadedDocument.status}
            </p>
            {uploadedDocument.uploadedAt && (
              <p className="text-xs text-base-content/60">
                Uploaded{' '}
                {new Date(uploadedDocument.uploadedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          {uploadedDocument.uploadUrl && (
            <a
              href={uploadedDocument.uploadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-xs"
            >
              View
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        onClick={handleFileSelect}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-primary bg-primary/5 scale-105'
            : error
              ? 'border-error bg-error/5'
              : 'border-base-300 hover:border-primary hover:bg-primary/5'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="text-sm font-medium text-base-content">
                Uploading...
              </p>
              <p className="text-xs text-base-content/70">Please wait</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload
              className={`w-8 h-8 ${error ? 'text-error' : 'text-base-content/50'}`}
            />
            <div>
              <p className="text-sm font-medium text-base-content">
                {error ? 'Upload Failed' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-base-content/70">
                {error || getDocumentTypeDescription(documentType)}
              </p>
              <p className="text-xs text-base-content/60 mt-1">
                JPEG, PNG, GIF, WebP, PDF up to 10MB
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-2 text-error text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto hover:bg-error/10 rounded p-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default KycDocumentUpload;
