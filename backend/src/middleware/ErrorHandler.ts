/**
 * Error Handling Middleware
 * Centralized error handling for the API
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { Logger } from '../utils/Logger';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export class ErrorHandler {
  private logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
  }

  public handle(error: any, req: NextApiRequest, res: NextApiResponse): void {
    this.logger.error('API Error:', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      query: req.query,
    });

    // Default error response
    let statusCode = 500;
    let message = 'Internal Server Error';
    let code = 'INTERNAL_ERROR';
    let details = null;

    // Handle different error types
    if (error instanceof ValidationError) {
      statusCode = 400;
      message = 'Validation Error';
      code = 'VALIDATION_ERROR';
      details = error.details;
    } else if (error instanceof AuthenticationError) {
      statusCode = 401;
      message = 'Authentication Required';
      code = 'AUTHENTICATION_ERROR';
    } else if (error instanceof AuthorizationError) {
      statusCode = 403;
      message = 'Access Denied';
      code = 'AUTHORIZATION_ERROR';
    } else if (error instanceof NotFoundError) {
      statusCode = 404;
      message = 'Resource Not Found';
      code = 'NOT_FOUND';
    } else if (error instanceof ConflictError) {
      statusCode = 409;
      message = 'Resource Conflict';
      code = 'CONFLICT';
    } else if (error instanceof RateLimitError) {
      statusCode = 429;
      message = 'Too Many Requests';
      code = 'RATE_LIMIT_EXCEEDED';
    } else if (error instanceof DatabaseError) {
      statusCode = 500;
      message = 'Database Error';
      code = 'DATABASE_ERROR';
    } else if (error instanceof ExternalServiceError) {
      statusCode = 502;
      message = 'External Service Error';
      code = 'EXTERNAL_SERVICE_ERROR';
    } else if (error instanceof ApiError) {
      statusCode = error.statusCode || 500;
      message = error.message;
      code = error.code || 'API_ERROR';
      details = error.details;
    }

    // Send error response
    res.status(statusCode).json({
      error: {
        message,
        code,
        statusCode,
        details,
        timestamp: new Date().toISOString(),
        path: req.url,
        method: req.method,
      },
    });
  }
}

// Custom error classes
export class ValidationError extends Error implements ApiError {
  public statusCode = 400;
  public code = 'VALIDATION_ERROR';
  public details: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class AuthenticationError extends Error implements ApiError {
  public statusCode = 401;
  public code = 'AUTHENTICATION_ERROR';

  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error implements ApiError {
  public statusCode = 403;
  public code = 'AUTHORIZATION_ERROR';

  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error implements ApiError {
  public statusCode = 404;
  public code = 'NOT_FOUND';

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error implements ApiError {
  public statusCode = 409;
  public code = 'CONFLICT';

  constructor(message: string = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends Error implements ApiError {
  public statusCode = 429;
  public code = 'RATE_LIMIT_EXCEEDED';

  constructor(message: string = 'Too many requests') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class DatabaseError extends Error implements ApiError {
  public statusCode = 500;
  public code = 'DATABASE_ERROR';

  constructor(message: string = 'Database error') {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ExternalServiceError extends Error implements ApiError {
  public statusCode = 502;
  public code = 'EXTERNAL_SERVICE_ERROR';

  constructor(message: string = 'External service error') {
    super(message);
    this.name = 'ExternalServiceError';
  }
}