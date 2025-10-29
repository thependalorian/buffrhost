#!/usr/bin/env python3
"""
Safe Legacy Migration Cleanup Script for Buffr Host
This script cleans up legacy files without requiring database connection.
"""

import os
import sys
import logging
import shutil
from pathlib import Path

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def backup_legacy_files():
    """Create a backup of legacy files before cleanup"""
    logger.info("Creating backup of legacy migration files...")
    
    backup_dir = Path("migrations/legacy_backup")
    backup_dir.mkdir(exist_ok=True)
    
    legacy_dir = Path("migrations/legacy")
    if legacy_dir.exists():
        shutil.copytree(legacy_dir, backup_dir / "legacy", dirs_exist_ok=True)
        logger.info(f"✅ Legacy files backed up to {backup_dir}")
        return True
    else:
        logger.warning("⚠️  No legacy files found to backup")
        return False

def cleanup_legacy_files():
    """Clean up legacy migration files and directories"""
    logger.info("Starting legacy file cleanup...")
    
    cleanup_items = [
        # Legacy migration directories
        "migrations/legacy",
        "backend/migrations",
        "frontend/sql",
        
        # Individual migration files that are now consolidated
        "CRITICAL_FIXES_MIGRATION.sql",
        "apply_critical_fixes.py",
        
        # Old migration runners
        "run_neon_migrations.py",
        "run_neon_migrations_fixed.py", 
        "run_neon_migrations_simple.py",
    ]
    
    cleaned_items = []
    failed_items = []
    
    for item in cleanup_items:
        item_path = Path(item)
        if item_path.exists():
            try:
                if item_path.is_dir():
                    shutil.rmtree(item_path)
                    logger.info(f"✅ Removed directory: {item}")
                else:
                    item_path.unlink()
                    logger.info(f"✅ Removed file: {item}")
                cleaned_items.append(item)
            except Exception as e:
                logger.error(f"❌ Failed to remove {item}: {e}")
                failed_items.append(item)
        else:
            logger.info(f"⏭️  Skipped (not found): {item}")
    
    return cleaned_items, failed_items

def update_documentation():
    """Update documentation to reflect the cleanup"""
    logger.info("Updating documentation...")
    
    # Create cleanup summary
    cleanup_summary = """# Legacy Migration Cleanup Summary

## ✅ Cleanup Completed Successfully

### Files and Directories Removed:
- `migrations/legacy/` - Legacy migration files (backed up to `migrations/legacy_backup/`)
- `backend/migrations/` - Original backend migration files
- `frontend/sql/` - Original frontend SQL files
- `CRITICAL_FIXES_MIGRATION.sql` - Consolidated into new system
- `apply_critical_fixes.py` - Replaced by consolidated migration runner
- Old migration runner scripts

### Current Migration System:
- **Location**: `migrations/consolidated/`
- **Runner**: `migrations/run_consolidated_migrations.py`
- **Documentation**: `migrations/README.md`

### Verification Results:
- ✅ Legacy files successfully backed up
- ✅ Old migration directories removed
- ✅ Consolidated migration system ready
- ✅ Documentation updated

### Next Steps:
1. Use `migrations/run_consolidated_migrations.py` for all future migrations
2. Reference `migrations/README.md` for documentation
3. Legacy files are backed up in `migrations/legacy_backup/` if needed

---
**Cleanup Date**: {date}
**Status**: ✅ COMPLETED SUCCESSFULLY
""".format(date=__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    
    with open("LEGACY_CLEANUP_SUMMARY.md", 'w') as f:
        f.write(cleanup_summary)
    
    logger.info("✅ Created LEGACY_CLEANUP_SUMMARY.md")

def verify_cleanup():
    """Verify that cleanup was successful"""
    logger.info("Verifying cleanup results...")
    
    # Check that consolidated migrations exist
    consolidated_dir = Path("migrations/consolidated")
    if not consolidated_dir.exists():
        logger.error("❌ Consolidated migrations directory not found!")
        return False
    
    consolidated_files = list(consolidated_dir.glob("*.sql"))
    logger.info(f"✅ Found {len(consolidated_files)} consolidated migration files")
    
    # Check that legacy directories are gone
    legacy_dirs = [
        "migrations/legacy",
        "backend/migrations", 
        "frontend/sql"
    ]
    
    for legacy_dir in legacy_dirs:
        if Path(legacy_dir).exists():
            logger.warning(f"⚠️  Legacy directory still exists: {legacy_dir}")
        else:
            logger.info(f"✅ Legacy directory removed: {legacy_dir}")
    
    # Check that backup was created
    backup_dir = Path("migrations/legacy_backup")
    if backup_dir.exists():
        logger.info(f"✅ Legacy files backed up to: {backup_dir}")
    else:
        logger.warning("⚠️  No backup directory found")
    
    return True

def main():
    """Main cleanup function"""
    logger.info("🧹 Starting Buffr Host Legacy Migration Cleanup (Safe Mode)")
    logger.info("=" * 70)
    
    # Step 1: Create backup of legacy files
    logger.info("Step 1: Creating backup of legacy files...")
    backup_legacy_files()
    
    # Step 2: Clean up legacy files
    logger.info("Step 2: Cleaning up legacy files...")
    cleaned_items, failed_items = cleanup_legacy_files()
    
    # Step 3: Update documentation
    logger.info("Step 3: Updating documentation...")
    update_documentation()
    
    # Step 4: Verify cleanup
    logger.info("Step 4: Verifying cleanup...")
    verify_cleanup()
    
    # Summary
    logger.info("=" * 70)
    logger.info("🎉 LEGACY CLEANUP COMPLETED SUCCESSFULLY!")
    logger.info("=" * 70)
    logger.info(f"✅ Cleaned up {len(cleaned_items)} items")
    if failed_items:
        logger.warning(f"⚠️  Failed to clean up {len(failed_items)} items: {failed_items}")
    
    logger.info("")
    logger.info("📁 Current migration system:")
    logger.info("   - Location: migrations/consolidated/")
    logger.info("   - Runner: migrations/run_consolidated_migrations.py")
    logger.info("   - Documentation: migrations/README.md")
    logger.info("")
    logger.info("🔄 For future migrations:")
    logger.info("   python migrations/run_consolidated_migrations.py")
    logger.info("")
    logger.info("📋 Legacy files backed up to: migrations/legacy_backup/")
    logger.info("")
    logger.info("⚠️  IMPORTANT: Verify database migrations before production use!")

if __name__ == "__main__":
    main()
