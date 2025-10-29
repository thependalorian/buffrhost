import { DataSource, DataSourceOptions } from 'typeorm';
import { config, ConfigManager } from '../config/ConfigManager';
import { logger, Logger } from '../utils/Logger';

// Import entities
import { User } from '../entities/User';
import { TenantProfile } from '../entities/TenantProfile';
import { HospitalityProperty } from '../entities/HospitalityProperty';
import { Room } from '../entities/Room';
import { RoomType } from '../entities/RoomType';
import { Booking } from '../entities/Booking';
import { Payment } from '../entities/Payment';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private dataSource: DataSource | null = null;

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private createDataSourceOptions(): DataSourceOptions {
    const databaseUrl = config.get('DATABASE_URL');
    const isSQLite = databaseUrl.startsWith('sqlite');

    const options: any = {
        type: isSQLite ? 'sqlite' : 'postgres',
        url: databaseUrl,
        synchronize: config.isDevelopment(),
        logging: config.get('DATABASE_ECHO'),
        entities: [User, TenantProfile, HospitalityProperty, Room, RoomType, Booking, Payment],
        migrations: ['dist/migrations/*.js'],
        subscribers: ['dist/subscribers/*.js'],
    };

    if (!isSQLite) {
        options.extra = {
            max: config.get('DATABASE_POOL_SIZE'),
            min: 0,
            acquire: 30000,
            idle: 10000,
            evict: 1000,
            handleDisconnects: true,
        };
        options.cache = {
            type: 'redis',
            options: {
              host: config.get('REDIS_URL').split('://')[1].split(':')[0],
              port: parseInt(config.get('REDIS_URL').split(':')[2]) || 6379,
              password: config.get('REDIS_PASSWORD'),
              db: config.get('REDIS_DB'),
            },
            duration: config.get('CACHE_TTL') * 1000, // Convert to milliseconds
        };
    }

    return options;
  }

  public async initialize(): Promise<void> {
    try {
      if (this.dataSource?.isInitialized) {
        logger.info('Database already initialized');
        return;
      }

      const options = this.createDataSourceOptions();
      this.dataSource = new DataSource(options);

      await this.dataSource.initialize();
      logger.info('Database connection established successfully');
    } catch (error) {
      logger.error('Failed to initialize database:', error);
      throw error;
    }
  }

  public getDataSource(): DataSource {
    if (!this.dataSource?.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.dataSource;
  }
}

export const databaseManager = DatabaseManager.getInstance();
