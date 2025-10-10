#!/usr/bin/env python3
"""
Update all microservices to include migration system
"""
import os
import re
from pathlib import Path

def update_service_migration(service_name: str, service_path: Path):
    """Update a single service to include migration system"""
    
    main_py_path = service_path / "main.py"
    if not main_py_path.exists():
        print(f"No main.py found for {service_name}")
        return False
    
    # Read the current file
    with open(main_py_path, 'r') as f:
        content = f.read()
    
    # Find the lifespan function
    lifespan_pattern = r'@asynccontextmanager\s+async def lifespan\(app: FastAPI\):.*?(?=# Create FastAPI app|$)'
    lifespan_match = re.search(lifespan_pattern, content, re.DOTALL)
    
    if not lifespan_match:
        print(f"Could not find lifespan function in {service_name}")
        return False
    
    # Extract the current lifespan function
    current_lifespan = lifespan_match.group(0)
    
    # Create the migration runner class name
    migration_runner_class = f"{service_name.replace('-', '').title()}ServiceSupabaseMigrationRunner"
    
    # Create the new lifespan function with migrations
    new_lifespan = f'''@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global supabase_client
    
    # Startup
    logger.info("Starting Buffr Host {service_name.replace('-', ' ').title()} Service...")
    
    try:
        # Initialize Supabase client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("Missing Supabase configuration")
        
        supabase_client = create_client(supabase_url, supabase_key)
        
        # Run database migrations
        try:
            from shared.supabase_migrations.supabase_migration_runner import {migration_runner_class}
            database_url = os.getenv("DATABASE_URL")
            if database_url:
                migration_runner = {migration_runner_class}(database_url)
                migration_success = await migration_runner.run_migrations()
                if migration_success:
                    logger.info("Database migrations completed successfully")
                else:
                    logger.warning("Database migrations failed - continuing anyway")
            else:
                logger.warning("No DATABASE_URL provided - skipping migrations")
        except Exception as migration_error:
            logger.error(f"Migration error: {{migration_error}} - continuing anyway")
        
        logger.info("{service_name.replace('-', ' ').title()} Service initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize {service_name.replace('-', ' ').title()} Service: {{e}}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down {service_name.replace('-', ' ').title()} Service...")'''
    
    # Replace the lifespan function
    new_content = content.replace(current_lifespan, new_lifespan)
    
    # Write the updated file
    with open(main_py_path, 'w') as f:
        f.write(new_content)
    
    print(f"Updated {service_name} with migration system")
    return True

def main():
    """Update all microservices"""
    microservices_dir = Path("microservices")
    
    services_to_update = [
        "menu-service",
        "order-service", 
        "payment-service",
        "customer-service",
        "inventory-service",
        "booking-service",
        "notification-service",
        "analytics-service",
        "audit-service",
        "document-service",
        "signature-service",
        "template-service",
        "workflow-service",
        "realtime-service"
    ]
    
    updated_count = 0
    
    for service_name in services_to_update:
        service_path = microservices_dir / service_name
        if service_path.exists():
            if update_service_migration(service_name, service_path):
                updated_count += 1
        else:
            print(f"Service directory not found: {service_name}")
    
    print(f"\nUpdated {updated_count} services with migration system")

if __name__ == "__main__":
    main()