/**
 * KYC API Utilities
 *
 * Purpose: Centralized API utilities for KYC operations
 * Location: /lib/api/kyc-api.ts
 * Usage: Client-side API calls for KYC verification
 *
 * Follows Rules:
 * - Asynchronous data handling
 * - Comprehensive error handling
 * - API response documentation
 * - TypeScript type safety
 */

import type {
  KycVerificationData,
  KycSubmissionResponse,
  KycStatusResponse,
  DocumentUploadResponse,
  KycApiError,
} from '@/lib/types/kyc-types';

/**
 * Submit KYC verification data
 * Response Structure:
 * {
 *   "success": true,
 *   "data": {
 *     "kycId": "uuid",
 *     "status": "pending_review",
 *     "estimatedCompletion": "2025-01-30T10:00:00Z",
 *     "nextSteps": ["Document verification in progress", ...],
 *     "submittedAt": "2025-01-28T10:00:00Z"
 *   }
 * }
 */
export const submitKycVerification = async (
  data: KycVerificationData
): Promise<KycSubmissionResponse> => {
  try {
    const response = await fetch('/api/v1/properties/kyc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to submit KYC verification');
    }

    return result;
  } catch (error: any) {
    console.error('KYC submission error:', error);
    return {
      success: false,
      data: {
        kycId: '',
        status: 'pending_review' as const,
        estimatedCompletion: '',
        nextSteps: [],
        submittedAt: '',
      },
      error: 'SubmissionError',
      message:
        error.message || 'Failed to submit KYC verification. Please try again.',
    };
  }
};

/**
 * Get KYC verification status for a property
 * Response Structure:
 * {
 *   "success": true,
 *   "data": {
 *     "kycId": "uuid",
 *     "status": "pending_review|approved|rejected|requires_info",
 *     "submittedAt": "2025-01-28T10:00:00Z",
 *     "reviewedAt": "2025-01-29T14:30:00Z",
 *     "reviewerNotes": "...",
 *     "nextSteps": [...]
 *   }
 * }
 */
export const getKycStatus = async (
  propertyId: string
): Promise<KycStatusResponse> => {
  try {
    const response = await fetch(
      `/api/v1/properties/kyc?propertyId=${propertyId}`
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to retrieve KYC status');
    }

    return result;
  } catch (error: any) {
    console.error('KYC status check error:', error);
    return {
      success: false,
      data: {
        kycId: '',
        status: 'not_started',
        nextSteps: ['Contact support if this error persists'],
      },
      error: 'StatusCheckError',
      message: error.message || 'Failed to retrieve KYC status',
    };
  }
};

/**
 * Upload KYC document
 * Expected: multipart/form-data with 'document' field
 * Additional fields: propertyId, documentType
 *
 * Response Structure:
 * {
 *   "success": true,
 *   "data": {
 *     "documentId": "uuid",
 *     "googleDriveId": "drive_file_id",
 *     "uploadUrl": "https://drive.google.com/file/d/...",
 *     "status": "uploaded",
 *     "uploadedAt": "2025-01-28T10:00:00Z",
 *     "fileName": "document.pdf",
 *     "fileSize": 1024000,
 *     "documentType": "id_front"
 *   }
 * }
 */
export const uploadKycDocument = async (
  propertyId: string,
  documentType: string,
  file: File
): Promise<DocumentUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('propertyId', propertyId);
    formData.append('documentType', documentType);

    const response = await fetch('/api/v1/properties/kyc/documents', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to upload document');
    }

    return result;
  } catch (error: any) {
    console.error('Document upload error:', error);
    return {
      success: false,
      data: {
        documentId: '',
        googleDriveId: '',
        uploadUrl: '',
        status: 'failed',
        uploadedAt: '',
        fileName: '',
        fileSize: 0,
        documentType,
      },
      error: 'UploadError',
      message: error.message || 'Failed to upload document. Please try again.',
    };
  }
};

/**
 * Get uploaded documents for a property
 * Response Structure:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "documentId": "uuid",
 *       "documentType": "id_front",
 *       "fileName": "passport.pdf",
 *       "uploadUrl": "https://drive.google.com/file/d/...",
 *       "status": "uploaded|processing|processed",
 *       "uploadedAt": "2025-01-28T10:00:00Z"
 *     }
 *   ]
 * }
 */
export const getUploadedDocuments = async (
  propertyId: string
): Promise<{
  success: boolean;
  data: any[];
  error?: string;
  message?: string;
}> => {
  try {
    const response = await fetch(
      `/api/v1/properties/kyc/documents?propertyId=${propertyId}`
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to retrieve documents');
    }

    return result;
  } catch (error: any) {
    console.error('Document retrieval error:', error);
    return {
      success: false,
      data: [],
      error: 'RetrievalError',
      message: error.message || 'Failed to retrieve documents',
    };
  }
};

/**
 * Retry failed document upload
 */
export const retryDocumentUpload = async (
  propertyId: string,
  documentType: string,
  file: File
): Promise<DocumentUploadResponse> => {
  // Add retry logic with exponential backoff
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const result = await uploadKycDocument(propertyId, documentType, file);
      if (result.success) {
        return result;
      }

      attempts++;
      if (attempts < maxAttempts) {
        // Exponential backoff: 1s, 2s, 4s
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempts) * 1000)
        );
      }
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        throw error;
      }
      // Wait before retry
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempts) * 1000)
      );
    }
  }

  return {
    success: false,
    data: {
      documentId: '',
      googleDriveId: '',
      uploadUrl: '',
      status: 'failed',
      uploadedAt: '',
      fileName: '',
      fileSize: 0,
      documentType,
    },
    error: 'MaxRetriesExceeded',
    message: 'Failed to upload document after multiple attempts',
  };
};

/**
 * Validate KYC data before submission
 */
export const validateKycData = async (
  data: KycVerificationData
): Promise<{ isValid: boolean; errors: Record<string, string[]> }> => {
  // This would call a validation endpoint or use client-side validation
  // For now, we'll do basic validation
  const errors: Record<string, string[]> = {};

  // Basic validation
  if (!data.personalIdentity.fullName) {
    errors['personalIdentity.fullName'] = ['Full name is required'];
  }

  if (!data.businessDocuments.businessName) {
    errors['businessDocuments.businessName'] = ['Business name is required'];
  }

  if (!data.bankingDetails.accountNumber) {
    errors['bankingDetails.accountNumber'] = ['Account number is required'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Check API health status
 */
export const checkKycApiHealth = async (): Promise<{
  success: boolean;
  status: string;
  timestamp: string;
}> => {
  try {
    const response = await fetch('/api/v1/health');
    const result = await response.json();

    return {
      success: response.ok,
      status: result.status || 'unknown',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      status: 'error',
      timestamp: new Date().toISOString(),
    };
  }
};

// Export API utilities
export const KYC_API_UTILS = {
  submitKycVerification,
  getKycStatus,
  uploadKycDocument,
  getUploadedDocuments,
  retryDocumentUpload,
  validateKycData,
  checkKycApiHealth,
};
