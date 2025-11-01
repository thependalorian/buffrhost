#!/bin/bash

# BUFFR HOST - Complete Migration Execution Script
# This script runs all database migrations in the correct order

echo "🏨 BUFFR HOST - COMPLETE DATABASE MIGRATION EXECUTION"
echo "=================================================="
echo ""

# Load environment variables if .env exists
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Set default DATABASE_URL if not set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL not set. Please check your .env file."
    exit 1
fi

echo "📊 Database URL configured: ${DATABASE_URL:0:50}..."
echo ""

# Function to run a migration
run_migration() {
    local migration_name=$1
    local migration_file=$2

    echo "🔄 Running: $migration_name"
    echo "   File: $migration_file"

    if psql "$DATABASE_URL" -f "$migration_file"; then
        echo "✅ SUCCESS: $migration_name completed"
        echo ""
    else
        echo "❌ FAILED: $migration_name failed"
        echo "   Check the error messages above"
        exit 1
    fi
}

# Phase 1: Core Business Tables
echo "📅 PHASE 1: Core Business Tables"
echo "-------------------------------"

run_migration "Staff Tables Migration" "migrations/consolidated/001_create_staff_tables.sql"
run_migration "CRM Tables Migration" "migrations/consolidated/002_create_crm_tables.sql"

# Phase 2: Analytics & Intelligence
echo "📈 PHASE 2: Analytics & Intelligence"
echo "-----------------------------------"

run_migration "Analytics Tables Migration" "migrations/consolidated/003_create_analytics_tables.sql"
run_migration "Advanced Feature Tables Migration" "migrations/consolidated/004_create_advanced_feature_tables.sql"

# Phase 3: ML Enhancements
echo "🤖 PHASE 3: ML Enhancements"
echo "---------------------------"

run_migration "ML CRM Tables Migration" "migrations/consolidated/05_ml_crm_tables.sql"
run_migration "ML Analytics Tables Migration" "migrations/consolidated/06_ml_analytics_tables.sql"
run_migration "ML Staff Tables Migration" "migrations/consolidated/07_ml_staff_tables.sql"

# Phase 4: CRM Customer Alterations
echo "🔧 PHASE 4: CRM Customer Enhancements"
echo "------------------------------------"

run_migration "CRM Customers ALTER TABLE" "alter-crm-customers.sql"

# Phase 5: Multi-Channel Communication
echo "📱 PHASE 5: Multi-Channel Communication"
echo "-------------------------------------"

run_migration "WhatsApp Multi-Channel Tables Migration" "migrations/consolidated/08_whatsapp_multichannel_tables.sql"

# Phase 6: Custom Communication Integration
echo "📱 PHASE 6: Custom Communication Integration"
echo "--------------------------------------------"

run_migration "Custom Communication Tables Migration" "migrations/consolidated/09_custom_communication_tables.sql"

# Phase 7: Final Verification
echo "🔍 PHASE 5: Migration Verification"
echo "----------------------------------"

echo "📊 Verifying all tables were created..."
psql "$DATABASE_URL" -c "
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'staff', 'staff_schedules', 'staff_activities', 'staff_performance',
    'crm_customers', 'guest_preferences', 'revenue_analytics',
    'guest_experience_metrics', 'sofia_agents', 'sofia_conversations',
    'whatsapp_conversations', 'message_attachments', 'communication_channels',
    'workflow_states', 'ai_memory_store', 'communication_router_logs',
    'multimodal_processing_logs', 'activity_schedules', 'communication_errors',
    'channel_performance_metrics', 'property_communication_auth', 'communication_logs',
    'automation_workflows', 'workflow_executions', 'communication_templates',
    'communication_usage'
)
ORDER BY table_name;
"

echo ""
echo "📈 Checking final table count..."
psql "$DATABASE_URL" -c "
SELECT
    COUNT(*) as total_tables_in_db,
    COUNT(CASE WHEN table_name IN (
        'staff', 'staff_schedules', 'staff_activities', 'staff_performance',
        'crm_customers', 'guest_preferences', 'revenue_analytics',
        'guest_experience_metrics', 'sofia_agents', 'sofia_conversations',
        'whatsapp_conversations', 'message_attachments', 'communication_channels',
        'workflow_states', 'ai_memory_store', 'communication_router_logs',
        'multimodal_processing_logs', 'activity_schedules', 'communication_errors',
        'channel_performance_metrics', 'property_communication_auth', 'communication_logs',
        'automation_workflows', 'workflow_executions', 'communication_templates',
        'communication_usage'
    ) THEN 1 END) as buffr_tables_created,
    ROUND(
        COUNT(CASE WHEN table_name IN (
            'staff', 'staff_schedules', 'staff_activities', 'staff_performance',
            'crm_customers', 'guest_preferences', 'revenue_analytics',
            'guest_experience_metrics', 'sofia_agents', 'sofia_conversations',
            'whatsapp_conversations', 'message_attachments', 'communication_channels',
            'workflow_states', 'ai_memory_store', 'communication_router_logs',
            'multimodal_processing_logs', 'activity_schedules', 'communication_errors',
            'channel_performance_metrics', 'property_communication_auth', 'communication_logs',
            'automation_workflows', 'workflow_executions', 'communication_templates',
            'communication_usage'
        ) THEN 1 END)::decimal / COUNT(*)::decimal * 100, 1
    ) as buffr_utilization_rate
FROM information_schema.tables
WHERE table_schema = 'public';
"

echo ""
echo "🎉 MIGRATION EXECUTION COMPLETED!"
echo "================================="
echo ""
echo "✅ Next Steps:"
echo "1. Run: npm run db:verify-seed-data"
echo "2. Run: npm run ml-demo.js (if not already done)"
echo "3. Test API endpoints: /api/ml/*, /api/whatsapp/*, and /api/communication/*"
echo "4. Verify CRM customer alterations worked"
echo "5. Set up WhatsApp Business API credentials"
echo "6. Configure multi-modal services (speech-to-text, text-to-speech, image processing)"
echo "7. Set up OAuth applications for Gmail, Outlook, Google Calendar, and Twilio"
echo "8. Configure property owner tool authorizations (Gmail, Calendar, etc.)"
echo "9. Test Sofia AI across all communication channels"
echo ""
echo "🚀 Buffr Host database is now fully configured for autonomous hospitality operations!"
echo "   Multi-channel communication + Custom automation tools ready for deployment!"
