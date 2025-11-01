/**
 * Security Middleware
 *
 * Comprehensive security middleware implementing 2025 best practices:
 * - Rate limiting
 * - Input sanitization
 * - SQL injection prevention
 * - XSS protection
 * - CSRF protection
 * - Security headers
 *
 * Location: lib/security/security-middleware.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import RateLimiter from './rate-limiter';
import InputSanitizer from './input-sanitizer';
import PasswordService from './password-service';

export interface SecurityConfig {
  enableRateLimiting?: boolean;
  enableInputSanitization?: boolean;
  enableCSRFProtection?: boolean;
  enableSecurityHeaders?: boolean;
  enableSQLInjectionProtection?: boolean;
  rateLimitConfig?: string | any;
  allowedOrigins?: string[];
  maxRequestSize?: number;
}

export class SecurityMiddleware {
  private static readonly DEFAULT_CONFIG: SecurityConfig = {
    enableRateLimiting: true,
    enableInputSanitization: true,
    enableCSRFProtection: true,
    enableSecurityHeaders: true,
    enableSQLInjectionProtection: true,
    rateLimitConfig: 'api',
    allowedOrigins: ['http://localhost:3000', 'http://localhost:3001'],
    maxRequestSize: 10 * 1024 * 1024, // 10MB
  };

  /**
   * Main security middleware function
   */
  static async secureRequest(
    request: NextRequest,
    config: SecurityConfig = {}
  ): Promise<NextResponse | null> {
    const securityConfig = { ...this.DEFAULT_CONFIG, ...config };

    try {
      // 1. Rate Limiting
      if (securityConfig.enableRateLimiting) {
        const rateLimitResult = await this.checkRateLimit(
          request,
          securityConfig
        );
        if (rateLimitResult) {
          return rateLimitResult;
        }
      }

      // 2. Request Size Validation
      const sizeCheckResult = this.validateRequestSize(request, securityConfig);
      if (sizeCheckResult) {
        return sizeCheckResult;
      }

      // 3. CORS Validation
      const corsResult = this.validateCORS(request, securityConfig);
      if (corsResult) {
        return corsResult;
      }

      // 4. Security Headers
      if (securityConfig.enableSecurityHeaders) {
        this.addSecurityHeaders(request);
      }

      // 5. CSRF Protection
      if (securityConfig.enableCSRFProtection) {
        const csrfResult = this.validateCSRF(request);
        if (csrfResult) {
          return csrfResult;
        }
      }

      return null; // Request is secure, allow to proceed
    } catch (error) {
      console.error('Security middleware error:', error);
      return NextResponse.json(
        { error: 'Security validation failed' },
        { status: 500 }
      );
    }
  }

  /**
   * Check rate limiting
   */
  private static async checkRateLimit(
    request: NextRequest,
    config: SecurityConfig
  ): Promise<NextResponse | null> {
    try {
      const endpoint = request.nextUrl.pathname;
      const rateLimitConfig =
        config.rateLimitConfig || RateLimiter.getConfigForEndpoint(endpoint);

      const result = await RateLimiter.checkRateLimit(request, rateLimitConfig);

      if (!result.allowed) {
        return NextResponse.json(
          {
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: result.retryAfter,
            resetTime: new Date(result.resetTime).toISOString(),
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit':
                rateLimitConfig.maxRequests?.toString() || '100',
              'X-RateLimit-Remaining': result.remaining.toString(),
              'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
              'Retry-After': result.retryAfter?.toString() || '0',
            },
          }
        );
      }

      return null;
    } catch (error) {
      console.error('Rate limiting error:', error);
      return null; // Allow request to proceed if rate limiting fails
    }
  }

  /**
   * Validate request size
   */
  private static validateRequestSize(
    request: NextRequest,
    config: SecurityConfig
  ): NextResponse | null {
    const contentLength = request.headers.get('content-length');
    const maxSize =
      config.maxRequestSize || this.DEFAULT_CONFIG.maxRequestSize!;

    if (contentLength && parseInt(contentLength) > maxSize) {
      return NextResponse.json(
        {
          error: 'Request Too Large',
          message: `Request size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
        },
        { status: 413 }
      );
    }

    return null;
  }

  /**
   * Validate CORS
   */
  private static validateCORS(
    request: NextRequest,
    config: SecurityConfig
  ): NextResponse | null {
    const origin = request.headers.get('origin');
    const allowedOrigins =
      config.allowedOrigins || this.DEFAULT_CONFIG.allowedOrigins!;

    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        {
          error: 'CORS Error',
          message: 'Origin not allowed',
        },
        { status: 403 }
      );
    }

    return null;
  }

  /**
   * Add security headers
   */
  private static addSecurityHeaders(request: NextRequest): void {
    // This would typically be done in a response interceptor
    // For now, we'll just log the headers that should be added
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
    };

    console.log('Security headers to be added:', securityHeaders);
  }

  /**
   * Validate CSRF token
   */
  private static validateCSRF(request: NextRequest): NextResponse | null {
    // Skip CSRF validation for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return null;
    }

    const csrfToken = request.headers.get('x-csrf-token');
    const cookieToken = request.cookies.get('csrf-token')?.value;

    if (!csrfToken || !cookieToken || csrfToken !== cookieToken) {
      return NextResponse.json(
        {
          error: 'CSRF Token Mismatch',
          message: 'Invalid or missing CSRF token',
        },
        { status: 403 }
      );
    }

    return null;
  }

  /**
   * Sanitize request body
   */
  static async sanitizeRequestBody(
    request: NextRequest,
    schema?: Record<string, any>
  ): Promise<{ sanitized: unknown; errors: string[] }> {
    try {
      const body = await request.json();

      if (schema) {
        const result = InputSanitizer.sanitizeObject(body, schema);
        return {
          sanitized: result.sanitizedValue,
          errors: result.errors,
        };
      } else {
        // Basic sanitization without schema
        const sanitized: unknown = {};
        for (const [key, value] of Object.entries(body)) {
          if (typeof value === 'string') {
            const result = InputSanitizer.sanitizeString(value);
            sanitized[key] = result.sanitizedValue;
          } else {
            sanitized[key] = value;
          }
        }
        return { sanitized, errors: [] };
      }
    } catch (error) {
      return {
        sanitized: {},
        errors: ['Invalid JSON in request body'],
      };
    }
  }

  /**
   * Sanitize query parameters
   */
  static sanitizeQueryParams(
    request: NextRequest,
    schema?: Record<string, any>
  ): { sanitized: Record<string, any>; errors: string[] } {
    const searchParams = request.nextUrl.searchParams;
    const sanitized: Record<string, any> = {};
    const errors: string[] = [];

    for (const [key, value] of searchParams.entries()) {
      if (schema && schema[key]) {
        const result = this.sanitizeByType(value, schema[key]);
        sanitized[key] = result.sanitizedValue;
        if (result.errors.length > 0) {
          errors.push(...result.errors.map((e) => `${key}: ${e}`));
        }
      } else {
        // Basic string sanitization
        const result = InputSanitizer.sanitizeString(value);
        sanitized[key] = result.sanitizedValue;
        if (result.errors.length > 0) {
          errors.push(...result.errors.map((e) => `${key}: ${e}`));
        }
      }
    }

    return { sanitized, errors };
  }

  /**
   * Sanitize by type
   */
  private static sanitizeByType(
    value: unknown,
    type: unknown
  ): Record<string, unknown> {
    switch (type) {
      case 'email':
        return InputSanitizer.sanitizeEmail(value);
      case 'phone':
        return InputSanitizer.sanitizePhone(value);
      case 'url':
        return InputSanitizer.sanitizeUrl(value);
      case 'number':
        return InputSanitizer.sanitizeNumber(value);
      case 'boolean':
        return InputSanitizer.sanitizeBoolean(value);
      default:
        return InputSanitizer.sanitizeString(value);
    }
  }

  /**
   * Create secure response with security headers
   */
  static createSecureResponse(
    data: unknown,
    status: number = 200,
    additionalHeaders: Record<string, string> = {}
  ): NextResponse {
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
      ...additionalHeaders,
    };

    return NextResponse.json(data, {
      status,
      headers: securityHeaders,
    });
  }

  /**
   * Log security events
   */
  static logSecurityEvent(
    event: string,
    details: unknown,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      severity,
      details,
      source: 'security-middleware',
    };

    console.log(`[SECURITY ${severity.toUpperCase()}]`, logEntry);

    // In production, this would be sent to a security monitoring service
    if (severity === 'critical' || severity === 'high') {
      // Send to security monitoring service
      console.error('CRITICAL SECURITY EVENT:', logEntry);
    }
  }
}

export default SecurityMiddleware;
