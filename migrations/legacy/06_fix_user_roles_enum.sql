-- =============================================================================
-- FIX USER ROLES ENUM - CRITICAL ISSUE RESOLUTION
-- =============================================================================
-- This migration fixes the missing user roles (property_owner, customer)
-- that are expected by the application but missing from the database enum

-- First, let's check what roles are currently in the enum
-- The current enum has: 'individual', 'sme_user', 'enterprise_user', 'admin', 'system_user'
-- But the application expects: 'admin', 'property_owner', 'customer', 'guest'

-- Step 1: Create a new enum with the correct roles
DO $$ BEGIN
    -- Drop the old enum if it exists
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        -- First, we need to update any existing columns that use this enum
        -- We'll handle this by altering the columns to use the new enum
        ALTER TABLE users ALTER COLUMN role TYPE TEXT;
        DROP TYPE user_role;
    END IF;
    
    -- Create the new enum with the correct roles
    CREATE TYPE user_role AS ENUM (
        'admin',
        'property_owner', 
        'customer',
        'guest'
    );
END $$;

-- Step 2: Update the users table to use the new enum
ALTER TABLE users ALTER COLUMN role TYPE user_role USING role::user_role;

-- Step 3: Add any missing columns that might be needed
ALTER TABLE users ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(100) DEFAULT 'default-tenant';
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;

-- Step 4: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Step 5: Add constraints to ensure data integrity
ALTER TABLE users ADD CONSTRAINT chk_user_role_valid 
    CHECK (role IN ('admin', 'property_owner', 'customer', 'guest'));

-- Step 6: Update any existing data to use valid roles
-- Map old roles to new roles
UPDATE users SET role = 'admin' WHERE role::text IN ('admin', 'system_user');
UPDATE users SET role = 'property_owner' WHERE role::text IN ('sme_user', 'enterprise_user');
UPDATE users SET role = 'customer' WHERE role::text = 'individual';

-- Step 7: Create a function to validate user roles
CREATE OR REPLACE FUNCTION validate_user_role(role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN role_name IN ('admin', 'property_owner', 'customer', 'guest');
END;
$$ LANGUAGE plpgsql;

-- Step 8: Add a trigger to ensure role validation
CREATE OR REPLACE FUNCTION check_user_role()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT validate_user_role(NEW.role::text) THEN
        RAISE EXCEPTION 'Invalid user role: %', NEW.role;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for role validation
DROP TRIGGER IF EXISTS trigger_check_user_role ON users;
CREATE TRIGGER trigger_check_user_role
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION check_user_role();

-- Step 9: Insert default admin user if it doesn't exist
INSERT INTO users (id, email, role, status, tenant_id, is_verified)
SELECT 
    gen_random_uuid(),
    'admin@buffr.ai',
    'admin',
    'active',
    'default-tenant',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@buffr.ai'
);

-- Step 10: Create a view for easy role-based queries
CREATE OR REPLACE VIEW user_roles_summary AS
SELECT 
    role,
    COUNT(*) as user_count,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
    COUNT(CASE WHEN is_verified = true THEN 1 END) as verified_users
FROM users
GROUP BY role
ORDER BY role;

-- Step 11: Add comments for documentation
COMMENT ON TYPE user_role IS 'User roles for Buffr Host application: admin, property_owner, customer, guest';
COMMENT ON TABLE users IS 'Users table with fixed role enum supporting all application roles';
COMMENT ON FUNCTION validate_user_role(TEXT) IS 'Validates that a role is one of the supported application roles';
COMMENT ON VIEW user_roles_summary IS 'Summary view of users by role for monitoring and analytics';

-- Step 12: Grant necessary permissions
GRANT SELECT ON user_roles_summary TO PUBLIC;
GRANT EXECUTE ON FUNCTION validate_user_role(TEXT) TO PUBLIC;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================
-- Run these queries to verify the fix worked:

-- Check that the enum has the correct values
-- SELECT unnest(enum_range(NULL::user_role)) as role_values;

-- Check that all users have valid roles
-- SELECT role, COUNT(*) FROM users GROUP BY role;

-- Check the user roles summary
-- SELECT * FROM user_roles_summary;

-- Test the validation function
-- SELECT validate_user_role('admin') as is_admin_valid;
-- SELECT validate_user_role('invalid_role') as is_invalid_valid;
