/**
 * Security Middleware
 * Handles security headers and basic security measures
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { ConfigManager } from '../config/ConfigManager';
import { Logger } from '../utils/Logger';

export class SecurityHandler {
  private config: ConfigManager;
  private logger: Logger;

  constructor() {
    this.config = ConfigManager.getInstance();
    this.logger = Logger.getInstance();
  }

  /**
   * Handle security for a request
   */
  public async handle(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
      // Set security headers
      this.setSecurityHeaders(req, res);
      
      // Check for suspicious patterns
      this.checkSuspiciousPatterns(req, res);
      
      // Validate request size
      this.validateRequestSize(req, res);
      
    } catch (error) {
      this.logger.error('Security handling error:', error);
      // Don't throw error for security issues, just log them
    }
  }

  /**
   * Set security headers
   */
  private setSecurityHeaders(req: NextApiRequest, res: NextApiResponse): void {
    // Content Security Policy
    res.setHeader('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https:; " +
      "frame-ancestors 'none';"
    );

    // X-Frame-Options
    res.setHeader('X-Frame-Options', 'DENY');

    // X-Content-Type-Options
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // X-XSS-Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Referrer-Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions-Policy
    res.setHeader('Permissions-Policy', 
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
    );

    // Strict-Transport-Security (only in production)
    if (this.config.isProduction()) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    // X-Powered-By (remove to hide technology stack)
    res.removeHeader('X-Powered-By');

    // Server (hide server information)
    res.setHeader('Server', 'Buffr Host API');
  }

  /**
   * Check for suspicious patterns in requests
   */
  private checkSuspiciousPatterns(req: NextApiRequest, res: NextApiResponse): void {
    const url = req.url || '';
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers.referer || '';

    // Check for SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(\b(OR|AND)\s+'.*'\s*=\s*'.*')/i,
      /(\b(OR|AND)\s+".*"\s*=\s*".*")/i,
      /(UNION\s+SELECT)/i,
      /(DROP\s+TABLE)/i,
      /(DELETE\s+FROM)/i,
      /(INSERT\s+INTO)/i,
      /(UPDATE\s+SET)/i,
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(url) || pattern.test(userAgent) || pattern.test(referer)) {
        this.logger.warn('Potential SQL injection attempt detected:', {
          url,
          userAgent,
          referer,
          ip: req.connection?.remoteAddress,
        });
        break;
      }
    }

    // Check for XSS patterns
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>.*?<\/embed>/gi,
      /<link[^>]*>.*?<\/link>/gi,
      /<meta[^>]*>.*?<\/meta>/gi,
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(url) || pattern.test(userAgent) || pattern.test(referer)) {
        this.logger.warn('Potential XSS attempt detected:', {
          url,
          userAgent,
          referer,
          ip: req.connection?.remoteAddress,
        });
        break;
      }
    }

    // Check for path traversal patterns
    const pathTraversalPatterns = [
      /\.\.\//g,
      /\.\.\\/g,
      /%2e%2e%2f/gi,
      /%2e%2e%5c/gi,
      /\.\.%2f/gi,
      /\.\.%5c/gi,
    ];

    for (const pattern of pathTraversalPatterns) {
      if (pattern.test(url)) {
        this.logger.warn('Potential path traversal attempt detected:', {
          url,
          ip: req.connection?.remoteAddress,
        });
        break;
      }
    }
  }

  /**
   * Validate request size
   */
  private validateRequestSize(req: NextApiRequest, res: NextApiResponse): void {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxFileSize = this.config.get('MAX_FILE_SIZE');

    if (contentLength > maxFileSize) {
      this.logger.warn('Request size exceeds limit:', {
        contentLength,
        maxFileSize,
        ip: req.connection?.remoteAddress,
      });
      
      res.status(413).json({
        error: 'Request entity too large',
        maxSize: maxFileSize,
        actualSize: contentLength,
      });
    }
  }

  /**
   * Check if request is from a trusted host
   */
  public isTrustedHost(req: NextApiRequest): boolean {
    if (this.config.isProduction()) {
      const host = req.headers.host;
      const trustedHosts = ['buffr.ai', 'host.buffr.ai', 'api.buffr.ai'];
      
      if (!host) {
        return false;
      }
      
      return trustedHosts.some(trustedHost => 
        host === trustedHost || host.endsWith(`.${trustedHost}`)
      );
    }
    
    return true; // Allow all hosts in development
  }

  /**
   * Get security headers for debugging
   */
  public getSecurityHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
      'Server': 'Buffr Host API',
    };
  }
}