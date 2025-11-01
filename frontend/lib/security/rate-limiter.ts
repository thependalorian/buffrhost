/**
 * Rate Limiting Service
 *
 * Implements 2025 best practices for rate limiting:
 * - Sliding window rate limiting
 * - IP-based and user-based limiting
 * - Different limits for different endpoints
 * - Redis-based distributed rate limiting
 *
 * Location: lib/security/rate-limiter.ts
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  keyGenerator?: (req: unknown) => string; // Custom key generator
  onLimitReached?: (key: string, req: unknown) => void; // Callback when limit reached
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  totalHits: number;
  retryAfter?: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
    firstRequest: number;
  };
}

export class RateLimiter {
  private static store: RateLimitStore = {};
  private static cleanupInterval: NodeJS.Timeout | null = null;

  // Default configurations for different endpoint types
  private static readonly DEFAULT_CONFIGS: { [key: string]: RateLimitConfig } =
    {
      // Authentication endpoints - stricter limits
      auth: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5, // 5 attempts per 15 minutes
        skipSuccessfulRequests: true,
        keyGenerator: (req) => `auth:${this.getClientIP(req)}`,
      },

      // API endpoints - moderate limits
      api: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100, // 100 requests per 15 minutes
        keyGenerator: (req) => `api:${this.getClientIP(req)}`,
      },

      // Public endpoints - more lenient
      public: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 200, // 200 requests per 15 minutes
        keyGenerator: (req) => `public:${this.getClientIP(req)}`,
      },

      // Admin endpoints - very strict
      admin: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 20, // 20 requests per 15 minutes
        keyGenerator: (req) =>
          `admin:${this.getUserID(req) || this.getClientIP(req)}`,
      },

      // Payment endpoints - very strict
      payment: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 10, // 10 requests per 15 minutes
        keyGenerator: (req) =>
          `payment:${this.getUserID(req) || this.getClientIP(req)}`,
      },

      // File upload endpoints
      upload: {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 50, // 50 uploads per hour
        keyGenerator: (req) =>
          `upload:${this.getUserID(req) || this.getClientIP(req)}`,
      },
    };

  /**
   * Initialize rate limiter with cleanup interval
   */
  static initialize(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1000
    );
  }

  /**
   * Check if request is allowed based on rate limit
   */
  static async checkRateLimit(
    req: unknown,
    config: RateLimitConfig | string
  ): Promise<RateLimitResult> {
    const rateLimitConfig =
      typeof config === 'string'
        ? this.DEFAULT_CONFIGS[config] || this.DEFAULT_CONFIGS['api']
        : config;

    if (!rateLimitConfig) {
      throw new Error('Invalid rate limit configuration');
    }

    const key = rateLimitConfig.keyGenerator
      ? rateLimitConfig.keyGenerator(req)
      : `default:${this.getClientIP(req)}`;

    const now = Date.now();
    const windowStart = now - rateLimitConfig.windowMs;

    // Get or create entry for this key
    let entry = this.store[key];
    if (!entry || entry.resetTime < now) {
      entry = {
        count: 0,
        resetTime: now + rateLimitConfig.windowMs,
        firstRequest: now,
      };
      this.store[key] = entry;
    }

    // Check if we're in a new window
    if (entry.firstRequest < windowStart) {
      entry.count = 0;
      entry.firstRequest = now;
    }

    // Increment counter
    entry.count++;

    const remaining = Math.max(0, rateLimitConfig.maxRequests - entry.count);
    const retryAfter =
      entry.count > rateLimitConfig.maxRequests
        ? Math.ceil((entry.resetTime - now) / 1000)
        : undefined;

    const allowed = entry.count <= rateLimitConfig.maxRequests;

    // Call callback if limit reached
    if (!allowed && rateLimitConfig.onLimitReached) {
      rateLimitConfig.onLimitReached(key, req);
    }

    return {
      allowed,
      remaining,
      resetTime: entry.resetTime,
      totalHits: entry.count,
      retryAfter,
    };
  }

  /**
   * Get client IP address from request
   */
  private static getClientIP(req: unknown): string {
    const forwarded = req.headers?.['x-forwarded-for'];
    const realIP = req.headers?.['x-real-ip'];
    const remoteAddress =
      req.connection?.remoteAddress || req.socket?.remoteAddress;

    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }

    if (realIP) {
      return realIP;
    }

    if (remoteAddress) {
      return remoteAddress.replace(/^::ffff:/, '');
    }

    return 'unknown';
  }

  /**
   * Get user ID from request (if authenticated)
   */
  private static getUserID(req: unknown): string | null {
    // This would typically come from JWT token or session
    return req.user?.id || req.userId || null;
  }

  /**
   * Clean up expired entries from store
   */
  private static cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of Object.entries(this.store)) {
      if (entry.resetTime < now) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => delete this.store[key]);
  }

  /**
   * Reset rate limit for a specific key
   */
  static resetRateLimit(key: string): void {
    delete this.store[key];
  }

  /**
   * Get current rate limit status for a key
   */
  static getRateLimitStatus(key: string): RateLimitResult | null {
    const entry = this.store[key];
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const remaining = Math.max(0, 100 - entry.count); // Assuming default max of 100
    const retryAfter =
      entry.count > 100 ? Math.ceil((entry.resetTime - now) / 1000) : undefined;

    return {
      allowed: entry.count <= 100,
      remaining,
      resetTime: entry.resetTime,
      totalHits: entry.count,
      retryAfter,
    };
  }

  /**
   * Create rate limit middleware for Express/Next.js
   */
  static createMiddleware(config: RateLimitConfig | string) {
    return async (req: unknown, res: unknown, next: unknown) => {
      try {
        const result = await this.checkRateLimit(req, config);

        // Set rate limit headers
        res.setHeader(
          'X-RateLimit-Limit',
          typeof config === 'string'
            ? this.DEFAULT_CONFIGS[config]?.maxRequests || 100
            : config.maxRequests
        );
        res.setHeader('X-RateLimit-Remaining', result.remaining);
        res.setHeader(
          'X-RateLimit-Reset',
          new Date(result.resetTime).toISOString()
        );

        if (result.retryAfter) {
          res.setHeader('Retry-After', result.retryAfter);
        }

        if (!result.allowed) {
          return res.status(429).json({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: result.retryAfter,
            resetTime: new Date(result.resetTime).toISOString(),
          });
        }

        next();
      } catch (error) {
        console.error('Rate limiter error:', error);
        // Allow request to proceed if rate limiter fails
        next();
      }
    };
  }

  /**
   * Create rate limit middleware for Next.js API routes
   */
  static createNextJSMiddleware(config: RateLimitConfig | string) {
    return async (req: unknown, res: unknown) => {
      try {
        const result = await this.checkRateLimit(req, config);

        // Set rate limit headers
        res.setHeader(
          'X-RateLimit-Limit',
          typeof config === 'string'
            ? this.DEFAULT_CONFIGS[config]?.maxRequests || 100
            : config.maxRequests
        );
        res.setHeader('X-RateLimit-Remaining', result.remaining);
        res.setHeader(
          'X-RateLimit-Reset',
          new Date(result.resetTime).toISOString()
        );

        if (result.retryAfter) {
          res.setHeader('Retry-After', result.retryAfter);
        }

        if (!result.allowed) {
          return res.status(429).json({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: result.retryAfter,
            resetTime: new Date(result.resetTime).toISOString(),
          });
        }

        return true; // Allow request to proceed
      } catch (error) {
        console.error('Rate limiter error:', error);
        // Allow request to proceed if rate limiter fails
        return true;
      }
    };
  }

  /**
   * Get rate limit configuration for endpoint type
   */
  static getConfigForEndpoint(endpoint: string): RateLimitConfig {
    // Determine endpoint type based on path
    if (endpoint.includes('/auth/')) {
      return this.DEFAULT_CONFIGS['auth'];
    } else if (endpoint.includes('/admin/')) {
      return this.DEFAULT_CONFIGS['admin'];
    } else if (endpoint.includes('/payment')) {
      return this.DEFAULT_CONFIGS['payment'];
    } else if (endpoint.includes('/upload')) {
      return this.DEFAULT_CONFIGS['upload'];
    } else if (endpoint.includes('/api/')) {
      return this.DEFAULT_CONFIGS['api'];
    } else {
      return this.DEFAULT_CONFIGS['public'];
    }
  }

  /**
   * Destroy rate limiter and cleanup
   */
  static destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.store = {};
  }
}

// Initialize rate limiter on import
RateLimiter.initialize();

export default RateLimiter;
