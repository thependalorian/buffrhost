/**
 * Redis Client Configuration
 *
 * Unified Redis client using Redis Cloud instance
 * Replaces Upstash Redis throughout the application
 *
 * Location: lib/redis/redis-client.ts
 */

import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

// =============================================================================
// REDIS CONFIGURATION
// =============================================================================

interface RedisConfig {
  username: string;
  password: string;
  host: string;
  port: number;
  retryDelayOnFailover?: number;
  maxRetriesPerRequest?: number;
  lazyConnect?: boolean;
}

const redisConfig: RedisConfig = {
  username: process.env.REDIS_USERNAME || '',
  password: process.env.REDIS_PASSWORD || '',
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
};

// =============================================================================
// REDIS CLIENT SINGLETON
// =============================================================================

class RedisService {
  private static instance: RedisService;
  private client: RedisClientType | null = null;
  private isConnected = false;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  async getClient(): Promise<RedisClientType> {
    if (this.client && this.isConnected) {
      return this.client;
    }

    if (this.connectionPromise) {
      await this.connectionPromise;
      return this.client!;
    }

    this.connectionPromise = this.connect();
    await this.connectionPromise;
    return this.client!;
  }

  private async connect(): Promise<void> {
    try {
      // Only connect if Redis credentials are configured
      if (!redisConfig.username || !redisConfig.password || !redisConfig.host) {
        console.warn('Redis not configured. Skipping connection.');
        return;
      }

      this.client = createClient({
        username: redisConfig.username,
        password: redisConfig.password,
        socket: {
          host: redisConfig.host,
          port: redisConfig.port,
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              console.error('Redis connection failed after 10 retries');
              return new Error('Redis connection failed');
            }
            return Math.min(retries * 50, 1000);
          },
        },
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis Client Connected');
        this.isConnected = true;
      });

      this.client.on('disconnect', () => {
        console.log('Redis Client Disconnected');
        this.isConnected = false;
      });

      await this.client.connect();
      this.isConnected = true;
      console.log('Redis connection established successfully');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      this.isConnected = false;
      // Don't throw - allow app to continue without Redis
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      this.client = null;
      this.isConnected = false;
      this.connectionPromise = null;
    }
  }

  isClientConnected(): boolean {
    return this.isConnected;
  }

  // Convenience methods for common operations
  async get(key: string): Promise<string | null> {
    if (!this.isConnected) {
      return null;
    }
    const client = await this.getClient();
    return await client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.isConnected) {
      return;
    }
    const client = await this.getClient();
    if (ttl) {
      await client.setEx(key, ttl, value);
    } else {
      await client.set(key, value);
    }
  }

  async del(key: string): Promise<number> {
    if (!this.isConnected) {
      return 0;
    }
    const client = await this.getClient();
    return await client.del(key);
  }

  async exists(key: string): Promise<number> {
    if (!this.isConnected) {
      return 0;
    }
    const client = await this.getClient();
    return await client.exists(key);
  }

  async ttl(key: string): Promise<number> {
    if (!this.isConnected) {
      return -1;
    }
    const client = await this.getClient();
    return await client.ttl(key);
  }

  async incr(key: string): Promise<number> {
    if (!this.isConnected) {
      return 0;
    }
    const client = await this.getClient();
    return await client.incr(key);
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }
    const client = await this.getClient();
    return await client.expire(key, seconds);
  }

  async keys(pattern: string): Promise<string[]> {
    if (!this.isConnected) {
      return [];
    }
    const client = await this.getClient();
    return await client.keys(pattern);
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    if (!this.isConnected) {
      return keys.map(() => null);
    }
    const client = await this.getClient();
    return await client.mGet(keys);
  }

  async mset(keyValues: Record<string, string>): Promise<void> {
    if (!this.isConnected) {
      return;
    }
    const client = await this.getClient();
    const pairs: string[] = [];
    Object.entries(keyValues).forEach(([key, value]) => {
      pairs.push(key, value);
    });
    await client.mSet(pairs);
  }

  // Hash operations
  async hget(key: string, field: string): Promise<string | undefined> {
    if (!this.isConnected) {
      return undefined;
    }
    const client = await this.getClient();
    const result = await client.hGet(key, field);
    return result || undefined;
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    if (!this.isConnected) {
      return 0;
    }
    const client = await this.getClient();
    const result = await client.hSet(key, field, value);
    return typeof result === 'number' ? result : 0;
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    if (!this.isConnected) {
      return {};
    }
    const client = await this.getClient();
    return await client.hGetAll(key);
  }

  // Set operations
  async sadd(key: string, ...members: string[]): Promise<number> {
    if (!this.isConnected) {
      return 0;
    }
    const client = await this.getClient();
    const result = await client.sAdd(key, members);
    return typeof result === 'number' ? result : 0;
  }

  async smembers(key: string): Promise<string[]> {
    if (!this.isConnected) {
      return [];
    }
    const client = await this.getClient();
    return await client.sMembers(key);
  }

  // List operations
  async lpush(key: string, ...elements: string[]): Promise<number> {
    if (!this.isConnected) {
      return 0;
    }
    const client = await this.getClient();
    const result = await client.lPush(key, elements);
    return typeof result === 'number' ? result : 0;
  }

  async rpop(key: string): Promise<string | null> {
    if (!this.isConnected) {
      return null;
    }
    const client = await this.getClient();
    return await client.rPop(key);
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export const redisService = RedisService.getInstance();
export default redisService;

// Compatibility layer for existing Upstash Redis usage
export class Redis {
  private redisService = RedisService.getInstance();

  async get(key: string): Promise<string | null> {
    return await this.redisService.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.redisService.set(key, value);
  }

  async setex(key: string, seconds: number, value: string): Promise<void> {
    await this.redisService.set(key, value, seconds);
  }

  async del(key: string): Promise<number> {
    return await this.redisService.del(key);
  }

  async exists(key: string): Promise<number> {
    return await this.redisService.exists(key);
  }

  async ttl(key: string): Promise<number> {
    return await this.redisService.ttl(key);
  }

  async incr(key: string): Promise<number> {
    return await this.redisService.incr(key);
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    return await this.redisService.expire(key, seconds);
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.redisService.keys(pattern);
  }

  async mget(...keys: string[]): Promise<(string | null)[]> {
    return await this.redisService.mget(keys);
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    return await this.redisService.sadd(key, ...members);
  }

  async smembers(key: string): Promise<string[]> {
    return await this.redisService.smembers(key);
  }

  // Pipeline support (simplified)
  pipeline() {
    return {
      setex: (key: string, seconds: number, value: string) =>
        this.setex(key, seconds, value),
      del: (key: string) => this.del(key),
      exec: async () => ['OK', 1], // Mock pipeline execution
    };
  }
}
