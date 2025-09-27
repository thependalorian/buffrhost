-- Password Reset System
-- Tables and functions for handling password reset requests and tokens
-- Integrates with Auth Service microservice

-- Password Reset Tokens Table
CREATE TABLE password_reset_tokens (
    token_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    
    -- Token Details
    reset_token VARCHAR(255) UNIQUE NOT NULL,
    token_hash VARCHAR(255) NOT NULL, -- Hashed version for security
    
    -- Token Status
    is_used BOOLEAN DEFAULT FALSE,
    is_expired BOOLEAN DEFAULT FALSE,
    
    -- Token Lifecycle
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    
    -- Security Details
    ip_address INET,
    user_agent TEXT,
    request_source VARCHAR(50) DEFAULT 'web', -- 'web', 'mobile', 'api'
    
    -- Additional Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Password Reset Attempts Table (for rate limiting and security)
CREATE TABLE password_reset_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    ip_address INET NOT NULL,
    
    -- Attempt Details
    attempt_type VARCHAR(50) NOT NULL, -- 'request', 'verify', 'reset'
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(255),
    
    -- Security Details
    user_agent TEXT,
    request_source VARCHAR(50) DEFAULT 'web',
    
    -- Timestamps
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Additional Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Password History Table (to prevent reuse of recent passwords)
CREATE TABLE password_history (
    history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Password Details
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(255) NOT NULL,
    
    -- Change Details
    changed_by UUID REFERENCES profiles(id), -- Who changed the password
    change_reason VARCHAR(50) DEFAULT 'user_request', -- 'user_request', 'admin_reset', 'password_reset'
    change_source VARCHAR(50) DEFAULT 'web', -- 'web', 'mobile', 'api'
    
    -- Timestamps
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Additional Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for Performance
CREATE INDEX idx_password_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(reset_token);
CREATE INDEX idx_password_reset_tokens_hash ON password_reset_tokens(token_hash);
CREATE INDEX idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);
CREATE INDEX idx_password_reset_tokens_used ON password_reset_tokens(is_used);
CREATE INDEX idx_password_reset_tokens_expired ON password_reset_tokens(is_expired);
CREATE INDEX idx_password_reset_tokens_created_at ON password_reset_tokens(created_at);

CREATE INDEX idx_password_reset_attempts_email ON password_reset_attempts(email);
CREATE INDEX idx_password_reset_attempts_ip ON password_reset_attempts(ip_address);
CREATE INDEX idx_password_reset_attempts_type ON password_reset_attempts(attempt_type);
CREATE INDEX idx_password_reset_attempts_success ON password_reset_attempts(success);
CREATE INDEX idx_password_reset_attempts_attempted_at ON password_reset_attempts(attempted_at);

CREATE INDEX idx_password_history_user ON password_history(user_id);
CREATE INDEX idx_password_history_changed_at ON password_history(changed_at);
CREATE INDEX idx_password_history_hash ON password_history(password_hash);

-- Functions for Password Reset Management

-- Function to generate secure reset token
CREATE OR REPLACE FUNCTION generate_password_reset_token()
RETURNS VARCHAR(255) AS $$
BEGIN
    RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Function to create password reset token
CREATE OR REPLACE FUNCTION create_password_reset_token(
    p_user_id UUID,
    p_email VARCHAR(255),
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_request_source VARCHAR(50) DEFAULT 'web'
)
RETURNS VARCHAR(255) AS $$
DECLARE
    v_token VARCHAR(255);
    v_token_hash VARCHAR(255);
    v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Generate secure token
    v_token := generate_password_reset_token();
    v_token_hash := encode(digest(v_token, 'sha256'), 'hex');
    
    -- Set expiration (24 hours from now)
    v_expires_at := NOW() + INTERVAL '24 hours';
    
    -- Invalidate any existing tokens for this user
    UPDATE password_reset_tokens 
    SET is_expired = TRUE, updated_at = NOW()
    WHERE user_id = p_user_id AND is_used = FALSE AND is_expired = FALSE;
    
    -- Insert new token
    INSERT INTO password_reset_tokens (
        user_id, email, reset_token, token_hash, expires_at,
        ip_address, user_agent, request_source
    ) VALUES (
        p_user_id, p_email, v_token, v_token_hash, v_expires_at,
        p_ip_address, p_user_agent, p_request_source
    );
    
    -- Log the attempt
    INSERT INTO password_reset_attempts (
        email, ip_address, attempt_type, success, user_agent, request_source
    ) VALUES (
        p_email, p_ip_address, 'request', TRUE, p_user_agent, p_request_source
    );
    
    RETURN v_token;
END;
$$ LANGUAGE plpgsql;

-- Function to verify password reset token
CREATE OR REPLACE FUNCTION verify_password_reset_token(
    p_token VARCHAR(255),
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS TABLE(
    is_valid BOOLEAN,
    user_id UUID,
    email VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_token_hash VARCHAR(255);
    v_record RECORD;
BEGIN
    -- Hash the provided token
    v_token_hash := encode(digest(p_token, 'sha256'), 'hex');
    
    -- Find the token record
    SELECT prt.user_id, prt.email, prt.expires_at, prt.is_used, prt.is_expired
    INTO v_record
    FROM password_reset_tokens prt
    WHERE prt.token_hash = v_token_hash;
    
    -- Check if token exists and is valid
    IF v_record IS NULL THEN
        -- Log failed attempt
        INSERT INTO password_reset_attempts (
            email, ip_address, attempt_type, success, failure_reason, user_agent
        ) VALUES (
            '', p_ip_address, 'verify', FALSE, 'token_not_found', p_user_agent
        );
        
        RETURN QUERY SELECT FALSE, NULL::UUID, ''::VARCHAR(255), NULL::TIMESTAMP WITH TIME ZONE;
        RETURN;
    END IF;
    
    -- Check if token is used or expired
    IF v_record.is_used OR v_record.is_expired OR v_record.expires_at < NOW() THEN
        -- Log failed attempt
        INSERT INTO password_reset_attempts (
            email, ip_address, attempt_type, success, failure_reason, user_agent
        ) VALUES (
            v_record.email, p_ip_address, 'verify', FALSE, 'token_invalid', p_user_agent
        );
        
        RETURN QUERY SELECT FALSE, v_record.user_id, v_record.email, v_record.expires_at;
        RETURN;
    END IF;
    
    -- Token is valid
    RETURN QUERY SELECT TRUE, v_record.user_id, v_record.email, v_record.expires_at;
END;
$$ LANGUAGE plpgsql;

-- Function to use password reset token
CREATE OR REPLACE FUNCTION use_password_reset_token(
    p_token VARCHAR(255),
    p_new_password_hash VARCHAR(255),
    p_new_password_salt VARCHAR(255),
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_token_hash VARCHAR(255);
    v_user_id UUID;
    v_email VARCHAR(255);
    v_record RECORD;
BEGIN
    -- Hash the provided token
    v_token_hash := encode(digest(p_token, 'sha256'), 'hex');
    
    -- Verify token and get user info
    SELECT is_valid, user_id, email INTO v_record
    FROM verify_password_reset_token(p_token, p_ip_address, p_user_agent);
    
    IF NOT v_record.is_valid THEN
        RETURN FALSE;
    END IF;
    
    v_user_id := v_record.user_id;
    v_email := v_record.email;
    
    -- Mark token as used
    UPDATE password_reset_tokens 
    SET is_used = TRUE, used_at = NOW(), updated_at = NOW()
    WHERE token_hash = v_token_hash;
    
    -- Update user password (assuming profiles table has password fields)
    -- Note: This assumes the profiles table has password_hash and password_salt fields
    UPDATE profiles 
    SET 
        password_hash = p_new_password_hash,
        password_salt = p_new_password_salt,
        updated_at = NOW()
    WHERE id = v_user_id;
    
    -- Add to password history
    INSERT INTO password_history (
        user_id, password_hash, password_salt, changed_by, change_reason, change_source
    ) VALUES (
        v_user_id, p_new_password_hash, p_new_password_salt, v_user_id, 'password_reset', 'web'
    );
    
    -- Log successful reset
    INSERT INTO password_reset_attempts (
        email, ip_address, attempt_type, success, user_agent
    ) VALUES (
        v_email, p_ip_address, 'reset', TRUE, p_user_agent
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired tokens (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_password_tokens()
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Mark expired tokens
    UPDATE password_reset_tokens 
    SET is_expired = TRUE, updated_at = NOW()
    WHERE expires_at < NOW() AND is_expired = FALSE;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    
    -- Delete very old tokens (older than 7 days)
    DELETE FROM password_reset_tokens 
    WHERE created_at < NOW() - INTERVAL '7 days';
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Function to check rate limiting for password reset requests
CREATE OR REPLACE FUNCTION check_password_reset_rate_limit(
    p_email VARCHAR(255),
    p_ip_address INET,
    p_hours INTEGER DEFAULT 1,
    p_max_attempts INTEGER DEFAULT 5
)
RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Count attempts in the last N hours
    SELECT COUNT(*) INTO v_count
    FROM password_reset_attempts
    WHERE (
        email = p_email OR ip_address = p_ip_address
    ) AND attempted_at > NOW() - INTERVAL '1 hour' * p_hours;
    
    RETURN v_count < p_max_attempts;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Password Reset Tokens
CREATE POLICY "Allow users to view their own reset tokens"
    ON password_reset_tokens
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Allow system to manage reset tokens"
    ON password_reset_tokens
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- RLS Policies for Password Reset Attempts
CREATE POLICY "Allow system to manage reset attempts"
    ON password_reset_attempts
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- RLS Policies for Password History
CREATE POLICY "Allow users to view their own password history"
    ON password_history
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Allow system to manage password history"
    ON password_history
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Add updated_at triggers
CREATE TRIGGER update_password_reset_tokens_updated_at
    BEFORE UPDATE ON password_reset_tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a scheduled job to clean up expired tokens (if pg_cron is available)
-- SELECT cron.schedule('cleanup-expired-tokens', '0 2 * * *', 'SELECT cleanup_expired_password_tokens();');

-- Sample data for testing (remove in production)
-- Note: This is just for testing the structure, not actual tokens
INSERT INTO password_reset_attempts (
    email, ip_address, attempt_type, success, failure_reason, request_source
) VALUES (
    'test@example.com', '127.0.0.1', 'request', TRUE, NULL, 'web'
);