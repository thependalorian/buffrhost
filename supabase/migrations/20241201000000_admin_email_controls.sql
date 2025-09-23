-- Admin Email Controls Migration for Buffr Host
-- Creates tables and functions for manual email sending with booking-specific conflict detection

-- Create admin_manual_email_logs table
CREATE TABLE public.admin_manual_email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    email_data JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    error_message TEXT,
    is_queued BOOLEAN DEFAULT TRUE,
    queue_id UUID REFERENCES public.email_queue(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add is_manual column to email_queue table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_queue' AND column_name = 'is_manual') THEN
        ALTER TABLE public.email_queue ADD COLUMN is_manual BOOLEAN DEFAULT FALSE;
    END IF;
END
$$;

-- Create RLS policies for admin_manual_email_logs
ALTER TABLE public.admin_manual_email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view their own manual email logs" ON public.admin_manual_email_logs
FOR SELECT USING (auth.uid() = admin_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert manual email logs" ON public.admin_manual_email_logs
FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update their own manual email logs" ON public.admin_manual_email_logs
FOR UPDATE USING (auth.uid() = admin_id) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));