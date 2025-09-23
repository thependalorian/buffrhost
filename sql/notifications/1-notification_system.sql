-- Notification System
-- Comprehensive notification management for users, staff, and system alerts

-- Notification types enum
CREATE TYPE notification_type_enum AS ENUM (
    'email',
    'sms',
    'push',
    'in_app',
    'system',
    'marketing',
    'transactional',
    'reminder',
    'alert',
    'announcement'
);

-- Notification status enum
CREATE TYPE notification_status_enum AS ENUM (
    'pending',
    'sent',
    'delivered',
    'failed',
    'bounced',
    'opened',
    'clicked',
    'unsubscribed'
);

-- Notification priority enum
CREATE TYPE notification_priority_enum AS ENUM (
    'low',
    'normal',
    'high',
    'urgent',
    'critical'
);

-- Notification templates table
CREATE TABLE NotificationTemplates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name VARCHAR(255) NOT NULL UNIQUE,
    template_type notification_type_enum NOT NULL,
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

-- Notification channels table
CREATE TABLE NotificationChannels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_name VARCHAR(100) NOT NULL UNIQUE,
    channel_type notification_type_enum NOT NULL,
    provider VARCHAR(100) NOT NULL, -- 'sendgrid', 'twilio', 'firebase', 'custom'
    configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    rate_limit_per_minute INTEGER DEFAULT 100,
    rate_limit_per_hour INTEGER DEFAULT 1000,
    rate_limit_per_day INTEGER DEFAULT 10000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE Notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    property_id INTEGER REFERENCES HospitalityProperty(property_id),
    template_id UUID REFERENCES NotificationTemplates(id),
    channel_id UUID REFERENCES NotificationChannels(id),
    notification_type notification_type_enum NOT NULL,
    priority notification_priority_enum DEFAULT 'normal',
    subject VARCHAR(500),
    content TEXT NOT NULL,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    recipient_device_id TEXT,
    status notification_status_enum DEFAULT 'pending',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification preferences table
CREATE TABLE NotificationPreferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    property_id INTEGER REFERENCES HospitalityProperty(property_id),
    notification_type notification_type_enum NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    push_enabled BOOLEAN DEFAULT TRUE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, property_id, notification_type)
);

-- Notification delivery logs table
CREATE TABLE NotificationDeliveryLogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID REFERENCES Notifications(id) ON DELETE CASCADE,
    channel_id UUID REFERENCES NotificationChannels(id),
    provider_response JSONB,
    delivery_status notification_status_enum,
    error_code VARCHAR(50),
    error_message TEXT,
    delivery_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification campaigns table
CREATE TABLE NotificationCampaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type notification_type_enum NOT NULL,
    template_id UUID REFERENCES NotificationTemplates(id),
    target_audience JSONB DEFAULT '{}'::jsonb,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT
);

-- Function to send notification
CREATE OR REPLACE FUNCTION send_notification(
    p_user_id TEXT,
    p_property_id INTEGER,
    p_template_name VARCHAR(255),
    p_recipient_email VARCHAR(255),
    p_recipient_phone VARCHAR(20),
    p_variables JSONB DEFAULT '{}'::jsonb,
    p_priority notification_priority_enum DEFAULT 'normal',
    p_scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    template_record RECORD;
    channel_record RECORD;
    notification_id UUID;
    processed_content TEXT;
BEGIN
    -- Get template
    SELECT * INTO template_record
    FROM NotificationTemplates
    WHERE template_name = p_template_name AND is_active = TRUE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Template not found: %', p_template_name;
    END IF;
    
    -- Get appropriate channel
    SELECT * INTO channel_record
    FROM NotificationChannels
    WHERE channel_type = template_record.template_type 
      AND is_active = TRUE
    ORDER BY priority DESC
    LIMIT 1;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No active channel found for type: %', template_record.template_type;
    END IF;
    
    -- Process template content with variables
    processed_content := template_record.content_text;
    IF template_record.content_html IS NOT NULL THEN
        processed_content := template_record.content_html;
    END IF;
    
    -- Replace variables in content
    FOR key IN SELECT jsonb_object_keys(p_variables) LOOP
        processed_content := REPLACE(processed_content, '{{' || key || '}}', p_variables->>key);
    END LOOP;
    
    -- Create notification
    INSERT INTO Notifications (
        user_id, property_id, template_id, channel_id, notification_type,
        priority, subject, content, recipient_email, recipient_phone,
        scheduled_at
    ) VALUES (
        p_user_id, p_property_id, template_record.id, channel_record.id,
        template_record.template_type, p_priority, template_record.subject,
        processed_content, p_recipient_email, p_recipient_phone, p_scheduled_at
    ) RETURNING id INTO notification_id;
    
    -- Update template usage
    UPDATE NotificationTemplates
    SET usage_count = usage_count + 1,
        last_used_at = NOW()
    WHERE id = template_record.id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to process notification queue
CREATE OR REPLACE FUNCTION process_notification_queue()
RETURNS INTEGER AS $$
DECLARE
    notification_record RECORD;
    processed_count INTEGER := 0;
BEGIN
    -- Process pending notifications
    FOR notification_record IN
        SELECT * FROM Notifications
        WHERE status = 'pending'
          AND (scheduled_at IS NULL OR scheduled_at <= NOW())
        ORDER BY priority DESC, created_at ASC
        LIMIT 100
    LOOP
        -- Update status to sent (actual sending would be handled by application)
        UPDATE Notifications
        SET status = 'sent',
            sent_at = NOW(),
            updated_at = NOW()
        WHERE id = notification_record.id;
        
        processed_count := processed_count + 1;
    END LOOP;
    
    RETURN processed_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get notification statistics
CREATE OR REPLACE FUNCTION get_notification_stats(
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
        'total_notifications'::TEXT,
        COUNT(*)::BIGINT,
        'Total notifications sent'::TEXT
    FROM Notifications
    WHERE (p_property_id IS NULL OR property_id = p_property_id)
      AND created_at BETWEEN p_start_date AND p_end_date;
    
    RETURN QUERY
    SELECT 
        'delivered_notifications'::TEXT,
        COUNT(*)::BIGINT,
        'Successfully delivered notifications'::TEXT
    FROM Notifications
    WHERE (p_property_id IS NULL OR property_id = p_property_id)
      AND created_at BETWEEN p_start_date AND p_end_date
      AND status IN ('delivered', 'opened', 'clicked');
    
    RETURN QUERY
    SELECT 
        'failed_notifications'::TEXT,
        COUNT(*)::BIGINT,
        'Failed notifications'::TEXT
    FROM Notifications
    WHERE (p_property_id IS NULL OR property_id = p_property_id)
      AND created_at BETWEEN p_start_date AND p_end_date
      AND status = 'failed';
    
    RETURN QUERY
    SELECT 
        'open_rate'::TEXT,
        ROUND(
            (COUNT(*) FILTER (WHERE status IN ('opened', 'clicked'))::DECIMAL / 
             NULLIF(COUNT(*) FILTER (WHERE status IN ('delivered', 'opened', 'clicked')), 0)) * 100
        )::BIGINT,
        'Email open rate percentage'::TEXT
    FROM Notifications
    WHERE (p_property_id IS NULL OR property_id = p_property_id)
      AND created_at BETWEEN p_start_date AND p_end_date
      AND notification_type = 'email';
END;
$$ LANGUAGE plpgsql;

-- Insert default notification templates
INSERT INTO NotificationTemplates (template_name, template_type, subject, content_text, variables) VALUES
('welcome_email', 'email', 'Welcome to {{property_name}}!', 'Welcome {{customer_name}} to {{property_name}}. We are excited to have you!', '["property_name", "customer_name"]'),
('booking_confirmation', 'email', 'Booking Confirmation - {{property_name}}', 'Your booking has been confirmed for {{booking_date}} at {{property_name}}.', '["property_name", "booking_date", "booking_reference"]'),
('order_confirmation', 'email', 'Order Confirmation - {{property_name}}', 'Your order #{{order_number}} has been confirmed and will be ready in {{preparation_time}} minutes.', '["property_name", "order_number", "preparation_time"]'),
('payment_receipt', 'email', 'Payment Receipt - {{property_name}}', 'Thank you for your payment of {{amount}} for {{service_type}}.', '["property_name", "amount", "service_type"]'),
('staff_schedule', 'in_app', 'Schedule Update', 'Your schedule has been updated for {{schedule_date}}.', '["schedule_date", "shift_time"]'),
('system_alert', 'system', 'System Alert', '{{alert_message}} - {{property_name}}', '["alert_message", "property_name"]');

-- Insert default notification channels
INSERT INTO NotificationChannels (channel_name, channel_type, provider, configuration, rate_limit_per_minute, rate_limit_per_hour, rate_limit_per_day) VALUES
('email_primary', 'email', 'sendgrid', '{"api_key": "encrypted_key", "from_email": "noreply@buffrhost.com"}', 100, 1000, 10000),
('sms_primary', 'sms', 'twilio', '{"account_sid": "encrypted_sid", "auth_token": "encrypted_token"}', 10, 100, 1000),
('push_primary', 'push', 'firebase', '{"server_key": "encrypted_key", "project_id": "buffrhost"}', 1000, 10000, 100000),
('in_app_primary', 'in_app', 'internal', '{"queue_name": "notifications"}', 10000, 100000, 1000000);

-- Create indexes for performance
CREATE INDEX idx_notifications_user ON Notifications(user_id);
CREATE INDEX idx_notifications_property ON Notifications(property_id);
CREATE INDEX idx_notifications_status ON Notifications(status);
CREATE INDEX idx_notifications_type ON Notifications(notification_type);
CREATE INDEX idx_notifications_created_at ON Notifications(created_at);
CREATE INDEX idx_notifications_scheduled_at ON Notifications(scheduled_at);
CREATE INDEX idx_notification_preferences_user ON NotificationPreferences(user_id);
CREATE INDEX idx_notification_delivery_logs_notification ON NotificationDeliveryLogs(notification_id);
CREATE INDEX idx_notification_campaigns_status ON NotificationCampaigns(status);

-- Enable RLS
ALTER TABLE NotificationTemplates ENABLE ROW LEVEL SECURITY;
ALTER TABLE NotificationChannels ENABLE ROW LEVEL SECURITY;
ALTER TABLE Notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE NotificationPreferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE NotificationDeliveryLogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE NotificationCampaigns ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow property staff to manage notifications"
  ON Notifications
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Allow users to view their own notifications"
  ON Notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow property staff to manage templates"
  ON NotificationTemplates
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow property staff to manage channels"
  ON NotificationChannels
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to manage their preferences"
  ON NotificationPreferences
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create updated_at triggers
CREATE TRIGGER update_notification_templates_updated_at 
    BEFORE UPDATE ON NotificationTemplates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_channels_updated_at 
    BEFORE UPDATE ON NotificationChannels 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON Notifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at 
    BEFORE UPDATE ON NotificationPreferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_campaigns_updated_at 
    BEFORE UPDATE ON NotificationCampaigns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
