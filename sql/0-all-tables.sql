-- Buffr Host Comprehensive Database Schema
-- Version 2.0 - Multi-Service Hospitality Operations Management
-- Supports restaurants, hotels, spas, conference facilities, transportation services, and all hospitality amenities

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Core Tables
\i sql/core/1-user_types.sql
\i sql/core/2-hospitality_properties.sql
\i sql/core/3-users.sql
\i sql/core/4-customers.sql

-- Hospitality Tables
\i sql/hospitality/1-menu_system.sql
\i sql/hospitality/2-room_management.sql
\i sql/hospitality/3-service_bookings.sql
\i sql/hospitality/4-orders.sql

-- Staff Management
\i sql/staff/1-staff_departments.sql
\i sql/staff/2-staff_profiles.sql
\i sql/staff/3-staff_scheduling.sql
\i sql/staff/4-staff_performance.sql

-- AI & Knowledge Base
\i sql/ai/1-knowledge_base.sql
\i sql/ai/2-ai_agents.sql
\i sql/ai/3-document_processing.sql
\i sql/ai/4-voice_capabilities.sql

-- Compliance & Financial
\i sql/compliance/1-kyc_kyb.sql
\i sql/compliance/2-corporate_customers.sql
\i sql/financial/1-loyalty_system.sql
\i sql/financial/2-invoicing.sql

-- Indexes and Performance
\i sql/indexes/1-core_indexes.sql
\i sql/indexes/2-hospitality_indexes.sql
\i sql/indexes/3-ai_indexes.sql

-- Functions and Procedures
\i sql/functions/1-utility_functions.sql
\i sql/functions/2-ai_functions.sql
\i sql/functions/3-loyalty_functions.sql

-- Row Level Security
\i sql/rls/1-core_rls.sql
\i sql/rls/2-hospitality_rls.sql
\i sql/rls/3-staff_rls.sql
\i sql/rls/4-ai_rls.sql

-- Security and Rate Limiting
\i sql/security/1-rate_limiting.sql
\i sql/security/2-security_policies.sql

-- Validation and Constraints
\i sql/validation/1-validation_constraints.sql

-- Database Enums and Types
\i sql/enums/1-database_enums.sql

-- Audit Logging
\i sql/audit/1-audit_logging.sql
\i sql/audit/2-page_component_audit.sql

-- Notifications and Email
\i sql/notifications/1-notification_system.sql
\i sql/email/1-sendgrid_integration.sql

-- Payment Integrations
\i sql/payments/1-payment_gateways.sql
\i sql/payments/2-realpay_integration.sql
\i sql/payments/3-adume_integration.sql
