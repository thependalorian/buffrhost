-- =====================================================
-- Master Migration Runner
-- Buffr Host Platform - Complete Database Setup
-- =====================================================

-- This script runs all migrations in the correct order
-- Execute this file to set up the complete database

-- =====================================================
-- 1. CORE DATABASE SETUP
-- =====================================================
\echo 'Running core database setup...'
\i 005_complete_database_setup.sql

-- =====================================================
-- 2. HOTEL CONFIGURATION TABLES
-- =====================================================
\echo 'Running hotel configuration tables...'
\i 001_hotel_configuration_tables.sql

-- =====================================================
-- 3. HOTEL CONFIGURATION DATA
-- =====================================================
\echo 'Running hotel configuration data...'
\i 002_hotel_configuration_data.sql

-- =====================================================
-- 4. ML/AI SYSTEM TABLES
-- =====================================================
\echo 'Running ML/AI system tables...'
\i 003_ml_ai_tables.sql

-- =====================================================
-- 5. TENANT ONBOARDING TABLES
-- =====================================================
\echo 'Running tenant onboarding tables...'
\i 004_tenant_onboarding_tables.sql

-- =====================================================
-- 6. FINAL VERIFICATION
-- =====================================================
\echo 'Running final verification...'

-- Check table counts
SELECT 'Database Setup Complete!' as status;

-- Show all tables
SELECT 
    'Tables Created: ' || COUNT(*) as summary
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Show RLS enabled tables
SELECT 
    'RLS Enabled Tables: ' || COUNT(*) as summary
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;

-- Show indexes created
SELECT 
    'Indexes Created: ' || COUNT(*) as summary
FROM pg_indexes 
WHERE schemaname = 'public';

\echo 'Migration completed successfully!'
\echo 'Database is ready for Buffr Host Platform'