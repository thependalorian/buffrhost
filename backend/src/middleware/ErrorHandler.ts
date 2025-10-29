import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '../utils/Logger';

export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(statusCode: number, message: string, code: string = 'API_ERROR', details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(400, message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super(401, message, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Access denied') {
    super(403, message, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(404, message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Resource conflict') {
    super(409, message, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Too many requests') {
    super(429, message, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class DatabaseError extends ApiError {
  constructor(message: string = 'Database error') {
    super(500, message, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

export class ExternalServiceError extends ApiError {
  constructor(message: string = 'External service error') {
    super(502, message, 'EXTERNAL_SERVICE_ERROR');
    this.name = 'ExternalServiceError';
  }
}

export class ErrorHandler {
  constructor() {}

  public handle(err: Error, req: NextApiRequest, res: NextApiResponse): void {
    let error = err;

    if (!(error instanceof ApiError)) {
      // Convert to ApiError if it's a generic error
      error = new ApiError(500, error.message || 'Something went wrong', 'INTERNAL_SERVER_ERROR', { stack: error.stack });
    }

    logger.error('API Error:', {
      message: error.message,
      code: (error as ApiError).code,
      statusCode: (error as ApiError).statusCode,
      details: (error as ApiError).details,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      query: req.query,
      ip: req.socket.remoteAddress,
    });

    // Send error response
    res.status((error as ApiError).statusCode).json({
      error: {
        message: error.message,
        code: (error as ApiError).code,
        statusCode: (error as ApiError).statusCode,
        details: (error as ApiError).details,
        timestamp: new Date().toISOString(),
        path: req.url,
        method: req.method,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
    });
  }
}
