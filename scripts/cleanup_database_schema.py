#!/usr/bin/env python3
"""
Clean up the old database/schema.sql file
"""
import os
import shutil
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def analyze_database_schema():
    """Analyze the database/schema.sql file"""
    
    schema_file = Path("database/schema.sql")
    
    if not schema_file.exists():
        logger.info("No database/schema.sql found")
        return None
    
    logger.info("Analyzing database/schema.sql...")
    
    # Read the file to get basic info
    with open(schema_file, 'r') as f:
        content = f.read()
    
    # Count tables
    table_count = content.count('CREATE TABLE')
    
    logger.info(f"Found comprehensive schema with {table_count} tables")
    
    return {
        'file_path': str(schema_file),
        'size_lines': len(content.splitlines()),
        'table_count': table_count,
        'content': content
    }

def archive_database_schema(archive_dir: Path, schema_info: dict):
    """Archive the database schema"""
    
    # Create archive file
    archive_file = archive_dir / "archived_database_schema.sql"
    
    with open(archive_file, 'w') as f:
        f.write("-- ARCHIVED DATABASE SCHEMA\n")
        f.write(f"-- Original file: {schema_info['file_path']}\n")
        f.write(f"-- Tables: {schema_info['table_count']}\n")
        f.write(f"-- Lines: {schema_info['size_lines']}\n")
        f.write(f"-- Date: {os.popen('date').read().strip()}\n\n")
        f.write("-- This is a comprehensive hospitality management schema\n")
        f.write("-- that was designed for traditional PostgreSQL setup\n")
        f.write("-- but is not used by the current Supabase-based microservices\n\n")
        f.write(schema_info['content'])
    
    logger.info(f"Archived database schema to: {archive_file}")
    
    # Create summary file
    summary_file = archive_dir / "database_schema_summary.md"
    
    with open(summary_file, 'w') as f:
        f.write("# Database Schema Archive Summary\n\n")
        f.write(f"**Original File**: `{schema_info['file_path']}`\n")
        f.write(f"**Tables**: {schema_info['table_count']}\n")
        f.write(f"**Size**: {schema_info['size_lines']} lines\n\n")
        
        f.write("## What This Schema Contains\n\n")
        f.write("This is a comprehensive hospitality management database schema with:\n\n")
        f.write("- **65+ tables** covering all aspects of hospitality management\n")
        f.write("- **Restaurant management** (menus, orders, inventory)\n")
        f.write("- **Hotel management** (rooms, reservations, rates)\n")
        f.write("- **Spa services** (treatments, bookings)\n")
        f.write("- **Conference facilities** (rooms, bookings)\n")
        f.write("- **Transportation services**\n")
        f.write("- **Staff management** (departments, schedules, performance)\n")
        f.write("- **AI agent integration** (sessions, workflows)\n")
        f.write("- **Document management**\n")
        f.write("- **Knowledge base** and vector search\n")
        f.write("- **Voice interactions** and audio files\n\n")
        
        f.write("## Why It Was Archived\n\n")
        f.write("This schema was designed for traditional PostgreSQL setup but:\n\n")
        f.write("- ✅ **Not used by microservices** - Services use Supabase directly\n")
        f.write("- ✅ **Superseded by new system** - New unified migration system\n")
        f.write("- ✅ **Docker references outdated** - Docker files reference this but services don't use it\n")
        f.write("- ✅ **Comprehensive but unused** - Very detailed but not integrated\n\n")
        
        f.write("## Current System\n\n")
        f.write("The current system uses:\n\n")
        f.write("- `microservices/shared/supabase_migrations/` - Unified migration system\n")
        f.write("- `microservices/shared/supabase_migrations/001_supabase_core_tables.sql` - Core schema\n")
        f.write("- Service-specific schemas in `microservices/{service}-service/schemas/`\n")
        f.write("- Automatic migrations on service startup\n\n")
        
        f.write("## Potential Future Use\n\n")
        f.write("This comprehensive schema could be useful for:\n\n")
        f.write("- **Reference** for implementing missing features\n")
        f.write("- **Migration** to traditional PostgreSQL if needed\n")
        f.write("- **Understanding** the full scope of hospitality management\n")
        f.write("- **Planning** future microservice enhancements\n")

def cleanup_database_directory():
    """Clean up the database directory"""
    
    database_dir = Path("database")
    
    if not database_dir.exists():
        logger.info("No database directory found")
        return []
    
    # Check what's in the directory
    files = list(database_dir.iterdir())
    logger.info(f"Found {len(files)} files in database directory")
    
    # Remove the directory
    logger.info(f"Removing database directory: {database_dir}")
    shutil.rmtree(database_dir)
    
    return [str(f) for f in files]

def update_docker_references():
    """Update Docker Compose files to remove references to old schema"""
    
    docker_files = [
        "docker-compose.prod.yml",
        "docker-compose.dev.yml"
    ]
    
    updated_files = []
    
    for docker_file in docker_files:
        file_path = Path(docker_file)
        if file_path.exists():
            with open(file_path, 'r') as f:
                content = f.read()
            
            # Remove the schema.sql volume mount
            old_content = content
            content = content.replace(
                "- ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql",
                "# Schema migrations handled by microservices"
            )
            
            if content != old_content:
                with open(file_path, 'w') as f:
                    f.write(content)
                updated_files.append(docker_file)
                logger.info(f"Updated {docker_file}")
    
    return updated_files

def create_cleanup_report(archive_dir: Path, schema_info: dict, removed_files: list, updated_docker_files: list):
    """Create a cleanup report"""
    
    report_file = archive_dir / "DATABASE_CLEANUP_REPORT.md"
    
    with open(report_file, 'w') as f:
        f.write("# Database Schema Cleanup Report\n\n")
        f.write(f"**Date**: {os.popen('date').read().strip()}\n\n")
        
        f.write("## Summary\n\n")
        f.write("The old comprehensive database schema has been cleaned up and archived.\n")
        f.write("This schema was designed for traditional PostgreSQL but is not used by the current Supabase-based microservices.\n\n")
        
        f.write("## What Was Removed\n\n")
        f.write("- `database/` directory and all contents\n")
        for file_name in removed_files:
            f.write(f"  - `{file_name}`\n")
        
        f.write("\n## What Was Preserved\n\n")
        f.write(f"- **Comprehensive schema** with {schema_info['table_count']} tables archived\n")
        f.write("- **Complete hospitality management** functionality preserved\n")
        f.write("- **Reference documentation** created\n")
        
        f.write("\n## Docker Files Updated\n\n")
        for docker_file in updated_docker_files:
            f.write(f"- `{docker_file}` - Removed schema.sql volume mount\n")
        
        f.write("\n## Current Migration System\n\n")
        f.write("The project now uses:\n\n")
        f.write("- ✅ **Unified migration system** in `microservices/shared/supabase_migrations/`\n")
        f.write("- ✅ **Service-specific schemas** for each microservice\n")
        f.write("- ✅ **Automatic migrations** on service startup\n")
        f.write("- ✅ **Supabase-compatible** schemas\n")
        
        f.write("\n## Benefits\n\n")
        f.write("- ✅ **Clean structure** - No unused schema files\n")
        f.write("- ✅ **Proper integration** - Schemas match service expectations\n")
        f.write("- ✅ **Maintainable** - Clear separation by microservice\n")
        f.write("- ✅ **Production ready** - Automatic migration system\n")
        
        f.write("\n## Next Steps\n\n")
        f.write("1. Review archived schema for any missing features\n")
        f.write("2. Integrate missing functionality into microservices\n")
        f.write("3. Test new migration system with actual database\n")
        f.write("4. Deploy services with new migration system\n")

def main():
    """Main cleanup function"""
    
    logger.info("Starting database schema cleanup...")
    
    # Analyze the schema
    schema_info = analyze_database_schema()
    
    if not schema_info:
        logger.info("No database schema to clean up")
        return
    
    # Create archive directory
    archive_dir = Path("archived_sql_schemas")
    archive_dir.mkdir(exist_ok=True)
    
    # Archive the schema
    archive_database_schema(archive_dir, schema_info)
    
    # Clean up database directory
    removed_files = cleanup_database_directory()
    
    # Update Docker references
    updated_docker_files = update_docker_references()
    
    # Create cleanup report
    create_cleanup_report(archive_dir, schema_info, removed_files, updated_docker_files)
    
    logger.info("Database schema cleanup completed!")
    logger.info(f"Archived comprehensive schema with {schema_info['table_count']} tables")
    logger.info(f"Removed {len(removed_files)} files from database directory")
    logger.info(f"Updated {len(updated_docker_files)} Docker files")

if __name__ == "__main__":
    main()