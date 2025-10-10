-- Shared Triggers
-- Common triggers used across multiple microservices

-- Audit log table (if not exists)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    event_type audit_event_type NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    old_record JSONB;
    new_record JSONB;
    user_id UUID;
BEGIN
    -- Get current user ID (this would need to be passed from application)
    -- For now, we'll use a placeholder
    user_id := NULL; -- This should be set by the application
    
    -- Convert records to JSONB
    IF TG_OP = 'DELETE' THEN
        old_record := to_jsonb(OLD);
        new_record := NULL;
    ELSIF TG_OP = 'UPDATE' THEN
        old_record := to_jsonb(OLD);
        new_record := to_jsonb(NEW);
    ELSIF TG_OP = 'INSERT' THEN
        old_record := NULL;
        new_record := to_jsonb(NEW);
    END IF;
    
    -- Insert audit log
    INSERT INTO audit_logs (
        user_id,
        event_type,
        table_name,
        record_id,
        old_values,
        new_values,
        created_at
    ) VALUES (
        user_id,
        TG_OP::audit_event_type,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        old_record,
        new_record,
        NOW()
    );
    
    -- Return appropriate record
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create audit trigger for a table
CREATE OR REPLACE FUNCTION create_audit_trigger(table_name TEXT)
RETURNS VOID AS $$
DECLARE
    trigger_name TEXT;
BEGIN
    trigger_name := 'audit_' || table_name || '_trigger';
    
    EXECUTE format('
        DROP TRIGGER IF EXISTS %I ON %I;
        CREATE TRIGGER %I
            AFTER INSERT OR UPDATE OR DELETE ON %I
            FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
    ', trigger_name, table_name, trigger_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Soft delete function
CREATE OR REPLACE FUNCTION soft_delete_record()
RETURNS TRIGGER AS $$
BEGIN
    -- Set deleted_at timestamp instead of actually deleting
    NEW.deleted_at = NOW();
    NEW.is_active = FALSE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create soft delete trigger
CREATE OR REPLACE FUNCTION create_soft_delete_trigger(table_name TEXT)
RETURNS VOID AS $$
DECLARE
    trigger_name TEXT;
BEGIN
    trigger_name := 'soft_delete_' || table_name || '_trigger';
    
    EXECUTE format('
        DROP TRIGGER IF EXISTS %I ON %I;
        CREATE TRIGGER %I
            BEFORE DELETE ON %I
            FOR EACH ROW EXECUTE FUNCTION soft_delete_record();
    ', trigger_name, table_name, trigger_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Function to add standard columns to existing tables
CREATE OR REPLACE FUNCTION add_standard_columns(table_name TEXT)
RETURNS VOID AS $$
BEGIN
    -- Add created_at if not exists
    EXECUTE format('
        ALTER TABLE %I ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    ', table_name);
    
    -- Add updated_at if not exists
    EXECUTE format('
        ALTER TABLE %I ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    ', table_name);
    
    -- Add is_active if not exists
    EXECUTE format('
        ALTER TABLE %I ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    ', table_name);
    
    -- Add deleted_at if not exists
    EXECUTE format('
        ALTER TABLE %I ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
    ', table_name);
    
    -- Create updated_at trigger
    EXECUTE format('
        DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
        CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    ', table_name, table_name, table_name, table_name);
END;
$$ LANGUAGE plpgsql;