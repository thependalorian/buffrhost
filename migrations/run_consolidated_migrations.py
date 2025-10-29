#!/usr/bin/env python3
"""
Consolidated Migration Runner for Buffr Host
This script runs all consolidated migrations in the correct order.
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import logging
import glob
from pathlib import Path

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def get_database_url():
    """Get database URL from environment variables"""
    database_url = os.getenv('DATABASE_URL') or os.getenv('NEON_DATABASE_URL')
    if not database_url:
        logger.error("DATABASE_URL or NEON_DATABASE_URL environment variable not set")
        sys.exit(1)
    return database_url

def get_migration_files():
    """Get all migration files in the correct order"""
    migrations_dir = Path(__file__).parent / "consolidated"
    migration_files = sorted(glob.glob(str(migrations_dir / "*.sql")))
    
    if not migration_files:
        logger.error(f"No migration files found in {migrations_dir}")
        sys.exit(1)
    
    logger.info(f"Found {len(migration_files)} migration files:")
    for file in migration_files:
        logger.info(f"  - {Path(file).name}")
    
    return migration_files

def run_migration(cursor, migration_file):
    """Run a single migration file"""
    logger.info(f"Running migration: {Path(migration_file).name}")
    
    try:
        with open(migration_file, 'r') as f:
            migration_sql = f.read()
        
        # Execute the migration
        cursor.execute(migration_sql)
        logger.info(f"✅ Successfully applied {Path(migration_file).name}")
        
    except psycopg2.Error as e:
        logger.error(f"❌ Database error in {Path(migration_file).name}: {e}")
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error in {Path(migration_file).name}: {e}")
        raise

def check_migration_status(cursor):
    """Check the status of migrations"""
    logger.info("Checking migration status...")
    
    try:
        # Check if migrations table exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'migration_history'
            );
        """)
        migrations_table_exists = cursor.fetchone()[0]
        
        if not migrations_table_exists:
            logger.info("Creating migration history table...")
            cursor.execute("""
                CREATE TABLE migration_history (
                    id SERIAL PRIMARY KEY,
                    migration_file VARCHAR(255) NOT NULL,
                    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    success BOOLEAN DEFAULT TRUE
                );
            """)
        
        # Get list of applied migrations
        cursor.execute("SELECT migration_file FROM migration_history ORDER BY applied_at")
        applied_migrations = [row[0] for row in cursor.fetchall()]
        
        logger.info(f"Applied migrations: {len(applied_migrations)}")
        for migration in applied_migrations:
            logger.info(f"  ✅ {migration}")
        
        return applied_migrations
        
    except psycopg2.Error as e:
        logger.error(f"Error checking migration status: {e}")
        return []

def record_migration(cursor, migration_file, success=True):
    """Record a migration in the history table"""
    try:
        cursor.execute("""
            INSERT INTO migration_history (migration_file, success)
            VALUES (%s, %s)
        """, (Path(migration_file).name, success))
    except psycopg2.Error as e:
        logger.warning(f"Could not record migration: {e}")

def run_all_migrations():
    """Run all consolidated migrations"""
    database_url = get_database_url()
    migration_files = get_migration_files()
    
    try:
        # Connect to database
        logger.info("Connecting to database...")
        conn = psycopg2.connect(database_url)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check current migration status
        applied_migrations = check_migration_status(cursor)
        
        # Run migrations
        successful_migrations = 0
        failed_migrations = 0
        
        for migration_file in migration_files:
            migration_name = Path(migration_file).name
            
            # Skip if already applied
            if migration_name in applied_migrations:
                logger.info(f"⏭️  Skipping {migration_name} (already applied)")
                continue
            
            try:
                run_migration(cursor, migration_file)
                record_migration(cursor, migration_file, success=True)
                successful_migrations += 1
                
            except Exception as e:
                logger.error(f"Failed to apply {migration_name}: {e}")
                record_migration(cursor, migration_file, success=False)
                failed_migrations += 1
                
                # Ask user if they want to continue
                response = input(f"Migration {migration_name} failed. Continue with remaining migrations? (y/n): ")
                if response.lower() != 'y':
                    logger.info("Stopping migration process")
                    break
        
        # Summary
        logger.info("=" * 50)
        logger.info("MIGRATION SUMMARY")
        logger.info("=" * 50)
        logger.info(f"Total migrations: {len(migration_files)}")
        logger.info(f"Successful: {successful_migrations}")
        logger.info(f"Failed: {failed_migrations}")
        logger.info(f"Skipped: {len(applied_migrations)}")
        
        if failed_migrations == 0:
            logger.info("🎉 All migrations completed successfully!")
        else:
            logger.warning(f"⚠️  {failed_migrations} migrations failed")
        
        # Verify database state
        logger.info("Verifying database state...")
        cursor.execute("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'")
        table_count = cursor.fetchone()[0]
        logger.info(f"Total tables in database: {table_count}")
        
        # Check user roles
        cursor.execute("SELECT unnest(enum_range(NULL::user_role_enum)) as role_values")
        roles = cursor.fetchall()
        logger.info(f"Available user roles: {[role[0] for role in roles]}")
        
        # Check properties
        cursor.execute("SELECT COUNT(*) FROM properties")
        property_count = cursor.fetchone()[0]
        logger.info(f"Total properties: {property_count}")
        
    except psycopg2.Error as e:
        logger.error(f"Database error: {e}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        sys.exit(1)
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

def check_environment():
    """Check if required environment variables are set"""
    required_vars = ['DATABASE_URL', 'NEON_DATABASE_URL']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        logger.warning(f"Missing environment variables: {missing_vars}")
        logger.info("Make sure to set DATABASE_URL or NEON_DATABASE_URL")
        return False
    
    return True

def main():
    """Main function"""
    logger.info("Starting Buffr Host Consolidated Migration Runner")
    
    # Check environment
    if not check_environment():
        logger.error("Environment check failed")
        sys.exit(1)
    
    # Run migrations
    run_all_migrations()
    
    logger.info("Consolidated migration process completed!")

if __name__ == "__main__":
    main()
