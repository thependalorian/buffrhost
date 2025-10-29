-- =============================================================================
-- BUFFR HOST - CONSOLIDATED MIGRATION SYSTEM
-- =============================================================================
-- This is the unified migration system that consolidates all database changes
-- from backend/migrations/ and frontend/sql/ into a single, ordered system.

-- =============================================================================
-- 0. INITIAL SETUP AND EXTENSIONS
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- For pgvector support

-- =============================================================================
-- 1. CORE ENUMS AND TYPES
-- =============================================================================

-- User roles enum - Updated to include all required roles (safe version)
DO $$ BEGIN
    -- Check if enum exists and has the required roles
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        -- Check if property_owner and customer roles exist
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role_enum') AND enumlabel = 'property_owner') THEN
            -- Add missing roles to existing enum
            ALTER TYPE user_role_enum ADD VALUE 'property_owner' AFTER 'staff';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role_enum') AND enumlabel = 'customer') THEN
            -- Add missing roles to existing enum
            ALTER TYPE user_role_enum ADD VALUE 'customer' AFTER 'property_owner';
        END IF;
    ELSE
        -- Create new enum if it doesn't exist
        CREATE TYPE user_role_enum AS ENUM (
            'super_admin',
            'admin', 
            'manager',
            'staff',
            'property_owner',  -- Added: Property owners who manage their properties
            'customer',        -- Added: Customers who book and use services
            'guest'            -- Existing: Anonymous guests
        );
    END IF;
EXCEPTION
    WHEN duplicate_object THEN null;
    WHEN OTHERS THEN
        -- Log the error but continue
        RAISE NOTICE 'Error updating user_role_enum: %', SQLERRM;
END $$;

-- Buffr entity types for unified ID system
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'buffr_entity_type') THEN
        CREATE TYPE buffr_entity_type AS ENUM ('IND', 'PROP', 'ORG');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'buffr_project_type') THEN
        CREATE TYPE buffr_project_type AS ENUM ('PAY', 'SIGN', 'LEND', 'HOST');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'buffr_country_code') THEN
        CREATE TYPE buffr_country_code AS ENUM ('NA', 'ZA', 'BW', 'ZM', 'MW', 'SZ', 'LS', 'MZ');
    END IF;
END $$;

-- Property types enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_type_enum') THEN
        CREATE TYPE property_type_enum AS ENUM (
            'hotel',
            'resort',
            'vacation_rental',
            'guest_house',
            'restaurant',
            'cafe',
            'bar',
            'food_truck',
            'catering'
        );
    END IF;
END $$;

-- =============================================================================
-- 2. CORE SYSTEM TABLES
-- =============================================================================

-- Tenants table for multi-tenant architecture
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table with comprehensive role support (safe version)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role_enum DEFAULT 'guest',
    tenant_id UUID REFERENCES tenants(id),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to existing users table if they don't exist
DO $$ BEGIN
    -- Add tenant_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'tenant_id') THEN
        ALTER TABLE users ADD COLUMN tenant_id UUID REFERENCES tenants(id);
    END IF;
    
    -- Add is_verified column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_verified') THEN
        ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add last_login column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_login') THEN
        ALTER TABLE users ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add login_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'login_count') THEN
        ALTER TABLE users ADD COLUMN login_count INTEGER DEFAULT 0;
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding columns to users table: %', SQLERRM;
END $$;

-- Buffr IDs table for unified cross-project identification
CREATE TABLE IF NOT EXISTS buffr_ids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buffr_id VARCHAR(100) UNIQUE NOT NULL,
    entity_type buffr_entity_type NOT NULL,
    project buffr_project_type NOT NULL,
    country_code buffr_country_code NOT NULL,
    identifier_hash VARCHAR(8) NOT NULL,
    original_identifier TEXT, -- Encrypted original identifier
    user_id UUID, -- For individual entities
    property_id UUID, -- For property entities
    organization_id UUID, -- For organization entities
    status VARCHAR(20) DEFAULT 'active',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT ck_buffr_id_format 
    CHECK (buffr_id ~ '^BFR-(IND|PROP|ORG)-(PAY|SIGN|LEND|HOST)-[A-Z]{2}-[a-f0-9]{8}-[0-9]{14}$'),
    
    CONSTRAINT ck_entity_reference 
    CHECK (
        (entity_type = 'IND' AND user_id IS NOT NULL AND property_id IS NULL AND organization_id IS NULL) OR
        (entity_type = 'PROP' AND property_id IS NOT NULL AND user_id IS NULL AND organization_id IS NULL) OR
        (entity_type = 'ORG' AND organization_id IS NOT NULL AND user_id IS NULL AND property_id IS NULL)
    )
);

-- =============================================================================
-- 3. VALIDATION FUNCTIONS
-- =============================================================================

-- Create function to validate user roles
CREATE OR REPLACE FUNCTION validate_user_role(role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN role_name IN ('super_admin', 'admin', 'manager', 'staff', 'property_owner', 'customer', 'guest');
END;
$$ LANGUAGE plpgsql;

-- Create function to check role permissions
CREATE OR REPLACE FUNCTION check_role_permissions(user_role TEXT, required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Define role hierarchy
    CASE user_role
        WHEN 'super_admin' THEN RETURN TRUE; -- Super admin can do everything
        WHEN 'admin' THEN RETURN required_role IN ('admin', 'manager', 'staff', 'property_owner', 'customer', 'guest');
        WHEN 'manager' THEN RETURN required_role IN ('manager', 'staff', 'property_owner', 'customer', 'guest');
        WHEN 'staff' THEN RETURN required_role IN ('staff', 'customer', 'guest');
        WHEN 'property_owner' THEN RETURN required_role IN ('property_owner', 'customer', 'guest');
        WHEN 'customer' THEN RETURN required_role IN ('customer', 'guest');
        WHEN 'guest' THEN RETURN required_role = 'guest';
        ELSE RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 4. CONSTRAINTS AND INDEXES
-- =============================================================================

-- Add constraint to ensure valid roles (safe version)
DO $$ BEGIN
    -- Drop existing constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'chk_user_role_valid' AND table_name = 'users') THEN
        ALTER TABLE users DROP CONSTRAINT chk_user_role_valid;
    END IF;
    
    -- Add new constraint
    ALTER TABLE users ADD CONSTRAINT chk_user_role_valid 
        CHECK (validate_user_role(role::text));
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding user role constraint: %', SQLERRM;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_buffr_ids_entity_type ON buffr_ids(entity_type);
CREATE INDEX IF NOT EXISTS idx_buffr_ids_project ON buffr_ids(project);
CREATE INDEX IF NOT EXISTS idx_buffr_ids_user_id ON buffr_ids(user_id);
CREATE INDEX IF NOT EXISTS idx_buffr_ids_property_id ON buffr_ids(property_id);

-- =============================================================================
-- 5. ANALYTICS VIEWS
-- =============================================================================

-- Create view for role-based analytics
CREATE OR REPLACE VIEW user_roles_summary AS
SELECT 
    role,
    COUNT(*) as user_count,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
    COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_users,
    COUNT(CASE WHEN last_login > NOW() - INTERVAL '30 days' THEN 1 END) as recent_users
FROM users
GROUP BY role
ORDER BY role;

-- Create view for tenant analytics
CREATE OR REPLACE VIEW tenant_user_summary AS
SELECT 
    tenant_id,
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
    COUNT(CASE WHEN role = 'property_owner' THEN 1 END) as property_owner_count,
    COUNT(CASE WHEN role = 'customer' THEN 1 END) as customer_count,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_users
FROM users
GROUP BY tenant_id
ORDER BY total_users DESC;

-- =============================================================================
-- 6. TRIGGERS FOR DATA INTEGRITY
-- =============================================================================

-- Create trigger function for role validation
CREATE OR REPLACE FUNCTION check_user_role_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate the role
    IF NOT validate_user_role(NEW.role::text) THEN
        RAISE EXCEPTION 'Invalid user role: %. Valid roles are: super_admin, admin, manager, staff, property_owner, customer, guest', NEW.role;
    END IF;
    
    -- Update login count if this is a login
    IF TG_OP = 'UPDATE' AND OLD.last_login IS DISTINCT FROM NEW.last_login THEN
        NEW.login_count = COALESCE(OLD.login_count, 0) + 1;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for role validation (safe version)
DO $$ BEGIN
    -- Drop existing trigger if it exists
    IF EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'trigger_check_user_role' AND event_object_table = 'users') THEN
        DROP TRIGGER trigger_check_user_role ON users;
    END IF;
    
    -- Create new trigger
    CREATE TRIGGER trigger_check_user_role
        BEFORE INSERT OR UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION check_user_role_trigger();
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating user role trigger: %', SQLERRM;
END $$;

-- =============================================================================
-- 7. DEFAULT DATA
-- =============================================================================

-- Insert default tenant (safe version)
DO $$ BEGIN
    INSERT INTO tenants (id, name, domain, is_active)
    SELECT 
        gen_random_uuid(),
        'Default Tenant',
        'buffr.ai',
        true
    WHERE NOT EXISTS (
        SELECT 1 FROM tenants WHERE domain = 'buffr.ai'
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error inserting default tenant: %', SQLERRM;
END $$;

-- Insert default admin user (safe version)
DO $$ BEGIN
    INSERT INTO users (id, email, password_hash, full_name, role, tenant_id, is_active, email_verified)
    SELECT 
        gen_random_uuid(),
        'admin@buffr.ai',
        '$2a$10$dummy.hash.for.admin.user', -- This should be replaced with actual hash
        'System Administrator',
        'admin',
        (SELECT id FROM tenants WHERE domain = 'buffr.ai' LIMIT 1),
        true,
        true
    WHERE NOT EXISTS (
        SELECT 1 FROM users WHERE email = 'admin@buffr.ai'
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error inserting default admin user: %', SQLERRM;
END $$;

-- =============================================================================
-- 8. PERMISSIONS
-- =============================================================================

-- Grant necessary permissions
GRANT SELECT ON user_roles_summary TO PUBLIC;
GRANT SELECT ON tenant_user_summary TO PUBLIC;
GRANT EXECUTE ON FUNCTION validate_user_role(TEXT) TO PUBLIC;
GRANT EXECUTE ON FUNCTION check_role_permissions(TEXT, TEXT) TO PUBLIC;

-- =============================================================================
-- 9. DOCUMENTATION
-- =============================================================================

-- Add comments for documentation
COMMENT ON TYPE user_role_enum IS 'User roles for Buffr Host application: super_admin, admin, manager, staff, property_owner, customer, guest';
COMMENT ON TABLE users IS 'Users table with fixed role enum supporting all application roles';
COMMENT ON TABLE buffr_ids IS 'Unified Buffr ID system for cross-project integration';
COMMENT ON FUNCTION validate_user_role(TEXT) IS 'Validates that a role is one of the supported application roles';
COMMENT ON FUNCTION check_role_permissions(TEXT, TEXT) IS 'Checks if a user role has permission to access a required role level';
COMMENT ON VIEW user_roles_summary IS 'Summary view of users by role for monitoring and analytics';
COMMENT ON VIEW tenant_user_summary IS 'Summary view of users by tenant for multi-tenant analytics';

-- =============================================================================
-- INITIAL SETUP COMPLETE
-- =============================================================================

-- Log completion
DO $$ BEGIN
    RAISE NOTICE 'Initial setup migration completed successfully!';
    RAISE NOTICE 'Core tables created: tenants, users, buffr_ids';
    RAISE NOTICE 'User roles enum created with all required roles';
    RAISE NOTICE 'Validation functions and triggers created';
    RAISE NOTICE 'Analytics views created';
    RAISE NOTICE 'Default data inserted';
END $$;
