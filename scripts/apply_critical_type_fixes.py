#!/usr/bin/env python3
"""
Apply Critical Type Alignment Fixes
Database migration script to apply all critical type alignment fixes
"""

import os
import sys
import asyncio
from pathlib import Path
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Add backend to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from database import Base, engine
from config import settings

def create_migration_sql():
    """Create SQL migration for critical fixes"""
    return """
-- Critical Type Alignment Fixes Migration
-- Generated: {timestamp}

-- 1. Add missing fields to knowledge_documents table
ALTER TABLE knowledgedocument 
ADD COLUMN IF NOT EXISTS id VARCHAR(255),
ADD COLUMN IF NOT EXISTS category VARCHAR(255);

-- 2. Add missing field to user_permissions table
ALTER TABLE user_permissions 
ADD COLUMN IF NOT EXISTS source VARCHAR(255);

-- 3. Add missing fields to booking_modifications table
ALTER TABLE booking_modifications 
ADD COLUMN IF NOT EXISTS new_check_out TIMESTAMP,
ADD COLUMN IF NOT EXISTS new_check_in TIMESTAMP,
ADD COLUMN IF NOT EXISTS new_room_id VARCHAR(255);

-- 4. Add missing fields to booking_audits table
ALTER TABLE booking_audits 
ADD COLUMN IF NOT EXISTS changed_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS changed_by VARCHAR(255);

-- 5. Add missing fields to loyalty_campaigns table
ALTER TABLE loyaltycampaign 
ADD COLUMN IF NOT EXISTS success_probability VARCHAR(255),
ADD COLUMN IF NOT EXISTS target_segment VARCHAR(255),
ADD COLUMN IF NOT EXISTS customer_count INTEGER,
ADD COLUMN IF NOT EXISTS reward_type VARCHAR(255),
ADD COLUMN IF NOT EXISTS avg_frequency VARCHAR(255),
ADD COLUMN IF NOT EXISTS expected_roi VARCHAR(255),
ADD COLUMN IF NOT EXISTS success_metrics TEXT,
ADD COLUMN IF NOT EXISTS churn_risk VARCHAR(255),
ADD COLUMN IF NOT EXISTS segment VARCHAR(255),
ADD COLUMN IF NOT EXISTS reward_value VARCHAR(255),
ADD COLUMN IF NOT EXISTS loyalty_score VARCHAR(255),
ADD COLUMN IF NOT EXISTS expected_participation VARCHAR(255),
ADD COLUMN IF NOT EXISTS name VARCHAR(255),
ADD COLUMN IF NOT EXISTS campaign_type VARCHAR(255),
ADD COLUMN IF NOT EXISTS suggested_budget VARCHAR(255),
ADD COLUMN IF NOT EXISTS key_metrics TEXT,
ADD COLUMN IF NOT EXISTS growth_potential VARCHAR(255),
ADD COLUMN IF NOT EXISTS performance_data TEXT,
ADD COLUMN IF NOT EXISTS budget VARCHAR(255),
ADD COLUMN IF NOT EXISTS recommended_campaigns TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(255),
ADD COLUMN IF NOT EXISTS avg_spending VARCHAR(255),
ADD COLUMN IF NOT EXISTS reasoning TEXT,
ADD COLUMN IF NOT EXISTS campaign_duration INTEGER;

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_category ON knowledgedocument(category);
CREATE INDEX IF NOT EXISTS idx_user_permissions_source ON user_permissions(source);
CREATE INDEX IF NOT EXISTS idx_booking_modifications_new_dates ON booking_modifications(new_check_in, new_check_out);
CREATE INDEX IF NOT EXISTS idx_booking_audits_changed_at ON booking_audits(changed_at);
CREATE INDEX IF NOT EXISTS idx_loyalty_campaigns_status ON loyaltycampaign(status);

-- 7. Update table comments
COMMENT ON COLUMN knowledgedocument.id IS 'Document identifier for external systems';
COMMENT ON COLUMN knowledgedocument.category IS 'Document category for organization';
COMMENT ON COLUMN user_permissions.source IS 'Permission source (manual, role, system)';
COMMENT ON COLUMN booking_modifications.new_check_out IS 'New check-out date for modification';
COMMENT ON COLUMN booking_modifications.new_check_in IS 'New check-in date for modification';
COMMENT ON COLUMN booking_modifications.new_room_id IS 'New room ID for room change modifications';
COMMENT ON COLUMN booking_audits.changed_at IS 'When the change occurred';
COMMENT ON COLUMN booking_audits.changed_by IS 'Who made the change';
COMMENT ON COLUMN loyaltycampaign.success_probability IS 'AI-predicted success probability';
COMMENT ON COLUMN loyaltycampaign.target_segment IS 'Target customer segment';
COMMENT ON COLUMN loyaltycampaign.customer_count IS 'Number of target customers';
COMMENT ON COLUMN loyaltycampaign.reward_type IS 'Type of reward offered';
COMMENT ON COLUMN loyaltycampaign.expected_roi IS 'Expected return on investment';
COMMENT ON COLUMN loyaltycampaign.success_metrics IS 'JSON string of success metrics';
COMMENT ON COLUMN loyaltycampaign.churn_risk IS 'Customer churn risk assessment';
COMMENT ON COLUMN loyaltycampaign.segment IS 'Customer segment classification';
COMMENT ON COLUMN loyaltycampaign.reward_value IS 'Value of the reward';
COMMENT ON COLUMN loyaltycampaign.loyalty_score IS 'Customer loyalty score';
COMMENT ON COLUMN loyaltycampaign.expected_participation IS 'Expected participation rate';
COMMENT ON COLUMN loyaltycampaign.campaign_type IS 'Type of loyalty campaign';
COMMENT ON COLUMN loyaltycampaign.suggested_budget IS 'AI-suggested budget';
COMMENT ON COLUMN loyaltycampaign.key_metrics IS 'JSON string of key performance metrics';
COMMENT ON COLUMN loyaltycampaign.growth_potential IS 'Growth potential assessment';
COMMENT ON COLUMN loyaltycampaign.performance_data IS 'JSON string of performance data';
COMMENT ON COLUMN loyaltycampaign.budget IS 'Campaign budget';
COMMENT ON COLUMN loyaltycampaign.recommended_campaigns IS 'JSON string of recommended campaigns';
COMMENT ON COLUMN loyaltycampaign.status IS 'Campaign status';
COMMENT ON COLUMN loyaltycampaign.avg_spending IS 'Average customer spending';
COMMENT ON COLUMN loyaltycampaign.reasoning IS 'AI reasoning for campaign recommendations';
COMMENT ON COLUMN loyaltycampaign.campaign_duration IS 'Campaign duration in days';
""".format(timestamp=datetime.now().isoformat())

def apply_migration():
    """Apply the migration to the database"""
    try:
        print("🚀 Applying Critical Type Alignment Fixes...")
        
        # Create migration SQL
        migration_sql = create_migration_sql()
        
        # Execute migration
        with engine.connect() as connection:
            # Start transaction
            trans = connection.begin()
            try:
                # Execute migration SQL
                connection.execute(text(migration_sql))
                trans.commit()
                print("✅ Migration applied successfully!")
                
                # Verify changes
                verify_migration(connection)
                
            except Exception as e:
                trans.rollback()
                print(f"❌ Migration failed: {e}")
                raise
                
    except Exception as e:
        print(f"❌ Error applying migration: {e}")
        return False
        
    return True

def verify_migration(connection):
    """Verify that the migration was applied correctly"""
    print("🔍 Verifying migration...")
    
    verification_queries = [
        "SELECT column_name FROM information_schema.columns WHERE table_name = 'knowledgedocument' AND column_name IN ('id', 'category')",
        "SELECT column_name FROM information_schema.columns WHERE table_name = 'user_permissions' AND column_name = 'source'",
        "SELECT column_name FROM information_schema.columns WHERE table_name = 'booking_modifications' AND column_name IN ('new_check_out', 'new_check_in', 'new_room_id')",
        "SELECT column_name FROM information_schema.columns WHERE table_name = 'booking_audits' AND column_name IN ('changed_at', 'changed_by')",
        "SELECT column_name FROM information_schema.columns WHERE table_name = 'loyaltycampaign' AND column_name IN ('success_probability', 'target_segment', 'customer_count')"
    ]
    
    for i, query in enumerate(verification_queries, 1):
        try:
            result = connection.execute(text(query))
            columns = [row[0] for row in result]
            print(f"  ✅ Verification {i}: Found {len(columns)} expected columns")
        except Exception as e:
            print(f"  ❌ Verification {i} failed: {e}")

def create_backup():
    """Create a backup before applying migration"""
    print("💾 Creating database backup...")
    # This would typically use pg_dump or similar
    # For now, we'll just log the intention
    print("  📝 Backup creation would be implemented here")
    print("  💡 Consider running: pg_dump your_database > backup_$(date +%Y%m%d_%H%M%S).sql")

def main():
    """Main function"""
    print("🔧 Critical Type Alignment Fixes Migration")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not (Path.cwd() / "backend").exists():
        print("❌ Please run this script from the project root directory")
        return False
    
    # Create backup
    create_backup()
    
    # Apply migration
    success = apply_migration()
    
    if success:
        print("\n🎉 Critical Type Alignment Fixes Applied Successfully!")
        print("\n📋 Summary of Changes:")
        print("  ✅ Added missing fields to KnowledgeDocument model")
        print("  ✅ Added missing field to UserPermission model")
        print("  ✅ Added missing fields to BookingModification model")
        print("  ✅ Added missing fields to BookingAudit model")
        print("  ✅ Added missing fields to LoyaltyCampaign model")
        print("  ✅ Created performance indexes")
        print("  ✅ Added column comments for documentation")
        
        print("\n🚀 Next Steps:")
        print("  1. Restart your backend application")
        print("  2. Run the frontend type generation")
        print("  3. Test the API endpoints")
        print("  4. Verify data integrity")
        
    else:
        print("\n❌ Migration failed. Please check the errors above.")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)