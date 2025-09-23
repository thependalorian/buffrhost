-- Utility Functions
-- Common database functions and procedures

-- Update updated_at column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Clean up expired audio files
CREATE OR REPLACE FUNCTION cleanup_expired_audio_files()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM AudioFiles 
    WHERE expires_at IS NOT NULL 
    AND expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- Calculate loyalty tier based on points
CREATE OR REPLACE FUNCTION calculate_loyalty_tier(points INTEGER)
RETURNS VARCHAR(50)
LANGUAGE plpgsql
AS $$
BEGIN
    IF points >= 10000 THEN
        RETURN 'platinum';
    ELSIF points >= 5000 THEN
        RETURN 'gold';
    ELSIF points >= 1000 THEN
        RETURN 'silver';
    ELSE
        RETURN 'bronze';
    END IF;
END;
$$;

-- Update loyalty tier when points change
CREATE OR REPLACE FUNCTION update_loyalty_tier()
RETURNS TRIGGER AS $$
BEGIN
    NEW.tier_level = calculate_loyalty_tier(NEW.total_points);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for loyalty tier updates
CREATE TRIGGER update_loyalty_tier_trigger
    BEFORE UPDATE ON CrossBusinessLoyalty
    FOR EACH ROW
    EXECUTE FUNCTION update_loyalty_tier();
