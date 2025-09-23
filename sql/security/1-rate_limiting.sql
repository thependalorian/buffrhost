-- Rate Limiting and Throttling System
-- Comprehensive rate limiting for API and user actions

-- Rate limiting rules table
CREATE TABLE RateLimitingRules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name VARCHAR(255) NOT NULL UNIQUE,
    rule_type VARCHAR(50) NOT NULL CHECK (rule_type IN ('api', 'user_action', 'booking', 'order', 'payment', 'login_attempt', 'ai_query')),
    resource VARCHAR(255) NOT NULL,
    limit_count INTEGER NOT NULL CHECK (limit_count > 0),
    time_window_minutes INTEGER NOT NULL CHECK (time_window_minutes > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rate limiting violations table
CREATE TABLE RateLimitingViolations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    ip_address INET,
    rule_id UUID NOT NULL REFERENCES RateLimitingRules(id) ON DELETE CASCADE,
    violation_count INTEGER NOT NULL DEFAULT 1,
    first_violation_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_violation_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    block_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rate limiting counters table (for real-time tracking)
CREATE TABLE RateLimitingCounters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    ip_address INET,
    rule_id UUID NOT NULL REFERENCES RateLimitingRules(id) ON DELETE CASCADE,
    counter_value INTEGER NOT NULL DEFAULT 0,
    window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    window_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, ip_address, rule_id, window_start)
);

-- Rate limiting functions
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_user_id TEXT,
    p_ip_address INET,
    p_rule_name VARCHAR(255)
) RETURNS BOOLEAN AS $$
DECLARE
    rule_record RECORD;
    current_count INTEGER;
    window_start TIMESTAMP WITH TIME ZONE;
    window_end TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get the rate limiting rule
    SELECT * INTO rule_record
    FROM RateLimitingRules
    WHERE rule_name = p_rule_name AND is_active = TRUE;
    
    IF NOT FOUND THEN
        RETURN TRUE; -- No rule found, allow request
    END IF;
    
    -- Calculate time window
    window_start := date_trunc('minute', NOW()) - INTERVAL '1 minute' * (rule_record.time_window_minutes - 1);
    window_end := NOW();
    
    -- Get current count for this window
    SELECT COALESCE(counter_value, 0) INTO current_count
    FROM RateLimitingCounters
    WHERE user_id = p_user_id 
      AND ip_address = p_ip_address
      AND rule_id = rule_record.id
      AND window_start = window_start;
    
    -- Check if limit exceeded
    IF current_count >= rule_record.limit_count THEN
        -- Record violation
        INSERT INTO RateLimitingViolations (user_id, ip_address, rule_id, violation_count)
        VALUES (p_user_id, p_ip_address, rule_record.id, 1)
        ON CONFLICT (user_id, ip_address, rule_id) 
        DO UPDATE SET 
            violation_count = RateLimitingViolations.violation_count + 1,
            last_violation_at = NOW();
        
        RETURN FALSE; -- Rate limit exceeded
    END IF;
    
    -- Increment counter
    INSERT INTO RateLimitingCounters (user_id, ip_address, rule_id, counter_value, window_start, window_end)
    VALUES (p_user_id, p_ip_address, rule_record.id, 1, window_start, window_end)
    ON CONFLICT (user_id, ip_address, rule_id, window_start)
    DO UPDATE SET 
        counter_value = RateLimitingCounters.counter_value + 1,
        updated_at = NOW();
    
    RETURN TRUE; -- Request allowed
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old rate limiting data
CREATE OR REPLACE FUNCTION cleanup_rate_limiting_data()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Clean up old counters (older than 24 hours)
    DELETE FROM RateLimitingCounters 
    WHERE created_at < NOW() - INTERVAL '24 hours';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Clean up old violations (older than 30 days)
    DELETE FROM RateLimitingViolations 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Insert default rate limiting rules
INSERT INTO RateLimitingRules (rule_name, rule_type, resource, limit_count, time_window_minutes, description) VALUES
('api_general', 'api', 'general_api', 1000, 60, 'General API rate limit'),
('user_login', 'login_attempt', 'user_login', 5, 15, 'User login attempts'),
('booking_creation', 'booking', 'booking_creation', 10, 60, 'Booking creation rate limit'),
('order_creation', 'order', 'order_creation', 50, 60, 'Order creation rate limit'),
('payment_processing', 'payment', 'payment_processing', 20, 60, 'Payment processing rate limit'),
('ai_query', 'ai_query', 'ai_queries', 100, 60, 'AI query rate limit');

-- Create indexes for performance
CREATE INDEX idx_rate_limiting_violations_user ON RateLimitingViolations(user_id);
CREATE INDEX idx_rate_limiting_violations_ip ON RateLimitingViolations(ip_address);
CREATE INDEX idx_rate_limiting_violations_rule ON RateLimitingViolations(rule_id);
CREATE INDEX idx_rate_limiting_counters_user ON RateLimitingCounters(user_id);
CREATE INDEX idx_rate_limiting_counters_ip ON RateLimitingCounters(ip_address);
CREATE INDEX idx_rate_limiting_counters_rule ON RateLimitingCounters(rule_id);
CREATE INDEX idx_rate_limiting_counters_window ON RateLimitingCounters(window_start, window_end);

-- Enable RLS
ALTER TABLE RateLimitingRules ENABLE ROW LEVEL SECURITY;
ALTER TABLE RateLimitingViolations ENABLE ROW LEVEL SECURITY;
ALTER TABLE RateLimitingCounters ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow authenticated users to view rate limiting rules"
  ON RateLimitingRules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow system to manage rate limiting data"
  ON RateLimitingViolations
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow system to manage rate limiting counters"
  ON RateLimitingCounters
  FOR ALL
  TO authenticated
  USING (true);
