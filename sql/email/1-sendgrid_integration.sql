-- SendGrid Email Integration
-- Comprehensive email system with SendGrid API integration

-- SendGrid configuration table
CREATE TABLE SendGridConfig (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_encrypted TEXT NOT NULL,
    api_key_hash TEXT NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    from_name VARCHAR(255) NOT NULL,
    reply_to_email VARCHAR(255),
    reply_to_name VARCHAR(255),
    webhook_public_key TEXT,
    webhook_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    environment VARCHAR(20) DEFAULT 'production' CHECK (environment IN ('sandbox', 'production')),
    rate_limit_per_minute INTEGER DEFAULT 100,
    rate_limit_per_hour INTEGER DEFAULT 1000,
    rate_limit_per_day INTEGER DEFAULT 10000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT,
    updated_by TEXT
);

-- SendGrid templates table
CREATE TABLE SendGridTemplates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id TEXT NOT NULL UNIQUE,
    template_name VARCHAR(255) NOT NULL,
    template_type VARCHAR(50) NOT NULL CHECK (template_type IN ('transactional', 'marketing', 'automated')),
    category VARCHAR(100),
    subject VARCHAR(500),
    content_html TEXT,
    content_text TEXT,
    variables JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT,
    updated_by TEXT
);

-- Email campaigns table
CREATE TABLE EmailCampaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(50) NOT NULL,
    template_id UUID REFERENCES SendGridTemplates(id),
    target_audience JSONB DEFAULT '{}'::jsonb,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    bounced_count INTEGER DEFAULT 0,
    unsubscribed_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT
);

-- Email suppression list table
CREATE TABLE EmailSuppressionList (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    suppression_type VARCHAR(50) NOT NULL CHECK (suppression_type IN ('bounce', 'spam', 'unsubscribe', 'block')),
    reason TEXT,
    suppressed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email reputation monitoring table
CREATE TABLE EmailReputationMonitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain VARCHAR(255) NOT NULL,
    reputation_score DECIMAL(3,2),
    bounce_rate DECIMAL(5,2),
    complaint_rate DECIMAL(5,2),
    spam_trap_hits INTEGER DEFAULT 0,
    blacklist_status BOOLEAN DEFAULT FALSE,
    last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email webhook events table
CREATE TABLE EmailWebhookEvents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    sg_message_id TEXT,
    sg_event_id TEXT,
    sg_template_id TEXT,
    sg_template_name TEXT,
    user_id TEXT,
    property_id INTEGER REFERENCES HospitalityProperty(property_id),
    ip_address INET,
    user_agent TEXT,
    url TEXT,
    reason TEXT,
    status VARCHAR(50),
    response TEXT,
    attempt INTEGER,
    category TEXT[],
    unique_args JSONB,
    marketing_campaign_id TEXT,
    marketing_campaign_name TEXT,
    raw_payload JSONB,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to send email via SendGrid
CREATE OR REPLACE FUNCTION send_sendgrid_email(
    p_to_email VARCHAR(255),
    p_to_name VARCHAR(255) DEFAULT NULL,
    p_template_id TEXT DEFAULT NULL,
    p_subject VARCHAR(500) DEFAULT NULL,
    p_content_html TEXT DEFAULT NULL,
    p_content_text TEXT DEFAULT NULL,
    p_variables JSONB DEFAULT '{}'::jsonb,
    p_property_id INTEGER DEFAULT NULL,
    p_user_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    config_record RECORD;
    email_id UUID;
BEGIN
    -- Get active SendGrid configuration
    SELECT * INTO config_record
    FROM SendGridConfig
    WHERE is_active = TRUE
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No active SendGrid configuration found';
    END IF;
    
    -- Check if email is in suppression list
    IF EXISTS (
        SELECT 1 FROM EmailSuppressionList 
        WHERE email = p_to_email AND is_active = TRUE
    ) THEN
        RAISE EXCEPTION 'Email % is in suppression list', p_to_email;
    END IF;
    
    -- Create email record (actual sending would be handled by application)
    INSERT INTO Notifications (
        user_id, property_id, notification_type, subject, content,
        recipient_email, status, metadata
    ) VALUES (
        p_user_id, p_property_id, 'email', p_subject, 
        COALESCE(p_content_html, p_content_text), p_to_email, 'pending',
        jsonb_build_object(
            'template_id', p_template_id,
            'variables', p_variables,
            'sendgrid_config_id', config_record.id
        )
    ) RETURNING id INTO email_id;
    
    RETURN email_id;
END;
$$ LANGUAGE plpgsql;

-- Function to process email webhook
CREATE OR REPLACE FUNCTION process_email_webhook(
    p_event_type VARCHAR(50),
    p_email VARCHAR(255),
    p_timestamp TIMESTAMP WITH TIME ZONE,
    p_sg_message_id TEXT,
    p_sg_event_id TEXT,
    p_sg_template_id TEXT,
    p_sg_template_name TEXT,
    p_user_id TEXT,
    p_property_id INTEGER,
    p_ip_address INET,
    p_user_agent TEXT,
    p_url TEXT,
    p_reason TEXT,
    p_status VARCHAR(50),
    p_response TEXT,
    p_attempt INTEGER,
    p_category TEXT[],
    p_unique_args JSONB,
    p_marketing_campaign_id TEXT,
    p_marketing_campaign_name TEXT,
    p_raw_payload JSONB
)
RETURNS UUID AS $$
DECLARE
    webhook_id UUID;
BEGIN
    -- Insert webhook event
    INSERT INTO EmailWebhookEvents (
        event_type, email, timestamp, sg_message_id, sg_event_id,
        sg_template_id, sg_template_name, user_id, property_id,
        ip_address, user_agent, url, reason, status, response,
        attempt, category, unique_args, marketing_campaign_id,
        marketing_campaign_name, raw_payload
    ) VALUES (
        p_event_type, p_email, p_timestamp, p_sg_message_id, p_sg_event_id,
        p_sg_template_id, p_sg_template_name, p_user_id, p_property_id,
        p_ip_address, p_user_agent, p_url, p_reason, p_status, p_response,
        p_attempt, p_category, p_unique_args, p_marketing_campaign_id,
        p_marketing_campaign_name, p_raw_payload
    ) RETURNING id INTO webhook_id;
    
    -- Handle specific event types
    CASE p_event_type
        WHEN 'bounce' THEN
            -- Add to suppression list
            INSERT INTO EmailSuppressionList (email, suppression_type, reason)
            VALUES (p_email, 'bounce', p_reason)
            ON CONFLICT (email) DO UPDATE SET
                suppression_type = 'bounce',
                reason = p_reason,
                suppressed_at = NOW();
                
        WHEN 'spam' THEN
            -- Add to suppression list
            INSERT INTO EmailSuppressionList (email, suppression_type, reason)
            VALUES (p_email, 'spam', p_reason)
            ON CONFLICT (email) DO UPDATE SET
                suppression_type = 'spam',
                reason = p_reason,
                suppressed_at = NOW();
                
        WHEN 'unsubscribe' THEN
            -- Add to suppression list
            INSERT INTO EmailSuppressionList (email, suppression_type, reason)
            VALUES (p_email, 'unsubscribe', p_reason)
            ON CONFLICT (email) DO UPDATE SET
                suppression_type = 'unsubscribe',
                reason = p_reason,
                suppressed_at = NOW();
    END CASE;
    
    RETURN webhook_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get email statistics
CREATE OR REPLACE FUNCTION get_email_stats(
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
        'total_emails_sent'::TEXT,
        COUNT(*)::BIGINT,
        'Total emails sent'::TEXT
    FROM EmailWebhookEvents
    WHERE (p_property_id IS NULL OR property_id = p_property_id)
      AND timestamp BETWEEN p_start_date AND p_end_date
      AND event_type = 'processed';
    
    RETURN QUERY
    SELECT 
        'delivered_emails'::TEXT,
        COUNT(*)::BIGINT,
        'Successfully delivered emails'::TEXT
    FROM EmailWebhookEvents
    WHERE (p_property_id IS NULL OR property_id = p_property_id)
      AND timestamp BETWEEN p_start_date AND p_end_date
      AND event_type = 'delivered';
    
    RETURN QUERY
    SELECT 
        'opened_emails'::TEXT,
        COUNT(*)::BIGINT,
        'Emails opened by recipients'::TEXT
    FROM EmailWebhookEvents
    WHERE (p_property_id IS NULL OR property_id = p_property_id)
      AND timestamp BETWEEN p_start_date AND p_end_date
      AND event_type = 'open';
    
    RETURN QUERY
    SELECT 
        'clicked_emails'::TEXT,
        COUNT(*)::BIGINT,
        'Emails with link clicks'::TEXT
    FROM EmailWebhookEvents
    WHERE (p_property_id IS NULL OR property_id = p_property_id)
      AND timestamp BETWEEN p_start_date AND p_end_date
      AND event_type = 'click';
    
    RETURN QUERY
    SELECT 
        'bounced_emails'::TEXT,
        COUNT(*)::BIGINT,
        'Bounced emails'::TEXT
    FROM EmailWebhookEvents
    WHERE (p_property_id IS NULL OR property_id = p_property_id)
      AND timestamp BETWEEN p_start_date AND p_end_date
      AND event_type = 'bounce';
    
    RETURN QUERY
    SELECT 
        'spam_complaints'::TEXT,
        COUNT(*)::BIGINT,
        'Spam complaints received'::TEXT
    FROM EmailWebhookEvents
    WHERE (p_property_id IS NULL OR property_id = p_property_id)
      AND timestamp BETWEEN p_start_date AND p_end_date
      AND event_type = 'spamreport';
    
    RETURN QUERY
    SELECT 
        'unsubscribes'::TEXT,
        COUNT(*)::BIGINT,
        'Unsubscribe requests'::TEXT
    FROM EmailWebhookEvents
    WHERE (p_property_id IS NULL OR property_id = p_property_id)
      AND timestamp BETWEEN p_start_date AND p_end_date
      AND event_type = 'unsubscribe';
END;
$$ LANGUAGE plpgsql;

-- Function to check email reputation
CREATE OR REPLACE FUNCTION check_email_reputation(p_domain VARCHAR(255))
RETURNS TABLE (
    domain VARCHAR(255),
    reputation_score DECIMAL(3,2),
    bounce_rate DECIMAL(5,2),
    complaint_rate DECIMAL(5,2),
    blacklist_status BOOLEAN,
    last_checked_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        erm.domain,
        erm.reputation_score,
        erm.bounce_rate,
        erm.complaint_rate,
        erm.blacklist_status,
        erm.last_checked_at
    FROM EmailReputationMonitoring erm
    WHERE erm.domain = p_domain
    ORDER BY erm.last_checked_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Insert default SendGrid configuration
INSERT INTO SendGridConfig (api_key_encrypted, api_key_hash, from_email, from_name, environment) VALUES
('encrypted_api_key_here', 'hashed_api_key_here', 'noreply@buffrhost.com', 'Buffr Host', 'production');

-- Insert default email templates
INSERT INTO SendGridTemplates (template_id, template_name, template_type, subject, content_html, content_text, variables) VALUES
('d-1234567890', 'welcome_email', 'transactional', 'Welcome to {{property_name}}!', 
 '<h1>Welcome {{customer_name}}!</h1><p>Thank you for choosing {{property_name}}.</p>',
 'Welcome {{customer_name}}! Thank you for choosing {{property_name}}.',
 '["property_name", "customer_name"]'),
('d-1234567891', 'booking_confirmation', 'transactional', 'Booking Confirmation - {{property_name}}',
 '<h1>Booking Confirmed</h1><p>Your booking for {{booking_date}} has been confirmed.</p>',
 'Your booking for {{booking_date}} has been confirmed.',
 '["property_name", "booking_date", "booking_reference"]'),
('d-1234567892', 'order_confirmation', 'transactional', 'Order Confirmation - {{property_name}}',
 '<h1>Order Confirmed</h1><p>Your order #{{order_number}} has been confirmed.</p>',
 'Your order #{{order_number}} has been confirmed.',
 '["property_name", "order_number", "preparation_time"]');

-- Create indexes for performance
CREATE INDEX idx_sendgrid_config_active ON SendGridConfig(is_active);
CREATE INDEX idx_sendgrid_templates_active ON SendGridTemplates(is_active);
CREATE INDEX idx_sendgrid_templates_type ON SendGridTemplates(template_type);
CREATE INDEX idx_email_campaigns_status ON EmailCampaigns(status);
CREATE INDEX idx_email_campaigns_scheduled ON EmailCampaigns(scheduled_at);
CREATE INDEX idx_email_suppression_email ON EmailSuppressionList(email);
CREATE INDEX idx_email_suppression_type ON EmailSuppressionList(suppression_type);
CREATE INDEX idx_email_webhook_events_email ON EmailWebhookEvents(email);
CREATE INDEX idx_email_webhook_events_type ON EmailWebhookEvents(event_type);
CREATE INDEX idx_email_webhook_events_timestamp ON EmailWebhookEvents(timestamp);
CREATE INDEX idx_email_webhook_events_property ON EmailWebhookEvents(property_id);
CREATE INDEX idx_email_reputation_domain ON EmailReputationMonitoring(domain);

-- Enable RLS
ALTER TABLE SendGridConfig ENABLE ROW LEVEL SECURITY;
ALTER TABLE SendGridTemplates ENABLE ROW LEVEL SECURITY;
ALTER TABLE EmailCampaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE EmailSuppressionList ENABLE ROW LEVEL SECURITY;
ALTER TABLE EmailReputationMonitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE EmailWebhookEvents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow authenticated users to manage SendGrid config"
  ON SendGridConfig
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage templates"
  ON SendGridTemplates
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow property staff to manage campaigns"
  ON EmailCampaigns
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Allow system to manage suppression list"
  ON EmailSuppressionList
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow system to manage reputation monitoring"
  ON EmailReputationMonitoring
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow property staff to view webhook events"
  ON EmailWebhookEvents
  FOR SELECT
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

-- Create updated_at triggers
CREATE TRIGGER update_sendgrid_config_updated_at 
    BEFORE UPDATE ON SendGridConfig 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sendgrid_templates_updated_at 
    BEFORE UPDATE ON SendGridTemplates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at 
    BEFORE UPDATE ON EmailCampaigns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_reputation_monitoring_updated_at 
    BEFORE UPDATE ON EmailReputationMonitoring 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
