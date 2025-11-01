/**
 * KYC Security Utilities
 *
 * Purpose: Centralized security utilities for KYC operations
 * Location: /lib/security/kyc-security.ts
 * Usage: Security functions specific to KYC/KYB processes
 *
 * Follows Rules:
 * - Enterprise-grade security implementation
 * - Data encryption and protection
 * - Fraud detection capabilities
 * - Secure file handling
 */

import crypto from 'crypto';

// Encryption key for sensitive KYC data (should be in environment variables)
const ENCRYPTION_KEY =
  process.env.KYC_ENCRYPTION_KEY || 'default-key-change-in-production';
const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypt sensitive KYC data
 */
export function encryptSensitiveData(data: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Return format: iv:authTag:encryptedData
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt sensitive KYC data
 */
export function decryptSensitiveData(encryptedData: string): string {
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }

  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];

  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Generate secure document ID for file storage
 */
export function generateSecureDocumentId(): string {
  return crypto.randomUUID();
}

/**
 * Hash document content for integrity verification
 */
export function hashDocumentContent(content: Buffer): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Validate document integrity
 */
export function validateDocumentIntegrity(
  content: Buffer,
  expectedHash: string
): boolean {
  const actualHash = hashDocumentContent(content);
  return crypto.timingSafeEqual(
    Buffer.from(actualHash, 'hex'),
    Buffer.from(expectedHash, 'hex')
  );
}

/**
 * Generate document access token with expiration
 */
export function generateDocumentAccessToken(
  documentId: string,
  expiresIn: number = 3600
): string {
  const payload = {
    documentId,
    exp: Date.now() + expiresIn * 1000,
    iat: Date.now(),
  };

  const payloadString = JSON.stringify(payload);
  const signature = crypto
    .createHmac('sha256', ENCRYPTION_KEY)
    .update(payloadString)
    .digest('hex');

  return Buffer.from(payloadString).toString('base64') + '.' + signature;
}

/**
 * Validate document access token
 */
export function validateDocumentAccessToken(
  token: string
): { documentId: string } | null {
  try {
    const [payloadBase64, signature] = token.split('.');
    const payloadString = Buffer.from(payloadBase64, 'base64').toString('utf8');
    const payload = JSON.parse(payloadString);

    // Check expiration
    if (Date.now() > payload.exp) {
      return null;
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', ENCRYPTION_KEY)
      .update(payloadString)
      .digest('hex');

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      )
    ) {
      return null;
    }

    return { documentId: payload.documentId };
  } catch (error) {
    return null;
  }
}

/**
 * Detect potential fraudulent patterns in KYC data
 */
export function detectFraudPatterns(kycData: any): {
  riskLevel: 'low' | 'medium' | 'high';
  flags: string[];
} {
  const flags: string[] = [];
  let riskScore = 0;

  // Check for suspicious patterns
  if (kycData.personalIdentity) {
    const personal = kycData.personalIdentity;

    // Age verification
    if (personal.dateOfBirth) {
      const age =
        (Date.now() - new Date(personal.dateOfBirth).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000);
      if (age < 18 || age > 120) {
        flags.push('Suspicious age');
        riskScore += 2;
      }
    }

    // Address consistency check (simplified)
    if (
      personal.address &&
      personal.address.country !== 'Namibia' &&
      personal.nationality === 'Namibian'
    ) {
      flags.push('Address-nationality mismatch');
      riskScore += 1;
    }
  }

  if (kycData.businessDocuments) {
    const business = kycData.businessDocuments;

    // Business registration format check
    if (
      business.registrationNumber &&
      !/^CC\/\d{4}\/\d{5}$/.test(business.registrationNumber)
    ) {
      flags.push('Invalid registration number format');
      riskScore += 1;
    }

    // Recent incorporation check
    if (business.incorporationDate) {
      const incorporationAge =
        (Date.now() - new Date(business.incorporationDate).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000);
      if (incorporationAge < 1) {
        flags.push('Very recent incorporation');
        riskScore += 1;
      }
    }
  }

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (riskScore >= 3) {
    riskLevel = 'high';
  } else if (riskScore >= 1) {
    riskLevel = 'medium';
  }

  return { riskLevel, flags };
}

/**
 * Sanitize file names for secure storage
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100);
}

/**
 * Check file for malware patterns (simplified)
 */
export function basicMalwareCheck(content: Buffer): boolean {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /%PDF-1\.\d+\s*%EOF/i, // Check for PDF structure
  ];

  const contentString = content.toString(
    'utf8',
    0,
    Math.min(1024, content.length)
  );

  return !suspiciousPatterns.some((pattern) => pattern.test(contentString));
}

/**
 * Generate compliance audit log entry
 */
export function generateAuditLog(
  action: string,
  userId: string,
  resourceId: string,
  details: any
): object {
  return {
    timestamp: new Date().toISOString(),
    action,
    userId,
    resourceId,
    details,
    ipAddress: 'system', // Should be populated from request context
    userAgent: 'system', // Should be populated from request context
  };
}

// Export security utilities
export const KYC_SECURITY_UTILS = {
  encryptSensitiveData,
  decryptSensitiveData,
  generateSecureDocumentId,
  hashDocumentContent,
  validateDocumentIntegrity,
  generateDocumentAccessToken,
  validateDocumentAccessToken,
  detectFraudPatterns,
  sanitizeFileName,
  basicMalwareCheck,
  generateAuditLog,
};
