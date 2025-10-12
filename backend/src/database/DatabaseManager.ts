/**
 * Database Configuration and Connection Management
 * Supports PostgreSQL, MySQL, and SQLite with connection pooling
 * Converted from Python database.py to TypeScript with TypeORM
 */

import { createConnection, Connection, DataSource, DataSourceOptions } from 'typeorm';
import { ConfigManager } from '../config/ConfigManager';
import { Logger } from '../utils/Logger';

// Import entities
import { User } from '../entities/User';
import { TenantProfile } from '../entities/TenantProfile';
import { HospitalityProperty } from '../entities/HospitalityProperty';
import { Room } from '../entities/Room';
import { RoomType } from '../entities/RoomType';
import { Booking } from '../entities/Booking';
import { Payment } from '../entities/Payment';
// TODO: Add remaining entities as they are created
// import { LoyaltyProgram } from '../entities/LoyaltyProgram';
// import { Review } from '../entities/Review';
// import { Notification } from '../entities/Notification';
// import { Analytics } from '../entities/Analytics';
// import { Staff } from '../entities/Staff';
// import { Inventory } from '../entities/Inventory';
// import { Maintenance } from '../entities/Maintenance';
// import { Event } from '../entities/Event';
// import { Promotion } from '../entities/Promotion';
// import { Feedback } from '../entities/Feedback';
// import { Integration } from '../entities/Integration';
// import { AuditLog } from '../entities/AuditLog';
// import { Configuration } from '../entities/Configuration';
// import { Report } from '../entities/Report';
// import { Dashboard } from '../entities/Dashboard';
// import { Workflow } from '../entities/Workflow';
// import { Task } from '../entities/Task';
// import { Schedule } from '../entities/Schedule';
// import { Template } from '../entities/Template';
// import { Setting } from '../entities/Setting';
// import { Permission } from '../entities/Permission';
// import { Role } from '../entities/Role';
// import { Session } from '../entities/Session';
// import { Token } from '../entities/Token';
// import { Device } from '../entities/Device';
// import { Location } from '../entities/Location';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private dataSource: DataSource | null = null;
  private config: ConfigManager;
  private logger: Logger;

  private constructor() {
    this.config = ConfigManager.getInstance();
    this.logger = Logger.getInstance();
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * Create database connection with appropriate configuration
   */
  private createDataSourceOptions(): DataSourceOptions {
    const databaseUrl = this.config.get('DATABASE_URL');
    const isSQLite = databaseUrl.startsWith('sqlite');
    const isPostgreSQL = databaseUrl.startsWith('postgresql');
    const isMySQL = databaseUrl.startsWith('mysql');

    const baseOptions: DataSourceOptions = {
      type: isSQLite ? 'sqlite' : isPostgreSQL ? 'postgres' : isMySQL ? 'mysql' : 'postgres',
      url: databaseUrl,
      synchronize: this.config.isDevelopment(), // Only in development
      logging: this.config.get('DATABASE_ECHO'),
      entities: [
        User,
        TenantProfile,
        HospitalityProperty,
        Room,
        RoomType,
        Booking,
        Payment,
        // TODO: Add remaining entities as they are created
        // LoyaltyProgram,
        // Review,
        // Notification,
        // Analytics,
        // Staff,
        // Inventory,
        // Maintenance,
        // Event,
        // Promotion,
        // Feedback,
        // Integration,
        // AuditLog,
        // Configuration,
        // Report,
        // Dashboard,
        // Workflow,
        // Task,
        // Schedule,
        // Template,
        // Setting,
        // Permission,
        // Role,
        // Session,
        // Token,
        // Device,
        // Location,
      ],
      migrations: ['dist/migrations/*.js'],
      subscribers: ['dist/subscribers/*.js'],
      cache: {
        type: 'redis',
        options: {
          host: this.config.get('REDIS_URL').split('://')[1].split(':')[0],
          port: parseInt(this.config.get('REDIS_URL').split(':')[2]) || 6379,
          password: this.config.get('REDIS_PASSWORD'),
          db: this.config.get('REDIS_DB'),
        },
        duration: this.config.get('CACHE_TTL') * 1000, // Convert to milliseconds
      },
    };

    // Add connection pooling for non-SQLite databases
    if (!isSQLite) {
      baseOptions.extra = {
        max: this.config.get('DATABASE_POOL_SIZE'),
        min: 0,
        acquire: 30000,
        idle: 10000,
        evict: 1000,
        handleDisconnects: true,
      };
    }

    // SQLite specific configuration
    if (isSQLite) {
      baseOptions.extra = {
        // SQLite specific options
      };
    }

    return baseOptions;
  }

  /**
   * Initialize database connection
   */
  public async initialize(): Promise<void> {
    try {
      if (this.dataSource?.isInitialized) {
        this.logger.info('Database already initialized');
        return;
      }

      const options = this.createDataSourceOptions();
      this.dataSource = new DataSource(options);

      await this.dataSource.initialize();
      this.logger.info('Database connection established successfully');
    } catch (error) {
      this.logger.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Get database connection
   */
  public getConnection(): Connection {
    if (!this.dataSource?.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.dataSource;
  }

  /**
   * Get data source
   */
  public getDataSource(): DataSource {
    if (!this.dataSource?.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.dataSource;
  }

  /**
   * Create all database tables
   */
  public async createTables(): Promise<void> {
    try {
      if (!this.dataSource?.isInitialized) {
        throw new Error('Database not initialized');
      }

      await this.dataSource.synchronize();
      this.logger.info('Database tables created/verified successfully');
    } catch (error) {
      this.logger.error('Failed to create database tables:', error);
      throw error;
    }
  }

  /**
   * Drop all database tables (use with caution!)
   */
  public async dropTables(): Promise<void> {
    try {
      if (!this.dataSource?.isInitialized) {
        throw new Error('Database not initialized');
      }

      await this.dataSource.dropDatabase();
      this.logger.warn('All database tables dropped');
    } catch (error) {
      this.logger.error('Failed to drop database tables:', error);
      throw error;
    }
  }

  /**
   * Check if database connection is working
   */
  public async checkConnection(): Promise<boolean> {
    try {
      if (!this.dataSource?.isInitialized) {
        return false;
      }

      await this.dataSource.query('SELECT 1');
      this.logger.info('Database connection check successful');
      return true;
    } catch (error) {
      this.logger.error('Database connection check failed:', error);
      return false;
    }
  }

  /**
   * Get database information and statistics
   */
  public async getDatabaseInfo(): Promise<any> {
    try {
      if (!this.dataSource?.isInitialized) {
        throw new Error('Database not initialized');
      }

      const databaseUrl = this.config.get('DATABASE_URL');
      const isPostgreSQL = databaseUrl.startsWith('postgresql');
      const isMySQL = databaseUrl.startsWith('mysql');
      const isSQLite = databaseUrl.startsWith('sqlite');

      let version: string;
      if (isPostgreSQL) {
        const result = await this.dataSource.query('SELECT version()');
        version = result[0].version;
      } else if (isMySQL) {
        const result = await this.dataSource.query('SELECT VERSION()');
        version = result[0]['VERSION()'];
      } else if (isSQLite) {
        const result = await this.dataSource.query('SELECT sqlite_version()');
        version = result[0]['sqlite_version()'];
      } else {
        version = 'Unknown';
      }

      return {
        url: databaseUrl.includes('@') ? databaseUrl.split('@')[1] : databaseUrl,
        version,
        type: isPostgreSQL ? 'PostgreSQL' : isMySQL ? 'MySQL' : isSQLite ? 'SQLite' : 'Unknown',
        echo: this.config.get('DATABASE_ECHO'),
        synchronized: this.dataSource.options.synchronize,
      };
    } catch (error) {
      this.logger.error('Failed to get database info:', error);
      return { error: error.message };
    }
  }

  /**
   * Close database connections
   */
  public async close(): Promise<void> {
    try {
      if (this.dataSource?.isInitialized) {
        await this.dataSource.destroy();
        this.dataSource = null;
        this.logger.info('Database connections closed');
      }
    } catch (error) {
      this.logger.error('Failed to close database connections:', error);
    }
  }

  /**
   * Database health check
   */
  public async healthCheck(): Promise<{ healthy: boolean; responseTime?: number; error?: string }> {
    try {
      const startTime = Date.now();
      
      if (!this.dataSource?.isInitialized) {
        return { healthy: false, error: 'Database not initialized' };
      }

      await this.dataSource.query('SELECT 1');
      
      const responseTime = Date.now() - startTime;
      
      return {
        healthy: true,
        responseTime,
        database: await this.getDatabaseInfo()
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }

  /**
   * Execute raw SQL query
   */
  public async executeRawSQL(query: string, parameters: any[] = []): Promise<any[]> {
    try {
      if (!this.dataSource?.isInitialized) {
        throw new Error('Database not initialized');
      }

      const result = await this.dataSource.query(query, parameters);
      return result;
    } catch (error) {
      this.logger.error('Failed to execute raw SQL:', error);
      throw error;
    }
  }

  /**
   * Get table names
   */
  public async getTableNames(): Promise<string[]> {
    try {
      if (!this.dataSource?.isInitialized) {
        throw new Error('Database not initialized');
      }

      const databaseUrl = this.config.get('DATABASE_URL');
      const isPostgreSQL = databaseUrl.startsWith('postgresql');
      const isMySQL = databaseUrl.startsWith('mysql');
      const isSQLite = databaseUrl.startsWith('sqlite');

      let query: string;
      if (isPostgreSQL) {
        query = `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `;
      } else if (isMySQL) {
        query = `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = DATABASE()
        `;
      } else if (isSQLite) {
        query = `
          SELECT name 
          FROM sqlite_master 
          WHERE type='table'
        `;
      } else {
        return [];
      }

      const result = await this.dataSource.query(query);
      return result.map((row: any) => row.table_name || row.name);
    } catch (error) {
      this.logger.error('Failed to get table names:', error);
      return [];
    }
  }

  /**
   * Check if table exists
   */
  public async tableExists(tableName: string): Promise<boolean> {
    try {
      const tableNames = await this.getTableNames();
      return tableNames.includes(tableName);
    } catch (error) {
      this.logger.error('Failed to check if table exists:', error);
      return false;
    }
  }

  /**
   * Run migrations
   */
  public async runMigrations(): Promise<void> {
    try {
      if (!this.dataSource?.isInitialized) {
        throw new Error('Database not initialized');
      }

      await this.dataSource.runMigrations();
      this.logger.info('Migrations completed successfully');
    } catch (error) {
      this.logger.error('Failed to run migrations:', error);
      throw error;
    }
  }

  /**
   * Revert last migration
   */
  public async revertMigration(): Promise<void> {
    try {
      if (!this.dataSource?.isInitialized) {
        throw new Error('Database not initialized');
      }

      await this.dataSource.undoLastMigration();
      this.logger.info('Last migration reverted successfully');
    } catch (error) {
      this.logger.error('Failed to revert migration:', error);
      throw error;
    }
  }
}

// Transaction management
export class DatabaseTransaction {
  private dataSource: DataSource;
  private queryRunner: any;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async start(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commit(): Promise<void> {
    if (this.queryRunner) {
      await this.queryRunner.commitTransaction();
      await this.queryRunner.release();
    }
  }

  async rollback(): Promise<void> {
    if (this.queryRunner) {
      await this.queryRunner.rollbackTransaction();
      await this.queryRunner.release();
    }
  }

  getRepository(entity: any) {
    if (!this.queryRunner) {
      throw new Error('Transaction not started');
    }
    return this.queryRunner.manager.getRepository(entity);
  }
}

export function getTransaction(dataSource: DataSource): DatabaseTransaction {
  return new DatabaseTransaction(dataSource);
}