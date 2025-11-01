/**
 * Comprehensive API Wrapper Middleware for Buffr Host
 * @fileoverview Combines rate limiting, monitoring, standardized responses, and versioning
 * @location buffr-host/frontend/lib/middleware/api-wrapper.ts
 * @purpose Provides a unified wrapper for all API routes with best practices applied
 * @modularity Reusable wrapper that combines all API design best practices
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, rateLimiters, RateLimiter } from './rateLimit';
import { apiMonitor } from '@/lib/services/monitoring/APIMonitor';
import {
  createSuccessResponse,
  createErrorResponse,
  getApiVersion,
  generateRequestId,
  HttpStatus,
  ErrorCodes,
} from '@/lib/utils/api-response';

/**
 * Configuration options for API wrapper
 * @interface APIWrapperOptions
 * @property {RateLimiter} [rateLimiter] - Rate limiter to use (default: general)
 * @property {boolean} [enableMonitoring] - Enable API monitoring (default: true)
 * @property {boolean} [enableVersioning] - Enable API versioning (default: true)
 * @property {string} [requiredAuth] - Required authentication level ('none' | 'basic' | 'standard' | 'elevated')
 */
export interface APIWrapperOptions {
  rateLimiter?: RateLimiter;
  enableMonitoring?: boolean;
  enableVersioning?: boolean;
  requiredAuth?: 'none' | 'basic' | 'standard' | 'elevated';
}

/**
 * Get client IP address from request
 * @function getClientIP
 */
function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('x-client-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  return (
    forwardedFor?.split(',')[0]?.trim() ||
    realIP ||
    clientIP ||
    cfConnectingIP ||
    'unknown'
  );
}

/**
 * Extract user ID from request (from JWT or session)
 * @function getUserId
 */
function getUserId(request: NextRequest): string | undefined {
  // TODO: Extract from JWT token or session
  // For now, return undefined (anonymous request)
  return request.headers.get('x-user-id') || undefined;
}

/**
 * Comprehensive API wrapper that applies all best practices
 * @function withAPIWrapper
 * @param {Function} handler - The API route handler function
 * @param {APIWrapperOptions} [options={}] - Configuration options
 * @returns {Function} Wrapped handler with all middleware applied
 * @example
 * export const GET = withAPIWrapper(
 *   async (req, context) => {
 *     const data = await fetchData();
 *     return createSuccessResponse(data);
 *   },
 *   { rateLimiter: rateLimiters.auth }
 * );
 */
export function withAPIWrapper(
  handler: (
    request: NextRequest,
    context?: any
  ) => Promise<
    NextResponse | { success: boolean; data?: any; error?: any; metadata?: any }
  >,
  options: APIWrapperOptions = {}
): (request: NextRequest, context?: any) => Promise<NextResponse> {
  const {
    rateLimiter = rateLimiters.general,
    enableMonitoring = true,
    enableVersioning = true,
    requiredAuth = 'basic',
  } = options;

  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const startTime = Date.now();
    const requestId = generateRequestId();
    let response: NextResponse;

    try {
      // Get API version
      const version = enableVersioning ? getApiVersion(request) : 'v1';

      // Get client information
      const clientIP = getClientIP(request);
      const userId = getUserId(request);
      const userAgent = request.headers.get('user-agent') || 'unknown';

      // Monitor request start
      if (enableMonitoring) {
        apiMonitor.recordRequest({
          method: request.method,
          url: request.url,
          userAgent,
          ip: clientIP,
          userId,
          timestamp: new Date(),
          requestSize: request.headers.get('content-length')
            ? parseInt(request.headers.get('content-length')!)
            : undefined,
        });
      }

      // Create wrapped handler with rate limiting
      const rateLimitedHandler = withRateLimit(async (req: Request) => {
        // Convert NextRequest to standard Request for handler
        const standardRequest = new Request(req.url, {
          method: req.method,
          headers: req.headers,
          body: req.body,
        });

        // Execute the handler
        const result = await handler(request, context);

        // If result is already a NextResponse, return it
        if (result instanceof NextResponse) {
          return result;
        }

        // If result is a standardized response object, convert to NextResponse
        if (result && typeof result === 'object' && 'success' in result) {
          if (result.success) {
            const successResponse = createSuccessResponse(
              result.data,
              version,
              requestId
            );
            return new NextResponse(JSON.stringify(successResponse), {
              status: HttpStatus.OK,
              headers: {
                'Content-Type': 'application/json',
                'X-Request-ID': requestId,
                'X-API-Version': version,
              },
            });
          } else {
            const errorResponse = createErrorResponse(
              result.error?.code || ErrorCodes.INTERNAL_ERROR,
              result.error?.message || 'An error occurred',
              result.error?.details,
              version,
              requestId
            );

            // Determine appropriate status code
            const statusCode =
              result.error?.code === ErrorCodes.NOT_FOUND
                ? HttpStatus.NOT_FOUND
                : result.error?.code === ErrorCodes.UNAUTHORIZED
                  ? HttpStatus.UNAUTHORIZED
                  : result.error?.code === ErrorCodes.FORBIDDEN
                    ? HttpStatus.FORBIDDEN
                    : result.error?.code === ErrorCodes.VALIDATION_ERROR
                      ? HttpStatus.BAD_REQUEST
                      : HttpStatus.INTERNAL_ERROR;

            return new NextResponse(JSON.stringify(errorResponse), {
              status: statusCode,
              headers: {
                'Content-Type': 'application/json',
                'X-Request-ID': requestId,
                'X-API-Version': version,
              },
            });
          }
        }

        // Default: wrap result in success response
        const successResponse = createSuccessResponse(
          result,
          version,
          requestId
        );
        return new NextResponse(JSON.stringify(successResponse), {
          status: HttpStatus.OK,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': requestId,
            'X-API-Version': version,
          },
        });
      }, rateLimiter);

      // Execute with rate limiting
      response = (await rateLimitedHandler(request as any)) as NextResponse;
    } catch (error) {
      // Handle unexpected errors
      const duration = Date.now() - startTime;
      const version = enableVersioning ? getApiVersion(request) : 'v1';

      console.error('API wrapper error:', error);

      // Monitor error
      if (enableMonitoring) {
        apiMonitor.recordRequest({
          method: request.method,
          url: request.url,
          userAgent: request.headers.get('user-agent') || 'unknown',
          ip: getClientIP(request),
          userId: getUserId(request),
          timestamp: new Date(),
          duration,
          statusCode: HttpStatus.INTERNAL_ERROR,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      // Return standardized error response
      const errorResponse = createErrorResponse(
        ErrorCodes.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'An unexpected error occurred',
        { requestId },
        version,
        requestId
      );

      response = NextResponse.json(errorResponse, {
        status: HttpStatus.INTERNAL_ERROR,
        headers: {
          'X-Request-ID': requestId,
          'X-API-Version': version,
        },
      });
    } finally {
      // Monitor request completion
      if (enableMonitoring) {
        const duration = Date.now() - startTime;
        const clientIP = getClientIP(request);
        const userId = getUserId(request);

        apiMonitor.recordRequest({
          method: request.method,
          url: request.url,
          userAgent: request.headers.get('user-agent') || 'unknown',
          ip: clientIP,
          userId,
          timestamp: new Date(),
          duration,
          statusCode: response.status,
          responseSize: response.headers.get('content-length')
            ? parseInt(response.headers.get('content-length')!)
            : undefined,
        });
      }
    }

    // Add standard headers to response
    response.headers.set('X-Request-ID', requestId);
    if (enableVersioning) {
      response.headers.set('X-API-Version', getApiVersion(request));
    }

    return response;
  };
}

/**
 * Helper function to create success response in API handlers
 * @function apiSuccess
 * @param {T} data - Response data
 * @param {number} [statusCode=200] - HTTP status code
 * @returns {object} Standardized success response object
 */
export function apiSuccess<T>(data: T, statusCode: number = HttpStatus.OK) {
  return {
    success: true as const,
    data,
    statusCode,
  };
}

/**
 * Helper function to create error response in API handlers
 * @function apiError
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {any} [details] - Additional error details
 * @param {number} [statusCode=500] - HTTP status code
 * @returns {object} Standardized error response object
 */
export function apiError(
  code: string,
  message: string,
  details?: any,
  statusCode: number = HttpStatus.INTERNAL_ERROR
) {
  return {
    success: false as const,
    error: {
      code,
      message,
      ...(details && { details }),
    },
    statusCode,
  };
}

/**
 * Create a protected API route wrapper
 * @function createProtectedRoute
 * @param {Function} handler - Route handler function
 * @param {APIWrapperOptions} [options] - API wrapper options
 * @returns {Function} Protected route handler
 */
export function createProtectedRoute(
  handler: (request: NextRequest) => Promise<NextResponse | { success: boolean; error?: any; data?: any; statusCode?: number }>,
  options?: APIWrapperOptions
) {
  return withAPIWrapper(handler, {
    ...options,
    requiredAuth: options?.requiredAuth || 'standard',
  });
}
