-- Safe Migration Script
-- This script safely creates objects only if they don't exist

-- Create password reset tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_used ON password_reset_tokens(used);

-- Enable RLS if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class WHERE relname = 'password_reset_tokens' AND relrowsecurity = true
    ) THEN
        ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create function for updated_at trigger if it doesn't exist
CREATE OR REPLACE FUNCTION update_password_reset_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_password_reset_tokens_updated_at'
    ) THEN
        CREATE TRIGGER update_password_reset_tokens_updated_at
            BEFORE UPDATE ON password_reset_tokens
            FOR EACH ROW
            EXECUTE FUNCTION update_password_reset_tokens_updated_at();
    END IF;
END $$;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON password_reset_tokens TO PUBLIC;

-- Add comments
COMMENT ON TABLE password_reset_tokens IS 'Stores password reset tokens for user authentication';
COMMENT ON COLUMN password_reset_tokens.token IS 'Unique reset token for password reset';
COMMENT ON COLUMN password_reset_tokens.expires_at IS 'Token expiration timestamp';
COMMENT ON COLUMN password_reset_tokens.used IS 'Whether the token has been used';