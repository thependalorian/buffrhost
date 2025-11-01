/**
 * Input Sanitization Service
 *
 * Implements 2025 best practices for input sanitization:
 * - XSS prevention
 * - SQL injection prevention
 * - Input validation and normalization
 * - Data type enforcement
 *
 * Location: lib/security/input-sanitizer.ts
 */

import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

export interface SanitizationOptions {
  allowHtml?: boolean;
  maxLength?: number;
  minLength?: number;
  trim?: boolean;
  normalize?: boolean;
  removeNullBytes?: boolean;
  allowedTags?: string[];
  allowedAttributes?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  sanitizedValue: unknown;
  errors: string[];
  warnings: string[];
}

export class InputSanitizer {
  private static readonly MAX_STRING_LENGTH = 10000;
  private static readonly MAX_EMAIL_LENGTH = 254;
  private static readonly MAX_PHONE_LENGTH = 20;
  private static readonly MAX_URL_LENGTH = 2048;

  /**
   * Sanitize string input with comprehensive protection
   */
  static sanitizeString(
    input: unknown,
    options: SanitizationOptions = {}
  ): ValidationResult {
    const {
      allowHtml = false,
      maxLength = this.MAX_STRING_LENGTH,
      minLength = 0,
      trim = true,
      normalize = true,
      removeNullBytes = true,
      allowedTags = [],
      allowedAttributes = [],
    } = options;

    const errors: string[] = [];
    const warnings: string[] = [];

    // Type validation
    if (typeof input !== 'string' && input !== null && input !== undefined) {
      return {
        isValid: false,
        sanitizedValue: '',
        errors: ['Input must be a string'],
        warnings: [],
      };
    }

    if (input === null || input === undefined) {
      return {
        isValid: true,
        sanitizedValue: '',
        errors: [],
        warnings: [],
      };
    }

    let sanitized = String(input);

    // Remove null bytes
    if (removeNullBytes) {
      sanitized = sanitized.replace(/\0/g, '');
    }

    // Trim whitespace
    if (trim) {
      sanitized = sanitized.trim();
    }

    // Normalize unicode
    if (normalize) {
      sanitized = sanitized.normalize('NFC');
    }

    // Length validation
    if (sanitized.length < minLength) {
      errors.push(`Input must be at least ${minLength} characters long`);
    }

    if (sanitized.length > maxLength) {
      errors.push(`Input must be no more than ${maxLength} characters long`);
      sanitized = sanitized.substring(0, maxLength);
    }

    // HTML sanitization
    if (!allowHtml) {
      // Remove all HTML tags
      sanitized = sanitized.replace(/<[^>]*>/g, '');
    } else {
      // Sanitize HTML with DOMPurify
      const purifyOptions = {
        ALLOWED_TAGS:
          allowedTags.length > 0
            ? allowedTags
            : ['b', 'i', 'em', 'strong', 'p', 'br'],
        ALLOWED_ATTR:
          allowedAttributes.length > 0 ? allowedAttributes : ['href', 'title'],
        KEEP_CONTENT: true,
      };
      sanitized = DOMPurify.sanitize(sanitized, purifyOptions);
    }

    // Check for potential XSS
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>.*?<\/embed>/gi,
      /<link[^>]*>.*?<\/link>/gi,
      /<meta[^>]*>.*?<\/meta>/gi,
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(sanitized)) {
        errors.push('Input contains potentially malicious content');
        sanitized = sanitized.replace(pattern, '');
      }
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: sanitized,
      errors,
      warnings,
    };
  }

  /**
   * Sanitize email input
   */
  static sanitizeEmail(input: unknown): ValidationResult {
    const stringResult = this.sanitizeString(input, {
      maxLength: this.MAX_EMAIL_LENGTH,
      trim: true,
      normalize: true,
    });

    if (!stringResult.isValid) {
      return stringResult;
    }

    const email = stringResult.sanitizedValue;
    const errors: string[] = [...stringResult.errors];
    const warnings: string[] = [...stringResult.warnings];

    // Email validation
    if (email && !validator.isEmail(email)) {
      errors.push('Invalid email format');
    }

    // Check for suspicious patterns
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
      errors.push('Email contains invalid dot patterns');
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: email,
      errors,
      warnings,
    };
  }

  /**
   * Sanitize phone number input
   */
  static sanitizePhone(input: unknown): ValidationResult {
    const stringResult = this.sanitizeString(input, {
      maxLength: this.MAX_PHONE_LENGTH,
      trim: true,
      normalize: true,
    });

    if (!stringResult.isValid) {
      return stringResult;
    }

    let phone = stringResult.sanitizedValue;
    const errors: string[] = [...stringResult.errors];
    const warnings: string[] = [...stringResult.warnings];

    // Remove all non-digit characters except + at the beginning
    phone = phone.replace(/[^\d+]/g, '');

    // Validate phone format
    if (phone && !validator.isMobilePhone(phone)) {
      errors.push('Invalid phone number format');
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: phone,
      errors,
      warnings,
    };
  }

  /**
   * Sanitize URL input
   */
  static sanitizeUrl(input: unknown): ValidationResult {
    const stringResult = this.sanitizeString(input, {
      maxLength: this.MAX_URL_LENGTH,
      trim: true,
      normalize: true,
    });

    if (!stringResult.isValid) {
      return stringResult;
    }

    const url = stringResult.sanitizedValue;
    const errors: string[] = [...stringResult.errors];
    const warnings: string[] = [...stringResult.warnings];

    // URL validation
    if (
      url &&
      !validator.isURL(url, {
        protocols: ['http', 'https'],
        require_protocol: true,
      })
    ) {
      errors.push('Invalid URL format');
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: url,
      errors,
      warnings,
    };
  }

  /**
   * Sanitize numeric input
   */
  static sanitizeNumber(
    input: unknown,
    options: {
      min?: number;
      max?: number;
      integer?: boolean;
      positive?: boolean;
    } = {}
  ): ValidationResult {
    const { min, max, integer = false, positive = false } = options;
    const errors: string[] = [];
    const warnings: string[] = [];

    // Convert to number
    let number: number;
    if (typeof input === 'number') {
      number = input;
    } else if (typeof input === 'string') {
      number = parseFloat(input);
    } else {
      return {
        isValid: false,
        sanitizedValue: 0,
        errors: ['Input must be a number'],
        warnings: [],
      };
    }

    // Check if valid number
    if (isNaN(number) || !isFinite(number)) {
      return {
        isValid: false,
        sanitizedValue: 0,
        errors: ['Invalid number format'],
        warnings: [],
      };
    }

    // Integer validation
    if (integer && !Number.isInteger(number)) {
      errors.push('Number must be an integer');
      number = Math.round(number);
    }

    // Positive validation
    if (positive && number < 0) {
      errors.push('Number must be positive');
      number = Math.abs(number);
    }

    // Range validation
    if (min !== undefined && number < min) {
      errors.push(`Number must be at least ${min}`);
    }

    if (max !== undefined && number > max) {
      errors.push(`Number must be no more than ${max}`);
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: number,
      errors,
      warnings,
    };
  }

  /**
   * Sanitize boolean input
   */
  static sanitizeBoolean(input: unknown): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    let boolean: boolean;

    if (typeof input === 'boolean') {
      boolean = input;
    } else if (typeof input === 'string') {
      const lower = input.toLowerCase().trim();
      if (['true', '1', 'yes', 'on'].includes(lower)) {
        boolean = true;
      } else if (['false', '0', 'no', 'off'].includes(lower)) {
        boolean = false;
      } else {
        return {
          isValid: false,
          sanitizedValue: false,
          errors: ['Invalid boolean format'],
          warnings: [],
        };
      }
    } else if (typeof input === 'number') {
      boolean = input !== 0;
    } else {
      return {
        isValid: false,
        sanitizedValue: false,
        errors: ['Input must be a boolean'],
        warnings: [],
      };
    }

    return {
      isValid: true,
      sanitizedValue: boolean,
      errors,
      warnings,
    };
  }

  /**
   * Sanitize object input recursively
   */
  static sanitizeObject(
    input: unknown,
    schema: Record<string, any>
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const sanitized: unknown = {};

    if (typeof input !== 'object' || input === null) {
      return {
        isValid: false,
        sanitizedValue: {},
        errors: ['Input must be an object'],
        warnings: [],
      };
    }

    for (const [key, value] of Object.entries(schema)) {
      const sanitizedKey = this.sanitizeString(key, {
        maxLength: 100,
      }).sanitizedValue;

      if (value.type === 'string') {
        const result = this.sanitizeString(input[key], value.options || {});
        if (!result.isValid) {
          errors.push(...result.errors.map((e) => `${key}: ${e}`));
        }
        sanitized[sanitizedKey] = result.sanitizedValue;
      } else if (value.type === 'email') {
        const result = this.sanitizeEmail(input[key]);
        if (!result.isValid) {
          errors.push(...result.errors.map((e) => `${key}: ${e}`));
        }
        sanitized[sanitizedKey] = result.sanitizedValue;
      } else if (value.type === 'phone') {
        const result = this.sanitizePhone(input[key]);
        if (!result.isValid) {
          errors.push(...result.errors.map((e) => `${key}: ${e}`));
        }
        sanitized[sanitizedKey] = result.sanitizedValue;
      } else if (value.type === 'url') {
        const result = this.sanitizeUrl(input[key]);
        if (!result.isValid) {
          errors.push(...result.errors.map((e) => `${key}: ${e}`));
        }
        sanitized[sanitizedKey] = result.sanitizedValue;
      } else if (value.type === 'number') {
        const result = this.sanitizeNumber(input[key], value.options || {});
        if (!result.isValid) {
          errors.push(...result.errors.map((e) => `${key}: ${e}`));
        }
        sanitized[sanitizedKey] = result.sanitizedValue;
      } else if (value.type === 'boolean') {
        const result = this.sanitizeBoolean(input[key]);
        if (!result.isValid) {
          errors.push(...result.errors.map((e) => `${key}: ${e}`));
        }
        sanitized[sanitizedKey] = result.sanitizedValue;
      } else if (value.type === 'object') {
        const result = this.sanitizeObject(input[key], value.schema || {});
        if (!result.isValid) {
          errors.push(...result.errors.map((e) => `${key}: ${e}`));
        }
        sanitized[sanitizedKey] = result.sanitizedValue;
      }
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: sanitized,
      errors,
      warnings,
    };
  }

  /**
   * Sanitize SQL query parameters
   */
  static sanitizeSqlParameter(input: unknown): string {
    if (input === null || input === undefined) {
      return 'NULL';
    }

    if (typeof input === 'string') {
      // Escape single quotes and backslashes
      return `'${input.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
    }

    if (typeof input === 'number') {
      return String(input);
    }

    if (typeof input === 'boolean') {
      return input ? 'TRUE' : 'FALSE';
    }

    // For other types, convert to string and escape
    return `'${String(input).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
  }

  /**
   * Validate and sanitize file upload
   */
  static sanitizeFileUpload(
    file: unknown,
    options: {
      maxSize?: number;
      allowedTypes?: string[];
      allowedExtensions?: string[];
    } = {}
  ): ValidationResult {
    const {
      maxSize = 10 * 1024 * 1024,
      allowedTypes = [],
      allowedExtensions = [],
    } = options;
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!file || typeof file !== 'object') {
      return {
        isValid: false,
        sanitizedValue: null,
        errors: ['Invalid file object'],
        warnings: [],
      };
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${maxSize / 1024 / 1024}MB`);
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }

    // Check file extension
    if (allowedExtensions.length > 0) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        errors.push(`File extension .${extension} is not allowed`);
      }
    }

    // Sanitize filename
    const sanitizedName = this.sanitizeString(file.name, {
      maxLength: 255,
      trim: true,
      normalize: true,
    }).sanitizedValue;

    return {
      isValid: errors.length === 0,
      sanitizedValue: {
        ...file,
        name: sanitizedName,
      },
      errors,
      warnings,
    };
  }
}

export default InputSanitizer;
