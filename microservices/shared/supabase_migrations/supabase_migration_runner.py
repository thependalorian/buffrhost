"""
Supabase Migration Runner for Buffr Host Microservices
Handles migrations that work with Supabase's PostgreSQL setup
"""
import os
import asyncio
import asyncpg
from pathlib import Path
from typing import List, Dict, Any, Optional
import logging
import json

logger = logging.getLogger(__name__)

class SupabaseMigrationRunner:
    """Handles database migrations for Supabase-hosted microservices"""
    
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.connection = None
        
    async def connect(self):
        """Connect to Supabase database"""
        try:
            self.connection = await asyncpg.connect(self.database_url)
            logger.info("Connected to Supabase database")
        except Exception as e:
            logger.error(f"Failed to connect to Supabase: {e}")
            raise
            
    async def disconnect(self):
        """Disconnect from database"""
        if self.connection:
            await self.connection.close()
            logger.info("Disconnected from Supabase database")
            
    async def run_sql_file(self, file_path: Path) -> bool:
        """Run a single SQL migration file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                sql_content = f.read()
                
            logger.info(f"Running migration: {file_path.name}")
            
            # Split SQL content by semicolons and execute each statement
            statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
            
            for statement in statements:
                if statement:
                    await self.connection.execute(statement)
                    
            logger.info(f"Migration completed: {file_path.name}")
            return True
            
        except Exception as e:
            logger.error(f"Migration failed: {file_path.name} - {str(e)}")
            return False
            
    async def create_migration_table(self):
        """Create migration tracking table"""
        try:
            await self.connection.execute("""
                CREATE TABLE IF NOT EXISTS public.migration_history (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    service_name TEXT NOT NULL,
                    migration_file TEXT NOT NULL,
                    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    success BOOLEAN DEFAULT TRUE,
                    error_message TEXT
                );
            """)
            logger.info("Migration history table ready")
        except Exception as e:
            logger.error(f"Failed to create migration table: {e}")
            raise
            
    async def record_migration(self, service_name: str, migration_file: str, success: bool, error_message: str = None):
        """Record migration execution"""
        try:
            await self.connection.execute("""
                INSERT INTO public.migration_history 
                (service_name, migration_file, success, error_message)
                VALUES ($1, $2, $3, $4)
            """, service_name, migration_file, success, error_message)
        except Exception as e:
            logger.error(f"Failed to record migration: {e}")
            
    async def get_migration_history(self, service_name: str = None) -> List[Dict]:
        """Get migration history"""
        try:
            if service_name:
                rows = await self.connection.fetch("""
                    SELECT service_name, migration_file, executed_at, success, error_message
                    FROM public.migration_history
                    WHERE service_name = $1
                    ORDER BY executed_at DESC
                """, service_name)
            else:
                rows = await self.connection.fetch("""
                    SELECT service_name, migration_file, executed_at, success, error_message
                    FROM public.migration_history
                    ORDER BY executed_at DESC
                """)
            
            return [dict(row) for row in rows]
        except Exception as e:
            logger.error(f"Failed to get migration history: {e}")
            return []
            
    async def run_service_migrations(self, service_name: str) -> bool:
        """Run all migrations for a specific service"""
        try:
            await self.connect()
            await self.create_migration_table()
            
            # Get migration history for this service
            history = await self.get_migration_history(service_name)
            executed_files = {row['migration_file'] for row in history if row['success']}
            
            # Run shared migrations first
            shared_migrations_dir = Path(__file__).parent
            shared_files = sorted(shared_migrations_dir.glob("*.sql"))
            
            for file_path in shared_files:
                if file_path.name not in executed_files:
                    success = await self.run_sql_file(file_path)
                    await self.record_migration("shared", file_path.name, success)
                    if not success:
                        return False
                        
            # Run service-specific migrations
            service_schemas_dir = Path(__file__).parent.parent.parent / f"{service_name}-service" / "schemas"
            
            if service_schemas_dir.exists():
                service_files = sorted(service_schemas_dir.glob("*.sql"))
                
                for file_path in service_files:
                    if file_path.name not in executed_files:
                        success = await self.run_sql_file(file_path)
                        await self.record_migration(service_name, file_path.name, success)
                        if not success:
                            return False
                            
            return True
            
        except Exception as e:
            logger.error(f"Migration runner failed: {str(e)}")
            return False
            
        finally:
            await self.disconnect()
            
    async def check_table_exists(self, table_name: str) -> bool:
        """Check if a table exists in the database"""
        try:
            result = await self.connection.fetchval("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = $1
                );
            """, table_name)
            return result
        except Exception as e:
            logger.error(f"Failed to check table existence: {e}")
            return False
            
    async def get_table_columns(self, table_name: str) -> List[Dict]:
        """Get column information for a table"""
        try:
            rows = await self.connection.fetch("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_schema = 'public' 
                AND table_name = $1
                ORDER BY ordinal_position;
            """, table_name)
            
            return [dict(row) for row in rows]
        except Exception as e:
            logger.error(f"Failed to get table columns: {e}")
            return []

# Service-specific migration runners
class AuthServiceSupabaseMigrationRunner(SupabaseMigrationRunner):
    async def run_migrations(self) -> bool:
        return await super().run_service_migrations("auth")
        
class PropertyServiceSupabaseMigrationRunner(SupabaseMigrationRunner):
    async def run_migrations(self) -> bool:
        return await super().run_service_migrations("property")
        
class MenuServiceSupabaseMigrationRunner(SupabaseMigrationRunner):
    async def run_migrations(self) -> bool:
        return await super().run_service_migrations("menu")
        
class OrderServiceSupabaseMigrationRunner(SupabaseMigrationRunner):
    async def run_migrations(self) -> bool:
        return await super().run_service_migrations("order")
        
class PaymentServiceSupabaseMigrationRunner(SupabaseMigrationRunner):
    async def run_migrations(self) -> bool:
        return await super().run_service_migrations("payment")
        
class CustomerServiceSupabaseMigrationRunner(SupabaseMigrationRunner):
    async def run_migrations(self) -> bool:
        return await super().run_service_migrations("customer")
        
class InventoryServiceSupabaseMigrationRunner(SupabaseMigrationRunner):
    async def run_migrations(self) -> bool:
        return await super().run_service_migrations("inventory")

# Utility function to run migrations for any service
async def run_supabase_service_migrations(service_name: str, database_url: str) -> bool:
    """Run Supabase migrations for a specific service"""
    runner = SupabaseMigrationRunner(database_url)
    return await runner.run_service_migrations(service_name)

# Example usage
if __name__ == "__main__":
    async def main():
        database_url = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/buffrhost")
        
        # Run migrations for auth service
        auth_runner = AuthServiceSupabaseMigrationRunner(database_url)
        success = await auth_runner.run_migrations()
        
        if success:
            print("Auth service migrations completed successfully")
        else:
            print("Auth service migrations failed")
            
        # Check migration status
        await auth_runner.connect()
        status = await auth_runner.get_migration_history("auth")
        print(f"Migration status: {status}")
        await auth_runner.disconnect()
        
    asyncio.run(main())