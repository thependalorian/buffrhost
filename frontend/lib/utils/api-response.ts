/**
 * Standardized API Response Utilities for Buffr Host
 * @fileoverview Provides consistent API response structures across all endpoints
 * @location buffr-host/frontend/lib/utils/api-response.ts
 * @purpose Ensures all API responses follow the same structure for easier client consumption
 * @modularity Reusable utility functions for success and error responses
 */

/**
 * Standard API success response structure
 * @interface ApiSuccessResponse
 * @property {boolean} success - Always true for successful responses
 * @property {T} data - Response data payload
 * @property {ResponseMetadata} [metadata] - Optional metadata (timestamp, version, requestId)
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  metadata?: ResponseMetadata;
}

/**
 * Standard API error response structure
 * @interface ApiErrorResponse
 * @property {boolean} success - Always false for error responses
 * @property {ErrorDetails} error - Detailed error information
 * @property {ResponseMetadata} [metadata] - Optional metadata (timestamp, version, requestId)
 */
export interface ApiErrorResponse {
  success: false;
  error: ErrorDetails;
  metadata?: ResponseMetadata;
}

/**
 * Response metadata structure
 * @interface ResponseMetadata
 * @property {string} timestamp - ISO timestamp of the response
 * @property {string} version - API version (e.g., 'v1', 'v2')
 * @property {string} [requestId] - Unique request identifier for tracking
 */
export interface ResponseMetadata {
  timestamp: string;
  version: string;
  requestId?: string;
}

/**
 * Error details structure
 * @interface ErrorDetails
 * @property {string} code - Machine-readable error code
 * @property {string} message - Human-readable error message
 * @property {any} [details] - Additional error context
 */
export interface ErrorDetails {
  code: string;
  message: string;
  details?: any;
}

/**
 * Standard HTTP status codes for API responses
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  RATE_LIMITED = 429,
  INTERNAL_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * Standard error codes for consistent error handling
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'RESOURCE_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED_ACCESS',
  FORBIDDEN: 'INSUFFICIENT_PERMISSIONS',
  RATE_LIMITED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  CONFLICT: 'RESOURCE_CONFLICT',
  BAD_REQUEST: 'BAD_REQUEST',
};

/**
 * Create a standardized success response
 * @function createSuccessResponse
 * @param {T} data - Response data payload
 * @param {string} [version='v1'] - API version
 * @param {string} [requestId] - Unique request identifier
 * @returns {ApiSuccessResponse<T>} Standardized success response
 * @example
 * const response = createSuccessResponse({ id: '123', name: 'Property' }, 'v1', 'req_789');
 * // Returns: { success: true, data: {...}, metadata: {...} }
 */
export function createSuccessResponse<T>(
  data: T,
  version: string = 'v1',
  requestId?: string
): ApiSuccessResponse<T> {
  const metadata: ResponseMetadata = {
    timestamp: new Date().toISOString(),
    version,
    ...(requestId && { requestId }),
  };

  return {
    success: true,
    data,
    metadata,
  };
}

/**
 * Create a standardized error response
 * @function createErrorResponse
 * @param {string} code - Error code from ErrorCodes
 * @param {string} message - Human-readable error message
 * @param {any} [details] - Additional error context
 * @param {string} [version='v1'] - API version
 * @param {string} [requestId] - Unique request identifier
 * @returns {ApiErrorResponse} Standardized error response
 * @example
 * const response = createErrorResponse(
 *   ErrorCodes.VALIDATION_ERROR,
 *   'Invalid input data',
 *   { field: 'email', constraint: 'must_be_valid_email' }
 * );
 * // Returns: { success: false, error: {...}, metadata: {...} }
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: any,
  version: string = 'v1',
  requestId?: string
): ApiErrorResponse {
  const metadata: ResponseMetadata = {
    timestamp: new Date().toISOString(),
    version,
    ...(requestId && { requestId }),
  };

  return {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
    metadata,
  };
}

/**
 * Extract API version from request headers or query parameters
 * @function getApiVersion
 * @param {Request} request - HTTP request object
 * @returns {string} API version (defaults to 'v1')
 * @example
 * const version = getApiVersion(request);
 * // Returns: 'v1', 'v2', etc. based on headers or query params
 */
export function getApiVersion(request: Request): string {
  // Check for API-Version header first
  const headerVersion = request.headers.get('API-Version');
  if (headerVersion) {
    return headerVersion.startsWith('v') ? headerVersion : `v${headerVersion}`;
  }

  // Check for version query parameter
  try {
    const url = new URL(request.url);
    const queryVersion = url.searchParams.get('version');
    if (queryVersion) {
      return queryVersion.startsWith('v') ? queryVersion : `v${queryVersion}`;
    }

    // Check for versioned URL path (/api/v1/...)
    const pathMatch = request.url.match(/\/api\/(v\d+)\//);
    if (pathMatch && pathMatch[1]) {
      return pathMatch[1];
    }
  } catch (error) {
    console.warn('Failed to parse URL for version extraction:', error);
  }

  // Default to v1
  return 'v1';
}

/**
 * Generate a unique request ID for tracking
 * @function generateRequestId
 * @returns {string} Unique request identifier
 * @example
 * const requestId = generateRequestId();
 * // Returns: 'req_1234567890_abc123'
 */
export function generateRequestId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `req_${timestamp}_${random}`;
}
