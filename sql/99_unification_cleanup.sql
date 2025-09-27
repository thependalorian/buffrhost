-- Unification Cleanup for the-shandi
-- This script removes tables and types that are now handled by the shared unified schema.

-- Drop tables from customer.py models
DROP TABLE IF EXISTS "KYCKYBDocument" CASCADE;
DROP TABLE IF EXISTS "CustomerPreferences" CASCADE;
DROP TABLE IF EXISTS "CorporateCustomer" CASCADE;
DROP TABLE IF EXISTS "Customer" CASCADE;

-- Drop tables from user.py models
DROP TABLE IF EXISTS "BuffrHostUser" CASCADE;
DROP TYPE IF EXISTS user_status_enum;
DROP TYPE IF EXISTS user_role_enum;
