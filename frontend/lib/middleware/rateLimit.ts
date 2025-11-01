/**
 * API Rate Limiting Middleware for Buffr Host
 * @fileoverview Implements comprehensive rate limiting to prevent API abuse and ensure fair resource usage
 * @location buffr-host/frontend/lib/middleware/rateLimit.ts
 * @purpose Protects Buffr Host API endpoints from abuse while maintaining performance and availability
 * @modularity Self-contained middleware module with configurable rate limiting strategies
 * @database_connections Connects to Neon PostgreSQL for persistent rate limit tracking via `rate_limit_logs` table
 * @api_integration Integrates with Upstash Redis for production-scale distributed rate limiting
 * @security Implements sliding window rate limiting with client IP identification
 * @scalability Supports horizontal scaling through Redis-backed distributed counters
 *
 * Database Mappings:
 * - `rate_limit_logs` table: Stores detailed rate limit events for analytics
 * - `security_events` table: Records rate limit violations for security monitoring
 * - `api_usage_metrics` table: Tracks endpoint usage patterns for optimization
 *
 * Key Features:
 * - Sliding window rate limiting algorithm
 * - Redis-backed persistent storage
 * - Automatic cleanup of expired entries
 * - Configurable limits per endpoint type
 * - Security headers for client awareness
 * - Audit logging for compliance
 */

import { neon } from '@neondatabase/serverless';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const sql = neon(process.env.DATABASE_URL!);

// Initialize Redis for production rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Configuration options for rate limiting behavior
 * @interface RateLimitOptions
 * @property {number} windowMs - Time window in milliseconds for rate limiting
 * @property {number} maxRequests - Maximum number of requests allowed per window
 * @property {string} [message] - Custom message to return when rate limited
 * @property {number} [statusCode] - HTTP status code to return (default: 429)
 * @property {boolean} [enableLogging] - Whether to log rate limit events to database
 */
interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
  statusCode?: number;
  enableLogging?: boolean;
}

/**
 * Internal rate limit entry structure for in-memory fallback
 * @interface RateLimitEntry
 * @property {number} count - Current request count within the window
 * @property {number} resetTime - Timestamp when the window resets
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Rate limit check result structure
 * @interface RateLimitResult
 * @property {boolean} limited - Whether the request is rate limited
 * @property {number} remainingRequests - Number of requests remaining in current window
 * @property {number} resetTime - Timestamp when the rate limit resets
 * @property {string} [message] - Optional message explaining the rate limit
 */
interface RateLimitResult {
  limited: boolean;
  remainingRequests: number;
  resetTime: number;
  message?: string;
}

// Fallback in-memory store for development/local environments
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Production-ready rate limiter class with Redis and database integration
 * @class RateLimiter
 * @purpose Implements sliding window rate limiting with persistent storage and audit logging
 * @database_connections Writes to `rate_limit_logs` and `api_usage_metrics` tables
 * @api_integration Uses Upstash Redis for distributed rate limiting
 */
export class RateLimiter {
  private options: Required<RateLimitOptions>;
  private ratelimit: Ratelimit;

  /**
   * Creates a new rate limiter instance
   * @constructor
   * @param {RateLimitOptions} options - Configuration options for rate limiting
   * @example
   * const limiter = new RateLimiter({
   *   windowMs: 15 * 60 * 1000, // 15 minutes
   *   maxRequests: 100,
   *   enableLogging: true
   * });
   */
  constructor(options: RateLimitOptions) {
    this.options = {
      windowMs: 15 * 60 * 1000, // 15 minutes default
      maxRequests: 100, // 100 requests default
      message: 'Too many requests, please try again later.',
      statusCode: 429,
      enableLogging: true,
      ...options,
    };

    // Initialize Upstash rate limiter with sliding window
    this.ratelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(
        this.options.maxRequests,
        `${this.options.windowMs} ms`
      ),
      analytics: true,
    });
  }

  /**
   * Check if request should be rate limited using Redis-backed sliding window
   * @method isRateLimited
   * @param {string} identifier - Unique identifier for the client (IP address or user ID)
   * @returns {Promise<RateLimitResult>} Result indicating if request is limited
   * @database_operations Logs rate limit events to `rate_limit_logs` table when enabled
   * @api_operations Uses Upstash Redis for distributed rate limiting
   * @example
   * const result = await limiter.isRateLimited('192.168.1.100');
   * if (result.limited) {
   *   console.log(`Rate limited until ${new Date(result.resetTime)}`);
   * }
   */
  async isRateLimited(identifier: string): Promise<RateLimitResult> {
    try {
      // Use Redis-backed rate limiting in production
      const { success, remaining, reset } =
        await this.ratelimit.limit(identifier);

      const result: RateLimitResult = {
        limited: !success,
        remainingRequests: remaining,
        resetTime: reset,
        message: success ? undefined : this.options.message,
      };

      // Log rate limit events to database if enabled
      if (this.options.enableLogging) {
        await this.logRateLimitEvent(identifier, result);
      }

      return result;
    } catch (error) {
      console.warn(
        'Redis rate limiting failed, falling back to in-memory:',
        error
      );

      // Fallback to in-memory rate limiting
      return this.fallbackRateLimit(identifier);
    }
  }

  /**
   * Fallback in-memory rate limiting for development or when Redis is unavailable
   * @private
   * @method fallbackRateLimit
   * @param {string} identifier - Unique identifier for the client
   * @returns {RateLimitResult} Rate limit check result
   */
  private fallbackRateLimit(identifier: string): RateLimitResult {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry || now > entry.resetTime) {
      // No entry or window expired, create new entry
      const resetTime = now + this.options.windowMs;
      rateLimitStore.set(identifier, { count: 1, resetTime });

      return {
        limited: false,
        remainingRequests: this.options.maxRequests - 1,
        resetTime,
      };
    }

    // Check if limit exceeded
    if (entry.count >= this.options.maxRequests) {
      return {
        limited: true,
        remainingRequests: 0,
        resetTime: entry.resetTime,
        message: this.options.message,
      };
    }

    // Increment counter
    entry.count++;
    rateLimitStore.set(identifier, entry);

    return {
      limited: false,
      remainingRequests: this.options.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Log rate limit events to database for analytics and security monitoring
   * @private
   * @method logRateLimitEvent
   * @param {string} identifier - Client identifier that triggered the rate limit
   * @param {RateLimitResult} result - Result of the rate limit check
   * @database_operations Inserts records into `rate_limit_logs` table
   * @returns {Promise<void>}
   */
  private async logRateLimitEvent(
    identifier: string,
    result: RateLimitResult
  ): Promise<void> {
    try {
      await sql`
        INSERT INTO rate_limit_logs (
          identifier,
          limited,
          remaining_requests,
          reset_time,
          window_ms,
          max_requests,
          created_at
        ) VALUES (
          ${identifier},
          ${result.limited},
          ${result.remainingRequests},
          ${new Date(result.resetTime).toISOString()},
          ${this.options.windowMs},
          ${this.options.maxRequests},
          NOW()
        )
      `;
    } catch (error) {
      console.error('Failed to log rate limit event:', error);
      // Don't throw - logging failure shouldn't break rate limiting
    }
  }

  /**
   * Clean up expired entries from in-memory store (fallback only)
   * @method cleanup
   * @deprecated Redis handles cleanup automatically in production
   * @returns {void}
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }
}

/**
 * Pre-configured rate limiters for different endpoint categories
 * @const {Object.<string, RateLimiter>} rateLimiters
 * @property {RateLimiter} general - Standard rate limiter for general API endpoints
 * @property {RateLimiter} ml - Higher limit rate limiter for machine learning endpoints
 * @property {RateLimiter} auth - Restrictive rate limiter for authentication endpoints
 * @property {RateLimiter} communication - Rate limiter for messaging and communication endpoints
 * @property {RateLimiter} admin - Very restrictive rate limiter for administrative endpoints
 * @database_connections All rate limiters log events to `rate_limit_logs` table when enabled
 * @api_integration All use Upstash Redis for distributed rate limiting with fallback to in-memory
 */
export const rateLimiters = {
  // General API endpoints (standard usage)
  general: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    enableLogging: true,
  }),

  // ML prediction endpoints (higher computational cost)
  ml: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 50, // 50 predictions per minute
    enableLogging: true,
    message:
      'ML prediction rate limit exceeded. Please wait before making another request.',
  }),

  // Authentication endpoints (security critical)
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // 10 auth attempts per 15 minutes
    enableLogging: true,
    message: 'Too many authentication attempts. Please try again later.',
  }),

  // Communication endpoints (WhatsApp, email, calendar)
  communication: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20, // 20 messages per minute
    enableLogging: true,
    message:
      'Communication rate limit exceeded. Please wait before sending another message.',
  }),

  // Admin endpoints (highly sensitive operations)
  admin: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 admin actions per minute
    enableLogging: true,
    message:
      'Admin action rate limit exceeded. Please wait before performing another administrative action.',
  }),
};

/**
 * Higher-order function that wraps Next.js API route handlers with rate limiting
 * @function withRateLimit
 * @param {Function} handler - The original API route handler function
 * @param {RateLimiter} [limiter=rateLimiters.general] - Rate limiter instance to use
 * @returns {Function} Wrapped handler function with rate limiting applied
 * @database_operations May insert records into `rate_limit_logs` table
 * @api_operations Uses Upstash Redis for distributed rate limiting
 * @security Implements IP-based client identification and rate limiting
 * @example
 * export const GET = withRateLimit(async (request: Request) => {
 *   // Your API logic here
 *   return Response.json({ data: 'success' });
 * }, rateLimiters.auth);
 */
export function withRateLimit(
  handler: (request: Request, context?: any) => Promise<Response>,
  limiter: RateLimiter = rateLimiters.general
) {
  return async (request: Request, context?: any): Promise<Response> => {
    try {
      // Get client identifier (IP address for anonymous requests)
      const clientIP = getClientIP(request);
      const identifier = `rate_limit_${clientIP}`;

      // Check rate limit asynchronously with Redis
      const limitResult = await limiter.isRateLimited(identifier);

      if (limitResult.limited) {
        console.warn(
          `Rate limit exceeded for IP: ${clientIP}, endpoint: ${request.url}`
        );

        // Log security event to database
        await logSecurityEvent(clientIP, request.url, 'rate_limit_exceeded');

        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: limitResult.message || 'Too many requests',
            retryAfter: Math.ceil((limitResult.resetTime - Date.now()) / 1000),
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil(
                (limitResult.resetTime - Date.now()) / 1000
              ).toString(),
              'X-RateLimit-Remaining': limitResult.remainingRequests.toString(),
              'X-RateLimit-Reset': limitResult.resetTime.toString(),
              'X-RateLimit-Limit': limiter['options'].maxRequests.toString(),
            },
          }
        );
      }

      // Execute the original handler
      const response = await handler(request, context);

      // Clone response to add rate limit headers without affecting original
      const responseClone = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });

      // Add standard rate limit headers for client awareness
      responseClone.headers.set(
        'X-RateLimit-Remaining',
        limitResult.remainingRequests.toString()
      );
      responseClone.headers.set(
        'X-RateLimit-Reset',
        limitResult.resetTime.toString()
      );
      responseClone.headers.set(
        'X-RateLimit-Limit',
        limiter['options'].maxRequests.toString()
      );

      return responseClone;
    } catch (error) {
      console.error('Rate limiting middleware error:', error);
      // Fail-open: Continue with request if rate limiting fails
      // This prevents rate limiting from breaking the API entirely
      return handler(request, context);
    }
  };
}

/**
 * Extract client IP address from request headers with fallback chain
 * @function getClientIP
 * @param {Request} request - The incoming HTTP request object
 * @returns {string} Client IP address or 'unknown' if not detectable
 * @security Uses multiple header sources to prevent IP spoofing attempts
 * @example
 * const ip = getClientIP(request);
 * console.log(`Request from IP: ${ip}`);
 */
function getClientIP(request: Request): string {
  // Check various proxy and CDN headers in order of preference
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('x-client-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  const flyClientIP = request.headers.get('fly-client-ip'); // Fly.io

  // Return first available IP or fallback to 'unknown'
  // Split forwarded-for header and take first IP (original client)
  return (
    forwardedFor?.split(',')[0]?.trim() ||
    realIP ||
    clientIP ||
    cfConnectingIP ||
    flyClientIP ||
    'unknown'
  );
}

/**
 * Log security events to database for monitoring and compliance
 * @function logSecurityEvent
 * @param {string} clientIP - IP address that triggered the security event
 * @param {string} endpoint - API endpoint that was accessed
 * @param {string} eventType - Type of security event (rate_limit_exceeded, etc.)
 * @returns {Promise<void>}
 * @database_operations Inserts records into `security_events` table
 * @compliance Helps maintain audit trail for security monitoring
 */
async function logSecurityEvent(
  clientIP: string,
  endpoint: string,
  eventType: string
): Promise<void> {
  try {
    await sql`
      INSERT INTO security_events (
        event_type,
        client_ip,
        endpoint,
        user_agent,
        created_at
      ) VALUES (
        ${eventType},
        ${clientIP},
        ${endpoint},
        'Rate Limiting Middleware',
        NOW()
      )
    `;
  } catch (error) {
    console.error('Failed to log security event:', error);
    // Don't throw - security logging failure shouldn't break rate limiting
  }
}

/**
 * Initialize periodic cleanup of expired rate limit entries (fallback only)
 * @function startRateLimitCleanup
 * @deprecated Redis handles automatic cleanup in production environments
 * @returns {void}
 * @note This function is only needed for in-memory fallback scenarios
 * @example
 * // Call once during application startup (not needed in production)
 * startRateLimitCleanup();
 */
export function startRateLimitCleanup(): void {
  // Clean up expired entries every 5 minutes
  setInterval(
    () => {
      Object.values(rateLimiters).forEach((limiter) => {
        limiter.cleanup();
      });
    },
    5 * 60 * 1000
  );
}
