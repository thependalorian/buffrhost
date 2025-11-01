-- Migration: 09_custom_communication_tables.sql
-- Custom communication integration for hospitality automation
-- Enables secure, direct OAuth access to email, calendar, and messaging tools

-- Property communication service authorizations
CREATE TABLE IF NOT EXISTS property_communication_auth (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    service_provider VARCHAR(50) NOT NULL, -- 'gmail', 'outlook', 'google_calendar', 'twilio_whatsapp'
    auth_status VARCHAR(20) DEFAULT 'pending' CHECK (auth_status IN ('pending', 'authorized', 'expired', 'revoked')),
    encrypted_tokens JSONB, -- Encrypted OAuth tokens
    scopes TEXT[], -- Authorized permissions
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, service_provider)
);

-- Automated communication logs
CREATE TABLE IF NOT EXISTS communication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    service_provider VARCHAR(50) NOT NULL,
    channel_type VARCHAR(20) NOT NULL, -- 'email', 'whatsapp', 'calendar'
    operation_type VARCHAR(50) NOT NULL, -- 'send_email', 'create_event', 'send_message'
    recipient VARCHAR(255),
    subject TEXT,
    content_preview TEXT,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'pending')),
    error_message TEXT,
    external_message_id VARCHAR(255), -- Provider's message ID (Gmail ID, WhatsApp SID, etc.)
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation workflow definitions
CREATE TABLE IF NOT EXISTS automation_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    workflow_name VARCHAR(255) NOT NULL,
    trigger_event VARCHAR(100) NOT NULL, -- 'booking_confirmed', 'checkin_reminder', 'maintenance_scheduled'
    actions JSONB NOT NULL, -- Array of automated actions with custom tools
    is_active BOOLEAN DEFAULT true,
    execution_count INTEGER DEFAULT 0,
    last_executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow execution logs
CREATE TABLE IF NOT EXISTS workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES automation_workflows(id),
    property_id UUID NOT NULL REFERENCES properties(id),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    trigger_event VARCHAR(100) NOT NULL,
    trigger_data JSONB, -- Event data that triggered the workflow
    execution_status VARCHAR(20) DEFAULT 'running' CHECK (execution_status IN ('running', 'completed', 'failed', 'partial')),
    executed_actions JSONB, -- Results of each action execution
    error_details JSONB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER
);

-- Communication templates
CREATE TABLE IF NOT EXISTS communication_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    template_name VARCHAR(255) NOT NULL,
    channel_type VARCHAR(20) NOT NULL CHECK (channel_type IN ('email', 'whatsapp', 'calendar')),
    template_type VARCHAR(50) NOT NULL, -- 'booking_confirmation', 'checkin_reminder', 'maintenance_alert'
    subject_template TEXT, -- For emails
    content_template TEXT NOT NULL,
    media_attachments JSONB, -- For WhatsApp images, email attachments
    variables JSONB DEFAULT '{}', -- Available template variables
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communication service usage analytics
CREATE TABLE IF NOT EXISTS communication_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    service_provider VARCHAR(50) NOT NULL,
    channel_type VARCHAR(20) NOT NULL,
    operation_type VARCHAR(50) NOT NULL,
    success BOOLEAN DEFAULT true,
    response_time_ms INTEGER,
    cost_cents INTEGER, -- API cost tracking
    error_category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_comm_auth_property ON property_communication_auth(property_id);
CREATE INDEX IF NOT EXISTS idx_comm_auth_provider ON property_communication_auth(service_provider);
CREATE INDEX IF NOT EXISTS idx_comm_auth_status ON property_communication_auth(auth_status);

CREATE INDEX IF NOT EXISTS idx_comm_logs_property ON communication_logs(property_id);
CREATE INDEX IF NOT EXISTS idx_comm_logs_created ON communication_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_comm_logs_provider ON communication_logs(service_provider);

CREATE INDEX IF NOT EXISTS idx_automation_workflows_property ON automation_workflows(property_id);
CREATE INDEX IF NOT EXISTS idx_automation_workflows_trigger ON automation_workflows(trigger_event);
CREATE INDEX IF NOT EXISTS idx_automation_workflows_active ON automation_workflows(is_active);

CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_started ON workflow_executions(started_at);

CREATE INDEX IF NOT EXISTS idx_comm_templates_property ON communication_templates(property_id);
CREATE INDEX IF NOT EXISTS idx_comm_templates_type ON communication_templates(template_type);

CREATE INDEX IF NOT EXISTS idx_comm_usage_property ON communication_usage(property_id);
CREATE INDEX IF NOT EXISTS idx_comm_usage_created ON communication_usage(created_at);

-- Triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_communication_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_property_comm_auth_updated_at BEFORE UPDATE ON property_communication_auth FOR EACH ROW EXECUTE FUNCTION update_communication_updated_at_column();
CREATE TRIGGER update_automation_workflows_updated_at BEFORE UPDATE ON automation_workflows FOR EACH ROW EXECUTE FUNCTION update_communication_updated_at_column();
CREATE TRIGGER update_comm_templates_updated_at BEFORE UPDATE ON communication_templates FOR EACH ROW EXECUTE FUNCTION update_communication_updated_at_column();

-- Default automation workflows (seeded data)
INSERT INTO automation_workflows (property_id, tenant_id, workflow_name, trigger_event, actions, is_active) VALUES
-- Default workflows for new properties (using placeholder property_id that will be updated)
('00000000-0000-0000-0000-000000000000'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'Guest Booking Confirmation', 'booking_confirmed',
 '[{"tool": "gmail.send_email", "config": {"template": "booking_confirmation"}}, {"tool": "google_calendar.create_event", "config": {"template": "booking_event"}}, {"tool": "twilio.send_whatsapp", "config": {"template": "booking_welcome"}}]',
 true),

('00000000-0000-0000-0000-000000000000'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'Check-in Reminder (24h)', 'checkin_reminder_24h',
 '[{"tool": "twilio.send_whatsapp", "config": {"template": "checkin_reminder"}}, {"tool": "gmail.send_email", "config": {"template": "checkin_details"}}]',
 true),

('00000000-0000-0000-0000-000000000000'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'Maintenance Coordination', 'maintenance_scheduled',
 '[{"tool": "google_calendar.create_event", "config": {"template": "maintenance_event"}}, {"tool": "gmail.send_email", "config": {"template": "maintenance_notification"}}]',
 true);

-- Default communication templates
INSERT INTO communication_templates (property_id, tenant_id, template_name, channel_type, template_type, subject_template, content_template, variables, is_active) VALUES
-- Email templates
('00000000-0000-0000-0000-000000000000'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'Booking Confirmation Email', 'email', 'booking_confirmation',
 'Your booking at {{property.name}} is confirmed!',
 'Dear {{guest.name}},

Welcome to {{property.name}}! Your booking has been confirmed.

📅 Check-in: {{booking.checkin_date}} at {{booking.checkin_time}}
📅 Check-out: {{booking.checkout_date}} at {{booking.checkout_time}}
🏨 Room: {{booking.room_number}}
👥 Guests: {{booking.guest_count}}

Property Address: {{property.address}}
Phone: {{property.phone}}

We look forward to welcoming you!

Best regards,
{{property.name}} Team',
 '{"property": ["name", "address", "phone"], "guest": ["name"], "booking": ["checkin_date", "checkin_time", "checkout_date", "checkout_time", "room_number", "guest_count"]}',
 true),

-- WhatsApp templates
('00000000-0000-0000-0000-000000000000'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'Booking Welcome WhatsApp', 'whatsapp', 'booking_welcome',
 null,
 '🎉 Welcome to {{property.name}}, {{guest.name}}!

✅ Your booking is confirmed!
📅 Check-in: {{booking.checkin_date}}
🏨 Room: {{booking.room_number}}

📍 {{property.address}}
📞 {{property.phone}}

Need anything? Just reply here! 👋',
 '{"property": ["name", "address", "phone"], "guest": ["name"], "booking": ["checkin_date", "room_number"]}',
 true),

-- Calendar templates
('00000000-0000-0000-0000-000000000000'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'Booking Event Calendar', 'calendar', 'booking_event',
 null,
 'Guest Stay: {{guest.name}}
Room {{booking.room_number}}
{{booking.guest_count}} guests
Check-out: {{booking.checkout_date}}

Contact: {{property.phone}}',
 '{"property": ["phone"], "guest": ["name"], "booking": ["room_number", "guest_count", "checkout_date"]}',
 true);

-- Comments for documentation
COMMENT ON TABLE property_communication_auth IS 'Property owner authorizations for custom communication services (Gmail, Outlook, Calendar, WhatsApp)';
COMMENT ON TABLE communication_logs IS 'Audit log of all automated communications sent via custom tools';
COMMENT ON TABLE automation_workflows IS 'Automated workflow definitions triggered by hospitality events';
COMMENT ON TABLE workflow_executions IS 'Execution logs and results for automation workflows';
COMMENT ON TABLE communication_templates IS 'Reusable templates for emails, WhatsApp messages, and calendar events';
COMMENT ON TABLE communication_usage IS 'Analytics and monitoring for custom communication tool usage and performance';