-- Authentication Service Database Schema
-- Enhanced for Production Deployment (v2.1.0)

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create schemas for better organization
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS security;

-- Users table (Enhanced)
CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(50) DEFAULT 'user',
    permissions JSONB DEFAULT '[]',
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_role CHECK (role IN ('admin', 'user', 'manager', 'viewer')),
    CONSTRAINT valid_login_count CHECK (login_count >= 0),
    CONSTRAINT valid_failed_attempts CHECK (failed_login_attempts >= 0)
);

-- JWT Tokens table (Enhanced)
CREATE TABLE auth.jwt_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    token_type VARCHAR(20) NOT NULL, -- 'access' or 'refresh'
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMP,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_token_type CHECK (token_type IN ('access', 'refresh'))
);

-- API Keys table (Enhanced)
CREATE TABLE auth.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    key_name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    permissions JSONB NOT NULL,
    rate_limit_per_minute INTEGER DEFAULT 100,
    rate_limit_per_hour INTEGER DEFAULT 1000,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    last_used_at TIMESTAMP,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- Constraints
    CONSTRAINT valid_rate_limit CHECK (rate_limit_per_minute > 0 AND rate_limit_per_hour > 0)
);

-- Password Reset Tokens table
CREATE TABLE auth.password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Email Verification Tokens table
CREATE TABLE auth.email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Security Events table (Enhanced)
CREATE TABLE security.security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_severity CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT valid_event_type CHECK (event_type IN (
        'login_success', 'login_failed', 'logout', 'password_change',
        'password_reset', 'email_verification', 'account_locked',
        'suspicious_activity', 'api_key_created', 'api_key_revoked'
    ))
);

-- Rate Limiting table
CREATE TABLE auth.rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier VARCHAR(255) NOT NULL, -- IP address or user ID
    endpoint VARCHAR(255) NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Unique constraint for rate limiting
    UNIQUE(identifier, endpoint, window_start)
);

-- Enhanced Indexes for Performance
CREATE INDEX CONCURRENTLY idx_users_username ON auth.users(username);
CREATE INDEX CONCURRENTLY idx_users_email ON auth.users(email);
CREATE INDEX CONCURRENTLY idx_users_role ON auth.users(role);
CREATE INDEX CONCURRENTLY idx_users_active ON auth.users(is_active);
CREATE INDEX CONCURRENTLY idx_users_last_login ON auth.users(last_login);

CREATE INDEX CONCURRENTLY idx_jwt_tokens_user_id ON auth.jwt_tokens(user_id);
CREATE INDEX CONCURRENTLY idx_jwt_tokens_hash ON auth.jwt_tokens(token_hash);
CREATE INDEX CONCURRENTLY idx_jwt_tokens_expires ON auth.jwt_tokens(expires_at);
CREATE INDEX CONCURRENTLY idx_jwt_tokens_revoked ON auth.jwt_tokens(is_revoked);

CREATE INDEX CONCURRENTLY idx_api_keys_user_id ON auth.api_keys(user_id);
CREATE INDEX CONCURRENTLY idx_api_keys_hash ON auth.api_keys(key_hash);
CREATE INDEX CONCURRENTLY idx_api_keys_active ON auth.api_keys(is_active);

CREATE INDEX CONCURRENTLY idx_password_reset_user_id ON auth.password_reset_tokens(user_id);
CREATE INDEX CONCURRENTLY idx_password_reset_token ON auth.password_reset_tokens(token_hash);
CREATE INDEX CONCURRENTLY idx_password_reset_expires ON auth.password_reset_tokens(expires_at);

CREATE INDEX CONCURRENTLY idx_email_verification_user_id ON auth.email_verification_tokens(user_id);
CREATE INDEX CONCURRENTLY idx_email_verification_token ON auth.email_verification_tokens(token_hash);
CREATE INDEX CONCURRENTLY idx_email_verification_expires ON auth.email_verification_tokens(expires_at);

CREATE INDEX CONCURRENTLY idx_security_events_user_id ON security.security_events(user_id);
CREATE INDEX CONCURRENTLY idx_security_events_type ON security.security_events(event_type);
CREATE INDEX CONCURRENTLY idx_security_events_severity ON security.security_events(severity);
CREATE INDEX CONCURRENTLY idx_security_events_timestamp ON security.security_events(created_at);

CREATE INDEX CONCURRENTLY idx_rate_limits_identifier ON auth.rate_limits(identifier);
CREATE INDEX CONCURRENTLY idx_rate_limits_endpoint ON auth.rate_limits(endpoint);
CREATE INDEX CONCURRENTLY idx_rate_limits_window ON auth.rate_limits(window_start);

-- Enhanced Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION auth.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column();

-- Enhanced Functions for Security
CREATE OR REPLACE FUNCTION auth.check_rate_limit(
    p_identifier VARCHAR(255),
    p_endpoint VARCHAR(255),
    p_limit INTEGER,
    p_window_minutes INTEGER DEFAULT 1
) RETURNS BOOLEAN AS $$
DECLARE
    request_count INTEGER;
    window_start TIMESTAMP;
BEGIN
    window_start := NOW() - INTERVAL '1 minute' * p_window_minutes;
    
    SELECT COALESCE(SUM(request_count), 0) INTO request_count
    FROM auth.rate_limits
    WHERE identifier = p_identifier
    AND endpoint = p_endpoint
    AND window_start >= window_start;
    
    IF request_count >= p_limit THEN
        RETURN FALSE;
    END IF;
    
    -- Record this request
    INSERT INTO auth.rate_limits (identifier, endpoint, request_count, window_start)
    VALUES (p_identifier, p_endpoint, 1, NOW())
    ON CONFLICT (identifier, endpoint, window_start)
    DO UPDATE SET request_count = rate_limits.request_count + 1;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Enhanced Views for Common Queries
CREATE VIEW auth.user_summary AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    u.is_active,
    u.is_verified,
    u.last_login,
    u.login_count,
    u.created_at,
    COUNT(jt.id) as active_tokens,
    COUNT(ak.id) as active_api_keys
FROM auth.users u
LEFT JOIN auth.jwt_tokens jt ON u.id = jt.user_id AND jt.is_revoked = FALSE AND jt.expires_at > NOW()
LEFT JOIN auth.api_keys ak ON u.id = ak.user_id AND ak.is_active = TRUE
GROUP BY u.id, u.username, u.email, u.first_name, u.last_name, u.role, u.is_active, u.is_verified, u.last_login, u.login_count, u.created_at;

CREATE VIEW security.recent_security_events AS
SELECT 
    se.id,
    se.event_type,
    se.severity,
    se.description,
    se.ip_address,
    se.created_at,
    u.username,
    u.email
FROM security.security_events se
LEFT JOIN auth.users u ON se.user_id = u.id
WHERE se.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY se.created_at DESC;

-- Grant permissions
GRANT USAGE ON SCHEMA auth TO postgres;
GRANT USAGE ON SCHEMA security TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA security TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA security TO postgres;
