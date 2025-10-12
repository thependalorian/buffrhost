/**
 * Rate Limiting Middleware
 * Implements rate limiting using Redis or memory storage
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient, RedisClientType } from 'redis';
import { ConfigManager } from '../config/ConfigManager';
import { Logger } from '../utils/Logger';
import { RateLimitError } from './ErrorHandler';

export class RateLimiter {
  private static instance: RateLimiter;
  private redis: RedisClientType | null = null;
  private memoryStore: Map<string, { count: number; resetTime: number }> = new Map();
  private config: ConfigManager;
  private logger: Logger;

  private constructor() {
    this.config = ConfigManager.getInstance();
    this.logger = Logger.getInstance();
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  /**
   * Initialize rate limiter
   */
  public async initialize(): Promise<void> {
    try {
      const storageType = this.config.get('RATE_LIMIT_STORAGE');
      
      if (storageType === 'redis') {
        await this.initializeRedis();
      } else {
        this.logger.info('Using memory-based rate limiting');
      }
      
      this.logger.info('Rate limiter initialized');
    } catch (error) {
      this.logger.error('Failed to initialize rate limiter:', error);
      throw error;
    }
  }

  /**
   * Initialize Redis connection
   */
  private async initializeRedis(): Promise<void> {
    try {
      const redisUrl = this.config.get('REDIS_URL');
      this.redis = createClient({ url: redisUrl });
      
      await this.redis.connect();
      this.logger.info('Redis connection established for rate limiting');
    } catch (error) {
      this.logger.warn('Redis connection failed, falling back to memory storage:', error);
      this.redis = null;
    }
  }

  /**
   * Handle rate limiting for a request
   */
  public async handle(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
      const clientId = this.getClientId(req);
      const key = `rate_limit:${clientId}`;
      
      const isAllowed = await this.checkRateLimit(key);
      
      if (!isAllowed) {
        throw new RateLimitError('Rate limit exceeded');
      }
      
      // Add rate limit headers
      const remaining = await this.getRemainingRequests(key);
      const resetTime = await this.getResetTime(key);
      
      res.setHeader('X-RateLimit-Limit', this.config.get('RATE_LIMIT_REQUESTS'));
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', resetTime);
      
    } catch (error) {
      if (error instanceof RateLimitError) {
        res.setHeader('X-RateLimit-Limit', this.config.get('RATE_LIMIT_REQUESTS'));
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', Math.floor(Date.now() / 1000) + this.config.get('RATE_LIMIT_WINDOW'));
        throw error;
      }
      throw error;
    }
  }

  /**
   * Get client identifier for rate limiting
   */
  private getClientId(req: NextApiRequest): string {
    // Try to get IP from various headers
    const forwarded = req.headers['x-forwarded-for'];
    const realIp = req.headers['x-real-ip'];
    const remoteAddress = req.connection?.remoteAddress;
    
    let ip = 'unknown';
    if (forwarded) {
      ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim();
    } else if (realIp) {
      ip = Array.isArray(realIp) ? realIp[0] : realIp;
    } else if (remoteAddress) {
      ip = remoteAddress;
    }
    
    return ip;
  }

  /**
   * Check if request is within rate limit
   */
  private async checkRateLimit(key: string): Promise<boolean> {
    const maxRequests = this.config.get('RATE_LIMIT_REQUESTS');
    const windowSeconds = this.config.get('RATE_LIMIT_WINDOW');
    
    if (this.redis) {
      return await this.checkRateLimitRedis(key, maxRequests, windowSeconds);
    } else {
      return this.checkRateLimitMemory(key, maxRequests, windowSeconds);
    }
  }

  /**
   * Check rate limit using Redis
   */
  private async checkRateLimitRedis(key: string, maxRequests: number, windowSeconds: number): Promise<boolean> {
    try {
      const current = await this.redis!.get(key);
      const now = Math.floor(Date.now() / 1000);
      
      if (!current) {
        // First request in window
        await this.redis!.setEx(key, windowSeconds, '1');
        return true;
      }
      
      const count = parseInt(current);
      if (count >= maxRequests) {
        return false;
      }
      
      // Increment counter
      await this.redis!.incr(key);
      return true;
    } catch (error) {
      this.logger.error('Redis rate limit check failed:', error);
      return true; // Allow request if Redis fails
    }
  }

  /**
   * Check rate limit using memory storage
   */
  private checkRateLimitMemory(key: string, maxRequests: number, windowSeconds: number): boolean {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    
    const existing = this.memoryStore.get(key);
    
    if (!existing) {
      // First request in window
      this.memoryStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }
    
    // Check if window has expired
    if (now > existing.resetTime) {
      this.memoryStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }
    
    // Check if limit exceeded
    if (existing.count >= maxRequests) {
      return false;
    }
    
    // Increment counter
    existing.count++;
    this.memoryStore.set(key, existing);
    return true;
  }

  /**
   * Get remaining requests for a client
   */
  private async getRemainingRequests(key: string): Promise<number> {
    const maxRequests = this.config.get('RATE_LIMIT_REQUESTS');
    
    if (this.redis) {
      try {
        const current = await this.redis.get(key);
        const count = current ? parseInt(current) : 0;
        return Math.max(0, maxRequests - count);
      } catch (error) {
        this.logger.error('Failed to get remaining requests from Redis:', error);
        return maxRequests;
      }
    } else {
      const existing = this.memoryStore.get(key);
      if (!existing) {
        return maxRequests;
      }
      
      const now = Date.now();
      if (now > existing.resetTime) {
        return maxRequests;
      }
      
      return Math.max(0, maxRequests - existing.count);
    }
  }

  /**
   * Get reset time for rate limit window
   */
  private async getResetTime(key: string): Promise<number> {
    const windowSeconds = this.config.get('RATE_LIMIT_WINDOW');
    
    if (this.redis) {
      try {
        const ttl = await this.redis.ttl(key);
        return ttl > 0 ? Math.floor(Date.now() / 1000) + ttl : Math.floor(Date.now() / 1000) + windowSeconds;
      } catch (error) {
        this.logger.error('Failed to get reset time from Redis:', error);
        return Math.floor(Date.now() / 1000) + windowSeconds;
      }
    } else {
      const existing = this.memoryStore.get(key);
      if (!existing) {
        return Math.floor(Date.now() / 1000) + windowSeconds;
      }
      
      return Math.floor(existing.resetTime / 1000);
    }
  }

  /**
   * Reset rate limit for a client
   */
  public async resetRateLimit(clientId: string): Promise<void> {
    const key = `rate_limit:${clientId}`;
    
    if (this.redis) {
      try {
        await this.redis.del(key);
      } catch (error) {
        this.logger.error('Failed to reset rate limit in Redis:', error);
      }
    } else {
      this.memoryStore.delete(key);
    }
  }

  /**
   * Clean up expired entries from memory store
   */
  public cleanupMemoryStore(): void {
    const now = Date.now();
    for (const [key, value] of this.memoryStore.entries()) {
      if (now > value.resetTime) {
        this.memoryStore.delete(key);
      }
    }
  }

  /**
   * Close rate limiter
   */
  public async close(): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.quit();
        this.redis = null;
      }
      
      this.memoryStore.clear();
      this.logger.info('Rate limiter closed');
    } catch (error) {
      this.logger.error('Error closing rate limiter:', error);
    }
  }
}