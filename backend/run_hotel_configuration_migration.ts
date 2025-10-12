/**
 * HOTEL CONFIGURATION MIGRATION SCRIPT
 * Runs the SQL migration to create hotel configuration tables
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Database interface (placeholder - would be replaced with actual database connection)
interface DatabaseConnection {
  connect(): Promise<void>;
  query(sql: string, params?: any[]): Promise<any[]>;
  close(): Promise<void>;
}

// Migration result interface
interface MigrationResult {
  success: boolean;
  message: string;
  tablesCreated: string[];
  dataInserted: {
    hotelTypes: number;
    hotelServices: number;
    restaurantTypes: number;
  };
}

// Hotel configuration migration class
export class HotelConfigurationMigration {
  private db: DatabaseConnection;
  private migrationFile: string;

  constructor(db: DatabaseConnection, migrationFile?: string) {
    this.db = db;
    this.migrationFile = migrationFile || this.getDefaultMigrationFile();
  }

  private getDefaultMigrationFile(): string {
    // Get the directory of the current file
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    return join(__dirname, 'migrations', 'create_hotel_configuration_tables.sql');
  }

  public async runMigration(): Promise<MigrationResult> {
    try {
      console.log('Starting hotel configuration migration...');

      // Check database connection
      if (!await this.checkDatabaseConnection()) {
        throw new Error('Database connection failed');
      }

      console.log('Database connection successful');

      // Read the migration SQL file
      const migrationSQL = await this.readMigrationFile();
      if (!migrationSQL) {
        throw new Error('Migration file not found or empty');
      }

      console.log('Running hotel configuration migration...');

      // Execute the migration
      const result = await this.executeMigration(migrationSQL);

      console.log('Hotel configuration migration completed successfully');
      return result;
    } catch (error) {
      console.error('Migration failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        tablesCreated: [],
        dataInserted: {
          hotelTypes: 0,
          hotelServices: 0,
          restaurantTypes: 0
        }
      };
    }
  }

  private async checkDatabaseConnection(): Promise<boolean> {
    try {
      await this.db.connect();
      // Simple query to test connection
      await this.db.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }

  private async readMigrationFile(): Promise<string | null> {
    try {
      const content = await fs.readFile(this.migrationFile, 'utf-8');
      return content.trim();
    } catch (error) {
      console.error(`Migration file not found: ${this.migrationFile}`);
      return null;
    }
  }

  private async executeMigration(migrationSQL: string): Promise<MigrationResult> {
    try {
      // Split the SQL into individual statements
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      const tablesCreated: string[] = [];
      let executedStatements = 0;

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement) {
          try {
            console.log(`Executing statement ${i + 1}/${statements.length}`);
            await this.db.query(statement);
            executedStatements++;

            // Track table creation
            if (statement.toLowerCase().includes('create table')) {
              const tableName = this.extractTableName(statement);
              if (tableName) {
                tablesCreated.push(tableName);
              }
            }
          } catch (error) {
            console.warn(`Statement ${i + 1} failed (might already exist): ${error}`);
            // Continue with other statements
            continue;
          }
        }
      }

      console.log(`Executed ${executedStatements} statements successfully`);

      // Verify migration
      const verification = await this.verifyMigration();
      if (!verification.success) {
        throw new Error('Migration verification failed');
      }

      return {
        success: true,
        message: 'Migration completed successfully',
        tablesCreated,
        dataInserted: verification.dataInserted
      };
    } catch (error) {
      throw new Error(`Migration execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractTableName(statement: string): string | null {
    const match = statement.match(/create\s+table\s+(\w+)/i);
    return match ? match[1] : null;
  }

  private async verifyMigration(): Promise<{ success: boolean; dataInserted: any }> {
    try {
      const tablesToCheck = [
        'hotel_types',
        'hotel_services',
        'hotel_configurations',
        'restaurant_types',
        'restaurant_configurations'
      ];

      const dataInserted = {
        hotelTypes: 0,
        hotelServices: 0,
        restaurantTypes: 0
      };

      for (const table of tablesToCheck) {
        const exists = await this.checkTableExists(table);
        if (exists) {
          console.log(`✅ Table ${table} exists`);
        } else {
          console.error(`❌ Table ${table} does not exist`);
          return { success: false, dataInserted };
        }
      }

      // Check if data was inserted
      try {
        const hotelTypesResult = await this.db.query('SELECT COUNT(*) as count FROM hotel_types');
        dataInserted.hotelTypes = hotelTypesResult[0]?.count || 0;
        console.log(`Hotel types count: ${dataInserted.hotelTypes}`);

        const hotelServicesResult = await this.db.query('SELECT COUNT(*) as count FROM hotel_services');
        dataInserted.hotelServices = hotelServicesResult[0]?.count || 0;
        console.log(`Hotel services count: ${dataInserted.hotelServices}`);

        const restaurantTypesResult = await this.db.query('SELECT COUNT(*) as count FROM restaurant_types');
        dataInserted.restaurantTypes = restaurantTypesResult[0]?.count || 0;
        console.log(`Restaurant types count: ${dataInserted.restaurantTypes}`);
      } catch (error) {
        console.warn('Could not verify data insertion:', error);
      }

      return { success: true, dataInserted };
    } catch (error) {
      console.error('Verification failed:', error);
      return { success: false, dataInserted: { hotelTypes: 0, hotelServices: 0, restaurantTypes: 0 } };
    }
  }

  private async checkTableExists(tableName: string): Promise<boolean> {
    try {
      // This is a simplified check - in production, you'd use proper database-specific queries
      const result = await this.db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = ?
        )
      `, [tableName]);
      
      return result[0]?.exists || false;
    } catch (error) {
      console.error(`Failed to check if table ${tableName} exists:`, error);
      return false;
    }
  }

  public async rollbackMigration(): Promise<boolean> {
    try {
      console.log('Rolling back hotel configuration migration...');

      const tablesToDrop = [
        'restaurant_configurations',
        'restaurant_types',
        'hotel_configurations',
        'hotel_services',
        'hotel_types'
      ];

      for (const table of tablesToDrop) {
        try {
          await this.db.query(`DROP TABLE IF EXISTS ${table}`);
          console.log(`Dropped table: ${table}`);
        } catch (error) {
          console.warn(`Failed to drop table ${table}:`, error);
        }
      }

      console.log('Migration rollback completed');
      return true;
    } catch (error) {
      console.error('Rollback failed:', error);
      return false;
    }
  }

  public async getMigrationStatus(): Promise<{
    tablesExist: boolean;
    dataCounts: {
      hotelTypes: number;
      hotelServices: number;
      restaurantTypes: number;
    };
  }> {
    try {
      const tablesToCheck = [
        'hotel_types',
        'hotel_services',
        'hotel_configurations',
        'restaurant_types',
        'restaurant_configurations'
      ];

      let allTablesExist = true;
      for (const table of tablesToCheck) {
        const exists = await this.checkTableExists(table);
        if (!exists) {
          allTablesExist = false;
          break;
        }
      }

      const dataCounts = {
        hotelTypes: 0,
        hotelServices: 0,
        restaurantTypes: 0
      };

      if (allTablesExist) {
        try {
          const hotelTypesResult = await this.db.query('SELECT COUNT(*) as count FROM hotel_types');
          dataCounts.hotelTypes = hotelTypesResult[0]?.count || 0;

          const hotelServicesResult = await this.db.query('SELECT COUNT(*) as count FROM hotel_services');
          dataCounts.hotelServices = hotelServicesResult[0]?.count || 0;

          const restaurantTypesResult = await this.db.query('SELECT COUNT(*) as count FROM restaurant_types');
          dataCounts.restaurantTypes = restaurantTypesResult[0]?.count || 0;
        } catch (error) {
          console.warn('Could not get data counts:', error);
        }
      }

      return {
        tablesExist: allTablesExist,
        dataCounts
      };
    } catch (error) {
      console.error('Failed to get migration status:', error);
      return {
        tablesExist: false,
        dataCounts: { hotelTypes: 0, hotelServices: 0, restaurantTypes: 0 }
      };
    }
  }
}

// CLI interface
export class MigrationCLI {
  private migration: HotelConfigurationMigration;

  constructor(db: DatabaseConnection, migrationFile?: string) {
    this.migration = new HotelConfigurationMigration(db, migrationFile);
  }

  public async run(): Promise<void> {
    const args = process.argv.slice(2);
    const command = args[0] || 'migrate';

    try {
      switch (command) {
        case 'migrate':
          await this.migrate();
          break;
        case 'rollback':
          await this.rollback();
          break;
        case 'status':
          await this.status();
          break;
        case 'verify':
          await this.verify();
          break;
        default:
          this.showHelp();
      }
    } catch (error) {
      console.error('Command failed:', error);
      process.exit(1);
    }
  }

  private async migrate(): Promise<void> {
    console.log('Starting hotel configuration migration...');
    const result = await this.migration.runMigration();
    
    if (result.success) {
      console.log('✅ Migration completed successfully');
      console.log(`Tables created: ${result.tablesCreated.join(', ')}`);
      console.log(`Data inserted:`, result.dataInserted);
    } else {
      console.error('❌ Migration failed:', result.message);
      process.exit(1);
    }
  }

  private async rollback(): Promise<void> {
    console.log('Rolling back hotel configuration migration...');
    const success = await this.migration.rollbackMigration();
    
    if (success) {
      console.log('✅ Rollback completed successfully');
    } else {
      console.error('❌ Rollback failed');
      process.exit(1);
    }
  }

  private async status(): Promise<void> {
    console.log('Checking migration status...');
    const status = await this.migration.getMigrationStatus();
    
    console.log(`Tables exist: ${status.tablesExist ? '✅' : '❌'}`);
    console.log('Data counts:');
    console.log(`  Hotel types: ${status.dataCounts.hotelTypes}`);
    console.log(`  Hotel services: ${status.dataCounts.hotelServices}`);
    console.log(`  Restaurant types: ${status.dataCounts.restaurantTypes}`);
  }

  private async verify(): Promise<void> {
    console.log('Verifying migration...');
    const result = await this.migration.runMigration();
    
    if (result.success) {
      console.log('✅ Migration verification successful');
      console.log('Hotel configuration tables are ready!');
    } else {
      console.error('❌ Migration verification failed');
      process.exit(1);
    }
  }

  private showHelp(): void {
    console.log(`
Hotel Configuration Migration CLI

Usage: node run_hotel_configuration_migration.js [command]

Commands:
  migrate    Run the migration (default)
  rollback   Rollback the migration
  status     Check migration status
  verify     Verify migration and data
  help       Show this help message

Examples:
  node run_hotel_configuration_migration.js migrate
  node run_hotel_configuration_migration.js status
  node run_hotel_configuration_migration.js rollback
    `);
  }
}

// Main function
export async function main(): Promise<void> {
  console.log('Starting hotel configuration migration...');

  // This would be replaced with actual database connection
  const db: DatabaseConnection = {
    async connect() {
      console.log('Connecting to database...');
    },
    async query(sql: string, params?: any[]) {
      console.log('Executing query:', sql);
      return [];
    },
    async close() {
      console.log('Closing database connection...');
    }
  };

  const migration = new HotelConfigurationMigration(db);

  // Run migration
  const result = await migration.runMigration();
  if (result.success) {
    console.log('Migration completed successfully');
    console.log(`Tables created: ${result.tablesCreated.join(', ')}`);
    console.log(`Data inserted:`, result.dataInserted);
  } else {
    console.error('Migration failed:', result.message);
    process.exit(1);
  }

  // Verify migration
  const verification = await migration.getMigrationStatus();
  if (verification.tablesExist) {
    console.log('✅ Migration verification successful');
    console.log('Hotel configuration tables are ready!');
  } else {
    console.error('❌ Migration verification failed');
    process.exit(1);
  }
}

// Export types
export type { MigrationResult, DatabaseConnection };

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}