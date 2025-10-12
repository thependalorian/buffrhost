/**
 * Logger Utility
 * Centralized logging for the application
 */

import winston from 'winston';
import { ConfigManager } from '../config/ConfigManager';

export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;
  private config: ConfigManager;

  private constructor() {
    this.config = ConfigManager.getInstance();
    this.logger = this.createLogger();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Create Winston logger instance
   */
  private createLogger(): winston.Logger {
    const logLevel = this.config.get('LOG_LEVEL');
    const logFormat = this.config.get('LOG_FORMAT');
    const logFile = this.config.get('LOG_FILE');

    // Define log format
    const logFormatConfig = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.prettyPrint()
    );

    // Define console format for development
    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let log = `${timestamp} [${level}]: ${message}`;
        
        if (Object.keys(meta).length > 0) {
          log += `\n${JSON.stringify(meta, null, 2)}`;
        }
        
        return log;
      })
    );

    // Create transports
    const transports: winston.transport[] = [
      new winston.transports.Console({
        level: logLevel,
        format: this.config.isDevelopment() ? consoleFormat : logFormatConfig,
      })
    ];

    // Add file transport if log file is specified
    if (logFile) {
      transports.push(
        new winston.transports.File({
          filename: logFile,
          level: logLevel,
          format: logFormatConfig,
          maxsize: 10 * 1024 * 1024, // 10MB
          maxFiles: 5,
        })
      );
    }

    // Create logger
    return winston.createLogger({
      level: logLevel,
      format: logFormatConfig,
      transports,
      exitOnError: false,
    });
  }

  /**
   * Log debug message
   */
  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  /**
   * Log info message
   */
  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  /**
   * Log warning message
   */
  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  /**
   * Log error message
   */
  public error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  /**
   * Log critical message
   */
  public critical(message: string, meta?: any): void {
    this.logger.error(`[CRITICAL] ${message}`, meta);
  }

  /**
   * Log API request
   */
  public logRequest(req: any, res: any, responseTime?: number): void {
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: responseTime ? `${responseTime}ms` : undefined,
      userAgent: req.headers['user-agent'],
      ip: req.connection?.remoteAddress || req.socket?.remoteAddress,
      referer: req.headers.referer,
    };

    if (res.statusCode >= 400) {
      this.warn('API Request', logData);
    } else {
      this.info('API Request', logData);
    }
  }

  /**
   * Log database query
   */
  public logQuery(query: string, params?: any[], duration?: number): void {
    this.debug('Database Query', {
      query: query.substring(0, 200) + (query.length > 200 ? '...' : ''),
      params,
      duration: duration ? `${duration}ms` : undefined,
    });
  }

  /**
   * Log authentication event
   */
  public logAuth(event: string, userId?: string, ip?: string, success?: boolean): void {
    this.info('Authentication Event', {
      event,
      userId,
      ip,
      success,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log security event
   */
  public logSecurity(event: string, details: any): void {
    this.warn('Security Event', {
      event,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log business event
   */
  public logBusiness(event: string, details: any): void {
    this.info('Business Event', {
      event,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log performance metrics
   */
  public logPerformance(metric: string, value: number, unit: string = 'ms'): void {
    this.info('Performance Metric', {
      metric,
      value,
      unit,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log error with stack trace
   */
  public logError(error: Error, context?: any): void {
    this.error('Application Error', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Create child logger with additional context
   */
  public child(defaultMeta: any): winston.Logger {
    return this.logger.child(defaultMeta);
  }

  /**
   * Get logger instance
   */
  public getLogger(): winston.Logger {
    return this.logger;
  }

  /**
   * Close logger
   */
  public close(): void {
    this.logger.close();
  }
}