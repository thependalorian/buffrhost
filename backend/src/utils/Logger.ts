import winston from 'winston';
import { config, ConfigManager } from '../config/ConfigManager';

export class Logger {
  private logger: winston.Logger;

  constructor(private configManager: ConfigManager) {
    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    const logLevel = this.configManager.get('LOG_LEVEL');
    const logFile = this.configManager.get('LOG_FILE');

    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
      })
    );

    const transports: winston.transport[] = [
      new winston.transports.Console({
        level: logLevel,
        format: consoleFormat,
      })
    ];

    if (logFile) {
      transports.push(
        new winston.transports.File({
          filename: logFile,
          level: logLevel,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        })
      );
    }

    return winston.createLogger({
      level: logLevel,
      format: consoleFormat,
      transports,
      exitOnError: false,
    });
  }

  public debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, meta);
  }

  public info(message: string, ...meta: any[]): void {
    this.logger.info(message, meta);
  }

  public warn(message: string, ...meta: any[]): void {
    this.logger.warn(message, meta);
  }

  public error(message: string, ...meta: any[]): void {
    this.logger.error(message, meta);
  }
}

export const logger = new Logger(config);
