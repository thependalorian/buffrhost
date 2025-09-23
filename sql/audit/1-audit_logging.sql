-- Audit Logging System
-- Comprehensive audit trail for all database operations

-- Audit log table
CREATE TABLE AuditLog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(255) NOT NULL,
    record_id TEXT NOT NULL,
    operation VARCHAR(20) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE', 'SELECT')),
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    user_id TEXT,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    property_id INTEGER REFERENCES HospitalityProperty(property_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit configuration table
CREATE TABLE AuditConfig (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(255) NOT NULL UNIQUE,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    audit_insert BOOLEAN NOT NULL DEFAULT TRUE,
    audit_update BOOLEAN NOT NULL DEFAULT TRUE,
    audit_delete BOOLEAN NOT NULL DEFAULT TRUE,
    audit_select BOOLEAN NOT NULL DEFAULT FALSE,
    sensitive_fields TEXT[],
    excluded_fields TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to create audit trigger
CREATE OR REPLACE FUNCTION create_audit_trigger(table_name TEXT)
RETURNS VOID AS $$
DECLARE
    trigger_sql TEXT;
BEGIN
    -- Create trigger function for the table
    trigger_sql := '
    CREATE OR REPLACE FUNCTION audit_trigger_' || table_name || '()
    RETURNS TRIGGER AS $audit$
    BEGIN
        IF TG_OP = ''DELETE'' THEN
            INSERT INTO AuditLog (table_name, record_id, operation, old_values, user_id, ip_address, property_id)
            VALUES (''' || table_name || ''', OLD.id::TEXT, ''DELETE'', to_jsonb(OLD), 
                   current_setting(''app.current_user_id'', true),
                   inet_client_addr(),
                   COALESCE(OLD.property_id, NULL));
            RETURN OLD;
        ELSIF TG_OP = ''UPDATE'' THEN
            INSERT INTO AuditLog (table_name, record_id, operation, old_values, new_values, changed_fields, user_id, ip_address, property_id)
            VALUES (''' || table_name || ''', NEW.id::TEXT, ''UPDATE'', to_jsonb(OLD), to_jsonb(NEW),
                   (SELECT array_agg(key) FROM jsonb_each(to_jsonb(NEW)) WHERE to_jsonb(NEW)->>key != to_jsonb(OLD)->>key),
                   current_setting(''app.current_user_id'', true),
                   inet_client_addr(),
                   COALESCE(NEW.property_id, NULL));
            RETURN NEW;
        ELSIF TG_OP = ''INSERT'' THEN
            INSERT INTO AuditLog (table_name, record_id, operation, new_values, user_id, ip_address, property_id)
            VALUES (''' || table_name || ''', NEW.id::TEXT, ''INSERT'', to_jsonb(NEW),
                   current_setting(''app.current_user_id'', true),
                   inet_client_addr(),
                   COALESCE(NEW.property_id, NULL));
            RETURN NEW;
        END IF;
        RETURN NULL;
    END;
    $audit$ LANGUAGE plpgsql;';
    
    EXECUTE trigger_sql;
    
    -- Create the trigger
    EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_' || table_name || ' ON ' || table_name || ';';
    EXECUTE 'CREATE TRIGGER audit_trigger_' || table_name || '
        AFTER INSERT OR UPDATE OR DELETE ON ' || table_name || '
        FOR EACH ROW EXECUTE FUNCTION audit_trigger_' || table_name || '();';
END;
$$ LANGUAGE plpgsql;

-- Function to enable audit for a table
CREATE OR REPLACE FUNCTION enable_audit_for_table(
    p_table_name TEXT,
    p_audit_insert BOOLEAN DEFAULT TRUE,
    p_audit_update BOOLEAN DEFAULT TRUE,
    p_audit_delete BOOLEAN DEFAULT TRUE,
    p_audit_select BOOLEAN DEFAULT FALSE,
    p_sensitive_fields TEXT[] DEFAULT NULL,
    p_excluded_fields TEXT[] DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Insert audit configuration
    INSERT INTO AuditConfig (table_name, is_enabled, audit_insert, audit_update, audit_delete, audit_select, sensitive_fields, excluded_fields)
    VALUES (p_table_name, TRUE, p_audit_insert, p_audit_update, p_audit_delete, p_audit_select, p_sensitive_fields, p_excluded_fields)
    ON CONFLICT (table_name) DO UPDATE SET
        is_enabled = TRUE,
        audit_insert = p_audit_insert,
        audit_update = p_audit_update,
        audit_delete = p_audit_delete,
        audit_select = p_audit_select,
        sensitive_fields = p_sensitive_fields,
        excluded_fields = p_excluded_fields;
    
    -- Create audit trigger
    PERFORM create_audit_trigger(p_table_name);
END;
$$ LANGUAGE plpgsql;

-- Function to disable audit for a table
CREATE OR REPLACE FUNCTION disable_audit_for_table(p_table_name TEXT)
RETURNS VOID AS $$
BEGIN
    -- Update audit configuration
    UPDATE AuditConfig SET is_enabled = FALSE WHERE table_name = p_table_name;
    
    -- Drop audit trigger
    EXECUTE 'DROP TRIGGER IF EXISTS audit_trigger_' || p_table_name || ' ON ' || p_table_name || ';';
    EXECUTE 'DROP FUNCTION IF EXISTS audit_trigger_' || p_table_name || '();';
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old audit logs
CREATE OR REPLACE FUNCTION cleanup_audit_logs(retention_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM AuditLog 
    WHERE created_at < NOW() - INTERVAL '1 day' * retention_days;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get audit trail for a record
CREATE OR REPLACE FUNCTION get_audit_trail(
    p_table_name TEXT,
    p_record_id TEXT,
    p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
    id UUID,
    operation VARCHAR(20),
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    user_id TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.id,
        al.operation,
        al.old_values,
        al.new_values,
        al.changed_fields,
        al.user_id,
        al.ip_address,
        al.created_at
    FROM AuditLog al
    WHERE al.table_name = p_table_name 
      AND al.record_id = p_record_id
    ORDER BY al.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get audit trail for a user
CREATE OR REPLACE FUNCTION get_user_audit_trail(
    p_user_id TEXT,
    p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
    id UUID,
    table_name VARCHAR(255),
    record_id TEXT,
    operation VARCHAR(20),
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.id,
        al.table_name,
        al.record_id,
        al.operation,
        al.old_values,
        al.new_values,
        al.changed_fields,
        al.ip_address,
        al.created_at
    FROM AuditLog al
    WHERE al.user_id = p_user_id
    ORDER BY al.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Enable audit for critical tables
SELECT enable_audit_for_table('BuffrHostUser', TRUE, TRUE, TRUE, FALSE, ARRAY['password'], NULL);
SELECT enable_audit_for_table('Customer', TRUE, TRUE, TRUE, FALSE, ARRAY['national_id', 'passport_number'], NULL);
SELECT enable_audit_for_table('CorporateCustomer', TRUE, TRUE, TRUE, FALSE, ARRAY['tax_id', 'business_registration_number'], NULL);
SELECT enable_audit_for_table('KYCKYBDocument', TRUE, TRUE, TRUE, FALSE, ARRAY['file_path'], NULL);
SELECT enable_audit_for_table('RoomReservation', TRUE, TRUE, TRUE, FALSE, NULL, NULL);
SELECT enable_audit_for_table('ServiceBooking', TRUE, TRUE, TRUE, FALSE, NULL, NULL);
SELECT enable_audit_for_table('"Order"', TRUE, TRUE, TRUE, FALSE, NULL, NULL);
SELECT enable_audit_for_table('PaymentTransaction', TRUE, TRUE, TRUE, FALSE, ARRAY['transaction_reference'], NULL);
SELECT enable_audit_for_table('StaffProfile', TRUE, TRUE, TRUE, FALSE, ARRAY['national_id', 'tax_id', 'bank_account'], NULL);
SELECT enable_audit_for_table('CrossBusinessLoyalty', TRUE, TRUE, TRUE, FALSE, NULL, NULL);
SELECT enable_audit_for_table('Invoice', TRUE, TRUE, TRUE, FALSE, NULL, NULL);
SELECT enable_audit_for_table('Quotation', TRUE, TRUE, TRUE, FALSE, NULL, NULL);

-- Create indexes for audit performance
CREATE INDEX idx_audit_log_table_record ON AuditLog(table_name, record_id);
CREATE INDEX idx_audit_log_user ON AuditLog(user_id);
CREATE INDEX idx_audit_log_operation ON AuditLog(operation);
CREATE INDEX idx_audit_log_created_at ON AuditLog(created_at);
CREATE INDEX idx_audit_log_property ON AuditLog(property_id);

-- Enable RLS on audit tables
ALTER TABLE AuditLog ENABLE ROW LEVEL SECURITY;
ALTER TABLE AuditConfig ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit tables
CREATE POLICY "Allow authenticated users to view audit logs"
  ON AuditLog
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow system to manage audit logs"
  ON AuditLog
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to view audit config"
  ON AuditConfig
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow system to manage audit config"
  ON AuditConfig
  FOR ALL
  TO authenticated
  USING (true);
