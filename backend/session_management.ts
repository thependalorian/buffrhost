/**
 * SESSION MANAGEMENT SYSTEM
 * Advanced session and user state management for Buffr Host
 */

import { v4 as uuidv4 } from 'uuid';
import { createHash, randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';

// Enums
export enum SessionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
  SUSPENDED = 'suspended'
}

export enum SessionType {
  WEB = 'web',
  MOBILE = 'mobile',
  API = 'api',
  ADMIN = 'admin',
  GUEST = 'guest'
}

export enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  UNKNOWN = 'unknown'
}

// Interfaces
export interface SessionData {
  user_id: string;
  session_type: SessionType;
  device_info: Record<string, any>;
  ip_address: string;
  user_agent: string;
  location?: Record<string, any>;
  permissions: string[];
  preferences: Record<string, any>;
  metadata: Record<string, any>;
}

export interface SessionActivity {
  action: string;
  resource: string;
  timestamp: Date;
  ip_address: string;
  user_agent: string;
  metadata: Record<string, any>;
}

export interface Session {
  id: string;
  session_token: string;
  user_id: string;
  session_type: SessionType;
  status: SessionStatus;
  data: SessionData;
  device_type: DeviceType;
  device_id?: string;
  ip_address: string;
  user_agent: string;
  location?: Record<string, any>;
  is_secure: boolean;
  is_http_only: boolean;
  same_site: string;
  created_at: Date;
  last_activity: Date;
  expires_at: Date;
}

export interface SessionActivityRecord {
  id: string;
  session_id: string;
  action: string;
  resource: string;
  ip_address?: string;
  user_agent?: string;
  metadata: Record<string, any>;
  created_at: Date;
}

export interface SessionManagerOptions {
  db: any; // Database session/connection
  redisClient?: any; // Redis client for caching
  encryptionKey?: string;
  sessionTimeout?: number; // in seconds
  jwtSecret?: string;
}

export class SessionManager {
  private db: any;
  private redis?: any;
  private encryptionKey: string;
  private sessionTimeout: number;
  private jwtSecret: string;
  private sessionCache: Map<string, Session> = new Map();
  private cleanupInterval?: NodeJS.Timeout;

  constructor(options: SessionManagerOptions) {
    this.db = options.db;
    this.redis = options.redisClient;
    this.encryptionKey = options.encryptionKey || this.generateEncryptionKey();
    this.sessionTimeout = options.sessionTimeout || 1800; // 30 minutes default
    this.jwtSecret = options.jwtSecret || 'default-secret';
    this.startCleanupTask();
  }

  private generateEncryptionKey(): string {
    return randomBytes(32).toString('hex');
  }

  private startCleanupTask(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions();
    }, 300000); // Run every 5 minutes
  }

  private async cleanupExpiredSessions(): Promise<void> {
    try {
      const now = new Date();
      
      // Find expired sessions
      const result = await this.db.query(
        'SELECT * FROM sessions WHERE expires_at < ? AND status = ?',
        [now, SessionStatus.ACTIVE]
      );

      const expiredSessions = result.map((row: any) => this.mapRowToSession(row));

      for (const session of expiredSessions) {
        // Update session status
        await this.db.query(
          'UPDATE sessions SET status = ? WHERE id = ?',
          [SessionStatus.EXPIRED, session.id]
        );

        // Remove from cache
        this.sessionCache.delete(session.session_token);

        // Remove from Redis
        if (this.redis) {
          await this.redis.del(`session:${session.session_token}`);
        }
      }
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  }

  async createSession(
    userId: string,
    sessionType: SessionType,
    deviceInfo: Record<string, any> = {},
    ipAddress: string = '',
    userAgent: string = '',
    location?: Record<string, any>,
    permissions: string[] = [],
    preferences: Record<string, any> = {},
    metadata: Record<string, any> = {},
    expiresIn?: number
  ): Promise<Session> {
    try {
      // Generate session token
      const sessionToken = this.generateSessionToken();

      // Calculate expiration time
      const expiresInSeconds = expiresIn || this.sessionTimeout;
      const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

      // Create session data
      const sessionData: SessionData = {
        user_id: userId,
        session_type: sessionType,
        device_info: deviceInfo,
        ip_address: ipAddress,
        user_agent: userAgent,
        location,
        permissions,
        preferences,
        metadata
      };

      // Detect device type
      const deviceType = this.detectDeviceType(userAgent);

      // Create session
      const session: Session = {
        id: uuidv4(),
        session_token: sessionToken,
        user_id: userId,
        session_type: sessionType,
        status: SessionStatus.ACTIVE,
        data: sessionData,
        device_type: deviceType,
        ip_address: ipAddress,
        user_agent: userAgent,
        location,
        is_secure: true,
        is_http_only: true,
        same_site: 'Lax',
        created_at: new Date(),
        last_activity: new Date(),
        expires_at: expiresAt
      };

      // Insert into database
      await this.db.query(
        `INSERT INTO sessions (
          id, session_token, user_id, session_type, status, data, device_type,
          ip_address, user_agent, location, is_secure, is_http_only, same_site,
          created_at, last_activity, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          session.id, session.session_token, session.user_id, session.session_type,
          session.status, JSON.stringify(session.data), session.device_type,
          session.ip_address, session.user_agent, JSON.stringify(session.location || {}),
          session.is_secure, session.is_http_only, session.same_site,
          session.created_at, session.last_activity, session.expires_at
        ]
      );

      // Cache session
      this.sessionCache.set(sessionToken, session);

      // Store in Redis if available
      if (this.redis) {
        await this.storeSessionInRedis(session);
      }

      return session;
    } catch (error) {
      throw new Error(`Failed to create session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateSessionToken(): string {
    return randomBytes(32).toString('base64url');
  }

  private detectDeviceType(userAgent: string): DeviceType {
    if (!userAgent) {
      return DeviceType.UNKNOWN;
    }

    const userAgentLower = userAgent.toLowerCase();

    if (['mobile', 'android', 'iphone'].some(mobile => userAgentLower.includes(mobile))) {
      return DeviceType.MOBILE;
    } else if (['tablet', 'ipad'].some(tablet => userAgentLower.includes(tablet))) {
      return DeviceType.TABLET;
    } else {
      return DeviceType.DESKTOP;
    }
  }

  private async storeSessionInRedis(session: Session): Promise<void> {
    try {
      if (this.redis) {
        const sessionData = {
          id: session.id,
          user_id: session.user_id,
          session_type: session.session_type,
          status: session.status,
          data: session.data,
          device_type: session.device_type,
          ip_address: session.ip_address,
          user_agent: session.user_agent,
          location: session.location,
          created_at: session.created_at.toISOString(),
          last_activity: session.last_activity.toISOString(),
          expires_at: session.expires_at.toISOString()
        };

        // Encrypt sensitive data
        const encryptedData = this.encryptData(JSON.stringify(sessionData));

        // Store with expiration
        const ttl = Math.floor((session.expires_at.getTime() - Date.now()) / 1000);
        await this.redis.setex(`session:${session.session_token}`, ttl, encryptedData);
      }
    } catch (error) {
      console.error('Error storing session in Redis:', error);
    }
  }

  private encryptData(data: string): string {
    // Simple encryption for demo (use proper encryption in production)
    const cipher = createHash('sha256').update(this.encryptionKey).digest();
    return Buffer.from(data).toString('base64');
  }

  private decryptData(encryptedData: string): string {
    // Simple decryption for demo (use proper decryption in production)
    return Buffer.from(encryptedData, 'base64').toString();
  }

  async getSession(sessionToken: string): Promise<Session | null> {
    try {
      // Check cache first
      if (this.sessionCache.has(sessionToken)) {
        const session = this.sessionCache.get(sessionToken)!;
        if (session.status === SessionStatus.ACTIVE && session.expires_at > new Date()) {
          return session;
        } else {
          this.sessionCache.delete(sessionToken);
          return null;
        }
      }

      // Check Redis cache
      if (this.redis) {
        const cachedData = await this.redis.get(`session:${sessionToken}`);
        if (cachedData) {
          try {
            const decryptedData = this.decryptData(cachedData);
            const sessionData = JSON.parse(decryptedData);

            // Create session object from cached data
            const session: Session = {
              id: sessionData.id,
              session_token: sessionToken,
              user_id: sessionData.user_id,
              session_type: sessionData.session_type as SessionType,
              status: sessionData.status as SessionStatus,
              data: sessionData.data,
              device_type: sessionData.device_type as DeviceType,
              ip_address: sessionData.ip_address,
              user_agent: sessionData.user_agent,
              location: sessionData.location,
              is_secure: true,
              is_http_only: true,
              same_site: 'Lax',
              created_at: new Date(sessionData.created_at),
              last_activity: new Date(sessionData.last_activity),
              expires_at: new Date(sessionData.expires_at)
            };

            // Cache in memory
            this.sessionCache.set(sessionToken, session);

            // Check if session is valid
            if (session.status === SessionStatus.ACTIVE && session.expires_at > new Date()) {
              return session;
            } else {
              return null;
            }
          } catch (error) {
            console.error('Error parsing cached session data:', error);
          }
        }
      }

      // Check database
      const result = await this.db.query(
        'SELECT * FROM sessions WHERE session_token = ?',
        [sessionToken]
      );

      if (result.length === 0) {
        return null;
      }

      const session = this.mapRowToSession(result[0]);
      if (session.status === SessionStatus.ACTIVE && session.expires_at > new Date()) {
        this.sessionCache.set(sessionToken, session);
        return session;
      }

      return null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  async updateSessionActivity(
    sessionToken: string,
    action: string,
    resource: string,
    ipAddress: string = '',
    userAgent: string = '',
    metadata: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      const session = await this.getSession(sessionToken);
      if (!session) {
        return false;
      }

      // Update last activity
      session.last_activity = new Date();
      await this.db.query(
        'UPDATE sessions SET last_activity = ? WHERE id = ?',
        [session.last_activity, session.id]
      );

      // Log activity
      const activity: SessionActivityRecord = {
        id: uuidv4(),
        session_id: session.id,
        action,
        resource,
        ip_address: ipAddress,
        user_agent: userAgent,
        metadata,
        created_at: new Date()
      };

      await this.db.query(
        `INSERT INTO session_activities (id, session_id, action, resource, ip_address, user_agent, metadata, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          activity.id, activity.session_id, activity.action, activity.resource,
          activity.ip_address, activity.user_agent, JSON.stringify(activity.metadata),
          activity.created_at
        ]
      );

      // Update Redis cache
      if (this.redis) {
        await this.storeSessionInRedis(session);
      }

      return true;
    } catch (error) {
      console.error('Error updating session activity:', error);
      return false;
    }
  }

  async extendSession(sessionToken: string, extendBy?: number): Promise<boolean> {
    try {
      const session = await this.getSession(sessionToken);
      if (!session) {
        return false;
      }

      const extendBySeconds = extendBy || this.sessionTimeout;
      session.expires_at = new Date(Date.now() + extendBySeconds * 1000);
      session.last_activity = new Date();

      await this.db.query(
        'UPDATE sessions SET expires_at = ?, last_activity = ? WHERE id = ?',
        [session.expires_at, session.last_activity, session.id]
      );

      // Update Redis cache
      if (this.redis) {
        await this.storeSessionInRedis(session);
      }

      return true;
    } catch (error) {
      console.error('Error extending session:', error);
      return false;
    }
  }

  async terminateSession(sessionToken: string, reason: string = 'manual'): Promise<boolean> {
    try {
      const session = await this.getSession(sessionToken);
      if (!session) {
        return false;
      }

      session.status = SessionStatus.TERMINATED;
      await this.db.query(
        'UPDATE sessions SET status = ? WHERE id = ?',
        [session.status, session.id]
      );

      // Remove from cache
      this.sessionCache.delete(sessionToken);

      // Remove from Redis
      if (this.redis) {
        await this.redis.del(`session:${sessionToken}`);
      }

      return true;
    } catch (error) {
      console.error('Error terminating session:', error);
      return false;
    }
  }

  async terminateUserSessions(userId: string, excludeToken?: string): Promise<number> {
    try {
      let query = 'SELECT * FROM sessions WHERE user_id = ? AND status = ?';
      const params: any[] = [userId, SessionStatus.ACTIVE];

      if (excludeToken) {
        query += ' AND session_token != ?';
        params.push(excludeToken);
      }

      const result = await this.db.query(query, params);
      const sessions = result.map((row: any) => this.mapRowToSession(row));
      let count = 0;

      for (const session of sessions) {
        session.status = SessionStatus.TERMINATED;
        await this.db.query(
          'UPDATE sessions SET status = ? WHERE id = ?',
          [session.status, session.id]
        );
        count++;

        // Remove from cache
        this.sessionCache.delete(session.session_token);

        // Remove from Redis
        if (this.redis) {
          await this.redis.del(`session:${session.session_token}`);
        }
      }

      return count;
    } catch (error) {
      console.error('Error terminating user sessions:', error);
      return 0;
    }
  }

  async suspendSession(sessionToken: string, reason: string = 'security'): Promise<boolean> {
    try {
      const session = await this.getSession(sessionToken);
      if (!session) {
        return false;
      }

      session.status = SessionStatus.SUSPENDED;
      await this.db.query(
        'UPDATE sessions SET status = ? WHERE id = ?',
        [session.status, session.id]
      );

      // Update Redis cache
      if (this.redis) {
        await this.storeSessionInRedis(session);
      }

      return true;
    } catch (error) {
      console.error('Error suspending session:', error);
      return false;
    }
  }

  async resumeSession(sessionToken: string): Promise<boolean> {
    try {
      const session = await this.getSession(sessionToken);
      if (!session || session.status !== SessionStatus.SUSPENDED) {
        return false;
      }

      session.status = SessionStatus.ACTIVE;
      session.last_activity = new Date();
      await this.db.query(
        'UPDATE sessions SET status = ?, last_activity = ? WHERE id = ?',
        [session.status, session.last_activity, session.id]
      );

      // Update Redis cache
      if (this.redis) {
        await this.storeSessionInRedis(session);
      }

      return true;
    } catch (error) {
      console.error('Error resuming session:', error);
      return false;
    }
  }

  async getUserSessions(userId: string, activeOnly: boolean = true): Promise<Session[]> {
    try {
      let query = 'SELECT * FROM sessions WHERE user_id = ?';
      const params: any[] = [userId];

      if (activeOnly) {
        query += ' AND status = ?';
        params.push(SessionStatus.ACTIVE);
      }

      query += ' ORDER BY last_activity DESC';

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToSession(row));
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  }

  async getSessionActivities(sessionId: string, limit: number = 100): Promise<SessionActivityRecord[]> {
    try {
      const result = await this.db.query(
        'SELECT * FROM session_activities WHERE session_id = ? ORDER BY created_at DESC LIMIT ?',
        [sessionId, limit]
      );
      return result.map((row: any) => this.mapRowToSessionActivity(row));
    } catch (error) {
      console.error('Error getting session activities:', error);
      return [];
    }
  }

  async validateSession(sessionToken: string, requiredPermissions: string[] = []): Promise<boolean> {
    try {
      const session = await this.getSession(sessionToken);
      if (!session) {
        return false;
      }

      // Check if session is active
      if (session.status !== SessionStatus.ACTIVE) {
        return false;
      }

      // Check if session is expired
      if (session.expires_at <= new Date()) {
        session.status = SessionStatus.EXPIRED;
        await this.db.query(
          'UPDATE sessions SET status = ? WHERE id = ?',
          [session.status, session.id]
        );
        return false;
      }

      // Check permissions if required
      if (requiredPermissions.length > 0) {
        const userPermissions = session.data.permissions;
        for (const permission of requiredPermissions) {
          if (!userPermissions.includes(permission)) {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error validating session:', error);
      return false;
    }
  }

  async getSessionData(sessionToken: string): Promise<SessionData | null> {
    try {
      const session = await this.getSession(sessionToken);
      if (!session) {
        return null;
      }
      return session.data;
    } catch (error) {
      console.error('Error getting session data:', error);
      return null;
    }
  }

  async updateSessionData(sessionToken: string, dataUpdates: Record<string, any>): Promise<boolean> {
    try {
      const session = await this.getSession(sessionToken);
      if (!session) {
        return false;
      }

      // Update session data
      const updatedData = { ...session.data, ...dataUpdates };
      session.data = updatedData;
      session.last_activity = new Date();

      await this.db.query(
        'UPDATE sessions SET data = ?, last_activity = ? WHERE id = ?',
        [JSON.stringify(session.data), session.last_activity, session.id]
      );

      // Update Redis cache
      if (this.redis) {
        await this.storeSessionInRedis(session);
      }

      return true;
    } catch (error) {
      console.error('Error updating session data:', error);
      return false;
    }
  }

  async getSessionStatistics(userId?: string): Promise<Record<string, any>> {
    try {
      let query = 'SELECT * FROM sessions';
      const params: any[] = [];

      if (userId) {
        query += ' WHERE user_id = ?';
        params.push(userId);
      }

      const result = await this.db.query(query, params);
      const totalSessions = result.length;
      const activeSessions = result.filter((row: any) => row.status === SessionStatus.ACTIVE).length;
      const expiredSessions = result.filter((row: any) => row.status === SessionStatus.EXPIRED).length;
      const terminatedSessions = result.filter((row: any) => row.status === SessionStatus.TERMINATED).length;
      const suspendedSessions = result.filter((row: any) => row.status === SessionStatus.SUSPENDED).length;

      // Count by type
      const typeCounts: Record<string, number> = {};
      for (const sessionType of Object.values(SessionType)) {
        typeCounts[sessionType] = result.filter((row: any) => row.session_type === sessionType).length;
      }

      // Count by device type
      const deviceCounts: Record<string, number> = {};
      for (const deviceType of Object.values(DeviceType)) {
        deviceCounts[deviceType] = result.filter((row: any) => row.device_type === deviceType).length;
      }

      return {
        total_sessions: totalSessions,
        active_sessions: activeSessions,
        expired_sessions: expiredSessions,
        terminated_sessions: terminatedSessions,
        suspended_sessions: suspendedSessions,
        by_type: typeCounts,
        by_device: deviceCounts
      };
    } catch (error) {
      console.error('Error getting session statistics:', error);
      return {};
    }
  }

  // Helper methods
  private mapRowToSession(row: any): Session {
    return {
      id: row.id,
      session_token: row.session_token,
      user_id: row.user_id,
      session_type: row.session_type as SessionType,
      status: row.status as SessionStatus,
      data: JSON.parse(row.data || '{}'),
      device_type: row.device_type as DeviceType,
      device_id: row.device_id,
      ip_address: row.ip_address,
      user_agent: row.user_agent,
      location: JSON.parse(row.location || '{}'),
      is_secure: Boolean(row.is_secure),
      is_http_only: Boolean(row.is_http_only),
      same_site: row.same_site,
      created_at: new Date(row.created_at),
      last_activity: new Date(row.last_activity),
      expires_at: new Date(row.expires_at)
    };
  }

  private mapRowToSessionActivity(row: any): SessionActivityRecord {
    return {
      id: row.id,
      session_id: row.session_id,
      action: row.action,
      resource: row.resource,
      ip_address: row.ip_address,
      user_agent: row.user_agent,
      metadata: JSON.parse(row.metadata || '{}'),
      created_at: new Date(row.created_at)
    };
  }

  // Cleanup method
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

export default SessionManager;