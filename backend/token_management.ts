/**
 * TOKEN MANAGEMENT SYSTEM
 * Advanced token generation, validation, and management for Buffr Host
 */

import { v4 as uuidv4 } from 'uuid';
import { createHash, randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';

// Enums
export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
  API_KEY = 'api_key',
  RESET_PASSWORD = 'reset_password',
  EMAIL_VERIFICATION = 'email_verification',
  TWO_FACTOR = 'two_factor',
  INVITATION = 'invitation',
  WEBHOOK = 'webhook',
  INTEGRATION = 'integration',
  CUSTOM = 'custom'
}

export enum TokenStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  SUSPENDED = 'suspended'
}

export enum TokenScope {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin',
  USER = 'user',
  API = 'api',
  WEBHOOK = 'webhook',
  INTEGRATION = 'integration',
  CUSTOM = 'custom'
}

// Interfaces
export interface TokenPayload {
  sub: string; // Subject (user ID)
  type: TokenType;
  scope: TokenScope[];
  iat: number; // Issued at
  exp: number; // Expires at
  jti: string; // JWT ID
  metadata: Record<string, any>;
}

export interface Token {
  id: string;
  token_hash: string;
  token_type: TokenType;
  status: TokenStatus;
  user_id: string;
  scope: TokenScope[];
  payload: TokenPayload;
  expires_at: Date;
  created_at: Date;
  last_used_at?: Date;
  revoked_at?: Date;
  revoked_by?: string;
  metadata: Record<string, any>;
}

export interface TokenUsage {
  id: string;
  token_id: string;
  used_at: Date;
  ip_address?: string;
  user_agent?: string;
  endpoint?: string;
  method?: string;
  status_code?: number;
  response_time?: number;
  metadata: Record<string, any>;
}

export interface TokenManagerOptions {
  db: any; // Database session/connection
  redisClient?: any; // Redis client for caching
  jwtSecret?: string;
  encryptionKey?: string;
  defaultExpiry?: Record<TokenType, number>; // in seconds
}

export class TokenManager {
  private db: any;
  private redis?: any;
  private jwtSecret: string;
  private encryptionKey: string;
  private defaultExpiry: Record<TokenType, number>;
  private tokenCache: Map<string, Token> = new Map();

  constructor(options: TokenManagerOptions) {
    this.db = options.db;
    this.redis = options.redisClient;
    this.jwtSecret = options.jwtSecret || 'default-secret';
    this.encryptionKey = options.encryptionKey || this.generateEncryptionKey();
    this.defaultExpiry = {
      [TokenType.ACCESS]: 3600, // 1 hour
      [TokenType.REFRESH]: 2592000, // 30 days
      [TokenType.API_KEY]: 31536000, // 1 year
      [TokenType.RESET_PASSWORD]: 3600, // 1 hour
      [TokenType.EMAIL_VERIFICATION]: 86400, // 24 hours
      [TokenType.TWO_FACTOR]: 300, // 5 minutes
      [TokenType.INVITATION]: 604800, // 7 days
      [TokenType.WEBHOOK]: 31536000, // 1 year
      [TokenType.INTEGRATION]: 31536000, // 1 year
      [TokenType.CUSTOM]: 3600, // 1 hour
      ...options.defaultExpiry
    };
  }

  private generateEncryptionKey(): string {
    return randomBytes(32).toString('hex');
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private encryptToken(token: string): string {
    // Simple encryption for demo (use proper encryption in production)
    const cipher = createHash('sha256').update(this.encryptionKey).digest();
    return Buffer.from(token).toString('base64');
  }

  private decryptToken(encryptedToken: string): string {
    // Simple decryption for demo (use proper decryption in production)
    return Buffer.from(encryptedToken, 'base64').toString();
  }

  async generateToken(
    userId: string,
    tokenType: TokenType,
    scope: TokenScope[],
    expiresIn?: number,
    metadata: Record<string, any> = {}
  ): Promise<{ token: string; tokenData: Token }> {
    try {
      const jti = uuidv4();
      const now = Math.floor(Date.now() / 1000);
      const expiry = expiresIn || this.defaultExpiry[tokenType];
      const expiresAt = new Date((now + expiry) * 1000);

      // Create JWT payload
      const payload: TokenPayload = {
        sub: userId,
        type: tokenType,
        scope,
        iat: now,
        exp: now + expiry,
        jti,
        metadata
      };

      // Generate JWT token
      const token = jwt.sign(payload, this.jwtSecret, {
        algorithm: 'HS256',
        expiresIn: expiry
      });

      // Create token record
      const tokenData: Token = {
        id: uuidv4(),
        token_hash: this.hashToken(token),
        token_type: tokenType,
        status: TokenStatus.ACTIVE,
        user_id: userId,
        scope,
        payload,
        expires_at: expiresAt,
        created_at: new Date(),
        metadata
      };

      // Store in database
      await this.db.query(
        `INSERT INTO tokens (
          id, token_hash, token_type, status, user_id, scope, payload, expires_at, created_at, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tokenData.id, tokenData.token_hash, tokenData.token_type, tokenData.status,
          tokenData.user_id, JSON.stringify(tokenData.scope), JSON.stringify(tokenData.payload),
          tokenData.expires_at, tokenData.created_at, JSON.stringify(tokenData.metadata)
        ]
      );

      // Cache token
      this.tokenCache.set(tokenData.id, tokenData);

      // Store in Redis if available
      if (this.redis) {
        await this.redis.setex(
          `token:${tokenData.id}`,
          expiry,
          JSON.stringify(tokenData)
        );
      }

      return { token, tokenData };
    } catch (error) {
      throw new Error(`Failed to generate token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateApiKey(
    userId: string,
    name: string,
    scope: TokenScope[],
    expiresIn?: number,
    metadata: Record<string, any> = {}
  ): Promise<{ apiKey: string; tokenData: Token }> {
    try {
      // Generate API key
      const apiKey = `buffr_${randomBytes(32).toString('base64url')}`;
      
      // Generate token with API key type
      const result = await this.generateToken(userId, TokenType.API_KEY, scope, expiresIn, {
        ...metadata,
        name,
        api_key: true
      });

      return { apiKey: result.token, tokenData: result.tokenData };
    } catch (error) {
      throw new Error(`Failed to generate API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validateToken(token: string): Promise<{ valid: boolean; token?: Token; payload?: TokenPayload; error?: string }> {
    try {
      // Verify JWT signature
      let payload: TokenPayload;
      try {
        payload = jwt.verify(token, this.jwtSecret) as TokenPayload;
      } catch (jwtError) {
        return { valid: false, error: 'Invalid token signature' };
      }

      // Check if token is expired
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return { valid: false, error: 'Token expired' };
      }

      // Find token in database
      const tokenHash = this.hashToken(token);
      const result = await this.db.query(
        'SELECT * FROM tokens WHERE token_hash = ?',
        [tokenHash]
      );

      if (result.length === 0) {
        return { valid: false, error: 'Token not found' };
      }

      const tokenData = this.mapRowToToken(result[0]);

      // Check token status
      if (tokenData.status !== TokenStatus.ACTIVE) {
        return { valid: false, error: `Token ${tokenData.status}` };
      }

      // Check if token is expired in database
      if (tokenData.expires_at < new Date()) {
        await this.updateTokenStatus(tokenData.id, TokenStatus.EXPIRED);
        return { valid: false, error: 'Token expired' };
      }

      // Update last used timestamp
      await this.updateTokenLastUsed(tokenData.id);

      return { valid: true, token: tokenData, payload };
    } catch (error) {
      console.error('Error validating token:', error);
      return { valid: false, error: 'Token validation failed' };
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; tokenData: Token } | null> {
    try {
      // Validate refresh token
      const validation = await this.validateToken(refreshToken);
      if (!validation.valid || !validation.token || !validation.payload) {
        return null;
      }

      const tokenData = validation.token;
      const payload = validation.payload;

      // Check if it's a refresh token
      if (payload.type !== TokenType.REFRESH) {
        return null;
      }

      // Revoke old refresh token
      await this.revokeToken(refreshToken, 'refreshed');

      // Generate new access token
      const accessTokenResult = await this.generateToken(
        payload.sub,
        TokenType.ACCESS,
        payload.scope,
        this.defaultExpiry[TokenType.ACCESS],
        payload.metadata
      );

      // Generate new refresh token
      const refreshTokenResult = await this.generateToken(
        payload.sub,
        TokenType.REFRESH,
        payload.scope,
        this.defaultExpiry[TokenType.REFRESH],
        payload.metadata
      );

      return {
        accessToken: accessTokenResult.token,
        refreshToken: refreshTokenResult.token,
        tokenData: accessTokenResult.tokenData
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  async revokeToken(token: string, reason: string = 'manual'): Promise<boolean> {
    try {
      // Find token
      const tokenHash = this.hashToken(token);
      const result = await this.db.query(
        'SELECT * FROM tokens WHERE token_hash = ?',
        [tokenHash]
      );

      if (result.length === 0) {
        return false;
      }

      const tokenData = this.mapRowToToken(result[0]);

      // Update token status
      await this.updateTokenStatus(tokenData.id, TokenStatus.REVOKED, reason);

      return true;
    } catch (error) {
      console.error('Error revoking token:', error);
      return false;
    }
  }

  async revokeUserTokens(userId: string, excludeToken?: string): Promise<number> {
    try {
      let query = 'SELECT * FROM tokens WHERE user_id = ? AND status = ?';
      const params: any[] = [userId, TokenStatus.ACTIVE];

      if (excludeToken) {
        const excludeHash = this.hashToken(excludeToken);
        query += ' AND token_hash != ?';
        params.push(excludeHash);
      }

      const result = await this.db.query(query, params);
      let count = 0;

      for (const row of result) {
        const tokenData = this.mapRowToToken(row);
        await this.updateTokenStatus(tokenData.id, TokenStatus.REVOKED, 'user_logout');
        count++;
      }

      return count;
    } catch (error) {
      console.error('Error revoking user tokens:', error);
      return 0;
    }
  }

  async updateTokenStatus(
    tokenId: string,
    status: TokenStatus,
    reason?: string
  ): Promise<boolean> {
    try {
      const updateFields: string[] = ['status = ?', 'updated_at = ?'];
      const params: any[] = [status, new Date()];

      if (status === TokenStatus.REVOKED) {
        updateFields.push('revoked_at = ?');
        params.push(new Date());
        if (reason) {
          updateFields.push('revoked_by = ?');
          params.push(reason);
        }
      }

      params.push(tokenId);

      await this.db.query(
        `UPDATE tokens SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );

      // Update cache
      if (this.tokenCache.has(tokenId)) {
        const token = this.tokenCache.get(tokenId)!;
        token.status = status;
        if (status === TokenStatus.REVOKED) {
          token.revoked_at = new Date();
          token.revoked_by = reason;
        }
      }

      return true;
    } catch (error) {
      console.error('Error updating token status:', error);
      return false;
    }
  }

  private async updateTokenLastUsed(tokenId: string): Promise<void> {
    try {
      await this.db.query(
        'UPDATE tokens SET last_used_at = ? WHERE id = ?',
        [new Date(), tokenId]
      );

      // Update cache
      if (this.tokenCache.has(tokenId)) {
        const token = this.tokenCache.get(tokenId)!;
        token.last_used_at = new Date();
      }
    } catch (error) {
      console.error('Error updating token last used:', error);
    }
  }

  async logTokenUsage(
    tokenId: string,
    ipAddress?: string,
    userAgent?: string,
    endpoint?: string,
    method?: string,
    statusCode?: number,
    responseTime?: number,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      const usage: TokenUsage = {
        id: uuidv4(),
        token_id: tokenId,
        used_at: new Date(),
        ip_address: ipAddress,
        user_agent: userAgent,
        endpoint,
        method,
        status_code: statusCode,
        response_time: responseTime,
        metadata
      };

      await this.db.query(
        `INSERT INTO token_usages (
          id, token_id, used_at, ip_address, user_agent, endpoint, method,
          status_code, response_time, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          usage.id, usage.token_id, usage.used_at, usage.ip_address, usage.user_agent,
          usage.endpoint, usage.method, usage.status_code, usage.response_time,
          JSON.stringify(usage.metadata)
        ]
      );
    } catch (error) {
      console.error('Error logging token usage:', error);
    }
  }

  async getToken(tokenId: string): Promise<Token | null> {
    try {
      // Check cache first
      if (this.tokenCache.has(tokenId)) {
        return this.tokenCache.get(tokenId)!;
      }

      // Check Redis cache
      if (this.redis) {
        const cachedToken = await this.redis.get(`token:${tokenId}`);
        if (cachedToken) {
          const token = JSON.parse(cachedToken);
          this.tokenCache.set(tokenId, token);
          return token;
        }
      }

      // Query database
      const result = await this.db.query('SELECT * FROM tokens WHERE id = ?', [tokenId]);
      if (result.length === 0) {
        return null;
      }

      const token = this.mapRowToToken(result[0]);
      this.tokenCache.set(tokenId, token);

      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async getUserTokens(
    userId: string,
    tokenType?: TokenType,
    status?: TokenStatus,
    limit: number = 100
  ): Promise<Token[]> {
    try {
      let query = 'SELECT * FROM tokens WHERE user_id = ?';
      const params: any[] = [userId];

      if (tokenType) {
        query += ' AND token_type = ?';
        params.push(tokenType);
      }
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }

      query += ' ORDER BY created_at DESC LIMIT ?';
      params.push(limit);

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToToken(row));
    } catch (error) {
      console.error('Error getting user tokens:', error);
      return [];
    }
  }

  async getTokenUsage(
    tokenId: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 100
  ): Promise<TokenUsage[]> {
    try {
      let query = 'SELECT * FROM token_usages WHERE token_id = ?';
      const params: any[] = [tokenId];

      if (startDate) {
        query += ' AND used_at >= ?';
        params.push(startDate);
      }
      if (endDate) {
        query += ' AND used_at <= ?';
        params.push(endDate);
      }

      query += ' ORDER BY used_at DESC LIMIT ?';
      params.push(limit);

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToTokenUsage(row));
    } catch (error) {
      console.error('Error getting token usage:', error);
      return [];
    }
  }

  async cleanupExpiredTokens(): Promise<number> {
    try {
      const now = new Date();
      const result = await this.db.query(
        'SELECT * FROM tokens WHERE expires_at < ? AND status = ?',
        [now, TokenStatus.ACTIVE]
      );

      let count = 0;
      for (const row of result) {
        const token = this.mapRowToToken(row);
        await this.updateTokenStatus(token.id, TokenStatus.EXPIRED);
        count++;
      }

      return count;
    } catch (error) {
      console.error('Error cleaning up expired tokens:', error);
      return 0;
    }
  }

  async getTokenStatistics(userId?: string): Promise<Record<string, any>> {
    try {
      let query = 'SELECT * FROM tokens';
      const params: any[] = [];

      if (userId) {
        query += ' WHERE user_id = ?';
        params.push(userId);
      }

      const result = await this.db.query(query, params);
      const totalTokens = result.length;

      // Count by type
      const typeCounts: Record<string, number> = {};
      for (const type of Object.values(TokenType)) {
        typeCounts[type] = result.filter((row: any) => row.token_type === type).length;
      }

      // Count by status
      const statusCounts: Record<string, number> = {};
      for (const status of Object.values(TokenStatus)) {
        statusCounts[status] = result.filter((row: any) => row.status === status).length;
      }

      // Get usage statistics
      let usageQuery = 'SELECT COUNT(*) as total_usage, AVG(response_time) as avg_response_time FROM token_usages';
      const usageParams: any[] = [];

      if (userId) {
        usageQuery += ' WHERE token_id IN (SELECT id FROM tokens WHERE user_id = ?)';
        usageParams.push(userId);
      }

      const usageResult = await this.db.query(usageQuery, usageParams);
      const usageStats = usageResult[0];

      return {
        total_tokens: totalTokens,
        by_type: typeCounts,
        by_status: statusCounts,
        total_usage: usageStats.total_usage || 0,
        average_response_time: usageStats.avg_response_time || 0
      };
    } catch (error) {
      console.error('Error getting token statistics:', error);
      return {};
    }
  }

  // Helper methods
  private mapRowToToken(row: any): Token {
    return {
      id: row.id,
      token_hash: row.token_hash,
      token_type: row.token_type as TokenType,
      status: row.status as TokenStatus,
      user_id: row.user_id,
      scope: JSON.parse(row.scope || '[]'),
      payload: JSON.parse(row.payload || '{}'),
      expires_at: new Date(row.expires_at),
      created_at: new Date(row.created_at),
      last_used_at: row.last_used_at ? new Date(row.last_used_at) : undefined,
      revoked_at: row.revoked_at ? new Date(row.revoked_at) : undefined,
      revoked_by: row.revoked_by,
      metadata: JSON.parse(row.metadata || '{}')
    };
  }

  private mapRowToTokenUsage(row: any): TokenUsage {
    return {
      id: row.id,
      token_id: row.token_id,
      used_at: new Date(row.used_at),
      ip_address: row.ip_address,
      user_agent: row.user_agent,
      endpoint: row.endpoint,
      method: row.method,
      status_code: row.status_code,
      response_time: row.response_time,
      metadata: JSON.parse(row.metadata || '{}')
    };
  }
}

export default TokenManager;