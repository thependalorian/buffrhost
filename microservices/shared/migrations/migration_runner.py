"""
Database Migration Runner for Buffr Host Microservices
"""
import os
import asyncio
import asyncpg
from pathlib import Path
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class MigrationRunner:
    """Handles database migrations for microservices"""
    
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.connection = None
        
    async def connect(self):
        """Connect to database"""
        self.connection = await asyncpg.connect(self.database_url)
        
    async def disconnect(self):
        """Disconnect from database"""
        if self.connection:
            await self.connection.close()
            
    async def run_migration_file(self, file_path: Path) -> bool:
        """Run a single migration file"""
        try:
            with open(file_path, 'r') as f:
                sql_content = f.read()
                
            logger.info(f"Running migration: {file_path.name}")
            await self.connection.execute(sql_content)
            logger.info(f"Migration completed: {file_path.name}")
            return True
            
        except Exception as e:
            logger.error(f"Migration failed: {file_path.name} - {str(e)}")
            return False
            
    async def run_migrations(self, service_name: str) -> bool:
        """Run all migrations for a specific service"""
        try:
            await self.connect()
            
            # Run shared migrations first
            shared_migrations_dir = Path(__file__).parent
            shared_files = sorted(shared_migrations_dir.glob("*.sql"))
            
            for file_path in shared_files:
                if not await self.run_migration_file(file_path):
                    return False
                    
            # Run service-specific migrations
            service_schemas_dir = Path(__file__).parent.parent.parent / f"{service_name}-service" / "schemas"
            
            if service_schemas_dir.exists():
                service_files = sorted(service_schemas_dir.glob("*.sql"))
                
                for file_path in service_files:
                    if not await self.run_migration_file(file_path):
                        return False
                        
            return True
            
        except Exception as e:
            logger.error(f"Migration runner failed: {str(e)}")
            return False
            
        finally:
            await self.disconnect()
            
    async def check_migration_status(self) -> Dict[str, Any]:
        """Check which migrations have been run"""
        try:
            await self.connect()
            
            # Create migrations table if it doesn't exist
            await self.connection.execute("""
                CREATE TABLE IF NOT EXISTS migration_history (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    service_name TEXT NOT NULL,
                    migration_file TEXT NOT NULL,
                    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    success BOOLEAN DEFAULT TRUE,
                    error_message TEXT
                );
            """)
            
            # Get migration history
            rows = await self.connection.fetch("""
                SELECT service_name, migration_file, executed_at, success, error_message
                FROM migration_history
                ORDER BY executed_at DESC
            """)
            
            return {
                "migrations": [dict(row) for row in rows],
                "total": len(rows),
                "successful": len([r for r in rows if r['success']]),
                "failed": len([r for r in rows if not r['success']])
            }
            
        except Exception as e:
            logger.error(f"Failed to check migration status: {str(e)}")
            return {"error": str(e)}
            
        finally:
            await self.disconnect()

# Service-specific migration runners
class AuthServiceMigrationRunner(MigrationRunner):
    async def run_migrations(self) -> bool:
        return await super().run_migrations("auth")
        
class PropertyServiceMigrationRunner(MigrationRunner):
    async def run_migrations(self) -> bool:
        return await super().run_migrations("property")
        
class MenuServiceMigrationRunner(MigrationRunner):
    async def run_migrations(self) -> bool:
        return await super().run_migrations("menu")
        
class OrderServiceMigrationRunner(MigrationRunner):
    async def run_migrations(self) -> bool:
        return await super().run_migrations("order")
        
class PaymentServiceMigrationRunner(MigrationRunner):
    async def run_migrations(self) -> bool:
        return await super().run_migrations("payment")
        
class CustomerServiceMigrationRunner(MigrationRunner):
    async def run_migrations(self) -> bool:
        return await super().run_migrations("customer")
        
class InventoryServiceMigrationRunner(MigrationRunner):
    async def run_migrations(self) -> bool:
        return await super().run_migrations("inventory")

# Utility function to run migrations for any service
async def run_service_migrations(service_name: str, database_url: str) -> bool:
    """Run migrations for a specific service"""
    runner = MigrationRunner(database_url)
    return await runner.run_migrations(service_name)

# Example usage
if __name__ == "__main__":
    async def main():
        database_url = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/buffrhost")
        
        # Run migrations for auth service
        auth_runner = AuthServiceMigrationRunner(database_url)
        success = await auth_runner.run_migrations()
        
        if success:
            print("Auth service migrations completed successfully")
        else:
            print("Auth service migrations failed")
            
        # Check migration status
        status = await auth_runner.check_migration_status()
        print(f"Migration status: {status}")
        
    asyncio.run(main())