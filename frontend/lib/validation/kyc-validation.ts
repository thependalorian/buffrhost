/**
 * KYC Validation Schemas
 *
 * Purpose: Centralized validation schemas for KYC verification
 * Location: /lib/validation/kyc-validation.ts
 * Usage: Shared validation logic across components and APIs
 *
 * Follows Rules:
 * - Comprehensive validation
 * - TypeScript type safety
 * - Modular organization
 */

import { z } from 'zod';

// Personal Identity Validation Schema
export const personalIdentitySchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Full name contains invalid characters'),

  idNumber: z
    .string()
    .min(5, 'ID number is required')
    .max(50, 'ID number is too long')
    .regex(/^[A-Z0-9\/-]+$/, 'ID number contains invalid characters'),

  idType: z.enum(['national_id', 'passport', 'drivers_license'], {
    errorMap: () => ({ message: 'Invalid ID type' }),
  }),

  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .refine((date) => {
      const birthDate = new Date(date);
      const age = Date.now() - birthDate.getTime();
      const ageInYears = age / (365.25 * 24 * 60 * 60 * 1000);
      return ageInYears >= 18 && ageInYears <= 120;
    }, 'Age must be between 18 and 120 years'),

  nationality: z
    .string()
    .min(2, 'Nationality is required')
    .max(50, 'Nationality is too long'),

  address: z.object({
    street: z
      .string()
      .min(5, 'Street address is required')
      .max(200, 'Street address is too long'),
    city: z.string().min(2, 'City is required').max(100, 'City is too long'),
    region: z
      .string()
      .min(2, 'Region is required')
      .max(100, 'Region is too long'),
    postalCode: z
      .string()
      .min(4, 'Postal code is required')
      .max(20, 'Postal code is too long')
      .regex(/^[A-Z0-9\s-]+$/, 'Postal code contains invalid characters'),
    country: z
      .string()
      .min(2, 'Country is required')
      .max(50, 'Country is too long'),
  }),
});

// Business Documents Validation Schema
export const businessDocumentsSchema = z.object({
  businessName: z
    .string()
    .min(2, 'Business name is required')
    .max(200, 'Business name is too long'),

  registrationNumber: z
    .string()
    .min(5, 'Registration number is required')
    .max(50, 'Registration number is too long')
    .regex(/^[A-Z0-9\/-]+$/, 'Registration number contains invalid characters'),

  taxNumber: z
    .string()
    .min(5, 'Tax number is required')
    .max(50, 'Tax number is too long')
    .regex(/^[A-Z0-9\/-]+$/, 'Tax number contains invalid characters'),

  businessType: z.enum(
    ['sole_proprietor', 'partnership', 'company', 'trust', 'other'],
    {
      errorMap: () => ({ message: 'Invalid business type' }),
    }
  ),

  incorporationDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .optional(),

  businessAddress: z.object({
    street: z
      .string()
      .min(5, 'Business address is required')
      .max(200, 'Business address is too long'),
    city: z.string().min(2, 'City is required').max(100, 'City is too long'),
    region: z
      .string()
      .min(2, 'Region is required')
      .max(100, 'Region is too long'),
    postalCode: z
      .string()
      .min(4, 'Postal code is required')
      .max(20, 'Postal code is too long'),
    country: z
      .string()
      .min(2, 'Country is required')
      .max(50, 'Country is too long'),
  }),
});

// Banking Details Validation Schema
export const bankingDetailsSchema = z.object({
  bankName: z
    .string()
    .min(2, 'Bank name is required')
    .max(100, 'Bank name is too long'),

  accountHolderName: z
    .string()
    .min(2, 'Account holder name is required')
    .max(100, 'Account holder name is too long'),

  accountNumber: z
    .string()
    .min(5, 'Account number is required')
    .max(50, 'Account number is too long')
    .regex(/^[0-9]+$/, 'Account number must contain only digits'),

  branchCode: z
    .string()
    .min(4, 'Branch code is required')
    .max(20, 'Branch code is too long')
    .regex(/^[0-9\-]+$/, 'Branch code contains invalid characters'),

  accountType: z.enum(['cheque', 'savings', 'business'], {
    errorMap: () => ({ message: 'Invalid account type' }),
  }),

  swiftCode: z
    .string()
    .max(20, 'SWIFT code is too long')
    .regex(/^[A-Z0-9]{8,11}$/, 'Invalid SWIFT code format')
    .optional(),

  vatRegistrationNumber: z
    .string()
    .max(50, 'VAT registration number is too long')
    .optional(),
});

// Complete KYC Submission Validation Schema
export const kycSubmissionSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  userId: z.string().uuid('Invalid user ID'),
  personalIdentity: personalIdentitySchema,
  businessDocuments: businessDocumentsSchema,
  bankingDetails: bankingDetailsSchema,
});

// Document Upload Validation Schema
export const documentUploadSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  documentType: z.enum([
    'id_front',
    'id_back',
    'business_registration',
    'tax_certificate',
    'proof_of_address',
    'bank_statement',
  ]),
  fileName: z.string().min(1, 'File name is required').max(255),
  mimeType: z
    .string()
    .refine(
      (type) =>
        [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'application/pdf',
        ].includes(type),
      'Invalid file type. Only JPEG, PNG, GIF, WebP, and PDF files are allowed.'
    ),
});

// File size validation helper
export const validateFileSize = (
  file: File,
  maxSizeMB: number = 10
): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// File type validation helper
export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  return allowedTypes.includes(file.type);
};

// File extension validation helper
export const validateFileExtension = (fileName: string): boolean => {
  const allowedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.pdf',
    '.doc',
    '.docx',
  ];
  const fileExt = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return allowedExtensions.includes(fileExt);
};

// Comprehensive file validation
export const validateFile = (
  file: File
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Size validation
  if (!validateFileSize(file)) {
    errors.push('File size must be less than 10MB');
  }

  // Type validation
  if (!validateFileType(file)) {
    errors.push(
      'Invalid file type. Only JPEG, PNG, GIF, WebP, PDF, DOC, and DOCX files are allowed.'
    );
  }

  // Extension validation
  if (!validateFileExtension(file.name)) {
    errors.push('Invalid file extension');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Form validation helpers
export const validatePersonalIdentity = (
  data: any
): { isValid: boolean; errors: Record<string, string[]> } => {
  try {
    personalIdentitySchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error: any) {
    const errors: Record<string, string[]> = {};
    error.errors.forEach((err: any) => {
      const path = err.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path].push(err.message);
    });
    return { isValid: false, errors };
  }
};

export const validateBusinessDocuments = (
  data: any
): { isValid: boolean; errors: Record<string, string[]> } => {
  try {
    businessDocumentsSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error: any) {
    const errors: Record<string, string[]> = {};
    error.errors.forEach((err: any) => {
      const path = err.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path].push(err.message);
    });
    return { isValid: false, errors };
  }
};

export const validateBankingDetails = (
  data: any
): { isValid: boolean; errors: Record<string, string[]> } => {
  try {
    bankingDetailsSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error: any) {
    const errors: Record<string, string[]> = {};
    error.errors.forEach((err: any) => {
      const path = err.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path].push(err.message);
    });
    return { isValid: false, errors };
  }
};

export const validateCompleteKycSubmission = (
  data: any
): { isValid: boolean; errors: Record<string, string[]> } => {
  try {
    kycSubmissionSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error: any) {
    const errors: Record<string, string[]> = {};
    error.errors.forEach((err: any) => {
      const path = err.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path].push(err.message);
    });
    return { isValid: false, errors };
  }
};

// Export validation utilities
export const KYC_VALIDATION_UTILS = {
  validateFile,
  validateFileSize,
  validateFileType,
  validateFileExtension,
  validatePersonalIdentity,
  validateBusinessDocuments,
  validateBankingDetails,
  validateCompleteKycSubmission,
};
