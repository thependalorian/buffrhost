/**
 * CORS Middleware
 * Handles Cross-Origin Resource Sharing
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { ConfigManager } from '../config/ConfigManager';
import { Logger } from '../utils/Logger';

export class CorsHandler {
  private config: ConfigManager;
  private logger: Logger;

  constructor() {
    this.config = ConfigManager.getInstance();
    this.logger = Logger.getInstance();
  }

  /**
   * Handle CORS for a request
   */
  public async handle(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
      const origin = req.headers.origin;
      const allowedOrigins = this.config.get('CORS_ORIGINS');
      const allowCredentials = this.config.get('CORS_ALLOW_CREDENTIALS');
      const allowedMethods = this.config.get('CORS_ALLOW_METHODS');
      const allowedHeaders = this.config.get('CORS_ALLOW_HEADERS');

      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        this.handlePreflight(req, res, origin, allowedOrigins, allowedMethods, allowedHeaders, allowCredentials);
        return;
      }

      // Handle actual requests
      this.handleActualRequest(req, res, origin, allowedOrigins, allowCredentials);
    } catch (error) {
      this.logger.error('CORS handling error:', error);
      // Don't throw error for CORS issues, just log them
    }
  }

  /**
   * Handle preflight OPTIONS requests
   */
  private handlePreflight(
    req: NextApiRequest,
    res: NextApiResponse,
    origin: string | undefined,
    allowedOrigins: string[],
    allowedMethods: string[],
    allowedHeaders: string[],
    allowCredentials: boolean
  ): void {
    // Check if origin is allowed
    if (origin && this.isOriginAllowed(origin, allowedOrigins)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (allowedOrigins.includes('*')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));
    res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '));
    
    if (allowCredentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    // Set preflight cache duration
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle Vary header
    res.setHeader('Vary', 'Origin');

    res.status(200).end();
  }

  /**
   * Handle actual requests
   */
  private handleActualRequest(
    req: NextApiRequest,
    res: NextApiResponse,
    origin: string | undefined,
    allowedOrigins: string[],
    allowCredentials: boolean
  ): void {
    // Check if origin is allowed
    if (origin && this.isOriginAllowed(origin, allowedOrigins)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (allowedOrigins.includes('*')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    if (allowCredentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    // Handle Vary header
    res.setHeader('Vary', 'Origin');
  }

  /**
   * Check if origin is allowed
   */
  private isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
    // Check exact match
    if (allowedOrigins.includes(origin)) {
      return true;
    }

    // Check wildcard patterns
    for (const allowedOrigin of allowedOrigins) {
      if (this.matchesPattern(origin, allowedOrigin)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if origin matches a pattern (supports wildcards)
   */
  private matchesPattern(origin: string, pattern: string): boolean {
    // Convert pattern to regex
    const regexPattern = pattern
      .replace(/\./g, '\\.')  // Escape dots
      .replace(/\*/g, '.*');  // Convert * to .*

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(origin);
  }

  /**
   * Get allowed origins for debugging
   */
  public getAllowedOrigins(): string[] {
    return this.config.get('CORS_ORIGINS');
  }

  /**
   * Check if credentials are allowed
   */
  public areCredentialsAllowed(): boolean {
    return this.config.get('CORS_ALLOW_CREDENTIALS');
  }

  /**
   * Get allowed methods
   */
  public getAllowedMethods(): string[] {
    return this.config.get('CORS_ALLOW_METHODS');
  }

  /**
   * Get allowed headers
   */
  public getAllowedHeaders(): string[] {
    return this.config.get('CORS_ALLOW_HEADERS');
  }
}