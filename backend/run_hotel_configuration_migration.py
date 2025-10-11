#!/usr/bin/env python3
"""
Hotel Configuration Migration Script
Runs the SQL migration to create hotel configuration tables
"""

import os
import sys
import asyncio
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from database import engine, check_database_connection
from sqlalchemy import text
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def run_migration():
    """Run the hotel configuration migration"""
    try:
        # Check database connection
        if not check_database_connection():
            logger.error("Database connection failed")
            return False
        
        logger.info("Database connection successful")
        
        # Read the migration SQL file
        migration_file = backend_dir / "migrations" / "create_hotel_configuration_tables.sql"
        
        if not migration_file.exists():
            logger.error(f"Migration file not found: {migration_file}")
            return False
        
        with open(migration_file, 'r') as f:
            migration_sql = f.read()
        
        logger.info("Running hotel configuration migration...")
        
        # Execute the migration
        with engine.connect() as connection:
            # Split the SQL into individual statements
            statements = [stmt.strip() for stmt in migration_sql.split(';') if stmt.strip()]
            
            for i, statement in enumerate(statements):
                if statement:
                    try:
                        logger.info(f"Executing statement {i+1}/{len(statements)}")
                        connection.execute(text(statement))
                        connection.commit()
                    except Exception as e:
                        logger.warning(f"Statement {i+1} failed (might already exist): {e}")
                        # Continue with other statements
                        continue
        
        logger.info("Hotel configuration migration completed successfully")
        return True
        
    except Exception as e:
        logger.error(f"Migration failed: {str(e)}")
        return False

async def verify_migration():
    """Verify that the migration was successful"""
    try:
        with engine.connect() as connection:
            # Check if tables exist
            tables_to_check = [
                'hotel_types',
                'hotel_services', 
                'hotel_configurations',
                'restaurant_types',
                'restaurant_configurations'
            ]
            
            for table in tables_to_check:
                result = connection.execute(text(f"""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_name = '{table}'
                    )
                """))
                
                if result.scalar():
                    logger.info(f"✅ Table {table} exists")
                else:
                    logger.error(f"❌ Table {table} does not exist")
                    return False
            
            # Check if data was inserted
            result = connection.execute(text("SELECT COUNT(*) FROM hotel_types"))
            hotel_types_count = result.scalar()
            logger.info(f"Hotel types count: {hotel_types_count}")
            
            result = connection.execute(text("SELECT COUNT(*) FROM hotel_services"))
            hotel_services_count = result.scalar()
            logger.info(f"Hotel services count: {hotel_services_count}")
            
            result = connection.execute(text("SELECT COUNT(*) FROM restaurant_types"))
            restaurant_types_count = result.scalar()
            logger.info(f"Restaurant types count: {restaurant_types_count}")
            
            return True
            
    except Exception as e:
        logger.error(f"Verification failed: {str(e)}")
        return False

async def main():
    """Main function"""
    logger.info("Starting hotel configuration migration...")
    
    # Run migration
    if await run_migration():
        logger.info("Migration completed successfully")
        
        # Verify migration
        if await verify_migration():
            logger.info("✅ Migration verification successful")
            logger.info("Hotel configuration tables are ready!")
        else:
            logger.error("❌ Migration verification failed")
            sys.exit(1)
    else:
        logger.error("❌ Migration failed")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())