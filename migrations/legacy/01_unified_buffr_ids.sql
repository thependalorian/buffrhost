-- Unified Buffr ID System Database Schema for Buffr Host
-- This schema supports the unified Buffr ID system across all projects

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types for Buffr ID components
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

-- Main Buffr IDs table
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_buffr_ids_entity_project ON buffr_ids(entity_type, project);
CREATE INDEX IF NOT EXISTS idx_buffr_ids_country ON buffr_ids(country_code);
CREATE INDEX IF NOT EXISTS idx_buffr_ids_user ON buffr_ids(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_buffr_ids_property ON buffr_ids(property_id) WHERE property_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_buffr_ids_organization ON buffr_ids(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_buffr_ids_identifier_hash ON buffr_ids(identifier_hash);
CREATE INDEX IF NOT EXISTS idx_buffr_ids_status ON buffr_ids(status);

-- Function to generate Buffr ID
CREATE OR REPLACE FUNCTION generate_buffr_id(
    p_entity_type buffr_entity_type,
    p_project buffr_project_type,
    p_country buffr_country_code,
    p_identifier TEXT
)
RETURNS TEXT AS $$
DECLARE
    identifier_hash TEXT;
    timestamp_str TEXT;
    buffr_id TEXT;
BEGIN
    -- Create identifier hash (first 8 characters of SHA256)
    identifier_hash := SUBSTRING(encode(digest(LOWER(TRIM(p_identifier)), 'sha256'), 'hex'), 1, 8);
    
    -- Generate timestamp (YYYYMMDDHHMMSS)
    timestamp_str := TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');
    
    -- Assemble Buffr ID
    buffr_id := 'BFR-' || p_entity_type || '-' || p_project || '-' || p_country || '-' || identifier_hash || '-' || timestamp_str;
    
    RETURN buffr_id;
END;
$$ LANGUAGE plpgsql;

-- Function to validate Buffr ID format
CREATE OR REPLACE FUNCTION validate_buffr_id_format(p_buffr_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN p_buffr_id ~ '^BFR-(IND|PROP|ORG)-(PAY|SIGN|LEND|HOST)-[A-Z]{2}-[a-f0-9]{8}-[0-9]{14}$';
END;
$$ LANGUAGE plpgsql;

-- Function to parse Buffr ID components
CREATE OR REPLACE FUNCTION parse_buffr_id(p_buffr_id TEXT)
RETURNS TABLE(
    entity_type buffr_entity_type,
    project buffr_project_type,
    country_code buffr_country_code,
    identifier_hash VARCHAR(8),
    timestamp_str VARCHAR(14)
) AS $$
DECLARE
    parts TEXT[];
BEGIN
    -- Validate format first
    IF NOT validate_buffr_id_format(p_buffr_id) THEN
        RAISE EXCEPTION 'Invalid Buffr ID format: %', p_buffr_id;
    END IF;
    
    -- Split by dashes
    parts := string_to_array(p_buffr_id, '-');
    
    -- Return parsed components
    RETURN QUERY SELECT
        parts[2]::buffr_entity_type,
        parts[3]::buffr_project_type,
        parts[4]::buffr_country_code,
        parts[5]::VARCHAR(8),
        parts[6]::VARCHAR(14);
END;
$$ LANGUAGE plpgsql;

-- Function to create Buffr ID for property
CREATE OR REPLACE FUNCTION create_property_buffr_id(
    p_property_id UUID,
    p_property_name TEXT,
    p_owner_id TEXT,
    p_country_code buffr_country_code DEFAULT 'NA'
)
RETURNS TEXT AS $$
DECLARE
    identifier TEXT;
    buffr_id TEXT;
BEGIN
    -- Create identifier from property name and owner
    identifier := LOWER(TRIM(p_property_name)) || '-' || p_owner_id;
    
    -- Generate Buffr ID for property
    buffr_id := generate_buffr_id('PROP', 'HOST', p_country_code, identifier);
    
    -- Insert Buffr ID record
    INSERT INTO buffr_ids (
        buffr_id,
        entity_type,
        project,
        country_code,
        identifier_hash,
        original_identifier,
        property_id,
        status,
        is_verified
    ) VALUES (
        buffr_id,
        'PROP',
        'HOST',
        p_country_code,
        SUBSTRING(encode(digest(identifier, 'sha256'), 'hex'), 1, 8),
        pgp_sym_encrypt(identifier, current_setting('app.encryption_key', true)),
        p_property_id,
        'active',
        FALSE
    );
    
    RETURN buffr_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create Buffr ID for user (individual)
CREATE OR REPLACE FUNCTION create_user_buffr_id(
    p_user_id UUID,
    p_national_id TEXT,
    p_phone_number TEXT,
    p_country_code buffr_country_code DEFAULT 'NA'
)
RETURNS TEXT AS $$
DECLARE
    identifier TEXT;
    buffr_id TEXT;
BEGIN
    -- Use national ID as primary identifier
    identifier := COALESCE(p_national_id, p_phone_number, 'unknown');
    
    -- Generate Buffr ID for user
    buffr_id := generate_buffr_id('IND', 'HOST', p_country_code, identifier);
    
    -- Insert Buffr ID record
    INSERT INTO buffr_ids (
        buffr_id,
        entity_type,
        project,
        country_code,
        identifier_hash,
        original_identifier,
        user_id,
        status,
        is_verified
    ) VALUES (
        buffr_id,
        'IND',
        'HOST',
        p_country_code,
        SUBSTRING(encode(digest(identifier, 'sha256'), 'hex'), 1, 8),
        pgp_sym_encrypt(identifier, current_setting('app.encryption_key', true)),
        p_user_id,
        'active',
        FALSE
    );
    
    RETURN buffr_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create Buffr ID for organization
CREATE OR REPLACE FUNCTION create_organization_buffr_id(
    p_organization_id UUID,
    p_business_registration TEXT,
    p_organization_name TEXT,
    p_country_code buffr_country_code DEFAULT 'NA'
)
RETURNS TEXT AS $$
DECLARE
    identifier TEXT;
    buffr_id TEXT;
BEGIN
    -- Create identifier from business registration and name
    identifier := p_business_registration || '-' || LOWER(TRIM(p_organization_name));
    
    -- Generate Buffr ID for organization
    buffr_id := generate_buffr_id('ORG', 'HOST', p_country_code, identifier);
    
    -- Insert Buffr ID record
    INSERT INTO buffr_ids (
        buffr_id,
        entity_type,
        project,
        country_code,
        identifier_hash,
        original_identifier,
        organization_id,
        status,
        is_verified
    ) VALUES (
        buffr_id,
        'ORG',
        'HOST',
        p_country_code,
        SUBSTRING(encode(digest(identifier, 'sha256'), 'hex'), 1, 8),
        pgp_sym_encrypt(identifier, current_setting('app.encryption_key', true)),
        p_organization_id,
        'active',
        FALSE
    );
    
    RETURN buffr_id;
END;
$$ LANGUAGE plpgsql;

-- Function to find Buffr IDs by entity
CREATE OR REPLACE FUNCTION find_buffr_ids_by_entity(
    p_entity_type buffr_entity_type,
    p_identifier_hash VARCHAR(8),
    p_country_code buffr_country_code
)
RETURNS TABLE(
    buffr_id TEXT,
    project buffr_project_type,
    status VARCHAR(20),
    is_verified BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        bi.buffr_id,
        bi.project,
        bi.status,
        bi.is_verified,
        bi.created_at
    FROM buffr_ids bi
    WHERE bi.entity_type = p_entity_type
      AND bi.identifier_hash = p_identifier_hash
      AND bi.country_code = p_country_code
      AND bi.status = 'active'
    ORDER BY bi.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_buffr_id_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_buffr_id_updated_at
    BEFORE UPDATE ON buffr_ids
    FOR EACH ROW
    EXECUTE FUNCTION update_buffr_id_updated_at();

-- Enable Row Level Security
ALTER TABLE buffr_ids ENABLE ROW LEVEL SECURITY;

-- Policy for reading Buffr IDs (users can read their own IDs)
CREATE POLICY "Users can read their own Buffr IDs" ON buffr_ids
    FOR SELECT
    USING (
        (entity_type = 'IND' AND user_id = current_setting('app.current_user_id', true)::UUID) OR
        (entity_type = 'PROP' AND property_id IN (
            SELECT id FROM properties WHERE owner_id = current_setting('app.current_user_id', true)::UUID
        )) OR
        (entity_type = 'ORG' AND organization_id IN (
            SELECT id FROM organizations WHERE owner_id = current_setting('app.current_user_id', true)::UUID
        ))
    );

-- Policy for inserting Buffr IDs (authenticated users can create IDs)
CREATE POLICY "Authenticated users can create Buffr IDs" ON buffr_ids
    FOR INSERT
    WITH CHECK (current_setting('app.current_user_id', true) IS NOT NULL);

-- Policy for updating Buffr IDs (users can update their own IDs)
CREATE POLICY "Users can update their own Buffr IDs" ON buffr_ids
    FOR UPDATE
    USING (
        (entity_type = 'IND' AND user_id = current_setting('app.current_user_id', true)::UUID) OR
        (entity_type = 'PROP' AND property_id IN (
            SELECT id FROM properties WHERE owner_id = current_setting('app.current_user_id', true)::UUID
        )) OR
        (entity_type = 'ORG' AND organization_id IN (
            SELECT id FROM organizations WHERE owner_id = current_setting('app.current_user_id', true)::UUID
        ))
    );

-- Add comments for documentation
COMMENT ON TABLE buffr_ids IS 'Unified Buffr ID system for cross-project entity identification';
COMMENT ON COLUMN buffr_ids.buffr_id IS 'Format: BFR-{ENTITY_TYPE}-{PROJECT}-{COUNTRY}-{IDENTIFIER_HASH}-{TIMESTAMP}';
COMMENT ON COLUMN buffr_ids.entity_type IS 'Entity type: IND (Individual), PROP (Property), ORG (Organization)';
COMMENT ON COLUMN buffr_ids.project IS 'Project: PAY, SIGN, LEND, HOST';
COMMENT ON COLUMN buffr_ids.country_code IS 'Country code: NA, ZA, BW, ZM, MW, SZ, LS, MZ';
COMMENT ON COLUMN buffr_ids.identifier_hash IS 'First 8 characters of SHA256 hash of original identifier';
COMMENT ON COLUMN buffr_ids.original_identifier IS 'Encrypted original identifier (national ID, employee ID, business registration, etc.)';