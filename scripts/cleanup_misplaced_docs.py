#!/usr/bin/env python3
"""
Clean up misplaced documentation files
Move files that belong to other projects to their correct locations
"""
import os
import shutil
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MisplacedDocsCleaner:
    def __init__(self):
        self.docs_dir = Path("docs")
        self.project_root = Path(".")
        
        # Files that belong to other projects
        self.misplaced_files = {
            'buffrsign': [
                'BUFFRSIGN_ARCHITECTURE_OUTLINE.md',
                'BUFFRSIGN_STARTER_AUDIT_AND_ENHANCEMENT_PLAN.md'
            ],
            'las': [
                'LAS_API_DOCUMENTATION.md',
                'LAS_IMPLEMENTATION_GUIDE.md', 
                'LAS_LEAD_ACTIVATION_SYSTEM.md',
                'LAS_SERVICES_OVERVIEW.md'
            ],
            'buffrlend': [
                'api/employee_loan_applications.md'
            ],
            'ai_sales_platform': [
                'AI_RECEPTIONIST_DOCUMENTATION.md'
            ],
            'business_strategy': [
                'AFRICAN_MARKET_STRATEGY.md',
                'BOUTIQUE_HOTEL_MARKET_ANALYSIS.md',
                'CUSTOMER_DISCOVERY_PROGRAM.md',
                'NAMIBIAN_SOUTHERN_AFRICAN_MARKET_ANALYSIS.md',
                'ROGER_MARTIN_STRATEGY.md',
                'STRATEGIC_DEVELOPMENT_PLAN.md',
                'STRATEGIC_METRICS_DASHBOARD.md',
                'VALUE_PROPOSITION_CANVAS.md'
            ],
            'duplicate_guides': [
                'deployment-guide.md',  # Duplicate of DEPLOYMENT_GUIDE.md
                'development-guide.md',  # Duplicate of DEVELOPMENT_GUIDE.md
                'api-specification.md',  # Duplicate of API_DOCUMENTATION.md
                'architecture.md',  # Duplicate of ARCHITECTURE.md
                'comprehensive-hotel-ecosystem.md',
                'design-and-planning.md',
                'disaster-recovery-plan.md',
                'etuna-demo-audit.md',
                'etuna-demo-showcase.md',
                'etuna-integration.md',
                'langfuse-integration.md',
                'loyalty-system-enhancement.md',
                'monitoring-setup.md',
                'operational-runbooks.md',
                'phase-1-implementation-summary.md',
                'phase-2-implementation-summary.md',
                'phase-3-implementation-summary.md'
            ]
        }
        
    def create_project_directories(self):
        """Create directories for other projects"""
        logger.info("Creating project directories...")
        
        # Create directories for other projects
        projects = ['buffrsign', 'las', 'buffrlend', 'ai_sales_platform', 'business_strategy']
        
        for project in projects:
            project_dir = self.project_root / f"{project}_docs"
            project_dir.mkdir(exist_ok=True)
            logger.info(f"Created directory: {project_dir}")
            
    def move_misplaced_files(self):
        """Move files to their correct project directories"""
        logger.info("Moving misplaced files...")
        
        moved_count = 0
        
        for project, files in self.misplaced_files.items():
            if project == 'duplicate_guides':
                # Move duplicates to archive
                dest_dir = self.docs_dir / "ARCHIVE" / "duplicate-reports"
                dest_dir.mkdir(exist_ok=True)
            else:
                dest_dir = self.project_root / f"{project}_docs"
                dest_dir.mkdir(exist_ok=True)
            
            for file_name in files:
                source_path = self.docs_dir / file_name
                
                if source_path.exists():
                    # Handle nested files (like api/employee_loan_applications.md)
                    if '/' in file_name:
                        dest_path = dest_dir / file_name
                        dest_path.parent.mkdir(parents=True, exist_ok=True)
                    else:
                        dest_path = dest_dir / file_name
                    
                    shutil.move(str(source_path), str(dest_path))
                    logger.info(f"Moved {file_name} to {dest_dir}")
                    moved_count += 1
                else:
                    logger.warning(f"File not found: {file_name}")
                    
        return moved_count
        
    def create_project_readmes(self):
        """Create README files for each project directory"""
        logger.info("Creating project README files...")
        
        projects = {
            'buffrsign_docs': {
                'title': 'BuffrSign Digital Signature Platform',
                'description': 'Documentation for the BuffrSign digital signature platform - an AI-powered signature solution built on Buffr Host architecture.'
            },
            'las_docs': {
                'title': 'LAS (Lead Activation System)',
                'description': 'Documentation for the LAS - a comprehensive AI-powered sales automation platform for lead conversion and customer engagement.'
            },
            'buffrlend_docs': {
                'title': 'BuffrLend Financial Services',
                'description': 'Documentation for BuffrLend - financial services integration including employee loan applications and lending solutions.'
            },
            'ai_sales_platform_docs': {
                'title': 'AI Sales Platform',
                'description': 'Documentation for the AI Sales Platform including AI receptionist and sales automation features.'
            },
            'business_strategy_docs': {
                'title': 'Business Strategy Documentation',
                'description': 'Strategic documentation including market analysis, customer discovery, and business development plans.'
            }
        }
        
        for project_dir, info in projects.items():
            readme_path = self.project_root / project_dir / "README.md"
            
            with open(readme_path, 'w') as f:
                f.write(f"# {info['title']}\n\n")
                f.write(f"{info['description']}\n\n")
                f.write("## Files in this directory:\n\n")
                
                # List files in the directory
                project_path = self.project_root / project_dir
                if project_path.exists():
                    for file_path in project_path.rglob("*.md"):
                        if file_path.name != "README.md":
                            relative_path = file_path.relative_to(project_path)
                            f.write(f"- `{relative_path}`\n")
                            
            logger.info(f"Created README for {project_dir}")
            
    def update_main_docs_readme(self):
        """Update the main docs README to reflect the cleanup"""
        logger.info("Updating main docs README...")
        
        readme_path = self.docs_dir / "README.md"
        
        # Read current content
        with open(readme_path, 'r') as f:
            content = f.read()
            
        # Add note about other project documentation
        additional_content = """
## Other Project Documentation

The following documentation belongs to other projects and has been moved to separate directories:

- **[BuffrSign Documentation](../buffrsign_docs/)** - Digital signature platform
- **[LAS Documentation](../las_docs/)** - Lead Activation System  
- **[BuffrLend Documentation](../buffrlend_docs/)** - Financial services
- **[AI Sales Platform Documentation](../ai_sales_platform_docs/)** - AI sales automation
- **[Business Strategy Documentation](../business_strategy_docs/)** - Strategic planning

These directories contain documentation specific to their respective projects and are maintained separately from the main Buffr Host documentation.
"""
        
        # Append the additional content
        updated_content = content + additional_content
        
        with open(readme_path, 'w') as f:
            f.write(updated_content)
            
        logger.info("Updated main docs README")
        
    def create_cleanup_report(self):
        """Create a cleanup report"""
        logger.info("Creating cleanup report...")
        
        report_content = """# Documentation Cleanup Report

## Summary

Misplaced documentation files have been moved to their correct project directories to maintain clear separation of concerns.

## Files Moved

### BuffrSign Documentation
- `BUFFRSIGN_ARCHITECTURE_OUTLINE.md` → `buffrsign_docs/`
- `BUFFRSIGN_STARTER_AUDIT_AND_ENHANCEMENT_PLAN.md` → `buffrsign_docs/`

### LAS (Lead Activation System) Documentation  
- `LAS_API_DOCUMENTATION.md` → `las_docs/`
- `LAS_IMPLEMENTATION_GUIDE.md` → `las_docs/`
- `LAS_LEAD_ACTIVATION_SYSTEM.md` → `las_docs/`
- `LAS_SERVICES_OVERVIEW.md` → `las_docs/`

### BuffrLend Documentation
- `api/employee_loan_applications.md` → `buffrlend_docs/api/`

### AI Sales Platform Documentation
- `AI_RECEPTIONIST_DOCUMENTATION.md` → `ai_sales_platform_docs/`

### Business Strategy Documentation
- `AFRICAN_MARKET_STRATEGY.md` → `business_strategy_docs/`
- `BOUTIQUE_HOTEL_MARKET_ANALYSIS.md` → `business_strategy_docs/`
- `CUSTOMER_DISCOVERY_PROGRAM.md` → `business_strategy_docs/`
- `NAMIBIAN_SOUTHERN_AFRICAN_MARKET_ANALYSIS.md` → `business_strategy_docs/`
- `ROGER_MARTIN_STRATEGY.md` → `business_strategy_docs/`
- `STRATEGIC_DEVELOPMENT_PLAN.md` → `business_strategy_docs/`
- `STRATEGIC_METRICS_DASHBOARD.md` → `business_strategy_docs/`
- `VALUE_PROPOSITION_CANVAS.md` → `business_strategy_docs/`

### Duplicate Guides (Archived)
- `deployment-guide.md` → `docs/ARCHIVE/duplicate-reports/`
- `development-guide.md` → `docs/ARCHIVE/duplicate-reports/`
- `api-specification.md` → `docs/ARCHIVE/duplicate-reports/`
- `architecture.md` → `docs/ARCHIVE/duplicate-reports/`
- `comprehensive-hotel-ecosystem.md` → `docs/ARCHIVE/duplicate-reports/`
- `design-and-planning.md` → `docs/ARCHIVE/duplicate-reports/`
- `disaster-recovery-plan.md` → `docs/ARCHIVE/duplicate-reports/`
- `etuna-demo-audit.md` → `docs/ARCHIVE/duplicate-reports/`
- `etuna-demo-showcase.md` → `docs/ARCHIVE/duplicate-reports/`
- `etuna-integration.md` → `docs/ARCHIVE/duplicate-reports/`
- `langfuse-integration.md` → `docs/ARCHIVE/duplicate-reports/`
- `loyalty-system-enhancement.md` → `docs/ARCHIVE/duplicate-reports/`
- `monitoring-setup.md` → `docs/ARCHIVE/duplicate-reports/`
- `operational-runbooks.md` → `docs/ARCHIVE/duplicate-reports/`
- `phase-1-implementation-summary.md` → `docs/ARCHIVE/duplicate-reports/`
- `phase-2-implementation-summary.md` → `docs/ARCHIVE/duplicate-reports/`
- `phase-3-implementation-summary.md` → `docs/ARCHIVE/duplicate-reports/`

## Benefits

- ✅ **Clear separation** of project documentation
- ✅ **Reduced confusion** about which docs belong to which project
- ✅ **Better organization** for multi-project repository
- ✅ **Easier maintenance** of project-specific documentation
- ✅ **Professional structure** for enterprise development

## Current Buffr Host Documentation

The `docs/` directory now contains only Buffr Host-specific documentation:

- **Core Documentation**: Architecture, API, Deployment, Development, User guides
- **Component Documentation**: Microservices, Frontend, Backend, Infrastructure
- **Archives**: Historical reports and deprecated documentation

This ensures clear focus on Buffr Host hospitality management platform documentation.
"""
        
        with open("DOCUMENTATION_CLEANUP_REPORT.md", 'w') as f:
            f.write(report_content)
            
        logger.info("Created cleanup report")
        
    def run_cleanup(self):
        """Run the complete cleanup process"""
        logger.info("Starting misplaced documentation cleanup...")
        
        try:
            # Step 1: Create project directories
            self.create_project_directories()
            
            # Step 2: Move misplaced files
            moved_count = self.move_misplaced_files()
            
            # Step 3: Create project READMEs
            self.create_project_readmes()
            
            # Step 4: Update main docs README
            self.update_main_docs_readme()
            
            # Step 5: Create cleanup report
            self.create_cleanup_report()
            
            logger.info(f"Documentation cleanup completed! Moved {moved_count} files.")
            
        except Exception as e:
            logger.error(f"Cleanup failed: {e}")
            raise

def main():
    """Main function"""
    cleaner = MisplacedDocsCleaner()
    cleaner.run_cleanup()

if __name__ == "__main__":
    main()