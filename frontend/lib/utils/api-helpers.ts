/**
 * API Helper Utilities for Buffr Host
 * @fileoverview Common utilities for API route implementation
 * @location buffr-host/frontend/lib/utils/api-helpers.ts
 * @purpose Provides reusable utilities for pagination, validation, and common API patterns
 */

import { NextRequest } from 'next/server';
import { ErrorCodes } from './api-response';

/**
 * Pagination parameters extracted from request
 * @interface PaginationParams
 * @property {number} page - Current page number (1-indexed)
 * @property {number} limit - Items per page
 * @property {number} offset - Calculated offset for database queries
 */
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Pagination result structure
 * @interface PaginationResult
 * @property {number} page - Current page
 * @property {number} limit - Items per page
 * @property {number} total - Total items
 * @property {number} totalPages - Total pages
 */
export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Extract pagination parameters from request
 * @function extractPagination
 * @param {NextRequest} request - Next.js request object
 * @param {number} [defaultLimit=20] - Default items per page
 * @param {number} [maxLimit=100] - Maximum items per page
 * @returns {PaginationParams} Pagination parameters
 * @example
 * const { page, limit, offset } = extractPagination(request);
 * const results = await db.query(`SELECT * FROM table LIMIT $1 OFFSET $2`, [limit, offset]);
 */
export function extractPagination(
  request: NextRequest,
  defaultLimit: number = 20,
  maxLimit: number = 100
): PaginationParams {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(searchParams.get('limit') || String(defaultLimit)))
  );
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Create pagination result from query data
 * @function createPaginationResult
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {PaginationResult} Pagination result
 */
export function createPaginationResult(
  page: number,
  limit: number,
  total: number
): PaginationResult {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Sorting parameters
 * @interface SortParams
 * @property {string} sortBy - Field to sort by
 * @property {'asc' | 'desc'} order - Sort order
 */
export interface SortParams {
  sortBy: string;
  order: 'asc' | 'desc';
}

/**
 * Extract sorting parameters from request
 * @function extractSorting
 * @param {NextRequest} request - Next.js request object
 * @param {string} [defaultSortBy='created_at'] - Default sort field
 * @param {'asc' | 'desc'} [defaultOrder='desc'] - Default sort order
 * @param {string[]} [allowedFields] - Allowed sort fields (for security)
 * @returns {SortParams} Sorting parameters
 * @example
 * const { sortBy, order } = extractSorting(request, 'name', 'asc', ['name', 'email', 'created_at']);
 */
export function extractSorting(
  request: NextRequest,
  defaultSortBy: string = 'created_at',
  defaultOrder: 'asc' | 'desc' = 'desc',
  allowedFields?: string[]
): SortParams {
  const { searchParams } = new URL(request.url);
  let sortBy =
    searchParams.get('sort') || searchParams.get('sortBy') || defaultSortBy;
  const order =
    (searchParams.get('order') || defaultOrder).toLowerCase() === 'asc'
      ? 'asc'
      : 'desc';

  // Validate sort field if allowed fields specified
  if (allowedFields && !allowedFields.includes(sortBy)) {
    sortBy = defaultSortBy;
  }

  return { sortBy, order };
}

/**
 * Date range filter parameters
 * @interface DateRangeParams
 * @property {Date | null} startDate - Start date (inclusive)
 * @property {Date | null} endDate - End date (inclusive)
 */
export interface DateRangeParams {
  startDate: Date | null;
  endDate: Date | null;
}

/**
 * Extract date range parameters from request
 * @function extractDateRange
 * @param {NextRequest} request - Next.js request object
 * @param {string} [startParam='start'] - Query parameter name for start date
 * @param {string} [endParam='end'] - Query parameter name for end date
 * @returns {DateRangeParams} Date range parameters
 * @example
 * const { startDate, endDate } = extractDateRange(request);
 * if (startDate && endDate) {
 *   query += ` AND date BETWEEN $1 AND $2`;
 * }
 */
export function extractDateRange(
  request: NextRequest,
  startParam: string = 'start',
  endParam: string = 'end'
): DateRangeParams {
  const { searchParams } = new URL(request.url);
  const startStr =
    searchParams.get(startParam) || searchParams.get('startDate');
  const endStr = searchParams.get(endParam) || searchParams.get('endDate');

  const startDate = startStr ? new Date(startStr) : null;
  const endDate = endStr ? new Date(endStr) : null;

  // Validate dates
  if (startDate && isNaN(startDate.getTime())) {
    throw new Error(`Invalid ${startParam} date format`);
  }
  if (endDate && isNaN(endDate.getTime())) {
    throw new Error(`Invalid ${endParam} date format`);
  }

  if (startDate && endDate && startDate > endDate) {
    throw new Error('Start date must be before end date');
  }

  return { startDate, endDate };
}

/**
 * Validation error details
 * @interface ValidationError
 * @property {string} field - Field name with error
 * @property {string} message - Error message
 * @property {string} [code] - Error code
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Validate required fields in request body
 * @function validateRequiredFields
 * @param {any} body - Request body to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {ValidationError[]} Array of validation errors (empty if valid)
 * @example
 * const errors = validateRequiredFields(body, ['name', 'email', 'propertyId']);
 * if (errors.length > 0) {
 *   return apiError(ErrorCodes.VALIDATION_ERROR, 'Missing required fields', { errors });
 * }
 */
export function validateRequiredFields(
  body: any,
  requiredFields: string[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const field of requiredFields) {
    if (
      body[field] === undefined ||
      body[field] === null ||
      body[field] === ''
    ) {
      errors.push({
        field,
        message: `${field} is required`,
        code: 'REQUIRED_FIELD_MISSING',
      });
    }
  }

  return errors;
}

/**
 * Validate email format
 * @function validateEmail
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate UUID format
 * @function validateUUID
 * @param {string} uuid - UUID to validate
 * @returns {boolean} Whether UUID is valid
 */
export function validateUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Parse and validate request body
 * @function parseRequestBody
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<any>} Parsed request body
 * @throws {Error} If body is invalid JSON or too large
 * @example
 * try {
 *   const body = await parseRequestBody(request);
 * } catch (error) {
 *   return apiError(ErrorCodes.BAD_REQUEST, 'Invalid request body');
 * }
 */
export async function parseRequestBody(request: NextRequest): Promise<any> {
  const contentType = request.headers.get('content-type');

  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Content-Type must be application/json');
  }

  try {
    const body = await request.json();
    return body;
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
}

/**
 * Extract filter parameters from request
 * @function extractFilters
 * @param {NextRequest} request - Next.js request object
 * @param {Record<string, string>} [allowedFilters] - Map of allowed filter names to their types
 * @returns {Record<string, any>} Filter parameters
 * @example
 * const filters = extractFilters(request, {
 *   status: 'string',
 *   propertyId: 'string',
 *   minPrice: 'number',
 *   maxPrice: 'number'
 * });
 */
export function extractFilters(
  request: NextRequest,
  allowedFilters?: Record<string, 'string' | 'number' | 'boolean' | 'array'>
): Record<string, any> {
  const { searchParams } = new URL(request.url);
  const filters: Record<string, any> = {};

  if (!allowedFilters) {
    // If no allowed filters specified, return all query params except pagination/sorting
    const excluded = [
      'page',
      'limit',
      'offset',
      'sort',
      'sortBy',
      'order',
      'version',
      'api_version',
    ];
    for (const [key, value] of searchParams.entries()) {
      if (!excluded.includes(key)) {
        filters[key] = value;
      }
    }
    return filters;
  }

  // Only include allowed filters
  for (const [key, type] of Object.entries(allowedFilters)) {
    const value = searchParams.get(key);
    if (value !== null) {
      switch (type) {
        case 'number':
          filters[key] = parseFloat(value);
          if (isNaN(filters[key])) continue;
          break;
        case 'boolean':
          filters[key] = value.toLowerCase() === 'true';
          break;
        case 'array':
          filters[key] = value.split(',').map((v) => v.trim());
          break;
        default:
          filters[key] = value;
      }
    }
  }

  return filters;
}

/**
 * Sanitize string input (trim and escape HTML)
 * @function sanitizeString
 * @param {string} input - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return input;

  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
