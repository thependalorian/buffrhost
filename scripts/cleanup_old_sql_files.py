#!/usr/bin/env python3
"""
Clean up old SQL files after migration to new schema system
"""
import os
import shutil
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def analyze_old_sql_files():
    """Analyze what's in the old SQL directories"""
    
    sql_dir = Path("sql")
    sql_backup_dir = Path("sql_backup")
    
    if not sql_dir.exists():
        logger.info("No sql directory found")
        return
    
    logger.info("Analyzing old SQL files...")
    
    # Check for important files that might need preservation
    important_files = [
        "022_create_buffrsign_signature_schema.sql",
        "023_create_microservices_management_schema.sql",
        "custom_migrations/001_create_etuna_property_data.sql",
        "custom_migrations/01_project_specific_schema.sql"
    ]
    
    preserved_content = {}
    
    for file_path in important_files:
        full_path = sql_dir / file_path
        if full_path.exists():
            logger.info(f"Found important file: {file_path}")
            with open(full_path, 'r') as f:
                preserved_content[file_path] = f.read()
    
    return preserved_content

def create_archive_directory():
    """Create an archive directory for important files"""
    
    archive_dir = Path("archived_sql_schemas")
    archive_dir.mkdir(exist_ok=True)
    
    logger.info(f"Created archive directory: {archive_dir}")
    return archive_dir

def preserve_important_schemas(archive_dir: Path, preserved_content: dict):
    """Preserve important schema information"""
    
    # Create a comprehensive schema archive
    archive_file = archive_dir / "important_schemas_archive.sql"
    
    with open(archive_file, 'w') as f:
        f.write("-- IMPORTANT SCHEMAS ARCHIVE\n")
        f.write("-- This file contains important schema information from old SQL files\n")
        f.write("-- These schemas may contain features not yet integrated into the new system\n\n")
        
        for file_name, content in preserved_content.items():
            f.write(f"-- ============================================\n")
            f.write(f"-- FROM: {file_name}\n")
            f.write(f"-- ============================================\n\n")
            f.write(content)
            f.write("\n\n")
    
    logger.info(f"Preserved important schemas in: {archive_file}")
    
    # Create individual files for each important schema
    for file_name, content in preserved_content.items():
        safe_name = file_name.replace('/', '_').replace('\\', '_')
        individual_file = archive_dir / f"archived_{safe_name}"
        
        with open(individual_file, 'w') as f:
            f.write(f"-- ARCHIVED FROM: {file_name}\n")
            f.write(f"-- DATE: {os.popen('date').read().strip()}\n\n")
            f.write(content)
        
        logger.info(f"Created individual archive: {individual_file}")

def cleanup_old_directories():
    """Remove the old SQL directories"""
    
    sql_dir = Path("sql")
    sql_backup_dir = Path("sql_backup")
    
    removed_dirs = []
    
    if sql_dir.exists():
        logger.info(f"Removing old sql directory: {sql_dir}")
        shutil.rmtree(sql_dir)
        removed_dirs.append("sql")
    
    if sql_backup_dir.exists():
        logger.info(f"Removing old sql_backup directory: {sql_backup_dir}")
        shutil.rmtree(sql_backup_dir)
        removed_dirs.append("sql_backup")
    
    return removed_dirs

def create_cleanup_report(archive_dir: Path, preserved_content: dict, removed_dirs: list):
    """Create a cleanup report"""
    
    report_file = archive_dir / "CLEANUP_REPORT.md"
    
    with open(report_file, 'w') as f:
        f.write("# SQL Files Cleanup Report\n\n")
        f.write(f"**Date**: {os.popen('date').read().strip()}\n\n")
        
        f.write("## Summary\n\n")
        f.write("Old scattered SQL files have been cleaned up and replaced with the new unified migration system.\n\n")
        
        f.write("## What Was Removed\n\n")
        for dir_name in removed_dirs:
            f.write(f"- `{dir_name}/` directory and all contents\n")
        
        f.write("\n## What Was Preserved\n\n")
        f.write("Important schema information was preserved in the archive:\n\n")
        for file_name in preserved_content.keys():
            f.write(f"- `{file_name}` - Archived to `archived_sql_schemas/`\n")
        
        f.write("\n## New Migration System\n\n")
        f.write("The old scattered SQL files have been replaced with:\n\n")
        f.write("- `microservices/shared/supabase_migrations/` - Unified migration system\n")
        f.write("- `microservices/shared/supabase_migrations/001_supabase_core_tables.sql` - Core database schema\n")
        f.write("- `microservices/shared/supabase_migrations/supabase_migration_runner.py` - Migration runner\n")
        
        f.write("\n## Benefits\n\n")
        f.write("- ✅ **Organized**: Schema files are now organized by microservice\n")
        f.write("- ✅ **Integrated**: Migrations run automatically when services start\n")
        f.write("- ✅ **Maintainable**: Clear separation of concerns\n")
        f.write("- ✅ **Production Ready**: Proper error handling and rollback\n")
        
        f.write("\n## Next Steps\n\n")
        f.write("1. Review archived schemas for any missing features\n")
        f.write("2. Integrate any missing functionality into the new system\n")
        f.write("3. Test the new migration system with actual database\n")
        f.write("4. Deploy services with new migration system\n")
    
    logger.info(f"Created cleanup report: {report_file}")

def main():
    """Main cleanup function"""
    
    logger.info("Starting SQL files cleanup...")
    
    # Analyze old files
    preserved_content = analyze_old_sql_files()
    
    # Create archive directory
    archive_dir = create_archive_directory()
    
    # Preserve important schemas
    if preserved_content:
        preserve_important_schemas(archive_dir, preserved_content)
    
    # Clean up old directories
    removed_dirs = cleanup_old_directories()
    
    # Create cleanup report
    create_cleanup_report(archive_dir, preserved_content, removed_dirs)
    
    logger.info("SQL files cleanup completed!")
    logger.info(f"Archive created in: {archive_dir}")
    
    if removed_dirs:
        logger.info(f"Removed directories: {', '.join(removed_dirs)}")
    
    if preserved_content:
        logger.info(f"Preserved {len(preserved_content)} important schema files")

if __name__ == "__main__":
    main()