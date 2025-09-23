-- Page and Component Audit System
-- Comprehensive auditing for frontend pages, components, and user interactions

-- Page types enum
CREATE TYPE page_type_enum AS ENUM (
    'dashboard',
    'booking',
    'order',
    'payment',
    'profile',
    'settings',
    'admin',
    'staff',
    'customer',
    'report',
    'analytics',
    'notification',
    'help',
    'error'
);

-- Component types enum
CREATE TYPE component_type_enum AS ENUM (
    'form',
    'button',
    'modal',
    'table',
    'chart',
    'card',
    'navigation',
    'sidebar',
    'header',
    'footer',
    'input',
    'select',
    'checkbox',
    'radio',
    'datepicker',
    'file_upload',
    'image',
    'video',
    'map',
    'calendar',
    'chat',
    'notification',
    'alert',
    'tooltip',
    'dropdown'
);

-- User interaction types enum
CREATE TYPE interaction_type_enum AS ENUM (
    'click',
    'hover',
    'focus',
    'blur',
    'input',
    'submit',
    'scroll',
    'resize',
    'load',
    'unload',
    'error',
    'success',
    'warning',
    'info'
);

-- Page audit table
CREATE TABLE PageAudit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    property_id INTEGER REFERENCES HospitalityProperty(property_id),
    page_name VARCHAR(255) NOT NULL,
    page_type page_type_enum NOT NULL,
    page_url TEXT NOT NULL,
    page_title VARCHAR(500),
    page_description TEXT,
    page_category VARCHAR(100),
    page_tags TEXT[],
    page_metadata JSONB DEFAULT '{}'::jsonb,
    load_time_ms INTEGER,
    render_time_ms INTEGER,
    dom_content_loaded_ms INTEGER,
    first_contentful_paint_ms INTEGER,
    largest_contentful_paint_ms INTEGER,
    cumulative_layout_shift DECIMAL(5,3),
    first_input_delay_ms INTEGER,
    time_to_interactive_ms INTEGER,
    session_id TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    browser_version VARCHAR(50),
    operating_system VARCHAR(100),
    screen_resolution VARCHAR(20),
    viewport_size VARCHAR(20),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Component audit table
CREATE TABLE ComponentAudit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    property_id INTEGER REFERENCES HospitalityProperty(property_id),
    page_id UUID REFERENCES PageAudit(id) ON DELETE CASCADE,
    component_name VARCHAR(255) NOT NULL,
    component_type component_type_enum NOT NULL,
    component_id VARCHAR(255),
    component_class VARCHAR(255),
    component_position JSONB DEFAULT '{}'::jsonb,
    component_size JSONB DEFAULT '{}'::jsonb,
    component_props JSONB DEFAULT '{}'::jsonb,
    component_state JSONB DEFAULT '{}'::jsonb,
    component_metadata JSONB DEFAULT '{}'::jsonb,
    is_visible BOOLEAN DEFAULT TRUE,
    visibility_duration_ms INTEGER,
    interaction_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    performance_score DECIMAL(3,2),
    accessibility_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User interaction audit table
CREATE TABLE UserInteractionAudit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    property_id INTEGER REFERENCES HospitalityProperty(property_id),
    page_id UUID REFERENCES PageAudit(id) ON DELETE CASCADE,
    component_id UUID REFERENCES ComponentAudit(id) ON DELETE CASCADE,
    interaction_type interaction_type_enum NOT NULL,
    interaction_target VARCHAR(255),
    interaction_value TEXT,
    interaction_coordinates JSONB DEFAULT '{}'::jsonb,
    interaction_duration_ms INTEGER,
    interaction_metadata JSONB DEFAULT '{}'::jsonb,
    session_id TEXT,
    sequence_number INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page performance metrics table
CREATE TABLE PagePerformanceMetrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES PageAudit(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,3),
    metric_unit VARCHAR(20),
    metric_category VARCHAR(50),
    measurement_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Component performance metrics table
CREATE TABLE ComponentPerformanceMetrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_id UUID REFERENCES ComponentAudit(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,3),
    metric_unit VARCHAR(20),
    metric_category VARCHAR(50),
    measurement_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User session tracking table
CREATE TABLE UserSessionTracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    property_id INTEGER REFERENCES HospitalityProperty(property_id),
    session_id TEXT NOT NULL,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    session_duration_ms INTEGER,
    page_views INTEGER DEFAULT 0,
    interactions_count INTEGER DEFAULT 0,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    operating_system VARCHAR(100),
    screen_resolution VARCHAR(20),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    session_metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to track page load
CREATE OR REPLACE FUNCTION track_page_load(
    p_user_id TEXT,
    p_property_id INTEGER,
    p_page_name VARCHAR(255),
    p_page_type page_type_enum,
    p_page_url TEXT,
    p_page_title VARCHAR(500),
    p_load_time_ms INTEGER,
    p_render_time_ms INTEGER,
    p_session_id TEXT,
    p_device_info JSONB,
    p_utm_params JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    page_id UUID;
BEGIN
    INSERT INTO PageAudit (
        user_id, property_id, page_name, page_type, page_url, page_title,
        load_time_ms, render_time_ms, session_id,
        device_type, browser, browser_version, operating_system,
        screen_resolution, viewport_size, utm_source, utm_medium,
        utm_campaign, utm_term, utm_content, page_metadata
    ) VALUES (
        p_user_id, p_property_id, p_page_name, p_page_type, p_page_url, p_page_title,
        p_load_time_ms, p_render_time_ms, p_session_id,
        p_device_info->>'device_type',
        p_device_info->>'browser',
        p_device_info->>'browser_version',
        p_device_info->>'operating_system',
        p_device_info->>'screen_resolution',
        p_device_info->>'viewport_size',
        p_utm_params->>'utm_source',
        p_utm_params->>'utm_medium',
        p_utm_params->>'utm_campaign',
        p_utm_params->>'utm_term',
        p_utm_params->>'utm_content',
        p_device_info
    ) RETURNING id INTO page_id;
    
    RETURN page_id;
END;
$$ LANGUAGE plpgsql;

-- Function to track component interaction
CREATE OR REPLACE FUNCTION track_component_interaction(
    p_user_id TEXT,
    p_property_id INTEGER,
    p_page_id UUID,
    p_component_name VARCHAR(255),
    p_component_type component_type_enum,
    p_interaction_type interaction_type_enum,
    p_interaction_value TEXT,
    p_coordinates JSONB,
    p_session_id TEXT
)
RETURNS UUID AS $$
DECLARE
    component_id UUID;
    interaction_id UUID;
BEGIN
    -- Get or create component
    SELECT id INTO component_id
    FROM ComponentAudit
    WHERE page_id = p_page_id 
      AND component_name = p_component_name
      AND component_type = p_component_type;
    
    IF NOT FOUND THEN
        INSERT INTO ComponentAudit (
            user_id, property_id, page_id, component_name, component_type
        ) VALUES (
            p_user_id, p_property_id, p_page_id, p_component_name, p_component_type
        ) RETURNING id INTO component_id;
    END IF;
    
    -- Track interaction
    INSERT INTO UserInteractionAudit (
        user_id, property_id, page_id, component_id, interaction_type,
        interaction_value, interaction_coordinates, session_id
    ) VALUES (
        p_user_id, p_property_id, p_page_id, component_id, p_interaction_type,
        p_interaction_value, p_coordinates, p_session_id
    ) RETURNING id INTO interaction_id;
    
    -- Update component interaction count
    UPDATE ComponentAudit
    SET interaction_count = interaction_count + 1,
        updated_at = NOW()
    WHERE id = component_id;
    
    RETURN interaction_id;
END;
$$ LANGUAGE plpgsql;

-- Function to track performance metrics
CREATE OR REPLACE FUNCTION track_performance_metrics(
    p_page_id UUID,
    p_metric_name VARCHAR(100),
    p_metric_value DECIMAL(10,3),
    p_metric_unit VARCHAR(20),
    p_metric_category VARCHAR(50)
)
RETURNS UUID AS $$
DECLARE
    metric_id UUID;
BEGIN
    INSERT INTO PagePerformanceMetrics (
        page_id, metric_name, metric_value, metric_unit, metric_category
    ) VALUES (
        p_page_id, p_metric_name, p_metric_value, p_metric_unit, p_metric_category
    ) RETURNING id INTO metric_id;
    
    RETURN metric_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get page analytics
CREATE OR REPLACE FUNCTION get_page_analytics(
    p_property_id INTEGER DEFAULT NULL,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
    page_name VARCHAR(255),
    page_type page_type_enum,
    total_views BIGINT,
    unique_users BIGINT,
    avg_load_time DECIMAL(10,2),
    avg_render_time DECIMAL(10,2),
    bounce_rate DECIMAL(5,2),
    conversion_rate DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pa.page_name,
        pa.page_type,
        COUNT(*)::BIGINT as total_views,
        COUNT(DISTINCT pa.user_id)::BIGINT as unique_users,
        AVG(pa.load_time_ms)::DECIMAL(10,2) as avg_load_time,
        AVG(pa.render_time_ms)::DECIMAL(10,2) as avg_render_time,
        ROUND(
            (COUNT(*) FILTER (WHERE pa.load_time_ms < 1000)::DECIMAL / COUNT(*)) * 100, 2
        ) as bounce_rate,
        ROUND(
            (COUNT(*) FILTER (WHERE pa.page_type IN ('booking', 'order', 'payment'))::DECIMAL / COUNT(*)) * 100, 2
        ) as conversion_rate
    FROM PageAudit pa
    WHERE (p_property_id IS NULL OR pa.property_id = p_property_id)
      AND pa.created_at BETWEEN p_start_date AND p_end_date
    GROUP BY pa.page_name, pa.page_type
    ORDER BY total_views DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get component analytics
CREATE OR REPLACE FUNCTION get_component_analytics(
    p_property_id INTEGER DEFAULT NULL,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
    component_name VARCHAR(255),
    component_type component_type_enum,
    total_interactions BIGINT,
    unique_users BIGINT,
    avg_performance_score DECIMAL(3,2),
    error_rate DECIMAL(5,2),
    most_common_interaction interaction_type_enum
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ca.component_name,
        ca.component_type,
        SUM(ca.interaction_count)::BIGINT as total_interactions,
        COUNT(DISTINCT ca.user_id)::BIGINT as unique_users,
        AVG(ca.performance_score)::DECIMAL(3,2) as avg_performance_score,
        ROUND(
            (SUM(ca.error_count)::DECIMAL / NULLIF(SUM(ca.interaction_count), 0)) * 100, 2
        ) as error_rate,
        (
            SELECT uia.interaction_type
            FROM UserInteractionAudit uia
            WHERE uia.component_id = ca.id
            GROUP BY uia.interaction_type
            ORDER BY COUNT(*) DESC
            LIMIT 1
        ) as most_common_interaction
    FROM ComponentAudit ca
    WHERE (p_property_id IS NULL OR ca.property_id = p_property_id)
      AND ca.created_at BETWEEN p_start_date AND p_end_date
    GROUP BY ca.component_name, ca.component_type, ca.id
    ORDER BY total_interactions DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get user behavior analytics
CREATE OR REPLACE FUNCTION get_user_behavior_analytics(
    p_property_id INTEGER DEFAULT NULL,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE (
    metric_name TEXT,
    metric_value BIGINT,
    description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'total_sessions'::TEXT,
        COUNT(*)::BIGINT,
        'Total user sessions'::TEXT
    FROM UserSessionTracking
    WHERE (p_property_id IS NULL OR property_id = p_property_id)
      AND session_start BETWEEN p_start_date AND p_end_date;
    
    RETURN QUERY
    SELECT 
        'avg_session_duration'::TEXT,
        ROUND(AVG(session_duration_ms) / 1000)::BIGINT,
        'Average session duration in seconds'::TEXT
    FROM UserSessionTracking
    WHERE (p_property_id IS NULL OR property_id = p_property_id)
      AND session_start BETWEEN p_start_date AND p_end_date
      AND session_duration_ms IS NOT NULL;
    
    RETURN QUERY
    SELECT 
        'total_page_views'::TEXT,
        COUNT(*)::BIGINT,
        'Total page views'::TEXT
    FROM PageAudit
    WHERE (p_property_id IS NULL OR property_id = p_property_id)
      AND created_at BETWEEN p_start_date AND p_end_date;
    
    RETURN QUERY
    SELECT 
        'total_interactions'::TEXT,
        COUNT(*)::BIGINT,
        'Total user interactions'::TEXT
    FROM UserInteractionAudit
    WHERE (p_property_id IS NULL OR property_id = p_property_id)
      AND created_at BETWEEN p_start_date AND p_end_date;
    
    RETURN QUERY
    SELECT 
        'unique_users'::TEXT,
        COUNT(DISTINCT user_id)::BIGINT,
        'Unique users'::TEXT
    FROM PageAudit
    WHERE (p_property_id IS NULL OR property_id = p_property_id)
      AND created_at BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX idx_page_audit_user ON PageAudit(user_id);
CREATE INDEX idx_page_audit_property ON PageAudit(property_id);
CREATE INDEX idx_page_audit_page_type ON PageAudit(page_type);
CREATE INDEX idx_page_audit_created_at ON PageAudit(created_at);
CREATE INDEX idx_page_audit_session ON PageAudit(session_id);
CREATE INDEX idx_component_audit_page ON ComponentAudit(page_id);
CREATE INDEX idx_component_audit_type ON ComponentAudit(component_type);
CREATE INDEX idx_user_interaction_audit_user ON UserInteractionAudit(user_id);
CREATE INDEX idx_user_interaction_audit_component ON UserInteractionAudit(component_id);
CREATE INDEX idx_user_interaction_audit_type ON UserInteractionAudit(interaction_type);
CREATE INDEX idx_user_interaction_audit_timestamp ON UserInteractionAudit(timestamp);
CREATE INDEX idx_page_performance_metrics_page ON PagePerformanceMetrics(page_id);
CREATE INDEX idx_component_performance_metrics_component ON ComponentPerformanceMetrics(component_id);
CREATE INDEX idx_user_session_tracking_user ON UserSessionTracking(user_id);
CREATE INDEX idx_user_session_tracking_property ON UserSessionTracking(property_id);
CREATE INDEX idx_user_session_tracking_session ON UserSessionTracking(session_id);

-- Enable RLS
ALTER TABLE PageAudit ENABLE ROW LEVEL SECURITY;
ALTER TABLE ComponentAudit ENABLE ROW LEVEL SECURITY;
ALTER TABLE UserInteractionAudit ENABLE ROW LEVEL SECURITY;
ALTER TABLE PagePerformanceMetrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ComponentPerformanceMetrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE UserSessionTracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow property staff to view page audits"
  ON PageAudit
  FOR SELECT
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Allow users to view their own page audits"
  ON PageAudit
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow property staff to view component audits"
  ON ComponentAudit
  FOR SELECT
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Allow users to view their own component audits"
  ON ComponentAudit
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow property staff to view interaction audits"
  ON UserInteractionAudit
  FOR SELECT
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Allow users to view their own interaction audits"
  ON UserInteractionAudit
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow property staff to view performance metrics"
  ON PagePerformanceMetrics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow property staff to view component performance metrics"
  ON ComponentPerformanceMetrics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow property staff to view session tracking"
  ON UserSessionTracking
  FOR SELECT
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Allow users to view their own session tracking"
  ON UserSessionTracking
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create updated_at triggers
CREATE TRIGGER update_page_audit_updated_at 
    BEFORE UPDATE ON PageAudit 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_component_audit_updated_at 
    BEFORE UPDATE ON ComponentAudit 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_session_tracking_updated_at 
    BEFORE UPDATE ON UserSessionTracking 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
