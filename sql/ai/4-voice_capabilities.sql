-- Voice Capabilities System
-- TTS/STT implementation and voice interaction management

-- Voice Models
CREATE TABLE VoiceModels (
    id BIGSERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    model_name VARCHAR(100) NOT NULL,
    model_type VARCHAR(20) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    model_id VARCHAR(100) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    voice VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    configuration JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice Interactions
CREATE TABLE VoiceInteractions (
    id BIGSERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    session_id UUID REFERENCES AIAgentSession(session_id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL,
    input_text TEXT,
    output_audio BYTEA,
    input_audio BYTEA,
    output_text TEXT,
    model_used VARCHAR(100),
    processing_time_ms INTEGER,
    audio_duration_seconds FLOAT,
    quality_score FLOAT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audio Files
CREATE TABLE AudioFiles (
    id BIGSERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    file_size BIGINT NOT NULL,
    duration_seconds FLOAT,
    sample_rate INTEGER,
    channels INTEGER,
    bit_rate INTEGER,
    purpose VARCHAR(50),
    is_processed BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create updated_at triggers
CREATE TRIGGER update_voice_models_updated_at 
    BEFORE UPDATE ON VoiceModels 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
