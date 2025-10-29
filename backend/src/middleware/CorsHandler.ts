import { NextApiRequest, NextApiResponse } from 'next';
import { config } from '../config/ConfigManager';
import { logger } from '../utils/Logger';

export class CorsHandler {
  constructor() {}

  public async handle(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
      const origin = req.headers.origin;
      const allowedOrigins = config.get('CORS_ORIGINS');
      const allowCredentials = config.get('CORS_ALLOW_CREDENTIALS');
      const allowedMethods = config.get('CORS_ALLOW_METHODS');
      const allowedHeaders = config.get('CORS_ALLOW_HEADERS');

      if (req.method === 'OPTIONS') {
        this.handlePreflight(req, res, origin, allowedOrigins, allowedMethods, allowedHeaders, allowCredentials);
        return;
      }

      this.handleActualRequest(req, res, origin, allowedOrigins, allowCredentials);
    } catch (error) {
      logger.error('CORS handling error:', error);
    }
  }

  private handlePreflight(
    req: NextApiRequest,
    res: NextApiResponse,
    origin: string | undefined,
    allowedOrigins: string[],
    allowedMethods: string[],
    allowedHeaders: string[],
    allowCredentials: boolean
  ): void {
    if (origin && this.isOriginAllowed(origin, allowedOrigins)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (allowedOrigins.includes('*')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));
    res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '));
    
    if (allowCredentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    res.setHeader('Access-Control-Max-Age', '86400');

    res.setHeader('Vary', 'Origin');

    res.status(200).end();
  }

  private handleActualRequest(
    req: NextApiRequest,
    res: NextApiResponse,
    origin: string | undefined,
    allowedOrigins: string[],
    allowCredentials: boolean
  ): void {
    if (origin && this.isOriginAllowed(origin, allowedOrigins)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (allowedOrigins.includes('*')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    if (allowCredentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    res.setHeader('Vary', 'Origin');
  }

  private isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
    if (allowedOrigins.includes(origin)) {
      return true;
    }

    for (const allowedOrigin of allowedOrigins) {
      if (this.matchesPattern(origin, allowedOrigin)) {
        return true;
      }
    }

    return false;
  }

  private matchesPattern(origin: string, pattern: string): boolean {
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*');

    const regex = new RegExp(`^${regexPattern});
    return regex.test(origin);
  }

  public getAllowedOrigins(): string[] {
    return config.get('CORS_ORIGINS');
  }

  public areCredentialsAllowed(): boolean {
    return config.get('CORS_ALLOW_CREDENTIALS');
  }

  public getAllowedMethods(): string[] {
    return config.get('CORS_ALLOW_METHODS');
  }

  public getAllowedHeaders(): string[] {
    return config.get('CORS_ALLOW_HEADERS');
  }
}