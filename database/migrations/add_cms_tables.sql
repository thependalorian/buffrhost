-- CMS Tables Migration for The Shandi Hospitality Ecosystem Management Platform
-- Adds comprehensive content management system tables

-- Content Types Enum
CREATE TYPE content_type_enum AS ENUM (
    'image',
    'menu_item',
    'room',
    'facility',
    'service',
    'event',
    'promotion',
    'document',
    'video',
    'audio'
);

-- Content Status Enum
CREATE TYPE content_status_enum AS ENUM (
    'draft',
    'published',
    'archived',
    'scheduled'
);

-- Main CMS Content Table
CREATE TABLE cms_content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type content_type_enum NOT NULL,
    status content_status_enum DEFAULT 'draft',
    
    -- Content metadata
    metadata JSONB,
    tags JSONB,
    categories JSONB,
    
    -- File information
    file_path VARCHAR(500),
    file_size INTEGER,
    mime_type VARCHAR(100),
    alt_text VARCHAR(255),
    
    -- SEO and social
    slug VARCHAR(255) UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    social_image VARCHAR(500),
    
    -- Relationships
    property_id INTEGER REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Soft delete
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Content Versions Table
CREATE TABLE content_versions (
    id SERIAL PRIMARY KEY,
    content_id INTEGER REFERENCES cms_content(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    
    -- Version content
    title VARCHAR(255),
    description TEXT,
    metadata JSONB,
    file_path VARCHAR(500),
    
    -- Version metadata
    created_by INTEGER REFERENCES users(id),
    change_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Content Templates Table
CREATE TABLE content_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content_type content_type_enum NOT NULL,
    description TEXT,
    
    -- Template structure
    template_schema JSONB,
    default_metadata JSONB,
    required_fields JSONB,
    
    -- Template status
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Media Library Table
CREATE TABLE media_library (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    
    -- File metadata
    width INTEGER,
    height INTEGER,
    duration DECIMAL(10,2),
    quality VARCHAR(50),
    
    -- File status
    is_processed BOOLEAN DEFAULT FALSE,
    processing_status VARCHAR(50),
    processing_error TEXT,
    
    -- Relationships
    property_id INTEGER REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    
    -- Timestamps
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    
    -- Soft delete
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Content Collections Table
CREATE TABLE content_collections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Collection metadata
    collection_type VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Relationships
    property_id INTEGER REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Collection Content Junction Table
CREATE TABLE collection_content (
    id SERIAL PRIMARY KEY,
    collection_id INTEGER REFERENCES content_collections(id) ON DELETE CASCADE,
    content_id INTEGER REFERENCES cms_content(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    
    UNIQUE(collection_id, content_id)
);

-- Content Workflows Table
CREATE TABLE content_workflows (
    id SERIAL PRIMARY KEY,
    content_id INTEGER REFERENCES cms_content(id) ON DELETE CASCADE,
    
    -- Workflow status
    current_step VARCHAR(100),
    status VARCHAR(50),
    
    -- Approval chain
    assigned_to INTEGER REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Comments and feedback
    comments TEXT,
    feedback TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_cms_content_property_id ON cms_content(property_id);
CREATE INDEX idx_cms_content_type ON cms_content(content_type);
CREATE INDEX idx_cms_content_status ON cms_content(status);
CREATE INDEX idx_cms_content_slug ON cms_content(slug);
CREATE INDEX idx_cms_content_created_at ON cms_content(created_at);
CREATE INDEX idx_cms_content_tags ON cms_content USING GIN(tags);
CREATE INDEX idx_cms_content_categories ON cms_content USING GIN(categories);
CREATE INDEX idx_cms_content_metadata ON cms_content USING GIN(metadata);

CREATE INDEX idx_content_versions_content_id ON content_versions(content_id);
CREATE INDEX idx_content_versions_version_number ON content_versions(version_number);

CREATE INDEX idx_content_templates_type ON content_templates(content_type);
CREATE INDEX idx_content_templates_active ON content_templates(is_active);

CREATE INDEX idx_media_library_property_id ON media_library(property_id);
CREATE INDEX idx_media_library_mime_type ON media_library(mime_type);
CREATE INDEX idx_media_library_uploaded_at ON media_library(uploaded_at);

CREATE INDEX idx_content_collections_property_id ON content_collections(property_id);
CREATE INDEX idx_content_collections_type ON content_collections(collection_type);

CREATE INDEX idx_collection_content_collection_id ON collection_content(collection_id);
CREATE INDEX idx_collection_content_content_id ON collection_content(content_id);

CREATE INDEX idx_content_workflows_content_id ON content_workflows(content_id);
CREATE INDEX idx_content_workflows_status ON content_workflows(status);
CREATE INDEX idx_content_workflows_assigned_to ON content_workflows(assigned_to);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cms_content_updated_at BEFORE UPDATE ON cms_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_templates_updated_at BEFORE UPDATE ON content_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_collections_updated_at BEFORE UPDATE ON content_collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_workflows_updated_at BEFORE UPDATE ON content_workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default templates
INSERT INTO content_templates (name, content_type, description, template_schema, default_metadata, required_fields, is_default) VALUES
('Standard Image Template', 'image', 'Default template for image content', 
 '{"type": "object", "properties": {"width": {"type": "integer"}, "height": {"type": "integer"}, "alt_text": {"type": "string"}}}',
 '{"width": 0, "height": 0, "alt_text": ""}',
 '["width", "height", "alt_text"]', true),

('Menu Item Template', 'menu_item', 'Template for restaurant menu items',
 '{"type": "object", "properties": {"price": {"type": "number"}, "category": {"type": "string"}, "ingredients": {"type": "array"}, "allergens": {"type": "array"}}}',
 '{"price": 0, "category": "", "ingredients": [], "allergens": []}',
 '["price", "category"]', true),

('Room Template', 'room', 'Template for hotel room content',
 '{"type": "object", "properties": {"room_type": {"type": "string"}, "capacity": {"type": "integer"}, "amenities": {"type": "array"}, "size": {"type": "string"}}}',
 '{"room_type": "", "capacity": 1, "amenities": [], "size": ""}',
 '["room_type", "capacity", "amenities"]', true),

('Facility Template', 'facility', 'Template for facility content',
 '{"type": "object", "properties": {"facility_type": {"type": "string"}, "capacity": {"type": "integer"}, "amenities": {"type": "array"}, "operating_hours": {"type": "object"}}}',
 '{"facility_type": "", "capacity": 0, "amenities": [], "operating_hours": {}}',
 '["facility_type", "amenities"]', true),

('Service Template', 'service', 'Template for service content',
 '{"type": "object", "properties": {"service_type": {"type": "string"}, "duration": {"type": "string"}, "price": {"type": "number"}, "availability": {"type": "array"}}}',
 '{"service_type": "", "duration": "", "price": 0, "availability": []}',
 '["service_type", "duration"]', true);

-- Add CMS content relationship to hospitality_properties
ALTER TABLE hospitality_properties ADD COLUMN IF NOT EXISTS cms_enabled BOOLEAN DEFAULT TRUE;

-- Comments for documentation
COMMENT ON TABLE cms_content IS 'Main content management table for all CMS content';
COMMENT ON TABLE content_versions IS 'Version control for CMS content changes';
COMMENT ON TABLE content_templates IS 'Templates for different content types';
COMMENT ON TABLE media_library IS 'Media file management and metadata';
COMMENT ON TABLE content_collections IS 'Collections to group related content';
COMMENT ON TABLE collection_content IS 'Many-to-many relationship between collections and content';
COMMENT ON TABLE content_workflows IS 'Workflow management for content approval processes';
