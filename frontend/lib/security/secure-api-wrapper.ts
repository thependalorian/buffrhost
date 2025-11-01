/**
 * Secure API Route Wrapper
 *
 * Wraps API routes with comprehensive security measures:
 * - Rate limiting
 * - Input sanitization
 * - SQL injection prevention
 * - XSS protection
 * - CSRF protection
 *
 * Location: lib/security/secure-api-wrapper.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import SecurityMiddleware from './security-middleware';
import InputSanitizer from './input-sanitizer';
import RateLimiter from './rate-limiter';

export interface SecureAPIConfig {
  rateLimit?: string | any;
  inputSanitization?: boolean;
  csrfProtection?: boolean;
  allowedMethods?: string[];
  inputSchema?: Record<string, any>;
  requireAuth?: boolean;
  logSecurityEvents?: boolean;
}

export class SecureAPIWrapper {
  /**
   * Wrap API route handler with security measures
   */
  static withSecurity(
    handler: (
      req: NextRequest,
      sanitizedData?: unknown
    ) => Promise<NextResponse>,
    config: SecureAPIConfig = {}
  ) {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        // 1. Method validation
        if (
          config.allowedMethods &&
          !config.allowedMethods.includes(request.method)
        ) {
          return NextResponse.json(
            { error: 'Method not allowed' },
            { status: 405 }
          );
        }

        // 2. Apply security middleware
        const securityResult = await SecurityMiddleware.secureRequest(request, {
          enableRateLimiting: true,
          enableInputSanitization: config.inputSanitization !== false,
          enableCSRFProtection: config.csrfProtection !== false,
          rateLimitConfig: config.rateLimit || 'api',
        });

        if (securityResult) {
          return securityResult;
        }

        // 3. Sanitize input data
        let sanitizedData: unknown = null;
        if (config.inputSanitization !== false) {
          if (
            request.method === 'POST' ||
            request.method === 'PUT' ||
            request.method === 'PATCH'
          ) {
            const { sanitized, errors } =
              await SecurityMiddleware.sanitizeRequestBody(
                request,
                config.inputSchema
              );

            if (errors.length > 0) {
              return NextResponse.json(
                { error: 'Input validation failed', details: errors },
                { status: 400 }
              );
            }

            sanitizedData = sanitized;
          }

          // Sanitize query parameters
          const { sanitized: sanitizedQuery, errors: queryErrors } =
            SecurityMiddleware.sanitizeQueryParams(request, config.inputSchema);

          if (queryErrors.length > 0) {
            return NextResponse.json(
              {
                error: 'Query parameter validation failed',
                details: queryErrors,
              },
              { status: 400 }
            );
          }

          sanitizedData = { ...sanitizedData, query: sanitizedQuery };
        }

        // 4. Execute handler
        const response = await handler(request, sanitizedData);

        // 5. Add security headers to response
        if (response) {
          const securityHeaders = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          };

          Object.entries(securityHeaders).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
        }

        return response;
      } catch (error) {
        console.error('Secure API wrapper error:', error);

        // Log security event
        if (config.logSecurityEvents !== false) {
          SecurityMiddleware.logSecurityEvent(
            'api_error',
            {
              error: error instanceof Error ? error.message : 'Unknown error',
              url: request.url,
              method: request.method,
            },
            'medium'
          );
        }

        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }
    };
  }

  /**
   * Create secure GET handler
   */
  static createSecureGET(
    handler: (
      req: NextRequest,
      sanitizedQuery?: unknown
    ) => Promise<NextResponse>,
    config: SecureAPIConfig = {}
  ) {
    return this.withSecurity(handler, {
      ...config,
      allowedMethods: ['GET'],
      inputSanitization: true,
    });
  }

  /**
   * Create secure POST handler
   */
  static createSecurePOST(
    handler: (
      req: NextRequest,
      sanitizedData?: unknown
    ) => Promise<NextResponse>,
    config: SecureAPIConfig = {}
  ) {
    return this.withSecurity(handler, {
      ...config,
      allowedMethods: ['POST'],
      inputSanitization: true,
      csrfProtection: true,
    });
  }

  /**
   * Create secure PUT handler
   */
  static createSecurePUT(
    handler: (
      req: NextRequest,
      sanitizedData?: unknown
    ) => Promise<NextResponse>,
    config: SecureAPIConfig = {}
  ) {
    return this.withSecurity(handler, {
      ...config,
      allowedMethods: ['PUT'],
      inputSanitization: true,
      csrfProtection: true,
    });
  }

  /**
   * Create secure DELETE handler
   */
  static createSecureDELETE(
    handler: (
      req: NextRequest,
      sanitizedQuery?: unknown
    ) => Promise<NextResponse>,
    config: SecureAPIConfig = {}
  ) {
    return this.withSecurity(handler, {
      ...config,
      allowedMethods: ['DELETE'],
      inputSanitization: true,
      csrfProtection: true,
    });
  }

  /**
   * Create secure PATCH handler
   */
  static createSecurePATCH(
    handler: (
      req: NextRequest,
      sanitizedData?: unknown
    ) => Promise<NextResponse>,
    config: SecureAPIConfig = {}
  ) {
    return this.withSecurity(handler, {
      ...config,
      allowedMethods: ['PATCH'],
      inputSanitization: true,
      csrfProtection: true,
    });
  }

  /**
   * Validate and sanitize SQL parameters
   */
  static sanitizeSqlParams(
    params: (string | number | boolean)[]
  ): (string | number | boolean)[] {
    return params.map((param) => {
      if (typeof param === 'string') {
        // Escape SQL special characters
        return param.replace(/'/g, "''").replace(/\\/g, '\\\\');
      }
      return param;
    });
  }

  /**
   * Create parameterized SQL query
   */
  static createParameterizedQuery(
    baseQuery: string,
    params: (string | number | boolean)[]
  ): { query: string; params: (string | number | boolean)[] } {
    const sanitizedParams = this.sanitizeSqlParams(params);

    // Replace ? placeholders with $1, $2, etc.
    let paramIndex = 1;
    const parameterizedQuery = baseQuery.replace(
      /\?/g,
      () => `$${paramIndex++}`
    );

    return {
      query: parameterizedQuery,
      params: sanitizedParams,
    };
  }

  /**
   * Log API access
   */
  static logAPIAccess(
    request: NextRequest,
    response: NextResponse,
    additionalData: unknown = {}
  ): void {
    const logData = {
      method: request.method,
      url: request.url,
      status: response.status,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      timestamp: new Date().toISOString(),
      ...additionalData,
    };

    console.log('[API_ACCESS]', logData);
  }
}

export default SecureAPIWrapper;
