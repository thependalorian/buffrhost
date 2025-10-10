#!/usr/bin/env python3
"""
SQL Structure Cleanup Script
Reorganizes the scattered SQL files into proper microservice-specific schemas
"""

import os
import shutil
from pathlib import Path
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def backup_old_files():
    """Backup old SQL files before cleanup"""
    sql_dir = Path("sql")
    backup_dir = Path("sql_backup")
    
    if sql_dir.exists():
        if backup_dir.exists():
            shutil.rmtree(backup_dir)
        shutil.copytree(sql_dir, backup_dir)
        logger.info(f"Backed up old SQL files to {backup_dir}")
        return True
    return False

def analyze_sql_files():
    """Analyze existing SQL files to understand their purpose"""
    sql_dir = Path("sql")
    
    if not sql_dir.exists():
        logger.warning("No sql directory found")
        return {}
    
    analysis = {
        "unified_files": [],
        "hospitality_files": [],
        "integration_files": [],
        "misc_files": []
    }
    
    for file_path in sql_dir.glob("*.sql"):
        filename = file_path.name
        
        if filename.startswith("00_unified") or filename.startswith("001_create_unified"):
            analysis["unified_files"].append(file_path)
        elif "hospitality" in filename.lower() or filename.startswith("013_"):
            analysis["hospitality_files"].append(file_path)
        elif any(integration in filename.lower() for integration in ["integration", "adumo", "realpay", "buffr_api"]):
            analysis["integration_files"].append(file_path)
        else:
            analysis["misc_files"].append(file_path)
    
    logger.info(f"Found {len(analysis['unified_files'])} unified files")
    logger.info(f"Found {len(analysis['hospitality_files'])} hospitality files")
    logger.info(f"Found {len(analysis['integration_files'])} integration files")
    logger.info(f"Found {len(analysis['misc_files'])} miscellaneous files")
    
    return analysis

def create_microservice_directories():
    """Create schema directories for each microservice"""
    services = [
        "auth-service",
        "property-service", 
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
    
    created_dirs = []
    
    for service in services:
        schema_dir = Path("microservices") / service / "schemas"
        schema_dir.mkdir(parents=True, exist_ok=True)
        created_dirs.append(schema_dir)
        
        # Create README for each service
        readme_path = schema_dir / "README.md"
        if not readme_path.exists():
            readme_content = f"""# {service.replace('-', ' ').title()} Database Schema

This directory contains database migration scripts for the {service.replace('-', ' ')}.

## Migration Files

- `001_{service.split('-')[0]}_tables.sql` - Initial table creation
- `002_{service.split('-')[0]}_indexes.sql` - Index creation
- `003_{service.split('-')[0]}_triggers.sql` - Trigger creation
- `004_{service.split('-')[0]}_policies.sql` - RLS policies

## Dependencies

This service depends on:
- Auth service (for user references)
- Property service (for property references)
- Other services as needed

## Running Migrations

Migrations are automatically run when the service starts up.
"""
            readme_path.write_text(readme_content)
    
    logger.info(f"Created {len(created_dirs)} microservice schema directories")
    return created_dirs

def organize_existing_files(analysis):
    """Organize existing SQL files into appropriate microservice directories"""
    
    # Map files to services
    file_mappings = {
        "auth-service": [],
        "property-service": [],
        "menu-service": [],
        "order-service": [],
        "payment-service": [],
        "customer-service": [],
        "inventory-service": [],
        "shared": []
    }
    
    # Categorize unified files
    for file_path in analysis["unified_files"]:
        filename = file_path.name.lower()
        
        if "user" in filename or "auth" in filename or "profile" in filename:
            file_mappings["auth-service"].append(file_path)
        elif "property" in filename or "hospitality" in filename:
            file_mappings["property-service"].append(file_path)
        elif "menu" in filename:
            file_mappings["menu-service"].append(file_path)
        elif "order" in filename:
            file_mappings["order-service"].append(file_path)
        elif "payment" in filename:
            file_mappings["payment-service"].append(file_path)
        elif "customer" in filename:
            file_mappings["customer-service"].append(file_path)
        elif "inventory" in filename:
            file_mappings["inventory-service"].append(file_path)
        else:
            file_mappings["shared"].append(file_path)
    
    # Categorize hospitality files
    for file_path in analysis["hospitality_files"]:
        file_mappings["property-service"].append(file_path)
    
    # Move files to appropriate directories
    moved_files = []
    
    for service, files in file_mappings.items():
        if not files:
            continue
            
        if service == "shared":
            target_dir = Path("microservices/shared/migrations")
        else:
            target_dir = Path("microservices") / service / "schemas"
        
        target_dir.mkdir(parents=True, exist_ok=True)
        
        for file_path in files:
            target_path = target_dir / file_path.name
            
            # Rename file to follow convention
            if not target_path.name.startswith("001_"):
                new_name = f"001_{target_path.stem}.sql"
                target_path = target_dir / new_name
            
            shutil.copy2(file_path, target_path)
            moved_files.append((file_path, target_path))
            logger.info(f"Moved {file_path.name} to {target_path}")
    
    return moved_files

def create_cleanup_summary():
    """Create a summary of the cleanup process"""
    summary_path = Path("SQL_CLEANUP_SUMMARY.md")
    
    summary_content = """# SQL Structure Cleanup Summary

## What Was Done

1. **Backed up old files** to `sql_backup/` directory
2. **Created microservice-specific schema directories** for each service
3. **Organized existing SQL files** into appropriate service directories
4. **Created proper migration structure** with numbered files
5. **Added README files** for each service schema directory

## New Structure

```
microservices/
├── auth-service/schemas/
│   ├── README.md
│   └── 001_auth_tables.sql
├── property-service/schemas/
│   ├── README.md
│   └── 001_property_tables.sql
├── menu-service/schemas/
│   ├── README.md
│   └── 001_menu_tables.sql
├── order-service/schemas/
│   ├── README.md
│   └── 001_order_tables.sql
├── payment-service/schemas/
│   ├── README.md
│   └── 001_payment_tables.sql
├── customer-service/schemas/
│   ├── README.md
│   └── 001_customer_tables.sql
├── inventory-service/schemas/
│   ├── README.md
│   └── 001_inventory_tables.sql
└── shared/
    ├── migrations/
    │   ├── README.md
    │   ├── 001_shared_enums.sql
    │   ├── 002_shared_functions.sql
    │   ├── 003_shared_triggers.sql
    │   └── migration_runner.py
    └── models/
        ├── base.py
        └── shared.py
```

## Benefits

- **Better organization**: Each service has its own schema directory
- **Easier maintenance**: Changes to one service don't affect others
- **Proper migration system**: Numbered files with clear dependencies
- **Shared components**: Common enums, functions, and triggers
- **Documentation**: README files explain each service's schema

## Next Steps

1. **Update microservice startup code** to run migrations
2. **Test migration system** with each service
3. **Remove old sql directory** after verification
4. **Update documentation** to reflect new structure

## Migration Order

1. Shared components (enums, functions, triggers)
2. Auth service (users, authentication)
3. Property service (properties, rooms, amenities)
4. Customer service (customers, loyalty)
5. Menu service (menus, items, categories)
6. Inventory service (inventory, suppliers)
7. Order service (orders, order items)
8. Payment service (payments, refunds)

## Files Moved

See the backup directory `sql_backup/` for the original files.
"""
    
    summary_path.write_text(summary_content)
    logger.info(f"Created cleanup summary: {summary_path}")

def main():
    """Main cleanup function"""
    logger.info("Starting SQL structure cleanup...")
    
    # Step 1: Backup old files
    if not backup_old_files():
        logger.warning("No old SQL files to backup")
    
    # Step 2: Analyze existing files
    analysis = analyze_sql_files()
    
    # Step 3: Create microservice directories
    create_microservice_directories()
    
    # Step 4: Organize existing files
    moved_files = organize_existing_files(analysis)
    
    # Step 5: Create cleanup summary
    create_cleanup_summary()
    
    logger.info(f"Cleanup completed! Moved {len(moved_files)} files")
    logger.info("Review the SQL_CLEANUP_SUMMARY.md file for details")

if __name__ == "__main__":
    main()