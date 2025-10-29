import { NextApiRequest, NextApiResponse } from 'next';
import { createClient, RedisClientType } from 'redis';
import { config } from '../config/ConfigManager';
import { logger } from '../utils/Logger';
import { RateLimitError } from './ErrorHandler';

export class RateLimiter {
  private static instance: RateLimiter;
  private redis: RedisClientType | null = null;
  private memoryStore: Map<string, { count: number; resetTime: number }> = new Map();

  private constructor() {}

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  public async initialize(): Promise<void> {
    try {
      const storageType = config.get('RATE_LIMIT_STORAGE');
      
      if (storageType === 'redis') {
        await this.initializeRedis();
      } else {
        logger.info('Using memory-based rate limiting');
      }
      
      logger.info('Rate limiter initialized');
    } catch (error) {
      logger.error('Failed to initialize rate limiter:', error);
      throw error;
    }
  }

  private async initializeRedis(): Promise<void> {
    try {
      const redisUrl = config.get('REDIS_URL');
      this.redis = createClient({ url: redisUrl });
      
      await this.redis.connect();
      logger.info('Redis connection established for rate limiting');
    } catch (error) {
      logger.warn('Redis connection failed, falling back to memory storage:', error);
      this.redis = null;
    }
  }

  public async handle(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
      const clientId = this.getClientId(req);
      const key = `rate_limit:${clientId}`;
      
      const isAllowed = await this.checkRateLimit(key);
      
      if (!isAllowed) {
        throw new RateLimitError('Rate limit exceeded');
      }
      
      const remaining = await this.getRemainingRequests(key);
      const resetTime = await this.getResetTime(key);
      
      res.setHeader('X-RateLimit-Limit', config.get('RATE_LIMIT_REQUESTS'));
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', resetTime);
      
    } catch (error) {
      if (error instanceof RateLimitError) {
        res.setHeader('X-RateLimit-Limit', config.get('RATE_LIMIT_REQUESTS'));
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', Math.floor(Date.now() / 1000) + config.get('RATE_LIMIT_WINDOW'));
        throw error;
      }
      throw error;
    }
  }

  private getClientId(req: NextApiRequest): string {
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

  private async checkRateLimit(key: string): Promise<boolean> {
    const maxRequests = config.get('RATE_LIMIT_REQUESTS');
    const windowSeconds = config.get('RATE_LIMIT_WINDOW');
    
    if (this.redis) {
      return await this.checkRateLimitRedis(key, maxRequests, windowSeconds);
    } else {
      return this.checkRateLimitMemory(key, maxRequests, windowSeconds);
    }
  }

  private async checkRateLimitRedis(key: string, maxRequests: number, windowSeconds: number): Promise<boolean> {
    try {
      const current = await this.redis!.get(key);
      const now = Math.floor(Date.now() / 1000);
      
      if (!current) {
        await this.redis!.setEx(key, windowSeconds, '1');
        return true;
      }
      
      const count = parseInt(current);
      if (count >= maxRequests) {
        return false;
      }
      
      await this.redis!.incr(key);
      return true;
    } catch (error) {
      logger.error('Redis rate limit check failed:', error);
      return true;
    }
  }

  private checkRateLimitMemory(key: string, maxRequests: number, windowSeconds: number): boolean {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    
    const existing = this.memoryStore.get(key);
    
    if (!existing) {
      this.memoryStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }
    
    if (now > existing.resetTime) {
      this.memoryStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }
    
    if (existing.count >= maxRequests) {
      return false;
    }
    
    existing.count++;
    this.memoryStore.set(key, existing);
    return true;
  }

  private async getRemainingRequests(key: string): Promise<number> {
    const maxRequests = config.get('RATE_LIMIT_REQUESTS');
    
    if (this.redis) {
      try {
        const current = await this.redis.get(key);
        const count = current ? parseInt(current) : 0;
        return Math.max(0, maxRequests - count);
      } catch (error) {
        logger.error('Failed to get remaining requests from Redis:', error);
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

  private async getResetTime(key: string): Promise<number> {
    const windowSeconds = config.get('RATE_LIMIT_WINDOW');
    
    if (this.redis) {
      try {
        const ttl = await this.redis.ttl(key);
        return ttl > 0 ? Math.floor(Date.now() / 1000) + ttl : Math.floor(Date.now() / 1000) + windowSeconds;
      } catch (error) {
        logger.error('Failed to get reset time from Redis:', error);
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

  public async resetRateLimit(clientId: string): Promise<void> {
    const key = `rate_limit:${clientId}`;
    
    if (this.redis) {
      try {
        await this.redis.del(key);
      } catch (error) {
        logger.error('Failed to reset rate limit in Redis:', error);
      }
    } else {
      this.memoryStore.delete(key);
    }
  }

  public cleanupMemoryStore(): void {
    const now = Date.now();
    for (const [key, value] of this.memoryStore.entries()) {
      if (now > value.resetTime) {
        this.memoryStore.delete(key);
      }
    }
  }

  public async close(): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.quit();
        this.redis = null;
      }
      
      this.memoryStore.clear();
      logger.info('Rate limiter closed');
    } catch (error) {
      logger.error('Error closing rate limiter:', error);
    }
  }
}