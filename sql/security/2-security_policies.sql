-- Security Policies and Data Protection
-- Advanced security measures and data protection policies

-- Data encryption function
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT, key TEXT DEFAULT 'default_key')
RETURNS TEXT AS $$
BEGIN
    -- Simple encryption for demonstration (use proper encryption in production)
    RETURN encode(digest(data || key, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Data decryption function
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data TEXT, key TEXT DEFAULT 'default_key')
RETURNS TEXT AS $$
BEGIN
    -- This is a placeholder - implement proper decryption
    RETURN encrypted_data;
END;
$$ LANGUAGE plpgsql;

-- Function to mask sensitive data
CREATE OR REPLACE FUNCTION mask_sensitive_data(data TEXT, mask_char CHAR DEFAULT '*')
RETURNS TEXT AS $$
BEGIN
    IF LENGTH(data) <= 4 THEN
        RETURN REPEAT(mask_char, LENGTH(data));
    ELSE
        RETURN LEFT(data, 2) || REPEAT(mask_char, LENGTH(data) - 4) || RIGHT(data, 2);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION check_user_permission(
    p_user_id TEXT,
    p_permission TEXT,
    p_property_id INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
    user_permissions TEXT[];
BEGIN
    -- Get user role and permissions
    SELECT role, permissions INTO user_role, user_permissions
    FROM BuffrHostUser
    WHERE owner_id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user has the specific permission
    IF p_permission = ANY(user_permissions) THEN
        RETURN TRUE;
    END IF;
    
    -- Check role-based permissions
    CASE user_role
        WHEN 'admin' THEN
            RETURN TRUE;
        WHEN 'manager' THEN
            RETURN p_permission IN ('view_reports', 'manage_staff', 'manage_bookings', 'manage_orders');
        WHEN 'hospitality_staff' THEN
            RETURN p_permission IN ('view_bookings', 'manage_orders', 'view_customers');
        ELSE
            RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to check property access
CREATE OR REPLACE FUNCTION check_property_access(
    p_user_id TEXT,
    p_property_id INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    user_property_id INTEGER;
    user_role TEXT;
BEGIN
    -- Get user's property and role
    SELECT property_id, role INTO user_property_id, user_role
    FROM BuffrHostUser
    WHERE owner_id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Admin can access all properties
    IF user_role = 'admin' THEN
        RETURN TRUE;
    END IF;
    
    -- Check if user belongs to the property
    RETURN user_property_id = p_property_id;
END;
$$ LANGUAGE plpgsql;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_event_type TEXT,
    p_user_id TEXT,
    p_ip_address INET,
    p_description TEXT,
    p_severity TEXT DEFAULT 'info'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO AuditLog (table_name, record_id, operation, new_values, user_id, ip_address, created_at)
    VALUES ('security_events', gen_random_uuid()::TEXT, 'INSERT', 
            jsonb_build_object(
                'event_type', p_event_type,
                'description', p_description,
                'severity', p_severity
            ), p_user_id, p_ip_address, NOW());
END;
$$ LANGUAGE plpgsql;

-- Function to check for suspicious activity
CREATE OR REPLACE FUNCTION check_suspicious_activity(
    p_user_id TEXT,
    p_ip_address INET
)
RETURNS BOOLEAN AS $$
DECLARE
    recent_failures INTEGER;
    different_ips INTEGER;
    activity_count INTEGER;
BEGIN
    -- Check for recent failed login attempts
    SELECT COUNT(*) INTO recent_failures
    FROM AuditLog
    WHERE user_id = p_user_id
      AND operation = 'INSERT'
      AND new_values->>'event_type' = 'login_failed'
      AND created_at > NOW() - INTERVAL '1 hour';
    
    IF recent_failures >= 5 THEN
        RETURN TRUE;
    END IF;
    
    -- Check for multiple IP addresses
    SELECT COUNT(DISTINCT ip_address) INTO different_ips
    FROM AuditLog
    WHERE user_id = p_user_id
      AND created_at > NOW() - INTERVAL '24 hours';
    
    IF different_ips >= 3 THEN
        RETURN TRUE;
    END IF;
    
    -- Check for excessive activity
    SELECT COUNT(*) INTO activity_count
    FROM AuditLog
    WHERE user_id = p_user_id
      AND created_at > NOW() - INTERVAL '1 hour';
    
    IF activity_count >= 100 THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function to implement data retention policy
CREATE OR REPLACE FUNCTION apply_data_retention_policy()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Delete old audit logs (older than 7 years)
    DELETE FROM AuditLog 
    WHERE created_at < NOW() - INTERVAL '7 years';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Delete old rate limiting data (older than 1 year)
    DELETE FROM RateLimitingCounters 
    WHERE created_at < NOW() - INTERVAL '1 year';
    
    -- Delete old rate limiting violations (older than 2 years)
    DELETE FROM RateLimitingViolations 
    WHERE created_at < NOW() - INTERVAL '2 years';
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to anonymize old data
CREATE OR REPLACE FUNCTION anonymize_old_data()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER := 0;
BEGIN
    -- Anonymize old customer data (older than 5 years)
    UPDATE Customer 
    SET 
        first_name = 'ANONYMIZED',
        last_name = 'ANONYMIZED',
        email = 'anonymized@example.com',
        phone = '+264000000000',
        address = 'ANONYMIZED',
        national_id = 'ANONYMIZED',
        passport_number = 'ANONYMIZED'
    WHERE created_at < NOW() - INTERVAL '5 years'
      AND first_name != 'ANONYMIZED';
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to check data integrity
CREATE OR REPLACE FUNCTION check_data_integrity()
RETURNS TABLE (
    table_name TEXT,
    issue_type TEXT,
    issue_description TEXT,
    record_count INTEGER
) AS $$
BEGIN
    -- Check for orphaned records
    RETURN QUERY
    SELECT 
        'OrderItem'::TEXT,
        'orphaned_record'::TEXT,
        'OrderItem without valid Order'::TEXT,
        COUNT(*)::INTEGER
    FROM OrderItem oi
    LEFT JOIN "Order" o ON oi.order_id = o.order_id
    WHERE o.order_id IS NULL;
    
    -- Check for invalid foreign keys
    RETURN QUERY
    SELECT 
        'RoomReservation'::TEXT,
        'invalid_fk'::TEXT,
        'RoomReservation with invalid Customer'::TEXT,
        COUNT(*)::INTEGER
    FROM RoomReservation rr
    LEFT JOIN Customer c ON rr.customer_id = c.customer_id
    WHERE c.customer_id IS NULL;
    
    -- Check for data consistency issues
    RETURN QUERY
    SELECT 
        'CrossBusinessLoyalty'::TEXT,
        'data_inconsistency'::TEXT,
        'Total points not matching sum of earned points'::TEXT,
        COUNT(*)::INTEGER
    FROM CrossBusinessLoyalty cbl
    WHERE cbl.total_points != (
        COALESCE(cbl.points_earned_restaurant, 0) +
        COALESCE(cbl.points_earned_hotel, 0) +
        COALESCE(cbl.points_earned_spa, 0) +
        COALESCE(cbl.points_earned_conference, 0) +
        COALESCE(cbl.points_earned_transportation, 0) +
        COALESCE(cbl.points_earned_recreation, 0) +
        COALESCE(cbl.points_earned_specialized, 0)
    );
END;
$$ LANGUAGE plpgsql;

-- Create security event logging trigger
CREATE OR REPLACE FUNCTION security_event_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Log security events for sensitive operations
    IF TG_OP = 'DELETE' AND TG_TABLE_NAME IN ('Customer', 'CorporateCustomer', 'KYCKYBDocument') THEN
        PERFORM log_security_event(
            'sensitive_data_deleted',
            current_setting('app.current_user_id', true),
            inet_client_addr(),
            'Sensitive data deleted from ' || TG_TABLE_NAME,
            'high'
        );
    END IF;
    
    IF TG_OP = 'UPDATE' AND TG_TABLE_NAME = 'BuffrHostUser' AND OLD.password != NEW.password THEN
        PERFORM log_security_event(
            'password_changed',
            current_setting('app.current_user_id', true),
            inet_client_addr(),
            'User password changed',
            'medium'
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply security triggers to sensitive tables
CREATE TRIGGER security_audit_customer
    AFTER DELETE ON Customer
    FOR EACH ROW EXECUTE FUNCTION security_event_trigger();

CREATE TRIGGER security_audit_corporate_customer
    AFTER DELETE ON CorporateCustomer
    FOR EACH ROW EXECUTE FUNCTION security_event_trigger();

CREATE TRIGGER security_audit_kyc_document
    AFTER DELETE ON KYCKYBDocument
    FOR EACH ROW EXECUTE FUNCTION security_event_trigger();

CREATE TRIGGER security_audit_user_password
    AFTER UPDATE ON BuffrHostUser
    FOR EACH ROW 
    WHEN (OLD.password IS DISTINCT FROM NEW.password)
    EXECUTE FUNCTION security_event_trigger();

-- Create function to generate security report
CREATE OR REPLACE FUNCTION generate_security_report(
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
    metric_name TEXT,
    metric_value BIGINT,
    description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'total_security_events'::TEXT,
        COUNT(*)::BIGINT,
        'Total security events in period'::TEXT
    FROM AuditLog
    WHERE created_at BETWEEN p_start_date AND p_end_date
      AND new_values->>'event_type' LIKE '%security%';
    
    RETURN QUERY
    SELECT 
        'failed_login_attempts'::TEXT,
        COUNT(*)::BIGINT,
        'Failed login attempts in period'::TEXT
    FROM AuditLog
    WHERE created_at BETWEEN p_start_date AND p_end_date
      AND new_values->>'event_type' = 'login_failed';
    
    RETURN QUERY
    SELECT 
        'rate_limit_violations'::TEXT,
        COUNT(*)::BIGINT,
        'Rate limit violations in period'::TEXT
    FROM RateLimitingViolations
    WHERE created_at BETWEEN p_start_date AND p_end_date;
    
    RETURN QUERY
    SELECT 
        'suspicious_activities'::TEXT,
        COUNT(*)::BIGINT,
        'Suspicious activities detected'::TEXT
    FROM AuditLog
    WHERE created_at BETWEEN p_start_date AND p_end_date
      AND new_values->>'severity' = 'high';
END;
$$ LANGUAGE plpgsql;
