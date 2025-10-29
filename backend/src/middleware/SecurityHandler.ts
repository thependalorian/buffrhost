/**
 * Security Middleware
 * Handles security headers and basic security measures
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { config } from '../config/ConfigManager';
import { logger } from '../utils/Logger';

export class SecurityHandler {
  constructor() {}

  public handle(req: NextApiRequest, res: NextApiResponse, next: Function): void {
    this.setSecurityHeaders(req, res);
    this.preventClickjacking(res);
    this.detectSQLInjection(req);
    this.detectXSS(req);
    this.checkSuspiciousPatterns(req, res);
    next();
  }

  private setSecurityHeaders(req: NextApiRequest, res: NextApiResponse): void {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('Content-Security-Policy', config.get('CSP_HEADER') || "default-src 'self'");
  }

  private preventClickjacking(res: NextApiResponse): void {
    res.setHeader('X-Frame-Options', 'DENY');
  }

  private detectSQLInjection(req: NextApiRequest): void {
    const sqlRegex = /('|") OR (.*?)('|")=|('|") OR ('|")1/i;
    const check = (value: string) => {
      if (sqlRegex.test(value)) {
        logger.warn('SQL Injection attempt detected', { ip: req.socket.remoteAddress, url: req.url, value });
        throw new Error('SQL Injection attempt detected');
      }
    };

    if (req.url) check(req.url);
    if (req.body) {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          check(req.body[key]);
        }
      }
    }
    if (req.query) {
      for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
          check(req.query[key]);
        }
      }
    }
  }

  private detectXSS(req: NextApiRequest): void {
    const xssRegex = /<script>|<\/script>|javascript:|eval\(|expression\(|data:text\/html/i;
    const check = (value: string) => {
      if (xssRegex.test(value)) {
        logger.warn('XSS attempt detected', { ip: req.socket.remoteAddress, url: req.url, value });
        throw new Error('XSS attempt detected');
      }
    };

    if (req.url) check(req.url);
    if (req.body) {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          check(req.body[key]);
        }
      }
    }
    if (req.query) {
      for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
          check(req.query[key]);
        }
      }
    }
  }

  private checkSuspiciousPatterns(req: NextApiRequest, res: NextApiResponse): void {
    const userAgent = req.headers['user-agent'] || '';
    const suspiciousUserAgents = ['sqlmap', 'nmap', 'nessus'];

    if (suspiciousUserAgents.some(ua => userAgent.includes(ua))) {
      logger.warn('Suspicious User-Agent detected', { ip: req.socket.remoteAddress, userAgent });
      res.status(403).send('Forbidden');
      return;
    }

    const referer = req.headers.referer || '';
    const allowedReferers = config.get('ALLOWED_REFERERS') || [];

    if (allowedReferers.length > 0 && !allowedReferers.some(r => referer.includes(r))) {
      logger.warn('Suspicious Referer detected', { ip: req.socket.remoteAddress, referer });
      // res.status(403).send('Forbidden'); // Uncomment to block
    }
  }

  private validateRequestSize(req: NextApiRequest, res: NextApiResponse): void {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxFileSize = config.get('MAX_FILE_SIZE');

    if (contentLength > maxFileSize) {
      logger.warn('Request size exceeds limit:', {
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

  public isTrustedHost(req: NextApiRequest): boolean {
    if (config.isProduction()) {
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