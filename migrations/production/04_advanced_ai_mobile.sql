-- =============================================================================
-- PHASE 3: ADVANCED AI FEATURES - VOICE ASSISTANT ONLY
-- =============================================================================
-- This migration creates the Sofia Voice Assistant system for Phase 3
-- Advanced AI Features and Mobile Integration

-- =============================================================================
-- 1. SOFIA VOICE ASSISTANT SYSTEM
-- =============================================================================

-- Sofia voice interactions table
CREATE TABLE IF NOT EXISTS sofia_voice_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    command_text TEXT NOT NULL,
    command_audio_url TEXT,
    intent VARCHAR(100) NOT NULL,
    entities JSONB,
    response_text TEXT NOT NULL,
    response_audio_url TEXT,
    confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score BETWEEN 0.0 AND 1.0),
    processing_time_ms INTEGER NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_sofia_voice_property (property_id),
    INDEX idx_sofia_voice_guest (guest_id),
    INDEX idx_sofia_voice_session (session_id),
    INDEX idx_sofia_voice_intent (intent),
    INDEX idx_sofia_voice_confidence (confidence_score) WHERE confidence_score > 0.7
);

-- Sofia voice sessions table
CREATE TABLE IF NOT EXISTS sofia_voice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_data JSONB NOT NULL, -- Session state and context
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    is_active BOOLEAN DEFAULT true,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    
    INDEX idx_sofia_voice_sessions_property (property_id),
    INDEX idx_sofia_voice_sessions_guest (guest_id),
    INDEX idx_sofia_voice_sessions_active (is_active) WHERE is_active = true
);

-- Sofia voice intents table
CREATE TABLE IF NOT EXISTS sofia_voice_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    intent_name VARCHAR(100) NOT NULL,
    intent_description TEXT,
    training_phrases JSONB NOT NULL, -- Example phrases for training
    response_template TEXT NOT NULL,
    required_entities JSONB, -- Required entities for this intent
    confidence_threshold DECIMAL(3,2) DEFAULT 0.7,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_sofia_voice_intents_property (property_id),
    INDEX idx_sofia_voice_intents_active (is_active) WHERE is_active = true
);

-- Create indexes for Sofia voice system
CREATE INDEX IF NOT EXISTS idx_sofia_voice_interactions_property ON sofia_voice_interactions(property_id);
CREATE INDEX IF NOT EXISTS idx_sofia_voice_interactions_guest ON sofia_voice_interactions(guest_id);
CREATE INDEX IF NOT EXISTS idx_sofia_voice_interactions_session ON sofia_voice_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_sofia_voice_interactions_intent ON sofia_voice_interactions(intent);
CREATE INDEX IF NOT EXISTS idx_sofia_voice_interactions_confidence ON sofia_voice_interactions(confidence_score) WHERE confidence_score > 0.7;

CREATE INDEX IF NOT EXISTS idx_sofia_voice_sessions_property ON sofia_voice_sessions(property_id);
CREATE INDEX IF NOT EXISTS idx_sofia_voice_sessions_guest ON sofia_voice_sessions(guest_id);
CREATE INDEX IF NOT EXISTS idx_sofia_voice_sessions_active ON sofia_voice_sessions(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_sofia_voice_intents_property ON sofia_voice_intents(property_id);
CREATE INDEX IF NOT EXISTS idx_sofia_voice_intents_active ON sofia_voice_intents(is_active) WHERE is_active = true;

-- =============================================================================
-- 2. SOFIA VOICE ASSISTANT VIEWS
-- =============================================================================

-- Sofia voice interactions summary view
CREATE OR REPLACE VIEW sofia_voice_summary AS
SELECT 
    svi.property_id,
    svi.guest_id,
    svi.session_id,
    COUNT(*) as total_interactions,
    AVG(svi.confidence_score) as avg_confidence,
    AVG(svi.processing_time_ms) as avg_processing_time,
    COUNT(DISTINCT svi.intent) as unique_intents,
    MAX(svi.created_at) as last_interaction
FROM sofia_voice_interactions svi
GROUP BY svi.property_id, svi.guest_id, svi.session_id;

-- Sofia voice analytics view
CREATE OR REPLACE VIEW sofia_voice_analytics AS
SELECT 
    svi.property_id,
    DATE(svi.created_at) as interaction_date,
    COUNT(*) as total_interactions,
    COUNT(DISTINCT svi.guest_id) as unique_guests,
    COUNT(DISTINCT svi.session_id) as unique_sessions,
    AVG(svi.confidence_score) as avg_confidence,
    AVG(svi.processing_time_ms) as avg_processing_time,
    COUNT(CASE WHEN svi.confidence_score > 0.8 THEN 1 END) as high_confidence_interactions,
    COUNT(CASE WHEN svi.processing_time_ms < 1000 THEN 1 END) as fast_responses
FROM sofia_voice_interactions svi
GROUP BY svi.property_id, DATE(svi.created_at);

-- =============================================================================
-- 3. SAMPLE DATA FOR SOFIA VOICE ASSISTANT
-- =============================================================================

-- Insert sample voice intents
INSERT INTO sofia_voice_intents (property_id, intent_name, intent_description, training_phrases, response_template, required_entities, is_active)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'check_availability', 'Check room availability', 
     '["What rooms are available?", "Do you have any rooms free?", "Show me available rooms"]', 
     'I can help you check room availability. What dates are you looking for?', 
     '{"check_in_date": "required", "check_out_date": "required", "guests": "optional"}', 
     true),
    
    ('550e8400-e29b-41d4-a716-446655440000', 'make_reservation', 'Make a room reservation', 
     '["I want to book a room", "Can I make a reservation?", "Book me a room"]', 
     'I can help you make a reservation. Let me get your details.', 
     '{"check_in_date": "required", "check_out_date": "required", "guests": "required", "room_type": "optional"}', 
     true),
    
    ('550e8400-e29b-41d4-a716-446655440000', 'restaurant_info', 'Get restaurant information', 
     '["What restaurants do you have?", "Tell me about dining options", "Where can I eat?"]', 
     'We have several dining options available. Let me show you our restaurants.', 
     '{"restaurant_type": "optional", "cuisine": "optional"}', 
     true);

-- =============================================================================
-- 4. COMMENTS AND DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE sofia_voice_interactions IS 'Voice command interactions and responses for Sofia AI';
COMMENT ON TABLE sofia_voice_sessions IS 'Voice conversation sessions and context';
COMMENT ON TABLE sofia_voice_intents IS 'Voice command intents and response templates';

COMMENT ON COLUMN sofia_voice_interactions.confidence_score IS 'AI confidence in understanding the command (0.0 to 1.0)';
COMMENT ON COLUMN sofia_voice_interactions.processing_time_ms IS 'Time taken to process the voice command in milliseconds';
COMMENT ON COLUMN sofia_voice_interactions.entities IS 'Extracted entities from the voice command (dates, names, preferences)';
COMMENT ON COLUMN sofia_voice_sessions.session_data IS 'Session context and conversation state';
COMMENT ON COLUMN sofia_voice_intents.training_phrases IS 'Example phrases used to train the intent recognition model';
COMMENT ON COLUMN sofia_voice_intents.response_template IS 'Template for generating responses to this intent';
COMMENT ON COLUMN sofia_voice_intents.required_entities IS 'Entities that must be present for this intent to be valid';