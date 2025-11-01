-- Migration: Add Buffr ID support to existing properties
-- This migration adds buffr_id column and generates Buffr IDs for existing properties

-- Add buffr_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'buffr_id'
    ) THEN
        ALTER TABLE properties ADD COLUMN buffr_id VARCHAR(100) UNIQUE;
    END IF;
END $$;

-- Create index for buffr_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_properties_buffr_id ON properties(buffr_id);

-- Function to generate Buffr ID for properties
CREATE OR REPLACE FUNCTION generate_property_buffr_id(
    p_property_id UUID,
    p_property_name VARCHAR,
    p_owner_id VARCHAR,
    p_country_code VARCHAR DEFAULT 'NA'
)
RETURNS TEXT AS $$
DECLARE
    identifier TEXT;
    identifier_hash TEXT;
    timestamp_str TEXT;
    buffr_id TEXT;
BEGIN
    -- Create identifier from property name and owner ID
    identifier := LOWER(TRIM(p_property_name)) || '-' || p_owner_id;
    
    -- Create identifier hash (first 8 characters of SHA256)
    identifier_hash := SUBSTRING(encode(digest(identifier, 'sha256'), 'hex'), 1, 8);
    
    -- Generate timestamp (YYYYMMDDHHMMSS)
    timestamp_str := TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');
    
    -- Assemble Buffr ID
    buffr_id := 'BFR-PROP-HOST-' || p_country_code || '-' || identifier_hash || '-' || timestamp_str;
    
    RETURN buffr_id;
END;
$$ LANGUAGE plpgsql;

-- Generate Buffr IDs for existing properties that don't have them
UPDATE properties 
SET buffr_id = generate_property_buffr_id(
    id, 
    name, 
    owner_id, 
    CASE 
        WHEN location ILIKE '%namibia%' OR location ILIKE '%windhoek%' OR location ILIKE '%swakopmund%' THEN 'NA'
        WHEN location ILIKE '%south africa%' OR location ILIKE '%cape town%' OR location ILIKE '%johannesburg%' THEN 'ZA'
        WHEN location ILIKE '%botswana%' OR location ILIKE '%gaborone%' THEN 'BW'
        WHEN location ILIKE '%zambia%' OR location ILIKE '%lusaka%' THEN 'ZM'
        WHEN location ILIKE '%malawi%' OR location ILIKE '%lilongwe%' THEN 'MW'
        WHEN location ILIKE '%swaziland%' OR location ILIKE '%mbabane%' THEN 'SZ'
        WHEN location ILIKE '%lesotho%' OR location ILIKE '%maseru%' THEN 'LS'
        WHEN location ILIKE '%mozambique%' OR location ILIKE '%maputo%' THEN 'MZ'
        ELSE 'NA' -- Default to Namibia
    END
)
WHERE buffr_id IS NULL;

-- Add constraint to ensure buffr_id format validation
ALTER TABLE properties 
ADD CONSTRAINT ck_buffr_id_format 
CHECK (buffr_id IS NULL OR buffr_id ~ '^BFR-PROP-HOST-[A-Z]{2}-[a-f0-9]{8}-[0-9]{14}$');

-- Add comment for documentation
COMMENT ON COLUMN properties.buffr_id IS 'Unified Buffr ID for cross-project integration. Format: BFR-PROP-HOST-{COUNTRY}-{IDENTIFIER_HASH}-{TIMESTAMP}';

-- Clean up the temporary function
DROP FUNCTION IF EXISTS generate_property_buffr_id(UUID, VARCHAR, VARCHAR, VARCHAR);