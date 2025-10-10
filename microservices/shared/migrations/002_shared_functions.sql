-- Shared Functions
-- Common functions used across multiple microservices

-- Function to generate unique codes
CREATE OR REPLACE FUNCTION generate_unique_code(prefix TEXT, length INTEGER DEFAULT 8)
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_count INTEGER;
BEGIN
    LOOP
        code := prefix || '-' || upper(substring(md5(random()::text) from 1 for length));
        
        -- Check if code already exists (this is a simplified check)
        -- In practice, you'd check against the specific table
        exists_count := 0;
        
        IF exists_count = 0 THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION create_audit_log(
    p_user_id UUID,
    p_event_type audit_event_type,
    p_table_name TEXT,
    p_record_id UUID,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    audit_id UUID;
BEGIN
    audit_id := uuid_generate_v4();
    
    INSERT INTO audit_logs (
        id,
        user_id,
        event_type,
        table_name,
        record_id,
        old_values,
        new_values,
        metadata,
        created_at
    ) VALUES (
        audit_id,
        p_user_id,
        p_event_type,
        p_table_name,
        p_record_id,
        p_old_values,
        p_new_values,
        p_metadata,
        NOW()
    );
    
    RETURN audit_id;
END;
$$ LANGUAGE plpgsql;

-- Function to validate email format
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- Function to validate phone format
CREATE OR REPLACE FUNCTION is_valid_phone(phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN phone ~* '^\+?[1-9]\d{1,14}$';
END;
$$ LANGUAGE plpgsql;

-- Function to calculate distance between coordinates
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DECIMAL,
    lon1 DECIMAL,
    lat2 DECIMAL,
    lon2 DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
    earth_radius DECIMAL := 6371; -- Earth's radius in kilometers
    dlat DECIMAL;
    dlon DECIMAL;
    a DECIMAL;
    c DECIMAL;
BEGIN
    dlat := radians(lat2 - lat1);
    dlon := radians(lon2 - lon1);
    
    a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    
    RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql;

-- Function to format currency
CREATE OR REPLACE FUNCTION format_currency(
    amount DECIMAL,
    currency currency_code DEFAULT 'USD'
)
RETURNS TEXT AS $$
BEGIN
    CASE currency
        WHEN 'USD' THEN RETURN '$' || to_char(amount, 'FM999,999,999.00');
        WHEN 'EUR' THEN RETURN '€' || to_char(amount, 'FM999,999,999.00');
        WHEN 'GBP' THEN RETURN '£' || to_char(amount, 'FM999,999,999.00');
        WHEN 'NAD' THEN RETURN 'N$' || to_char(amount, 'FM999,999,999.00');
        WHEN 'ZAR' THEN RETURN 'R' || to_char(amount, 'FM999,999,999.00');
        WHEN 'BWP' THEN RETURN 'P' || to_char(amount, 'FM999,999,999.00');
        ELSE RETURN currency || ' ' || to_char(amount, 'FM999,999,999.00');
    END CASE;
END;
$$ LANGUAGE plpgsql;